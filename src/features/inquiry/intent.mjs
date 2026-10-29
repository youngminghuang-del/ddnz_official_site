// Explicit product/freight handoffs keep their original forms. Generic links ask first.
export function inquiryIntent(params) {
  const goal = params.get('leadGoal');
  if (['Product Sourcing', 'Supplier Inspection & Consolidation', 'Freight Export', 'Freight Only'].includes(goal)) return goal;
  // Legacy links with shipment details predate leadGoal.
  if (['dest', 'destinationText', 'origin', 'cargo', 'mode'].some(key => params.has(key))) return 'Freight Export';
  if (['industry', 'model', 'overviewBrief', 'productScope'].some(key => params.has(key))) return 'Product Sourcing';
  return null;
}
