// Blank is deliberately distinct from zero. Preserve the existing Formspree
// string fields/units while making missing measurements explicit to recipients.
export function isValidCargoMeasurement(value: string): boolean {
  return value.trim() === '' || (Number.isFinite(Number(value)) && Number(value) > 0);
}

export function cargoMeasurement(value: string, unit: 'KG' | 'CBM') {
  if (!isValidCargoMeasurement(value)) throw new Error('Invalid cargo measurement');
  return value.trim() === ''
    ? { value: 'Unknown — awaiting cargo details', status: 'unknown' as const }
    : { value: `${Number(value)} ${unit}`, status: 'customer_estimate' as const };
}
