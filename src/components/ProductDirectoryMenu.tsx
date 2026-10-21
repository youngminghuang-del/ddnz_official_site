import directoryLabels from '../config/productDirectoryLabels.json';
import utilityVehicleCopies from '../features/electric-utility-vehicles/locales.json';
import tricycleCopies from '../features/electric-tricycles/locales.json';
import supplementCopies from '../features/catalogue-additions/locales.json';
import {Link} from 'react-router-dom';
import {ChevronDown} from 'lucide-react';
import type {Language} from '../i18n/translations';
import {navigationPath,isEnglishProductPath} from '../lib/productLanguageRouting';
import {kitchenCategoryNavigation} from '../config/kitchenCategoryNavigation';
import {foodCategoryNavigation} from '../config/foodCategoryNavigation';
import {audioCategoryNavigation} from '../config/audioCategoryNavigation';
import {mobileCategoryNavigation} from '../config/mobileCategoryNavigation';
import {screenProtectorNavigation} from '../config/screenProtectorNavigation';
import {outdoorCategoryNavigation} from '../config/outdoorCategoryNavigation';

type Entry={label:string;to:string;children?:Entry[];wide?:boolean};
const copy:Record<Language,string[]>={
 zh:['商用餐厨设备','食品加工机械','能源与户外设备','电动出行与运输','消费电子与配件','便携电源与太阳能配套','家庭储能系统','便携空调','车载冰箱','户外设备总览','电动单车','电动滑板车','平衡车','手机配件','音响与扬声器','成人滑板车','儿童滑板车','查看目录','查看全部产品','商用制冷设备'],
 en:['Commercial kitchen equipment','Food processing machinery','Energy & outdoor equipment','Electric mobility & transport','Consumer electronics & accessories','Portable power & solar','Home energy storage','Portable air conditioners','Vehicle refrigerators','Outdoor equipment overview','Electric bicycles','Electric scooters','Self-balancing scooters','Mobile accessories','Audio & speakers','Adult electric scooters','Children’s electric scooters','View category','View all products','Commercial refrigeration'],
 es:['Equipos de cocina comercial','Maquinaria alimentaria','Energía y equipos para exterior','Movilidad y transporte eléctricos','Electrónica y accesorios','Energía portátil y solar','Almacenamiento doméstico','Aire acondicionado portátil','Neveras para vehículos','Equipos para exterior','Bicicletas eléctricas','Patinetes eléctricos','Vehículos autoequilibrados','Accesorios móviles','Audio y altavoces','Patinetes para adultos','Patinetes infantiles','Ver categoría','Ver todos los productos','Refrigeración comercial'],
 fr:['Équipement de cuisine professionnelle','Machines agroalimentaires','Énergie et équipements extérieurs','Mobilité et transport électriques','Électronique et accessoires','Énergie portable et solaire','Stockage résidentiel','Climatiseurs portables','Réfrigérateurs pour véhicules','Équipements extérieurs','Vélos électriques','Trottinettes électriques','Gyropodes','Accessoires mobiles','Audio et enceintes','Trottinettes pour adultes','Trottinettes pour enfants','Voir la catégorie','Tous les produits','Froid commercial'],
 pt:['Equipamentos de cozinha profissional','Máquinas de processamento de alimentos','Energia e equipamentos outdoor','Mobilidade e transporte elétricos','Eletrônicos e acessórios','Energia portátil e solar','Armazenamento residencial','Ar-condicionado portátil','Refrigeradores para veículos','Equipamentos outdoor','Bicicletas elétricas','Patinetes elétricos','Hoverboards','Acessórios para celular','Áudio e caixas de som','Patinetes para adultos','Patinetes infantis','Ver categoria','Todos os produtos','Refrigeração comercial'],
 ru:['Профессиональное кухонное оборудование','Пищевое оборудование','Энергоснабжение и оборудование для отдыха','Электротранспорт','Электроника и аксессуары','Портативное и солнечное питание','Домашние накопители энергии','Портативные кондиционеры','Автомобильные холодильники','Оборудование для отдыха','Электровелосипеды','Электросамокаты','Гироскутеры','Мобильные аксессуары','Аудио и колонки','Самокаты для взрослых','Детские самокаты','Открыть каталог','Все товары','Холодильное оборудование'],
 tr:['Endüstriyel mutfak ekipmanları','Gıda işleme makineleri','Enerji ve açık hava ekipmanları','Elektrikli ulaşım ve taşıma','Elektronik ve aksesuarlar','Taşınabilir güç ve güneş enerjisi','Ev tipi enerji depolama','Taşınabilir klimalar','Araç buzdolapları','Açık hava ekipmanları','Elektrikli bisikletler','Elektrikli scooterlar','Denge scooterları','Mobil aksesuarlar','Ses ve hoparlörler','Yetişkin scooterları','Çocuk scooterları','Kategoriyi görüntüle','Tüm ürünler','Ticari soğutma'],
 ar:['معدات المطابخ التجارية','آلات تصنيع الأغذية','الطاقة والمعدات الخارجية','التنقل والنقل الكهربائي','الإلكترونيات والملحقات','الطاقة المحمولة والطاقة الشمسية','تخزين الطاقة المنزلية','مكيفات هواء محمولة','ثلاجات المركبات','المعدات الخارجية','دراجات كهربائية','سكوترات كهربائية','ألواح توازن كهربائية','ملحقات الهاتف','الصوت ومكبرات الصوت','سكوترات للبالغين','سكوترات للأطفال','عرض الفئة','جميع المنتجات','التبريد التجاري'],
};
const overviewLabels:Record<Language,[string,string]>={
 zh:['手机配件总览','音响与扬声器总览'],en:['Mobile accessories overview','Audio & speakers overview'],
 fr:['Tous les accessoires mobiles','Tous les produits audio'],es:['Todos los accesorios móviles','Todos los productos de audio'],
 pt:['Visão geral de acessórios para celular','Visão geral de áudio'],ru:['Все мобильные аксессуары','Все аудиотовары'],
 tr:['Mobil aksesuarlara genel bakış','Ses ürünlerine genel bakış'],ar:['نظرة عامة على ملحقات الهاتف','نظرة عامة على المنتجات الصوتية'],
};
export function productDirectoryGroups(language:Language){
 const c=copy[language],outdoor=outdoorCategoryNavigation(language),labels=directoryLabels[language];
 const kitchen=kitchenCategoryNavigation(language),food=foodCategoryNavigation(language);
 const powerLabels={zh:'便携电源产品',en:'Portable power stations',es:'Estaciones de energía portátiles',fr:'Stations d’énergie portables',pt:'Estações de energia portáteis',ru:'Портативные электростанции',tr:'Taşınabilir güç istasyonları',ar:'محطات الطاقة المحمولة'};
 const scooter='/sourcing/electric-scooters-from-china';
 return [
  {label:c[0],to:'/sourcing/commercial-kitchen-equipment-from-china',children:[
   {label:labels.kitchenOverview,to:'/sourcing/commercial-kitchen-equipment-from-china',wide:true},
   {label:labels.equipment,to:'/sourcing/commercial-kitchen-equipment-from-china',children:[...kitchen.slice(1),{label:c[19],to:'/refrigeration-equipment'}]},
   {label:labels.kitchenPackages,to:kitchen[0].to,children:[kitchen[0]]},
  ]},
  {label:c[1],to:'/sourcing/food-processing-machinery-from-china',children:[
   {label:labels.foodOverview,to:'/sourcing/food-processing-machinery-from-china',wide:true},
   {label:labels.processing,to:'/sourcing/food-processing-machinery-from-china',children:food.slice(0,4)},
   {label:labels.packages,to:food[4].to,children:[food[4]]},
  ]},
  {label:c[2],to:'/sourcing/outdoor-products-from-china',children:[
   {label:labels.power,to:'/sourcing/portable-power-stations-from-china',children:[{label:powerLabels[language],to:'/sourcing/portable-power-stations-from-china'},{label:c[6],to:'/sourcing/home-energy-storage-from-china'},outdoor[1]]},
   {label:labels.outdoor,to:'/sourcing/outdoor-products-from-china',children:[{label:c[9],to:'/sourcing/outdoor-products-from-china'},{label:c[7],to:'/sourcing/portable-air-conditioners-from-china'},{label:c[8],to:'/sourcing/portable-compressor-fridges-from-china'},{label:supplementCopies[language].wagon.nav,to:'/sourcing/outdoor-products-from-china/#camping-wagon'}]},
   {label:labels.guides,to:outdoor[3].to,wide:true,children:[{...outdoor[3],label:language==='zh'?'便携电源选型指南':outdoor[3].label}]},
  ]},
  {label:c[3],to:'/products',children:[
   {label:labels.vehicles,to:'/products',children:[{label:c[10],to:'/sourcing/electric-bicycles-from-china'},{label:tricycleCopies[language].nav,to:'/sourcing/electric-tricycles-from-china'},{label:utilityVehicleCopies[language].nav,to:'/sourcing/electric-utility-vehicles-from-china'},{label:c[11],to:scooter},{label:c[12],to:scooter+'/#sc-b01'}]},
   {label:labels.parts,to:scooter+'/#scooter-hub-motors',children:[{label:supplementCopies[language].motor.nav,to:scooter+'/#scooter-hub-motors'}]},
  ]},
  {label:c[4],to:'/products',children:[{label:c[13],to:'/sourcing/mobile-accessories-from-china',children:[{label:overviewLabels[language][0],to:'/sourcing/mobile-accessories-from-china'},...mobileCategoryNavigation(language).map(({label,to})=>({label,to})),screenProtectorNavigation(language)]},{label:c[14],to:'/sourcing/audio-speakers-from-china',children:[{label:overviewLabels[language][1],to:'/sourcing/audio-speakers-from-china'},...audioCategoryNavigation(language)]}]},
 ] satisfies Entry[];
}
export default function ProductDirectoryMenu({language,onNavigate,variant}:{language:Language;onNavigate:()=>void;variant:'desktop'|'mobile'}){
 const c=copy[language];
 const linkClass='block min-h-11 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-purple-50 hover:text-purple-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-700';
 const leaf=(entry:Entry,key:string)=><Link key={key} onClick={onNavigate} to={navigationPath(entry.to,language)} hrefLang={isEnglishProductPath(navigationPath(entry.to,language))?'en':language} className={linkClass}>{entry.label}</Link>;
 const renderEntry=(entry:Entry,key:string)=>entry.children?.length?<div role="group" aria-label={entry.label} className="px-1 py-2"><p className="px-3 pb-2 text-sm font-semibold text-slate-900">{entry.label}</p><ul className="space-y-1">{entry.children.map((child,i)=><li key={child.to}>{leaf(child,key+'-'+i)}</li>)}</ul></div>:leaf(entry,key);
 return <div data-product-directory={variant} className={variant==='desktop'?'w-[min(680px,calc(100vw-2rem))] max-h-[calc(100dvh-120px)] overflow-y-auto p-1':''}><div className="space-y-2">{productDirectoryGroups(language).map(group=><details key={group.label} name={`product-directory-${variant}`} className="group/directory rounded-lg border border-slate-200 bg-white"><summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 rounded-lg px-4 py-3 font-semibold text-slate-900 hover:bg-purple-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-700 [&::-webkit-details-marker]:hidden"><span>{group.label}</span><ChevronDown className="h-4 w-4 shrink-0 transition-transform group-open/directory:rotate-180"/></summary><ul className={variant==='desktop'?'grid grid-cols-2 items-start gap-x-3 border-t border-slate-100 p-2':'border-t border-slate-100 p-2'}>{group.children.map((entry,i)=><li key={entry.label} className={entry.wide?'col-span-full':undefined}>{renderEntry(entry,group.label+'-'+i)}</li>)}</ul></details>)}</div><Link onClick={onNavigate} to={navigationPath('/products',language)} className="mt-3 block min-h-11 border-t border-slate-200 px-3 py-3 font-semibold text-purple-800">{c[18]} →</Link></div>;
}
