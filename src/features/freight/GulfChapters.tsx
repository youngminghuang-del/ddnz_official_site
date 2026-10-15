import type { GulfLocale } from './gulfLocale';
import { useEffect, useState } from 'react';

type Props = { country: 'qatar' | 'oman'; locale: GulfLocale };
import gulfChapterLabels from './gulfChapterLabels.json';
import ui from './gulfUi.json';
export { gulfChapterLabels };
export function ChapterIcon({ index }: { index: number }) {
 const paths = [
  <><path d="m4 7 8-4 8 4v10l-8 4-8-4Z M4 7l8 4 8-4 M12 11v10 M8 5l8 4v5" /></>,
  <><path d="m3 7 9-4 9 4-9 4Z M3 12l9 4 9-4 M3 17l9 4 9-4" /></>,
  <><path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z" /><circle cx="12" cy="10" r="2" /></>,
  <><path d="M9 8a3 3 0 0 1 6 0c0 2-3 2-3 5 M12 17h.01" /><circle cx="12" cy="12" r="10" /></>,
 ];
 return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[index]}</svg>;
}
export function FreightChapters({items, ariaLabel = 'On this page', reading = 'Reading '}: {items: {id:string;label:string}[]; ariaLabel?:string; reading?:string}) {
 const [active, setActive] = useState<string | null>(null);
 const key = items.map(item=>item.id).join('|');
 useEffect(() => {
  let frame = 0;
  const update = () => {
   frame = 0;
   const top = (document.querySelector('header')?.getBoundingClientRect().bottom || 120) + 40;
   const ordered = key.split('|').map(id => ({id, y:document.getElementById(id)?.getBoundingClientRect().top ?? Infinity}));
   setActive(ordered.filter(item=>item.y<=top).sort((a,b)=>a.y-b.y).at(-1)?.id ?? null);
  };
  const schedule=()=>{if(!frame)frame=requestAnimationFrame(update);};
  window.addEventListener('scroll',schedule,{passive:true}); window.addEventListener('resize',schedule); schedule();
  return ()=>{window.removeEventListener('scroll',schedule);window.removeEventListener('resize',schedule);cancelAnimationFrame(frame);};
 },[key]);
 return <nav className="gulf-chapters" aria-label={ariaLabel}>{items.map((item,index)=><a key={item.id} href={`#${item.id}`} aria-current={active===item.id?'location':undefined} onClick={()=>{setActive(item.id);document.getElementById(item.id)?.focus({preventScroll:true});}}>
  <span className="gulf-chapter-top"><ChapterIcon index={index}/><span className="gulf-chapter-number" aria-hidden="true">{active===item.id?reading:''}0{index+1}</span></span>
  <span className="gulf-chapter-bottom"><span>{item.label}</span><svg className="gulf-chapter-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path d="M5 5 19 19 M7 19h12V7"/></svg></span>
 </a>)}</nav>;
}
export default function GulfChapters({country,locale}:Props) {
 const ids=country==='qatar'?[0,2,3,5]:[0,1,2,5];
 return <FreightChapters items={ids.map((id,i)=>({id:`gulf-section-${id}`,label:gulfChapterLabels[country][locale][i]}))} ariaLabel={ui[locale].chaptersAria} reading={ui[locale].reading}/>;
}
