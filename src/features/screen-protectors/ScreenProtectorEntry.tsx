import { Link } from 'react-router-dom';
import { ROUTES } from './routes.mjs';
import { canonicalSitePath } from '../../lib/notionArticleRouting';

export default function ScreenProtectorEntry({ guides = false }: { guides?: boolean }) {
  return <section aria-label="Screen protector sourcing" className="mx-auto my-10 grid max-w-7xl gap-6 rounded-2xl border border-slate-200 bg-white p-6 text-[#10243f] sm:p-8 md:grid-cols-[180px_1fr] md:items-center">
    <Link to={canonicalSitePath(guides ? ROUTES.curves : ROUTES.home)} className="block overflow-hidden rounded-xl border border-slate-200">
      <img src={`/screen-protector-media/assets/${guides ? 'curved-glass-cover-v1.png' : '001-kit-photo.jpg'}`} width="1672" height="941" loading="lazy" alt={guides ? '2.5D and curved 3D glass profile comparison' : '001 screen protector and retail-pack contents'} className="aspect-video w-full object-cover" />
    </Link>
    <div>
      <p className="mb-3 text-xs font-bold uppercase tracking-widest text-[#763c9c]">Screen protectors · Buyer’s field notes</p>
      <h2 className="text-2xl font-extrabold leading-tight tracking-tight">{guides ? 'From product questions to an order-ready brief.' : 'Compare four screen protectors, then plan your shipment.'}</h2>
      <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">{guides ? 'See packaging, glass profiles and factory footage. Carry the checks that matter into your sourcing request.' : 'Review prices, packaging and minimum quantities. Estimate all-inclusive delivery to Istanbul with your own product mix.'}</p>
      <div className="mt-5 flex flex-wrap gap-x-7 gap-y-4 text-sm font-bold text-[#763c9c]">
        <Link className="min-h-11 py-3 underline underline-offset-4" to={canonicalSitePath(guides ? ROUTES.prices : ROUTES.home)}>{guides ? 'Why quotes differ ↗' : 'Explore screen protectors ↗'}</Link>
        <Link className="min-h-11 py-3 underline underline-offset-4" to={canonicalSitePath(guides ? ROUTES.curves : ROUTES.calculator)}>{guides ? '2.5D & curved glass ↗' : 'Plan landed cost ↗'}</Link>
      </div>
    </div>
  </section>;
}
