// URL helpers must not load translation dictionaries.
export const localeCode=l=>l==='zh-cn'?'zh':l;
export const localePrefix=l=>localeCode(l)==='en'?'':`/${localeCode(l)==='zh'?'zh-cn':localeCode(l)}`;
