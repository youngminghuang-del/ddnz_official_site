import {europeCandidateSlugs,pacificCandidateSlugs,candidatePath,candidateInfo,sharedCopy,type CandidateLocale} from './model';
export function CandidateRegionLinks({locale}:{locale:CandidateLocale}) {
 return <div className="mt-8 border-t border-[#dedde1] py-6"><p>{sharedCopy[locale].moreDestinations}</p><div className="flex flex-wrap gap-6 mt-4">{europeCandidateSlugs.map(slug=><a className="underline underline-offset-4" key={slug} href={candidatePath(slug,locale)}>{candidateInfo(slug,locale).name} ↗</a>)}</div></div>;
}

export function PacificCountryLinks({locale}:{locale:CandidateLocale}) {
 const heading = {en:'Sea freight to Canada and Australia',zh:'加拿大与澳大利亚海运',es:'Flete marítimo a Canadá y Australia',fr:'Fret maritime vers le Canada et l’Australie',ru:'Морской фрахт в Канаду и Австралию',ar:'الشحن البحري إلى كندا وأستراليا',pt:'Frete marítimo para Canadá e Austrália',tr:'Kanada ve Avustralya’ya deniz taşımacılığı'}[locale];
 return <section className="freight-wrap freight-section">
  <h2>{heading}</h2>
  <div className="flex flex-wrap gap-6 mt-4">{pacificCandidateSlugs.map(country=>
   <a className="underline underline-offset-4" key={country} href={candidatePath(country,locale)}>{candidateInfo(country,locale).name} ↗</a>
  )}</div>
 </section>;
}
