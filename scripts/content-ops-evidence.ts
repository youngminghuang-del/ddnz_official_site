const SOURCE_TYPES = new Set([
  'Government', 'Customs', 'Port', 'Carrier', 'Standards Body',
  'Research', 'Media', 'Supplier', 'DDNZ Record', 'Other',
]);

const MARKETS = ['Global', 'Middle East', 'Africa', 'Latin America', 'Central Asia', 'Europe', 'North America'] as const;

export type AiEvidenceSource = {
  claim?: unknown;
  title?: unknown;
  publisher?: unknown;
  url?: unknown;
  sourceTier?: unknown;
  sourceType?: unknown;
  evidenceSummary?: unknown;
  publishedDate?: unknown;
  accessedDate?: unknown;
  market?: unknown;
  caveat?: unknown;
};

export type ExistingEvidenceIdentity = {
  claim: string;
  publisher: string;
  sourceUrl: string;
};

export type PlannedEvidenceDraft = {
  claim: string;
  title: string;
  publisher: string;
  sourceUrl: string;
  sourceTier: 'A' | 'B' | 'C';
  sourceType: string;
  evidenceSummary: string;
  caveat: string;
  publishedDate: string;
  markets: string[];
};

const text = (value: unknown, maximum: number) =>
  (typeof value === 'string' ? value : String(value || ''))
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maximum);

const normalizeForMatch = (value: string) =>
  value.toLowerCase().replace(/[\s\W_]+/gu, ' ').trim();

export function canonicalEvidenceUrl(value: unknown) {
  if (typeof value !== 'string') return '';
  try {
    const url = new URL(value.trim());
    if (!['http:', 'https:'].includes(url.protocol)) return '';
    const hostname = url.hostname.toLowerCase();
    if (
      hostname === 'localhost'
      || hostname === '0.0.0.0'
      || hostname === '::1'
      || hostname.endsWith('.local')
      || /^127\./.test(hostname)
      || /^10\./.test(hostname)
      || /^192\.168\./.test(hostname)
      || /^172\.(1[6-9]|2\d|3[01])\./.test(hostname)
      || /^169\.254\./.test(hostname)
    ) return '';
    url.hash = '';
    for (const key of [...url.searchParams.keys()]) {
      if (key.toLowerCase().startsWith('utm_')) url.searchParams.delete(key);
    }
    return url.toString().replace(/\/$/, '').toLowerCase();
  } catch {
    return '';
  }
}

function sourceType(value: unknown) {
  const candidate = text(value, 80);
  return SOURCE_TYPES.has(candidate) ? candidate : 'Other';
}

function sourceTier(type: string, proposed: unknown): PlannedEvidenceDraft['sourceTier'] | '' {
  if (['Government', 'Customs', 'Standards Body'].includes(type)) return 'A';
  if (type === 'Supplier') return 'C';
  if (type === 'DDNZ Record') return '';
  return proposed === 'C' ? 'C' : 'B';
}

function markets(value: unknown, articleMarket: string) {
  const combined = `${text(value, 300)}, ${articleMarket}`.toLowerCase();
  const selected = MARKETS.filter((market) => {
    if (combined.includes(market.toLowerCase())) return true;
    if (market === 'Middle East') return /saudi|uae|emirates|gcc|gulf|mena/.test(combined);
    if (market === 'Africa') return /africa|ghana|nigeria|kenya|morocco|egypt|algeria|tunisia/.test(combined);
    if (market === 'Latin America') return /latin|brazil|mexico|chile|peru|colombia|argentina/.test(combined);
    if (market === 'Central Asia') return /central asia|kazakhstan|uzbekistan|kyrgyzstan|tajikistan/.test(combined);
    if (market === 'Europe') return /europe|eu\b|european union/.test(combined);
    if (market === 'North America') return /north america|united states|u\.s\.|usa|canada/.test(combined);
    return false;
  });
  return selected.length ? [...selected] : ['Global'];
}

function validDate(value: unknown) {
  const candidate = text(value, 20);
  return /^\d{4}-\d{2}-\d{2}$/.test(candidate) ? candidate : '';
}

export function planEvidenceDrafts(
  ledger: AiEvidenceSource[],
  existing: ExistingEvidenceIdentity[],
  articleMarket: string,
) {
  const existingUrls = new Set(existing.map((item) => canonicalEvidenceUrl(item.sourceUrl)).filter(Boolean));
  const existingClaimPublishers = new Set(existing.map((item) => `${normalizeForMatch(item.claim)}|${normalizeForMatch(item.publisher)}`));
  const drafts: PlannedEvidenceDraft[] = [];
  let skipped = 0;

  for (const raw of ledger.slice(0, 8)) {
    const claim = text(raw.claim, 500);
    const title = text(raw.title, 500);
    const publisher = text(raw.publisher, 300);
    const sourceUrl = text(raw.url, 1000);
    const canonicalUrl = canonicalEvidenceUrl(sourceUrl);
    const normalizedType = sourceType(raw.sourceType);
    const normalizedTier = sourceTier(normalizedType, raw.sourceTier);
    const duplicateKey = `${normalizeForMatch(claim)}|${normalizeForMatch(publisher)}`;
    if (!claim || !publisher || !canonicalUrl || !normalizedTier || normalizedType === 'DDNZ Record' || existingUrls.has(canonicalUrl) || existingClaimPublishers.has(duplicateKey)) {
      skipped += 1;
      continue;
    }
    drafts.push({
      claim,
      title,
      publisher,
      sourceUrl,
      sourceTier: normalizedTier,
      sourceType: normalizedType,
      evidenceSummary: text(raw.evidenceSummary, 1200),
      caveat: text(raw.caveat, 700),
      publishedDate: validDate(raw.publishedDate),
      markets: markets(raw.market, articleMarket),
    });
    existingUrls.add(canonicalUrl);
    existingClaimPublishers.add(duplicateKey);
  }
  return { drafts, skipped };
}
