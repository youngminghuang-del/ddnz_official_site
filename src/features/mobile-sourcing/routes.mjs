export const mobilePages = Object.freeze([
 {id:'hub',path:'/sourcing/mobile-accessories-from-china'},
 {id:'cases',path:'/phone-cases'},
 {id:'compare',path:'/phone-cases/materials-and-pricing'},
 {id:'straps',path:'/phone-straps-charms'},
]);
export const mobilePaths = Object.freeze(mobilePages.map(p=>p.path));
export function mobilePageForPath(path='') {return mobilePages.find(p=>p.path === String(path).replace(/^\/(zh-cn|es|ar|ru|fr|pt|tr)(?=\/)/,'').replace(/\/+$/,''));}
export const mobileArticleSlugs = Object.freeze(['mixed-sku-phone-cases-china-poland-moq-packing-reorders','magsafe-phone-cases-china-turkiye-dealer-verification','magsafe-ring-stand-sourcing-four-sample-comparison']);
