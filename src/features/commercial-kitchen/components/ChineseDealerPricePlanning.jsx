import KitchenRetailReferences from './KitchenRetailReferences';
import LocalizedKitchenMargin from './LocalizedKitchenMargin';
import { sharedKitchenListHref, useSharedKitchenList } from './SharedKitchenList';

export default function ChineseDealerPricePlanning({ modelQuery = '', onAction }) {
  const params = new URLSearchParams(modelQuery);
  const list = useSharedKitchenList('zh');

  function applyQuantity(model, quantity) {
    if (list.setQuantity(model, quantity)) window.location.assign(sharedKitchenListHref('zh'));
  }

  return <div className="ddnz-kitchen kitchen-brand localized-kitchen" lang="zh-CN">
    <LocalizedKitchenMargin key={modelQuery} locale="zh" initialModel={params.get('model')}
      initialQuantity={params.get('quantity')} onAction={onAction} onUseQuantity={applyQuantity}/>
    <p className="wrap" role="status">{list.status}</p>
    <KitchenRetailReferences locale="zh"/>
  </div>;
}
