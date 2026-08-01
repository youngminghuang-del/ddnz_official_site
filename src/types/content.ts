export interface ArticleTocItem {
  id: string;
  text: string;
  level: 2 | 3;
}

export interface BlogPost {
  id: string;
  slug?: string;
  title: string;
  category: string;
  date: string;
  lastEdited?: string;
  summary: string;
  content: string;
  thumbnailUrl: string;
  language?: string;
  translationGroup?: string;
  toc?: ArticleTocItem[];
  wordCount?: number;
  readMinutes?: number;
  leadGoal?: string;
  productCategory?: string;
  productSubcategory?: string;
  audienceMarket?: string;
  searchIntent?: string;
  primaryQuery?: string;
  topicKey?: string;
  contentType?: string;
  reviewer?: string[];
  reviewMode?: 'human' | 'delegated-automation';
  lastVerified?: string;
  qualityScore?: number | null;
  primaryCTA?: string;
  evidenceCount?: number;
  canonicalArticleId?: string;
  governed?: boolean;
  legacyMigration?: boolean;
}
