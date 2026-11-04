import type { Language } from '../../i18n/translations';

const labels: Record<Language, [string, string, string, string, string]> = {
  en: ['Three shipping documents to cross-check', 'Sample fields · Illustrative only', 'Commercial invoice', 'Packing list', 'Ocean bill of lading'],
  zh: ['三份海运单证怎么对照', '字段示意 · 使用虚构数据', '商业发票', '装箱单', '海运提单'],
  es: ['Tres documentos de transporte que conviene cotejar', 'Campos de ejemplo · Solo ilustrativos', 'Factura comercial', 'Lista de empaque', 'Conocimiento de embarque marítimo'],
  ru: ['Три документа для сверки при морской перевозке', 'Пример полей · Условные данные', 'Коммерческий инвойс', 'Упаковочный лист', 'Морской коносамент'],
  fr: ['Trois documents maritimes à recouper', 'Exemple de champs · Données fictives', 'Facture commerciale', 'Liste de colisage', 'Connaissement maritime'],
  ar: ['ثلاث وثائق شحن بحري للمطابقة', 'حقول توضيحية · بيانات افتراضية', 'الفاتورة التجارية', 'قائمة التعبئة', 'بوليصة الشحن البحري'],
  pt: ['Três documentos marítimos para conferir', 'Exemplo de campos · Dados fictícios', 'Fatura comercial', 'Lista de volumes', 'Conhecimento de embarque marítimo'],
  tr: ['Karşılaştırılacak üç deniz taşımacılığı belgesi', 'Örnek alanlar · Kurgusal veriler', 'Ticari fatura', 'Çeki listesi', 'Deniz konşimentosu'],
};

const comparison: Record<Language, string> = {
  en: 'A · Match the invoice reference and 60 units on the invoice and packing list. B · Then match 12 cartons and 240 kg gross on the packing list and bill of lading. The 60 units are packed into 12 cartons.',
  zh: 'A · 先对照商业发票和装箱单上的发票编号与 60 件商品。B · 再核对装箱单和海运提单上的 12 箱及 240 千克毛重。60 件是商品数量，12 箱是外包装件数。',
  es: 'A · Coteje la referencia de factura y las 60 unidades en la factura y la lista de empaque. B · Luego coteje las 12 cajas y los 240 kg de peso bruto en la lista y el conocimiento de embarque. Las 60 unidades van en 12 cajas.',
  ru: 'A · Сверьте номер инвойса и 60 единиц товара в инвойсе и упаковочном листе. B · Затем сверьте 12 коробок и массу брутто 240 кг в упаковочном листе и коносаменте. 60 единиц упакованы в 12 коробок.',
  fr: 'A · Vérifiez la référence de facture et les 60 unités sur la facture et la liste de colisage. B · Comparez ensuite les 12 cartons et les 240 kg bruts entre la liste de colisage et le connaissement. Les 60 unités sont réparties dans 12 cartons.',
  ar: 'A · طابق مرجع الفاتورة والكمية البالغة 60 وحدة بين الفاتورة وقائمة التعبئة. B · ثم طابق 12 صندوقًا والوزن الإجمالي البالغ 240 كغ بين قائمة التعبئة وبوليصة الشحن. الوحدات الستون معبأة في 12 صندوقًا.',
  pt: 'A · Confira a referência da fatura e as 60 unidades na fatura e na lista de volumes. B · Depois, compare as 12 caixas e os 240 kg brutos na lista e no conhecimento de embarque. As 60 unidades estão embaladas em 12 caixas.',
  tr: 'A · Fatura numarasını ve 60 adet ürünü faturada ve çeki listesinde karşılaştırın. B · Ardından 12 koli ve 240 kg brüt ağırlığı çeki listesi ile konşimentoda doğrulayın. 60 ürün 12 koliye paketlenmiştir.',
};

const samples = [
  {
    title: 'Commercial Invoice',
    fields: [['Invoice ref.', 'DEMO-014', 'A'], ['Seller / buyer', 'Exporter A / Importer B'], ['Goods', 'Steel shelving'], ['Quantity', '60 units', 'A'], ['Unit value', 'EUR 50.00'], ['Total', 'EUR 3,000.00']],
  },
  {
    title: 'Packing List',
    fields: [['Invoice ref.', 'DEMO-014', 'A'], ['Goods', 'Steel shelving'], ['Packages', '12 cartons', 'B'], ['Quantity', '60 units', 'A'], ['Net weight', '216 kg'], ['Gross weight', '240 kg', 'B']],
  },
  {
    title: 'Ocean Bill of Lading',
    fields: [['Shipper / consignee', 'Exporter A / Importer B'], ['Port of loading', 'Shenzhen'], ['Port of discharge', 'Valencia'], ['Goods', 'Steel shelving'], ['Packages', '12 cartons', 'B'], ['Gross weight', '240 kg', 'B']],
  },
];

export default function EuropeDocumentExamples({ locale }: { locale: Language }) {
  const [heading, sampleLabel, ...titles] = labels[locale];

  return (
    <section className="europe-documents" id="europe-documents" aria-labelledby="europe-documents-heading">
      <h3 id="europe-documents-heading">{heading}</h3>
      <p>{sampleLabel}</p>
      <div className="europe-document-grid">
        {samples.map(({ title, fields }, index) => (
          <figure key={title}>
            <figcaption>{titles[index]}</figcaption>
            <div className="europe-document-paper" lang="en" dir="ltr">
              <div className="europe-document-title">
                <span>SPECIMEN</span>
                <strong>{title}</strong>
              </div>
              <dl>
                {fields.map(([field, value, group]) => (
                  <div key={field} data-document-group={group}>
                    <dt>{group && <span className="europe-document-marker">{group}</span>}{field}</dt>
                    <dd>{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </figure>
        ))}
      </div>
      <p className="europe-document-comparison">{comparison[locale]}</p>
    </section>
  );
}
