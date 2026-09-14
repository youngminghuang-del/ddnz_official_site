import { mobileArticleSlugs } from '../features/mobile-sourcing/routes.mjs';
export const mobileArticleDiscovery=Object.fromEntries(mobileArticleSlugs.map(slug=>[slug,{
 heading:'Plan your mobile accessories order',
 links:[{href:'/phone-cases/',label:'Browse phone cases and buying checks'},{href:'/phone-cases/materials-and-pricing/',label:'Compare case materials and supplier prices'},{href:'/phone-straps-charms/',label:'Explore phone straps, chains and charms'}]
}]));
