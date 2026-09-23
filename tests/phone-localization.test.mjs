import test from 'node:test';
import assert from 'node:assert/strict';
import { PRODUCTS, BASIS, calculate } from '../src/features/screen-protectors/calculator.mjs';
import { HANDOFF_KEY, readHandoff, saveHandoff, saveLocalizedHandoff } from '../src/features/screen-protectors/handoff.mjs';
import { PHONE_LOCALES } from '../src/features/screen-protectors/locales/localized.mjs';
import { PHONE_PRODUCT_IDS, LOCALIZED_SCREEN_PROTECTOR_ROUTES, emptyPhoneDraft, localizedDraftKey, localizedProduct, localizedPhonePath, localizedQuoteHref, localizedInquiryBrief, phoneMoney, phoneNumber, parsePhoneQuantity, restoreLocalizedDraft, validateLocalizedSelection, validateLocalizedHandoff } from '../src/features/screen-protectors/localization.mjs';
import { localizedScreenProtectorJourneyAnalytics, createScreenProtectorActionReporter } from '../src/features/screen-protectors/site-analytics.mjs';

const selected = (destination = 'Ciudad de México, México') => ({ rows: [
  { product: 'og28', model: 'iPhone 16', qty: 100 }, { product: 'og28', model: 'iPhone 16 Pro', qty: 900 },
  { product: '001', model: 'Samsung Galaxy S25', qty: 501 }, { product: 'titan-hd', model: 'iPhone 16 Pro', qty: 500 },
  { product: 'titan-privacy', model: 'Samsung Galaxy S25 Ultra', qty: 500 },
], destination, notes: '' });
const memory = () => { const data = new Map(); return { getItem: key => data.get(key) ?? null, setItem: (key, value) => data.set(key, value), removeItem: key => data.delete(key) }; };
const now = 1800000000000;

test('both locales use the same four authentic product records without mutating inputs', () => {
  const before = JSON.stringify(PRODUCTS);
  const expected = { og28: [2.5,960,100,1000,[60,46,33],28.5], '001':[6,400,500,undefined,[50,32,47.5],16.5], 'titan-hd':[4.3,200,500,undefined,[42,35,42],14], 'titan-privacy':[5.1,200,500,undefined,[42,35,42],14] };
  for (const locale of ['es','ar']) for (const id of PHONE_PRODUCT_IDS) {
    const item = localizedProduct(locale,id), p = item.product;
    assert.strictEqual(p, PRODUCTS[id]);
    assert.deepEqual([p.price,p.unitsPerCarton,p.minQty,p.minOrderQty,p.cartonCm], expected[id].slice(0,5));
    assert.ok(Math.abs(item.fullKg - expected[id][5]) < 1e-10);
    assert.ok(item.name && item.packing && item.image.endsWith(PRODUCTS[id].image));
  }
  assert.equal(JSON.stringify(PRODUCTS), before);
});

test('quantities accept localized whole numbers and reject ambiguous decimals or coercion', () => {
  for (const [locale, value, expected] of [['es','1.000',1000],['es','501',501],['ar','١٬٠٠٠',1000],['ar','۱٬۰۰۰',1000],['ar','٥٠١',501],['ar','1,000',1000],['ar',500,500]]) assert.equal(parsePhoneQuantity(locale,value),expected);
  for (const locale of ['es','ar']) for (const value of ['',null,undefined,'1e3','500.5','500,5','-500','0x200','500x','1.00',true]) assert.ok(Number.isNaN(parsePhoneQuantity(locale,value)),`${locale}: ${value}`);
  assert.match(phoneMoney('es', 4.3), /4,30/);
  assert.match(phoneMoney('ar', 4.3), /٤٫٣٠/);
  assert.match(phoneNumber('ar', 1000), /١٬٠٠٠/);
});

test('model minimums, OG28 combined minimum, exact models and duplicate rows remain enforced', () => {
  for (const locale of ['es','ar']) {
    const good = selected();
    const before = JSON.stringify(good);
    assert.equal(validateLocalizedSelection(locale,good).valid,true); // 501 need not be a multiple of 500.
    assert.equal(JSON.stringify(good),before);
    const invalid = [
      [{...good, rows:[]},'empty'],
      [{...good, rows:[{product:'og28',model:'A',qty:960}]},'og28'],
      [{...good, rows:[{product:'og28',model:'A',qty:99},{product:'og28',model:'B',qty:1000}]},'quantity'],
      [{...good, rows:[{product:'001',model:'',qty:500}]},'model'],
      [{...good, rows:[{product:'001',model:'x'.repeat(81),qty:500}]},'model'],
      [{...good, rows:[{product:'001',model:' iPhone 16 ',qty:500},{product:'001',model:'IPHONE   16',qty:500}]},'duplicate'],
      [{...good, rows:[{product:'__proto__',model:'A',qty:500}]},'product'],
      [{...good, rows:[{product:'001',model:'A',qty:1000001}]},'quantity'],
      [{...good, destination:''},'destination'], [{...good, notes:'x'.repeat(1001)},'notes'],
    ];
    for (const [input,code] of invalid) {
      const result = validateLocalizedSelection(locale,input);
      assert.equal(result.valid,false,code); assert.ok(result.errors.some(error=>error.code===code));
      assert.equal(result.summary,null); assert.doesNotMatch(JSON.stringify(result.errors), /\{(?:min|max|qty|row)\}|请|Enter|Choose|Line /);
      if(locale==='ar') assert.match(result.errors[0].message,/[\u0600-\u06ff]/);
    }
  }
});

test('UAE, Singapore and Mexico handoffs retain buyer destination with product-only pricing', () => {
  for (const locale of ['es','ar']) for (const destination of ['دبي، الإمارات العربية المتحدة','Singapore','Ciudad de México, México']) {
    const state = selected(destination), result = validateLocalizedSelection(locale,state);
    assert.deepEqual(result.summary,{pieces:2501,goodsCny:10206});
    const storage = memory();
    assert.deepEqual(saveLocalizedHandoff(storage,locale,state,now),{ok:true});
    const href = new URL(localizedQuoteHref(locale,destination),'https://www.ddnzglobal.com');
    assert.equal(href.pathname,`/${locale}/get-a-quote/`);
    assert.equal(href.searchParams.get('dest'),destination);
    assert.equal(href.searchParams.get('leadGoal'),'Product Sourcing');
    assert.equal(href.searchParams.get('industry'),'Mobile Accessories');
    const incoming = readHandoff(storage,href.search,now);
    assert.equal(incoming.locale,locale); assert.deepEqual(incoming.state,state);
    assert.equal(incoming.brief,localizedInquiryBrief(locale,result));
    assert.deepEqual(Object.keys(incoming.summary).sort(),['goodsCny','pieces']);
    assert.doesNotMatch(incoming.brief,/Istanbul|Turkey|Türkiye|Estambul|إسطنبول|KDV|550|130|6\.6/);
    for (const row of state.rows) assert.ok(incoming.brief.includes(row.model));
  }
});

test('localized handoff is recalculated, expires, and cannot attach to another locale or destination', () => {
  const storage = memory(), state = selected();
  saveLocalizedHandoff(storage,'es',state,now);
  const raw = JSON.parse(storage.getItem(HANDOFF_KEY));
  raw.summary={goodsCny:1,freightCny:0}; raw.brief='forged'; raw.state.rows[0].price=0;
  storage.setItem(HANDOFF_KEY,JSON.stringify(raw));
  const search = new URL(localizedQuoteHref('es',state.destination),'https://www.ddnzglobal.com').search;
  assert.equal(readHandoff(storage,search,now).summary.goodsCny,10206);
  assert.notEqual(readHandoff(storage,search,now).brief,'forged');
  assert.equal(readHandoff(storage,search.replace('phoneLocale=es','phoneLocale=ar'),now),null);
  assert.equal(readHandoff(storage,new URL(localizedQuoteHref('es','Singapore'),'https://www.ddnzglobal.com').search,now),null);
  assert.equal(readHandoff(storage,search,now+86400001),null);
  assert.equal(validateLocalizedHandoff({...raw,createdAt:now+60001},now),null);
  assert.equal(readHandoff(storage,'?source=screen_protector_planner&leadGoal=Product+Sourcing',now),null);
  const unavailable={setItem(){throw Error('storage unavailable');},getItem(){throw Error('storage unavailable');}};
  assert.deepEqual(saveLocalizedHandoff(unavailable,'es',state,now),{ok:false,reason:'storage'});
  assert.equal(readHandoff(unavailable,search,now),null);
  assert.equal(new URL(localizedQuoteHref('es'),'https://www.ddnzglobal.com').searchParams.has('dest'),false);
  assert.equal(localizedDraftKey('es'),localizedDraftKey('ar'));
});

test('ES/AR switches preserve models, quantities, destination and buyer notes in drafts and handoffs', () => {
  for (const [from,to] of [['es','ar'],['ar','es']]) {
    const state = {...selected('دبي، الإمارات العربية المتحدة'), notes:'Empaque azul; اختبار عينة\nExact model: iPhone 16 Pro'};
    const draft = {...state, rows:state.rows.map(row=>({...row,qty:phoneNumber(from,row.qty)}))};
    const before = JSON.stringify(draft);
    const restored = restoreLocalizedDraft({locale:from,draft},to);
    assert.equal(restored.notes,state.notes); assert.equal(restored.destination,state.destination);
    assert.deepEqual(restored.rows.map(row=>row.model),state.rows.map(row=>row.model));
    assert.deepEqual(validateLocalizedSelection(to,restored).state,state);
    assert.equal(JSON.stringify(draft),before);
    assert.deepEqual(restoreLocalizedDraft({locale:to,draft:restored},from),draft);
    const invalidDraft = {...draft, rows:[{...draft.rows[0],qty:from==='es'?'1,000':'1.000'}]};
    assert.equal(restoreLocalizedDraft({locale:from,draft:invalidDraft},to).rows[0].qty,'');
    assert.equal(restoreLocalizedDraft({locale:from,draft:{...draft,rows:[{...draft.rows[0],qty:{}}]}},to),null);
    const storage=memory(); saveLocalizedHandoff(storage,from,state,now);
    const search=new URL(localizedQuoteHref(from,state.destination),'https://www.ddnzglobal.com').search;
    const original=storage.getItem(HANDOFF_KEY);
    const translated=readHandoff(storage,search,now,to);
    assert.equal(translated.locale,to); assert.deepEqual(translated.state,state);
    assert.ok(translated.brief.includes(PHONE_LOCALES[to].briefHeading));
    assert.ok(translated.brief.includes(state.notes));
    assert.equal(storage.getItem(HANDOFF_KEY),original);
    assert.equal(readHandoff(storage,search.replace(`phoneLocale=${from}`,`phoneLocale=${to}`),now,to),null);
  }
});

test('all fourteen route transitions restore grouped quantities from the saved locale and keep invalid inputs invalid', () => {
  const expected = { rows:[{product:'001',model:'iPhone 16 Pro',qty:1000}],
    destination:'Ciudad de México, México',notes:'Caja azul\nاختبار العينة' };
  for (const from of LOCALIZED_SCREEN_PROTECTOR_ROUTES) for (const to of LOCALIZED_SCREEN_PROTECTOR_ROUTES) {
    const storage=memory();
    const draft={...expected,rows:[{...expected.rows[0],qty:phoneNumber(from.locale,1000)}]};
    storage.setItem(localizedDraftKey(from.locale),JSON.stringify({locale:from.locale,draft}));
    const restored=restoreLocalizedDraft(JSON.parse(storage.getItem(localizedDraftKey(to.locale))),to.locale);
    assert.deepEqual(validateLocalizedSelection(to.locale,restored).state,expected,`${from.path} → ${to.path}`);
    if(from.locale!==to.locale) assert.equal(restored.rows[0].qty,phoneNumber(to.locale,1000));

    for(const invalid of [['es','pt','tr'].includes(from.locale)?'1,000':'1.000','١٢x','一千','500.5']) {
      const input={...draft,rows:[{...draft.rows[0],qty:invalid}]};
      const recovered=restoreLocalizedDraft({locale:from.locale,draft:input},to.locale);
      assert.equal(recovered.destination,expected.destination);
      assert.equal(recovered.notes,expected.notes);
      assert.equal(recovered.rows[0].model,expected.rows[0].model);
      const result=validateLocalizedSelection(to.locale,recovered);
      assert.equal(result.valid,false,`${from.path} → ${to.path}: ${invalid}`);
      assert.equal(result.summary,null);
      assert.ok(result.errors.some(error=>error.code==='quantity' && error.row===0));
    }
  }
});

test('localized analytics accept only three fixed actions and never forward buyer input', () => {
  const actions=['select_configuration','create_brief','continue_inquiry'];
  for(const locale of ['zh','es','ar','ru','fr','pt','tr']) for(const action of actions) {
    assert.deepEqual(localizedScreenProtectorJourneyAnalytics(locale,action),{
      event:'screen_protector_journey', params:{content_group:'screen_protectors',journey_action:action,content_language:locale},
    });
  }
  for(const action of ['read_guide','calculator_change','select','email@example.com','?source=buyer',{},null,undefined]) assert.equal(localizedScreenProtectorJourneyAnalytics('es',action),null);
  for(const locale of ['en','de','buyer@example.com',{},null]) assert.equal(localizedScreenProtectorJourneyAnalytics(locale,actions[0]),null);
  const events=[];
  const report=createScreenProtectorActionReporter(action=>{
    const payload=localizedScreenProtectorJourneyAnalytics('ar',action);
    if(payload)events.push(payload);
  });
  actions.forEach(report); report('phone_model=iPhone 16'); report({notes:'buyer details'});
  assert.equal(events.length,3);
  assert.doesNotThrow(()=>createScreenProtectorActionReporter(()=>{throw Error('analytics unavailable');})('continue_inquiry'));
});

test('English Istanbul plans and their original validation still work unchanged', () => {
  const state={rows:[{product:'001',model:'iPhone 16',qty:500}],packing:'product',charging:'shipment',route:'sea',requests:[]};
  const storage=memory(); assert.deepEqual(saveHandoff(storage,state,now),{ok:true});
  const plan=readHandoff(storage,'?source=screen_protector_planner&leadGoal=Product+Sourcing',now);
  assert.match(plan.brief,/Istanbul/); assert.equal(plan.summary.goodsCny,3000);
  assert.equal(plan.summary.landedCny,calculate(state.rows).sea.total);
  assert.equal('locale' in plan,false);
});

test('locale dictionaries have matching keys and fourteen exact localized route contracts', () => {
  const keys=(value,prefix='')=>Object.entries(value).flatMap(([key,item])=>typeof item==='object' ? keys(item,`${prefix}${key}.`) : `${prefix}${key}`).sort();
  assert.deepEqual(keys(PHONE_LOCALES.es),keys(PHONE_LOCALES.ar));
  assert.deepEqual(LOCALIZED_SCREEN_PROTECTOR_ROUTES.map(route=>route.path),['zh-cn','es','ar','ru','fr','pt','tr'].flatMap(l=>[`/${l}/screen-protectors/`,`/${l}/screen-protectors/compare/`]));
  assert.deepEqual(emptyPhoneDraft(),{rows:[],destination:'',notes:''});
  assert.throws(()=>localizedPhonePath('de')); assert.throws(()=>localizedPhonePath('ar','calculator'));
  assert.equal(BASIS.seaUsdPerCbm,550); assert.equal(BASIS.airCnyPerKg,130);
});
