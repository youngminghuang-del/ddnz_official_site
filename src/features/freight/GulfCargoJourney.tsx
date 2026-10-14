function JourneyIllustration({ stage, country }: { stage: number; country: 'qatar' | 'oman' }) {
 const artwork = [
  country === 'qatar' ? <><path d="M12 37c0-7 12-11 27-11s27 4 27 11-12 11-27 11-27-4-27-11Z M23 32l4-17q12-9 24 0l5 17 M26 25q13 7 27 0" /><path d="m56 45 13-4 5 12-13 4Z" /></> : <><path d="m10 22 41-11 21 12-42 13Z M10 22v7l20 14 42-13v-7 M18 34v15 M35 42v14 M64 32v15" /><circle cx="39" cy="23" r="2" /><path d="m9 10 60 37" /></>,
  <><path d="m12 22 22-10 22 10-22 10Z M12 22v24l22 12 22-12V22 M34 32v26 M23 17l23 10v10 M60 14h12m-6-5v44m-6 0h12" /></>,
  <><path d="M9 36h63l-8 14H23Z M19 35V16h40v19 M27 16v19 M37 16v19 M48 16v19 M6 57q8-6 16 0t16 0t16 0t16 0" /></>,
  <><path d="M14 12h30l12 12v34H14Z M44 12v12h12 M25 33h19 M25 41h19 M25 49h12 M57 8h10v37" /></>,
  country === 'qatar' ? <><path d="M13 57V11h48v46 M21 57V20h32v37 M48 34h1 M59 43l10-4 9 5v12l-10 4-9-5Z M59 43l10 4 9-3 M69 47v13" /></> : <><path d="M10 43h24V18H17v15H10Z M39 11v40h27 M45 11v34h22 M48 22h23v17H48Z" /><circle cx="17" cy="51" r="6" /><circle cx="31" cy="51" r="6" /></>,
 ];
 return <svg viewBox="0 0 84 68" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" aria-hidden="true">{artwork[stage]}</svg>;
}
export interface CargoJourneyData {
 label: string;
 title: string;
 intro: string;
 steps: { title: string; detail: string }[];
 note: string;
 cta: string;
}
export default function GulfCargoJourney({ data, locale, country }: { data: CargoJourneyData; locale: 'en' | 'ar'; country: 'qatar' | 'oman' }) {
 return <section className="gulf-journey" data-cargo-journey aria-labelledby="gulf-journey-heading">
  <div className="gulf-journey-intro"><p className="gulf-eyebrow">{data.label}</p><h2 id="gulf-journey-heading">{data.title}</h2><p>{data.intro}</p></div>
  <ol>{data.steps.map((step,index) => <li key={step.title}><div className="gulf-journey-symbol"><JourneyIllustration stage={index} country={country} /><span aria-hidden="true">0{index+1}</span></div><h3>{step.title}</h3><p>{step.detail}</p></li>)}</ol>
  <p className="gulf-journey-note">{data.note}</p><a href="#gulf-quote">{data.cta}<span aria-hidden="true">{locale === 'ar' ? '←' : '→'}</span></a>
 </section>;
}
