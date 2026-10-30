import { ArrowRight } from 'lucide-react';
import './russia-overlay-hero.css';

type Props = {
  title: string;
  intro: string;
  onQuote: () => void;
  children: React.ReactNode;
};

// A single Chinese Russia-page visual sample. The scene is not shipment evidence.
export default function RussiaOverlayHero({ title, intro, onQuote, children }: Props) {
  return <>
    <header className="russia-overlay-hero" aria-labelledby="russia-overlay-heading">
      <img src="/images/operations/china-eurasia-rail-border-hero-v1.webp" alt="暮色中的铁路货场与集装箱吊装场景示意" width="1920" height="1080" fetchPriority="high" />
      <div className="russia-overlay-hero__shade" aria-hidden="true" />
      <div className="russia-overlay-hero__content">
        <h1 id="russia-overlay-heading">{title}</h1>
        <p>{intro}</p>
        <button type="button" className="russia-overlay-hero__action" onClick={onQuote}>获取航线与税费规划建议 <ArrowRight size={19} aria-hidden="true" /></button>
      </div>
      <p className="russia-overlay-hero__caption">铁路货运场景示意</p>
    </header>
    <div className="russia-overlay-facts">{children}</div>
  </>;
}
