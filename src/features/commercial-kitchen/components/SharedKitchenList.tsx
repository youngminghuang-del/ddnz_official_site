import { useEffect, useState } from 'react';
import products from '../data/products.mjs';
import { addItems, cleanList } from '../data/model.mjs';
import { KITCHEN_LIST_STORAGE_KEY, kitchenCopy, localNumber, parseKitchenQuantity } from '../data/localization.mjs';
import { kitchenListHref } from '../data/inductionPage.mjs';
import { localizedProductPath } from '../../../lib/productLocalization.mjs';

export function sharedKitchenListHref(locale = 'en') {
  return localizedProductPath(kitchenListHref, locale === 'zh-cn' ? 'zh' : locale);
}

export function useSharedKitchenList(locale = 'en') {
  const copy = locale === 'en' ? null : kitchenCopy(locale).ui;
  const [count, setCount] = useState(0);
  const [status, setStatus] = useState('');

  function readList() {
    const raw = window.localStorage.getItem(KITCHEN_LIST_STORAGE_KEY);
    return cleanList(JSON.parse(raw || '{}'), products) as Record<string, number>;
  }

  useEffect(() => {
    function refresh() {
      try { setCount(Object.values(readList()).reduce((sum, quantity) => sum + quantity, 0)); }
      catch { setCount(0); }
    }
    refresh();
    window.addEventListener('storage', refresh);
    window.addEventListener('pageshow', refresh);
    return () => {
      window.removeEventListener('storage', refresh);
      window.removeEventListener('pageshow', refresh);
    };
  }, []);

  function updateQuantity(id: string, units?: number) {
    const product = products.find(item => item.id === id);
    if (!product || (units !== undefined && parseKitchenQuantity(units) === null)) return false;
    try {
      const current = readList();
      const next = units === undefined
        ? addItems(current, { [id]: 1 }, products) as Record<string, number>
        : { ...current, [id]: units };
      window.localStorage.setItem(KITCHEN_LIST_STORAGE_KEY, JSON.stringify(next));
      setCount(Object.values(next).reduce((sum, quantity) => sum + quantity, 0));
      setStatus(copy ? copy.added : product.model + ' in your list: ' + next[id] + '.');
      return true;
    } catch {
      setStatus(copy ? copy.storageUnavailable : 'The list could not be saved. Use the model’s order or quote link.');
      return false;
    }
  }

  return {
    add: (id: string) => updateQuantity(id),
    setQuantity: (id: string, units: number) => updateQuantity(id, units),
    count, status,
  };
}

export function SharedKitchenListBar({ count, status, locale = 'en' }: { count: number; status: string; locale?: string }) {
  const label = locale === 'en' ? 'Your equipment list' : kitchenCopy(locale).ui.list;
  return <aside className="shared-kitchen-list-bar" aria-label={label}>
    <a href={sharedKitchenListHref(locale)}>{label} <bdi>({locale === 'en' ? count : localNumber(count, locale)})</bdi> <span aria-hidden="true">{locale === 'ar' ? '↖' : '↗'}</span></a>
    <span role="status">{status}</span>
  </aside>;
}
