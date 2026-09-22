import { useEffect, useRef, useState } from 'react';
import './service-motion.css';

/** One passive scroll listener per mounted story; no scroll capture or autoplay. */
export function FieldStory({ steps, inspection }: { steps: string[][]; inspection: boolean }) {
  const root = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  useEffect(() => {
    const el = root.current;
    if (!el || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const nodes = [...el.querySelectorAll<HTMLElement>('.fm-step')];
      const target = innerHeight * .62;
      let nearest = 0, distance = Infinity;
      nodes.forEach((node, i) => { const r = node.getBoundingClientRect(); const d = Math.abs(r.top + r.height / 2 - target); if (d < distance) { distance = d; nearest = i; } });
      setActive(nearest);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    update(); window.addEventListener('scroll', schedule, { passive: true }); window.addEventListener('resize', schedule);
    return () => { cancelAnimationFrame(frame); window.removeEventListener('scroll', schedule); window.removeEventListener('resize', schedule); };
  }, [steps]);
  return <div className="fm-story" ref={root}>
    <figure className="fm-sticky">
      <div className="fm-photo">
        <img loading="lazy" src={inspection ? '/media/process/packaging-inspection.webp' : '/media/process/speaker-parts-carton.png'} alt={inspection ? 'DDNZ field photograph of speaker accessories and protective packaging' : 'Speaker parts carton labelled with model, quantity, dimensions and carton number'} />
        <div className="fm-progress" aria-hidden="true"><i style={{transform:`scaleX(${(active + 1) / steps.length})`}} /></div>
        <div className="fm-caption"><small>{inspection ? 'FROM CHECK TO RESOLUTION' : 'FROM PACKING TO CAPACITY'}</small><strong>{steps[active][0]}</strong><span>0{active + 1} / 0{steps.length}</span></div>
      </div>
      <figcaption>{inspection ? 'Field photo: audio packaging check. The phone-case incident is described alongside.' : 'DDNZ field photo · Speaker component identification'}</figcaption>
    </figure>
    <ol>{steps.map(([title, body], i) => <li className={`fm-step ${active === i ? 'fm-current' : ''}`} key={title}><span>0{i + 1}</span><h3>{title}</h3><p>{body}</p></li>)}</ol>
  </div>;
}

export function FieldReveal() {
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = root.current;
    if (!el || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let frame = 0;
    const update = () => {
      frame = 0; const r = el.getBoundingClientRect();
      const p = Math.max(0, Math.min(1, (innerHeight * .8 - r.top) / (innerHeight * .68)));
      el.style.setProperty('--fm-inset', `${(1 - p) * 19}%`);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    update(); window.addEventListener('scroll', schedule, { passive: true }); window.addEventListener('resize', schedule);
    return () => { cancelAnimationFrame(frame); window.removeEventListener('scroll', schedule); window.removeEventListener('resize', schedule); };
  }, []);
  return <section ref={root} className="fm-reveal" aria-label="DDNZ export operations">
    <figure><img src="/media/process/export-loading-poster.webp" alt="DDNZ export loading operations" loading="lazy" /><figcaption><small>ON THE GROUND · CHINA TO YOUR MARKET</small><h2>Many orders.<br/>One coordinated shipment.</h2><p>Product sourcing, packing and export — connected by one team.</p><a href="#retail-case">See how five buyers shared one container ↗</a></figcaption></figure>
  </section>;
}

const photos = [
  ['/media/process/supplier-visit-speaker.webp', 'Supplier showroom · Product discussions'],
  ['/media/process/kitchen-production-poster.webp', 'Factory visit · Kitchen equipment production'],
];
export function FieldGallery() {
  const [active, setActive] = useState(0);
  const move = (delta: number) => setActive(i => (i + delta + photos.length) % photos.length);
  return <div className="fm-gallery" aria-label="DDNZ field photo gallery">
    <div className="fm-deck">{photos.map(([src, caption], i) => {
      const slot = (i - active + photos.length) % photos.length;
      return <figure className={`fm-card fm-slot-${slot}`} key={src} aria-hidden={slot !== 0}>
        <img src={src} alt={caption} loading={i === 0 ? 'eager' : 'lazy'} /><figcaption>{caption}</figcaption>
      </figure>;
    })}</div>
    <div className="fm-gallery-controls"><button type="button" onClick={() => move(-1)} aria-label="Previous field photograph">←</button><span aria-live="polite">{active + 1} / {photos.length}</span><button type="button" onClick={() => move(1)} aria-label="Next field photograph">→</button></div>
    <p className="fm-gallery-note">DDNZ field photography · Supplier and factory visits</p>
  </div>;
}
