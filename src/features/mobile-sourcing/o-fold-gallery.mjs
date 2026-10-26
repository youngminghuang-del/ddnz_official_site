import { oFoldCopy, oFoldImages } from './privacy-o-fold.mjs';
const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function renderOFold(locale='en', { selectable=false, selected=false }={}) {
 const lang=locale==='zh-cn'?'zh':locale,c=oFoldCopy[lang]||oFoldCopy.en;
 const prefix=lang==='en'?'':'/'+(lang==='zh'?'zh-cn':lang);
 const action=selectable?`<button class="ofold-action" type="button" data-ofold-select aria-pressed="${selected}">${escape(selected?c.added:c.add)} ↗</button>`:`<a class="ofold-action" href="${prefix}/sourcing/mobile-accessories-from-china/#privacy-o-fold">${escape(c.add)} ↗</a>`;
 return `<section class="privacy-ofold" id="privacy-o-fold" aria-labelledby="ofold-title" data-ofold-locale="${lang}"><div class="ofold-gallery"><button class="ofold-main" data-ofold-open type="button" aria-label="${escape(c.photo)}"><img data-ofold-main src="${oFoldImages[0]}" alt="${escape(c.title+' · '+c.images[0])}" width="1200" height="1200" loading="lazy"><span>${escape(c.photo)} ↗</span></button><div class="ofold-thumbs">${oFoldImages.map((src,i)=>`<button type="button" data-ofold-index="${i}" aria-pressed="${i===0}" aria-label="${escape(c.images[i])}"><img src="${src}" alt="" width="120" height="120" loading="lazy"></button>`).join('')}</div><p data-ofold-caption>${escape(c.images[0])} · 1 / 6</p></div><div class="ofold-copy"><p class="ofold-eyebrow">${escape(c.eyebrow)} · P28-OF</p><h2 id="ofold-title">${escape(c.title)}</h2><p>${escape(c.intro)}</p><h3>${escape(c.priceLabel)}</h3><dl class="ofold-prices">${[[300,2999,'3.45'],[3000,null,'3.20']].map(([min,max,price])=>`<div><dt><bdi>${min.toLocaleString('en-US')}${max?'–'+max.toLocaleString('en-US'):'+'}</bdi> ${escape(c.pieces)}</dt><dd><bdi>CNY ${price}</bdi><small>${escape(c.perPiece)}</small></dd></div>`).join('')}</dl><p class="ofold-minimum">${escape(c.minimum)}</p><p>${escape(c.packing)}</p>${action}</div><dialog class="ofold-dialog" aria-label="${escape(c.photo)}"><div class="ofold-dialog-head"><strong>${escape(c.title)}</strong><button type="button" data-ofold-close aria-label="${escape(c.close)}">×</button></div><img data-ofold-dialog-image src="${oFoldImages[0]}" alt="${escape(c.images[0])}" width="1200" height="1200" loading="lazy"><div class="ofold-dialog-controls"><button type="button" data-ofold-step="-1" aria-label="${escape(c.previous)}">←</button><span data-ofold-counter>1 / 6</span><button type="button" data-ofold-step="1" aria-label="${escape(c.next)}">→</button></div></dialog></section>`;
}

export function mountOFoldGallery(root,onSelect) {
 const update=(section,index)=>{
  const c=oFoldCopy[section.dataset.ofoldLocale]||oFoldCopy.en,i=(index+6)%6;
  section.dataset.ofoldActive=String(i);
  for(const image of section.querySelectorAll('[data-ofold-main],[data-ofold-dialog-image]')) {image.src=oFoldImages[i];image.alt=c.title+' · '+c.images[i];}
  section.querySelectorAll('[data-ofold-index]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.ofoldIndex)===i)));
  section.querySelector('[data-ofold-caption]').textContent=c.images[i]+' · '+(i+1)+' / 6';
  section.querySelector('[data-ofold-counter]').textContent=(i+1)+' / 6';
 };
 const click=event=>{
  const section=event.target.closest('.privacy-ofold');if(!section||!root.contains(section))return;
  const dialog=section.querySelector('dialog'),button=event.target.closest('button');
  if(event.target===dialog){dialog.close();return;}
  if(!button)return;
  if(button.hasAttribute('data-ofold-select'))onSelect?.();
  else if(button.hasAttribute('data-ofold-index'))update(section,Number(button.dataset.ofoldIndex));
  else if(button.hasAttribute('data-ofold-open'))dialog.showModal();
  else if(button.hasAttribute('data-ofold-close'))dialog.close();
  else if(button.hasAttribute('data-ofold-step'))update(section,Number(section.dataset.ofoldActive||0)+Number(button.dataset.ofoldStep));
 };
 const key=event=>{const dialog=event.target.closest('.ofold-dialog[open]');if(dialog&&['ArrowLeft','ArrowRight'].includes(event.key)){event.preventDefault();const s=dialog.closest('.privacy-ofold');update(s,Number(s.dataset.ofoldActive||0)+(event.key==='ArrowRight'?1:-1));}};
 const dialogs=[...root.querySelectorAll('.ofold-dialog')],close=event=>event.target.closest('.privacy-ofold').querySelector('[data-ofold-open]').focus();
 root.addEventListener('click',click);root.addEventListener('keydown',key);dialogs.forEach(d=>d.addEventListener('close',close));
 return ()=>{root.removeEventListener('click',click);root.removeEventListener('keydown',key);dialogs.forEach(d=>d.removeEventListener('close',close));};
}
