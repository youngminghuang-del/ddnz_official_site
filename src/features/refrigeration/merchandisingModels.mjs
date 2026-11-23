import {bakeryDisplayPath, ingredientRailPath} from './merchandisingRoutes.mjs';

const image = (name) => '/images/product-showcase/refrigeration/merchandising/' + name + '.webp';

export const merchandisingPages = /** @type {const} */ ({
  [bakeryDisplayPath]: {
    path: bakeryDisplayPath,
    heading: 'bakeryHeading',
    label: 'bakeryLabel',
    description: 'bakeryIntro',
    hero: image('cake-floor-curved'),
    groups: [
      {
        id: 'countertop', title: 'counterTitle', use: 'counterUse',
        models: [
          {code:'VE-80TZ', label:'straightTop', size:'500 × 530 × 750 mm', packing:'650 × 680 × 900 mm', watts:400, picture:image('cake-counter-straight'), check:'sameCode'},
          {code:'VE-120TR', label:'curvedTop', size:'700 × 530 × 750 mm', packing:'850 × 680 × 900 mm', watts:450, picture:image('cake-counter-curved'), check:'sameCode'},
        ],
      },
      {
        id:'floor-standing', title:'floorTitle', use:'floorUse',
        models:[
          {code:'VE-900Z', label:'straightFloor', size:'900 × 700 × 1200 mm', packing:'1050 × 850 × 1400 mm', watts:500, picture:image('cake-floor-straight')},
          {code:'VE-1200R', label:'curvedFloor', size:'1200 × 700 × 1200 mm', packing:'1350 × 850 × 1400 mm', watts:600, picture:image('cake-floor-curved')},
        ],
      },
      {
        id:'built-in', title:'builtTitle', use:'builtUse',
        models:[
          {code:'VE-900Q', label:'builtModel', size:'900 × {depth} × 1100 mm', packing:'1100 × 900 × 1300 mm', watts:580, picture:image('cake-built-in'), check:'builtCheck'},
          {code:'VE-1200ZJG', label:'cornerModel', size:'1200 × 1200 × 1200 mm', packing:'1350 × 1350 × 1350 mm', watts:850, picture:image('cake-corner'), check:'cornerCheck'},
        ],
      },
    ],
    questions:[
      ['bq1','ba1'],
      ['bq2','ba2'],
      ['bq3','ba3'],
    ],
  },
  [ingredientRailPath]: {
    path: ingredientRailPath,
    heading: 'railHeading',
    label:'railLabel',
    description:'railIntro',
    hero:image('ingredient-rail'),
    groups:[
      {id:'ingredient-models', title:'railTitle', use:'railUse',
        models:[
          {code:'VE-LT-4', label:'railModel', size:'1131 × 395 × 426 mm', packing:'1220 × 500 × 550 mm', watts:180, picture:image('ingredient-rail')},
          {code:'VE-LT-6', label:'railModel', size:'1483 × 395 × 426 mm', packing:'1570 × 500 × 550 mm', watts:180, picture:image('ingredient-rail')},
          {code:'VE-LT-8', label:'railModel', size:'1835 × 395 × 426 mm', packing:'1920 × 500 × 550 mm', watts:180, picture:image('ingredient-rail')},
        ],
      },
    ],
    questions:[
      ['rq1','ra1'],
      ['rq2','ra2'],
      ['rq3','ra3'],
    ],
  },
});

export const compactCoolers = /** @type {const} */ ([
  {code:'VE-58', label:'fourSide', size:'405 × 448 × 818 mm', watts:210, picture:image('compact-four-side'), temperature:'2–8 °C', check:'sameCode'},
  {code:'VE-028A', label:'compact', size:'480 × 500 × 700 mm', watts:190, picture:image('compact-drinks-small'), temperature:'−1–8 °C'},
  {code:'VE-128A', label:'drink', size:'600 × 505 × 880 mm', watts:280, picture:image('compact-drinks-series'), temperature:'2–8 °C'},
  {code:'VE-228A', label:'drink', size:'900 × 505 × 880 mm', watts:320, picture:image('compact-drinks-series'), temperature:'2–8 °C'},
]);
