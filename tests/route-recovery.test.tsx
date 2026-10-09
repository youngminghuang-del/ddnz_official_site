import React from 'react';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { RecoveryMessage, RouteLoadingFallback, RouteErrorBoundary } from '../src/components/RouteRecovery';

test('failed route offers a visible manual recovery in each supported language', () => {
  for (const locale of ['en', 'zh-cn', 'ar', 'ru', 'es', 'fr', 'pt', 'tr']) {
    const html = renderToStaticMarkup(<RecoveryMessage failed pathname={`/${locale}/products/`}/>);
    assert.match(html, /role="alert"/);
    assert.match(html, /<button/);
    assert.match(html, locale === 'ar' ? /dir="rtl"/ : /dir="ltr"/);
    if (locale !== 'en') assert.doesNotMatch(html, /This page could not be loaded/);
  }
});
test('slow route recovery is a status, not a claim that loading failed', () => {
  const html = renderToStaticMarkup(<RecoveryMessage pathname="/products/"/>);
  assert.match(html, /taking longer/);
  assert.doesNotMatch(html, /could not be loaded/);
});
test('initial pending route retains its loading placeholder without a premature failure', () => {
  const html = renderToStaticMarkup(<MemoryRouter><RouteLoadingFallback/></MemoryRouter>);
  assert.match(html, /aria-busy="true"/);
  assert.doesNotMatch(html, /<button/);
});
test('boundary renders successful content and switches to recovery for a rejected route', () => {
  const boundary = new RouteErrorBoundary({pathname:'/ar/products/',children:<p>Product content</p>});
  assert.match(renderToStaticMarkup(boundary.render()), /Product content/);
  boundary.state = RouteErrorBoundary.getDerivedStateFromError();
  const html = renderToStaticMarkup(boundary.render());
  assert.match(html, /role="alert"/);
  assert.match(html, /dir="rtl"/);
  assert.doesNotMatch(html, /Product content/);
});
