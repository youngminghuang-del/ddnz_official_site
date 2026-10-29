import { readAttribution, safePagePath } from '../../lib/attribution';
import { sanitizeAnalyticsText } from '../../lib/analyticsPayload';
import { QUOTE_ENUMS } from '../../lib/quoteLinkEnums.mjs';
export function inquirySourceFields(params: URLSearchParams, pathname: string) {
 const a = readAttribution(params.toString());
 const clean = (value: unknown) => typeof value === 'string' ? sanitizeAnalyticsText(value) || '' : '';
 return {
  Landing_Page: safePagePath(a.landing_page),
  Inquiry_Entry_Page: safePagePath(params.get('entryPage')),
  Current_Page: safePagePath(pathname),
  First_Referrer_Host: clean(a.referrer_host),
  First_UTM_Source: clean(a.first_utm_source), First_UTM_Medium: clean(a.first_utm_medium),
  First_UTM_Campaign: clean(a.first_utm_campaign), First_UTM_Content: clean(a.first_utm_content), First_UTM_Term: clean(a.first_utm_term),
  UTM_Source: clean(a.utm_source), UTM_Medium: clean(a.utm_medium), UTM_Campaign: clean(a.utm_campaign), UTM_Content: clean(a.utm_content), UTM_Term: clean(a.utm_term),
  Selected_Product_Model: QUOTE_ENUMS.model.includes(params.get('model')) ? params.get('model')! : '',
  Source_Article_Slug: clean(params.get('article') || a.article),
 };
}
export default function InquirySourceFields({ params, pathname }: { params: URLSearchParams; pathname: string }) {
 return <>{Object.entries(inquirySourceFields(params, pathname)).map(([name, value]) => <input key={name} type="hidden" name={name} value={value} />)}</>;
}
