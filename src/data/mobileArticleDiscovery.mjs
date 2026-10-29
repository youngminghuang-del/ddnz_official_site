import { mobileArticleSlugs } from '../features/mobile-sourcing/routes.mjs';
export const mobileArticleDiscovery=Object.fromEntries(mobileArticleSlugs.map(slug=>[slug,{
 heading:'Plan your mobile accessories order',
 links:[{href:'/phone-cases/',label:'Browse phone cases and buying checks'},{href:'/phone-cases/materials-and-pricing/',label:'Compare case materials and supplier prices'},{href:'/phone-straps-charms/',label:'Explore phone straps, chains and charms'}]
}]));

// Keep the supplier article and its contact/download form intact. Connect it
// to the existing product comparison instead of adding another supplier list.
mobileArticleDiscovery['top-10-privacy-screen-protector-manufacturers-china']={
 title:'10 Privacy Screen Protector Manufacturers in China | DDNZ',
 description:'Compare 10 privacy screen protector manufacturers in China: phone models, privacy finishes and OEM packaging. Prepare samples and a wholesale quote.',
 heading:'Compare privacy glass for your buying list',
 links:[
  {href:'/screen-protectors/compare/#price-comparison',label:'Compare CNY reference prices, configurations and model minimums'},
  {href:'/screen-protectors/compare/#bear-glass',label:'View Bear clear and 28° privacy glass with installation kits'},
  {href:'/screen-protectors/brief/',label:'Prepare a screen protector quote request'}
 ]
};
