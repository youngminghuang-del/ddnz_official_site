import kitchenProducts from '../commercial-kitchen/data/products.mjs';
// Supplier handbook 06, PDF pages 28 / 5. Keep existing product identities.
const supplements=[
 {id:'cold-3',kind:'upright',power:265,refrigerant:'R290',netKg:145,grossKg:160,packing:'1470 × 920 × 2030 mm',page:28,detailPage:27,image:'/images/product-showcase/refrigeration/gn1410tnpro-details.webp'},
 {id:'cold-8',kind:'counter',power:185,refrigerant:'R290',netKg:96.5,grossKg:109,packing:'1825 × 750 × 870 mm',page:28,detailPage:27,image:'/images/product-showcase/refrigeration/gnt3mtnpro-details.webp'},
 {id:'cold-15',kind:'display',power:450,refrigerant:'R290',netKg:177,grossKg:199,packing:'1300 × 805 × 2250 mm',page:5,detailPage:4,image:'/images/product-showcase/refrigeration/lc1253m2w-details.webp'},
];
export const refrigerationModels=supplements.map(s=>{
 const p=kitchenProducts.find(p=>p.id===s.id);
 if(!p)throw new Error('Missing existing cold-storage product: '+s.id);
 return {...s,model:p.model,capacity:p.specs.Capacity,temperature:p.specs.Temperature,size:p.dimensions.replace(/\s*mm$/,' mm'),quote:p.quote};
});
