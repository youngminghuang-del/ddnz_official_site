import { Link } from 'react-router-dom';
import { money, number } from './model.mjs';
import { ROUTES } from './routes.mjs';
import { readHandoff } from './handoff.mjs';

type Plan = NonNullable<ReturnType<typeof readHandoff>>;
export default function InquiryPlanCard({ plan, missing, onRemove }: { plan: Plan | null; missing: boolean; onRemove: () => void }) {
  if (!plan) return missing ? <div role="status" className="mx-5 mt-5 rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm sm:mx-8">Your screen-protector plan could not be loaded. <Link className="font-bold underline" to={ROUTES.calculator}>Return to the planner</Link>, or paste a saved brief below.</div> : null;
  return <section aria-label="Attached screen protector plan" className="mx-5 mt-5 rounded-xl border border-purple-200 bg-purple-50/60 p-5 text-[#10243f] sm:mx-8">
    <h2 className="text-lg font-extrabold">Your screen-protector plan is attached</h2>
    <p className="mt-2 text-sm">{number(plan.summary.pieces)} pieces · {plan.state.route === 'sea' ? 'Sea freight' : 'Air freight'} to Istanbul · {money(plan.summary.landedCny)} estimated to warehouse</p>
    <p className="mt-2 text-sm text-slate-600">{number(plan.summary.checks)} selected procurement checks. {plan.summary.missingModels ? `${plan.summary.missingModels} product rows still need phone-model details.` : 'Phone-model details are included.'}</p>
    <div className="mt-3 flex flex-wrap items-center gap-5 text-sm font-bold text-[#763c9c]"><Link className="py-2 underline underline-offset-4" to={ROUTES.calculator}>Edit the plan</Link><button type="button" className="py-2 underline underline-offset-4" onClick={onRemove}>Remove attachment</button></div>
    <input type="hidden" name="Screen_Protector_Plan_JSON" value={JSON.stringify(plan)} />
    <input type="hidden" name="Screen_Protector_Basis_Date" value={plan.basisDate} />
  </section>;
}
