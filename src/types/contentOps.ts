import type { SocialPublishingPlatform } from '../config/socialChannels';

export type ContentLanguage = 'en' | 'ar' | 'es' | 'fr';
export type ContentWorkflowStatus = 'Draft' | 'Needs Review' | 'Audit Passed';

export type ContentSource = {
  claim: string;
  title: string;
  publisher: string;
  url: string;
  sourceTier: 'A' | 'B' | 'C' | 'First Party';
  sourceType: 'Government' | 'Customs' | 'Port' | 'Carrier' | 'Standards Body' | 'Research' | 'Media' | 'Supplier' | 'DDNZ Record' | 'Other';
  evidenceSummary: string;
  publishedDate: string;
  accessedDate: string;
  market: string;
  caveat: string;
};

export type WebsiteContent = {
  title: string;
  slug: string;
  excerpt: string;
  bodyMarkdown: string;
  seoTitle: string;
  seoDescription: string;
  ctaPath: string;
};

export type LocalizedWebsiteContent = WebsiteContent & {
  language: ContentLanguage;
};

export type SocialPost = {
  platform: SocialPublishingPlatform;
  language: ContentLanguage;
  copy: string;
  hashtags: string[];
  targetUrl: string;
  mediaBrief: string;
  publishingMode: 'direct-when-authorized' | 'manual';
};

export type ContentAuditGate = {
  gate: 'sources' | 'factual' | 'brand' | 'language' | 'sensitive' | 'platform';
  result: 'pass' | 'needs_changes';
  finding: string;
};

export type ContentAudit = {
  status: 'pending' | 'pass' | 'needs_changes';
  score: number;
  summary: string;
  gates: ContentAuditGate[];
  blockers: string[];
  requiredChanges: string[];
  model: string;
  auditedAt: string;
};

export type ContentPackage = {
  id: string;
  version: number;
  workflowStatus: ContentWorkflowStatus;
  parentTopic: {
    title: string;
    category: 'Freight Export' | 'Commercial Kitchen Equipment' | 'Outdoor Products';
    market: string;
    buyerQuestion: string;
    angle: string;
  };
  primaryLanguage: 'en';
  requestedLanguages: ContentLanguage[];
  website: WebsiteContent;
  localizedWebsite: LocalizedWebsiteContent[];
  socialPosts: SocialPost[];
  sources: ContentSource[];
  audit: ContentAudit;
  createdAt: string;
  updatedAt: string;
  models: {
    canonical: string;
    adaptation: string;
    audit: string;
  };
};

export type AiJobStage = 'topics' | 'research' | 'generate' | 'audit' | 'revise';
export type AiJobStatus = 'queued' | 'in_progress' | 'completed' | 'failed' | 'cancelled';

export type ContentOpsAiJob = {
  id: string;
  stage: AiJobStage;
  status: AiJobStatus;
  phase: string;
  model: string;
  createdAt: string;
  updatedAt: string;
  input: Record<string, unknown>;
  result?: unknown;
  intermediateResult?: unknown;
  error?: string;
};

export type PublicationRecord = {
  id: string;
  packageId: string;
  platform: SocialPublishingPlatform;
  account: string;
  language: ContentLanguage;
  contentVersion: number;
  reviewer: string;
  status: 'published' | 'manual_required' | 'failed';
  publishedAt: string;
  platformContentId: string;
  targetUrl: string;
  utmSource: string;
  utmCampaign: string;
  utmContent: string;
  message: string;
};
