import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import {
  buildSupplementalCorridorSpec,
  EURASIA_CASE_IMAGES,
  EURASIA_CHEMICAL_CASE,
  EURASIA_CHEMICAL_CASE_IMAGES,
  EURASIA_COUNTRIES,
  EURASIA_DELAY_DIAGNOSTIC,
  EURASIA_UI,
  EURASIA_WHEEL_HUB_CASE,
  EURASIA_WHEEL_HUB_DESTINATION,
  UZBEKISTAN_ROAD_CASE,
  UZBEKISTAN_ROAD_CASE_IMAGES,
  localizedCorridorProfile,
  localizedCountryName,
  type EurasiaLocale,
} from '../src/features/freight/eurasiaCorridors.ts';

const locales: EurasiaLocale[] = ['en', 'zh', 'ru', 'fr', 'es', 'ar'];

test('Russia and all five Central Asian destinations have complete localized route briefs', () => {
  assert.deepEqual(EURASIA_COUNTRIES, [
    'russia', 'kazakhstan', 'uzbekistan', 'kyrgyzstan', 'tajikistan', 'turkmenistan',
  ]);

  for (const country of EURASIA_COUNTRIES) {
    for (const locale of locales) {
      const profile = localizedCorridorProfile(country, locale);
      const brief = buildSupplementalCorridorSpec(country, locale);
      assert.equal(profile.name, localizedCountryName(country, locale));
      assert.ok(profile.gateway.length > 8, `${country}/${locale} needs a gateway`);
      assert.ok(profile.destinations.length > 8, `${country}/${locale} needs destination scope`);
      assert.equal(brief.multimodalTable.length, 4);
      assert.equal(brief.solutions.length, 3);
      assert.equal(brief.faqs.length, 3);
      assert.ok(brief.headline.includes(profile.name));
      assert.ok(EURASIA_UI[locale].quoteConfirmed.length > 20);
    }
  }
});

test('delay diagnostic and wheel-hub case stay complete in every supported locale', () => {
  assert.equal(EURASIA_CASE_IMAGES.length, 5);

  for (const image of EURASIA_CASE_IMAGES) {
    assert.ok(
      existsSync(new URL(`../public${image.src}`, import.meta.url)),
      `missing case image ${image.src}`,
    );
  }

  for (const locale of locales) {
    const diagnostic = EURASIA_DELAY_DIAGNOSTIC[locale];
    const caseStudy = EURASIA_WHEEL_HUB_CASE[locale];
    assert.equal(diagnostic.items.length, 5, `${locale} needs five delay causes`);
    assert.equal(diagnostic.questions.length, 3, `${locale} needs three pre-booking questions`);
    assert.equal(caseStudy.metrics.length, 5, `${locale} needs five case metrics`);
    assert.equal(caseStudy.steps.length, 5, `${locale} needs five operating steps`);
    assert.ok(caseStudy.excluded.length > 10, `${locale} needs a clear service exclusion`);
    assert.ok(EURASIA_WHEEL_HUB_DESTINATION[locale].length > 8, `${locale} needs a localized case destination`);

    for (const image of EURASIA_CASE_IMAGES) {
      assert.ok(caseStudy.captions[image.key].length > 8, `${locale}/${image.key} needs a caption`);
    }
  }

  const visibleCopy = JSON.stringify({ EURASIA_DELAY_DIAGNOSTIC, EURASIA_WHEEL_HUB_CASE });
  assert.doesNotMatch(visibleCopy, /[–—]/, 'new visible copy should not use en or em dashes');
});

test('regulated chemical loading case keeps evidence and controls complete in every locale', () => {
  assert.equal(EURASIA_CHEMICAL_CASE_IMAGES.length, 7);

  for (const image of EURASIA_CHEMICAL_CASE_IMAGES) {
    assert.ok(
      existsSync(new URL(`../public${image.src}`, import.meta.url)),
      `missing chemical case image ${image.src}`,
    );
  }

  for (const locale of locales) {
    const caseStudy = EURASIA_CHEMICAL_CASE[locale];
    assert.ok(caseStudy.title.length > 10, `${locale} needs a specific title`);
    assert.equal(caseStudy.titleLines.length, 2, `${locale} needs an intentional heading break`);
    assert.ok(caseStudy.checkpointBody.length > 50, `${locale} needs a classification limitation`);
    assert.equal(caseStudy.checkpoints.length, 5, `${locale} needs five cargo controls`);
    for (const image of EURASIA_CHEMICAL_CASE_IMAGES) {
      assert.ok(caseStudy.captions[image.key].length > 8, `${locale}/${image.key} needs a caption`);
    }
  }

  const visibleCopy = JSON.stringify(EURASIA_CHEMICAL_CASE);
  assert.doesNotMatch(visibleCopy, /[–—]/, 'chemical case copy should not use en or em dashes');
  assert.doesNotMatch(visibleCopy, /o-xylene|邻二甲苯/i, 'unverified product identity must not be published');
});

test('Uzbekistan road-loading case keeps route evidence complete and destination-specific', () => {
  assert.equal(UZBEKISTAN_ROAD_CASE_IMAGES.length, 2);

  for (const image of UZBEKISTAN_ROAD_CASE_IMAGES) {
    assert.ok(
      existsSync(new URL(`../public${image.src}`, import.meta.url)),
      `missing Uzbekistan road case image ${image.src}`,
    );
  }

  for (const locale of locales) {
    const caseStudy = UZBEKISTAN_ROAD_CASE[locale];
    assert.equal(caseStudy.route.length, 3, `${locale} needs three route nodes`);
    assert.equal(caseStudy.steps.length, 5, `${locale} needs five loading controls`);
    assert.ok(caseStudy.evidenceNote.length > 30, `${locale} needs an evidence limitation`);
    assert.ok(caseStudy.controlBody.length > 40, `${locale} needs a pre-dispatch control explanation`);
    for (const image of UZBEKISTAN_ROAD_CASE_IMAGES) {
      assert.ok(caseStudy.captions[image.key].length > 12, `${locale}/${image.key} needs a caption`);
    }
  }

  const visibleCopy = JSON.stringify(UZBEKISTAN_ROAD_CASE);
  assert.doesNotMatch(visibleCopy, /[–—]/, 'Uzbekistan road case copy should not use en or em dashes');

  const page = readFileSync(new URL('../src/pages/shipping-from-china-to-central-asia.tsx', import.meta.url), 'utf8');
  assert.match(page, /selectedCountry === 'uzbekistan'.*uzbekistan-road-loading-case/s);
  assert.match(page, /selectedCountry === 'kazakhstan'.*chemical-loading-case/s);
  assert.match(page, /selectedCountry === 'kazakhstan' \|\| selectedCountry === 'uzbekistan'/);
});

test('routing, static generation and navigation expose all six Eurasia destinations', () => {
  const app = readFileSync(new URL('../src/App.tsx', import.meta.url), 'utf8');
  const staticPages = readFileSync(new URL('../scripts/generate-static-pages.ts', import.meta.url), 'utf8');
  const navbar = readFileSync(new URL('../src/components/Navbar.tsx', import.meta.url), 'utf8');
  const page = readFileSync(new URL('../src/pages/shipping-from-china-to-central-asia.tsx', import.meta.url), 'utf8');

  for (const country of EURASIA_COUNTRIES) {
    assert.match(app, new RegExp(`['\"]${country}['\"]`));
    assert.match(staticPages, new RegExp(`\\b${country}:`));
    assert.match(navbar, new RegExp(`en: '${localizedCountryName(country, 'en')}'`));
  }

  assert.match(page, /china-eurasia-rail-border-hero-v1\.webp/);
  assert.match(page, /eec\.eaeunion\.org/);
  assert.match(page, /unece\.org/);
  assert.match(page, /cpmm\.carecprogram\.org/);
  assert.match(page, /sw2\.customs\.uz/);
  assert.match(page, /bis\.gov/);
  assert.doesNotMatch(page, /29\+ лет/);
  assert.doesNotMatch(page, /в течение 2 часов/);
});
