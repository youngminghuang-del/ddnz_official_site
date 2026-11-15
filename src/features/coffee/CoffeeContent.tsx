import CatalogueHeroHeading from '../../components/catalogue-hero/CatalogueHeroHeading';
import CatalogueHeroMedia from '../../components/catalogue-hero/CatalogueHeroMedia';
import ScenePlanning from '../product-experience/ScenePlanning';
import ProgressiveSection, { experienceCopy } from '../product-experience/ProgressiveSection';
import ProductSeries from '../product-series/ProductSeries';
import { seriesModels, seriesCopy } from '../product-series/models.mjs';
import { coffeeCopy, coffeePath, coffeePrefix, coffeeSchema } from './data.mjs';
import selectionCopy from './selection-copy.json';

const coffeeModels = seriesModels.filter(model => model.family === 'coffee');
const machineTypes = [
  { key: 'single', image: 'fr-e139.webp', modelIds: coffeeModels.filter(model => model.groups === '1').map(model => model.id) },
  { key: 'double', image: 'ky-168-product-v2.webp', modelIds: coffeeModels.filter(model => model.groups === '2').map(model => model.id) },
  { key: 'automatic', image: 'f11-big-plus.webp', modelIds: ['coffee-f11-big-plus'] },
] as const;

export default function CoffeeContent({ locale = 'en' }: { locale?: string }) {
  const lang = locale === 'zh-cn' ? 'zh' : locale;
  const copy = coffeeCopy(lang);
  const selection = selectionCopy[lang as keyof typeof selectionCopy] ?? selectionCopy.en;
  const groups = machineTypes.map(({ key, image, modelIds }) => ({
    id: `coffee-type-${key}`,
    title: selection[key][0],
    description: selection[key][1],
    image,
    modelIds,
  }));

  return (
    <main id="main-content" className="coffee-page" lang={lang === 'zh' ? 'zh-CN' : lang} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(coffeeSchema(lang)).replace(/</g, '\\u003c') }} />
      <section className="coffee-hero catalogue-hero">
        <div>
          <CatalogueHeroHeading text={copy.title} language={lang} />
          <p>{copy.intro}</p>
          <a className="coffee-cta" href="#coffee-types">{selection.action} ↓</a>
        </div>
        <CatalogueHeroMedia src="/images/product-series/ky-168-product-v2.webp" alt="KY-168" language={lang} label="KY-168" />
      </section>

      <section className="coffee-types" id="coffee-types" aria-labelledby="coffee-types-title">
        <h2 id="coffee-types-title">{selection.title}</h2>
        <ul className="coffee-type-grid">
          {groups.map(group => (
            <li key={group.id}>
              <a href={`#${group.id}`} className="coffee-type-link">
                <img src={`/images/product-series/${group.image}`} width="100" height="78" alt="" loading="lazy" decoding="async" />
                <span>
                  <strong>{group.title} <span aria-hidden="true">↓</span></strong>
                  <span>{group.description}</span>
                </span>
              </a>
            </li>
          ))}
        </ul>
        <a className="coffee-selected-link" href="#coffee-model-request">{seriesCopy(lang).selected} ↓</a>
      </section>

      <ProductSeries family="coffee" locale={lang} standalone canonicalPath={coffeePath + '/'} catalogueGroups={groups} />

      <section className="coffee-plan">
        <h2>{copy.plan}</h2>
        <div>{copy.topics.map((topic, index) => <article key={topic}><h3>{topic}</h3><p>{copy.texts[index]}</p></article>)}</div>
      </section>
      <ProgressiveSection title={experienceCopy(lang).coffeeScene} locale={lang}><ScenePlanning family="coffee" locale={lang} /></ProgressiveSection>
      <section className="coffee-plan">
        <h2>{copy.question}</h2>
        <p>{copy.answer}</p>
        <a href={`${coffeePrefix(lang)}/sourcing/commercial-kitchen-equipment-from-china/#commercial-kitchen-list`}>{copy.cta} · {copy.nav} ↗</a>
      </section>
    </main>
  );
}
