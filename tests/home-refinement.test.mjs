import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const read = name => readFileSync(new URL('../'+name, import.meta.url), 'utf8');
const hero = read('src/components/SourcingHomepageHero.tsx');

test('homepage reads introduction, field photo, products, then brief in DOM order', () => {
  const order = ['className="home-intro-copy"', 'className="home-intro-photo"', 'id="product-categories"', 'id="sourcing-brief"'];
  for (let i=1; i<order.length; i++) assert.ok(hero.indexOf(order[i-1]) < hero.indexOf(order[i]));
  assert.doesNotMatch(hero, /pexels-|lg:whitespace-nowrap/);
  assert.match(hero, /ddnz-team-cutout-20260914\.webp/);
  assert.match(hero, /fetchPriority="high"/);
  assert.equal((hero.match(/id="sourcing-brief-title"/g)||[]).length, 1);
});
test('brief is local navigation with preserved intent, category, destination and attribution', () => {
  assert.match(hero, /data-candidate-validated="true" onSubmit=\{\(event\) => \{ event.preventDefault\(\); goToQuote\(intent\); \}\}/);
  for (const value of ['Product Sourcing', 'Supplier Inspection & Consolidation', 'Freight Export', 'homepage_sourcing_selector', "params.set('dest', market)", 'appendAttribution', 'homepage_intent_submit', 'homepage_category_select']) assert.ok(hero.includes(value), value);
  assert.doesNotMatch(hero, /fetch\(|formspree|method="post"/);
  assert.match(hero, /<Link to=\{canonicalSitePath\('\/products'\)\} hrefLang="en"/);
  assert.equal((hero.match(/href: navigationPath\(/g) || []).length, 4);
});
test('all eight languages have a compact intro and reduced-motion-safe brief focus', () => {
  const intros=hero.split('const HERO_INTRO:')[1].split('const categoryImageAlts:')[0];
  for(const lang of ['en','zh','ru','fr','es','ar','pt','tr']) assert.match(intros, new RegExp(`\\b${lang}: \\{ headline: .+body: .+caption: .+imageAlt:`));
  assert.match(hero, /prefers-reduced-motion: reduce/);
  assert.match(hero, /focus\(\{ preventScroll: true \}\)/);
  const css=read('src/styles/ddnz-refinement.css');
  assert.match(css, /#view-videos \.process-directory/);
  assert.doesNotMatch(css, /\.planner|\.route-card|\.cost-lines|\.unit-cost/);
});
