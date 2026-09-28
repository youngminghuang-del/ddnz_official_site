import { kitchenModelHref } from '../commercial-kitchen/data/categories.mjs';
import { link, cards, wrap } from './content.mjs';
// Keep the equipment anchor available in both static HTML and the interactive catalogue.
const modelEntry = id => kitchenModelHref(id).replace('#commercial-kitchen-trade-pricing', '#commercial-kitchen-equipment');
export function renderRefrigerationEntry(){return wrap('refrigeration-categories','Choose refrigeration by the job it does.',
  '<p>Source commercial refrigeration equipment from China for chilled storage, frozen stock, food preparation, product display or ice service. Open a model to compare its buying price and add it to your equipment list.</p>'+cards([
    ['Chilled storage','Upright refrigerators for ingredients kept chilled.',modelEntry('cold-2'),'Compare GN650TNPro'],
    ['Frozen storage','Upright freezers for frozen stock.',modelEntry('cold-4'),'Compare GN650BTPro'],
    ['Refrigerated prep counters','Combine a work surface with chilled storage.',modelEntry('cold-7'),'Compare GNT2MTNPro'],
    ['Display cooling','Glass-door coolers for showing chilled products.',modelEntry('cold-42'),'Compare LC-615M1F'],
    ['Commercial ice makers','Choose ice-making equipment for drinks and service.','/sourcing/commercial-ice-machines-from-china/#model-ice-49','Compare HZB-50/AB and the range'],
  ])+'<div class="buyer-entry-links">'+link(modelEntry('cold-3'),'Larger refrigerator: GN1410TNPro')+link(modelEntry('cold-5'),'Larger freezer: GN1410BTPro')+link('/get-a-quote/?leadGoal=Product+Sourcing','Request a refrigeration assortment')+'</div>');}
export function renderKitchenEntry(scenarios){return wrap('kitchen-buying-paths','Start with your restaurant format.',
  '<p>Source a restaurant kitchen package from China around your menu, working space and service flow. Open a scenario to explore the layout and equipment groups.</p>'+cards(scenarios.map(s=>[s.tab,s.title,`/sourcing/restaurant-kitchen-packages-from-china/${s.slug}/`,'Explore this kitchen scenario']))+
  '<h3>Buying individual equipment?</h3><p>For a replacement machine or a wholesale range, compare individual products. For a complete project, use the scenario planner and request a matched package.</p><div class="buyer-entry-links">'+link('/sourcing/commercial-electric-fryers-from-china/','Electric fryers')+link('/sourcing/commercial-electric-griddles-from-china/','Electric griddles')+link('/refrigeration-equipment/','Refrigerators, freezers and ice makers')+link('/sourcing/food-processing-machinery-from-china/','Food preparation machinery')+link('/get-a-quote/?leadGoal=Product+Sourcing','Request a matched kitchen package')+'</div>');}
