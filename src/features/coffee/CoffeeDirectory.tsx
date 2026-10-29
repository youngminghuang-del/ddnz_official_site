import {seriesModels,seriesCopy} from '../product-series/models.mjs';
import {coffeeCopy,coffeePath,coffeePrefix} from './data.mjs';
export default function CoffeeDirectory({locale='en'}:{locale?:string}){const c=coffeeCopy(locale),s=seriesCopy(locale),path=coffeePrefix(locale)+coffeePath+'/';return <section id="coffee-machine-catalogue" className="coffee-directory"><h2><a href={path}>{c.nav} ↗</a></h2><p>{s.coffeeIntro}</p><nav>{seriesModels.filter(m=>m.family==='coffee').map(m=><a id={'series-model-'+m.id} key={m.id} href={path+'#series-model-'+m.id}>{m.model} ↗</a>)}</nav></section>;}
