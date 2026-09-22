import { FieldStory } from './ServiceMotion';
import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import type { SourcingServiceKind } from './SourcingServicePage';

const cases = {
  'supplier-search': {
    title:'Source around how your business operates.',
    intro:'After more than ten years working with HB for freight, an Abidjan customer began working with DDNZ’s supply-chain team in 2024 to source dual-8-inch Bluetooth party speakers in Guangdong.',
    steps:[['Understand the local operation','The customer could assemble speakers and carry out basic repairs locally, and requested shipment in parts to fit more units into each container.'],['Work with factory engineers','DDNZ took the requirement to the factory’s engineers. Together they developed a complete loading plan within one day.'],['Improve the packing approach','For the first model, the plan increased capacity from 637 conventionally packed complete speakers to parts for 740 speakers per 40HQ.']],
    result:'A sourcing decision shaped around the customer’s assembly capability and container capacity, as part of a four-40HQ speaker project from Guangzhou to Abidjan.',
    cta:'Discuss your sourcing requirements',
  },
  'inspection-quality-control': {
    title:'A defective batch stopped in China. A solution agreed with the customer.',
    intro:'During the Türkiye phone-case order, checks of styles and models, quantities, appearance and packaging identified defective products.',
    steps:[['Pause & separate','DDNZ paused packing, loading and release of the affected goods. Suspect products were separated from goods confirmed acceptable.'],['Establish the facts','The team checked what was wrong, how many products were affected and whether the factory could put it right.'],['Agree & remake','DDNZ brought the customer a remedy and schedule. Following customer approval, the team and factory completed the defective batch’s remake in two days.']],
    result:'After receipt, the customer expressed satisfaction that DDNZ disclosed the issue, proposed a workable solution and carried it through. The tight sailing schedule did not lead to shipping the known defective goods.',
    cta:'Discuss an inspection',
  },
  'consolidation-export': {
    title:'FCL loading case: 103 more speakers in one 40HQ.',
    intro:'For a four-40HQ Bluetooth party-speaker project from Guangzhou to Abidjan, DDNZ worked with factory engineers on a parts-based packing and loading plan.',
    steps:[['The original format','For the first model, a 40HQ held 637 complete speakers with retail boxes, foam protection and accessories.'],['The revised packing','Speaker drivers, cabinets and circuit boards were packed separately. Retail boxes travelled with the shipment; foam inserts were omitted. The buyer could assemble and carry out basic repairs locally.'],['The revised loading plan','DDNZ and the factory’s engineers developed the plan in one day. The first model could then be loaded as parts for 740 speakers per 40HQ.']],
    result:'An additional 103 speaker sets per 40HQ: approximately 16.2% more than the original 637-unit configuration. These figures refer to the first model, not every model in the four-container project.',
    cta:'Discuss a lower-cost shipment plan',
  },
};

export default function ServiceCaseDetail({kind,quoteHref}:{kind:SourcingServiceKind;quoteHref:string}) {
  const content=cases[kind];
  const section=useRef<HTMLElement>(null);
  useEffect(()=>{
    const nodes=section.current?.querySelectorAll('.sc-capacity,.sc-duty,.sc-inner>ol>li');
    if(!nodes || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('sc-visible');observer.unobserve(entry.target);}}),{threshold:0.15});
    nodes.forEach(node=>{node.classList.add('sc-animate');observer.observe(node);});
    return ()=>observer.disconnect();
  },[kind]);
  return <section ref={section} className="sc-case" id="service-case" aria-labelledby="sc-title">
    <div className="sc-inner"><p className="sc-kicker">{kind === 'inspection-quality-control' ? 'IN PRACTICE · TÜRKİYE PHONE-CASE ORDER' : 'IN PRACTICE · GUANGZHOU TO ABIDJAN'}</p><h2 id="sc-title">{content.title}</h2><p className="sc-intro">{content.intro}</p>
      {kind === 'consolidation-export' && <div className="sc-capacity" aria-label="Loading capacity comparison"><div><span>COMPLETE SPEAKERS</span><strong>637</strong><div style={{width:'86.1%'}} /><small>Units per 40HQ · original packaging</small></div><div><span>SHIPPED IN PARTS</span><strong>740</strong><div style={{width:'100%'}} /><small>Speaker sets per 40HQ · revised plan</small></div></div>}
      {kind !== 'supplier-search' ? <FieldStory steps={content.steps} inspection={kind === 'inspection-quality-control'} /> : <ol>{content.steps.map(([title,body],index)=><li key={title}><span>0{index+1}</span><h3>{title}</h3><p>{body}</p></li>)}</ol>}
      {kind === 'consolidation-export' && <aside className="sc-result" style={{marginBottom:20}}><strong>A DIFFERENT PACKING CHOICE · GUANGZHOU TO NHAVA SHEVA</strong><h3>Plan around total cost and margin.</h3><p>In another speaker shipment to Nhava Sheva port, components were boxed separately with foam protection. That configuration accommodated 600 speaker sets per container. For this project, DDNZ reports an import-duty comparison of 44% for finished speakers versus 18% for components. The parts-based arrangement was selected to reduce import costs and create more room for margin.</p><div className="sc-duty" aria-label="Project import-duty comparison"><div><strong>44%</strong><span>Finished speakers</span></div><div><strong>18%</strong><span>Components</span></div><div><strong>26 pp</strong><span>Percentage-point difference</span></div></div><p>Project-specific figures supplied by DDNZ. Applicable rates depend on the goods, classification and import date; confirm the current treatment with the destination customs broker.</p><p>DDNZ coordinates sourcing, packing and loading around the customer’s local capabilities and import arrangements, with the aim of lowering total landed cost and improving profit potential.</p></aside>}
      <div className="sc-result"><strong>THE OUTCOME</strong><p>{content.result}</p></div>
      <div className="sc-actions"><div><Link className="ddnz-button ddnz-button-primary" to={quoteHref}>{content.cta} →</Link><p>Start with your products, approximate quantity and destination. Service arrangements are confirmed per order.</p></div>{kind === 'inspection-quality-control' ? <Link to="/sourcing-services/?review=candidate#retail-case">Read the full order story →</Link> : <Link to="/sourcing/audio-speakers-from-china/">Explore audio &amp; speakers →</Link>}</div>
    </div>
  </section>;
}
