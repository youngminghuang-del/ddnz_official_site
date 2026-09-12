// Dated display references; no background rate requests or settlement-rate promise.
export const fx = Object.freeze({
 date:'2026-09-12', updatedAt:'2026-09-12T00:02:31Z',
 source:'https://open.er-api.com/v6/latest/USD',
 rates:Object.freeze({USD:1,CNY:6.725314,AED:3.6725,SGD:1.267129,MXN:16.968909})
});
export const marketCurrency = country => ({'United Arab Emirates':'AED',Singapore:'SGD',Mexico:'MXN'}[country]||'USD');
export function convertPrice(amount,from,to){
 if(amount===null||amount===undefined||String(amount).trim()===''||!Number.isFinite(Number(amount))||Number(amount)<0)return null;
 if(from===to)return Math.round(Number(amount)*100)/100;
 if(!fx.rates[from]||!fx.rates[to])return null;
 return Math.round(Number(amount)/fx.rates[from]*fx.rates[to]*100)/100;
}
export const formatPrice = (value,currency) => `${currency} ${Number(value).toLocaleString('en',{minimumFractionDigits:2,maximumFractionDigits:2})}`;
