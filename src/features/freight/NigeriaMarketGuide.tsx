import type { Language } from '../../i18n/translations';
import { freightPrefix } from './regions';

type Market = {
  name: string;
  area: string;
  focus: Record<Language, string>;
  check: Record<Language, string>;
  image: string;
  imagePage: string;
  contextPage: string;
  credit: string;
};

const markets: Market[] = [
  {
    name: 'Alaba International Market', area: 'OJO · LAGOS',
    focus: { en: 'Electrical goods, electronics and appliances', zh: '电器、电子产品与家用设备', es: 'Electricidad, electrónica y electrodomésticos', ru: 'Электротовары, электроника и бытовая техника', fr: 'Électricité, électronique et électroménager', ar: 'الأجهزة الكهربائية والإلكترونيات', pt: 'Elétricos, eletrônicos e eletrodomésticos', tr: 'Elektrik ürünleri, elektronik ve ev aletleri' },
    check: { en: 'Ask the buyer for the exact receiving address in Ojo and confirm product-specific import documents before loading.', zh: '先向买方确认 Ojo 的具体收货地址，装柜前核对产品对应的进口文件。', es: 'Pida la dirección exacta en Ojo y confirme los documentos de importación del producto antes de cargar.', ru: 'Уточните адрес в Оджо и документы на товар до погрузки.', fr: 'Confirmez l’adresse à Ojo et les documents d’importation propres au produit avant chargement.', ar: 'تحقق من عنوان الاستلام في أوجو ووثائق استيراد المنتج قبل التحميل.', pt: 'Confirme o endereço em Ojo e os documentos de importação do produto antes do carregamento.', tr: 'Yüklemeden önce Ojo teslim adresini ve ürün bazlı ithalat belgelerini doğrulayın.' },
    image: '/images/markets/alaba-international-market-lagos.webp',
    imagePage: 'https://commons.wikimedia.org/wiki/File:Ojo_Alaba_international_market_Lagos_Electronics_section.jpg', credit: 'Kosykelvin · CC BY-SA 4.0',
    contextPage: 'https://www.alabamarket.com/',
  },
  {
    name: 'Computer Village', area: 'IKEJA · LAGOS',
    focus: { en: 'Computers, phones and technology accessories', zh: '电脑、手机与数码配件', es: 'Computadoras, teléfonos y accesorios', ru: 'Компьютеры, телефоны и аксессуары', fr: 'Ordinateurs, téléphones et accessoires', ar: 'الحواسيب والهواتف وملحقاتها', pt: 'Computadores, celulares e acessórios', tr: 'Bilgisayar, telefon ve teknoloji aksesuarları' },
    check: { en: 'Separate the port or warehouse handover from distribution into Ikeja; confirm cartons, labels and consignee details.', zh: '把到港或仓库交接与进入 Ikeja 的配送分开计价，并核对箱唛、标签及收货人。', es: 'Separe la entrega portuaria o en almacén del reparto en Ikeja; confirme cajas, etiquetas y destinatario.', ru: 'Отделите выдачу в порту или на складе от доставки в Икеджу; проверьте маркировку и получателя.', fr: 'Distinguez remise au port ou à l’entrepôt et distribution à Ikeja ; vérifiez colis, étiquettes et destinataire.', ar: 'افصل التسليم بالميناء أو المستودع عن التوزيع إلى إيكيجا وتحقق من العلامات والمستلم.', pt: 'Separe a entrega no porto ou armazém da distribuição em Ikeja; confira volumes e destinatário.', tr: 'Liman veya depo teslimi ile Ikeja dağıtımını ayrı planlayın; koli etiketlerini ve alıcıyı doğrulayın.' },
    image: '/images/markets/computer-village-ikeja-lagos.webp',
    imagePage: 'https://commons.wikimedia.org/wiki/File:Computer_Village,_Ikeja,_Lagos.jpg', credit: 'Lightfast Media · CC BY-SA 4.0',
    contextPage: 'https://lasbca.lagosstate.gov.ng/lagos-restate-commitments-to-urban-development-and-regeneration/',
  },
  {
    name: 'Ladipo Market', area: 'MUSHIN · LAGOS',
    focus: { en: 'Automotive spare parts and components', zh: '汽车零配件与部件', es: 'Repuestos y componentes automotrices', ru: 'Автозапчасти и компоненты', fr: 'Pièces détachées automobiles', ar: 'قطع غيار السيارات ومكوناتها', pt: 'Peças e componentes automotivos', tr: 'Otomotiv yedek parçaları ve bileşenleri' },
    check: { en: 'For dense or heavy parts, quote the actual gross weight, pallet size and unloading method—not just cubic metres.', zh: '轮毂等重货应提供实际毛重、托盘尺寸与卸货方式，不能只报立方数。', es: 'Para piezas pesadas, facilite peso bruto, tamaño del palé y método de descarga; no solo metros cúbicos.', ru: 'Для тяжёлых деталей укажите брутто, размеры паллеты и способ разгрузки, не только объём.', fr: 'Pour les pièces lourdes, indiquez poids brut, dimensions de palette et mode de déchargement, pas seulement le volume.', ar: 'للقطع الثقيلة، اذكر الوزن الإجمالي وأبعاد المنصة وطريقة التفريغ، لا الحجم وحده.', pt: 'Para peças pesadas, informe peso bruto, tamanho do palete e modo de descarga, não só o volume.', tr: 'Ağır parçalarda yalnızca hacmi değil brüt ağırlığı, palet ölçüsünü ve boşaltma şeklini belirtin.' },
    image: '/images/markets/ladipo-market-mushin-lagos.webp',
    imagePage: 'https://commons.wikimedia.org/wiki/File:Ladipo_market.jpg', credit: 'Newtrains · CC BY-SA 4.0',
    contextPage: 'https://www.ladipomarket.com.ng/contact',
  },
];

const copy: Record<Language, { kicker: string; title: string; intro: string; photo: string; note: string; next: string; source: string; context: string }> = {
  en: { kicker: 'LAGOS / WHOLESALE MARKETS', title: 'The port is not the market.', intro: 'A Lagos arrival is only one milestone. These wholesale districts help define the buyer’s receiving point, cargo profile and inland handover before you compare freight quotes.', photo: 'Independent market photograph, not a DDNZ delivery record', note: 'Market locations are planning context, not a promise of delivery. Clearance, collection, local trucking and unloading depend on the written quote.', next: 'Plan a Nigeria shipment', source: 'Photo source', context: 'Market reference' },
  zh: { kicker: '拉各斯 / 批发市场', title: '到港，不等于到市场。', intro: '拉各斯到港只是一个节点。先按买家的批发市场确认货类、具体收货点和内陆交接范围，货运报价才有可比性。', photo: '独立市场照片，非 DDNZ 交货记录', note: '市场位置用于规划，不代表承诺配送。清关、提货、当地运输和卸货以书面报价为准。', next: '规划尼日利亚货运', source: '照片来源', context: '市场资料' },
  es: { kicker: 'LAGOS / MERCADOS MAYORISTAS', title: 'El puerto no es el mercado.', intro: 'Llegar a Lagos es solo una etapa. Identifique el mercado, el tipo de carga y el punto de recepción antes de comparar ofertas.', photo: 'Foto independiente del mercado, no prueba de entrega de DDNZ', note: 'Los mercados son contexto de planificación, no una promesa de entrega. Aduana, recogida, traslado y descarga dependen de la oferta escrita.', next: 'Planificar envío a Nigeria', source: 'Fuente de la foto', context: 'Fuente del mercado' },
  ru: { kicker: 'ЛАГОС / ОПТОВЫЕ РЫНКИ', title: 'Порт — ещё не рынок.', intro: 'Прибытие в Лагос — лишь один этап. Уточните рынок покупателя, тип груза и место приёмки до сравнения ставок.', photo: 'Независимое фото рынка, не подтверждение доставки DDNZ', note: 'Рынки показаны для планирования. Таможня, вывоз, местная перевозка и разгрузка зависят от письменного предложения.', next: 'План перевозки в Нигерию', source: 'Источник фото', context: 'О рынке' },
  fr: { kicker: 'LAGOS / MARCHÉS DE GROS', title: 'Le port n’est pas le marché.', intro: 'L’arrivée à Lagos n’est qu’une étape. Précisez le marché, la marchandise et le point de réception avant de comparer les devis.', photo: 'Photo indépendante du marché, pas une preuve de livraison DDNZ', note: 'Ces marchés servent à la planification, sans promesse de livraison. Douane, enlèvement, transport et déchargement dépendent du devis écrit.', next: 'Préparer un envoi au Nigeria', source: 'Source de la photo', context: 'Référence marché' },
  ar: { kicker: 'لاغوس / أسواق الجملة', title: 'الميناء ليس السوق.', intro: 'الوصول إلى لاغوس مرحلة واحدة فقط. حدد سوق المشتري ونوع البضاعة ونقطة الاستلام قبل مقارنة الأسعار.', photo: 'صورة مستقلة للسوق وليست إثبات تسليم من DDNZ', note: 'الأسواق مرجع للتخطيط لا وعد بالتسليم. يحدد العرض المكتوب التخليص والاستلام والنقل والتفريغ.', next: 'خطط لشحنة إلى نيجيريا', source: 'مصدر الصورة', context: 'معلومات السوق' },
  pt: { kicker: 'LAGOS / MERCADOS ATACADISTAS', title: 'O porto não é o mercado.', intro: 'A chegada a Lagos é só uma etapa. Defina o mercado, a carga e o ponto de recebimento antes de comparar cotações.', photo: 'Foto independente do mercado, não comprovante de entrega DDNZ', note: 'Mercados são contexto de planejamento, não promessa de entrega. Desembaraço, coleta, transporte e descarga dependem da proposta escrita.', next: 'Planejar envio para a Nigéria', source: 'Fonte da foto', context: 'Referência do mercado' },
  tr: { kicker: 'LAGOS / TOPTAN PAZARLAR', title: 'Liman, pazar değildir.', intro: 'Lagos’a varış yalnızca bir aşamadır. Teklifleri karşılaştırmadan önce pazarı, yük türünü ve teslim noktasını belirleyin.', photo: 'Bağımsız pazar fotoğrafı; DDNZ teslimat kaydı değildir', note: 'Pazarlar planlama bilgisidir, teslimat vaadi değildir. Gümrük, alma, yerel taşıma ve boşaltma yazılı teklife bağlıdır.', next: 'Nijerya sevkiyatını planlayın', source: 'Fotoğraf kaynağı', context: 'Pazar bilgisi' },
};

export default function NigeriaMarketGuide({ locale, compact = false }: { locale: Language; compact?: boolean }) {
  const c = copy[locale];
  const prefix = freightPrefix(locale);
  const countryHref = `${locale === 'pt' || locale === 'tr' ? '' : prefix}/shipping-from-china-to-nigeria/`;
  return <section className={`freight-nigeria-markets${compact ? ' freight-nigeria-markets-compact' : ''}`} id={compact ? 'west-africa-markets' : 'nigeria-markets'} aria-labelledby={compact ? 'west-africa-markets-title' : 'nigeria-markets-title'}>
    <div className="freight-wrap freight-section">
      <div className="freight-market-heading"><div><p className="freight-kicker">03 / {c.kicker}</p><h2 id={compact ? 'west-africa-markets-title' : 'nigeria-markets-title'}>{c.title}</h2></div><p>{c.intro}</p></div>
      <div className="freight-market-grid">{markets.map((market, index) => <article key={market.name}>
        <div className="freight-market-photo"><img src={market.image} alt={`${market.name}, ${market.area.toLowerCase().replace(' · ', ', ')}`} loading="lazy" decoding="async" referrerPolicy="no-referrer"/><span>{String(index + 1).padStart(2, '0')} / {market.area}</span></div>
        <div className="freight-market-copy"><h3>{market.name}</h3><strong>{market.focus[locale]}</strong><p>{market.check[locale]}</p></div>
      </article>)}</div>
      <div className="freight-market-footer"><p>{c.note}</p>{compact && <a href={`${countryHref}#nigeria-markets`}>{c.next} ↗</a>}</div>
      <details className="freight-market-credits"><summary>{c.source}</summary><p>{c.photo}</p><ul>{markets.map(market => <li key={market.name}><span>{market.name}</span> · <a href={market.imagePage} target="_blank" rel="noreferrer">{market.credit} ↗</a> · <a href={market.contextPage} target="_blank" rel="noreferrer">{c.context} ↗</a></li>)}</ul></details>
    </div>
  </section>;
}
