import { useEffect, useState } from 'react';

type Props = { country: 'qatar' | 'oman'; locale: 'en' | 'ar' };
export const gulfChapterLabels = {
 qatar: { en: ['Supplier orders', 'Consolidation', 'Qatar arrival', 'Questions'], ar: ['طلبات الموردين', 'تجميع الشحنات', 'الوصول إلى قطر', 'أسئلة'] },
 oman: { en: ['Packed cargo', 'Freight options', 'Oman arrival', 'Questions'], ar: ['البضاعة المعبأة', 'خيارات الشحن', 'الوصول إلى عُمان', 'أسئلة'] },
};
export function ChapterIcon({ index }: { index: number }) {
 const paths = [
  <><path d="m4 7 8-4 8 4v10l-8 4-8-4Z M4 7l8 4 8-4 M12 11v10 M8 5l8 4v5" /></>,
  <><path d="m3 7 9-4 9 4-9 4Z M3 12l9 4 9-4 M3 17l9 4 9-4" /></>,
  <><path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z" /><circle cx="12" cy="10" r="2" /></>,
  <><path d="M9 8a3 3 0 0 1 6 0c0 2-3 2-3 5 M12 17h.01" /><circle cx="12" cy="12" r="10" /></>,
 ];
 return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[index]}</svg>;
}
export default function GulfChapters({ country, locale }: Props) {
 const ids = country === 'qatar' ? [0, 2, 3, 5] : [0, 1, 2, 5];
 const [active, setActive] = useState<number | null>(null);
 useEffect(() => {
  let frame = 0;
  const update = () => {
   frame = 0;
   const top = (document.querySelector('header')?.getBoundingClientRect().bottom || 120) + 40;
   const ordered = ids.map(id => ({ id, y: document.getElementById(`gulf-section-${id}`)?.getBoundingClientRect().top ?? Infinity }));
   setActive(ordered.filter(item => item.y <= top).at(-1)?.id ?? null);
  };
  const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
  schedule();
  return () => { window.removeEventListener('scroll', schedule); window.removeEventListener('resize', schedule); cancelAnimationFrame(frame); };
 }, [country]);
 return <nav className="gulf-chapters" aria-label={locale === 'ar' ? 'أقسام هذه الصفحة' : 'Explore this shipment'}>
  {ids.map((id, index) => <a key={id} href={`#gulf-section-${id}`} aria-current={active === id ? 'location' : undefined} onClick={() => {
   setActive(id);
   document.getElementById(`gulf-section-${id}`)?.focus({ preventScroll: true });
  }}>
   <span className="gulf-chapter-top"><ChapterIcon index={index} /><span className="gulf-chapter-number" aria-hidden="true">{active === id ? locale === 'ar' ? 'تقرأ الآن · ' : 'Reading · ' : ''}0{index + 1}</span></span>
   <span className="gulf-chapter-bottom"><span>{gulfChapterLabels[country][locale][index]}</span><svg className="gulf-chapter-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path d="M5 5 19 19 M7 19h12V7" /></svg></span>
  </a>)}
 </nav>;
}
