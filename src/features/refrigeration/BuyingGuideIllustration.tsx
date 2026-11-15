export const comparisonIllustrations = [
  'model-match', 'temperature-test', 'airflow-clearance', 'power-refrigerant',
  'seal-defrost', 'pack-handling',
] as const;

export const evaluationIllustrations = [
  'thermal-evidence', 'spec-consistency', 'service-parts',
  'delivery-protection', 'commercial-terms',
] as const;

type BuyingGuideSubject = (typeof comparisonIllustrations)[number] | (typeof evaluationIllustrations)[number];
export function BuyingGuideIllustration({ subject }: { subject: BuyingGuideSubject }) {
  return <img
    className="cold-guide-illustration"
    src={`/images/product-showcase/refrigeration/buying-guide/photo-style/${subject}.webp`}
    alt=""
    width="192"
    height="192"
    loading="lazy"
    decoding="async"
  />;
}
