import { seriesModels, seriesCopy } from '../product-series/models.mjs';
import { coffeeCopy, coffeePath, coffeePrefix } from './data.mjs';

const coffeeModels = seriesModels.filter(model => model.family === 'coffee');

export default function CoffeeDirectory({
  locale = 'en', compact = false, activeAnchor, categoryCard = false,
}: {
  locale?: string;
  compact?: boolean;
  activeAnchor?: string;
  categoryCard?: boolean;
}) {
  const copy = coffeeCopy(locale);
  const path = coffeePrefix(locale) + coffeePath + '/';
  const shortcuts = <nav className={compact || categoryCard ? 'coffee-model-shortcuts' : undefined}>
    {coffeeModels.map(model => {
      const anchor = 'series-model-' + model.id;
      return <a key={model.id} id={anchor} href={path + '#' + anchor}
        className={activeAnchor === '#' + anchor ? 'is-current-anchor' : undefined}>
        {model.model} ↗
      </a>;
    })}
  </nav>;

  if (categoryCard) {
    return <section id="coffee-machine-catalogue" className="wrap section kitchen-coffee-entry" aria-labelledby="kitchen-coffee-entry-title">
      <a className="kitchen-coffee-card" href={path} aria-labelledby="kitchen-coffee-entry-action">
        <div className="kitchen-coffee-image">
          <img src="/images/product-series/ky-168-product-v2.webp" alt="KY-168 双头商用咖啡机"
            width="1448" height="1086" loading="lazy" decoding="async"/>
        </div>
        <div className="kitchen-coffee-copy">
          <h2 id="kitchen-coffee-entry-title">{copy.nav}</h2>
          <p>按吧台空间和出杯需求，比较单头、双头和全自动机型。核对供水方式和尺寸，再按型号询价。</p>
          <span className="kitchen-coffee-action" id="kitchen-coffee-entry-action">
            查看咖啡机选型 <span aria-hidden="true">↗</span>
          </span>
        </div>
      </a>
      {shortcuts}
    </section>;
  }

  return <section id="coffee-machine-catalogue" className="coffee-directory">
    <h2><a href={path}>{copy.nav} ↗</a></h2>
    <p>{seriesCopy(locale).coffeeIntro}</p>
    {shortcuts}
  </section>;
}
