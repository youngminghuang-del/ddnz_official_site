import copy from './copy.json' with {type:'json'};
export const coffeePath='/sourcing/commercial-coffee-machines-from-china';
export const coffeeCopy=(locale='en')=>copy[locale==='zh-cn'?'zh':locale]||copy.en;
export const coffeePrefix=(locale='en')=>locale==='en'?'':`/${locale==='zh'||locale==='zh-cn'?'zh-cn':locale}`;
export const coffeeMeta=(locale='en')=>({title:coffeeCopy(locale).title+' | DDNZ',description:coffeeCopy(locale).intro,image:'/images/product-series/ky-168.webp'});
export const coffeeAlternates=()=>Object.keys(copy).map(hrefLang=>({hrefLang:hrefLang==='zh'?'zh-cn':hrefLang,href:`https://www.ddnzglobal.com${coffeePrefix(hrefLang)}${coffeePath}/`}));
export const coffeeSchema=(locale='en')=>({'@context':'https://schema.org','@type':'CollectionPage',name:coffeeCopy(locale).title,description:coffeeCopy(locale).intro,url:`https://www.ddnzglobal.com${coffeePrefix(locale)}${coffeePath}/`,inLanguage:locale==='zh'?'zh-CN':locale});
