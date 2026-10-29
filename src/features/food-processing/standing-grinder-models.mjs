import copies from './locales/standing-grinders.json' with {type:'json'};
export const standingGrinders=[
 {id:'jr-gg32a',model:'JR-GG32A',power:'2.2 kW',supply:'220 / 380 V · 50 Hz',dimensions:'480 × 800 × 780 mm',weight:'89 kg',output:'450 kg/h',quotationDimensions:'800 × 482 × 780 mm'},
 {id:'jr-gg42a',model:'JR-GG42A',power:'4 kW',supply:'380 V · 50 Hz',dimensions:'600 × 930 × 880 mm',weight:'115 kg',output:'800 kg/h',reference:{price:8700,packing:0,currency:'CNY'}},
 {id:'jr-gl22',model:'JR-GL22',series:'gl',power:'1.5 kW',supply:'220 / 380 V · 50 Hz',dimensions:'470 × 410 × 700 mm',weight:'35 kg',output:'220 kg/h',reference:{price:1950,packing:30,currency:'CNY'}},
 {id:'jr-gl32',model:'JR-GL32',series:'gl',power:'1.5 kW',supply:'220 / 380 V · 50 Hz',dimensions:'470 × 410 × 700 mm',weight:'36 kg',output:'320 kg/h',reference:{price:2100,packing:30,currency:'CNY'}},
];
export const grinderEligible=page=>page.kind==='hub'||page.category?.slug==='meat-processing-machinery';
export function standingGrinderListItems(page,locale,url,offset=0){return grinderEligible(page)?standingGrinders.map((p,i)=>({'@type':'ListItem',position:offset+i+1,name:p.model+' '+(p.series==='gl'?copies[locale].compactName:copies[locale].name),url:url+'#machine-'+p.id})):[];}
