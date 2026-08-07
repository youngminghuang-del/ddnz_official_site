import { randomUUID } from 'node:crypto';
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { SOCIAL_CHANNELS, SOCIAL_PUBLISHING_PLATFORMS, type SocialPublishingPlatform } from '../src/config/socialChannels';
import type {
  AiJobStage,
  ContentAudit,
  ContentLanguage,
  ContentOpsAiJob,
  ContentPackage,
  PublicationRecord,
  SocialPost,
} from '../src/types/contentOps';

export type ContentOpsAiConfig = {
  openaiApiKey?: string;
  directPublishEnabled: boolean;
  linkedinAccessToken?: string;
  linkedinOrganizationId?: string;
  linkedinApiVersion?: string;
  metaPageAccessToken?: string;
  metaPageId?: string;
  metaInstagramUserId?: string;
  metaGraphApiVersion?: string;
};

type OpenAiResponse = {
  id: string;
  status: string;
  model?: string;
  output_text?: string;
  output?: Array<{
    type?: string;
    content?: Array<{ type?: string; text?: string; refusal?: string }>;
  }>;
  error?: { message?: string } | null;
  incomplete_details?: { reason?: string } | null;
};

type StoredAiJob = ContentOpsAiJob & {
  openaiResponseId?: string;
};

type RuntimeState = {
  jobs: StoredAiJob[];
  publications: PublicationRecord[];
};

const RUNTIME_DIR = path.resolve(process.cwd(), 'tmp', 'content-ops-runtime');
const RUNTIME_FILE = path.join(RUNTIME_DIR, 'state.json');
const RUNTIME_TEMP_FILE = path.join(RUNTIME_DIR, 'state.pending.json');
const OPENAI_RESPONSES_URL = 'https://api.openai.com/v1/responses';
const TERMINAL_OPENAI_STATUSES = new Set(['completed', 'failed', 'cancelled', 'incomplete']);
const VERIFICATION_TTL_MS = 5 * 60_000;

const MODELS = {
  strategy: 'gpt-5.6-sol',
  adaptation: 'gpt-5.6-terra',
  classification: 'gpt-5.6-luna',
} as const;

const sourceSchema = {
  type: 'object',
  properties: {
    claim: { type: 'string' },
    title: { type: 'string' },
    publisher: { type: 'string' },
    url: { type: 'string' },
    sourceTier: { type: 'string', enum: ['A', 'B', 'C', 'First Party'] },
    sourceType: { type: 'string', enum: ['Government', 'Customs', 'Port', 'Carrier', 'Standards Body', 'Research', 'Media', 'Supplier', 'DDNZ Record', 'Other'] },
    evidenceSummary: { type: 'string' },
    publishedDate: { type: 'string' },
    accessedDate: { type: 'string' },
    market: { type: 'string' },
    caveat: { type: 'string' },
  },
  required: ['claim', 'title', 'publisher', 'url', 'sourceTier', 'sourceType', 'evidenceSummary', 'publishedDate', 'accessedDate', 'market', 'caveat'],
  additionalProperties: false,
} as const;

const evidenceAutofillSchema = {
  type: 'object',
  properties: {
    title: { type: 'string' },
    coverageSummary: { type: 'string' },
    sourceLedger: {
      type: 'array',
      maxItems: 8,
      items: sourceSchema,
    },
    unresolvedQuestions: { type: 'array', items: { type: 'string' } },
    rejectedCandidates: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          url: { type: 'string' },
          reason: { type: 'string' },
        },
        required: ['url', 'reason'],
        additionalProperties: false,
      },
    },
  },
  required: ['title', 'coverageSummary', 'sourceLedger', 'unresolvedQuestions', 'rejectedCandidates'],
  additionalProperties: false,
} as const;

const topicSchema = {
  type: 'object',
  properties: {
    weeklyRationale: { type: 'string' },
    topics: {
      type: 'array',
      minItems: 3,
      maxItems: 3,
      items: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          category: { type: 'string', enum: ['Freight Export', 'Commercial Kitchen Equipment', 'Outdoor Products'] },
          market: { type: 'string' },
          buyerQuestion: { type: 'string' },
          angle: { type: 'string' },
          whyNow: { type: 'string' },
          primaryQuery: { type: 'string' },
          targetPath: { type: 'string' },
          suggestedLanguages: {
            type: 'array',
            items: { type: 'string', enum: ['en', 'ar', 'es', 'fr'] },
          },
        },
        required: ['title', 'category', 'market', 'buyerQuestion', 'angle', 'whyNow', 'primaryQuery', 'targetPath', 'suggestedLanguages'],
        additionalProperties: false,
      },
    },
  },
  required: ['weeklyRationale', 'topics'],
  additionalProperties: false,
} as const;

const researchSchema = {
  type: 'object',
  properties: {
    title: { type: 'string' },
    market: { type: 'string' },
    thesis: { type: 'string' },
    buyerRisks: { type: 'array', items: { type: 'string' } },
    verifiedClaims: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          claim: { type: 'string' },
          support: { type: 'string' },
          sourceUrls: { type: 'array', items: { type: 'string' } },
          caveat: { type: 'string' },
        },
        required: ['claim', 'support', 'sourceUrls', 'caveat'],
        additionalProperties: false,
      },
    },
    recommendedStructure: { type: 'array', items: { type: 'string' } },
    sourceLedger: { type: 'array', items: sourceSchema },
    unresolvedQuestions: { type: 'array', items: { type: 'string' } },
  },
  required: ['title', 'market', 'thesis', 'buyerRisks', 'verifiedClaims', 'recommendedStructure', 'sourceLedger', 'unresolvedQuestions'],
  additionalProperties: false,
} as const;

const websiteSchema = {
  type: 'object',
  properties: {
    title: { type: 'string' },
    slug: { type: 'string' },
    excerpt: { type: 'string' },
    bodyMarkdown: { type: 'string' },
    seoTitle: { type: 'string' },
    seoDescription: { type: 'string' },
    ctaPath: { type: 'string' },
  },
  required: ['title', 'slug', 'excerpt', 'bodyMarkdown', 'seoTitle', 'seoDescription', 'ctaPath'],
  additionalProperties: false,
} as const;

const parentTopicSchema = {
  type: 'object',
  properties: {
    title: { type: 'string' },
    category: { type: 'string', enum: ['Freight Export', 'Commercial Kitchen Equipment', 'Outdoor Products'] },
    market: { type: 'string' },
    buyerQuestion: { type: 'string' },
    angle: { type: 'string' },
  },
  required: ['title', 'category', 'market', 'buyerQuestion', 'angle'],
  additionalProperties: false,
} as const;

const canonicalSchema = {
  type: 'object',
  properties: {
    parentTopic: parentTopicSchema,
    website: websiteSchema,
    sources: { type: 'array', items: sourceSchema },
    channelAngles: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          platform: { type: 'string', enum: SOCIAL_PUBLISHING_PLATFORMS },
          hook: { type: 'string' },
          takeaway: { type: 'string' },
          mediaBrief: { type: 'string' },
        },
        required: ['platform', 'hook', 'takeaway', 'mediaBrief'],
        additionalProperties: false,
      },
    },
  },
  required: ['parentTopic', 'website', 'sources', 'channelAngles'],
  additionalProperties: false,
} as const;

const packageOutputSchema = {
  type: 'object',
  properties: {
    parentTopic: parentTopicSchema,
    requestedLanguages: {
      type: 'array',
      items: { type: 'string', enum: ['en', 'ar', 'es', 'fr'] },
    },
    website: websiteSchema,
    localizedWebsite: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          language: { type: 'string', enum: ['en', 'ar', 'es', 'fr'] },
          ...websiteSchema.properties,
        },
        required: ['language', ...websiteSchema.required],
        additionalProperties: false,
      },
    },
    socialPosts: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          platform: { type: 'string', enum: SOCIAL_PUBLISHING_PLATFORMS },
          language: { type: 'string', enum: ['en', 'ar', 'es', 'fr'] },
          copy: { type: 'string' },
          hashtags: { type: 'array', items: { type: 'string' } },
          targetUrl: { type: 'string' },
          mediaBrief: { type: 'string' },
          publishingMode: { type: 'string', enum: ['direct-when-authorized', 'manual'] },
        },
        required: ['platform', 'language', 'copy', 'hashtags', 'targetUrl', 'mediaBrief', 'publishingMode'],
        additionalProperties: false,
      },
    },
    sources: { type: 'array', items: sourceSchema },
  },
  required: ['parentTopic', 'requestedLanguages', 'website', 'localizedWebsite', 'socialPosts', 'sources'],
  additionalProperties: false,
} as const;

const auditSchema = {
  type: 'object',
  properties: {
    status: { type: 'string', enum: ['pass', 'needs_changes'] },
    score: { type: 'number' },
    summary: { type: 'string' },
    gates: {
      type: 'array',
      minItems: 6,
      maxItems: 6,
      items: {
        type: 'object',
        properties: {
          gate: { type: 'string', enum: ['sources', 'factual', 'brand', 'language', 'sensitive', 'platform'] },
          result: { type: 'string', enum: ['pass', 'needs_changes'] },
          finding: { type: 'string' },
        },
        required: ['gate', 'result', 'finding'],
        additionalProperties: false,
      },
    },
    blockers: { type: 'array', items: { type: 'string' } },
    requiredChanges: { type: 'array', items: { type: 'string' } },
  },
  required: ['status', 'score', 'summary', 'gates', 'blockers', 'requiredChanges'],
  additionalProperties: false,
} as const;

const BASE_POLICY = `You are the DDNZ Global content operations engine. Produce practical B2B export, freight and commercial-equipment content for importers in Saudi Arabia, the UAE, Latin America, West Africa and North Africa.

Hard rules:
- Never invent a DDNZ shipment, customer, price, result, test, certification or project. Cases must be explicitly anonymized and may only use facts supplied by the user.
- Social posts may reveal a topic but cannot independently support a professional claim. Important claims require a direct official/first-party source and an independent authoritative source when available.
- Separate current fact, planning range, interpretation and recommendation. Preserve caveats and market scope.
- DDNZ Global Trade runs content, sourcing and trade support. Heaven Born International Freight executes freight operations from China. Do not imply that either entity provides legal, tax or certification approval.
- AI may create Draft, Needs Review or Audit Passed output only. It must never mark content Approved, Scheduled or Published.
- English is canonical. Arabic, Spanish and French adaptations must preserve facts, units, caveats, CTA intent and brand names.
- Return only the requested structured output.`;

const jobs = new Map<string, StoredAiJob>();
const publications: PublicationRecord[] = [];
let runtimeLoaded = false;
let persistQueue: Promise<void> = Promise.resolve();
let verificationCache: {
  expiresAt: number;
  linkedin: ChannelVerification;
  facebook: ChannelVerification;
  instagram: ChannelVerification;
} | null = null;

type ChannelVerification = {
  verified: boolean;
  status: 'verified' | 'pending_configuration' | 'permission_denied' | 'account_mismatch' | 'unavailable';
  message: string;
  checkedAt: string;
  connectedAccountId?: string;
  connectedAccountName?: string;
};

async function ensureRuntimeLoaded() {
  if (runtimeLoaded) return;
  runtimeLoaded = true;
  try {
    const stored = JSON.parse(await readFile(RUNTIME_FILE, 'utf8')) as RuntimeState;
    stored.jobs?.forEach((job) => jobs.set(job.id, job));
    publications.push(...(stored.publications || []));
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code;
    if (code !== 'ENOENT') console.warn('[content-ops-ai] Runtime state could not be read:', error);
  }
}

function persistRuntime() {
  const snapshot: RuntimeState = {
    jobs: [...jobs.values()].sort((left, right) => right.updatedAt.localeCompare(left.updatedAt)).slice(0, 80),
    publications: [...publications].sort((left, right) => right.publishedAt.localeCompare(left.publishedAt)).slice(0, 250),
  };
  persistQueue = persistQueue.then(async () => {
    await mkdir(RUNTIME_DIR, { recursive: true });
    await writeFile(RUNTIME_TEMP_FILE, JSON.stringify(snapshot, null, 2), { encoding: 'utf8', mode: 0o600 });
    await rename(RUNTIME_TEMP_FILE, RUNTIME_FILE);
  });
  return persistQueue;
}

function cleanError(value: unknown) {
  return (value instanceof Error ? value.message : String(value || 'AI request failed'))
    .replace(/sk-[A-Za-z0-9_-]+/g, '[credential removed]')
    .replace(/Bearer\s+[^\s]+/gi, 'Bearer [credential removed]')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 700);
}

function extractOutputText(response: OpenAiResponse) {
  if (response.output_text) return response.output_text;
  const parts: string[] = [];
  for (const output of response.output || []) {
    for (const content of output.content || []) {
      if (content.type === 'refusal' && content.refusal) throw new Error(`OpenAI refused the request: ${content.refusal}`);
      if (content.type === 'output_text' && content.text) parts.push(content.text);
    }
  }
  return parts.join('').trim();
}

function parseStructuredResult(response: OpenAiResponse) {
  const text = extractOutputText(response);
  if (!text) throw new Error(response.error?.message || response.incomplete_details?.reason || 'OpenAI returned no structured output.');
  try {
    return JSON.parse(text) as Record<string, unknown>;
  } catch {
    throw new Error('OpenAI returned output that could not be parsed as the required Content Ops schema.');
  }
}

function openAiStatus(status: string): ContentOpsAiJob['status'] {
  if (status === 'completed') return 'completed';
  if (status === 'failed' || status === 'incomplete') return 'failed';
  if (status === 'cancelled') return 'cancelled';
  if (status === 'in_progress') return 'in_progress';
  return 'queued';
}

function compactJson(value: unknown, maximum = 90_000) {
  const text = JSON.stringify(value);
  return text.length > maximum ? `${text.slice(0, maximum)}\n[context truncated by DDNZ Content Ops]` : text;
}

async function openAiFetch(config: ContentOpsAiConfig, endpoint: string, init?: RequestInit) {
  if (!config.openaiApiKey) throw new Error('未配置 OPENAI_API_KEY。请把密钥加入 .env.local 后重启 Content Ops。');
  const response = await fetch(`${OPENAI_RESPONSES_URL}${endpoint}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${config.openaiApiKey}`,
      'Content-Type': 'application/json',
      ...(init?.headers || {}),
    },
  });
  const text = await response.text();
  let payload: OpenAiResponse;
  try {
    payload = JSON.parse(text) as OpenAiResponse;
  } catch {
    throw new Error(`OpenAI API ${response.status}: ${text.slice(0, 400)}`);
  }
  if (!response.ok) throw new Error(`OpenAI API ${response.status}: ${payload.error?.message || text.slice(0, 400)}`);
  return payload;
}

type ResponseRequest = {
  model: string;
  system: string;
  user: string;
  schemaName: string;
  schema: Record<string, unknown>;
  reasoningEffort: 'low' | 'medium' | 'high';
  webSearch?: boolean;
};

async function createOpenAiResponse(config: ContentOpsAiConfig, request: ResponseRequest) {
  return openAiFetch(config, '', {
    method: 'POST',
    body: JSON.stringify({
      model: request.model,
      background: true,
      store: true,
      reasoning: { effort: request.reasoningEffort },
      input: [
        { role: 'system', content: request.system },
        { role: 'user', content: request.user },
      ],
      ...(request.webSearch ? { tools: [{ type: 'web_search' }] } : {}),
      text: {
        verbosity: 'medium',
        format: {
          type: 'json_schema',
          name: request.schemaName,
          schema: request.schema,
          strict: true,
        },
      },
      max_output_tokens: 28_000,
      safety_identifier: 'ddnz-content-ops-local-operator',
    }),
  });
}

function buildStageRequest(stage: Exclude<AiJobStage, 'generate'>, input: Record<string, unknown>): ResponseRequest {
  if (stage === 'topics') {
    return {
      model: MODELS.strategy,
      reasoningEffort: 'medium',
      webSearch: true,
      schemaName: 'ddnz_weekly_topics',
      schema: topicSchema,
      system: BASE_POLICY,
      user: `Create exactly three parent topics for one week: one Freight Export, one Commercial Kitchen Equipment and one Outdoor Products. Prefer useful buyer decisions over generic news. Use the supplied existing-topic registry to avoid repetition.\n\nOperator brief:\n${compactJson(input)}`,
    };
  }
  if (stage === 'research') {
    if (input.workflowMode === 'evidence_autofill') {
      return {
        model: MODELS.strategy,
        reasoningEffort: 'high',
        webSearch: true,
        schemaName: 'ddnz_evidence_autofill',
        schema: evidenceAutofillSchema,
        system: BASE_POLICY,
        user: `Repair the evidence gap for this existing DDNZ article. Read the article metadata, current body excerpt, existing evidence records and deterministic gate blockers. Use web search to discover NEW claim-level evidence and return complete Evidence Ledger drafts.

Evidence target:
- Prefer 3-6 direct, canonical source URLs. Do not repeat an existing URL or merely mirror the same publication.
- Aim for at least two A/B sources from independent publishers and at least one Tier A government, customs or standards source when genuinely applicable.
- Government, customs and standards-body sources are Tier A. Official carrier, port, academic or reputable independent research can be Tier B. Manufacturer or supplier pages are Tier C and may support only exact-model facts.
- Never label web research as First Party or DDNZ Record. Never invent a DDNZ test, shipment or inspection.
- Each Claim must be narrow enough for one source to support. Evidence Summary must explain exactly what the source supports. Caveat must state jurisdiction, product, date, test-condition or scope limits.
- market must use only these comma-separated ledger values where applicable: Global, Middle East, Africa, Latin America, Central Asia, Europe, North America.
- Return an empty sourceLedger and explain the unresolved gap if suitable evidence cannot be found. Do not lower a source tier to make the count pass.

Article and current evidence context:
${compactJson(input)}`,
      };
    }
    return {
      model: MODELS.strategy,
      reasoningEffort: 'high',
      webSearch: true,
      schemaName: 'ddnz_research_brief',
      schema: researchSchema,
      system: BASE_POLICY,
      user: `Research the selected topic for a publishable English parent article. Use web search for current sources. Record direct URLs, publisher, dates, market scope and caveats. If a claim cannot be verified, place it in unresolvedQuestions instead of presenting it as fact.\n\nSelected topic and context:\n${compactJson(input)}`,
    };
  }
  if (stage === 'audit') {
    return {
      model: MODELS.strategy,
      reasoningEffort: 'high',
      schemaName: 'ddnz_content_audit',
      schema: auditSchema,
      system: BASE_POLICY,
      user: `Audit this ContentPackage. Return all six gates exactly once: sources, factual, brand, language, sensitive and platform. Pass only when claims are supported, cases are anonymized, translations preserve meaning, platform copy fits its channel, and no approval or publication is implied.\n\nContentPackage:\n${compactJson(input.package)}`,
    };
  }
  return {
    model: MODELS.strategy,
    reasoningEffort: 'high',
    schemaName: 'ddnz_revised_content_package',
    schema: packageOutputSchema,
    system: BASE_POLICY,
    user: `Revise the ContentPackage only as needed to resolve the audit findings and operator notes. Preserve verified facts, URLs, caveats, language coverage and channel intent. Do not claim approval or publication.\n\nRevision input:\n${compactJson(input)}`,
  };
}

function generationCanonicalRequest(input: Record<string, unknown>): ResponseRequest {
  return {
    model: MODELS.strategy,
    reasoningEffort: 'high',
    schemaName: 'ddnz_canonical_content',
    schema: canonicalSchema,
    system: BASE_POLICY,
    user: `Write the canonical English website article from the verified research. Directly answer the buyer question, use short sections and include one useful Markdown checklist or comparison table. Preserve source caveats and cite source URLs in the body where relevant. Create distinct channel angles but do not write translations yet.\n\nGeneration input:\n${compactJson(input)}`,
  };
}

function generationAdaptationRequest(input: Record<string, unknown>, canonical: Record<string, unknown>): ResponseRequest {
  const requestedLanguages = Array.isArray(input.languages) ? input.languages : ['en'];
  return {
    model: MODELS.adaptation,
    reasoningEffort: 'medium',
    schemaName: 'ddnz_content_package',
    schema: packageOutputSchema,
    system: BASE_POLICY,
    user: `Package the canonical content for LinkedIn, Facebook, Instagram and TikTok. Keep English as canonical and create only these requested languages: ${requestedLanguages.join(', ')}. Produce one post per requested language per platform. LinkedIn should be expert and operational; Facebook explanatory and conversational; Instagram concise with a visual brief; TikTok a short hook/script with a manual publishing mode. Preserve every fact and caveat.\n\nCanonical content:\n${compactJson(canonical)}`,
  };
}

function safeSlug(value: string) {
  return value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 72) || `content-${Date.now()}`;
}

function normalizeLanguages(value: unknown): ContentLanguage[] {
  const values = Array.isArray(value) ? value : ['en'];
  const allowed = new Set<ContentLanguage>(['en', 'ar', 'es', 'fr']);
  const normalized = values.filter((item): item is ContentLanguage => typeof item === 'string' && allowed.has(item as ContentLanguage));
  return [...new Set<ContentLanguage>(['en', ...normalized])];
}

function targetPathForPackage(raw: Record<string, unknown>) {
  const website = (raw.website || {}) as Record<string, unknown>;
  const candidate = typeof website.ctaPath === 'string' ? website.ctaPath : '/get-a-quote';
  if (!candidate.startsWith('/') || candidate.startsWith('//')) return '/get-a-quote';
  return candidate;
}

function trackedTarget(platform: SocialPublishingPlatform, packageId: string, campaign: string, targetPath: string) {
  const url = new URL(targetPath, 'https://www.ddnzglobal.com');
  url.searchParams.set('utm_source', platform);
  url.searchParams.set('utm_medium', 'organic_social');
  url.searchParams.set('utm_campaign', campaign);
  url.searchParams.set('utm_content', packageId);
  url.searchParams.set('source', platform);
  return url.toString();
}

function normalizePackage(raw: Record<string, unknown>, input: Record<string, unknown>, version = 1): ContentPackage {
  const now = new Date().toISOString();
  const id = typeof input.packageId === 'string' ? input.packageId : `pkg_${randomUUID()}`;
  const requestedLanguages = normalizeLanguages(raw.requestedLanguages || input.languages);
  const website = raw.website as ContentPackage['website'];
  const campaign = safeSlug(website?.slug || website?.title || 'ddnz-content');
  const targetPath = targetPathForPackage(raw);
  const socialPosts = (Array.isArray(raw.socialPosts) ? raw.socialPosts : [])
    .filter((post): post is SocialPost => !!post && typeof post === 'object')
    .map((post) => ({
      ...post,
      publishingMode: post.platform === 'tiktok' ? 'manual' as const : 'direct-when-authorized' as const,
      targetUrl: trackedTarget(post.platform, id, campaign, targetPath),
    }));
  return {
    id,
    version,
    workflowStatus: 'Draft',
    parentTopic: raw.parentTopic as ContentPackage['parentTopic'],
    primaryLanguage: 'en',
    requestedLanguages,
    website: { ...website, slug: safeSlug(website?.slug || website?.title || campaign), ctaPath: targetPath },
    localizedWebsite: (Array.isArray(raw.localizedWebsite) ? raw.localizedWebsite : []) as ContentPackage['localizedWebsite'],
    socialPosts,
    sources: (Array.isArray(raw.sources) ? raw.sources : []) as ContentPackage['sources'],
    audit: {
      status: 'pending', score: 0, summary: '等待 GPT-5.6 Sol 完成六项审计。', gates: [], blockers: [], requiredChanges: [], model: '', auditedAt: '',
    },
    createdAt: typeof input.createdAt === 'string' ? input.createdAt : now,
    updatedAt: now,
    models: { canonical: MODELS.strategy, adaptation: MODELS.adaptation, audit: MODELS.strategy },
  };
}

function enrichAudit(raw: Record<string, unknown>): ContentAudit {
  const status = raw.status === 'pass' ? 'pass' : 'needs_changes';
  return {
    status,
    score: Math.max(0, Math.min(100, Number(raw.score) || 0)),
    summary: typeof raw.summary === 'string' ? raw.summary : '',
    gates: Array.isArray(raw.gates) ? raw.gates as ContentAudit['gates'] : [],
    blockers: Array.isArray(raw.blockers) ? raw.blockers.filter((item): item is string => typeof item === 'string') : [],
    requiredChanges: Array.isArray(raw.requiredChanges) ? raw.requiredChanges.filter((item): item is string => typeof item === 'string') : [],
    model: MODELS.strategy,
    auditedAt: new Date().toISOString(),
  };
}

async function finalizeCompletedJob(config: ContentOpsAiConfig, job: StoredAiJob, response: OpenAiResponse) {
  const parsed = parseStructuredResult(response);
  if (job.stage === 'generate' && job.phase === 'canonical') {
    job.intermediateResult = parsed;
    const adaptationResponse = await createOpenAiResponse(config, generationAdaptationRequest(job.input, parsed));
    job.phase = 'adaptation';
    job.model = MODELS.adaptation;
    job.openaiResponseId = adaptationResponse.id;
    job.status = openAiStatus(adaptationResponse.status);
    job.updatedAt = new Date().toISOString();
    if (adaptationResponse.status === 'completed') {
      return finalizeCompletedJob(config, job, adaptationResponse);
    }
    if (TERMINAL_OPENAI_STATUSES.has(adaptationResponse.status)) {
      job.status = adaptationResponse.status === 'cancelled' ? 'cancelled' : 'failed';
      job.error = cleanError(adaptationResponse.error?.message || adaptationResponse.incomplete_details?.reason || `OpenAI response ended with ${adaptationResponse.status}`);
    }
    return;
  }
  if (job.stage === 'generate') {
    job.result = normalizePackage(parsed, job.input, 1);
  } else if (job.stage === 'audit') {
    const contentPackage = job.input.package as ContentPackage;
    const audit = enrichAudit(parsed);
    job.result = {
      audit,
      package: {
        ...contentPackage,
        workflowStatus: audit.status === 'pass' ? 'Audit Passed' : 'Needs Review',
        audit,
        updatedAt: new Date().toISOString(),
      } satisfies ContentPackage,
    };
  } else if (job.stage === 'revise') {
    const current = job.input.package as ContentPackage;
    job.result = normalizePackage(parsed, {
      ...job.input,
      packageId: current.id,
      createdAt: current.createdAt,
    }, (current.version || 1) + 1);
  } else {
    job.result = parsed;
  }
  job.status = 'completed';
  job.updatedAt = new Date().toISOString();
}

async function syncJob(config: ContentOpsAiConfig, job: StoredAiJob) {
  if (!job.openaiResponseId || !['queued', 'in_progress'].includes(job.status)) return;
  try {
    const response = await openAiFetch(config, `/${encodeURIComponent(job.openaiResponseId)}`);
    job.status = openAiStatus(response.status);
    job.model = response.model || job.model;
    job.updatedAt = new Date().toISOString();
    if (response.status === 'completed') {
      await finalizeCompletedJob(config, job, response);
    } else if (TERMINAL_OPENAI_STATUSES.has(response.status)) {
      job.status = response.status === 'cancelled' ? 'cancelled' : 'failed';
      job.error = cleanError(response.error?.message || response.incomplete_details?.reason || `OpenAI response ended with ${response.status}`);
    }
  } catch (error) {
    job.status = 'failed';
    job.error = cleanError(error);
    job.updatedAt = new Date().toISOString();
  }
  jobs.set(job.id, job);
  await persistRuntime();
}

async function startAiJob(config: ContentOpsAiConfig, stage: AiJobStage, input: Record<string, unknown>) {
  await ensureRuntimeLoaded();
  const now = new Date().toISOString();
  const job: StoredAiJob = {
    id: `job_${randomUUID()}`,
    stage,
    status: 'queued',
    phase: stage === 'generate' ? 'canonical' : stage,
    model: stage === 'generate' ? MODELS.strategy : buildStageRequest(stage as Exclude<AiJobStage, 'generate'>, input).model,
    createdAt: now,
    updatedAt: now,
    input,
  };
  jobs.set(job.id, job);
  await persistRuntime();
  try {
    const request = stage === 'generate'
      ? generationCanonicalRequest(input)
      : buildStageRequest(stage as Exclude<AiJobStage, 'generate'>, input);
    const response = await createOpenAiResponse(config, request);
    job.openaiResponseId = response.id;
    job.status = openAiStatus(response.status);
    job.model = response.model || request.model;
    job.updatedAt = new Date().toISOString();
    if (response.status === 'completed') {
      await finalizeCompletedJob(config, job, response);
    } else if (TERMINAL_OPENAI_STATUSES.has(response.status)) {
      job.status = response.status === 'cancelled' ? 'cancelled' : 'failed';
      job.error = cleanError(response.error?.message || response.incomplete_details?.reason || `OpenAI response ended with ${response.status}`);
    }
  } catch (error) {
    job.status = 'failed';
    job.error = cleanError(error);
    job.updatedAt = new Date().toISOString();
  }
  jobs.set(job.id, job);
  await persistRuntime();
  return publicJob(job);
}

function publicJob(job: StoredAiJob): ContentOpsAiJob {
  const { openaiResponseId: _privateResponseId, ...safe } = job;
  return safe;
}

async function getAiJob(config: ContentOpsAiConfig, jobId: string) {
  await ensureRuntimeLoaded();
  const job = jobs.get(jobId);
  if (!job) throw new Error('找不到该 AI 任务。它可能已超过本地保留期限。');
  await syncJob(config, job);
  return publicJob(job);
}

function postForPackage(contentPackage: ContentPackage, platform: SocialPublishingPlatform, language: ContentLanguage) {
  return contentPackage.socialPosts.find((post) => post.platform === platform && post.language === language)
    || contentPackage.socialPosts.find((post) => post.platform === platform && post.language === 'en');
}

async function linkedInPublish(config: ContentOpsAiConfig, post: SocialPost) {
  if (!config.linkedinAccessToken || !config.linkedinOrganizationId || !config.linkedinApiVersion) {
    throw new Error('LinkedIn 尚未配置 Access Token、Organization ID 或 API Version。');
  }
  const response = await fetch('https://api.linkedin.com/rest/posts', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${config.linkedinAccessToken}`,
      'Content-Type': 'application/json',
      'LinkedIn-Version': config.linkedinApiVersion,
      'X-Restli-Protocol-Version': '2.0.0',
    },
    body: JSON.stringify({
      author: `urn:li:organization:${config.linkedinOrganizationId}`,
      commentary: `${post.copy}\n\n${post.hashtags.join(' ')}\n${post.targetUrl}`,
      visibility: 'PUBLIC',
      distribution: { feedDistribution: 'MAIN_FEED', targetEntities: [], thirdPartyDistributionChannels: [] },
      lifecycleState: 'PUBLISHED',
      isReshareDisabledByAuthor: false,
    }),
  });
  if (!response.ok) throw new Error(`LinkedIn API ${response.status}: ${(await response.text()).slice(0, 400)}`);
  return response.headers.get('x-restli-id') || response.headers.get('x-linkedin-id') || '';
}

async function facebookPublish(config: ContentOpsAiConfig, post: SocialPost) {
  if (!config.metaPageAccessToken || !config.metaPageId || !config.metaGraphApiVersion) {
    throw new Error('Meta 尚未配置 Page Access Token、Page ID 或 Graph API Version。');
  }
  const body = new URLSearchParams({
    message: `${post.copy}\n\n${post.hashtags.join(' ')}`,
    link: post.targetUrl,
    access_token: config.metaPageAccessToken,
  });
  const response = await fetch(`https://graph.facebook.com/${encodeURIComponent(config.metaGraphApiVersion)}/${encodeURIComponent(config.metaPageId)}/feed`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });
  const payload = await response.json() as { id?: string; error?: { message?: string } };
  if (!response.ok) throw new Error(`Facebook API ${response.status}: ${payload.error?.message || 'publish failed'}`);
  return payload.id || '';
}

async function instagramPublish(config: ContentOpsAiConfig, post: SocialPost, mediaUrl: string) {
  if (!config.metaPageAccessToken || !config.metaInstagramUserId || !config.metaGraphApiVersion || !mediaUrl) {
    throw new Error('Instagram 直接发布需要 Meta Token、Instagram User ID、Graph API Version 和公开可访问的图片 URL。');
  }
  const caption = `${post.copy}\n\n${post.hashtags.join(' ')}\n${post.targetUrl}`;
  const createBody = new URLSearchParams({ image_url: mediaUrl, caption, access_token: config.metaPageAccessToken });
  const createdResponse = await fetch(`https://graph.facebook.com/${encodeURIComponent(config.metaGraphApiVersion)}/${encodeURIComponent(config.metaInstagramUserId)}/media`, {
    method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: createBody,
  });
  const created = await createdResponse.json() as { id?: string; error?: { message?: string } };
  if (!createdResponse.ok || !created.id) throw new Error(`Instagram media API ${createdResponse.status}: ${created.error?.message || 'container creation failed'}`);
  const publishBody = new URLSearchParams({ creation_id: created.id, access_token: config.metaPageAccessToken });
  const publishResponse = await fetch(`https://graph.facebook.com/${encodeURIComponent(config.metaGraphApiVersion)}/${encodeURIComponent(config.metaInstagramUserId)}/media_publish`, {
    method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: publishBody,
  });
  const published = await publishResponse.json() as { id?: string; error?: { message?: string } };
  if (!publishResponse.ok) throw new Error(`Instagram publish API ${publishResponse.status}: ${published.error?.message || 'publish failed'}`);
  return published.id || '';
}

function pendingVerification(message: string): ChannelVerification {
  return { verified: false, status: 'pending_configuration', message, checkedAt: new Date().toISOString() };
}

async function verifyLinkedIn(config: ContentOpsAiConfig): Promise<ChannelVerification> {
  if (!config.linkedinAccessToken || !config.linkedinOrganizationId || !config.linkedinApiVersion) {
    return pendingVerification('等待 LinkedIn Access Token、Organization ID 与 API Version。');
  }
  try {
    const query = new URLSearchParams({
      q: 'roleAssignee',
      role: 'ADMINISTRATOR',
      state: 'APPROVED',
      count: '100',
      start: '0',
    });
    const response = await fetch(`https://api.linkedin.com/rest/organizationAcls?${query}`, {
      headers: {
        Authorization: `Bearer ${config.linkedinAccessToken}`,
        'LinkedIn-Version': config.linkedinApiVersion,
        'X-Restli-Protocol-Version': '2.0.0',
        'Content-Type': 'application/json',
      },
    });
    const payload = await response.json() as {
      elements?: Array<{ organization?: string; organizationTarget?: string; role?: string; state?: string }>;
      message?: string;
    };
    if (!response.ok) {
      return { verified: false, status: 'permission_denied', message: `LinkedIn 管理员权限验证失败：${cleanError(payload.message || `API ${response.status}`)}`, checkedAt: new Date().toISOString() };
    }
    const expectedUrn = `urn:li:organization:${config.linkedinOrganizationId}`;
    const matched = (payload.elements || []).some((entry) =>
      (entry.organization === expectedUrn || entry.organizationTarget === expectedUrn)
      && entry.role === 'ADMINISTRATOR'
      && entry.state === 'APPROVED');
    return matched
      ? { verified: true, status: 'verified', message: '已确认当前令牌对 DDNZ LinkedIn 组织具有已批准的 ADMINISTRATOR 角色。', checkedAt: new Date().toISOString(), connectedAccountId: config.linkedinOrganizationId }
      : { verified: false, status: 'account_mismatch', message: '令牌有效，但没有在返回的已批准管理员组织中找到 DDNZ Organization ID。', checkedAt: new Date().toISOString() };
  } catch (error) {
    return { verified: false, status: 'unavailable', message: `LinkedIn 验证暂时不可用：${cleanError(error)}`, checkedAt: new Date().toISOString() };
  }
}

async function verifyMeta(config: ContentOpsAiConfig): Promise<{ facebook: ChannelVerification; instagram: ChannelVerification }> {
  if (!config.metaPageAccessToken || !config.metaPageId || !config.metaGraphApiVersion) {
    return {
      facebook: pendingVerification('等待 Meta Page Access Token、Page ID 与 Graph API Version。'),
      instagram: pendingVerification('先配置并验证 Facebook Page，再确认连接的 Instagram professional account。'),
    };
  }
  try {
    const query = new URLSearchParams({
      fields: 'id,name,instagram_business_account{id,username}',
      access_token: config.metaPageAccessToken,
    });
    const response = await fetch(`https://graph.facebook.com/${encodeURIComponent(config.metaGraphApiVersion)}/${encodeURIComponent(config.metaPageId)}?${query}`);
    const payload = await response.json() as {
      id?: string;
      name?: string;
      instagram_business_account?: { id?: string; username?: string };
      error?: { message?: string };
    };
    if (!response.ok) {
      const message = `Meta Page 权限验证失败：${cleanError(payload.error?.message || `API ${response.status}`)}`;
      return {
        facebook: { verified: false, status: 'permission_denied', message, checkedAt: new Date().toISOString() },
        instagram: { verified: false, status: 'permission_denied', message, checkedAt: new Date().toISOString() },
      };
    }
    const facebookVerified = payload.id === config.metaPageId;
    const connectedInstagramId = payload.instagram_business_account?.id || '';
    const instagramVerified = Boolean(
      facebookVerified
      && config.metaInstagramUserId
      && connectedInstagramId === config.metaInstagramUserId,
    );
    return {
      facebook: facebookVerified
        ? { verified: true, status: 'verified', message: '已确认 Page Access Token 可以读取配置的 DDNZ Facebook Page。', checkedAt: new Date().toISOString(), connectedAccountId: payload.id, connectedAccountName: payload.name }
        : { verified: false, status: 'account_mismatch', message: 'Page Access Token 返回的 Page ID 与 DDNZ 配置不一致。', checkedAt: new Date().toISOString() },
      instagram: instagramVerified
        ? { verified: true, status: 'verified', message: '已确认 Instagram professional account 与 DDNZ Facebook Page 的实际连接。', checkedAt: new Date().toISOString(), connectedAccountId: connectedInstagramId, connectedAccountName: payload.instagram_business_account?.username }
        : {
            verified: false,
            status: connectedInstagramId ? 'account_mismatch' : 'pending_configuration',
            message: connectedInstagramId
              ? 'Facebook Page 已连接 Instagram，但返回的 IG User ID 与 META_INSTAGRAM_USER_ID 不一致。'
              : 'Facebook Page 尚未返回已连接的 Instagram Business/Creator Account。',
            checkedAt: new Date().toISOString(),
            connectedAccountId: connectedInstagramId || undefined,
          },
    };
  } catch (error) {
    const message = `Meta 连接验证暂时不可用：${cleanError(error)}`;
    return {
      facebook: { verified: false, status: 'unavailable', message, checkedAt: new Date().toISOString() },
      instagram: { verified: false, status: 'unavailable', message, checkedAt: new Date().toISOString() },
    };
  }
}

async function channelVerifications(config: ContentOpsAiConfig) {
  if (verificationCache && verificationCache.expiresAt > Date.now()) return verificationCache;
  const [linkedin, meta] = await Promise.all([verifyLinkedIn(config), verifyMeta(config)]);
  verificationCache = {
    expiresAt: Date.now() + VERIFICATION_TTL_MS,
    linkedin,
    facebook: meta.facebook,
    instagram: meta.instagram,
  };
  return verificationCache;
}

async function publishContent(config: ContentOpsAiConfig, platform: SocialPublishingPlatform, body: Record<string, unknown>) {
  await ensureRuntimeLoaded();
  const contentPackage = body.package as ContentPackage;
  const reviewer = typeof body.reviewer === 'string' ? body.reviewer.trim() : '';
  const confirmationTitle = typeof body.confirmationTitle === 'string' ? body.confirmationTitle : '';
  const requestedLanguage = typeof body.language === 'string' ? body.language : 'en';
  const language: ContentLanguage = ['en', 'ar', 'es', 'fr'].includes(requestedLanguage)
    ? requestedLanguage as ContentLanguage
    : 'en';
  if (!contentPackage?.id || !contentPackage.website?.title) throw new Error('发布请求缺少完整 ContentPackage。');
  if (body.approved !== true || !reviewer || confirmationTitle !== contentPackage.website.title) {
    throw new Error('发布前必须填写审核者、勾选人工确认，并准确确认文章标题。');
  }
  if (contentPackage.workflowStatus !== 'Audit Passed' || contentPackage.audit?.status !== 'pass') {
    throw new Error('内容必须先通过六项审计，AI 不能绕过审核直接发布。');
  }
  const validSources = Array.isArray(contentPackage.sources)
    ? contentPackage.sources.filter((source) => {
        try {
          const protocol = new URL(source.url).protocol;
          return Boolean(source.claim && source.title && ['https:', 'http:'].includes(protocol));
        } catch {
          return false;
        }
      })
    : [];
  if (!validSources.length) {
    throw new Error('内容缺少可核验来源，不能发布。请先补齐来源台账并重新审计。');
  }
  const requiredGates: ContentAudit['gates'][number]['gate'][] = ['sources', 'factual', 'brand', 'language', 'sensitive', 'platform'];
  const passedGates = new Set<ContentAudit['gates'][number]['gate']>(
    (contentPackage.audit.gates || [])
      .filter((gate) => gate.result === 'pass')
      .map((gate) => gate.gate),
  );
  if (requiredGates.some((gate) => !passedGates.has(gate)) || (contentPackage.audit.blockers || []).length) {
    throw new Error('六项审计记录不完整或仍有阻断项，不能发布。');
  }
  const post = postForPackage(contentPackage, platform, language);
  if (!post) throw new Error(`ContentPackage 中没有 ${platform} 的可发布内容。`);

  let status: PublicationRecord['status'] = 'manual_required';
  let platformContentId = '';
  let message = `${SOCIAL_CHANNELS[platform].label} 当前使用人工发布包。文案、标签、目标链接和素材说明均已保留。`;
  const wantsDirect = body.mode === 'direct';
  if (wantsDirect && config.directPublishEnabled && platform !== 'tiktok') {
    try {
      const verifications = await channelVerifications(config);
      const verification = verifications[platform];
      if (!verification.verified) throw new Error(`直接发布权限未验证：${verification.message}`);
      platformContentId = platform === 'linkedin'
        ? await linkedInPublish(config, post)
        : platform === 'facebook'
          ? await facebookPublish(config, post)
          : await instagramPublish(config, post, typeof body.mediaUrl === 'string' ? body.mediaUrl : '');
      status = 'published';
      message = `${SOCIAL_CHANNELS[platform].label} 已发布并保存平台回执。`;
    } catch (error) {
      status = 'manual_required';
      message = `直接发布未完成，已自动保留人工发布包。${cleanError(error)}`;
    }
  }

  const targetUrl = new URL(post.targetUrl);
  const record: PublicationRecord = {
    id: `pub_${randomUUID()}`,
    packageId: contentPackage.id,
    platform,
    account: SOCIAL_CHANNELS[platform].handle,
    language: post.language,
    contentVersion: contentPackage.version,
    reviewer,
    status,
    publishedAt: new Date().toISOString(),
    platformContentId,
    targetUrl: post.targetUrl,
    utmSource: targetUrl.searchParams.get('utm_source') || platform,
    utmCampaign: targetUrl.searchParams.get('utm_campaign') || '',
    utmContent: targetUrl.searchParams.get('utm_content') || contentPackage.id,
    message,
  };
  publications.push(record);
  await persistRuntime();
  return {
    record,
    manualPackage: {
      copy: post.copy,
      hashtags: post.hashtags,
      targetUrl: post.targetUrl,
      mediaBrief: post.mediaBrief,
      accountUrl: SOCIAL_CHANNELS[platform].publicUrl,
    },
  };
}

export function createContentOpsAiService(config: ContentOpsAiConfig) {
  return {
    async capabilities() {
      await ensureRuntimeLoaded();
      const verifications = await channelVerifications(config);
      return {
        modelConnected: Boolean(config.openaiApiKey),
        models: MODELS,
        persistence: 'tmp/content-ops-runtime/state.json',
        recentJobs: [...jobs.values()].sort((left, right) => right.updatedAt.localeCompare(left.updatedAt)).slice(0, 8).map(publicJob),
        channels: {
          linkedin: { configured: Boolean(config.linkedinAccessToken && config.linkedinOrganizationId && config.linkedinApiVersion), verified: verifications.linkedin.verified, verification: verifications.linkedin, directPublish: config.directPublishEnabled && verifications.linkedin.verified },
          facebook: { configured: Boolean(config.metaPageAccessToken && config.metaPageId && config.metaGraphApiVersion), verified: verifications.facebook.verified, verification: verifications.facebook, directPublish: config.directPublishEnabled && verifications.facebook.verified },
          instagram: { configured: Boolean(config.metaPageAccessToken && config.metaInstagramUserId && config.metaGraphApiVersion), verified: verifications.instagram.verified, verification: verifications.instagram, directPublish: config.directPublishEnabled && verifications.instagram.verified, requiresMediaUrl: true },
          tiktok: { configured: true, directPublish: false, reason: '当前账号按个人/创作者账号处理，第一阶段使用人工发布包。' },
        },
      };
    },
    startJob(stage: AiJobStage, input: Record<string, unknown>) {
      return startAiJob(config, stage, input);
    },
    getJob(jobId: string) {
      return getAiJob(config, jobId);
    },
    publish(platform: string, body: Record<string, unknown>) {
      if (!SOCIAL_PUBLISHING_PLATFORMS.includes(platform as SocialPublishingPlatform)) {
        throw new Error('不支持该发布平台。');
      }
      return publishContent(config, platform as SocialPublishingPlatform, body);
    },
  };
}
