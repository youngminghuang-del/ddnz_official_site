import type { IncomingMessage, ServerResponse } from 'node:http';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import type { Plugin } from 'vite';
import { createContentOpsAiService, type ContentOpsAiConfig } from './content-ops-ai';
import { planEvidenceDrafts, type AiEvidenceSource } from './content-ops-evidence';
import type { AiJobStage, ContentOpsAiJob } from '../src/types/contentOps';

const execFileAsync = promisify(execFile);

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
  whyNow?: string;
  signalClass?: string;
  signalUrls?: string[];
  validUntil?: string;
  signalPlatform?: string;
  signalDate?: string;
  signalCount?: number;
  scoreBreakdown?: {
    recency: number;
    buyerIntent: number;
    commercialImpact: number;
    ddnzFit: number;
    evidenceFeasibility: number;
    originality: number;
  };
};

type SignalLevel = 'low' | 'medium' | 'high';

type SignalCandidateInput = {
  id?: string;
  platform: string;
  sourceUrl: string;
  observedDate: string;
  category: 'Freight Export' | 'Commercial Kitchen Equipment' | 'Outdoor Products';
  subcategory?: string;
  market: string;
  signalType: 'Product spike' | 'Route change' | 'Port disruption' | 'Freight swing' | 'Buyer question' | 'Other market change';
  title: string;
  whyNow: string;
  signalCount?: number;
  buyerIntent: SignalLevel;
  commercialImpact: SignalLevel;
  ddnzFit: SignalLevel;
  evidenceFeasibility: SignalLevel;
};

type WorkflowPayload = Awaited<ReturnType<typeof buildPayload>>;

type WebsiteDeployConfig = {
  repository: string;
  workflow: string;
  branch: string;
};

type WebsiteDeployResult = {
  triggered: boolean;
  status: 'queued' | 'scheduled-fallback';
  message: string;
  actionUrl: string;
  triggeredAt: string;
};

let cache: CacheEntry | null = null;

const AUTOMATION_MAX_STATUS = 'Domain Review';
const WORKFLOW_WRITE_NOTICE =
  'GPT/Codex 负责研究和写作；本地控制台只负责治理审核、预览和人工推送，绝不会绕过你设置 Approved、Scheduled 或 Published。';

const normalizeForMatch = (value: string) =>
  value
    .toLowerCase()
    .replace(/[\s\W_]+/gu, ' ')
    .trim();

const stableTopicKey = (candidate: Omit<CandidateDraft, 'candidateScore' | 'evidencePlan' | 'citationAsset' | 'primaryCTA' | 'title' | 'contentType'>) =>
  [
    candidate.leadGoal,
    candidate.productCategory,
    candidate.productSubcategory || 'Not Applicable',
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

async function workspaceReviewers(apiKey: string) {
  const reviewers: Array<{ id: string; name: string; email: string }> = [];
  let cursor: string | undefined;
  do {
    const result = await notionFetch(
      apiKey,
      `/v1/users?page_size=100${cursor ? `&start_cursor=${encodeURIComponent(cursor)}` : ''}`,
    );
    reviewers.push(
      ...(result.results || [])
        .filter((user: any) => user.type === 'person')
        .map((user: any) => ({
          id: user.id,
          name: user.name || user.person?.email || 'Notion reviewer',
          email: user.person?.email || '',
        })),
    );
    cursor = result.has_more ? result.next_cursor : undefined;
  } while (cursor);
  return reviewers;
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
  if (property.type === 'multi_select') {
    const values = value.split(',').map((item) => item.trim()).filter(Boolean);
    const options = property.multi_select?.options || [];
    const missing = values.find((item) => !options.some((option: any) => option.name === item));
    if (missing) {
      throw new Error(`Notion 字段“${name}”没有“${missing}”选项。请先统一分类后再重试。`);
    }
    return { [name]: { multi_select: values.map((item) => ({ name: item })) } };
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
  const articleIds = relationIds(properties.Article);
  const topicIds = relationIds(properties.Topic);
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
    articleCount: articleIds.length,
    articleIds,
    topicCount: topicIds.length,
    topicIds,
    createdTime: page.created_time,
    lastEditedTime: page.last_edited_time,
  };
}

const MINIMUM_QUALIFIED_EVIDENCE = 2;

function evidenceGate(articleId: string, evidence: ReturnType<typeof mapEvidence>[]) {
  const today = new Date().toISOString().slice(0, 10);
  const related = evidence.filter((item) => item.articleIds.includes(articleId));
  const qualified = related.filter((item) => {
    const acceptedTier = ['A', 'B', 'First Party'].includes(item.sourceTier);
    const sourceReady = item.sourceTier === 'First Party' || !!item.sourceUrl;
    return item.status === 'Verified'
      && acceptedTier
      && sourceReady
      && !!item.publisher
      && !!item.market
      && !!item.summary
      && !!item.accessedDate
      && !!item.expires
      && item.expires >= today
      && item.verifiedBy.length > 0;
  });
  const unverified = related.filter((item) => item.status === 'Unverified');
  const nonQualifying = related.filter((item) => item.status === 'Verified' && !qualified.some((qualifiedItem) => qualifiedItem.id === item.id));
  const blockers: string[] = [];
  if (qualified.length < MINIMUM_QUALIFIED_EVIDENCE) {
    blockers.push(`至少需要 ${MINIMUM_QUALIFIED_EVIDENCE} 条合格证据，当前 ${qualified.length} 条`);
  }
  if (!qualified.some((item) => ['A', 'First Party'].includes(item.sourceTier))) {
    blockers.push('至少需要 1 条 A 级官方/标准来源或可验证的一手记录');
  }
  if (new Set(qualified.map((item) => item.publisher.trim().toLowerCase())).size < 2) {
    blockers.push('合格证据必须来自至少 2 个独立发布机构');
  }
  return {
    evidenceMinimum: MINIMUM_QUALIFIED_EVIDENCE,
    qualifiedEvidenceCount: qualified.length,
    relatedEvidenceCount: related.length,
    pendingEvidenceCount: unverified.length,
    nonQualifyingEvidenceCount: nonQualifying.length,
    evidenceGateBlockers: blockers,
    evidenceReady: blockers.length === 0,
  };
}

type EvidencePersistence = {
  created: Array<{ id: string; claim: string; sourceTier: string; publisher: string; url: string }>;
  skipped: number;
  qualifyingDraftCount: number;
  tierADraftCount: number;
  message: string;
};

function evidenceExpiryDate() {
  const expires = new Date();
  expires.setUTCDate(expires.getUTCDate() + 180);
  return expires.toISOString().slice(0, 10);
}

async function buildEvidenceAutofillInput(apiKey: string, articleId: string) {
  const [page, blocks, evidencePages] = await Promise.all([
    notionFetch(apiKey, `/v1/pages/${articleId}`) as Promise<NotionPage>,
    fetchBlockChildren(apiKey, articleId),
    queryDatabase(apiKey, DATABASES.evidence),
  ]);
  const evidence = evidencePages.map(mapEvidence);
  const article = { ...mapArticle(page), ...evidenceGate(articleId, evidence) };
  const related = evidence.filter((item) => item.articleIds.includes(articleId));
  const html = await renderPreviewBlocks(apiKey, blocks);
  const bodyExcerpt = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 28_000);
  return {
    workflowMode: 'evidence_autofill',
    autoPersistEvidence: true,
    articleId,
    article: {
      title: article.title,
      status: article.status,
      audienceMarket: article.audienceMarket,
      productCategory: article.productCategory,
      productSubcategory: article.productSubcategory,
      searchIntent: article.searchIntent,
      primaryQuery: article.primaryQuery,
      topicKey: article.topicKey,
      contentType: article.contentType,
      evidenceGateBlockers: article.evidenceGateBlockers,
    },
    bodyExcerpt,
    existingEvidence: related.map((item) => ({
      claim: item.claim,
      status: item.status,
      sourceTier: item.sourceTier,
      sourceType: item.sourceType,
      publisher: item.publisher,
      url: item.sourceUrl,
      market: item.market,
      summary: item.summary,
    })),
  };
}

async function persistAiResearchEvidence(apiKey: string, job: ContentOpsAiJob): Promise<EvidencePersistence> {
  const articleId = safeText(job.input.articleId, 80);
  const ledger = (job.result as { sourceLedger?: AiEvidenceSource[] } | undefined)?.sourceLedger;
  if (job.stage !== 'research' || job.input.autoPersistEvidence !== true || !articleId || !Array.isArray(ledger)) {
    return { created: [], skipped: 0, qualifyingDraftCount: 0, tierADraftCount: 0, message: '这不是需要写入 Evidence Ledger 的自动补证据任务。' };
  }

  const [articlePage, evidencePages, evidenceSchema, auditSchema] = await Promise.all([
    notionFetch(apiKey, `/v1/pages/${articleId}`) as Promise<NotionPage>,
    queryDatabase(apiKey, DATABASES.evidence),
    databaseSchema(apiKey, DATABASES.evidence),
    databaseSchema(apiKey, DATABASES.audits),
  ]);
  const existing = evidencePages.map(mapEvidence);
  const article = mapArticle(articlePage);
  const topicIds = relationIds(articlePage.properties['Topic Record']);
  const accessedDate = new Date().toISOString().slice(0, 10);
  const expires = evidenceExpiryDate();
  const created: EvidencePersistence['created'] = [];
  // Evidence records are claim-level. The same canonical source may legitimately
  // support a different claim in another article, so de-duplicate only against
  // records already linked to this article. This still makes repeated job polls
  // idempotent without blocking reuse across the wider content library.
  const plan = planEvidenceDrafts(
    ledger,
    existing.filter((item) => item.articleIds.includes(articleId)),
    article.audienceMarket,
  );

  for (const draft of plan.drafts) {
    const properties = {
      ...titleProperty(evidenceSchema, 'Claim', draft.claim),
      Status: selectProperty(evidenceSchema, 'Status', 'Unverified'),
      'Source Tier': selectProperty(evidenceSchema, 'Source Tier', draft.sourceTier),
      'Source Type': selectProperty(evidenceSchema, 'Source Type', draft.sourceType),
      ...textOrSelectProperty(evidenceSchema, 'Source URL', draft.sourceUrl),
      ...richTextProperty(evidenceSchema, 'Publisher', draft.publisher),
      ...(evidenceSchema.properties['Applicable Market']?.type === 'multi_select'
        ? { 'Applicable Market': { multi_select: draft.markets.map((name) => ({ name })) } }
        : textOrSelectProperty(evidenceSchema, 'Applicable Market', draft.markets.join(', '))),
      ...richTextProperty(evidenceSchema, 'Evidence Summary', `${draft.evidenceSummary || draft.title}${draft.caveat ? `\n\nScope/caveat: ${draft.caveat}` : ''}`),
      ...dateProperty(evidenceSchema, 'Accessed Date', accessedDate),
      ...(draft.publishedDate ? dateProperty(evidenceSchema, 'Published Date', draft.publishedDate) : {}),
      ...dateProperty(evidenceSchema, 'Expires', expires),
      ...richTextProperty(evidenceSchema, 'Verification Notes', `AI-discovered evidence draft created by ${job.model} on ${accessedDate}. Not verified. A human reviewer must open the original source and confirm the Claim, market and caveat before this record can count.`),
      ...relationProperty(evidenceSchema, 'Article', [articleId]),
      ...relationProperty(evidenceSchema, 'Topic', topicIds),
      ...(evidenceSchema.properties['First Party']?.type === 'checkbox' ? { 'First Party': { checkbox: false } } : {}),
    };
    const page = (await notionFetch(apiKey, '/v1/pages', {
      method: 'POST',
      body: { parent: { database_id: DATABASES.evidence }, properties },
    })) as NotionPage;
    created.push({ id: page.id, claim: draft.claim, sourceTier: draft.sourceTier, publisher: draft.publisher, url: draft.sourceUrl });
  }

  if (created.length) {
    await createAutomationAudit(apiKey, auditSchema, {
      title: article.title,
      stage: 'Evidence Audit',
      result: 'Needs Changes',
      findings: `${job.model} 自动研究并写入 ${created.length} 条字段完整的 Unverified 证据草稿；没有任何记录被 AI 标记为 Verified。`,
      blockers: '请人工打开每条原始来源，确认其确实支持 Claim、适用市场和限制后，再执行确认或拒绝。',
      articleIds: [articleId],
      topicIds,
      evidenceIds: created.map((item) => item.id),
    });
    cache = null;
  }
  const qualifyingDraftCount = created.filter((item) => ['A', 'B'].includes(item.sourceTier)).length;
  const tierADraftCount = created.filter((item) => item.sourceTier === 'A').length;
  return {
    created,
    skipped: plan.skipped,
    qualifyingDraftCount,
    tierADraftCount,
    message: created.length
      ? `AI 已自动写入 ${created.length} 条待核验证据草稿，其中 A/B 级 ${qualifyingDraftCount} 条、A级 ${tierADraftCount} 条。你只需审核，不需要新建或补字段。`
      : '本次没有找到可安全写入的新来源；现有记录和重复 URL 均未改动。',
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

  const topics = topicPages
    .map(mapTopic)
    .sort((a, b) => (b.candidateScore ?? -1) - (a.candidateScore ?? -1));
  const evidence = evidencePages
    .map(mapEvidence)
    .sort((a, b) => (a.expires || '9999').localeCompare(b.expires || '9999'));
  const articles = articlePages
    .map(mapArticle)
    .map((article) => ({ ...article, ...evidenceGate(article.id, evidence) }))
    .sort((a, b) => b.lastEditedTime.localeCompare(a.lastEditedTime));
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
const candidateTemplatePool: CandidateDraft[] = [
  {
    title: 'China-to-Saudi freight documents for commercial kitchen equipment: a shipment handover checklist',
    leadGoal: 'Freight Export', productCategory: 'Not Applicable', productSubcategory: '',
    audienceMarket: 'Middle East', searchIntent: 'Buyer Guide',
    primaryQuery: 'documents needed to ship commercial kitchen equipment from China to Saudi Arabia',
    coreAngle: 'handover checklist by shipment stage', contentType: 'Buyer Guide', candidateScore: 82,
    evidencePlan: 'Saudi official import/customs guidance, carrier documentation guidance, and a scope-confirmed freight record.',
    citationAsset: 'Shipment handover document matrix', primaryCTA: '/get-a-quote',
  },
  {
    title: 'How to plan consolidation for restaurant equipment shipped from China to the UAE',
    leadGoal: 'Freight Export', productCategory: 'Not Applicable', productSubcategory: '',
    audienceMarket: 'Middle East', searchIntent: 'Buyer Guide',
    primaryQuery: 'consolidate restaurant equipment shipments from China to UAE',
    coreAngle: 'packing sequence and shipment-ready decision points', contentType: 'Buyer Guide', candidateScore: 80,
    evidencePlan: 'UAE official import guidance, carrier packing constraints, and manufacturer packing specifications.',
    citationAsset: 'Consolidation readiness checklist', primaryCTA: '/get-a-quote',
  },
  {
    title: 'Export packing requirements to confirm before shipping stainless kitchen worktables from China',
    leadGoal: 'Freight Export', productCategory: 'Not Applicable', productSubcategory: '',
    audienceMarket: 'Middle East, Africa', searchIntent: 'Buyer Guide',
    primaryQuery: 'export packing checklist stainless kitchen worktables from China',
    coreAngle: 'damage-risk controls before container loading', contentType: 'Buyer Guide', candidateScore: 78,
    evidencePlan: 'Carrier cargo packaging rules, destination-market wood-packaging requirements, and supplier packing records.',
    citationAsset: 'Packaging inspection matrix', primaryCTA: '/get-a-quote',
  },
  {
    title: 'Commercial kitchen equipment RFQ from China: the specification fields buyers should send first',
    leadGoal: 'Product Sourcing', productCategory: 'Commercial Kitchen Equipment', productSubcategory: 'Stainless and Turnkey Kitchen',
    audienceMarket: 'Middle East', searchIntent: 'Buyer Guide',
    primaryQuery: 'commercial kitchen equipment RFQ template China Saudi Arabia',
    coreAngle: 'market-bounded RFQ fields that reduce rework', contentType: 'Buyer Guide', candidateScore: 84,
    evidencePlan: 'Applicable Saudi conformity source, manufacturer data sheets from multiple suppliers, and confirmed buyer requirements.',
    citationAsset: 'Commercial kitchen RFQ specification matrix', primaryCTA: '/sourcing/commercial-kitchen-equipment-from-china',
  },
  {
    title: 'How to compare Chinese commercial upright refrigerator suppliers for a restaurant project',
    leadGoal: 'Product Sourcing', productCategory: 'Commercial Kitchen Equipment', productSubcategory: 'Commercial Refrigeration',
    audienceMarket: 'Middle East', searchIntent: 'Comparison',
    primaryQuery: 'compare commercial upright refrigerator suppliers China UAE restaurant',
    coreAngle: 'comparable capacity, climate class and service fields', contentType: 'Buyer Guide', candidateScore: 81,
    evidencePlan: 'Applicable electrical/product requirements plus comparable manufacturer technical sheets; no performance claims without test records.',
    citationAsset: 'Upright refrigerator comparison worksheet', primaryCTA: '/sourcing/commercial-kitchen-equipment-from-china',
  },
  {
    title: 'Commercial meat slicer sourcing from China: how to write a market-specific buyer brief',
    leadGoal: 'Product Sourcing', productCategory: 'Commercial Kitchen Equipment', productSubcategory: 'Food Preparation',
    audienceMarket: 'Africa', searchIntent: 'Buyer Guide',
    primaryQuery: 'commercial meat slicer sourcing China buyer brief Africa',
    coreAngle: 'intended use, power supply and safety information before supplier comparison', contentType: 'Buyer Guide', candidateScore: 77,
    evidencePlan: 'Destination-market safety requirements, supplier manuals from multiple manufacturers, and verified power-supply requirements.',
    citationAsset: 'Meat slicer buyer-brief checklist', primaryCTA: '/sourcing/commercial-kitchen-equipment-from-china',
  },
  {
    title: 'Outdoor portable refrigerator sourcing from China: a buyer checklist for the UAE',
    leadGoal: 'Product Sourcing', productCategory: 'Outdoor Products', productSubcategory: 'Outdoor and Portable Refrigeration',
    audienceMarket: 'Middle East', searchIntent: 'Buyer Guide',
    primaryQuery: 'outdoor portable refrigerator sourcing China UAE buyer checklist',
    coreAngle: 'temperature range, power inputs and transport packaging before RFQ', contentType: 'Buyer Guide', candidateScore: 83,
    evidencePlan: 'Applicable UAE market requirements, multiple supplier data sheets, and test/inspection evidence only when supplied.',
    citationAsset: 'Portable refrigerator RFQ checklist', primaryCTA: '/sourcing/outdoor-products-from-china',
  },
  {
    title: 'How to compare insulated cooler box suppliers in China for outdoor distribution',
    leadGoal: 'Product Sourcing', productCategory: 'Outdoor Products', productSubcategory: 'Insulated Coolers',
    audienceMarket: 'Middle East', searchIntent: 'Comparison',
    primaryQuery: 'compare insulated cooler box suppliers China Middle East',
    coreAngle: 'material, dimensions, temperature-test method and packaging comparison', contentType: 'Buyer Guide', candidateScore: 79,
    evidencePlan: 'Applicable product/packaging requirements, multiple technical records, and a disclosed test method where available.',
    citationAsset: 'Cooler box supplier comparison table', primaryCTA: '/sourcing/outdoor-products-from-china',
  },
  {
    title: 'Outdoor barbecue grill sourcing from China: how buyers can compare fuel, material and market scope',
    leadGoal: 'Product Sourcing', productCategory: 'Outdoor Products', productSubcategory: 'Outdoor Grills',
    audienceMarket: 'Middle East', searchIntent: 'Comparison',
    primaryQuery: 'outdoor barbecue grill sourcing China Saudi Arabia comparison',
    coreAngle: 'fuel type, material and market-specific compliance questions', contentType: 'Buyer Guide', candidateScore: 78,
    evidencePlan: 'Applicable Saudi product requirements, multiple manufacturer data sheets and verified materials documentation.',
    citationAsset: 'Outdoor grill specification comparison matrix', primaryCTA: '/sourcing/outdoor-products-from-china',
  },
  {
    title: 'Far East Asia to the Middle East PSS: what China exporters should verify in an all-in freight quote',
    leadGoal: 'Freight Export', productCategory: 'Not Applicable', productSubcategory: '',
    audienceMarket: 'Middle East', searchIntent: 'News',
    primaryQuery: 'China to Middle East all in freight quote peak season surcharge 2026',
    coreAngle: 'quote validity and surcharge line-item controls after the July PSS adjustment', contentType: 'Market Update', candidateScore: 89,
    evidencePlan: 'Current carrier PSS notices for the exact China–Middle East scope plus one independent carrier or authoritative rate source.',
    citationAsset: 'All-in freight quote validity and surcharge checklist', primaryCTA: '/get-a-quote',
    whyNow: 'A carrier PSS revision took effect in July 2026 and remains subject to current tariff and quotation checks, creating immediate quote-comparison intent.',
    signalClass: 'Recent official signal',
    signalUrls: ['https://www.maersk.com/news/articles/2026/06/15/pss-far-east-asia-to-middle-east-july'],
    validUntil: '2026-08-31',
  },
  {
    title: 'Red Sea routing changes: a booking contingency checklist for China-to-West Africa cargo',
    leadGoal: 'Freight Export', productCategory: 'Not Applicable', productSubcategory: '',
    audienceMarket: 'Africa, Middle East', searchIntent: 'News',
    primaryQuery: 'China to West Africa Red Sea route booking contingency checklist',
    coreAngle: 'route confirmation, ETA range and fallback evidence before booking', contentType: 'Market Update', candidateScore: 87,
    evidencePlan: 'Current carrier service notices, a second carrier or port source, and lane-specific booking confirmation.',
    citationAsset: 'Routing and fallback confirmation matrix', primaryCTA: '/get-a-quote',
    whyNow: 'A July 2026 WAF6 structural change returned a Middle East–West Africa service leg to the Red Sea while retaining contingency language.',
    signalClass: 'Recent official signal',
    signalUrls: ['https://www.maersk.com/news/articles/2026/07/13/structural-changes-to-waf6'],
    validUntil: '2026-09-15',
  },
  {
    title: 'Northern Mozambique imports from China: when a new shuttle changes port and inland planning',
    leadGoal: 'Freight Export', productCategory: 'Not Applicable', productSubcategory: '',
    audienceMarket: 'Africa', searchIntent: 'News',
    primaryQuery: 'ship from China to northern Mozambique Afungi shuttle route planning',
    coreAngle: 'gateway choice, transshipment and inland handover questions for northern Mozambique', contentType: 'Market Update', candidateScore: 85,
    evidencePlan: 'MSC service announcement, port or terminal confirmation, and current origin booking availability.',
    citationAsset: 'Northern Mozambique gateway decision table', primaryCTA: '/get-a-quote',
    whyNow: 'MSC announced the Afungi Shuttle in July 2026, giving northern Mozambique importers a new route-selection question to verify.',
    signalClass: 'Recent official signal',
    signalUrls: ['https://www.msc.com/en/newsroom/news/2026/july/msc-launches-afungi-shuttle-opening-a-new-gateway-to-northern-mozambique'],
    validUntil: '2026-09-30',
  },
  {
    title: 'LCL or FCL for mixed restaurant equipment from China to Ghana: a landed-cost decision matrix',
    leadGoal: 'Freight Export', productCategory: 'Not Applicable', productSubcategory: '',
    audienceMarket: 'Africa', searchIntent: 'Comparison',
    primaryQuery: 'LCL vs FCL restaurant equipment China to Ghana landed cost',
    coreAngle: 'volume, handling, destination charges and damage exposure by shipment mode', contentType: 'Comparison', candidateScore: 83,
    evidencePlan: 'Current carrier or forwarder charge structures, Ghana import guidance, and item-level packing dimensions.',
    citationAsset: 'LCL-versus-FCL landed-cost worksheet', primaryCTA: '/get-a-quote',
    whyNow: 'Mixed-equipment buyers often request a quote before packed dimensions are stable; the decision matrix captures high-intent quotation traffic.',
    signalClass: 'Recurring buyer question',
  },
  {
    title: 'Door-to-door commercial kitchen freight from China to Riyadh: charges buyers should request before booking',
    leadGoal: 'Freight Export', productCategory: 'Not Applicable', productSubcategory: '',
    audienceMarket: 'Middle East', searchIntent: 'Buyer Guide',
    primaryQuery: 'door to door commercial kitchen shipping China to Riyadh charges',
    coreAngle: 'scope boundary between origin, ocean, destination and final-delivery charges', contentType: 'Buyer Guide', candidateScore: 84,
    evidencePlan: 'Saudi customs and import sources, current carrier quotation terms, and destination-agent charge confirmation.',
    citationAsset: 'Door-to-door quote scope matrix', primaryCTA: '/get-a-quote',
    whyNow: 'This query sits close to quotation and exposes a common conversion blocker: buyers cannot compare offers with different destination scopes.',
    signalClass: 'Recurring buyer question',
  },
  {
    title: 'Shipping refrigeration equipment from China to Kenya: a pre-booking packing and measurement checklist',
    leadGoal: 'Freight Export', productCategory: 'Not Applicable', productSubcategory: '',
    audienceMarket: 'Africa', searchIntent: 'Buyer Guide',
    primaryQuery: 'ship commercial refrigeration equipment China to Kenya packing checklist',
    coreAngle: 'packed dimensions, fragile components, upright handling and document handover', contentType: 'Buyer Guide', candidateScore: 81,
    evidencePlan: 'Kenya import guidance, carrier packing rules, and model-specific supplier packing records.',
    citationAsset: 'Refrigeration shipment measurement sheet', primaryCTA: '/get-a-quote',
    whyNow: 'Buyers searching a destination-specific packing checklist are usually preparing an RFQ or shipment, making the CTA naturally immediate.',
    signalClass: 'Recurring buyer question',
  },
  {
    title: 'Commercial refrigerators for Gulf kitchens: how to verify climate class and high-ambient performance claims',
    leadGoal: 'Product Sourcing', productCategory: 'Commercial Kitchen Equipment', productSubcategory: 'Commercial Refrigeration',
    audienceMarket: 'Middle East', searchIntent: 'Buyer Guide',
    primaryQuery: 'commercial refrigerator climate class high ambient Gulf kitchen China supplier',
    coreAngle: 'declared climate class, test conditions and installation limits before supplier comparison', contentType: 'Buyer Guide', candidateScore: 88,
    evidencePlan: 'Applicable product standard, multiple model data sheets, disclosed test conditions, and DDNZ inspection evidence only if available.',
    citationAsset: 'High-ambient refrigeration evidence matrix', primaryCTA: '/sourcing/commercial-kitchen-equipment-from-china',
    whyNow: 'Peak Gulf heat makes ambient limits and ventilation immediately relevant, while buyers often see unsupported “tropical” claims.',
    signalClass: 'Seasonal buyer intent',
  },
  {
    title: 'Restaurant equipment for Saudi 60 Hz projects: a model-number and data-plate checklist',
    leadGoal: 'Product Sourcing', productCategory: 'Commercial Kitchen Equipment', productSubcategory: 'Commercial Cooking',
    audienceMarket: 'Middle East', searchIntent: 'Buyer Guide',
    primaryQuery: 'Saudi 60Hz commercial kitchen equipment China data plate checklist',
    coreAngle: 'model suffix, voltage, phase, frequency and release proof before purchase order', contentType: 'Buyer Guide', candidateScore: 86,
    evidencePlan: 'Saudi or GCC electrical requirements plus same-model data sheets, manuals and data-plate artwork.',
    citationAsset: 'Electrical configuration release checklist', primaryCTA: '/sourcing/commercial-kitchen-equipment-from-china',
    whyNow: 'Electrical mismatch is a pre-order decision with clear commercial consequences and strong specification-search intent.',
    signalClass: 'Recurring buyer question',
  },
  {
    title: 'Commercial ice makers from China for Dubai: water, drain and ambient fields buyers should specify',
    leadGoal: 'Product Sourcing', productCategory: 'Commercial Kitchen Equipment', productSubcategory: 'Bar and Beverage',
    audienceMarket: 'Middle East', searchIntent: 'Buyer Guide',
    primaryQuery: 'commercial ice maker China Dubai water drain ambient specification',
    coreAngle: 'site utilities and operating conditions before comparing nominal ice output', contentType: 'Buyer Guide', candidateScore: 84,
    evidencePlan: 'Applicable UAE requirements and several manufacturer installation manuals with model-level conditions.',
    citationAsset: 'Ice-maker site-condition RFQ sheet', primaryCTA: '/sourcing/commercial-kitchen-equipment-from-china',
    whyNow: 'Hot-weather beverage demand brings ice output questions forward, but utility and ambient conditions determine whether catalog figures are comparable.',
    signalClass: 'Seasonal buyer intent',
  },
  {
    title: 'Gas griddles for Saudi commercial kitchens: fuel, pressure and conversion documents to confirm before PO',
    leadGoal: 'Product Sourcing', productCategory: 'Commercial Kitchen Equipment', productSubcategory: 'Commercial Cooking',
    audienceMarket: 'Middle East', searchIntent: 'Compliance',
    primaryQuery: 'Saudi commercial gas griddle China fuel pressure compliance documents',
    coreAngle: 'gas family, inlet pressure, regulator and model-specific conformity evidence', contentType: 'Buyer Guide', candidateScore: 85,
    evidencePlan: 'Applicable Saudi/GCC gas-appliance requirements, multiple manuals, and model-specific label or test records.',
    citationAsset: 'Gas appliance configuration and evidence matrix', primaryCTA: '/sourcing/commercial-kitchen-equipment-from-china',
    whyNow: 'Fuel and pressure are high-risk purchase fields that generic catalog comparisons omit, giving the article strong RFQ utility.',
    signalClass: 'Recurring buyer question',
  },
  {
    title: 'Turnkey hotel kitchen sourcing from China: how to control BOQ substitutions before shipment',
    leadGoal: 'Product Sourcing', productCategory: 'Commercial Kitchen Equipment', productSubcategory: 'Stainless and Turnkey Kitchen',
    audienceMarket: 'Middle East, Africa', searchIntent: 'Buyer Guide',
    primaryQuery: 'turnkey hotel kitchen equipment China BOQ substitution control',
    coreAngle: 'approved-equivalent rules, model register and exception closure across a project BOQ', contentType: 'Buyer Guide', candidateScore: 83,
    evidencePlan: 'Project specification records, supplier technical submissions, and genuine DDNZ inspection data only when confirmed.',
    citationAsset: 'BOQ substitution-control register', primaryCTA: '/sourcing/commercial-kitchen-equipment-from-china',
    whyNow: 'Project buyers search for control methods when quotations contain mixed brands and late substitutions; the register supports a sourcing enquiry.',
    signalClass: 'Recurring buyer question',
  },
  {
    title: 'Commercial bar stations from China: drainage, water and stainless details to freeze before fabrication',
    leadGoal: 'Product Sourcing', productCategory: 'Commercial Kitchen Equipment', productSubcategory: 'Bar and Beverage',
    audienceMarket: 'Middle East, Africa', searchIntent: 'Buyer Guide',
    primaryQuery: 'custom commercial bar station China drainage water stainless specification',
    coreAngle: 'site interface and fabrication drawing release before production', contentType: 'Buyer Guide', candidateScore: 82,
    evidencePlan: 'Approved layout, utility schedule, material specification and supplier fabrication drawings.',
    citationAsset: 'Custom bar-station drawing release checklist', primaryCTA: '/sourcing/commercial-kitchen-equipment-from-china',
    whyNow: 'Custom bar enquiries convert when buyers can submit dimensions and utilities; this asset shortens the path from search to scoped RFQ.',
    signalClass: 'Recurring buyer question',
  },
  {
    title: 'Portable refrigerators for Gulf summer: how buyers should compare DC input, ambient limits and real power draw',
    leadGoal: 'Product Sourcing', productCategory: 'Outdoor Products', productSubcategory: 'Outdoor and Portable Refrigeration',
    audienceMarket: 'Middle East', searchIntent: 'Comparison',
    primaryQuery: 'portable refrigerator Gulf summer DC power ambient temperature comparison China',
    coreAngle: 'comparable test conditions for power use and cooling performance', contentType: 'Comparison', candidateScore: 88,
    evidencePlan: 'Applicable product requirements, several supplier technical sheets, and a disclosed test protocol for any performance comparison.',
    citationAsset: 'Portable-fridge power and ambient test matrix', primaryCTA: '/sourcing/outdoor-products-from-china',
    whyNow: 'High summer temperatures make power consumption and ambient limits urgent purchasing questions for Gulf distributors.',
    signalClass: 'Seasonal buyer intent',
  },
  {
    title: 'Portable refrigerators for Brazil outdoor retail: 12 V, compressor and after-sales questions distributors should ask',
    leadGoal: 'Product Sourcing', productCategory: 'Outdoor Products', productSubcategory: 'Outdoor and Portable Refrigeration',
    audienceMarket: 'Central and South America', searchIntent: 'Buyer Guide',
    primaryQuery: 'portable refrigerator China Brazil distributor 12V compressor after sales checklist',
    coreAngle: 'retail use case, power architecture, compressor documentation and spare-parts support before ordering', contentType: 'Buyer Guide', candidateScore: 86,
    evidencePlan: 'Multiple exact-model supplier records, compressor documentation, packaging data and applicable Brazilian market requirements.',
    citationAsset: 'Portable-fridge distributor RFQ and spare-parts matrix', primaryCTA: '/sourcing/outdoor-products-from-china',
    whyNow: 'Distributor questions around vehicle use, delivery damage and after-sales parts create a stronger sourcing angle than a generic product catalogue.',
    signalClass: 'Recurring buyer question',
  },
  {
    title: 'Insulated cooler boxes for African cold-chain distribution: a payload and test-duration buyer matrix',
    leadGoal: 'Product Sourcing', productCategory: 'Outdoor Products', productSubcategory: 'Insulated Coolers',
    audienceMarket: 'Africa', searchIntent: 'Buyer Guide',
    primaryQuery: 'insulated cooler box China Africa cold chain test duration payload',
    coreAngle: 'test method, payload ratio, opening cycle and ambient conditions before comparing hold time', contentType: 'Buyer Guide', candidateScore: 85,
    evidencePlan: 'Applicable food-contact or use requirements, multiple technical records, and a disclosed thermal test method.',
    citationAsset: 'Cooler thermal-test method worksheet', primaryCTA: '/sourcing/outdoor-products-from-china',
    whyNow: 'Cold-chain buyers search for hold time, but a method-based matrix creates more trust and quotation value than unsupported hour claims.',
    signalClass: 'Recurring buyer question',
  },
  {
    title: 'Outdoor grills for coastal Gulf markets: corrosion, fuel and spare-parts checks before supplier selection',
    leadGoal: 'Product Sourcing', productCategory: 'Outdoor Products', productSubcategory: 'Outdoor Grills',
    audienceMarket: 'Middle East', searchIntent: 'Comparison',
    primaryQuery: 'outdoor grill China coastal Gulf corrosion fuel spare parts comparison',
    coreAngle: 'coastal exposure, fuel configuration and service-parts availability', contentType: 'Comparison', candidateScore: 83,
    evidencePlan: 'Applicable market requirements, materials and coating records, fuel documentation and supplier spare-parts lists.',
    citationAsset: 'Coastal outdoor-grill comparison matrix', primaryCTA: '/sourcing/outdoor-products-from-china',
    whyNow: 'Distributors planning the cooler outdoor season can use coastal durability and parts support to separate comparable suppliers.',
    signalClass: 'Seasonal buyer intent',
  },
  {
    title: 'Solar-ready portable refrigerators from China: battery protection and connector checks for African distributors',
    leadGoal: 'Product Sourcing', productCategory: 'Outdoor Products', productSubcategory: 'Accessories and Power',
    audienceMarket: 'Africa', searchIntent: 'Buyer Guide',
    primaryQuery: 'solar portable refrigerator China Africa battery protection connector checklist',
    coreAngle: 'power architecture, low-voltage protection and connector compatibility before bundle approval', contentType: 'Buyer Guide', candidateScore: 84,
    evidencePlan: 'Exact-model electrical records, solar controller or battery specifications, and applicable safety requirements.',
    citationAsset: 'Off-grid refrigerator power-chain checklist', primaryCTA: '/sourcing/outdoor-products-from-china',
    whyNow: 'Off-grid buyers need a complete power-chain answer rather than a refrigerator-only catalog, creating a clear bundled-sourcing enquiry.',
    signalClass: 'Recurring buyer question',
  },
  {
    title: 'Rotomolded or injection-moulded coolers from China: what evidence should support a durability claim?',
    leadGoal: 'Product Sourcing', productCategory: 'Outdoor Products', productSubcategory: 'Insulated Coolers',
    audienceMarket: 'Middle East, Africa', searchIntent: 'Comparison',
    primaryQuery: 'rotomolded vs injection molded cooler China durability evidence',
    coreAngle: 'construction, wall section, hardware, test method and landed-cost trade-offs', contentType: 'Comparison', candidateScore: 82,
    evidencePlan: 'Multiple supplier construction records, material declarations, test methods and packing dimensions.',
    citationAsset: 'Cooler construction evidence comparison table', primaryCTA: '/sourcing/outdoor-products-from-china',
    whyNow: 'This comparison query attracts buyers who have moved beyond basic price search and are deciding product positioning and supplier tier.',
    signalClass: 'Recurring buyer question',
  },
];

const signalPlatforms = new Set(['Reddit', 'Facebook', 'LinkedIn', 'TikTok', 'Carrier / Port', 'Other']);
const signalCategories = new Set(['Freight Export', 'Commercial Kitchen Equipment', 'Outdoor Products']);
const signalTypes = new Set(['Product spike', 'Route change', 'Port disruption', 'Freight swing', 'Buyer question', 'Other market change']);
const signalLevels = new Set(['low', 'medium', 'high']);

const shanghaiDateString = () => new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Asia/Shanghai', year: 'numeric', month: '2-digit', day: '2-digit',
}).format(new Date());

function safeText(value: unknown, maximum = 500) {
  return typeof value === 'string' ? value.trim().slice(0, maximum) : '';
}

function assertSignalUrl(value: string) {
  try {
    const parsed = new URL(value);
    if (!['http:', 'https:'].includes(parsed.protocol)) throw new Error('unsupported protocol');
  } catch {
    throw new Error(`线索 URL 无效：“${value || '空白'}”。请粘贴完整的 http(s) 链接。`);
  }
}

function parseSignalCandidates(value: unknown): SignalCandidateInput[] {
  if (!Array.isArray(value) || value.length < 8 || value.length > 12) {
    throw new Error('快速热点扫描需要一次提交 8–12 条线索，才能完成查重和三类选题比较。');
  }
  const today = shanghaiDateString();
  return value.map((raw, index) => {
    const item = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;
    const platform = safeText(item.platform, 40);
    const sourceUrl = safeText(item.sourceUrl, 1000);
    const observedDate = safeText(item.observedDate, 10);
    const category = safeText(item.category, 80);
    const subcategory = safeText(item.subcategory, 120);
    const market = safeText(item.market, 120);
    const signalType = safeText(item.signalType, 80);
    const title = safeText(item.title, 240);
    const whyNow = safeText(item.whyNow, 600);
    const buyerIntent = safeText(item.buyerIntent, 12);
    const commercialImpact = safeText(item.commercialImpact, 12);
    const ddnzFit = safeText(item.ddnzFit, 12);
    const evidenceFeasibility = safeText(item.evidenceFeasibility, 12);
    const signalCount = Math.max(1, Math.min(20, Math.round(Number(item.signalCount) || 1)));

    if (!signalPlatforms.has(platform)) throw new Error(`第 ${index + 1} 条线索的平台不受支持。`);
    assertSignalUrl(sourceUrl);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(observedDate) || observedDate > today) {
      throw new Error(`第 ${index + 1} 条线索的发现日期无效或晚于今天。`);
    }
    if (!signalCategories.has(category)) throw new Error(`第 ${index + 1} 条线索没有选择正确的业务分类。`);
    if (!market) throw new Error(`第 ${index + 1} 条线索缺少目标市场。`);
    if (!signalTypes.has(signalType)) throw new Error(`第 ${index + 1} 条线索没有选择市场变化类型。`);
    if (category === 'Freight Export' && signalType === 'Product spike') {
      throw new Error(`第 ${index + 1} 条线索的“爆品/需求升温”应归入商厨或户外用品。`);
    }
    if (category !== 'Freight Export' && ['Route change', 'Port disruption', 'Freight swing'].includes(signalType)) {
      throw new Error(`第 ${index + 1} 条产品线索误选了货运市场变化类型。`);
    }
    if (title.length < 12) throw new Error(`第 ${index + 1} 条线索的“文章要回答什么”过短。`);
    if (whyNow.length < 10) throw new Error(`第 ${index + 1} 条线索的“为什么现在”过短。`);
    [buyerIntent, commercialImpact, ddnzFit, evidenceFeasibility].forEach((level) => {
      if (!signalLevels.has(level)) throw new Error(`第 ${index + 1} 条线索的评分选项不完整。`);
    });

    return {
      id: safeText(item.id, 80), platform, sourceUrl, observedDate,
      category: category as SignalCandidateInput['category'], subcategory, market,
      signalType: signalType as SignalCandidateInput['signalType'], title, whyNow, signalCount,
      buyerIntent: buyerIntent as SignalLevel,
      commercialImpact: commercialImpact as SignalLevel,
      ddnzFit: ddnzFit as SignalLevel,
      evidenceFeasibility: evidenceFeasibility as SignalLevel,
    };
  });
}

function levelPoints(level: SignalLevel, maximum: number) {
  if (level === 'high') return maximum;
  if (level === 'medium') return Math.round(maximum * 0.64);
  return Math.round(maximum * 0.32);
}

function recencyPoints(observedDate: string) {
  const observed = new Date(`${observedDate}T00:00:00Z`).getTime();
  const today = new Date(`${shanghaiDateString()}T00:00:00Z`).getTime();
  const age = Math.max(0, Math.floor((today - observed) / 86_400_000));
  if (age <= 7) return 25;
  if (age <= 14) return 18;
  if (age <= 30) return 10;
  return 4;
}

function signalCoreAngle(type: SignalCandidateInput['signalType'], category: SignalCandidateInput['category']) {
  const angles: Record<SignalCandidateInput['signalType'], string> = {
    'Product spike': 'buyer-demand signal, model fit, supplier evidence and shipment readiness',
    'Route change': 'service scope, first sailing, transit assumptions and fallback checks before booking',
    'Port disruption': 'cut-off, delay exposure, destination charges and alternate-gateway decisions',
    'Freight swing': 'quote validity, surcharge scope and booking timing after a rapid rate change',
    'Buyer question': category === 'Freight Export'
      ? 'a recurring buyer decision answered with an operational shipping checklist'
      : 'a recurring buyer decision answered with a sourcing and supplier-comparison checklist',
    'Other market change': 'what changed, who is affected and the next operational decision',
  };
  return angles[type];
}

function signalEvidencePlan(input: SignalCandidateInput) {
  if (input.category === 'Freight Export') {
    return 'Use the social post only to discover the angle. Verify the change with current carrier, port or terminal notices plus one independent authoritative source before drafting.';
  }
  return 'Use the social post only to discover buyer demand. Verify product claims with applicable market requirements and multiple current supplier technical records; do not infer sales volume from engagement.';
}

function signalCitationAsset(input: SignalCandidateInput) {
  if (input.signalType === 'Freight swing') return 'Lane-specific quote validity and surcharge comparison table';
  if (input.signalType === 'Route change') return 'Service-change verification and booking decision matrix';
  if (input.signalType === 'Port disruption') return 'Port disruption response checklist';
  if (input.signalType === 'Product spike') return 'Buyer-demand-to-specification sourcing matrix';
  return input.category === 'Freight Export' ? 'Operational shipping decision checklist' : 'Supplier evidence comparison table';
}

function candidateFromSignal(input: SignalCandidateInput): CandidateDraft {
  const breakdown = {
    recency: recencyPoints(input.observedDate),
    buyerIntent: levelPoints(input.buyerIntent, 25),
    commercialImpact: levelPoints(input.commercialImpact, 20),
    ddnzFit: levelPoints(input.ddnzFit, 15),
    evidenceFeasibility: levelPoints(input.evidenceFeasibility, 10),
    originality: 5,
  };
  const productCategory = input.category === 'Freight Export' ? 'Not Applicable' : input.category;
  const isMarketUpdate = ['Product spike', 'Route change', 'Port disruption', 'Freight swing', 'Other market change'].includes(input.signalType);
  return {
    title: input.title,
    leadGoal: input.category === 'Freight Export' ? 'Freight Export' : 'Product Sourcing',
    productCategory,
    productSubcategory: input.subcategory || '',
    audienceMarket: input.market,
    searchIntent: isMarketUpdate ? 'News' : 'Buyer Guide',
    primaryQuery: input.title,
    coreAngle: signalCoreAngle(input.signalType, input.category),
    contentType: isMarketUpdate ? 'Market Update' : 'Buyer Guide',
    candidateScore: Object.values(breakdown).reduce((total, score) => total + score, 0),
    evidencePlan: signalEvidencePlan(input),
    citationAsset: signalCitationAsset(input),
    primaryCTA: input.category === 'Freight Export'
      ? '/get-a-quote'
      : input.category === 'Commercial Kitchen Equipment'
        ? '/sourcing/commercial-kitchen-equipment-from-china'
        : '/sourcing/outdoor-products-from-china',
    whyNow: input.whyNow,
    signalClass: `${input.platform} · ${input.signalType}`,
    signalUrls: [input.sourceUrl],
    signalPlatform: input.platform,
    signalDate: input.observedDate,
    signalCount: input.signalCount,
    scoreBreakdown: breakdown,
  };
}

function scoreWithOriginality(candidate: CandidateDraft, originality: number) {
  if (!candidate.scoreBreakdown) return candidate.candidateScore;
  const { recency, buyerIntent, commercialImpact, ddnzFit, evidenceFeasibility } = candidate.scoreBreakdown;
  return recency + buyerIntent + commercialImpact + ddnzFit + evidenceFeasibility + originality;
}

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
      candidateScore: scoreWithOriginality(candidate, 0),
      scoreBreakdown: candidate.scoreBreakdown ? { ...candidate.scoreBreakdown, originality: 0 } : undefined,
      duplicateDecision: 'Rejected',
      duplicateNotes: `阻止创建：与现有记录“${match.title}”存在相同 Topic Key 或 Primary Query。应更新、合并或改写搜索意图。`,
      matchedRecord: { id: match.id, title: match.title, kind: exactTopic ? 'topic' : 'article' },
    };
  }
  if (overlap && overlap.score >= 0.72) {
    return {
      topicKey,
      candidateScore: scoreWithOriginality(candidate, 2),
      scoreBreakdown: candidate.scoreBreakdown ? { ...candidate.scoreBreakdown, originality: 2 } : undefined,
      duplicateDecision: 'Needs Review',
      duplicateNotes: `疑似核心答案重叠（与“${overlap.item.title}”词项重合度 ${Math.round(overlap.score * 100)}%）。人工确认有新法规、成本、流程、风险或产品选择价值后才能选择。`,
      matchedRecord: { id: overlap.item.id, title: overlap.item.title, kind: 'article' },
    };
  }
  return {
    topicKey,
    candidateScore: scoreWithOriginality(candidate, 5),
    scoreBreakdown: candidate.scoreBreakdown ? { ...candidate.scoreBreakdown, originality: 5 } : undefined,
    duplicateDecision: 'Clear',
    duplicateNotes: '通过初步机械查重：未发现相同 Primary Query 或 Topic Key。仍需在研究阶段复核章节和核心答案。',
    matchedRecord: null,
  };
}

const candidateCategory = (candidate: CandidateDraft) =>
  candidate.leadGoal === 'Freight Export' ? 'Freight Export' : candidate.productCategory;

function candidateBatch(payload: WorkflowPayload, requestedBatch: number) {
  const today = new Date().toISOString().slice(0, 10);
  const audited = candidateTemplatePool
    .filter((candidate) => !candidate.validUntil || candidate.validUntil >= today)
    .map((candidate) => ({ ...candidate, ...auditCandidate(candidate, payload) }));
  const available = audited.filter((candidate) => candidate.duplicateDecision !== 'Rejected');
  const batch = Number.isInteger(requestedBatch) && requestedBatch >= 0 ? requestedBatch : 0;
  const perCategory = 3;
  const categories = ['Freight Export', 'Commercial Kitchen Equipment', 'Outdoor Products'];
  const candidates = categories.flatMap((category) => {
    const group = available
      .filter((candidate) => candidateCategory(candidate) === category)
      .sort((left, right) => {
        if (left.duplicateDecision === right.duplicateDecision) return right.candidateScore - left.candidateScore;
        return left.duplicateDecision === 'Clear' ? -1 : 1;
      });
    return group.slice(batch * perCategory, (batch + 1) * perCategory);
  });
  const hasMore = categories.some((category) =>
    available.filter((candidate) => candidateCategory(candidate) === category).length > (batch + 1) * perCategory,
  );
  return {
    batch,
    nextBatch: hasMore ? batch + 1 : null,
    candidates,
    availableCount: available.length,
    rejectedCount: audited.length - available.length,
  };
}

function signalCandidateBatch(payload: WorkflowPayload, inputs: SignalCandidateInput[]) {
  const candidates = inputs
    .map(candidateFromSignal)
    .map((candidate) => ({ ...candidate, ...auditCandidate(candidate, payload) }))
    .sort((left, right) => right.candidateScore - left.candidateScore);
  return {
    batch: 0,
    nextBatch: null,
    candidates,
    availableCount: candidates.filter((candidate) => candidate.duplicateDecision !== 'Rejected').length,
    rejectedCount: candidates.filter((candidate) => candidate.duplicateDecision === 'Rejected').length,
  };
}

async function createAutomationAudit(
  apiKey: string,
  auditSchema: DatabaseSchema,
  input: { title: string; stage: string; result: 'Pass' | 'Needs Changes' | 'Blocked'; findings: string; blockers?: string; topicIds?: string[]; articleIds?: string[]; evidenceIds?: string[]; reviewerIds?: string[] },
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
    ...relationProperty(auditSchema, 'Evidence Items', input.evidenceIds || []),
    ...(input.reviewerIds?.length && auditSchema.properties.Reviewer?.type === 'people'
      ? { Reviewer: { people: input.reviewerIds.map((id) => ({ id })) } }
      : {}),
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
    const status = outcome.duplicateDecision === 'Rejected' || outcome.candidateScore < 75 ? 'Rejected' : 'Candidate';
    const signalContext = candidate.signalPlatform
      ? `\n\n热点线索：${candidate.signalPlatform}｜发现日期 ${candidate.signalDate || '未记录'}｜相似信号 ${candidate.signalCount || 1} 条\n线索 URL：${candidate.signalUrls?.join(' · ') || '未记录'}\n为什么现在：${candidate.whyNow || '未记录'}\n注意：社交平台线索仅用于发现选题，不能作为正文重要结论的证据。`
      : '';
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
      ...numberProperty(topicSchema, 'Candidate Score', outcome.candidateScore),
      ...optionalSelectProperty(topicSchema, 'Duplicate Decision', outcome.duplicateDecision),
      ...richTextProperty(topicSchema, 'Duplicate Notes', `${outcome.duplicateNotes}\n\n证据计划：${candidate.evidencePlan}\n可引用资产：${candidate.citationAsset}\n建议 CTA：${candidate.primaryCTA}${signalContext}`),
      ...dateProperty(topicSchema, 'Week', week),
    };
    const page = (await notionFetch(apiKey, '/v1/pages', {
      method: 'POST', body: { parent: { database_id: DATABASES.topics }, properties },
    })) as NotionPage;
    await createAutomationAudit(apiKey, auditSchema, {
      title: candidate.title,
      stage: 'Duplicate Check',
      result: outcome.duplicateDecision === 'Clear' && outcome.candidateScore >= 75 ? 'Pass' : 'Needs Changes',
      findings: `候选评分 ${outcome.candidateScore}/100；${outcome.duplicateDecision === 'Clear' ? '通过初步查重' : '保留供人工复核'}。${outcome.duplicateNotes}`,
      blockers: outcome.duplicateDecision === 'Clear' && outcome.candidateScore >= 75
        ? '尚未开展研究；社交线索不得直接支持正文重要结论。'
        : outcome.candidateScore < 75
          ? `热点评分低于 75（${outcome.candidateScore}/100），不能进入研究。`
          : outcome.duplicateNotes,
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
    ...textOrSelectProperty(articleSchema, 'Primary CTA', mappedTopic.productCategory === 'Outdoor Products'
      ? 'Outdoor Products Sourcing'
      : mappedTopic.productCategory === 'Commercial Kitchen Equipment'
        ? 'Commercial Kitchen Sourcing'
        : 'Freight Quote'),
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
  const [page, articleSchema, auditSchema, evidencePages] = await Promise.all([
    notionFetch(apiKey, `/v1/pages/${articleId}`) as Promise<NotionPage>,
    databaseSchema(apiKey, DATABASES.insights), databaseSchema(apiKey, DATABASES.audits),
    queryDatabase(apiKey, DATABASES.evidence),
  ]);
  const evidence = evidencePages.map(mapEvidence);
  const gate = evidenceGate(articleId, evidence);
  const article = { ...mapArticle(page), ...gate };
  const plan = advancePlan(action);
  if (!plan.from.includes(article.status)) {
    throw new Error(`当前文章状态为“${article.status}”，不能执行此操作。请按顺序从 ${plan.from.join(' 或 ')} 推进。`);
  }
  if (['mark-evidence-ready', 'draft-request', 'editorial-ready', 'domain-ready'].includes(action) && !gate.evidenceReady) {
    throw new Error(`证据闸门未通过：${gate.evidenceGateBlockers.join('；')}。只有状态为 Verified、已指定 Verified By、字段完整、未过期的 A/B 级或一手证据才计入。`);
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
      ? '证据已通过基础闸门：达到最低数量、包含 A 级/一手来源，并来自至少两个独立发布机构。仍需在专业审核中确认每个关键结论。'
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
    article: { ...mapArticle(updated), ...gate }, stage: plan.to,
    request: { type: action, status: plan.to, instructions: requestDescription },
    notice: `${WORKFLOW_WRITE_NOTICE} 当前工作流不会执行最终发布。`,
  };
}

function evidenceReviewReadiness(item: ReturnType<typeof mapEvidence>) {
  const today = new Date().toISOString().slice(0, 10);
  return [
    !item.claim && 'Claim',
    !item.sourceTier && 'Source Tier',
    !item.sourceType && 'Source Type',
    item.sourceTier !== 'First Party' && !item.sourceUrl && 'Source URL',
    !item.publisher && 'Publisher',
    !item.market && 'Applicable Market',
    !item.summary && 'Evidence Summary',
    !item.accessedDate && 'Accessed Date',
    !item.expires && 'Expires',
    !!item.expires && item.expires < today && '证据已过期',
  ].filter(Boolean) as string[];
}

async function reviewEvidence(
  apiKey: string,
  evidenceId: string,
  decision: 'Verified' | 'Rejected',
  reviewerId: string,
) {
  if (!['Verified', 'Rejected'].includes(decision)) throw new Error('证据审核决定只能是 Verified 或 Rejected。');
  const [page, evidenceSchema, auditSchema, reviewers] = await Promise.all([
    notionFetch(apiKey, `/v1/pages/${evidenceId}`) as Promise<NotionPage>,
    databaseSchema(apiKey, DATABASES.evidence),
    databaseSchema(apiKey, DATABASES.audits),
    workspaceReviewers(apiKey),
  ]);
  const reviewer = reviewers.find((item) => item.id === reviewerId);
  if (!reviewer) throw new Error('请选择当前 Notion 工作区中的人工审核者。');
  const item = mapEvidence(page);
  if (decision === 'Verified') {
    const blockers = evidenceReviewReadiness(item);
    if (blockers.length) throw new Error(`这条证据还不能核验：请先补齐 ${blockers.join('、')}。`);
  }
  if (evidenceSchema.properties['Verified By']?.type !== 'people') {
    throw new Error('Evidence Ledger 的“Verified By”必须是 People 字段。');
  }
  const today = new Date().toISOString().slice(0, 10);
  const reviewNote = decision === 'Verified'
    ? `Human-reviewed in DDNZ local content control on ${today}. Reviewer confirmed that the source supports the stated claim within its recorded market and limitations.`
    : `Rejected by human reviewer in DDNZ local content control on ${today}. This record must not be used to support the article.`;
  const updated = (await notionFetch(apiKey, `/v1/pages/${evidenceId}`, {
    method: 'PATCH',
    body: {
      properties: {
        Status: selectProperty(evidenceSchema, 'Status', decision),
        'Verified By': { people: [{ id: reviewerId }] },
        ...richTextProperty(evidenceSchema, 'Verification Notes', reviewNote),
      },
    },
  })) as NotionPage;
  await createAutomationAudit(apiKey, auditSchema, {
    title: item.claim,
    stage: 'Evidence Audit',
    result: decision === 'Verified' ? 'Pass' : 'Needs Changes',
    findings: `${reviewer.name} marked this evidence record ${decision} in the local review control.`,
    blockers: decision === 'Verified' && item.sourceTier === 'C'
      ? 'Tier C supplier evidence may support exact-model comparison but cannot independently support a key regulatory or general performance conclusion.'
      : decision === 'Rejected' ? 'Rejected evidence must be replaced or removed from the article evidence package.' : '',
    topicIds: item.topicIds,
    articleIds: item.articleIds,
    evidenceIds: [evidenceId],
    reviewerIds: [reviewerId],
  });
  cache = null;
  return { evidence: mapEvidence(updated), reviewer, decision };
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

function publishEligibility(page: NotionPage, evidence: ReturnType<typeof mapEvidence>[]) {
  const gate = evidenceGate(page.id, evidence);
  const article = { ...mapArticle(page), ...gate };
  const blockers: string[] = [];
  if (!['Domain Review', 'Approved'].includes(article.status)) {
    blockers.push('文章必须处于 Domain Review 或 Approved');
  }
  if ((article.qualityScore ?? 0) < 85) blockers.push('Quality Score 必须达到 85');
  if (!article.reviewers.length) blockers.push('必须指定人工 Reviewer');
  blockers.push(...gate.evidenceGateBlockers);
  if (!article.auditCount) blockers.push('必须存在审核记录');
  if (!article.topicCount) blockers.push('必须关联 Topic Registry');
  if (!article.topicKey) blockers.push('Topic Key 不能为空');
  if (!article.primaryCTA) blockers.push('Primary CTA 不能为空');
  if (!article.lastVerified) blockers.push('Last Verified 不能为空');
  return { canPublish: blockers.length === 0, blockers };
}

async function buildArticlePreview(apiKey: string, articleId: string) {
  const [page, blocks, evidencePages] = await Promise.all([
    notionFetch(apiKey, `/v1/pages/${articleId}`) as Promise<NotionPage>,
    fetchBlockChildren(apiKey, articleId),
    queryDatabase(apiKey, DATABASES.evidence),
  ]);
  const evidence = evidencePages.map(mapEvidence);
  const gate = evidenceGate(articleId, evidence);
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
    article: { ...mapArticle(page), ...gate },
    summary: propertyValue(page.properties.Excerpt),
    coverUrl: coverUrl(page),
    html,
    wordCount,
    readMinutes: Math.max(1, Math.ceil(wordCount / 220)),
    eligibility: publishEligibility(page, evidence),
  };
}

async function readJsonBody(request: IncomingMessage, maximumBytes = 250_000) {
  let body = '';
  for await (const chunk of request) {
    body += chunk;
    if (body.length > maximumBytes) throw new Error('Request body is too large');
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
  const [page, evidencePages] = await Promise.all([
    notionFetch(apiKey, `/v1/pages/${articleId}`) as Promise<NotionPage>,
    queryDatabase(apiKey, DATABASES.evidence),
  ]);
  const evidence = evidencePages.map(mapEvidence);
  const title = titleFrom(page, 'Title') || '';
  if (!title || confirmationTitle !== title) {
    throw new Error('发布确认标题不匹配');
  }
  const eligibility = publishEligibility(page, evidence);
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

const safeCommandError = (error: unknown) => {
  const raw = error instanceof Error ? error.message : String(error || '');
  return raw
    .replace(/gho_[A-Za-z0-9_]+|github_pat_[A-Za-z0-9_]+/g, '[credential removed]')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 360);
};

async function triggerWebsiteDeploy(
  config: WebsiteDeployConfig,
  article: Pick<ReturnType<typeof mapArticle>, 'id' | 'title' | 'status'>,
): Promise<WebsiteDeployResult> {
  const actionUrl = `https://github.com/${config.repository}/actions/workflows/${encodeURIComponent(config.workflow)}`;
  const triggeredAt = new Date().toISOString();
  if (article.status !== 'Published') {
    throw new Error('只有 Published 文章可以触发网站同步。');
  }

  const reason = `DDNZ Content Ops published: ${article.title}`.slice(0, 240);
  try {
    await execFileAsync(
      'gh',
      [
        'workflow',
        'run',
        config.workflow,
        '--repo',
        config.repository,
        '--ref',
        config.branch,
        '-f',
        `reason=${reason}`,
      ],
      { timeout: 20_000, maxBuffer: 32_000 },
    );
    return {
      triggered: true,
      status: 'queued',
      message: 'GitHub Actions 网站同步已进入队列。通常几分钟内上线；定时同步仍会在每日 21:00 作为备份执行。',
      actionUrl,
      triggeredAt,
    };
  } catch (error) {
    const detail = safeCommandError(error);
    return {
      triggered: false,
      status: 'scheduled-fallback',
      message: detail.includes('auth') || detail.includes('token')
        ? 'Notion 已发布，但 GitHub 尚未授权，无法立即同步。请重新完成 GitHub 登录后点击“重新同步网站”；每日 21:00 的备份同步不受影响。'
        : `Notion 已发布，但即时网站同步未启动。可点击“重新同步网站”重试；每日 21:00 仍会自动同步。${detail ? ` 原因：${detail}` : ''}`,
      actionUrl,
      triggeredAt,
    };
  }
}

async function deployPublishedArticle(
  apiKey: string,
  articleId: string,
  config: WebsiteDeployConfig,
) {
  const page = await notionFetch(apiKey, `/v1/pages/${articleId}`) as NotionPage;
  const article = mapArticle(page);
  return {
    article,
    deployment: await triggerWebsiteDeploy(config, article),
  };
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
  if (message.includes('OpenAI API 401')) return 'OpenAI API Key 无效或已失效。请检查 .env.local 的 OPENAI_API_KEY。';
  if (message.includes('OpenAI API 403')) return 'OpenAI 项目没有调用所选模型的权限。请检查项目权限和模型访问范围。';
  if (message.includes('OpenAI API 429')) return 'OpenAI 请求达到速率或额度限制。任务和内容已保留，请稍后点击重试。';
  if (message === 'Request body is too large') return '请求内容过大。请减少一次提交的内容后再试。';
  if (message.includes('Unexpected token')) return '请求数据格式无效。请刷新控制台后重新操作。';
  return message;
}

export function createContentOpsApiPlugin(
  apiKey: string | undefined,
  deployConfig: WebsiteDeployConfig,
  aiConfig: ContentOpsAiConfig,
): Plugin {
  const aiService = createContentOpsAiService(aiConfig);
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
          const deployMatch = requestUrl.pathname.match(/^\/article\/([a-f0-9-]+)\/deploy$/i);
          const prepareMatch = requestUrl.pathname.match(/^\/workflow\/topic\/([a-f0-9-]+)\/prepare$/i);
          const advanceMatch = requestUrl.pathname.match(/^\/workflow\/article\/([a-f0-9-]+)\/advance$/i);
          const briefMatch = requestUrl.pathname.match(/^\/workflow\/article\/([a-f0-9-]+)\/brief$/i);
          const evidenceAutofillMatch = requestUrl.pathname.match(/^\/workflow\/article\/([a-f0-9-]+)\/evidence\/autofill$/i);
          const evidenceReviewMatch = requestUrl.pathname.match(/^\/workflow\/evidence\/([a-f0-9-]+)\/review$/i);
          const aiJobMatch = requestUrl.pathname.match(/^\/ai\/jobs\/([A-Za-z0-9_-]+)$/);
          const publishPlatformMatch = requestUrl.pathname.match(/^\/publish\/(linkedin|facebook|instagram|tiktok)$/);

          if (request.method === 'GET' && aiJobMatch) {
            const job = await aiService.getJob(aiJobMatch[1]);
            const evidencePersistence = job.status === 'completed' && job.input.autoPersistEvidence === true
              ? await persistAiResearchEvidence(apiKey, job)
              : undefined;
            sendJson(response, 200, { ...job, ...(evidencePersistence ? { evidencePersistence } : {}) });
            return;
          }

          if (request.method === 'POST' && evidenceAutofillMatch) {
            if (!isLocalOrigin(request)) {
              sendJson(response, 403, { error: 'AI 自动补证据只允许从本机控制台发起。' });
              return;
            }
            const input = await buildEvidenceAutofillInput(apiKey, evidenceAutofillMatch[1]);
            const job = await aiService.startJob('research', input);
            const evidencePersistence = job.status === 'completed'
              ? await persistAiResearchEvidence(apiKey, job)
              : undefined;
            sendJson(response, 202, { ...job, ...(evidencePersistence ? { evidencePersistence } : {}) });
            return;
          }

          const aiStageMatch = requestUrl.pathname.match(/^\/ai\/(topics|research|generate|audit|revise)$/);
          if (request.method === 'POST' && aiStageMatch) {
            if (!isLocalOrigin(request)) {
              sendJson(response, 403, { error: 'AI 内容任务只允许从本机控制台发起。' });
              return;
            }
            const body = await readJsonBody(request);
            if (aiStageMatch[1] === 'topics') {
              const payload = await buildPayload(apiKey);
              body.existingTopics = payload.topics.slice(0, 240).map((topic) => ({
                title: topic.title,
                topicKey: topic.topicKey,
                primaryQuery: topic.primaryQuery,
                audienceMarket: topic.audienceMarket,
                status: topic.status,
              }));
            }
            sendJson(
              response,
              202,
              await aiService.startJob(aiStageMatch[1] as AiJobStage, body),
            );
            return;
          }

          if (request.method === 'POST' && publishPlatformMatch) {
            if (!isLocalOrigin(request)) {
              sendJson(response, 403, { error: '社媒发布只允许从本机控制台发起。' });
              return;
            }
            const body = await readJsonBody(request);
            sendJson(response, 200, await aiService.publish(publishPlatformMatch[1], body));
            return;
          }

          if (request.method === 'GET' && requestUrl.pathname === '/workflow/status') {
            const [payload, reviewers, ai] = await Promise.all([
              buildPayload(apiKey),
              workspaceReviewers(apiKey),
              aiService.capabilities(),
            ]);
            const selectedTopics = payload.topics.filter((topic) => topic.status === 'Selected');
            const candidates = payload.topics.filter((topic) => topic.status === 'Candidate');
            const articlesAwaitingHuman = payload.articles.filter((article) =>
              ['Editorial Review', 'Domain Review'].includes(article.status),
            );
            sendJson(response, 200, {
              generatedAt: new Date().toISOString(),
              automationMaxStatus: AUTOMATION_MAX_STATUS,
              writeNotice: WORKFLOW_WRITE_NOTICE,
              reviewers,
              capabilities: {
                candidateMode: 'gpt-5.6-integrated',
                canPersistTemplateCandidates: true,
                modelConnected: ai.modelConnected,
                modelNotice: ai.modelConnected
                  ? 'GPT-5.6 已接入：Sol 负责选题、研究、主内容与终审；Terra 负责渠道改写和多语言适配。人工仍是唯一批准与发布主体。'
                  : '未配置 OPENAI_API_KEY。Notion 治理功能可继续使用；配置密钥并重启后即可启用六步 AI 工作台。',
                ai,
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
            const isSignalMode = body.mode === 'signals';
            const signalInputs = isSignalMode ? parseSignalCandidates(body.signals) : [];
            const preview = isSignalMode
              ? signalCandidateBatch(payload, signalInputs)
              : candidateBatch(payload, Number(body.batch || 0));
            if (!body.persist) {
              sendJson(response, 200, {
                mode: preview.candidates.length ? 'fresh-candidate-preview' : 'candidate-pool-exhausted',
                warning: isSignalMode
                  ? `已对 ${preview.candidates.length} 条市场线索完成评分和机械查重，其中 ${preview.rejectedCount} 条重复。社交平台只负责发现角度，正文重要结论仍需 A/B 级证据。`
                  : preview.candidates.length
                    ? `只显示尚未命中 Topic Key / Primary Query 的候选。${preview.rejectedCount} 个已存在模板已自动隐藏；“为什么现在”只用于发现选题，仍不是已核验事实。`
                  : '当前候选池没有更多未重复选题。不要通过改年份或换国家制造重复；请等待近期信号扫描，或根据真实询盘、Search Console 和官方变化增加新角度。',
                requiresAcknowledgement: true,
                ...preview,
              });
              return;
            }
            if (body.acknowledgeTemplateCandidates !== true) {
              sendJson(response, 400, { error: '保存前请确认：候选仅为待研究模板，不能作为已核验事实或直接发布内容。' });
              return;
            }
            const requestedKeys = Array.isArray(body.candidateTopicKeys)
              ? body.candidateTopicKeys.filter((item: unknown): item is string => typeof item === 'string')
              : [];
            const selectedTemplates = isSignalMode
              ? signalInputs.map(candidateFromSignal)
              : candidateTemplatePool.filter((candidate) => requestedKeys.includes(stableTopicKey(candidate)));
            if (selectedTemplates.length < 8 || selectedTemplates.length > 12 || selectedTemplates.length !== requestedKeys.length) {
              throw new Error('保存批次与刚才预览的 8–12 个候选不一致。请重新预览后再保存。');
            }
            const keyMismatch = selectedTemplates.some((candidate) => !requestedKeys.includes(stableTopicKey(candidate)));
            if (keyMismatch) throw new Error('热点线索在预览后发生变化。请重新查重，再保存到 Notion。');
            const rejected = isSignalMode
              ? undefined
              : selectedTemplates
                .map((candidate) => ({ candidate, audit: auditCandidate(candidate, payload) }))
                .find((item) => item.audit.duplicateDecision === 'Rejected');
            if (rejected) {
              throw new Error(`“${rejected.candidate.title}”在保存前已出现重复记录。请重新预览未重复候选。`);
            }
            const created = await persistCandidates(apiKey, payload, selectedTemplates);
            sendJson(response, 201, {
              mode: isSignalMode ? 'signal-candidates-persisted' : 'template-persisted', created,
              warning: '已保存全部候选、评分和查重审计。低于 75 分或重复项会保留为 Rejected；下一步只能从合格候选中人工选择三篇。',
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

          if (request.method === 'POST' && evidenceReviewMatch) {
            if (!isLocalOrigin(request)) {
              sendJson(response, 403, { error: '证据审核只允许从本机控制台发起。' });
              return;
            }
            const body = await readJsonBody(request);
            sendJson(
              response,
              200,
              await reviewEvidence(apiKey, evidenceReviewMatch[1], body.decision, body.reviewerId),
            );
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
            const published = await publishArticle(apiKey, publishMatch[1], body.confirmationTitle || '');
            sendJson(
              response,
              200,
              {
                ...published,
                deployment: await triggerWebsiteDeploy(deployConfig, published.article),
              },
            );
            return;
          }

          if (request.method === 'POST' && deployMatch) {
            if (!isLocalOrigin(request)) {
              sendJson(response, 403, { error: '网站同步只允许从本机控制台发起。' });
              return;
            }
            sendJson(
              response,
              200,
              await deployPublishedArticle(apiKey, deployMatch[1], deployConfig),
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
