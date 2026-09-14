import test from 'node:test';
import assert from 'node:assert/strict';
import { mountScreenProtectors } from '../src/features/screen-protectors/controller.mjs';
import { createScreenProtectorActionReporter, screenProtectorJourneyAnalytics } from '../src/features/screen-protectors/site-analytics.mjs';
import { ROUTES, INQUIRY_PATH, pageForPath } from '../src/features/screen-protectors/routes.mjs';
import { DRAFT_KEY, HANDOFF_KEY } from '../src/features/screen-protectors/handoff.mjs';

test('journey payloads contain only fixed actions and never promote a brief to a lead', () => {
  const actions = ['select_configuration', 'model_change', 'compare_products', 'read_guide',
    'specification_change', 'open_videos', 'select_video_stage', 'play_video',
    'open_calculator', 'calculator_change', 'create_brief', 'copy_brief', 'download_brief', 'continue_inquiry'];
  for (const action of actions) {
    assert.deepEqual(screenProtectorJourneyAnalytics(action, {
      model: 'Private model', email: 'buyer@example.com', price: 999,
      url: '/screen-protectors?model=private', brief: 'Private buying notes',
    }), {
      event: 'screen_protector_journey',
      params: { content_group: 'screen_protectors', journey_action: action },
    });
  }
  for (const action of [null, undefined, {}, ['model_change'], new String('model_change'),
    'buyer@example.com', 'model_change?model=private', 'generate_lead', 'submit_success',
    'constructor', 'toString', ' calculator_change ', 999]) {
    assert.equal(screenProtectorJourneyAnalytics(action), null);
  }
});

test('optional action callbacks are whitelisted, isolated from failures and stopped by abort', () => {
  for (const callback of [undefined, null, false, {}]) {
    assert.doesNotThrow(() => createScreenProtectorActionReporter(callback)('model_change'));
  }
  const lifecycle = new AbortController(), received = [];
  const report = createScreenProtectorActionReporter((...args) => received.push(args), lifecycle.signal);
  report({ action: 'model_change', model: 'Private model' });
  report('generate_lead');
  report('model_change', { model: 'Private model', price: 999 });
  assert.deepEqual(received, [['model_change']]);
  assert.doesNotThrow(() => createScreenProtectorActionReporter(() => { throw new Error('Tracker unavailable'); })('create_brief'));
  lifecycle.abort();
  report('continue_inquiry');
  assert.deepEqual(received, [['model_change']]);
});

// A small control tree with native EventTarget listeners exercises the real controller.
// Rendering is out of scope here; controls remain addressable across innerHTML updates.
class Control extends EventTarget {
  constructor(tag = 'div', options = {}, parent = null) {
    super();
    Object.assign(this, { tag, id: '', dataset: {}, className: '', attributes: new Map(), children: [],
      value: '', checked: false, hidden: false, open: false, parentElement: parent }, options);
    parent?.children.push(this);
  }
  matches(selector) {
    if (selector.includes(' ')) {
      const index = selector.lastIndexOf(' ');
      return this.matches(selector.slice(index + 1)) && Boolean(this.parentElement?.closest(selector.slice(0, index)));
    }
    if (selector.startsWith('#')) return this.id === selector.slice(1);
    if (selector.startsWith('.')) return this.className.split(' ').includes(selector.slice(1));
    if (selector === 'a[href]') return this.tag === 'a' && this.hasAttribute('href');
    const data = selector.match(/^\[data-([\w-]+)(?:="([^"]+)")?\]$/);
    if (data) {
      const key = data[1].replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
      return Object.hasOwn(this.dataset, key) && (data[2] === undefined || this.dataset[key] === data[2]);
    }
    return this.tag === selector;
  }
  closest(selector) { return this.matches(selector) ? this : this.parentElement?.closest(selector) || null; }
  querySelectorAll(selector) {
    return this.children.flatMap(child => [...(child.matches(selector) ? [child] : []), ...child.querySelectorAll(selector)]);
  }
  querySelector(selector) { return this.querySelectorAll(selector)[0] || null; }
  get lastElementChild() { return this.children.at(-1); }
  setAttribute(key, value) {
    this.attributes.set(key, String(value));
    if (key === 'href') this.href = new URL(value, location.origin).href;
  }
  getAttribute(key) { return this.attributes.get(key) ?? null; }
  hasAttribute(key) { return this.attributes.has(key); }
  removeAttribute(key) { this.attributes.delete(key); }
  focus() {}
  select() {}
  scrollIntoView() {}
  pause() { this.dispatchEvent(new Event('pause')); }
  replaceChildren() { this.children = []; }
}

function fixture(t, { callback, omitCallback = false, pathname = ROUTES.home } = {}) {
  const storage = new Map(), actions = [], navigations = [], status = { failHandoff: false, downloads: 0 };
  const replaceGlobal = (key, value) => {
    const descriptor = Object.getOwnPropertyDescriptor(globalThis, key);
    Object.defineProperty(globalThis, key, { configurable: true, writable: true, value });
    t.after(() => descriptor ? Object.defineProperty(globalThis, key, descriptor) : delete globalThis[key]);
  };
  replaceGlobal('location', new URL(pathname, 'https://www.ddnzglobal.com'));
  replaceGlobal('window', { scrollTo() {}, innerWidth: 1200 });
  replaceGlobal('sessionStorage', {
    getItem: key => storage.get(key) ?? null,
    setItem(key, value) {
      if (status.failHandoff && key === HANDOFF_KEY) throw new Error('Storage unavailable');
      storage.set(key, value);
    },
  });
  replaceGlobal('requestAnimationFrame', callback => callback());
  replaceGlobal('navigator', { clipboard: { writeText: async () => {} } });
  replaceGlobal('document', { createElement: () => ({ click() { status.downloads++; } }) });
  t.mock.method(URL, 'createObjectURL', () => 'blob:local-test');
  t.mock.method(URL, 'revokeObjectURL', () => {});
  t.mock.method(globalThis, 'setTimeout', callback => { callback(); return 0; });

  const root = new Control(), views = {};
  for (const page of Object.keys(ROUTES)) {
    views[page] = new Control('section', { id: `view-${page}`, className: 'view' }, root);
    new Control('h1', {}, views[page]);
  }
  const ids = ['product-cards', 'sku-rows', 'add-row', 'packing', 'charging', 'sale-price', 'monthly',
    'fee-rate', 'copy-quote', 'download-quote', 'draft-state', 'input-errors', 'model-warning',
    'packing-summary', 'carton-detail', 'route-results', 'sales-results', 'quote-text', 'copy-status',
    'handoff-status', 'process-stage'];
  for (const id of ids) new Control('div', { id }, views.calculator);
  const find = selector => root.querySelector(selector);
  const link = (href, options = {}) => {
    const anchor = new Control('a', options, root);
    anchor.setAttribute('href', href);
    return anchor;
  };
  link(ROUTES.quote, { id: 'quote-entry' });
  link(INQUIRY_PATH, { id: 'continue-inquiry' });
  const row = new Control('div', { dataset: { row: '0' } }, find('#sku-rows'));
  for (const field of ['product', 'model', 'qty']) new Control('input', { dataset: { field } }, row);
  new Control('p', { className: 'row-summary' }, row);
  const check = new Control('input', { dataset: { check: 'material' } }, views.guides);
  for (const route of ['sea', 'air']) new Control('button', { dataset: { route } }, find('#route-results'));
  const figure = new Control('figure', {}, views.home);
  const player = new Control('div', { className: 'clip-player' }, figure);
  const video = new Control('video', {}, player);
  const play = new Control('button', { className: 'play-clip' }, player);
  new Control('p', { className: 'media-error' }, figure);
  video.play = async () => { video.dispatchEvent(new Event('play')); };
  const summary = parent => new Control('summary', {}, new Control('details', {}, parent));
  const productSummary = summary(find('#product-cards'));
  const guideSummary = summary(new Control('div', { className: 'factor-list' }, views.prices));

  let controller;
  const go = path => {
    navigations.push(path);
    const url = new URL(path, location.origin);
    if (pageForPath(url.pathname)) controller.activate(url.pathname, url.hash);
  };
  controller = omitCallback ? mountScreenProtectors(root, go)
    : mountScreenProtectors(root, go, callback || (action => actions.push(screenProtectorJourneyAnalytics(action))));
  t.after(() => controller.destroy());
  // Native EventTarget has no DOM bubbling; deliver the same event along the control tree.
  const fire = (target, type = 'click', options = {}) => {
    const event = new Event(type, { cancelable: true, bubbles: true });
    Object.defineProperty(event, 'target', { value: target });
    Object.assign(event, { button: 0 }, options);
    for (let node = target; node; node = node.parentElement) node.dispatchEvent(event);
    return event;
  };
  const edit = (target, value, commit = true) => {
    target.value = value;
    fire(target, 'input');
    if (commit) fire(target, 'change');
  };
  return { root, find, link, controller, fire, edit, video, play, check, productSummary, guideSummary,
    storage, status, actions, navigations, actionNames: () => actions.map(item => item.params.journey_action) };
}

test('mount, draft recalculation and programmatic activation are silent; committed inputs are aggregate only', t => {
  const f = fixture(t);
  f.controller.activate(ROUTES.calculator);
  f.controller.activate(ROUTES.quote);
  assert.deepEqual(f.actions, []);
  const model = f.find('[data-field="model"]');
  for (const value of ['Private', 'Private phone model', 'buyer@example.com']) f.edit(model, value, false);
  f.edit(f.find('#sale-price'), '12345', false);
  assert.deepEqual(f.actions, []);
  f.fire(model, 'change');
  f.fire(f.find('#sale-price'), 'change');
  f.edit(f.find('[data-field="product"]'), 'titan-hd');
  f.edit(f.find('[data-field="qty"]'), '1000');
  f.find('#packing').value = 'model'; f.fire(f.find('#packing'), 'change');
  f.find('#charging').value = 'carton'; f.fire(f.find('#charging'), 'change');
  f.check.checked = true; f.fire(f.check, 'change');
  assert.deepEqual(f.actionNames(), ['model_change', 'calculator_change', 'select_configuration',
    'calculator_change', 'calculator_change', 'calculator_change', 'specification_change']);
  const draft = JSON.parse(f.storage.get(DRAFT_KEY));
  assert.equal(draft.rows[0].model, 'buyer@example.com');
  assert.equal(draft.price, '12345');
  assert.doesNotMatch(JSON.stringify(f.actions), /buyer@|Private|12345|titan-hd|1000/);
});

test('comparison, guide and video events follow explicit engagement, not initial disclosure or repeated play', t => {
  const f = fixture(t);
  f.fire(f.link(ROUTES.products + '?model=private&email=buyer%40example.com'));
  f.fire(f.link(ROUTES.products)); // Already on compare.
  f.fire(f.productSummary);
  f.productSummary.parentElement.open = true; f.fire(f.productSummary); // Closing is silent.
  f.fire(f.link(ROUTES.prices));
  f.fire(f.guideSummary);
  f.fire(f.link(ROUTES.videos));
  f.fire(f.link(ROUTES.videos + '#factory-cutting'));
  f.video.dispatchEvent(new Event('play'));
  f.video.dispatchEvent(new Event('pause'));
  f.video.dispatchEvent(new Event('play'));
  f.video.dispatchEvent(new Event('timeupdate'));
  assert.deepEqual(f.actionNames(), ['compare_products', 'compare_products', 'read_guide', 'read_guide',
    'open_videos', 'select_video_stage', 'play_video']);
  assert.doesNotMatch(JSON.stringify(f.actions), /private|email|factory-cutting/);
});

test('configuration and calculator buttons report actions without counting an already-selected route', t => {
  const f = fixture(t);
  f.fire(f.link(ROUTES.calculator));
  f.fire(f.find('#add-row'));
  f.fire(new Control('button', { dataset: { productAdd: 'og28' } }, f.root));
  f.fire(new Control('button', { dataset: { preset: '5000' } }, f.root));
  f.fire(f.find('[data-route="sea"]'));
  f.fire(f.find('[data-route="air"]'));
  f.fire(f.find('[data-route="air"]'));
  f.fire(new Control('button', { dataset: { remove: '0' } }, f.root));
  assert.deepEqual(f.actionNames(), ['open_calculator', 'select_configuration', 'select_configuration',
    'calculator_change', 'calculator_change', 'calculator_change']);
});

test('brief actions are non-lead events and inquiry continuation requires a valid saved handoff', async t => {
  const f = fixture(t);
  f.fire(f.find('#quote-entry'));
  f.fire(f.find('#copy-quote'));
  await Promise.resolve();
  f.fire(f.find('#download-quote'));
  f.status.failHandoff = true;
  const before = f.navigations.length;
  f.fire(f.find('#continue-inquiry'));
  assert.equal(f.navigations.length, before);
  assert.equal(f.storage.has(HANDOFF_KEY), false);
  f.status.failHandoff = false;
  f.fire(f.find('#continue-inquiry'));
  assert.equal(f.storage.has(HANDOFF_KEY), true);
  assert.match(f.navigations.at(-1), /^\/get-a-quote\//);
  assert.deepEqual(f.actionNames(), ['create_brief', 'copy_brief', 'download_brief', 'continue_inquiry']);
  assert.equal(f.status.downloads, 1);
  assert.ok(f.actions.every(item => item.event === 'screen_protector_journey'));
});

test('invalid plans and unsuccessful clipboard operations do not emit brief success actions', async t => {
  const f = fixture(t);
  navigator.clipboard.writeText = async () => { throw new Error('Clipboard unavailable'); };
  f.fire(f.find('#copy-quote'));
  await Promise.resolve();
  assert.deepEqual(f.actions, []);
  f.edit(f.find('[data-field="qty"]'), '1');
  const before = f.actions.length;
  f.fire(f.find('#quote-entry'));
  f.fire(f.find('#copy-quote'));
  f.fire(f.find('#download-quote'));
  f.fire(f.find('#continue-inquiry'));
  assert.equal(f.actions.length, before);
  assert.equal(f.navigations.length, 0);
  assert.equal(f.storage.has(HANDOFF_KEY), false);
  assert.equal(f.status.downloads, 0);
});

test('modified, download and external links preserve browser behavior without journey dispatch', t => {
  const f = fixture(t);
  const anchor = f.link(ROUTES.products);
  for (const options of [{ metaKey: true }, { ctrlKey: true }, { shiftKey: true }, { altKey: true }, { button: 1 }]) {
    assert.equal(f.fire(anchor, 'click', options).defaultPrevented, false);
  }
  anchor.target = '_blank'; f.fire(anchor);
  anchor.target = ''; anchor.setAttribute('download', 'file'); f.fire(anchor);
  f.fire(f.link('https://other.invalid/screen-protectors/compare'));
  assert.deepEqual(f.actions, []);
  assert.deepEqual(f.navigations, []);
});

test('two-argument callers retain calculation and navigation without an analytics callback', t => {
  const f = fixture(t, { omitCallback: true });
  f.edit(f.find('[data-field="model"]'), 'Private phone model');
  f.fire(f.find('#quote-entry'));
  f.fire(f.find('#continue-inquiry'));
  assert.equal(f.navigations.length, 2);
  assert.equal(JSON.parse(f.storage.get(DRAFT_KEY)).rows[0].model, 'Private phone model');
  assert.equal(f.storage.has(HANDOFF_KEY), true);
  assert.deepEqual(f.actions, []);
});

test('destroy removes direct and delegated listeners and suppresses pending clipboard completion', async t => {
  const f = fixture(t);
  let finishCopy;
  navigator.clipboard.writeText = () => new Promise(resolve => { finishCopy = resolve; });
  f.fire(f.find('#copy-quote'));
  const packing = f.find('#packing'), add = f.find('#add-row'), check = f.check;
  const draft = f.storage.get(DRAFT_KEY);
  f.controller.destroy();
  packing.value = 'model'; f.fire(packing, 'change');
  f.fire(add); f.fire(check, 'change');
  f.play.hidden = false; f.video.dispatchEvent(new Event('play'));
  finishCopy(); await Promise.resolve();
  assert.equal(f.storage.get(DRAFT_KEY), draft);
  assert.equal(f.play.hidden, false);
  assert.deepEqual(f.actions, []);
  assert.deepEqual(f.navigations, []);
});
