export const comparisonIllustrations = [
  'model-match', 'temperature-test', 'airflow-clearance', 'power-refrigerant',
  'seal-defrost', 'pack-handling',
];

export const evaluationIllustrations = [
  'thermal-evidence', 'spec-consistency', 'service-parts',
  'delivery-protection', 'commercial-terms',
];

export function BuyingGuideIllustration({ subject }: { subject: string }) {
  return <img
    className="cold-guide-illustration"
    src={`/images/product-showcase/refrigeration/buying-guide/${subject}.webp`}
    alt=""
    width="192"
    height="192"
    loading="lazy"
    decoding="async"
  />;
}
