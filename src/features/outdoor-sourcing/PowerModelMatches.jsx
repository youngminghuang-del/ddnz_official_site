import React from 'react';
import {Check} from 'lucide-react';
import {copy} from './catalog.mjs';
import {comparePowerModels} from './power-draft.mjs';
import {launchCopy} from './power-launch-copy.mjs';
export default function PowerModelMatches({rows,hours,eff,modelId,onChoose,locale}){
 const matches=comparePowerModels(rows,hours,eff),t=k=>copy(launchCopy[k],locale),f=n=>Number(n).toLocaleString(locale,{maximumFractionDigits:1});
 if(!matches.length)return null;
 return <section id="power-model-matches" className="opg-matches" aria-labelledby="power-matches-title"><h3 id="power-matches-title">{t('matches')}</h3><p>{t('matchIntro')}</p>{!matches.some(m=>m.fits)?<p className="opg-match-alert" role="status">{t('noMatch')}</p>:null}<div className="opg-match-grid">{matches.map(({model,result,fits,powerGap,energyGap})=><article className={'opg-match-card'+(fits?' is-fit':'')+(model.id===modelId?' is-current':'')} key={model.id} data-match-model={model.id}><div><h4>{model.model}</h4><span><bdi>{f(model.wh)} Wh · {f(model.watts)} W</bdi></span></div><p className="opg-match-status">{fits?<><Check size={15}/>{t('fits')}</>:t('insufficient')}</p>{!fits?<ul>{powerGap>0?<li>{t('powerGap')}: <bdi>{f(powerGap)} W</bdi></li>:null}{energyGap>0?<li>{t('energyGap')}: <bdi>{f(Math.ceil(energyGap*10)/10)} Wh</bdi></li>:null}</ul>:null}<button type="button" aria-pressed={model.id===modelId} aria-label={t('choose')+' · '+model.model} onClick={()=>onChoose(model.id)}>{t(model.id===modelId?'current':'choose')}{model.id===modelId?<Check size={15}/>:null}</button></article>)}</div><p className="ods-note">{t('comparisonNote')}</p></section>;
}
