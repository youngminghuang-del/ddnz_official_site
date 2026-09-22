import { FieldGallery } from './ServiceMotion';
import { useState } from 'react';
import { Check, SlidersHorizontal } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import type { Language } from '../i18n/translations';

type Stage = { label: string; title: string; body: string; tags: string[] };
type PreviewCopy = { aria: string; compare: string; topics: string; stages: Stage[] };

const copy: Record<Language, PreviewCopy> = {
  en: { aria: 'Supplier visit and comparison process', compare: 'WHAT WE COMPARE', topics: 'Comparison topics', stages: [
    { label: 'Product fit', title: 'Start with the product.', body: 'Compare materials, features and packaging against your buying brief.', tags: ['Materials', 'Features', 'Packing'] },
    { label: 'Price & MOQ', title: 'Make quotes comparable.', body: 'Review unit price, minimum order quantity and lead time on the same basis.', tags: ['Unit price', 'MOQ', 'Lead time'] },
    { label: 'Samples', title: 'Know what to check next.', body: 'Confirm sample requirements and the points to review before a bulk order.', tags: ['Sample scope', 'Quality points', 'Next steps'] },
  ] },
  zh: { aria: '供应商走访与比价流程', compare: '比较内容', topics: '比较主题', stages: [
    { label: '产品匹配', title: '先从产品开始。', body: '根据采购需求比较材料、功能和包装。', tags: ['材料', '功能', '包装'] },
    { label: '价格与起订量', title: '让报价可比较。', body: '在统一口径下核对单价、最小起订量和交期。', tags: ['单价', '起订量', '交期'] },
    { label: '样品', title: '明确下一步检查。', body: '批量下单前确认样品要求和需要审核的要点。', tags: ['样品范围', '质量要点', '下一步'] },
  ] },
  ru: { aria: 'Посещение и сравнение поставщиков', compare: 'ЧТО МЫ СРАВНИВАЕМ', topics: 'Темы сравнения', stages: [
    { label: 'Соответствие товара', title: 'Начните с товара.', body: 'Сопоставьте материалы, функции и упаковку с закупочным заданием.', tags: ['Материалы', 'Функции', 'Упаковка'] },
    { label: 'Цена и MOQ', title: 'Сделайте предложения сопоставимыми.', body: 'Сравните цену, минимальный заказ и срок на одной основе.', tags: ['Цена', 'MOQ', 'Срок'] },
    { label: 'Образцы', title: 'Определите следующую проверку.', body: 'Подтвердите требования к образцу до оптового заказа.', tags: ['Объем образца', 'Качество', 'Следующие шаги'] },
  ] },
  fr: { aria: 'Visite et comparaison des fournisseurs', compare: 'CE QUE NOUS COMPARONS', topics: 'Thèmes de comparaison', stages: [
    { label: 'Adéquation produit', title: 'Commencer par le produit.', body: 'Comparer matières, fonctions et emballage au brief d’achat.', tags: ['Matières', 'Fonctions', 'Emballage'] },
    { label: 'Prix et MOQ', title: 'Rendre les offres comparables.', body: 'Comparer prix unitaire, quantité minimale et délai sur une même base.', tags: ['Prix unitaire', 'MOQ', 'Délai'] },
    { label: 'Échantillons', title: 'Définir le prochain contrôle.', body: 'Confirmer les exigences d’échantillon avant la commande.', tags: ['Périmètre', 'Qualité', 'Étapes suivantes'] },
  ] },
  es: { aria: 'Visita y comparación de proveedores', compare: 'QUÉ COMPARAMOS', topics: 'Temas de comparación', stages: [
    { label: 'Ajuste del producto', title: 'Empiece por el producto.', body: 'Compare materiales, funciones y embalaje con el brief.', tags: ['Materiales', 'Funciones', 'Embalaje'] },
    { label: 'Precio y MOQ', title: 'Haga comparables las ofertas.', body: 'Revise precio, pedido mínimo y plazo con la misma base.', tags: ['Precio', 'MOQ', 'Plazo'] },
    { label: 'Muestras', title: 'Defina el siguiente control.', body: 'Confirme requisitos y puntos de revisión antes del pedido.', tags: ['Alcance', 'Calidad', 'Siguientes pasos'] },
  ] },
  ar: { aria: 'زيارة الموردين وعملية المقارنة', compare: 'ما الذي نقارنه', topics: 'موضوعات المقارنة', stages: [
    { label: 'ملاءمة المنتج', title: 'ابدأ بالمنتج.', body: 'قارن المواد والميزات والتعبئة بموجز الشراء.', tags: ['المواد', 'الميزات', 'التعبئة'] },
    { label: 'السعر والحد الأدنى', title: 'اجعل العروض قابلة للمقارنة.', body: 'راجع السعر والحد الأدنى والمهلة على الأساس نفسه.', tags: ['سعر الوحدة', 'الحد الأدنى', 'المهلة'] },
    { label: 'العينات', title: 'حدد الفحص التالي.', body: 'أكد متطلبات العينة قبل الطلب بالجملة.', tags: ['نطاق العينة', 'نقاط الجودة', 'الخطوات التالية'] },
  ] },
  pt: { aria: 'Visita e comparação de fornecedores', compare: 'O QUE COMPARAMOS', topics: 'Tópicos de comparação', stages: [
    { label: 'Adequação do produto', title: 'Comece pelo produto.', body: 'Compare materiais, recursos e embalagem com o brief.', tags: ['Materiais', 'Recursos', 'Embalagem'] },
    { label: 'Preço e MOQ', title: 'Torne as cotações comparáveis.', body: 'Revise preço, pedido mínimo e prazo na mesma base.', tags: ['Preço', 'MOQ', 'Prazo'] },
    { label: 'Amostras', title: 'Defina a próxima verificação.', body: 'Confirme os requisitos da amostra antes do pedido.', tags: ['Escopo', 'Qualidade', 'Próximos passos'] },
  ] },
  tr: { aria: 'Tedarikçi ziyareti ve karşılaştırma süreci', compare: 'NELERİ KARŞILAŞTIRIYORUZ', topics: 'Karşılaştırma konuları', stages: [
    { label: 'Ürün uyumu', title: 'Ürünle başlayın.', body: 'Malzeme, özellik ve ambalajı satın alma talebiyle karşılaştırın.', tags: ['Malzeme', 'Özellikler', 'Ambalaj'] },
    { label: 'Fiyat ve MOQ', title: 'Teklifleri karşılaştırılabilir yapın.', body: 'Birim fiyatı, minimum siparişi ve süreyi aynı temelde inceleyin.', tags: ['Birim fiyat', 'MOQ', 'Teslim süresi'] },
    { label: 'Numuneler', title: 'Sonraki kontrolü belirleyin.', body: 'Toplu siparişten önce numune gerekliliklerini doğrulayın.', tags: ['Numune kapsamı', 'Kalite', 'Sonraki adımlar'] },
  ] },
};

export default function SupplierFieldPreview(_props: { image: string; alt: string }) {
  const { language } = useLanguage();
  const [active, setActive] = useState(0);
  const t = copy[language];
  const stage = t.stages[active];
  return <figure className="sf-story" aria-label={t.aria}>
    <FieldGallery />
    <figcaption className="sf-desk">
      <div className="sf-desk-heading"><SlidersHorizontal size={16} aria-hidden="true" /><span>{t.compare}</span><small>0{active + 1} / 03</small></div>
      <div className="sf-tabs" role="group" aria-label={t.topics}>{t.stages.map((item, index) => <button type="button" key={item.label} aria-pressed={active === index} onClick={() => setActive(index)}>{item.label}</button>)}</div>
      <div className="sf-panel" aria-live="polite"><strong>{stage.title}</strong><p>{stage.body}</p><div>{stage.tags.map(tag => <span key={tag}><Check size={12} aria-hidden="true" />{tag}</span>)}</div></div>
    </figcaption>
  </figure>;
}
