import {translatedTree,localeCode} from '../site-localization/translate.mjs';
import {localizedProductPath} from '../../lib/productLocalization.mjs';
import {EN} from './locales/en.mjs';
import { Link, useLocation } from 'react-router-dom';
import { money, number } from './model.mjs';
import { ROUTES } from './routes.mjs';
import { readHandoff } from './handoff.mjs';
import { LOCALIZED_INQUIRY_SOURCE, localizedPhonePath, phoneCopy, phoneMoney, phoneNumber } from './localization.mjs';

type Plan = NonNullable<ReturnType<typeof readHandoff>>;
export default function InquiryPlanCard({ plan, missing, onRemove }: { plan: Plan | null; missing: boolean; onRemove: () => void }) {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const locale = /^\/(zh-cn|es|ar|ru|fr|pt|tr)(?:\/|$)/.exec(location.pathname)?.[1]
    || (['zh','es','ar','ru','fr','pt','tr'].includes(query.get('phoneLocale')) ? query.get('phoneLocale') : 'es');
  if (!plan && missing && query.get('source') === LOCALIZED_INQUIRY_SOURCE) {
    const copy = phoneCopy(locale);
    return <div lang={locale} dir={copy.direction} role="status" className="mx-5 mt-5 rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm sm:mx-8">
      <p>{copy.attachmentMissing}</p><Link className="font-bold underline" to={`${localizedPhonePath(locale, 'compare')}#phone-inquiry`}>{copy.returnSelection}</Link>
    </div>;
  }
  if (!plan) return missing ? <div role="status" className="mx-5 mt-5 rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm sm:mx-8">Your screen-protector plan could not be loaded. <Link className="font-bold underline" to={ROUTES.calculator}>Return to the planner</Link>, or paste a saved brief below.</div> : null;
  if ('locale' in plan) {
    const copy = phoneCopy(plan.locale);
    return <section lang={plan.locale} dir={copy.direction} aria-label={copy.attachment} className="mx-5 mt-5 rounded-xl border border-purple-200 bg-purple-50/60 p-5 text-[#10243f] sm:mx-8">
      <h2 className="text-lg font-extrabold">{copy.attachment}</h2>
      <p className="mt-2 text-sm"><bdi>{phoneNumber(plan.locale, plan.summary.pieces)}</bdi> {copy.pieces} · {copy.goods}: <bdi dir="ltr">{phoneMoney(plan.locale, plan.summary.goodsCny)}</bdi></p>
      <p className="mt-2 text-sm">{copy.destination}: <bdi dir="auto">{plan.state.destination}</bdi></p>
      <p className="mt-2 text-sm text-slate-600">{copy.attachmentNote}</p>
      <div className="mt-3 flex flex-wrap items-center gap-5 text-sm font-bold text-[#763c9c]"><Link className="py-2 underline underline-offset-4" to={`${localizedPhonePath(plan.locale, 'compare')}#phone-inquiry`}>{copy.editAttachment}</Link><button type="button" className="py-2 underline underline-offset-4" onClick={onRemove}>{copy.removeAttachment}</button></div>
      <input type="hidden" name="Screen_Protector_Plan_JSON" value={JSON.stringify(plan)} />
      <input type="hidden" name="Screen_Protector_Basis_Date" value={plan.basisDate} />
    </section>;
  }
  if (plan.displayLocale && plan.displayLocale !== 'en') {
    const lang=localeCode(plan.displayLocale),copy=phoneCopy(lang),text=translatedTree(EN,lang);
    return <section lang={lang} dir={lang==='ar'?'rtl':'ltr'} aria-label={copy.attachment} className="mx-5 mt-5 rounded-xl border border-purple-200 bg-purple-50/60 p-5 text-[#10243f] sm:mx-8">
      <h2 className="text-lg font-extrabold">{copy.attachment}</h2>
      <p>{phoneNumber(lang,plan.summary.pieces)} {copy.pieces} · {text.calc[plan.state.route]} · {text.quote.destination}</p>
      <p>{text.calc.total}: <bdi>{phoneMoney(lang,plan.summary.landedCny)}</bdi></p>
      <p>{plan.summary.missingModels?text.calc.missing.replace('{count}',phoneNumber(lang,plan.summary.missingModels)):text.calc.modelsComplete}</p>
      <div className="mt-3 flex flex-wrap gap-5"><Link className="underline" to={localizedProductPath(ROUTES.calculator,lang)}>{copy.editAttachment}</Link><button type="button" onClick={onRemove}>{copy.removeAttachment}</button></div>
      <input type="hidden" name="Screen_Protector_Plan_JSON" value={JSON.stringify(plan)}/><input type="hidden" name="Screen_Protector_Basis_Date" value={plan.basisDate}/>
    </section>;
  }
  return <section aria-label="Attached screen protector plan" className="mx-5 mt-5 rounded-xl border border-purple-200 bg-purple-50/60 p-5 text-[#10243f] sm:mx-8">
    <h2 className="text-lg font-extrabold">Your screen-protector plan is attached</h2>
    <p className="mt-2 text-sm">{number(plan.summary.pieces)} pieces · {plan.state.route === 'sea' ? 'Sea freight' : 'Air freight'} to Istanbul · {money(plan.summary.landedCny)} estimated to warehouse</p>
    <p className="mt-2 text-sm text-slate-600">{number(plan.summary.checks)} selected procurement checks. {plan.summary.missingModels ? `${plan.summary.missingModels} product rows still need phone-model details.` : 'Phone-model details are included.'}</p>
    <div className="mt-3 flex flex-wrap items-center gap-5 text-sm font-bold text-[#763c9c]"><Link className="py-2 underline underline-offset-4" to={ROUTES.calculator}>Edit the plan</Link><button type="button" className="py-2 underline underline-offset-4" onClick={onRemove}>Remove attachment</button></div>
    <input type="hidden" name="Screen_Protector_Plan_JSON" value={JSON.stringify(plan)} />
    <input type="hidden" name="Screen_Protector_Basis_Date" value={plan.basisDate} />
  </section>;
}
