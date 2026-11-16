import {candidateSlugs,candidatePath,candidateInfo,sharedCopy,type CandidateLocale} from './model';
export function CandidateRegionLinks({locale}:{locale:CandidateLocale}) {
 return <div className="mt-8 border-t border-[#dedde1] py-6"><p>{sharedCopy[locale].moreDestinations}</p><div className="flex flex-wrap gap-6 mt-4">{candidateSlugs.map(slug=><a className="underline underline-offset-4" key={slug} href={candidatePath(slug,locale)}>{candidateInfo(slug,locale).name} ↗</a>)}</div></div>;
}
