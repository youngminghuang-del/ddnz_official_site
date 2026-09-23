import test from 'node:test';
import assert from 'node:assert/strict';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import BrazilPortugueseContent, { brazilPortugueseFaqs } from '../src/features/freight/BrazilPortugueseContent';
import { navigationPath, supportedNavigationLanguages } from '../src/lib/productLanguageRouting';

test('Brazil has Portuguese navigation alongside translated Portuguese country routes', () => {
 assert(supportedNavigationLanguages('/shipping-from-china-to-brazil/').includes('pt'));
 assert.equal(navigationPath('/shipping-from-china-to-brazil/', 'pt'),'/pt/shipping-from-china-to-brazil/');
 assert.equal(navigationPath('/shipping-from-china-to-peru/', 'pt'),'/pt/shipping-from-china-to-peru/');
 assert.equal(navigationPath('/pt/shipping-from-china-to-brazil/', 'es'),'/es/shipping-from-china-to-brazil/');
});
test('Brazil Portuguese body carries destination, buying questions and scoped Portuguese quote', () => {
 const html=renderToStaticMarkup(createElement(BrazilPortugueseContent));
 assert.match(html, /lang="pt-BR"/);
 assert.equal((html.match(/<h1\b/g)||[]).length,1);
 for(const [question] of brazilPortugueseFaqs)assert(html.includes(question));
 assert.match(html,/\/pt\/get-a-quote\/\?leadGoal=Freight\+Export&amp;source=brazil_pt_freight&amp;dest=Brasil/);
 assert.match(html,/Siscomex/);
 assert.match(html,/catálogo em inglês/);
 assert.doesNotMatch(html,/Inquire Now|Shipping from China|Estimated Transit/);
});
