export const modernizedFreightServicePaths = [
  'services/air-freight',
  'services/amazon-fba',
  'services/warehouse-services',
] as const;

export type ModernFreightServicePath = typeof modernizedFreightServicePaths[number];
