export type FreightQuoteService = 'Sea' | 'Land' | 'Air' | 'Warehouse';
/** Only infer a mode where the originating service makes it unambiguous. */
export function freightQuoteService(source: string | null, preset?: FreightQuoteService): FreightQuoteService {
  if (preset) return preset;
  if (source === 'air_freight') return 'Air';
  if (source === 'warehouse_services') return 'Warehouse';
  if (source === 'central_asia_route_builder') return 'Land';
  return 'Sea';
}
