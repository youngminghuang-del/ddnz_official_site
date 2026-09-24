import React from 'react';
import './audio-speakers.css';
import './mobile-readability.css';
import ShowcaseSEO from './ShowcaseSEO';
import ShowcaseContactFooter from './ShowcaseContactFooter';
import SourcingHomepageNav from '../../components/SourcingHomepageNav';
import AudioSpeakersContent from './AudioSpeakersContent';

export function AudioSpeakers() {
  return <><ShowcaseSEO page="audio" /><SourcingHomepageNav /><AudioSpeakersContent />
      <ShowcaseContactFooter
        pageKey="audio-speakers"
        description="Audio-range sourcing, exact-model comparison, sample evidence and export handoff from China."
        tagline="Audio and speaker sourcing"
        links={[{ label: "Products", href: "/products/" }, { label: "Control fields", href: "#comparison" }, { label: "Start a brief", href: "#audio-rfq" }]}
        note="Illustrative records are replaced by order-specific evidence after the buyer brief"
      />
  </>;
}
export default AudioSpeakers;
