/** Route matching belongs in application code, not as an untyped JSON-LD node. */
export function schemaCanonicalUrl(schema) {
  return schema.url || schema['@graph']?.find(node => node['@type'] === 'WebPage')?.url
    || schema['@graph']?.find(node => node['@type'] === 'BlogPosting')?.url;
}
