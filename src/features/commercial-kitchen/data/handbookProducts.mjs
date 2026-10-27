import {inductionModels,multiZoneModels,steamModels,noodleModels,roundCookerModels,largeWokModels} from './inductionModels.mjs';
import copies from '../locales/planning/induction-catalogue.json' with {type:'json'};
const groups={single:inductionModels,multi:multiZoneModels,steam:steamModels,noodle:noodleModels,round:roundCookerModels,large:largeWokModels};
export function handbookCopy(product,locale='en') {
 const base=copies[locale==='zh-cn'?'zh':locale],group=product.handbookGroup;
 if(!base||!group)return null;
 const prefix=group==='single'?'':group;
 const names=prefix?base[prefix+'Names']:base.names;
 const fields={...base.fields,power:(prefix&&base[prefix+'Power'])||base.fields.power};
 return {name:names[product.handbookIndex],fields,note:(prefix&&base[prefix+'Configuration'])||base.configuration,caption:product.id==='z-dcl02h'?base.seriesCaption:(prefix&&base[prefix+'Caption'])||base.caption};
}
export const handbookProducts=Object.entries(groups).flatMap(([group,models])=>models.map((model,index)=>{
 const product={...model,handbookGroup:group,handbookIndex:index};
 const c=handbookCopy(product);
 return {...product,name:c.name,category:'Cooking & baking',metric:model.power,detail:model.supply,note:c.note,imageNote:c.caption,quote:null,
 specs:Object.fromEntries(Object.keys(c.fields).filter(key=>model[key]).map(key=>[c.fields[key],model[key]]))};
}));
