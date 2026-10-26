import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import ArticleReadingContent from '../src/features/article-reading/ArticleReadingContent';
import {articleLabel,articleUi,readingDate,buildPrimaryCta} from '../src/features/article-reading/model';
import {normalizeQuoteHtml} from '../src/lib/quoteLinkPolicy.mjs';
import solar from '../src/data/solarCableRelease.json';
import type {BlogPost} from '../src/types/content';
const fixture:BlogPost={id:'reading-layout',slug:'cables-carga-solar-mayoreo-china',language:'es',title:'Cables de carga solar al por mayor desde China: conectores, calibre y surtido para importadores',summary:'Guía visual para preparar una compra de cables solares.',category:'Sourcing',date:'2026-10-26',content:solar.content,thumbnailUrl:'/images/posts/cables-carga-solar-mayoreo-china/ecoflow-xt60i-overview.png',contentType:'Buyer Guide',audienceMarket:'Latin America',wordCount:1781,readMinutes:9,reviewMode:'human',reviewer:['Huang Matthew'],toc:solar.toc as BlogPost['toc'],primaryCTA:'Outdoor Products Sourcing',governed:true};
const render=(post=fixture,language='es')=>renderToStaticMarkup(React.createElement(ArticleReadingContent,{post,language,articleHtml:{__html:normalizeQuoteHtml(post.content)},primaryCta:buildPrimaryCta(post,language==='en'?'':'/'+language,articleUi[language as keyof typeof articleUi]||articleUi.en)}));
test('the shared reading template retains the entire approved body, diagrams, heading anchors and quote context',()=>{
 const html=render(),body=normalizeQuoteHtml(fixture.content);
 assert.ok(html.includes(body));assert.ok(html.includes(fixture.title));assert.equal((html.match(/<h1\b/g)||[]).length,1);
 assert.ok(html.includes('Huang Matthew'));assert.ok(html.includes('Guía de compra'));assert.ok(html.includes('Latinoamérica'));
 for(const item of fixture.toc||[])assert.equal((html.match(new RegExp('id="'+item.id+'"','g'))||[]).length,1);
 assert.ok(html.includes('href="#solar-1"'));assert.ok(html.includes('id="article-primary-cta"'));assert.ok(html.includes('data-analytics-tracked="true"'));
 assert.ok(html.includes('class="article-reading-mobile-toc"'));assert.ok(html.includes('class="article-reading-sidebar"'));
 assert.ok(!html.includes('Registros de evidencia'));assert.ok(!html.includes('BUYER GUIDE'));
});
test('nine article languages localize navigation metadata and preserve content without inventing reviewers',()=>{
 for(const language of ['en','zh','es','fr','ru','pt','tr','ar','id']){
  const post={...fixture,language,reviewMode:'delegated-automation' as const,reviewer:['Internal automated research'],content:'<p>Body preserved.</p><h2 id="one">One</h2>',toc:[{id:'one',text:'One',level:2 as const}]};
  const html=render(post,language);assert.ok(html.includes('Body preserved.'));assert.ok(html.includes(articleLabel('Buyer Guide',language).replaceAll('&','&amp;')));assert.ok(!html.includes('Internal automated research'));assert.ok(!html.includes('article-reading-sidebar'));
  assert.ok(html.includes('dir="'+(language==='ar'?'rtl':'ltr')+'"'));assert.ok(readingDate('2026-10-26',language));
 }
 assert.equal(articleLabel('Latin America, Middle East','es'),'Latinoamérica · Oriente Medio');
 assert.equal(readingDate('not-a-date','es'),'not-a-date');
});
