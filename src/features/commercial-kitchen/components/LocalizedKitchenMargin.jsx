import React, { useState } from 'react';
import { calculateLocalizedKitchenMargin, getLocalizedKitchenProducts, kitchenCopy, localMoney, localNumber } from '../data/localization.mjs';
import { IsolatedText } from './LocalizedKitchenText.jsx';

export default function LocalizedKitchenMargin({ locale, onAction = (_action) => {}, onUseQuantity = (_id, _units) => {} }) {
  const t = kitchenCopy(locale), m = t.margin, products = getLocalizedKitchenProducts(locale).filter(product => product.quote);
  const [draft, setDraft] = useState({ productId: products[0].id, units: localNumber(products[0].quote.minUnits, locale, { useGrouping: false }), selling: '', landed: '' });
  const [calculation, setCalculation] = useState({ result: null, errors: {} });
  const product = products.find(item => item.id === draft.productId), result = calculation.result;
  const negative = result?.unitProfit < 0;
  const format = value => localMoney(value, 'CNY', locale);
  function update(field, value) {
    setDraft(previous => ({ ...previous, [field]: value }));
    setCalculation({ result: null, errors: {} });
  }
  function selectProduct(id) {
    const next = products.find(item => item.id === id);
    setDraft({ productId: id, units: localNumber(next.quote.minUnits, locale, { useGrouping: false }), selling: '', landed: '' });
    setCalculation({ result: null, errors: {} });
  }
  function calculate(event) {
    event.preventDefault();
    const next = calculateLocalizedKitchenMargin(locale, draft);
    setCalculation(next);
    if (next.result) onAction('plan_margin');
    else document.getElementById(`kitchen-margin-${Object.keys(next.errors)[0]}`)?.focus();
  }
  const error = field => calculation.errors[field] && <small role="alert" className="localized-error" id={`kitchen-margin-${field}-error`}>{calculation.errors[field]}</small>;
  return <section className="section wrap localized-margin" id="commercial-kitchen-margin" aria-labelledby="kitchen-margin-heading">
    <h2 id="kitchen-margin-heading">{m.title}</h2><p>{m.intro}</p>
    <div className="localized-two-columns"><form className="localized-panel localized-margin-form" onSubmit={calculate} noValidate>
      <label>{m.model}<select value={draft.productId} onChange={event => selectProduct(event.target.value)}>{products.map(item => <option value={item.id} key={item.id}>{item.displayModel} — {item.name}</option>)}</select></label>
      <div className="localized-margin-reference"><p>{m.purchase}: <strong><bdi dir="ltr">{format(product.quote.price)}</bdi></strong></p><p>{t.ui.referenceTier}: <bdi dir="ltr">{localNumber(product.quote.minUnits, locale)}</bdi> {t.ui.units}</p><p className="fine"><IsolatedText>{t.ui.quoteOnly}</IsolatedText></p>{product.configurationNote && <p className="fine"><IsolatedText>{product.configurationNote}</IsolatedText></p>}</div>
      {['units', 'selling', 'landed'].map(field => <label key={field} htmlFor={`kitchen-margin-${field}`}>{field === 'units' ? m.quantity : m[field]}<input id={`kitchen-margin-${field}`} inputMode={field === 'units' ? 'numeric' : 'decimal'} dir="ltr" value={draft[field]} required onChange={event => update(field, event.target.value)} aria-invalid={Boolean(calculation.errors[field])} aria-describedby={`kitchen-margin-input-help${calculation.errors[field] ? ` kitchen-margin-${field}-error` : ''}`}/>{error(field)}</label>)}
      <p className="fine" id="kitchen-margin-input-help">{m.inputHelp}</p><button className="button primary" type="submit">{m.calculate}</button>
    </form>
    <div className={`localized-panel localized-margin-result${negative ? ' is-loss' : ''}`} id="commercial-kitchen-margin-visual" aria-label={m.grossMargin}>
      <p className="eyebrow">{m.result}</p>
      {!result ? <p role="status" className="localized-empty">{m.empty}</p> : <>
        <div className="localized-margin-number" role="status"><strong><bdi dir="ltr">{localNumber(result.marginPct, locale, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%</bdi></strong><span>{m.grossMargin}</span></div>
        <div className="localized-margin-chart" role="img" aria-label={`${m.sellingLabel}: ${format(result.selling)}; ${m.purchase}: ${format(result.purchase)}; ${m.extras}: ${format(result.landed)}; ${m.costLabel}: ${format(result.unitCost)}`}>
          <p>{m.sellingLabel}<bdi dir="ltr">{format(result.selling)}</bdi></p><div className="localized-margin-track"><span className="localized-margin-sale" style={{ width: `${result.selling / Math.max(result.unitCost, result.selling) * 100}%` }}/></div>
          <p>{m.costLabel}<bdi dir="ltr">{format(result.unitCost)}</bdi></p><div className="localized-margin-track"><span className="localized-margin-purchase" style={{ width: `${result.purchase / Math.max(result.unitCost, result.selling) * 100}%` }}/><span className="localized-margin-extras" style={{ width: `${result.landed / Math.max(result.unitCost, result.selling) * 100}%` }}/></div>
        </div>
        <dl className="localized-margin-breakdown"><dt>{m.purchase}</dt><dd><bdi dir="ltr">{format(result.purchase)}</bdi></dd><dt>{m.extras}</dt><dd><bdi dir="ltr">{format(result.landed)}</bdi></dd><dt>{negative ? m.grossLoss : m.grossProfit} · {t.ui.perUnit}</dt><dd><bdi dir="ltr">{format(result.unitProfit)}</bdi></dd><dt>{negative ? m.grossLoss : m.grossProfit} · {m.perOrder} (<bdi dir="ltr">{localNumber(result.units, locale)}</bdi>)</dt><dd><bdi dir="ltr">{format(result.orderProfit)}</bdi></dd><dt>{m.totalCost} · {m.perOrder}</dt><dd><bdi dir="ltr">{format(result.orderCost)}</bdi></dd></dl>
        {negative && <p className="localized-error">{m.loss}</p>}
        <button className="button outline" type="button" onClick={() => onUseQuantity(product.id, result.units)}>{m.useQuantity}</button>
      </>}
      <p className="fine">{m.formula}</p><p className="fine">{m.caution}</p>
    </div></div>
  </section>;
}
