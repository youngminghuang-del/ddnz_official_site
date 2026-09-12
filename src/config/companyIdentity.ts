export const COMPANY = Object.freeze({
  brand: 'DDNZ GLOBAL',
  en: 'DDNZ Global Trade Co., Ltd.',
  zh: '大递诺展贸易有限公司',
  freightEn: 'Heaven Born International Freight Co., Ltd.',
  freightZh: '华正邦泰国际货运代理有限公司',
});
export const companyName = (language: string) => language === 'zh' ? COMPANY.zh : COMPANY.en;
