import { ArrowRight, PackageCheck, TrainFront, Truck } from 'lucide-react';
import type { Language } from '../../i18n/translations';
import { corridorCopy, corridorNodes } from './centralAsiaRouteCopy';

const copy = {
  zh: [
    '中国到中亚陆运',
    '铁路舱位紧张时，优先评估跨境卡车。按货物、口岸、收货城市和交付地址确认车辆、是否换装、发车时间与报价。',
    '中亚班列、中欧班列和中俄班列可按实际停靠站、可卸货站点、舱位及后段接驳比较。',
    'TIR 是国际海关过境制度。选择卡车方案时，可核实承运人、沿途口岸与货物是否适用。目的国进口清关及税费仍需另行确认。',
  ],
  en: [
    'Compare truck and rail options for Central Asia',
    'When rail space is tight, check cross-border trucking first. Confirm vehicle availability, transfers, departure and price for your cargo, border crossing, destination city and delivery address.',
    'Compare China–Central Asia, China–Europe and China–Russia rail services by actual stops, unloading options, space and onward connections.',
    'TIR is an international customs transit procedure. For a trucking option, check whether the carrier, border crossings and cargo qualify. Confirm destination import clearance, duties and taxes separately.',
  ],
  ru: [
    'Автоперевозки и железная дорога в Центральную Азию',
    'Если мест на поезде мало, в первую очередь рассмотрите автоперевозку. Уточните наличие машины, перегрузку, отправление и цену по грузу, погранпереходу, городу и адресу доставки.',
    'Сравните поезда Китай — Центральная Азия, Китай — Европа и Китай — Россия по фактическим остановкам, возможности выгрузки, наличию мест и дальнейшей доставке.',
    'TIR (МДП) — международная процедура таможенного транзита. Для автоперевозки проверьте допуск перевозчика, погранпереходов и груза. Импортное оформление, пошлины и налоги в стране назначения уточняются отдельно.',
  ],
  es: [
    'Transporte por carretera y ferrocarril a Asia Central',
    'Si hay poco espacio en tren, evalúe primero el camión transfronterizo. Confirme vehículo, transbordos, salida y precio según la carga, el paso fronterizo, la ciudad y la dirección de entrega.',
    'Compare los trenes China–Asia Central, China–Europa y China–Rusia según sus paradas, puntos de descarga, capacidad y conexiones posteriores.',
    'El TIR es un régimen de tránsito aduanero internacional. Compruebe si el transportista, los pasos fronterizos y la carga pueden acogerse al régimen. Confirme por separado el despacho de importación y los impuestos y aranceles en destino.',
  ],
  fr: [
    'Transport routier et ferroviaire vers l’Asie centrale',
    'Si les places en train sont limitées, étudiez d’abord le camion transfrontalier. Confirmez le véhicule, les transbordements, le départ et le prix selon le fret, le poste-frontière, la ville et l’adresse de livraison.',
    'Comparez les trains Chine–Asie centrale, Chine–Europe et Chine–Russie selon leurs arrêts, points de déchargement, places disponibles et correspondances.',
    'Le TIR est un régime de transit douanier international. Vérifiez l’admissibilité du transporteur, des postes-frontières et du fret. Confirmez séparément le dédouanement à l’importation, les droits et les taxes à destination.',
  ],
  ar: [
    'خيارات الشحن البري والسكك الحديدية إلى آسيا الوسطى',
    'عندما تكون سعة القطارات محدودة، ادرس النقل بالشاحنات عبر الحدود أولاً. تحقق من توفر المركبة والمناولة والموعد والسعر حسب الشحنة والمعبر والمدينة وعنوان التسليم.',
    'قارن قطارات الصين إلى آسيا الوسطى وأوروبا وروسيا وفق المحطات الفعلية ونقاط التفريغ والسعة والربط بالوجهة.',
    'نظام TIR إجراء للعبور الجمركي الدولي. تحقق من أهلية الناقل والمعابر والشحنة. وأكّد التخليص عند الاستيراد والرسوم والضرائب في بلد الوجهة بشكل منفصل.',
  ],
  pt: [
    'Transporte rodoviário e ferroviário para a Ásia Central',
    'Quando houver pouco espaço no trem, avalie primeiro o caminhão transfronteiriço. Confirme veículo, transbordos, partida e preço conforme a carga, a fronteira, a cidade e o endereço de entrega.',
    'Compare os trens China–Ásia Central, China–Europa e China–Rússia pelas paradas, pontos de descarga, vagas e conexões até o destino.',
    'O TIR é um regime de trânsito aduaneiro internacional. Verifique se a transportadora, as passagens de fronteira e a carga são elegíveis. Confirme separadamente o desembaraço de importação e os tributos no destino.',
  ],
  tr: [
    'Orta Asya için kara yolu ve demir yolu seçenekleri',
    'Trende yer sınırlıysa önce sınır ötesi kamyon taşımacılığını değerlendirin. Yüke, sınır kapısına, varış şehrine ve adrese göre araç, aktarma, hareket tarihi ve fiyatı teyit edin.',
    'Çin–Orta Asya, Çin–Avrupa ve Çin–Rusya trenlerini duraklar, boşaltma noktaları, kapasite ve sonraki bağlantılara göre karşılaştırın.',
    'TIR uluslararası bir gümrük transit rejimidir. Taşıyıcının, sınır kapılarının ve yükün uygunluğunu kontrol edin. Varış ülkesindeki ithalat işlemlerini, gümrük vergilerini ve diğer vergileri ayrıca teyit edin.',
  ],
} satisfies Record<Language, [string, string, string, string]>;

const countryCodes: Record<string, string> = {
  kazakhstan: 'KZ', kyrgyzstan: 'KG', tajikistan: 'TJ', uzbekistan: 'UZ', turkmenistan: 'TM', russia: 'RU',
};

const guidance = {
  zh: ['卡车按实际口岸、车辆和收货地址核价，同时确认这票货是否适用 TIR。', '从中国内地发货，可比较全程卡车与先走铁路、再从喀什转公路的方案。走铁公联运时，询价请注明收货城市，并确认喀什换装、出境口岸和到门段是否包含在报价内。', '先核对可用铁路口岸、俄方接运站和交接责任，再确认货物接受条件及舱位。', '先确认目的站能否卸货及后段接驳，再比较各通道的实际班次和舱位。'],
  en: ['Price the truck against the actual border crossing, vehicle and delivery address. Check whether TIR applies to this shipment.', 'Compare all-road transport with rail to Kashgar and onward trucking. Give the destination city when requesting a quote and check whether the Kashgar transfer, border crossing and final delivery are included.', 'Confirm the rail crossing, receiving station and handover responsibilities before checking cargo acceptance and space.', 'Check where your cargo can be unloaded and how it continues to the final address before comparing departures and space.'],
  ru: ['Рассчитайте автоперевозку по фактическому переходу, машине и адресу. Уточните применимость МДП к партии.', 'Уточните станцию бронирования, затем погранпереход, перевозчика и адрес доставки для автоплеча из Кашгара.', 'До проверки груза и мест уточните ж/д переход, станцию приёма и ответственность за передачу.', 'Сравнивайте отправления и места после проверки станции выгрузки и дальнейшей доставки.'],
  es: ['Cotice el camión según el paso fronterizo, el vehículo y la dirección. Compruebe si se aplica el TIR.', 'Confirme la terminal ferroviaria disponible y después el paso, el transportista y la entrega del tramo por carretera desde Kashgar.', 'Confirme el paso ferroviario, la estación receptora y las responsabilidades antes de revisar la carga y el espacio.', 'Verifique la terminal de descarga y la conexión final antes de comparar salidas y capacidad.'],
  fr: ['Chiffrez le camion selon le poste-frontière, le véhicule et l’adresse. Vérifiez si le TIR s’applique.', 'Confirmez le terminal ferroviaire réservable, puis le poste-frontière, le transporteur et la livraison du tronçon routier depuis Kashgar.', 'Confirmez le poste ferroviaire, la gare de réception et les responsabilités avant de vérifier le fret et la capacité.', 'Vérifiez le terminal de déchargement et la livraison finale avant de comparer les départs et la capacité.'],
  ar: ['اطلب سعر الشاحنة حسب المعبر والمركبة وعنوان التسليم، وتحقق من انطباق نظام TIR على الشحنة.', 'أكد محطة القطار المتاحة ثم المعبر والناقل وعنوان التسليم للمرحلة البرية من كاشغر.', 'أكد معبر السكك ومحطة الاستلام ومسؤولية التسليم قبل التحقق من قبول الشحنة والسعة.', 'تحقق من محطة التفريغ والربط مع الوجهة قبل مقارنة الرحلات والسعة.'],
  pt: ['Cote o caminhão pelo posto de fronteira, veículo e endereço. Verifique se o TIR se aplica à remessa.', 'Confirme o terminal ferroviário disponível e, para o trecho rodoviário de Kashgar, a fronteira, a transportadora e a entrega.', 'Confirme a passagem ferroviária, a estação receptora e as responsabilidades antes de verificar o frete e o espaço.', 'Confirme o terminal de descarga e a entrega final antes de comparar partidas e vagas.'],
  tr: ['Sınır kapısı, araç ve teslimat adresine göre kamyon fiyatı alın. TIR uygunluğunu kontrol edin.', 'Önce rezervasyon yapılabilecek demir yolu terminalini, sonra Kaşgar’dan kara yolu için sınır kapısını, taşıyıcıyı ve teslimatı teyit edin.', 'Yük ve kapasiteyi kontrol etmeden önce demir yolu geçişini, varış istasyonunu ve teslim sorumluluğunu teyit edin.', 'Sefer ve kapasiteyi karşılaştırmadan önce boşaltma terminalini ve son teslimatı teyit edin.'],
} satisfies Record<Language, [string, string, string, string]>;

const transferCities: Record<string, [string, string, string]> = {
  kyrgyzstan: ['比什凯克', 'Бишкек', 'Bishkek'],
  tajikistan: ['杜尚别', 'Душанбе', 'Dushanbe'],
  uzbekistan: ['塔什干', 'Ташкент', 'Tashkent'],
};

export default function CentralAsiaRouteOptions({ locale, destination }: { locale: Language; destination?: string }) {
  const [title, road, rail, tir] = copy[locale];
  const content = corridorCopy[locale];
  const nodeLocale = locale === 'zh' || locale === 'ru' ? locale : 'en';
  const nodes = corridorNodes[nodeLocale];
  const isRussia = destination === 'russia';
  const isEurope = destination === 'europe';
  const city = destination && transferCities[destination];
  const rows = isRussia ? [2] : isEurope ? [3] : city ? [1] : destination === 'kazakhstan' ? [0] : destination ? [] : [0, 1];
  const countryCode = destination && countryCodes[destination];
  const country = countryCode && new Intl.DisplayNames([locale], {type:'region'}).of(countryCode);
  const destinationLabel = isEurope ? content.names[3] : country;
  const decisions = guidance[locale];

  return (
    <section id="central-asia-road-rail" className="central-corridor" aria-labelledby="central-asia-road-rail-title">
      <div className="central-corridor__lead">
        <div>
          <p className="central-corridor__label">{content.label}</p>
          <h2 id="central-asia-road-rail-title">{destinationLabel || title}</h2>
          <p>{isRussia ? decisions[2] : isEurope ? decisions[3] : road}</p>
        </div>
        {(!destination || destination === 'uzbekistan') && (
          <figure>
            <img src="/images/operations/central-asia-uzbekistan-road-loading-overview.webp" alt={content.photo} loading="lazy" />
            <figcaption>{content.photo}</figcaption>
          </figure>
        )}
      </div>
      {rows.length > 0 && <>
        <p className="central-corridor__legend">{content.schematic}</p>
        <div className="central-corridor__register">
          {rows.map(index => {
            const labels = index === 1 && city
              ? [...nodes[index].slice(0, 2), city[locale === 'zh' ? 0 : locale === 'ru' ? 1 : 2]]
              : nodes[index];
            return (
              <article key={index} className="central-corridor__row">
                <div>
                  <h3>{content.names[index]}</h3>
                  <ol className="central-corridor__diagram" lang={nodeLocale} dir="ltr">
                    {labels.map((node, stage) => {
                      const Icon = stage === labels.length - 1 ? PackageCheck : index === 0 || (index === 1 && stage === 1) ? Truck : TrainFront;
                      return <li key={node} className={Icon === Truck ? 'central-corridor__stage--road' : undefined}>
                        <Icon size={22} aria-hidden="true" /><span>{node}</span>
                        {stage < labels.length - 1 && <ArrowRight className="central-corridor__arrow" size={18} aria-hidden="true" />}
                      </li>;
                    })}
                  </ol>
                </div>
                {!isRussia && !isEurope && <p>{decisions[index]}</p>}
              </article>
            );
          })}
        </div>
      </>}
      {!isRussia && !isEurope && <div className="central-corridor__notes">
        <p>{rail}</p>
        <p>{tir}</p>
      </div>}
    </section>
  );
}
