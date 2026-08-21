export type PublicationGuardOptions = {
  fallbackCover: string;
  strictSync: boolean;
};

/**
 * Returns publication blockers for a compiled Notion article.
 *
 * Non-strict local development can still render explicitly legacy snapshot
 * content, but production strict sync never treats an ungoverned Published
 * page as an approved legacy migration.
 */
export function auditPublishedArticle(post: any, options: PublicationGuardOptions) {
  if (!post.governed) {
    return options.strictSync && post.status === "Published"
      ? ["Published article has no governance record; strict sync requires the publication governance fields"]
      : [];
  }

  const blockers: string[] = [];
  const delegatedAutomatedApproval =
    post.status === "Published" &&
    !post.reviewer?.length &&
    post.evidenceCount >= 2 &&
    post.topicCount >= 1 &&
    post.auditCount >= 1 &&
    Boolean(post.lastVerified) &&
    (post.qualityScore ?? 0) >= 85;
  if (!post.topicKey) blockers.push("Topic Key is missing");
  if (!post.summary) blockers.push("Excerpt/Summary is missing");
  if (!post.lastVerified) blockers.push("Last Verified is missing");
  if (!post.reviewer?.length && !delegatedAutomatedApproval) {
    blockers.push("Reviewer or delegated automated approval is missing");
  }
  if (!post.primaryCTA) blockers.push("Primary CTA is missing");
  if ((post.qualityScore ?? 0) < 85) blockers.push("Quality Score is below 85");
  if (post.thumbnailUrl === options.fallbackCover) blockers.push("A rights-cleared cover image is missing");
  if (!/<a\s+href="https?:\/\//i.test(post.content)) blockers.push("No external source link appears in the article");

  const minimumEvidence = post.contentType === "Case Study" ? 1 : 2;
  if (post.evidenceCount < minimumEvidence) {
    blockers.push(`${minimumEvidence} linked Evidence Ledger record(s) required for ${post.contentType || "this article"}`);
  }
  if (post.topicCount < 1) blockers.push("A linked Topic Registry decision is required");
  if (post.auditCount < 1) blockers.push("Article-linked audit history is required");

  return blockers;
}
