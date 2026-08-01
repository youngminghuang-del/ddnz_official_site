import type { IncomingMessage, ServerResponse } from 'node:http';
import type { Plugin } from 'vite';

const DATABASES = {
  insights: '366eac33261880f7b7fbe903f189eca3',
  topics: '76917d19580c4440931b07d3e032aa83',
  evidence: '989ba0dbe63143a494f70a45b150d3eb',
  audits: '6e03429a3778451d990eb05dae5d9249',
} as const;

type NotionPage = {
  id: string;
  url?: string;
  cover?: any;
  created_time: string;
  last_edited_time: string;
  properties: Record<string, any>;
};

type CacheEntry = {
  expiresAt: number;
  payload: unknown;
};

type DatabaseSchema = {
  id: string;
  properties: Record<string, any>;
};

type CandidateDraft = {
  title: string;
  leadGoal: string;
  productCategory: string;
  productSubcategory: string;
  audienceMarket: string;
  searchIntent: string;
  primaryQuery: string;
  coreAngle: string;
  contentType: string;
  candidateScore: number;
  evidencePlan: string;
  citationAsset: string;
  primaryCTA: string;
};

type WorkflowPayload = Awaited<ReturnType<typeof buildPayload>>;

let cache: CacheEntry | null = null;

const AUTOMATION_MAX_STATUS = 'Domain Review';
const WORKFLOW_WRITE_NOTICE =
  '自动化只会创建候选、研究请求和草稿请求，绝不会设置 Approved、Scheduled 或 Published。';

const normalizeForMatch = (value: string) =>
  value
    .toLowerCase()
    .replace(/[\s\W_]+/gu, ' ')
    .trim();

const stableTopicKey = (candidate: Omit<CandidateDraft, 'candidateScore' | 'evidencePlan' | 'citationAsset' | 'primaryCTA' | 'title' | 'contentType'>) =>
  [
    candidate.leadGoal,
    candidate.productCategory,
    candidate.productSubcategory,
    candidate.audienceMarket,
    candidate.searchIntent,
    candidate.coreAngle,
  ].join('｜');

const notionHeaders = (apiKey: string) => ({
  Authorization: `Bearer ${apiKey}`,
  'Notion-Version': '2022-06-28',
  'Content-Type': 'application/json',
});

async function notionFetch(
  apiKey: string,
  endpoint: string,
  options: { method?: string; body?: unknown } = {},
) {
  const response = await fetch(`https://api.notion.com${endpoint}`, {
    method: options.method || 'GET',
    headers: notionHeaders(apiKey),
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Notion API ${response.status}: ${detail.slice(0, 500)}`);
  }
  return response.json();
}

const plainText = (items: any[] = []) =>
  items.map((item) => item?.plain_text || '').join('').trim();

const propertyValue = (property: any): string => {
  if (!property) return '';
  if (property.type === 'title') return plainText(property.title);
  if (property.type === 'rich_text') return plainText(property.rich_text);
  if (property.type === 'select') return property.select?.name || '';
  if (property.type === 'status') return property.status?.name || '';
  if (property.type === 'multi_select') {
    return (property.multi_select || []).map((item: any) => item.name).join(', ');
  }
  if (property.type === 'url') return property.url || '';
  return '';
};

const dateValue = (property: any) =>
  property?.type === 'date' ? property.date?.start || '' : '';

const numberValue = (property: any) =>
  property?.type === 'number' && typeof property.number === 'number'
    ? property.number
    : null;

const peopleValue = (property: any): string[] =>
  property?.type === 'people'
    ? (property.people || [])
        .map((person: any) => person.name || person.person?.email || '')
        .filter(Boolean)
    : [];

const relationCount = (property: any) =>
  property?.type === 'relation' ? (property.relation || []).length : 0;

const relationIds = (property: any): string[] =>
  property?.type === 'relation'
    ? (property.relation || []).map((item: any) => item.id).filter(Boolean)
    : [];

const pageUrl = (page: NotionPage) =>
  page.url || `https://www.notion.so/${page.id.replaceAll('-', '')}`;

async function queryDatabase(apiKey: string, databaseId: string) {
  const pages: NotionPage[] = [];
  let cursor: string | undefined;

  do {
    const result = await notionFetch(apiKey, `/v1/databases/${databaseId}/query`, {
      method: 'POST',
      body: {
        page_size: 100,
        ...(cursor ? { start_cursor: cursor } : {}),
      },
    });
    pages.push(...result.results);
    cursor = result.has_more ? result.next_cursor : undefined;
  } while (cursor);

  return pages;
}

async function databaseSchema(apiKey: string, databaseId: string) {
  return (await notionFetch(apiKey, `/v1/databases/${databaseId}`)) as DatabaseSchema;
}

/**
 * Notion databases are user-editable. All writes below are built from the live
 * schema, rather than assuming a property or a select option still exists.
 * This keeps the local generator from silently producing half-linked records.
 */
function requireProperty(schema: DatabaseSchema, name: string) {
  const property = schema.properties[name];
  if (!property) {
    throw new Error(`Notion 数据库缺少“${name}”字段。请先按内容治理模板补齐字段，再重试。`);
  }
  return property;
}

function selectProperty(schema: DatabaseSchema, name: string, value: string) {
  const property = requireProperty(schema, name);
  if (!['select', 'status'].includes(property.type)) {
    throw new Error(`Notion 字段“${name}”必须是 Select 或 Status，当前为 ${property.type}。`);
  }
  const options = property[property.type]?.options || [];
  if (!options.some((option: any) => option.name === value)) {
    throw new Error(`Notion 字段“${name}”没有“${value}”选项。请先在 Notion 添加该选项，再重试。`);
  }
  return property.type === 'status'
    ? { status: { name: value } }
    : { select: { name: value } };
}

function titleProperty(schema: DatabaseSchema, preferred: string, value: string) {
  const property = schema.properties[preferred] || Object.values(schema.properties).find((item: any) => item.type === 'title');
  if (!property) throw new Error('Notion 数据库缺少 Title 字段。');
  const name = Object.entries(schema.properties).find(([, item]) => item === property)?.[0];
  if (!name) throw new Error('无法识别 Notion Title 字段。');
  return { [name]: { title: [{ type: 'text', text: { content: value.slice(0, 1900) } }] } };
}

function richTextProperty(schema: DatabaseSchema, name: string, value: string) {
  const property = schema.properties[name];
  if (!property) return {};
  if (property.type !== 'rich_text') {
    throw new Error(`Notion 字段“${name}”必须是 Rich text，当前为 ${property.type}。`);
  }
  return {
    [name]: {
      rich_text: value
        ? [{ type: 'text', text: { content: value.slice(0, 1900) } }]
        : [],
    },
  };
}

function numberProperty(schema: DatabaseSchema, name: string, value: number) {
  const property = schema.properties[name];
  if (!property) return {};
  if (property.type !== 'number') {
    throw new Error(`Notion 字段“${name}”必须是 Number，当前为 ${property.type}。`);
  }
  return { [name]: { number: value } };
}

function relationProperty(schema: DatabaseSchema, name: string, ids: string[]) {
  const property = schema.properties[name];
  if (!property) return {};
  if (property.type !== 'relation') {
    throw new Error(`Notion 字段“${name}”必须是 Relation，当前为 ${property.type}。`);
  }
  return { [name]: { relation: ids.map((id) => ({ id })) } };
}

function dateProperty(schema: DatabaseSchema, name: string, value: string) {
  const property = schema.properties[name];
  if (!property) return {};
  if (property.type !== 'date') {
    throw new Error(`Notion 字段“${name}”必须是 Date，当前为 ${property.type}。`);
  }
  return { [name]: { date: { start: value } } };
}

function textOrSelectProperty(schema: DatabaseSchema, name: string, value: string) {
  const property = schema.properties[name];
  if (!property) return {};
  if (property.type === 'select' || property.type === 'status') {
    return { [name]: selectProperty(schema, name, value) };
  }
  if (property.type === 'rich_text') return richTextProperty(schema, name, value);
  if (property.type === 'url') return { [name]: { url: value || null } };
  throw new Error(`Notion 字段“${name}”不支持写入文本，当前为 ${property.type}。`);
}

function optionalSelectProperty(schema: DatabaseSchema, name: string, value: string) {
  const property = schema.properties[name];
  if (!property || !['select', 'status'].includes(property.type)) return {};
  const options = property[property.type]?.options || [];
  if (!options.some((option: any) => option.name === value)) return {};
  return { [name]: selectProperty(schema, name, value) };
}

function relationNameToDatabase(schema: DatabaseSchema, databaseId: string) {
  const normalizedDatabaseId = databaseId.replaceAll('-', '');
  return Object.entries(schema.properties).find(([, property]: [string, any]) =>
    property.type === 'relation' && property.relation?.database_id?.replaceAll('-', '') === normalizedDatabaseId,
  )?.[0];
}

const titleFrom = (page: NotionPage, preferred: string) => {
  if (page.properties[preferred]) return propertyValue(page.properties[preferred]);
  const titleProperty = Object.values(page.properties).find(
    (property: any) => property.type === 'title',
  );
  return propertyValue(titleProperty);
};

function mapArticle(page: NotionPage) {
  const properties = page.properties;
  return {
    id: page.id,
    url: pageUrl(page),
    title: titleFrom(page, 'Title') || 'Untitled article',
    status: propertyValue(properties.Status) || 'Idea',
    leadGoal: propertyValue(properties['Lead Goal']),
    productCategory: propertyValue(properties['Product Category']),
    productSubcategory: propertyValue(properties['Product Subcategory']),
    audienceMarket: propertyValue(properties['Audience Market']),
    searchIntent: propertyValue(properties['Search Intent']),
    primaryQuery: propertyValue(properties['Primary Query']),
    topicKey: propertyValue(properties['Topic Key']),
    contentType: propertyValue(properties['Content Type']),
    qualityScore: numberValue(properties['Quality Score']),
    reviewers: peopleValue(properties.Reviewer),
    lastVerified: dateValue(properties['Last Verified']),
    primaryCTA: propertyValue(properties['Primary CTA']),
    evidenceCount: relationCount(properties.Evidence),
    auditCount: relationCount(properties['Audit History']),
    topicCount: relationCount(properties['Topic Record']),
    language: propertyValue(properties.Language) || 'en',
    date: dateValue(properties.Date),
    slug: propertyValue(properties.slug) || propertyValue(properties.Slug),
    createdTime: page.created_time,
    lastEditedTime: page.last_edited_time,
  };
}

function mapTopic(page: NotionPage) {
  const properties = page.properties;
  return {
    id: page.id,
    url: pageUrl(page),
    title: titleFrom(page, 'Topic') || 'Untitled topic',
    status: propertyValue(properties.Status) || 'Candidate',
    leadGoal: propertyValue(properties['Lead Goal']),
    productCategory: propertyValue(properties['Product Category']),
    productSubcategory: propertyValue(properties['Product Subcategory']),
    audienceMarket: propertyValue(properties['Audience Market']),
    searchIntent: propertyValue(properties['Search Intent']),
    primaryQuery: propertyValue(properties['Primary Query']),
    topicKey: propertyValue(properties['Topic Key']),
    coreAngle: propertyValue(properties['Core Angle']),
    candidateScore: numberValue(properties['Candidate Score']),
    duplicateDecision: propertyValue(properties['Duplicate Decision']),
    duplicateNotes: propertyValue(properties['Duplicate Notes']),
    week: dateValue(properties.Week),
    createdTime: page.created_time,
    lastEditedTime: page.last_edited_time,
  };
}

function mapEvidence(page: NotionPage) {
  const properties = page.properties;
  return {
    id: page.id,
    url: pageUrl(page),
    claim: titleFrom(page, 'Claim') || 'Untitled claim',
    status: propertyValue(properties.Status) || 'Unverified',
    sourceTier: propertyValue(properties['Source Tier']),
    sourceType: propertyValue(properties['Source Type']),
    sourceUrl: propertyValue(properties['Source URL']),
    publisher: propertyValue(properties.Publisher),
    market: propertyValue(properties['Applicable Market']),
    summary: propertyValue(properties['Evidence Summary']),
    accessedDate: dateValue(properties['Accessed Date']),
    publishedDate: dateValue(properties['Published Date']),
    expires: dateValue(properties.Expires),
    verifiedBy: peopleValue(properties['Verified By']),
    articleCount: relationCount(properties.Article),
    topicCount: relationCount(properties.Topic),
    createdTime: page.created_time,
    lastEditedTime: page.last_edited_time,
  };
}

function mapAudit(page: NotionPage) {
  const properties = page.properties;
  const articleIds = relationIds(properties.Article);
  return {
    id: page.id,
    url: pageUrl(page),
    title: titleFrom(page, 'Audit Run') || 'Untitled audit',
    stage: propertyValue(properties.Stage),
    result: propertyValue(properties.Result),
    score: numberValue(properties.Score),
    reviewers: peopleValue(properties.Reviewer),
    findings: propertyValue(properties.Findings),
    blockers: propertyValue(properties.Blockers),
    runDate: dateValue(properties['Run Date']),
    modelVersion: propertyValue(properties['Model or Version']),
    articleCount: articleIds.length,
    articleIds,
    topicCount: relationCount(properties.Topic),
    evidenceCount: relationCount(properties['Evidence Items']),
    createdTime: page.created_time,
    lastEditedTime: page.last_edited_time,
  };
}

async function buildPayload(apiKey: string) {
  const [articlePages, topicPages, evidencePages, auditPages] = await Promise.all([
    queryDatabase(apiKey, DATABASES.insights),
    queryDatabase(apiKey, DATABASES.topics),
    queryDatabase(apiKey, DATABASES.evidence),
    queryDatabase(apiKey, DATABASES.audits),
  ]);

  const articles = articlePages
    .map(mapArticle)
    .sort((a, b) => b.lastEditedTime.localeCompare(a.lastEditedTime));
  const topics = topicPages
    .map(mapTopic)
    .sort((a, b) => (b.candidateScore ?? -1) - (a.candidateScore ?? -1));
  const evidence = evidencePages
    .map(mapEvidence)
    .sort((a, b) => (a.expires || '9999').localeCompare(b.expires || '9999'));
  const audits = auditPages
    .map(mapAudit)
    .sort((a, b) => (b.runDate || b.createdTime).localeCompare(a.runDate || a.createdTime));

  return {
    generatedAt: new Date().toISOString(),
    taxonomy: {
      freight: 'Freight Export',
      commercialKitchen: 'Commercial Kitchen Equipment',
      outdoor: 'Outdoor Products',
    },
    links: {
      insights: 'https://www.notion.so/366eac33261880f7b7fbe903f189eca3',
      topics: 'https://www.notion.so/76917d19580c4440931b07d3e032aa83',
      evidence: 'https://www.notion.so/989ba0dbe63143a494f70a45b150d3eb',
      audits: 'https://www.notion.so/6e03429a3778451d990eb05dae5d9249',
      runbook: 'https://www.notion.so/3adeac33261881ed804ac974540fa7e4',
    },
    articles,
    topics,
    evidence,
    audits,
  };
}

/**
 * These are editorial prompts, not asserted market facts.  In template mode the
 * generator deliberately does not browse, quote a regulation, or invent a
 * trend. Each accepted topic must still acquire claim-level evidence before
 * drafting can be treated as complete.
 */
const candidateTemplates: CandidateDraft[] = [
  {
    title: 'China-to-Saudi freight documents for commercial kitchen equipment: a shipment handover checklist',
    leadGoal: 'Freight Export', productCategory: 'Not Applicable', productSubcategory: 'Commercial equipment freight',
    audienceMarket: 'Saudi Arabia', searchIntent: 'Checklist',
    primaryQuery: 'documents needed to ship commercial kitchen equipment from China to Saudi Arabia',
    coreAngle: 'handover checklist by shipment stage', contentType: 'Buyer Guide', candidateScore: 82,
    evidencePlan: 'Saudi official import/customs guidance, carrier documentation guidance, and a scope-confirmed freight record.',
    citationAsset: 'Shipment handover document matrix', primaryCTA: '/get-a-quote',
  },
  {
    title: 'How to plan consolidation for restaurant equipment shipped from China to the UAE',
    leadGoal: 'Freight Export', productCategory: 'Not Applicable', productSubcategory: 'Consolidation',
    audienceMarket: 'United Arab Emirates', searchIntent: 'How-to guide',
    primaryQuery: 'consolidate restaurant equipment shipments from China to UAE',
    coreAngle: 'packing sequence and shipment-ready decision points', contentType: 'Buyer Guide', candidateScore: 80,
    evidencePlan: 'UAE official import guidance, carrier packing constraints, and manufacturer packing specifications.',
    citationAsset: 'Consolidation readiness checklist', primaryCTA: '/get-a-quote',
  },
  {
    title: 'Export packing requirements to confirm before shipping stainless kitchen worktables from China',
    leadGoal: 'Freight Export', productCategory: 'Not Applicable', productSubcategory: 'Export packing',
    audienceMarket: 'Middle East and Africa', searchIntent: 'Checklist',
    primaryQuery: 'export packing checklist stainless kitchen worktables from China',
    coreAngle: 'damage-risk controls before container loading', contentType: 'Buyer Guide', candidateScore: 78,
    evidencePlan: 'Carrier cargo packaging rules, destination-market wood-packaging requirements, and supplier packing records.',
    citationAsset: 'Packaging inspection matrix', primaryCTA: '/get-a-quote',
  },
  {
    title: 'Commercial kitchen equipment RFQ from China: the specification fields buyers should send first',
    leadGoal: 'Product Sourcing', productCategory: 'Commercial Kitchen Equipment', productSubcategory: 'RFQ and specification',
    audienceMarket: 'Saudi Arabia', searchIntent: 'Template',
    primaryQuery: 'commercial kitchen equipment RFQ template China Saudi Arabia',
    coreAngle: 'market-bounded RFQ fields that reduce rework', contentType: 'Buyer Guide', candidateScore: 84,
    evidencePlan: 'Applicable Saudi conformity source, manufacturer data sheets from multiple suppliers, and confirmed buyer requirements.',
    citationAsset: 'Commercial kitchen RFQ specification matrix', primaryCTA: '/sourcing/commercial-kitchen-equipment-from-china',
  },
  {
    title: 'How to compare Chinese commercial upright refrigerator suppliers for a restaurant project',
    leadGoal: 'Product Sourcing', productCategory: 'Commercial Kitchen Equipment', productSubcategory: 'Commercial refrigeration',
    audienceMarket: 'United Arab Emirates', searchIntent: 'Comparison',
    primaryQuery: 'compare commercial upright refrigerator suppliers China UAE restaurant',
    coreAngle: 'comparable capacity, climate class and service fields', contentType: 'Buyer Guide', candidateScore: 81,
    evidencePlan: 'Applicable electrical/product requirements plus comparable manufacturer technical sheets; no performance claims without test records.',
    citationAsset: 'Upright refrigerator comparison worksheet', primaryCTA: '/sourcing/commercial-kitchen-equipment-from-china',
  },
  {
    title: 'Commercial meat slicer sourcing from China: how to write a market-specific buyer brief',
    leadGoal: 'Product Sourcing', productCategory: 'Commercial Kitchen Equipment', productSubcategory: 'Food preparation equipment',
    audienceMarket: 'Africa', searchIntent: 'How-to guide',
    primaryQuery: 'commercial meat slicer sourcing China buyer brief Africa',
    coreAngle: 'intended use, power supply and safety information before supplier comparison', contentType: 'Buyer Guide', candidateScore: 77,
    evidencePlan: 'Destination-market safety requirements, supplier manuals from multiple manufacturers, and verified power-supply requirements.',
    citationAsset: 'Meat slicer buyer-brief checklist', primaryCTA: '/sourcing/commercial-kitchen-equipment-from-china',
  },
  {
    title: 'Outdoor portable refrigerator sourcing from China: a buyer checklist for the UAE',
    leadGoal: 'Product Sourcing', productCategory: 'Outdoor Products', productSubcategory: 'Outdoor and portable refrigerators',
    audienceMarket: 'United Arab Emirates', searchIntent: 'Checklist',
    primaryQuery: 'outdoor portable refrigerator sourcing China UAE buyer checklist',
    coreAngle: 'temperature range, power inputs and transport packaging before RFQ', contentType: 'Buyer Guide', candidateScore: 83,
    evidencePlan: 'Applicable UAE market requirements, multiple supplier data sheets, and test/inspection evidence only when supplied.',
    citationAsset: 'Portable refrigerator RFQ checklist', primaryCTA: '/sourcing/outdoor-products-from-china',
  },
  {
    title: 'How to compare insulated cooler box suppliers in China for outdoor distribution',
    leadGoal: 'Product Sourcing', productCategory: 'Outdoor Products', productSubcategory: 'Insulated cooler boxes',
    audienceMarket: 'Middle East', searchIntent: 'Comparison',
    primaryQuery: 'compare insulated cooler box suppliers China Middle East',
    coreAngle: 'material, dimensions, temperature-test method and packaging comparison', contentType: 'Buyer Guide', candidateScore: 79,
    evidencePlan: 'Applicable product/packaging requirements, multiple technical records, and a disclosed test method where available.',
    citationAsset: 'Cooler box supplier comparison table', primaryCTA: '/sourcing/outdoor-products-from-china',
  },
  {
    title: 'Outdoor barbecue grill sourcing from China: how buyers can compare fuel, material and market scope',
    leadGoal: 'Product Sourcing', productCategory: 'Outdoor Products', productSubcategory: 'Outdoor barbecue grills',
    audienceMarket: 'Saudi Arabia', searchIntent: 'Comparison',
    primaryQuery: 'outdoor barbecue grill sourcing China Saudi Arabia comparison',
    coreAngle: 'fuel type, material and market-specific compliance questions', contentType: 'Buyer Guide', candidateScore: 78,
    evidencePlan: 'Applicable Saudi product requirements, multiple manufacturer data sheets and verified materials documentation.',
    citationAsset: 'Outdoor grill specification comparison matrix', primaryCTA: '/sourcing/outdoor-products-from-china',
  },
];

function wordOverlap(left: string, right: string) {
  const a = new Set(normalizeForMatch(left).split(' ').filter((word) => word.length > 2));
  const b = new Set(normalizeForMatch(right).split(' ').filter((word) => word.length > 2));
  if (!a.size || !b.size) return 0;
  let intersection = 0;
  a.forEach((word) => { if (b.has(word)) intersection += 1; });
  return intersection / Math.max(1, Math.min(a.size, b.size));
}

function auditCandidate(candidate: CandidateDraft, payload: WorkflowPayload) {
  const topicKey = stableTopicKey(candidate);
  const candidateQuery = normalizeForMatch(candidate.primaryQuery);
  const exactTopic = payload.topics.find((topic) => normalizeForMatch(topic.topicKey) === normalizeForMatch(topicKey));
  const exactQuery = [...payload.topics, ...payload.articles].find(
    (item) => normalizeForMatch(item.primaryQuery) === candidateQuery,
  );
  const overlap = [...payload.topics, ...payload.articles]
    .map((item) => ({ item, score: wordOverlap(candidate.primaryQuery, item.primaryQuery || item.title) }))
    .sort((a, b) => b.score - a.score)[0];

  if (exactTopic || exactQuery) {
    const match = exactTopic || exactQuery!;
    return {
      topicKey,
      candidateScore: candidate.candidateScore,
      duplicateDecision: 'Rejected',
      duplicateNotes: `阻止创建：与现有记录“${match.title}”存在相同 Topic Key 或 Primary Query。应更新、合并或改写搜索意图。`,
      matchedRecord: { id: match.id, title: match.title, kind: exactTopic ? 'topic' : 'article' },
    };
  }
  if (overlap && overlap.score >= 0.72) {
    return {
      topicKey,
      candidateScore: candidate.candidateScore,
      duplicateDecision: 'Needs Review',
      duplicateNotes: `疑似核心答案重叠（与“${overlap.item.title}”词项重合度 ${Math.round(overlap.score * 100)}%）。人工确认有新法规、成本、流程、风险或产品选择价值后才能选择。`,
      matchedRecord: { id: overlap.item.id, title: overlap.item.title, kind: 'article' },
    };
  }
  return {
    topicKey,
    candidateScore: candidate.candidateScore,
    duplicateDecision: 'Clear',
    duplicateNotes: '通过初步机械查重：未发现相同 Primary Query 或 Topic Key。仍需在研究阶段复核章节和核心答案。',
    matchedRecord: null,
  };
}

async function createAutomationAudit(
  apiKey: string,
  auditSchema: DatabaseSchema,
  input: { title: string; stage: string; result: 'Pass' | 'Needs Changes' | 'Blocked'; findings: string; blockers?: string; topicIds?: string[]; articleIds?: string[] },
) {
  const today = new Date().toISOString();
  const properties = {
    ...titleProperty(auditSchema, 'Audit Run', `${input.stage} — ${input.title}`),
    ...optionalSelectProperty(auditSchema, 'Stage', input.stage),
    ...optionalSelectProperty(auditSchema, 'Result', input.result),
    ...richTextProperty(auditSchema, 'Findings', input.findings),
    ...richTextProperty(auditSchema, 'Blockers', input.blockers || ''),
    ...dateProperty(auditSchema, 'Run Date', today),
    ...richTextProperty(auditSchema, 'Model or Version', 'DDNZ local workflow request (no autonomous publication)'),
    ...relationProperty(auditSchema, 'Topic', input.topicIds || []),
    ...relationProperty(auditSchema, 'Article', input.articleIds || []),
  };
  return notionFetch(apiKey, '/v1/pages', {
    method: 'POST',
    body: { parent: { database_id: DATABASES.audits }, properties },
  });
}

async function persistCandidates(apiKey: string, payload: WorkflowPayload, candidates: CandidateDraft[]) {
  const [topicSchema, auditSchema] = await Promise.all([
    databaseSchema(apiKey, DATABASES.topics),
    databaseSchema(apiKey, DATABASES.audits),
  ]);
  const week = new Date().toISOString().slice(0, 10);
  const results: Array<{ title: string; id: string; status: string; duplicateDecision: string }> = [];

  for (const candidate of candidates) {
    const outcome = auditCandidate(candidate, payload);
    const status = outcome.duplicateDecision === 'Rejected' ? 'Rejected' : 'Candidate';
    const properties = {
      ...titleProperty(topicSchema, 'Topic', candidate.title),
      Status: selectProperty(topicSchema, 'Status', status),
      ...textOrSelectProperty(topicSchema, 'Lead Goal', candidate.leadGoal),
      ...textOrSelectProperty(topicSchema, 'Product Category', candidate.productCategory),
      ...textOrSelectProperty(topicSchema, 'Product Subcategory', candidate.productSubcategory),
      ...textOrSelectProperty(topicSchema, 'Audience Market', candidate.audienceMarket),
      ...textOrSelectProperty(topicSchema, 'Search Intent', candidate.searchIntent),
      ...richTextProperty(topicSchema, 'Primary Query', candidate.primaryQuery),
      ...richTextProperty(topicSchema, 'Topic Key', outcome.topicKey),
      ...richTextProperty(topicSchema, 'Core Angle', candidate.coreAngle),
      ...numberProperty(topicSchema, 'Candidate Score', candidate.candidateScore),
      ...optionalSelectProperty(topicSchema, 'Duplicate Decision', outcome.duplicateDecision),
      ...richTextProperty(topicSchema, 'Duplicate Notes', `${outcome.duplicateNotes}\n\n模板证据计划：${candidate.evidencePlan}\n可引用资产：${candidate.citationAsset}\n建议 CTA：${candidate.primaryCTA}`),
      ...dateProperty(topicSchema, 'Week', week),
    };
    const page = (await notionFetch(apiKey, '/v1/pages', {
      method: 'POST', body: { parent: { database_id: DATABASES.topics }, properties },
    })) as NotionPage;
    await createAutomationAudit(apiKey, auditSchema, {
      title: candidate.title,
      stage: 'Duplicate Check',
      result: outcome.duplicateDecision === 'Clear' ? 'Pass' : 'Needs Changes',
      findings: `模板候选已${outcome.duplicateDecision === 'Clear' ? '通过初步查重' : '保留供人工复核'}。${outcome.duplicateNotes}`,
      blockers: outcome.duplicateDecision === 'Clear' ? '尚未开展研究；不得把模板候选当作已核验事实。' : outcome.duplicateNotes,
      topicIds: [page.id],
    });
    results.push({ title: candidate.title, id: page.id, status, duplicateDecision: outcome.duplicateDecision });
  }
  cache = null;
  return results;
}

function selectedCategory(topic: ReturnType<typeof mapTopic>) {
  if (topic.leadGoal === 'Freight Export') return 'Freight Export';
  return topic.productCategory;
}

async function selectWeeklyTopics(apiKey: string, topicIds: string[]) {
  if (!Array.isArray(topicIds) || topicIds.length !== 3 || new Set(topicIds).size !== 3) {
    throw new Error('请恰好选择 3 个不同选题：货运、商用餐厨设备、户外用品各 1 篇。');
  }
  const [topicPages, topicSchema, auditSchema] = await Promise.all([
    queryDatabase(apiKey, DATABASES.topics), databaseSchema(apiKey, DATABASES.topics), databaseSchema(apiKey, DATABASES.audits),
  ]);
  const selected = topicIds.map((id) => topicPages.find((page) => page.id === id)).filter(Boolean) as NotionPage[];
  if (selected.length !== 3) throw new Error('所选选题中有记录不存在或已被删除。请刷新后重新选择。');
  const mapped = selected.map(mapTopic);
  const expected = new Set(['Freight Export', 'Commercial Kitchen Equipment', 'Outdoor Products']);
  const actual = mapped.map(selectedCategory);
  if (new Set(actual).size !== 3 || actual.some((category) => !expected.has(category))) {
    throw new Error('本周必须且只能选择：Freight Export、Commercial Kitchen Equipment、Outdoor Products 各 1 篇。');
  }
  const invalid = mapped.find((topic) => (topic.candidateScore ?? 0) < 75 || topic.duplicateDecision !== 'Clear');
  if (invalid) {
    throw new Error(`“${invalid.title}”不能选择：需要评分至少 75 且 Duplicate Decision 为 Clear。请先处理查重结论。`);
  }
  for (const topic of selected) {
    await notionFetch(apiKey, `/v1/pages/${topic.id}`, {
      method: 'PATCH', body: { properties: { Status: selectProperty(topicSchema, 'Status', 'Selected') } },
    });
    await createAutomationAudit(apiKey, auditSchema, {
      title: titleFrom(topic, 'Topic'), stage: 'Duplicate Check', result: 'Pass',
      findings: '用户已选择该选题进入本周生产队列。自动化下一步只能创建研究请求和草稿请求。',
      topicIds: [topic.id],
    });
  }
  cache = null;
  return mapped;
}

async function prepareResearchArticle(apiKey: string, topicId: string) {
  const [topicPages, articlePages, articleSchema, auditSchema] = await Promise.all([
    queryDatabase(apiKey, DATABASES.topics), queryDatabase(apiKey, DATABASES.insights),
    databaseSchema(apiKey, DATABASES.insights), databaseSchema(apiKey, DATABASES.audits),
  ]);
  const topic = topicPages.find((page) => page.id === topicId);
  if (!topic) throw new Error('找不到该选题。请刷新 Notion 后重试。');
  const mappedTopic = mapTopic(topic);
  if (mappedTopic.status !== 'Selected') {
    throw new Error('只有状态为 Selected 的选题可以创建研究请求。请先完成本周三篇选题选择。');
  }
  const existing = articlePages.find((article) => relationIds(article.properties['Topic Record']).includes(topicId));
  if (existing) {
    return {
      article: mapArticle(existing),
      request: { type: 'research', status: mapArticle(existing).status, instructions: '该选题已经有关联文章；请打开文章继续补齐证据，而不是重复创建。' },
      reusedExistingArticle: true,
      notice: WORKFLOW_WRITE_NOTICE,
    };
  }
  requireProperty(articleSchema, 'Topic Record');
  const title = mappedTopic.title;
  const properties = {
    ...titleProperty(articleSchema, 'Title', title),
    Status: selectProperty(articleSchema, 'Status', 'Researching'),
    ...textOrSelectProperty(articleSchema, 'Lead Goal', mappedTopic.leadGoal),
    ...textOrSelectProperty(articleSchema, 'Product Category', mappedTopic.productCategory),
    ...textOrSelectProperty(articleSchema, 'Product Subcategory', mappedTopic.productSubcategory),
    ...textOrSelectProperty(articleSchema, 'Audience Market', mappedTopic.audienceMarket),
    ...textOrSelectProperty(articleSchema, 'Search Intent', mappedTopic.searchIntent),
    ...richTextProperty(articleSchema, 'Primary Query', mappedTopic.primaryQuery),
    ...richTextProperty(articleSchema, 'Topic Key', mappedTopic.topicKey),
    ...textOrSelectProperty(articleSchema, 'Content Type', 'Buyer Guide'),
    ...richTextProperty(articleSchema, 'Primary CTA', mappedTopic.productCategory === 'Outdoor Products'
      ? '/sourcing/outdoor-products-from-china'
      : mappedTopic.productCategory === 'Commercial Kitchen Equipment'
        ? '/sourcing/commercial-kitchen-equipment-from-china'
        : '/get-a-quote'),
    ...relationProperty(articleSchema, 'Topic Record', [topic.id]),
  };
  const article = (await notionFetch(apiKey, '/v1/pages', {
    method: 'POST', body: { parent: { database_id: DATABASES.insights }, properties },
  })) as NotionPage;
  await createAutomationAudit(apiKey, auditSchema, {
    title, stage: 'Evidence Audit', result: 'Needs Changes',
    findings: '已创建 Researching 文章和研究请求。尚未写入任何研究结论、数字或正文。',
    blockers: '请为每条重要论点建立 Evidence Ledger 记录，并确认适用市场、发布日期和失效日期。',
    topicIds: [topic.id], articleIds: [article.id],
  });
  cache = null;
  return {
    article: mapArticle(article),
    request: {
      type: 'research', status: 'Researching',
      instructions: `研究“${title}”：只使用可核验的 A/B 级来源；每个重要论点单独入账；不引用未核验的模板内容。`,
    },
    reusedExistingArticle: false,
    notice: `${WORKFLOW_WRITE_NOTICE} 当前未连接可信的研究模型，因此没有自动抓取、改写或伪造来源。`,
  };
}

async function bodyTextLength(apiKey: string, articleId: string) {
  const blocks = await fetchBlockChildren(apiKey, articleId);
  const html = await renderPreviewBlocks(apiKey, blocks);
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().length;
}

const validAdvanceActions = ['mark-evidence-ready', 'draft-request', 'editorial-ready', 'domain-ready'] as const;
type AdvanceAction = typeof validAdvanceActions[number];

function advancePlan(action: AdvanceAction) {
  if (action === 'mark-evidence-ready') return { from: ['Researching'], to: 'Evidence Ready', stage: 'Evidence Audit' };
  if (action === 'draft-request') return { from: ['Evidence Ready'], to: 'Drafting', stage: 'Editorial Review' };
  if (action === 'editorial-ready') return { from: ['Drafting'], to: 'Editorial Review', stage: 'Editorial Review' };
  return { from: ['Editorial Review'], to: AUTOMATION_MAX_STATUS, stage: 'Domain Review' };
}

async function advanceArticle(apiKey: string, articleId: string, action: AdvanceAction) {
  if (!validAdvanceActions.includes(action)) {
    throw new Error('无效的推进操作。可用操作：mark-evidence-ready、draft-request、editorial-ready、domain-ready。');
  }
  const [page, articleSchema, auditSchema] = await Promise.all([
    notionFetch(apiKey, `/v1/pages/${articleId}`) as Promise<NotionPage>,
    databaseSchema(apiKey, DATABASES.insights), databaseSchema(apiKey, DATABASES.audits),
  ]);
  const article = mapArticle(page);
  const plan = advancePlan(action);
  if (!plan.from.includes(article.status)) {
    throw new Error(`当前文章状态为“${article.status}”，不能执行此操作。请按顺序从 ${plan.from.join(' 或 ')} 推进。`);
  }
  if (['mark-evidence-ready', 'draft-request', 'editorial-ready', 'domain-ready'].includes(action) && article.evidenceCount < 2) {
    throw new Error('至少需要 2 条关联 Evidence Ledger 记录才能继续。请先逐条补齐并核验重要论点。');
  }
  if (['editorial-ready', 'domain-ready'].includes(action)) {
    const length = await bodyTextLength(apiKey, articleId);
    if (length < 600) {
      throw new Error('正文内容不足，不能送审。请先在 Notion 完成能直接回答标题问题的英文正文和可索引引用资产。');
    }
  }
  if (action === 'domain-ready' && (article.qualityScore ?? 0) < 85) {
    throw new Error('进入 Domain Review 前 Quality Score 必须达到 85。请先完成编辑审核和评分。');
  }
  const updated = (await notionFetch(apiKey, `/v1/pages/${articleId}`, {
    method: 'PATCH', body: { properties: { Status: selectProperty(articleSchema, 'Status', plan.to) } },
  })) as NotionPage;
  const requestDescription = action === 'draft-request'
    ? '已创建起草请求；当前没有连接可信写作模型，因此未写入正文。请依据 Brief 和证据账本起草。'
    : action === 'mark-evidence-ready'
      ? '证据数量达到基础门槛，仍需人工核验市场范围和每个关键结论。'
      : action === 'editorial-ready'
        ? '正文已送编辑审核；不得将编辑审核当成专业或发布批准。'
        : '文章已送 Domain Review，等待货运/采购专业人员确认。';
  await createAutomationAudit(apiKey, auditSchema, {
    title: article.title, stage: plan.stage,
    result: action === 'draft-request' ? 'Needs Changes' : 'Pass',
    findings: requestDescription,
    blockers: action === 'draft-request' ? '需要基于已关联证据完成正文；不得使用未验证的数字、法规或性能保证。' : '',
    articleIds: [articleId], topicIds: relationIds(page.properties['Topic Record']),
  });
  cache = null;
  return {
    article: mapArticle(updated), stage: plan.to,
    request: { type: action, status: plan.to, instructions: requestDescription },
    notice: `${WORKFLOW_WRITE_NOTICE} 当前工作流不会执行最终发布。`,
  };
}

async function buildDraftBrief(apiKey: string, articleId: string) {
  const [page, payload] = await Promise.all([
    notionFetch(apiKey, `/v1/pages/${articleId}`) as Promise<NotionPage>, buildPayload(apiKey),
  ]);
  const article = mapArticle(page);
  const topic = payload.topics.find((item) => relationIds(page.properties['Topic Record']).includes(item.id));
  const evidence = payload.evidence.filter((item) => relationIds(page.properties.Evidence).includes(item.id));
  return {
    article,
    brief: {
      researchChecklist: [
        '逐条列出标题中的重要结论；每条结论分别关联 Evidence Ledger。',
        `仅适用于：${article.audienceMarket || '必须在写作前确定市场'}。法规、标准和日期必须来自官方或一手来源。`,
        'Tier C 只能用于发现线索，不能单独支撑重要结论；不可编造 DDNZ 项目、成本、数量、测试或认证。',
      ],
      draftOutline: [
        '80–120 词开头：直接回答标题、说明适用对象和边界。',
        '三点摘要。',
        '每 150–250 词一个清晰小标题；正文使用短段落。',
        '一个可索引 HTML 资产：检查表、规格矩阵、认证流程或带方法说明的原创数据。',
        `明确 CTA：${article.primaryCTA || '请先设置 Primary CTA'}。`,
      ],
      requiredEvidence: evidence.map((item) => ({ claim: item.claim, tier: item.sourceTier, url: item.sourceUrl, expires: item.expires, status: item.status })),
      topicPlan: topic ? { evidencePlan: topic.duplicateNotes, primaryQuery: topic.primaryQuery, candidateScore: topic.candidateScore } : null,
      imageBriefs: [
        { placement: 'cover', minimum: '1200×675', requirement: '明确版权来源、描述性文件名、alt 和图注；不能把重要文字只放进图片。' },
        { placement: 'body', count: '2–4', requirement: '仅使用能解释流程、规格或检查点的图片；每张须记录权利来源。' },
      ],
      publishGate: ['Quality Score ≥ 85', '人工 Reviewer', 'Last Verified', 'Primary CTA', 'Topic 关联', '至少两条关联证据', '人工确认后才可 Published'],
    },
    automationMaxStatus: AUTOMATION_MAX_STATUS,
  };
}

const escapeHtml = (value: string) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');

const escapeAttribute = (value: string) => escapeHtml(value).replaceAll('`', '&#096;');

function renderRichTextItem(item: any) {
  if (!item?.plain_text) return '';
  let text = escapeHtml(item.plain_text);
  if (item.annotations?.code) text = `<code>${text}</code>`;
  if (item.annotations?.bold) text = `<strong>${text}</strong>`;
  if (item.annotations?.italic) text = `<em>${text}</em>`;
  if (item.annotations?.strikethrough) text = `<del>${text}</del>`;
  if (item.annotations?.underline) text = `<u>${text}</u>`;
  if (item.href) {
    text = `<a href="${escapeAttribute(item.href)}" target="_blank" rel="noopener noreferrer">${text}</a>`;
  }
  return text;
}

const renderRichText = (items: any[] = []) => items.map(renderRichTextItem).join('');

async function fetchBlockChildren(apiKey: string, blockId: string) {
  const blocks: any[] = [];
  let cursor: string | undefined;
  do {
    const params = new URLSearchParams({ page_size: '100' });
    if (cursor) params.set('start_cursor', cursor);
    const result = await notionFetch(
      apiKey,
      `/v1/blocks/${blockId}/children?${params.toString()}`,
    );
    blocks.push(...result.results);
    cursor = result.has_more ? result.next_cursor : undefined;
  } while (cursor);
  return blocks;
}

async function renderPreviewBlocks(apiKey: string, blocks: any[]): Promise<string> {
  let html = '';
  let listType: 'ul' | 'ol' | '' = '';

  const closeList = () => {
    if (listType) {
      html += `</${listType}>`;
      listType = '';
    }
  };

  for (const block of blocks) {
    const type = block.type;
    const isList = type === 'bulleted_list_item' || type === 'numbered_list_item';
    const nextListType = type === 'bulleted_list_item' ? 'ul' : 'ol';
    if (!isList || (listType && listType !== nextListType)) closeList();
    const renderChildren = async () =>
      block.has_children
        ? renderPreviewBlocks(apiKey, await fetchBlockChildren(apiKey, block.id))
        : '';

    if (type === 'paragraph') {
      html += `<p>${renderRichText(block.paragraph.rich_text)}</p>${await renderChildren()}`;
    } else if (type === 'heading_1' || type === 'heading_2' || type === 'heading_3') {
      // The article title is the page H1. Both Notion H1 and H2 are section
      // headings in the website preview; keeping them at H2 avoids a second H1.
      const tag = type === 'heading_3' ? 'h3' : 'h2';
      html += `<${tag}>${renderRichText(block[type].rich_text)}</${tag}>${await renderChildren()}`;
    } else if (isList) {
      if (!listType) {
        listType = nextListType;
        html += `<${listType}>`;
      }
      html += `<li>${renderRichText(block[type].rich_text)}${await renderChildren()}</li>`;
    } else if (type === 'image') {
      const image = block.image;
      const imageUrl = image.type === 'external' ? image.external?.url : image.file?.url;
      const caption = plainText(image.caption);
      if (imageUrl) {
        html += `<figure class="article-figure"><img src="${escapeAttribute(imageUrl)}" alt="${escapeAttribute(
          caption || 'Article supporting image',
        )}" />${caption ? `<figcaption>${escapeHtml(caption)}</figcaption>` : ''}</figure>`;
      }
    } else if (type === 'table') {
      const rows = await fetchBlockChildren(apiKey, block.id);
      html += '<div class="article-table-wrap"><table><tbody>';
      rows.forEach((row: any, rowIndex: number) => {
        if (row.type !== 'table_row') return;
        html += '<tr>';
        row.table_row.cells.forEach((cell: any[]) => {
          const tag = rowIndex === 0 && block.table.has_column_header ? 'th' : 'td';
          html += `<${tag}>${renderRichText(cell)}</${tag}>`;
        });
        html += '</tr>';
      });
      html += '</tbody></table></div>';
    } else if (type === 'quote') {
      html += `<blockquote>${renderRichText(block.quote.rich_text)}${await renderChildren()}</blockquote>`;
    } else if (type === 'callout') {
      const emoji = block.callout.icon?.type === 'emoji' ? block.callout.icon.emoji : 'i';
      html += `<aside class="article-callout"><span>${escapeHtml(emoji)}</span><div>${renderRichText(
        block.callout.rich_text,
      )}${await renderChildren()}</div></aside>`;
    } else if (type === 'toggle') {
      html += `<details><summary>${renderRichText(block.toggle.rich_text)}</summary>${await renderChildren()}</details>`;
    } else if (type === 'code') {
      html += `<pre><code>${escapeHtml(plainText(block.code.rich_text))}</code></pre>`;
    } else if (type === 'bookmark') {
      const url = block.bookmark.url || '';
      const caption = plainText(block.bookmark.caption) || url;
      html += `<p><a href="${escapeAttribute(url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(
        caption,
      )}</a></p>`;
    } else if (type === 'divider') {
      html += '<hr />';
    } else if (type === 'column_list' || type === 'column' || type === 'synced_block') {
      html += await renderChildren();
    }
  }
  closeList();
  return html;
}

const coverUrl = (page: NotionPage) => {
  if (!page.cover) return '';
  return page.cover.type === 'external'
    ? page.cover.external?.url || ''
    : page.cover.file?.url || '';
};

function publishEligibility(page: NotionPage) {
  const article = mapArticle(page);
  const blockers: string[] = [];
  if (!['Domain Review', 'Approved'].includes(article.status)) {
    blockers.push('文章必须处于 Domain Review 或 Approved');
  }
  if ((article.qualityScore ?? 0) < 85) blockers.push('Quality Score 必须达到 85');
  if (!article.reviewers.length) blockers.push('必须指定人工 Reviewer');
  if (article.evidenceCount < 2) blockers.push('至少需要 2 条关联证据');
  if (!article.auditCount) blockers.push('必须存在审核记录');
  if (!article.topicCount) blockers.push('必须关联 Topic Registry');
  if (!article.topicKey) blockers.push('Topic Key 不能为空');
  if (!article.primaryCTA) blockers.push('Primary CTA 不能为空');
  if (!article.lastVerified) blockers.push('Last Verified 不能为空');
  return { canPublish: blockers.length === 0, blockers };
}

async function buildArticlePreview(apiKey: string, articleId: string) {
  const page = (await notionFetch(apiKey, `/v1/pages/${articleId}`)) as NotionPage;
  const blocks = await fetchBlockChildren(apiKey, articleId);
  const html = await renderPreviewBlocks(apiKey, blocks);
  // Count the complete rendered body so nested callouts, toggles and table cells
  // contribute to the reading-time estimate.
  const text = html.replace(/<[^>]+>/g, ' ');
  const cjkCharacters = text.match(/[\u3400-\u9fff]/g)?.length || 0;
  const nonCjkText = text.replace(/[\u3400-\u9fff]/g, ' ');
  const nonCjkWords =
    nonCjkText.match(/[\p{L}\p{N}][\p{L}\p{N}'’-]*/gu)?.length || 0;
  const wordCount = nonCjkWords + Math.ceil(cjkCharacters / 2);
  return {
    article: mapArticle(page),
    summary: propertyValue(page.properties.Excerpt),
    coverUrl: coverUrl(page),
    html,
    wordCount,
    readMinutes: Math.max(1, Math.ceil(wordCount / 220)),
    eligibility: publishEligibility(page),
  };
}

async function readJsonBody(request: IncomingMessage) {
  let body = '';
  for await (const chunk of request) {
    body += chunk;
    if (body.length > 12_000) throw new Error('Request body is too large');
  }
  return body ? JSON.parse(body) : {};
}

async function createHumanAudit(
  apiKey: string,
  page: NotionPage,
  stage: 'Domain Review' | 'Publish Review',
) {
  const title = titleFrom(page, 'Title') || 'Untitled article';
  const evidenceIds = relationIds(page.properties.Evidence);
  const reviewers = page.properties.Reviewer?.people || [];
  return notionFetch(apiKey, '/v1/pages', {
    method: 'POST',
    body: {
      parent: { database_id: DATABASES.audits },
      properties: {
        'Audit Run': {
          title: [{ type: 'text', text: { content: `${stage} — ${title}` } }],
        },
        Stage: { select: { name: stage } },
        Result: { select: { name: 'Pass' } },
        Score: { number: numberValue(page.properties['Quality Score']) || 85 },
        Reviewer: { people: reviewers.map((person: any) => ({ id: person.id })) },
        Findings: {
          rich_text: [
            {
              type: 'text',
              text: {
                content:
                  stage === 'Domain Review'
                    ? 'The assigned human reviewer confirmed the market scope, evidence presentation, product limitations and title-answer alignment in the local website preview.'
                    : 'The assigned human reviewer used the local publish control after reviewing the final rendered article. The article passed all automated publish gates.',
              },
            },
          ],
        },
        Blockers: { rich_text: [] },
        'Run Date': { date: { start: new Date().toISOString() } },
        'Model or Version': {
          rich_text: [{ type: 'text', text: { content: 'DDNZ Content Ops local publish control' } }],
        },
        Article: { relation: [{ id: page.id }] },
        'Evidence Items': { relation: evidenceIds.map((id) => ({ id })) },
        Topic: {
          relation: relationIds(page.properties['Topic Record']).map((id) => ({ id })),
        },
      },
    },
  });
}

async function publishArticle(apiKey: string, articleId: string, confirmationTitle: string) {
  const page = (await notionFetch(apiKey, `/v1/pages/${articleId}`)) as NotionPage;
  const title = titleFrom(page, 'Title') || '';
  if (!title || confirmationTitle !== title) {
    throw new Error('发布确认标题不匹配');
  }
  const eligibility = publishEligibility(page);
  if (!eligibility.canPublish) {
    throw new Error(`发布闸门未通过：${eligibility.blockers.join('；')}`);
  }

  await createHumanAudit(apiKey, page, 'Domain Review');
  await createHumanAudit(apiKey, page, 'Publish Review');
  const today = new Date().toISOString().slice(0, 10);
  const updated = await notionFetch(apiKey, `/v1/pages/${articleId}`, {
    method: 'PATCH',
    body: {
      properties: {
        Status: { select: { name: 'Published' } },
        Date: { date: { start: today } },
        'Last Verified': { date: { start: today } },
      },
    },
  });

  await Promise.all(
    relationIds(page.properties['Topic Record']).map((topicId) =>
      notionFetch(apiKey, `/v1/pages/${topicId}`, {
        method: 'PATCH',
        body: { properties: { Status: { select: { name: 'Published' } } } },
      }),
    ),
  );
  cache = null;
  return { article: mapArticle(updated as NotionPage), publishedAt: new Date().toISOString() };
}

const isLocalRequest = (request: IncomingMessage) => {
  const hostHeader = request.headers.host || '';
  const host = hostHeader.startsWith('[')
    ? hostHeader.slice(1, hostHeader.indexOf(']'))
    : hostHeader.split(':')[0];
  return host === 'localhost' || host === '127.0.0.1' || host === '::1';
};

const isLocalOrigin = (request: IncomingMessage) => {
  const origin = request.headers.origin;
  if (!origin) return true;
  try {
    return ['localhost', '127.0.0.1', '::1'].includes(new URL(origin).hostname);
  } catch {
    return false;
  }
};

const sendJson = (response: ServerResponse, status: number, payload: unknown) => {
  response.statusCode = status;
  response.setHeader('Content-Type', 'application/json; charset=utf-8');
  response.setHeader('Cache-Control', 'no-store, private');
  response.setHeader('X-Content-Type-Options', 'nosniff');
  response.end(JSON.stringify(payload));
};

function actionableError(error: unknown) {
  const message = error instanceof Error ? error.message : '内容运营请求失败。';
  if (message.includes('Notion API 401')) return 'Notion API Key 无效或已失效。请检查 .env.local 的 NOTION_API_KEY。';
  if (message.includes('Notion API 403')) return 'Notion Integration 没有访问该数据库的权限。请在四个数据库中 Share 给 Integration 后重试。';
  if (message.includes('Notion API 404')) return '找不到 Notion 数据库或页面。请检查数据库 ID，并确认 Integration 已被共享。';
  if (message.includes('Notion API 429')) return 'Notion 请求过于频繁。请等待约一分钟后刷新或重试。';
  if (message === 'Request body is too large') return '请求内容过大。请减少一次提交的内容后再试。';
  if (message.includes('Unexpected token')) return '请求数据格式无效。请刷新控制台后重新操作。';
  return message;
}

export function createContentOpsApiPlugin(apiKey: string | undefined): Plugin {
  return {
    name: 'ddnz-local-content-ops-api',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/api/content-ops', async (request, response) => {
        if (!isLocalRequest(request)) {
          sendJson(response, 403, { error: '内容运营 API 仅限本机使用。请通过 localhost 或 127.0.0.1 打开控制台。' });
          return;
        }
        if (!apiKey) {
          sendJson(response, 503, {
            error: '未配置 NOTION_API_KEY。请在项目 .env.local 添加 Notion Integration 密钥后重启本地启动器。',
          });
          return;
        }

        try {
          const requestUrl = new URL(request.url || '/', 'http://127.0.0.1');
          if (request.method === 'GET' && requestUrl.pathname === '/health') {
            sendJson(response, 200, { ok: true, service: 'ddnz-content-ops', localOnly: true });
            return;
          }
          const previewMatch = requestUrl.pathname.match(/^\/article\/([a-f0-9-]+)$/i);
          const publishMatch = requestUrl.pathname.match(/^\/article\/([a-f0-9-]+)\/publish$/i);
          const prepareMatch = requestUrl.pathname.match(/^\/workflow\/topic\/([a-f0-9-]+)\/prepare$/i);
          const advanceMatch = requestUrl.pathname.match(/^\/workflow\/article\/([a-f0-9-]+)\/advance$/i);
          const briefMatch = requestUrl.pathname.match(/^\/workflow\/article\/([a-f0-9-]+)\/brief$/i);

          if (request.method === 'GET' && requestUrl.pathname === '/workflow/status') {
            const payload = await buildPayload(apiKey);
            const selectedTopics = payload.topics.filter((topic) => topic.status === 'Selected');
            const candidates = payload.topics.filter((topic) => topic.status === 'Candidate');
            const articlesAwaitingHuman = payload.articles.filter((article) =>
              ['Editorial Review', 'Domain Review'].includes(article.status),
            );
            sendJson(response, 200, {
              generatedAt: new Date().toISOString(),
              automationMaxStatus: AUTOMATION_MAX_STATUS,
              writeNotice: WORKFLOW_WRITE_NOTICE,
              capabilities: {
                candidateMode: 'safe-template-preview',
                canPersistTemplateCandidates: true,
                modelConnected: false,
                modelNotice: '当前未配置可信研究/写作模型。生成候选只会产生待研究模板，不会伪造资料或正文。',
              },
              queue: {
                candidateCount: candidates.length,
                selectedTopics,
                articlesAwaitingHuman,
              },
              data: payload,
            });
            return;
          }

          if (request.method === 'POST' && requestUrl.pathname === '/workflow/candidates') {
            if (!isLocalOrigin(request)) {
              sendJson(response, 403, { error: '仅允许从本机生成候选。请使用 localhost 控制台。' });
              return;
            }
            const body = await readJsonBody(request);
            const payload = await buildPayload(apiKey);
            const candidates = candidateTemplates.map((candidate) => ({
              ...candidate,
              ...auditCandidate(candidate, payload),
            }));
            if (!body.persist) {
              sendJson(response, 200, {
                mode: 'template-preview',
                warning: '这些是未研究的选题模板和初步机械查重结果，不是新闻、研究结论或可发布文章。',
                requiresAcknowledgement: true,
                candidates,
              });
              return;
            }
            if (body.acknowledgeTemplateCandidates !== true) {
              sendJson(response, 400, { error: '保存前请确认：候选仅为待研究模板，不能作为已核验事实或直接发布内容。' });
              return;
            }
            const existingKeys = new Set(payload.topics.map((topic) => normalizeForMatch(topic.topicKey)).filter(Boolean));
            if (candidates.some((candidate) => existingKeys.has(normalizeForMatch(candidate.topicKey)))) {
              throw new Error('本批模板已有记录，已停止重复保存。请在“选题与查重”中处理已有候选，或先改写核心角度。');
            }
            const created = await persistCandidates(apiKey, payload, candidateTemplates);
            sendJson(response, 201, {
              mode: 'template-persisted', created,
              warning: '已保存候选和查重审计。它们仍未经过研究；下一步仅能人工选择三篇并创建研究请求。',
              automationMaxStatus: AUTOMATION_MAX_STATUS,
            });
            return;
          }

          if (request.method === 'POST' && requestUrl.pathname === '/workflow/select') {
            if (!isLocalOrigin(request)) {
              sendJson(response, 403, { error: '仅允许从本机选择本周选题。' });
              return;
            }
            const body = await readJsonBody(request);
            const selected = await selectWeeklyTopics(apiKey, body.topicIds);
            sendJson(response, 200, {
              selected,
              nextAction: '请为每个 Selected 选题创建研究请求，并在 Evidence Ledger 完成重要论点的逐条核验。',
              automationMaxStatus: AUTOMATION_MAX_STATUS,
            });
            return;
          }

          if (request.method === 'POST' && prepareMatch) {
            if (!isLocalOrigin(request)) {
              sendJson(response, 403, { error: '仅允许从本机创建研究请求。' });
              return;
            }
            sendJson(response, 201, await prepareResearchArticle(apiKey, prepareMatch[1]));
            return;
          }

          if (request.method === 'POST' && advanceMatch) {
            if (!isLocalOrigin(request)) {
              sendJson(response, 403, { error: '仅允许从本机推进文章流程。' });
              return;
            }
            const body = await readJsonBody(request);
            sendJson(response, 200, await advanceArticle(apiKey, advanceMatch[1], body.action));
            return;
          }

          if (request.method === 'GET' && briefMatch) {
            sendJson(response, 200, await buildDraftBrief(apiKey, briefMatch[1]));
            return;
          }

          if (request.method === 'GET' && previewMatch) {
            sendJson(response, 200, await buildArticlePreview(apiKey, previewMatch[1]));
            return;
          }

          if (request.method === 'POST' && publishMatch) {
            if (!isLocalOrigin(request)) {
              sendJson(response, 403, { error: '发布操作只允许从本机控制台发起。' });
              return;
            }
            const body = await readJsonBody(request);
            sendJson(
              response,
              200,
              await publishArticle(apiKey, publishMatch[1], body.confirmationTitle || ''),
            );
            return;
          }

          if (request.method !== 'GET' || requestUrl.pathname !== '/') {
            sendJson(response, 404, { error: '找不到内容运营接口。请刷新控制台或检查本地启动器是否为最新版本。' });
            return;
          }

          const forceRefresh = requestUrl.searchParams.get('refresh') === '1';
          if (!forceRefresh && cache && cache.expiresAt > Date.now()) {
            sendJson(response, 200, cache.payload);
            return;
          }

          const payload = await buildPayload(apiKey);
          cache = { payload, expiresAt: Date.now() + 30_000 };
          sendJson(response, 200, payload);
        } catch (error) {
          console.error('[content-ops] Failed to load Notion data:', error);
          sendJson(response, 502, {
            error: actionableError(error),
          });
        }
      });
    },
  };
}
