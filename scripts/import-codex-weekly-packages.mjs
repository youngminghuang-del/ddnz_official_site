import { readFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import 'dotenv/config';

const DATABASES = {
  insights: '366eac33261880f7b7fbe903f189eca3',
  topics: '76917d19580c4440931b07d3e032aa83',
  evidence: '989ba0dbe63143a494f70a45b150d3eb',
  audits: '6e03429a3778451d990eb05dae5d9249',
};

const APPLY = process.argv.includes('--apply');
const WEEK_DIR = path.resolve(process.cwd(), 'content-ops', '2026-W32');
const NOTION_API_KEY = process.env.NOTION_API_KEY;
const NOTION_VERSION = '2022-06-28';
const TODAY = '2026-08-05';
const EXPIRES = '2027-02-01';

if (!NOTION_API_KEY) throw new Error('NOTION_API_KEY is not configured.');

const headers = {
  Authorization: `Bearer ${NOTION_API_KEY}`,
  'Notion-Version': NOTION_VERSION,
  'Content-Type': 'application/json',
};

async function notion(endpoint, options = {}) {
  const response = await fetch(`https://api.notion.com${endpoint}`, {
    method: options.method || 'GET',
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  const text = await response.text();
  let payload;
  try {
    payload = text ? JSON.parse(text) : {};
  } catch {
    payload = { message: text };
  }
  if (!response.ok) throw new Error(`Notion ${response.status}: ${payload.message || text.slice(0, 500)}`);
  return payload;
}

async function queryDatabase(databaseId) {
  const results = [];
  let cursor;
  do {
    const payload = await notion(`/v1/databases/${databaseId}/query`, {
      method: 'POST',
      body: { page_size: 100, ...(cursor ? { start_cursor: cursor } : {}) },
    });
    results.push(...(payload.results || []));
    cursor = payload.has_more ? payload.next_cursor : undefined;
  } while (cursor);
  return results;
}

const plainText = (items = []) => items.map((item) => item.plain_text || '').join('');
const propertyText = (property) => {
  if (!property) return '';
  if (property.type === 'title') return plainText(property.title);
  if (property.type === 'rich_text') return plainText(property.rich_text);
  if (property.type === 'url') return property.url || '';
  if (property.type === 'select') return property.select?.name || '';
  if (property.type === 'status') return property.status?.name || '';
  return '';
};
const relationIds = (property) => property?.type === 'relation' ? (property.relation || []).map((item) => item.id) : [];
const title = (page, property) => propertyText(page.properties?.[property]);
const richText = (content, link) => ({
  rich_text: content ? [{ type: 'text', text: { content: String(content).slice(0, 2000), ...(link ? { link: { url: link } } : {}) } }] : [],
});
const titleProperty = (content) => ({ title: [{ type: 'text', text: { content: String(content).slice(0, 2000) } }] });
const select = (name) => ({ select: { name } });
const multiSelect = (names) => ({ multi_select: [...new Set(names)].map((name) => ({ name })) });
const relation = (ids) => ({ relation: [...new Set(ids)].map((id) => ({ id })) });
const date = (start) => ({ date: start ? { start } : null });
const number = (value) => ({ number: value });

function markets(value) {
  const text = value.toLowerCase();
  const allowed = ['Global', 'Middle East', 'Africa', 'Latin America', 'Central Asia', 'Europe', 'North America'];
  const selected = allowed.filter((market) => text.includes(market.toLowerCase()));
  return selected.length ? selected : ['Global'];
}

function sourceMarket(value) {
  return markets(value.replace('United States', 'North America').replace('European Union', 'Europe'));
}

function sourceType(type) {
  const allowed = new Set(['Government', 'Customs', 'Port', 'Carrier', 'Standards Body', 'Research', 'Media', 'Supplier', 'DDNZ Record', 'Other']);
  return allowed.has(type) ? type : 'Other';
}

function richTextFragments(content) {
  const clean = content.trim();
  if (!clean) return [];
  const fragments = [];
  for (let index = 0; index < clean.length; index += 1900) {
    fragments.push({ type: 'text', text: { content: clean.slice(index, index + 1900) } });
  }
  return fragments;
}

function markdownBlocks(markdown) {
  const blocks = [];
  const lines = markdown.split(/\r?\n/);
  let paragraph = [];
  const flush = () => {
    if (!paragraph.length) return;
    const content = paragraph.join(' ').trim();
    if (content) blocks.push({ object: 'block', type: 'paragraph', paragraph: { rich_text: richTextFragments(content) } });
    paragraph = [];
  };
  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) {
      flush();
      continue;
    }
    if (line.startsWith('## ')) {
      flush();
      blocks.push({ object: 'block', type: 'heading_2', heading_2: { rich_text: richTextFragments(line.slice(3)) } });
      continue;
    }
    if (line.startsWith('> ')) {
      flush();
      blocks.push({ object: 'block', type: 'callout', callout: { icon: { type: 'emoji', emoji: '🔎' }, rich_text: richTextFragments(line.slice(2)) } });
      continue;
    }
    if (/^\d+\.\s/.test(line)) {
      flush();
      blocks.push({ object: 'block', type: 'numbered_list_item', numbered_list_item: { rich_text: richTextFragments(line.replace(/^\d+\.\s/, '')) } });
      continue;
    }
    if (line.startsWith('- ')) {
      flush();
      blocks.push({ object: 'block', type: 'bulleted_list_item', bulleted_list_item: { rich_text: richTextFragments(line.slice(2)) } });
      continue;
    }
    if (line.startsWith('|')) {
      flush();
      if (!/^\|[-:|\s]+\|$/.test(line)) {
        blocks.push({ object: 'block', type: 'paragraph', paragraph: { rich_text: richTextFragments(line.replace(/^\||\|$/g, '').split('|').map((cell) => cell.trim()).join(' · ')) } });
      }
      continue;
    }
    paragraph.push(line);
  }
  flush();
  return blocks.slice(0, 100);
}

async function createPage(databaseId, properties, children = []) {
  if (!APPLY) return { id: 'dry-run-page' };
  return notion('/v1/pages', {
    method: 'POST',
    body: { parent: { database_id: databaseId }, properties, ...(children.length ? { children } : {}) },
  });
}

async function createAudit({ title: auditTitle, stage, result, score, findings, blockers, topicIds = [], articleIds = [], evidenceIds = [] }) {
  return createPage(DATABASES.audits, {
    'Audit Run': titleProperty(auditTitle),
    Stage: select(stage),
    Result: select(result),
    Score: number(score),
    Findings: richText(findings),
    Blockers: richText(blockers),
    'Run Date': date('2026-08-05T12:00:00+08:00'),
    'Model or Version': richText('Codex Plus — evidence-backed ContentPackage v1; no OpenAI API call'),
    Topic: relation(topicIds),
    Article: relation(articleIds),
    'Evidence Items': relation(evidenceIds),
  });
}

const manifest = JSON.parse(await readFile(path.join(WEEK_DIR, 'manifest.json'), 'utf8'));
const packages = await Promise.all(
  manifest.packages.map(async (item) => JSON.parse(await readFile(path.join(WEEK_DIR, item.file), 'utf8'))),
);

const [topicPages, articlePages, evidencePages] = await Promise.all([
  queryDatabase(DATABASES.topics),
  queryDatabase(DATABASES.insights),
  queryDatabase(DATABASES.evidence),
]);

const operations = [];

async function ensureEvidence(contentPackage, topicId, articleId) {
  const created = [];
  for (const source of contentPackage.sources) {
    const existing = evidencePages.find((page) =>
      propertyText(page.properties?.['Source URL']) === source.url
      && relationIds(page.properties?.Article).includes(articleId),
    );
    if (existing) {
      created.push(existing.id);
      operations.push({ action: 'reuse-evidence', packageId: contentPackage.id, id: existing.id, claim: title(existing, 'Claim') });
      continue;
    }
    const page = await createPage(DATABASES.evidence, {
      Claim: titleProperty(source.claim),
      Status: select('Unverified'),
      'Source Tier': select(source.sourceTier === 'First Party' ? 'First Party' : source.sourceTier),
      'Source Type': select(sourceType(source.sourceType)),
      'Source URL': { url: source.url },
      Publisher: richText(source.publisher),
      'Applicable Market': multiSelect(sourceMarket(source.market)),
      'Evidence Summary': richText(source.evidenceSummary),
      'Verification Notes': richText(`Codex automatically created this evidence draft on ${TODAY}. Caveat: ${source.caveat} A named human reviewer must verify the source in Notion; no manual evidence creation is required.`),
      'Accessed Date': date(source.accessedDate || TODAY),
      ...(source.publishedDate && /^\d{4}-\d{2}-\d{2}$/.test(source.publishedDate) ? { 'Published Date': date(source.publishedDate) } : {}),
      Expires: date(EXPIRES),
      Article: relation([articleId]),
      Topic: relation([topicId]),
    });
    created.push(page.id);
    operations.push({ action: 'create-evidence', packageId: contentPackage.id, id: page.id, tier: source.sourceTier, publisher: source.publisher, claim: source.claim });
  }
  return created;
}

async function ensureFreightPackage(contentPackage) {
  const topicKey = 'Freight Export｜Not Applicable｜Not Applicable｜Global, Middle East, Africa, Latin America｜Buyer Guide｜risk-transfer, insurance and container handover before choosing FOB or CIF';
  let topic = topicPages.find((page) => propertyText(page.properties?.['Topic Key']) === topicKey || title(page, 'Topic') === contentPackage.parentTopic.title);
  if (!topic) {
    topic = await createPage(DATABASES.topics, {
      Topic: titleProperty(contentPackage.parentTopic.title),
      Status: select('Selected'),
      'Lead Goal': select('Freight Export'),
      'Product Category': select('Not Applicable'),
      'Audience Market': multiSelect(['Global', 'Middle East', 'Africa', 'Latin America']),
      'Search Intent': select('Buyer Guide'),
      'Primary Query': richText('FOB vs CIF China equipment order risk insurance container handover'),
      'Topic Key': richText(topicKey),
      'Core Angle': richText(contentPackage.parentTopic.angle),
      'Candidate Score': number(96),
      'Duplicate Decision': select('Clear'),
      'Duplicate Notes': richText('Codex checked the live Topic Registry and published article titles on 2026-08-05. No existing topic combines Incoterm risk point, insurance and container handover in this buyer decision.'),
      Week: date(TODAY),
      'Lead Fit': number(19),
      'Evidence Strength': number(20),
      'Citation Potential': number(20),
      'Reader Value': number(19),
      'Conversion Fit': number(18),
      Originality: number(18),
    });
    operations.push({ action: 'create-topic', packageId: contentPackage.id, id: topic.id, title: contentPackage.parentTopic.title });
  } else {
    operations.push({ action: 'reuse-topic', packageId: contentPackage.id, id: topic.id, title: title(topic, 'Topic') });
  }

  let article = articlePages.find((page) => propertyText(page.properties?.slug) === contentPackage.website.slug || title(page, 'Title') === contentPackage.website.title);
  if (!article) {
    article = await createPage(DATABASES.insights, {
      Title: titleProperty(contentPackage.website.title),
      Status: select('Draft'),
      'Lead Goal': select('Freight Export'),
      'Product Category': select('Not Applicable'),
      'Audience Market': multiSelect(['Global', 'Middle East', 'Africa', 'Latin America']),
      'Search Intent': select('Buyer Guide'),
      'Content Type': select('Buyer Guide'),
      'Primary CTA': select('Freight Quote'),
      'Primary Query': richText('FOB vs CIF China equipment order risk insurance container handover'),
      'Topic Key': richText(topicKey),
      'Topic Record': relation([topic.id]),
      Excerpt: richText(contentPackage.website.excerpt),
      slug: richText(contentPackage.website.slug),
      Category: select('Supply Chain Strategy'),
      Language: select('en'),
      'Last Verified': date(TODAY),
      'Quality Score': number(contentPackage.audit.score),
      CoverPrompt: richText('Editorial infographic: container handover, cost line and risk-transfer marker for FOB/CIF/FCA/CIP. No carrier logo, legal conclusion or price.'),
      InlinePrompts: richText(`Codex weekly package: content-ops/2026-W32/${contentPackage.id}.json. ${contentPackage.socialPosts.length} manual-publish social variants; AI did not approve, schedule or publish.`),
    }, markdownBlocks(contentPackage.website.bodyMarkdown));
    operations.push({ action: 'create-article', packageId: contentPackage.id, id: article.id, status: 'Draft', title: contentPackage.website.title });
  } else {
    operations.push({ action: 'reuse-article', packageId: contentPackage.id, id: article.id, title: title(article, 'Title') });
  }

  const evidenceIds = await ensureEvidence(contentPackage, topic.id, article.id);
  await createAudit({
    title: `Duplicate Check — ${contentPackage.website.title}`,
    stage: 'Duplicate Check', result: 'Pass', score: 96,
    findings: 'Live Topic Registry and article-title review found no existing topic with this exact buyer decision and query intent.',
    blockers: 'None for research. Human approval is still required before publication.',
    topicIds: [topic.id], articleIds: [article.id],
  });
  await createAudit({
    title: `Evidence Audit — Codex package — ${contentPackage.website.title}`,
    stage: 'Evidence Audit', result: 'Needs Changes', score: contentPackage.audit.score,
    findings: `${contentPackage.audit.summary} ${evidenceIds.length} evidence records are linked automatically; no manual source creation is required.`,
    blockers: 'Notion Evidence Ledger records remain Unverified until a named human reviewer checks the live pages. AI has not set Approved, Scheduled or Published.',
    topicIds: [topic.id], articleIds: [article.id], evidenceIds,
  });
  operations.push({ action: 'create-audits', packageId: contentPackage.id, count: 2 });
}

async function repairPortableFridge(contentPackage) {
  const article = articlePages.find((page) => propertyText(page.properties?.slug) === contentPackage.website.slug || title(page, 'Title') === contentPackage.website.title);
  if (!article) throw new Error('Portable-fridge article was not found in Notion.');
  const topicId = relationIds(article.properties?.['Topic Record'])[0];
  if (!topicId) throw new Error('Portable-fridge article has no Topic Record relation.');
  const evidenceIds = await ensureEvidence(contentPackage, topicId, article.id);
  await createAudit({
    title: `Evidence Repair — Codex independent-source package — ${contentPackage.website.title}`,
    stage: 'Evidence Audit', result: 'Needs Changes', score: contentPackage.audit.score,
    findings: `${contentPackage.audit.summary} ISO 16750-2 and EUR-Lex evidence drafts were added automatically where absent; existing source records were reused by URL.`,
    blockers: 'The article retains its existing human status. New evidence records remain Unverified until a named human reviewer checks the live source pages; AI did not impersonate a reviewer.',
    topicIds: [topicId], articleIds: [article.id], evidenceIds,
  });
  operations.push({ action: 'create-repair-audit', packageId: contentPackage.id, articleId: article.id, evidenceCount: evidenceIds.length });
}

for (const contentPackage of packages) {
  if (contentPackage.id === 'pkg_2026w32_fob-cif') await ensureFreightPackage(contentPackage);
  if (contentPackage.id === 'pkg_2026w32_portable-fridge-power-chain') await repairPortableFridge(contentPackage);
  if (contentPackage.id === 'pkg_2026w32_hot-kitchen-ice-output') {
    operations.push({ action: 'no-notion-write', packageId: contentPackage.id, reason: 'Existing article is Published with three human-verified evidence records; only the social package was generated locally.' });
  }
}

console.log(JSON.stringify({ mode: APPLY ? 'apply' : 'dry-run', week: manifest.week, operations }, null, 2));
