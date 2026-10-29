import copy from './copy.json' with {type:'json'};
export const seriesModels = [
 {id:'coffee-fr-e139',model:'FR-E139',groups:'1',family:'coffee',index:0,power:'2000 W',voltage:'220–240 V',pressure:'9 bar',water:'plumbed',size:'370 × 530 × 410 mm',net:'23 kg',image:'fr-e139',sourceId:'1601619013038'},
 {id:'coffee-g3200d',model:'G3200D',groups:'1',family:'coffee',index:1,power:'1500 W',voltage:'220–240 V · 50/60 Hz',pressure:'15 bar',water:'1.7 L',boilers:'550 ml + 1 L',net:'17 kg',image:'g3200d',sourceId:'1600258033313'},
 {id:'coffee-ys-3120gm',model:'YS-3120GM',groups:'2',family:'coffee',index:2,power:'4200 W',voltage:'220 V',pressure:'9 bar',water:'plumbed',size:'817 × 502 × 452 mm',image:'ys-3120gm',sourceId:'1600280285746'},
 {id:'coffee-f11-big-plus',model:'F11 Big Plus',family:'coffee',index:3,power:'1500–1700 W',voltage:'220–240 V',water:'8 L',display:'7″',packing:'620 × 520 × 680 mm',gross:'23 kg',image:'f11-big-plus',sourceId:'1601023066500'},
 {id:'speaker-dr602',model:'DR-602',family:'speaker',index:4,power:'40 W',drivers:'1 × 6″',battery:'7.4 V / 3600 mAh',size:'240 × 240 × 540 mm',net:'5.1 kg',gross:'6.4 kg',adapter:'9 V / 1.5 A',ports:'USB / TF / Bluetooth / FM / TWS',image:'dr-602',panel:'dr-602-panel'},
 {id:'speaker-dr6615',model:'DR-6615',family:'speaker',index:5,power:'40 W',drivers:'2 × 6.5″',battery:'7.4 V / 3600 mAh',size:'290 × 268 × 612 mm',net:'6.5 kg',gross:'7.5 kg',adapter:'9 V / 1.5 A',ports:'USB / TF / Bluetooth / FM / TWS',image:'dr-6615',panel:'dr-6615-panel'},
 {id:'speaker-dr8828',model:'DR-8828',family:'speaker',index:6,power:'60 W',drivers:'2 × 8″ + 2 tweeters',battery:'11.1 V / 4500 mAh',size:'320 × 325 × 730 mm',net:'8.85 kg',gross:'10.35 kg',adapter:'13.5 V / 1.5 A',ports:'USB / TF / Bluetooth / FM / TWS',image:'dr-8828',panel:'dr-8828-panel'},
 {id:'CK-129',model:'CK-129',groups:'2',temperature:'88–95 °C',preinfusion:'1–9 s',family:'coffee',index:7,power:'9500 W',boilers:'10 L + 2 × 0.8 L',size:'880 × 680 × 480 mm',image:'/commercial-kitchen-media/CK-129.webp',existing:true},
 {id:'CK-136',model:'CK-136',groups:'2',temperature:'88–95 °C',preinfusion:'1–9 s',family:'coffee',index:8,power:'9500 W',boilers:'10 L + 2 × 0.8 L',image:'/commercial-kitchen-media/CK-136.webp',existing:true},
 {id:'coffee-ky168',model:'KY-168',groups:'2',temperature:'88–95 °C',preinfusion:'1–9 s',family:'coffee',index:9,power:'5700 W',boilers:'10 L + 2 × 0.8 L',image:'ky-168-product-v2'},
 {id:'coffee-kyt2',model:'KY-T2',groups:'2',temperature:'88–95 °C',preinfusion:'1–9 s',family:'coffee',index:10,power:'5500 W',boilers:'10 L + 2 × 0.8 L',size:'750 × 580 × 540 mm',image:'ky-t2-product-v2'},
 {id:'speaker-tg117',model:'TG117',family:'speaker',segment:'portable',index:11,power:'5–10 W',bluetooth:'5.0',ports:'Bluetooth',packing:'150 × 80 × 80 mm',gross:'0.45 kg',brandingPreview:true,image:'/images/product-series/tg117-gallery-1-logo-v2.webp',sourceId:'1601693402223'},
 {id:'speaker-sp18',model:'SP18',microphone:'yes',charging:'1–3 h',battery:'500–1000 mAh',family:'speaker',segment:'portable',index:12,power:'5–10 W',bluetooth:'5.4',voltage:'DC 5 V',packing:'120 × 90 × 50 mm',gross:'0.11 kg',image:'/images/product-series/sp18-gallery-1.webp',sourceId:'1601645360462'}
].map(m=>({...m,image:m.image.startsWith('/')?m.image:`/images/product-series/${m.image}.webp`,panel:m.panel?`/images/product-series/${m.panel}.webp`:undefined}));
export function seriesCopy(locale='en'){return copy[locale==='zh-cn'?'zh':locale]||copy.en;}
export function seriesSpecs(model,locale='en'){
 const c=seriesCopy(locale);
 return ['power','bluetooth','voltage','groups','temperature','preinfusion','pressure','water','boilers','display','drivers','battery','microphone','charging','ports','adapter','size','net','gross','packing'].filter(key=>model[key]).map(key=>({key,label:c.fields[key],value:model[key]==='yes'?c.yes:model[key]==='plumbed'?c.plumbed:model[key].replace('tweeters',c.tweeters)}));
}
export const coffeeCatalogProducts=seriesModels.filter(m=>m.family==='coffee'&&!m.existing).map(m=>({...m,coffeeSeries:true,name:copy.en.names[m.index],category:'Beverage equipment',metric:m.power,detail:copy.en.uses[m.index],dimensions:m.size||copy.en.confirm,note:copy.en.notes[m.index],imageNote:copy.en.caption,quote:null,specs:Object.fromEntries(seriesSpecs(m).map(s=>[s.label,s.value]))}));
export function seriesQuote(locale,family,selection,notes=''){
 const c=seriesCopy(locale),prefix=locale==='en'?'':`/${locale==='zh'||locale==='zh-cn'?'zh-cn':locale}`;
 const models=seriesModels.filter(m=>m.family===family&&selection[m.id]>0);
 const brief=[family==='coffee'?c.coffeeTitle:c.speakerTitle,...models.map(m=>`${m.model} × ${selection[m.id]}\n${seriesSpecs(m,locale).map(s=>`${s.label}: ${s.value}`).join(' · ')}\n${c.notes[m.index]}`),notes,c.terms].filter(Boolean).join('\n');
 return `${prefix}/get-a-quote/?`+new URLSearchParams({leadGoal:'Product Sourcing',source:family==='coffee'?'coffee_model_catalogue':'speaker_model_catalogue',industry:family==='coffee'?'Commercial Kitchen Equipment':'Audio & Speakers',overviewBrief:brief,productScope:brief});
}
