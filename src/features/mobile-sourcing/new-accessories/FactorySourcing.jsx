import React from 'react';
import {copyFor} from '../catalog.mjs';
import {accessoryCopy} from './copy.mjs';
import {localizedProductPath} from '../../../lib/productLocalization.mjs';
export default function FactorySourcing({locale}){
 const c=k=>copyFor(accessoryCopy[k],locale);
 return <section className="ms-section ms-factory-sourcing" id="factory-sourcing">
  <div>
   <h2>{c('factoryTitle')}</h2>
   <p>{c('factoryIntro')}</p>
   <p>{c('factoryBody')}</p>
   <a href="#buying-brief">{c('factoryCta')} →</a>
  </div>
  <div>
   {['Audio','Style','Gear'].map(k=><details key={k}><summary>{c('factory'+k+'Title')}</summary><p>{c('factory'+k)}</p></details>)}
   <a href={localizedProductPath('/sourcing-services/supplier-search',locale)}>{c('factoryLink')} →</a>
   <a href={localizedProductPath('/sourcing-services/inspection-quality-control',locale)}>{c('qualityLink')} →</a>
  </div>
 </section>;
}
