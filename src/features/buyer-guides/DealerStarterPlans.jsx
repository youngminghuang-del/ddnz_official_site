import React, { useState } from 'react';
import launch from '../commercial-kitchen/data/launch.mjs';
import products from '../commercial-kitchen/data/products.mjs';
import { getLocalizedKitchenProducts, getLocalizedKitchenAssortments } from '../commercial-kitchen/data/localization.mjs';
import { localizedProductPath } from '../../lib/productLocalization.mjs';
import { kitchenModelHref } from '../commercial-kitchen/data/categories.mjs';

export const dealerStarterCopy = {
  en: ['Build your first order', 'Adjust quantities to fit your customer mix. Use zero to leave an item out.', 'Qty', 'Quantity for', 'Use this starter order', 'Starter quantities are editable examples. Ask for each model’s confirmed minimum, packing dimensions and gross weight, spare-parts pack, replenishment lead time and warranty terms.', 'Check dated retail references and estimate landed margin', 'Build a starter order', 'Remove starter order', 'Starter order'],
  es: ['Prepare su primer pedido', 'Ajuste las cantidades a sus clientes. Use cero para excluir un modelo.', 'Cant.', 'Cantidad de', 'Usar este pedido inicial', 'Las cantidades son orientativas. Confirme el mínimo por modelo, las medidas y el peso bruto del embalaje, los repuestos, el plazo de reposición y la garantía.', 'Consultar referencias de venta y estimar el margen', 'Preparar un pedido inicial', 'Quitar el pedido inicial', 'Pedido inicial'],
  pt: ['Monte seu primeiro pedido', 'Ajuste as quantidades ao perfil dos seus clientes. Use zero para excluir um modelo.', 'Qtd.', 'Quantidade de', 'Usar este pedido inicial', 'As quantidades são sugestões editáveis. Confirme o mínimo por modelo, as dimensões e o peso bruto da embalagem, as peças de reposição, o prazo de reposição e a garantia.', 'Consultar referências de varejo e estimar a margem', 'Montar um pedido inicial', 'Remover pedido inicial', 'Pedido inicial'],
  zh: ['准备首批订单','按客户需求调整数量，填 0 可跳过该型号。','数量','数量','将这套设备加入询价','数量仅供参考。请确认各型号起订量、包装尺寸、毛重、备件、补货周期和保修条件。','查看零售参考与人民币毛利估算'],
  ar: ['إعداد الطلب الأول','عدّل الكميات وفق احتياجات عملائك. أدخل صفراً لاستبعاد طراز.','الكمية','كمية','استخدام هذا الطلب الأولي','الكميات مقترحة. أكّد الحد الأدنى وأبعاد العبوة والوزن الإجمالي وقطع الغيار ومدة إعادة التوريد والضمان لكل طراز.','مراجعة أسعار التجزئة وحساب الهامش باليوان'],
  fr: ['Préparer une première commande','Ajustez les quantités selon votre clientèle. Saisissez zéro pour retirer un modèle.','Qté','Quantité pour','Utiliser cette sélection','Quantités indicatives. Confirmez le minimum, les dimensions emballées, le poids brut, les pièces détachées, le délai de réassort et la garantie par modèle.','Voir les prix de détail et estimer la marge en CNY'],
  ru: ['Соберите первый заказ','Укажите количество по потребностям клиентов. Ноль исключает модель.','Кол-во','Количество для','Использовать этот набор','Количество приведено для примера. Уточните минимальный заказ, размеры упаковки, вес брутто, запасные части, срок пополнения и гарантию для каждой модели.','Сравнить розничные цены и рассчитать маржу в CNY'],
  tr: ['İlk siparişinizi hazırlayın','Adetleri müşterilerinizin ihtiyacına göre ayarlayın. Bir modeli çıkarmak için sıfır girin.','Adet','Adet','Bu başlangıç siparişini kullanın','Adetler örnektir. Her modelin asgari siparişini, ambalaj ölçülerini, brüt ağırlığını, yedek parçalarını, tekrar tedarik süresini ve garantisini doğrulayın.','Perakende fiyatlarına bakın ve CNY cinsinden marjı hesaplayın'],
};

export default function DealerStarterPlans({ locale, onSelect }) {
  const [title, intro, quantity, quantityFor, usePlan, scope, margin] = dealerStarterCopy[locale];
  const catalogue = localizedProductPath('/sourcing/commercial-kitchen-equipment-from-china', locale);
  const localizedProducts = locale === 'en' ? products : getLocalizedKitchenProducts(locale);
  const assortments = locale === 'en' ? launch.assortments : getLocalizedKitchenAssortments(locale);
  const plans = assortments.map(plan => ({
    ...plan,
    items: plan.items.map(item => ({ ...item, product: localizedProducts.find(product => product.id === item.productId) })),
  }));
  const [quantities, setQuantities] = useState(() => Object.fromEntries(
    plans.flatMap(plan => plan.items.map(item => [item.productId, String(item.defaultQty)])),
  ));
  return <section className="dealer-plans" id="dealer-starter-plans" aria-labelledby="dealer-plans-title">
    <div className="buyer-section-heading">
      <h2 id="dealer-plans-title">{title}</h2>
      <p>{intro}</p>
    </div>
    <div className="dealer-plan-grid">{plans.map(plan => <form key={plan.name} className="dealer-plan" onSubmit={event => {
      event.preventDefault();
      const rows = plan.items.filter(item => Number(quantities[item.productId]) > 0)
        .map(item => `${item.product.model} × ${Number(quantities[item.productId])}`);
      if (rows.length) onSelect(plan.name + '\n' + rows.join('\n'));
    }}>
      <h3>{plan.name}</h3><p>{plan.description}</p>
      <ul>{plan.items.map(({ product, productId }) => <li key={productId}>
        <div><a href={locale === 'en' ? kitchenModelHref(productId) : catalogue + '?model=' + encodeURIComponent(productId) + '#commercial-kitchen-equipment'}>{product.model}</a><span>{product.name}</span></div>
        <label><span>{quantity}</span><input aria-label={`${quantityFor} ${product.model}`} type="number" min="0" max="99999" step="1" required value={quantities[productId]}
          onChange={event => setQuantities(previous => ({ ...previous, [productId]: event.target.value }))} /></label>
      </li>)}</ul>
      <button className="buyer-button" type="submit" disabled={plan.items.every(item => !Number(quantities[item.productId]))}>{usePlan} <span aria-hidden="true">↓</span></button>
    </form>)}</div>
    <p className="buyer-small">{scope}</p>
    <a className="buyer-secondary" href={locale === 'en' ? '#commercial-kitchen-benchmarks' : locale === 'zh' ? '#commercial-kitchen-margin' : catalogue + '#commercial-kitchen-margin'}>{margin} ↗</a>
  </section>;
}
