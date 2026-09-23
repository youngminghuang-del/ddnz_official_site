export const foodProcessingPath = '/sourcing/food-processing-machinery-from-china';
export const sourceDate = '2026-05-08';
export const foodProcessingMeta = {
  title: 'Food Processing Machinery Sourcing from China | DDNZ Global',
  description: 'Compare dough mixers, meat grinders and vegetable preparation machines from China. Build equipment packages with CNY wholesale prices and separate packing costs.',
  image: '/food-processing-media/spiral-mixer.webp',
};
export const families = [
  { id: 'dough', title: 'Dough & noodles', detail: 'Mix dough, then roll sheets for your chosen noodle cutter.' },
  { id: 'bakery', title: 'Bakery preparation', detail: 'Spiral mixing, planetary mixing and bread slicing.' },
  { id: 'meat', title: 'Meat preparation', detail: 'Slice, mince, mix paste and form meatballs.' },
  { id: 'vegetables', title: 'Vegetable preparation', detail: 'Peel roots, slice vegetables and chop ingredients.' },
  { id: 'grain', title: 'Bean, rice & juice', detail: 'Separate pulp, grind wet rice and press sugarcane.' },
  { id: 'poultry', title: 'Poultry plucking', detail: 'Compare plucker construction and replacement fingers.' },
];
// Prices transcribed ONLY from 批发价(元). No retail price, discount or margin applied.
// Packing is the supplier-listed package, not an assertion of export suitability.
// Dimensions/weights follow the price list; differences against the catalogue are disclosed.
export const machines = [
  { id: 'hw-j15-copper', model: 'HW-J15', name: 'Dough kneader', family: 'dough', variant: 'Copper-core motor · 15 kg model', price: 1470, packing: 40, packingType: 'Wood packing', power: '1.5 kW', dimensions: '520 × 670 × 760 mm', weight: 59, pricePage: 2, catalogPage: 10, image: 'kneader', note: 'Select the copper-core version; the aluminium-core version has a different price.' },
  { id: 'yh-gt300', model: 'YH-GT300', name: 'Tabletop dough roller', family: 'dough', variant: 'Copper motor · steel rollers', price: 1180, packing: 0, packingType: 'Wood frame included', power: '1.5 kW', dimensions: '430 × 480 × 450 mm', weight: 42, pricePage: 1, catalogPage: 9, image: 'dough-roller', note: 'Noodle cutter excluded. Standard 1.5–6 mm flat cutter: CNY 150 each, before tax. Stainless rollers: +CNY 180.' },
  { id: 'h20', model: 'H20', name: 'Spiral dough mixer', family: 'bakery', variant: 'Mechanical speed change', price: 2300, packing: 0, packingType: 'Wood frame included', power: '1.5 kW', dimensions: '750 × 400 × 850 mm', weight: 86, pricePage: 3, catalogPage: 6, image: 'spiral-mixer', note: 'Catalogue height is 860 mm; confirm the production dimensions. H20-B and H20-T are separate variants.' },
  { id: 'b20-guard', model: 'B20', name: 'Planetary mixer', family: 'bakery', variant: 'With bowl guard · three functions', price: 2150, packing: 0, packingType: 'Wood frame included', power: '1.5 kW', dimensions: '550 × 520 × 830 mm', weight: 63, pricePage: 3, catalogPage: 5, image: 'planetary-mixer', note: 'Price is for the guarded version; verify attachments and interlock configuration.' },
  { id: 'q31b', model: 'Q31B', name: 'Bread slicer', family: 'bakery', variant: '31-blade model', price: 2150, packing: 0, packingType: 'Wood frame included', power: '0.25 kW', dimensions: '515 × 625 × 585 mm', weight: 48, pricePage: 3, catalogPage: 11, image: 'bread-slicer', note: 'Match loaf dimensions and slice thickness before ordering.' },
  { id: 'dq-t', model: 'DQ-T', name: 'Tabletop meat slicer', family: 'meat', variant: 'Removable stainless blade set', price: 580, packing: 0, packingType: 'Carton included', power: '0.85 kW', dimensions: '370 × 340 × 350 mm', weight: 20, pricePage: 4, catalogPage: 14, image: 'meat-slicer', note: 'Catalogue weight is 18 kg; price list states 20 kg. Confirm blade spacing and suitable meat condition.' },
  { id: 'jr-gg22', model: 'JR-GG22', name: 'Tabletop meat grinder', family: 'meat', variant: 'All-steel grinding parts · copper motor', price: 1120, packing: 0, packingType: 'Carton included', power: '1.1 kW', dimensions: '410 × 230 × 470 mm', weight: 20, pricePage: 5, catalogPage: 12, image: 'meat-grinder', note: 'Sausage nozzle listed as included. JR-G22 is a different configuration.' },
  { id: 'dj-h18', model: 'DJ-H18', name: 'Meat paste mixer', family: 'meat', variant: 'Tilting double-bowl construction', price: 870, packing: 40, packingType: 'Wood packing', power: '1.5 kW', dimensions: '480 × 420 × 770 mm', weight: 31, pricePage: 7, catalogPage: 22, image: 'paste-mixer', note: 'Batch size and mixing time need to be matched to the recipe.' },
  { id: 'cx-l', model: 'CX-L', name: 'Meatball former', family: 'meat', variant: 'Standing model · four mould sets', price: 2560, packing: 0, packingType: 'Wood frame included', power: '1.1 kW', dimensions: '700 × 390 × 1220 mm', weight: 65, pricePage: 7, catalogPage: 22, image: 'meatball-former', note: 'Standard version; variable-speed CX-LB is priced separately.' },
  { id: 'tp-350', model: 'TP-350', name: 'Potato peeler', family: 'vegetables', variant: 'Abrasive peeling drum', price: 1200, packing: 50, packingType: 'Wood packing', power: '1.1 kW', dimensions: '660 × 410 × 830 mm', weight: 50, pricePage: 6, catalogPage: 25, image: 'potato-peeler', note: 'Catalogue length is 680 mm; price list states 660 mm. Confirm water and drainage connections.' },
  { id: 'dq-ps300-copper', model: 'DQ-PS300', name: 'Vegetable slicer & shredder', family: 'vegetables', variant: 'Copper-core motor · one-way blade', price: 1150, packing: 0, packingType: 'Wood frame included', power: '1.1 kW', dimensions: '400 × 360 × 750 mm', weight: 34, pricePage: 6, catalogPage: 27, image: 'vegetable-slicer', note: 'Confirm blade set and cut sizes. This is the copper-core version.' },
  { id: 'sc-r22', model: 'SC-R22', name: 'Vegetable chopper', family: 'vegetables', variant: 'Steel shaft & blade', price: 380, packing: 0, packingType: 'Carton included', power: '0.55 kW', dimensions: '320 × 230 × 480 mm', weight: 9, pricePage: 6, catalogPage: 27, image: 'chopper', note: 'Confirm batch size and cutting result using your ingredients.' },
  { id: 'mj-d100', model: 'MJ-D100', name: 'Pulp separator', family: 'grain', variant: 'Copper motor · cast-aluminium housing', price: 650, packing: 0, packingType: 'Carton included', power: '1.1 kW', dimensions: '270 × 320 × 630 mm', weight: 20, pricePage: 6, catalogPage: 23, image: 'pulp-separator', note: 'Catalogue dimensions differ (250 × 460 × 610 mm). Confirm model revision before space planning.' },
  { id: 'mj-h12', model: 'MJ-H12', name: 'Wet rice grinder', family: 'grain', variant: 'Copper motor · steel base', price: 780, packing: 0, packingType: 'Wood frame included', power: '0.75 kW', dimensions: '240 × 460 × 700 mm', weight: 28, pricePage: 6, catalogPage: 24, image: 'rice-grinder', note: 'Confirm ingredient preparation, fineness and cleaning procedure.' },
  { id: 'gz-tc', model: 'GZ-TC', name: 'Sugarcane juicer', family: 'grain', variant: 'Mains-powered tabletop model', price: 1370, packing: 0, packingType: 'Wood frame included', power: '0.35 kW', dimensions: '380 × 275 × 540 mm', weight: 31, pricePage: 7, catalogPage: 31, image: 'sugarcane-juicer', note: 'GZ-TD battery and GZ-TS dual-power models are different configurations.' },
  { id: 'tm-hl', model: 'TM-HL', name: 'Poultry plucker', family: 'poultry', variant: 'All-steel large model · copper motor', price: 1380, packing: 45, packingType: 'Wood packing', power: '1.5 kW', dimensions: '605 × 605 × 950 mm', weight: 57, pricePage: 7, catalogPage: 30, image: 'poultry-plucker', note: 'Confirm bird type, preparation process and replacement finger sizes.' },
];
export const packages = [
  { id: 'noodles', title: 'Noodle & dough preparation', description: 'Knead dough and roll sheets for fresh noodle preparation.', steps: ['Knead', 'Roll', 'Cut with optional cutter'], items: ['hw-j15-copper','yh-gt300'], extra: 'Add a matching noodle cutter (standard flat cutter: CNY 150, before tax). Cooking equipment is separate.' },
  { id: 'bakery', title: 'Bakery preparation', description: 'Prepare bread dough and other mixtures, then slice baked loaves.', steps: ['Spiral mix', 'Planetary mix', 'Slice baked bread'], items: ['h20','b20-guard','q31b'], extra: 'Oven, proofer, refrigeration and worktables are not included. Match batch sizes before confirming the set.' },
  { id: 'meat-prep', title: 'Butcher & kitchen preparation', description: 'Cover slicing and mincing with two dedicated tabletop machines.', steps: ['Slice', 'Grind'], items: ['dq-t','jr-gg22'], extra: 'Select blade spacing and grinding plates. Refrigeration, bone sawing and frozen-block processing are separate.' },
  { id: 'meatballs', title: 'Meatball preparation', description: 'Grind ingredients, prepare paste and form meatballs.', steps: ['Grind', 'Mix paste', 'Form'], items: ['jr-gg22','dj-h18','cx-l'], extra: 'Cooking, chilling and packaging equipment are separate. Validate recipe and batch balance before ordering.' },
  { id: 'vegetables', title: 'Vegetable preparation', description: 'Prepare roots and other ingredients with separate cutting options.', steps: ['Peel roots', 'Slice or shred', 'Chop'], items: ['tp-350','dq-ps300-copper','sc-r22'], extra: 'Choose blades for the desired cut. Sink, drain and worktables are separate; these machines are not an automatic line.' },
  { id: 'bean-rice', title: 'Bean & rice preparation', description: 'A paired selection for pulp separation and wet rice grinding.', steps: ['Separate pulp', 'Grind wet rice'], items: ['mj-d100','mj-h12'], extra: 'These are separate preparation functions. Soaking, cooking, filtering and storage equipment are separate.' },
];
export const machineById = Object.fromEntries(machines.map(machine => [machine.id, machine]));
export function packageSelection(bundle) { return Object.fromEntries(bundle.items.map(id => [id, 1])); }
export function selectionTotals(selection) {
  return Object.entries(selection).reduce((total,[id,quantity]) => {
    const item=machineById[id];
    if (!item || !Number.isInteger(quantity) || quantity < 1 || quantity > 99) return total;
    return { equipment: total.equipment + item.price*quantity, packing: total.packing + item.packing*quantity, units: total.units+quantity };
  },{equipment:0,packing:0,units:0});
}
export const money = amount => `CNY ${amount.toLocaleString('en-US')}`;
export function inquiryUrl(selection, destination = '', requirement = '') {
  const totals=selectionTotals(selection);
  const lines=Object.entries(selection).filter(([id,q])=>machineById[id]&&Number.isInteger(q)&&q>0&&q<=99).map(([id,q])=>{
    const p=machineById[id];return `${p.model} (${p.variant}) × ${q}: ${money(p.price*q)}; packing ${money(p.packing*q)}`;
  });
  return '/get-a-quote/?'+new URLSearchParams({leadGoal:'Product Sourcing',industry:'Food processing machinery',productScope:lines.join('\n'),subcategory:'Food processing equipment',dest:destination,source:'food_processing',notes:[`Wholesale price list: ${sourceDate}.`,...lines,`Equipment: ${money(totals.equipment)}. Listed packing: ${money(totals.packing)}.`, 'Options, export packing upgrades, freight, tax and service fees to be confirmed separately.',requirement].filter(Boolean).join('\n')}).toString();
}
