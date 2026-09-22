import { useEffect, useRef, useState } from 'react';
import './service-motion.css';
import { useLanguage } from '../contexts/LanguageContext';
import type { Language } from '../i18n/translations';

const motionCopy: Record<Language, {
  inspectionAlt: string; packingAlt: string; inspectionTrack: string; packingTrack: string; inspectionCaption: string; packingCaption: string;
  revealAria: string; revealAlt: string; revealKicker: string; revealTitle: string; revealBody: string; revealLink: string;
  galleryAria: string; showroom: string; factory: string; previous: string; next: string; galleryNote: string;
}> = {
  en: { inspectionAlt: 'DDNZ field photograph of speaker accessories and protective packaging', packingAlt: 'Speaker parts carton labelled with model, quantity, dimensions and carton number', inspectionTrack: 'FROM CHECK TO RESOLUTION', packingTrack: 'FROM PACKING TO CAPACITY', inspectionCaption: 'Field photo: audio packaging check. The phone-case incident is described alongside.', packingCaption: 'DDNZ field photo · Speaker component identification', revealAria: 'DDNZ export operations', revealAlt: 'DDNZ export loading operations', revealKicker: 'ON THE GROUND · CHINA TO YOUR MARKET', revealTitle: 'Many orders. One coordinated shipment.', revealBody: 'Product sourcing, packing and export — connected by one team.', revealLink: 'See how five buyers shared one container', galleryAria: 'DDNZ field photo gallery', showroom: 'Supplier showroom · Product discussions', factory: 'Factory visit · Kitchen equipment production', previous: 'Previous field photograph', next: 'Next field photograph', galleryNote: 'DDNZ field photography · Supplier and factory visits' },
  zh: { inspectionAlt: 'DDNZ 音响配件与保护包装检查现场', packingAlt: '标注型号、数量、尺寸与箱号的音响部件纸箱', inspectionTrack: '从检查到解决', packingTrack: '从包装到装载容量', inspectionCaption: '现场照片：音响包装检查；手机壳异常案例见旁文。', packingCaption: 'DDNZ 现场照片 · 音响部件标识', revealAria: 'DDNZ 出口操作', revealAlt: 'DDNZ 出口装载现场', revealKicker: '中国现场 · 通往目标市场', revealTitle: '多笔订单，一次协同出运。', revealBody: '产品采购、包装与出口，由一支团队衔接。', revealLink: '查看五位买家如何拼一柜', galleryAria: 'DDNZ 现场照片图库', showroom: '供应商展厅 · 产品沟通', factory: '工厂走访 · 商用厨房设备生产', previous: '上一张现场照片', next: '下一张现场照片', galleryNote: 'DDNZ 现场照片 · 供应商与工厂走访' },
  ru: { inspectionAlt: 'Фото DDNZ: аксессуары и защитная упаковка', packingAlt: 'Коробка деталей с моделью, количеством, размерами и номером', inspectionTrack: 'ОТ ПРОВЕРКИ К РЕШЕНИЮ', packingTrack: 'ОТ УПАКОВКИ К ВМЕСТИМОСТИ', inspectionCaption: 'Фото: проверка упаковки аудиотовара; рядом описан случай с чехлами.', packingCaption: 'Фото DDNZ · Маркировка компонентов', revealAria: 'Экспортные операции DDNZ', revealAlt: 'Экспортная погрузка DDNZ', revealKicker: 'НА МЕСТЕ · ИЗ КИТАЯ НА ВАШ РЫНОК', revealTitle: 'Много заказов. Одна согласованная отправка.', revealBody: 'Закупка, упаковка и экспорт соединены одной командой.', revealLink: 'Как пять покупателей разделили контейнер', galleryAria: 'Галерея DDNZ', showroom: 'Шоурум поставщика · Обсуждение товара', factory: 'Визит на фабрику · Производство кухонного оборудования', previous: 'Предыдущее фото', next: 'Следующее фото', galleryNote: 'Фото DDNZ · Визиты к поставщикам и на фабрики' },
  fr: { inspectionAlt: 'Photo DDNZ des accessoires et emballages de protection', packingAlt: 'Carton de composants marqué avec modèle, quantité et dimensions', inspectionTrack: 'DU CONTRÔLE À LA RÉSOLUTION', packingTrack: 'DE L’EMBALLAGE À LA CAPACITÉ', inspectionCaption: 'Photo terrain : contrôle d’emballage audio ; le cas des coques est décrit à côté.', packingCaption: 'Photo DDNZ · Identification des composants', revealAria: 'Opérations export DDNZ', revealAlt: 'Chargement export DDNZ', revealKicker: 'SUR LE TERRAIN · DE LA CHINE À VOTRE MARCHÉ', revealTitle: 'Plusieurs commandes. Un envoi coordonné.', revealBody: 'Sourcing, emballage et export reliés par une seule équipe.', revealLink: 'Voir comment cinq acheteurs ont partagé un conteneur', galleryAria: 'Galerie terrain DDNZ', showroom: 'Showroom fournisseur · Discussion produit', factory: 'Visite usine · Production de matériel de cuisine', previous: 'Photo précédente', next: 'Photo suivante', galleryNote: 'Photos DDNZ · Visites fournisseurs et usines' },
  es: { inspectionAlt: 'Foto DDNZ de accesorios y embalaje protector', packingAlt: 'Caja de componentes con modelo, cantidad, medidas y número', inspectionTrack: 'DEL CONTROL A LA SOLUCIÓN', packingTrack: 'DEL EMBALAJE A LA CAPACIDAD', inspectionCaption: 'Foto de campo: revisión de embalaje; el caso de fundas se describe al lado.', packingCaption: 'Foto DDNZ · Identificación de componentes', revealAria: 'Operaciones de exportación DDNZ', revealAlt: 'Carga de exportación DDNZ', revealKicker: 'EN CAMPO · DE CHINA A SU MERCADO', revealTitle: 'Varios pedidos. Un envío coordinado.', revealBody: 'Compra, embalaje y exportación conectados por un equipo.', revealLink: 'Ver cómo cinco compradores compartieron un contenedor', galleryAria: 'Galería de campo DDNZ', showroom: 'Showroom del proveedor · Conversación de producto', factory: 'Visita a fábrica · Producción de equipos de cocina', previous: 'Foto anterior', next: 'Foto siguiente', galleryNote: 'Fotografía DDNZ · Visitas a proveedores y fábricas' },
  ar: { inspectionAlt: 'صورة DDNZ لإكسسوارات الصوت والتعبئة الواقية', packingAlt: 'كرتون أجزاء موضح عليه الموديل والكمية والأبعاد', inspectionTrack: 'من الفحص إلى الحل', packingTrack: 'من التعبئة إلى السعة', inspectionCaption: 'صورة ميدانية: فحص تعبئة الصوتيات؛ حالة أغطية الهواتف موضحة بجانبها.', packingCaption: 'صورة DDNZ · تعريف مكونات الصوت', revealAria: 'عمليات تصدير DDNZ', revealAlt: 'تحميل الصادرات لدى DDNZ', revealKicker: 'في الميدان · من الصين إلى سوقك', revealTitle: 'طلبات متعددة. شحنة واحدة منسقة.', revealBody: 'التوريد والتعبئة والتصدير متصلة بفريق واحد.', revealLink: 'كيف تقاسم خمسة مشترين حاوية واحدة', galleryAria: 'معرض صور DDNZ الميدانية', showroom: 'صالة المورد · مناقشة المنتج', factory: 'زيارة المصنع · إنتاج معدات المطابخ', previous: 'الصورة السابقة', next: 'الصورة التالية', galleryNote: 'صور DDNZ · زيارات الموردين والمصانع' },
  pt: { inspectionAlt: 'Foto DDNZ de acessórios e embalagem protetora', packingAlt: 'Caixa de componentes com modelo, quantidade e medidas', inspectionTrack: 'DA VERIFICAÇÃO À SOLUÇÃO', packingTrack: 'DA EMBALAGEM À CAPACIDADE', inspectionCaption: 'Foto de campo: verificação de embalagem; o caso de capas aparece ao lado.', packingCaption: 'Foto DDNZ · Identificação de componentes', revealAria: 'Operações de exportação DDNZ', revealAlt: 'Carregamento de exportação DDNZ', revealKicker: 'NO LOCAL · DA CHINA AO SEU MERCADO', revealTitle: 'Vários pedidos. Um embarque coordenado.', revealBody: 'Sourcing, embalagem e exportação conectados por uma equipe.', revealLink: 'Veja como cinco compradores dividiram um contêiner', galleryAria: 'Galeria de campo DDNZ', showroom: 'Showroom do fornecedor · Discussão de produto', factory: 'Visita à fábrica · Produção de equipamentos de cozinha', previous: 'Foto anterior', next: 'Próxima foto', galleryNote: 'Fotos DDNZ · Visitas a fornecedores e fábricas' },
  tr: { inspectionAlt: 'DDNZ ses aksesuarı ve koruyucu ambalaj saha fotoğrafı', packingAlt: 'Model, miktar, ölçü ve koli numarası etiketli parça kolisi', inspectionTrack: 'KONTROLDEN ÇÖZÜME', packingTrack: 'AMBALAJDAN KAPASİTEYE', inspectionCaption: 'Saha fotoğrafı: ses ürünü ambalaj kontrolü; telefon kılıfı örneği yanda açıklanır.', packingCaption: 'DDNZ saha fotoğrafı · Parça tanımlama', revealAria: 'DDNZ ihracat operasyonları', revealAlt: 'DDNZ ihracat yüklemesi', revealKicker: 'SAHADA · ÇİN’DEN PAZARINIZA', revealTitle: 'Birçok sipariş. Tek koordineli sevkiyat.', revealBody: 'Ürün tedariki, ambalaj ve ihracat tek ekiple bağlı.', revealLink: 'Beş alıcının bir konteyneri nasıl paylaştığını görün', galleryAria: 'DDNZ saha fotoğrafı galerisi', showroom: 'Tedarikçi showroomu · Ürün görüşmesi', factory: 'Fabrika ziyareti · Mutfak ekipmanı üretimi', previous: 'Önceki saha fotoğrafı', next: 'Sonraki saha fotoğrafı', galleryNote: 'DDNZ saha fotoğrafları · Tedarikçi ve fabrika ziyaretleri' },
};

/** One passive scroll listener per mounted story; no scroll capture or autoplay. */
export function FieldStory({ steps, inspection }: { steps: string[][]; inspection: boolean }) {
  const { language } = useLanguage();
  const t = motionCopy[language];
  const root = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  useEffect(() => {
    const el = root.current;
    if (!el || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const nodes = [...el.querySelectorAll<HTMLElement>('.fm-step')];
      const target = innerHeight * .62;
      let nearest = 0, distance = Infinity;
      nodes.forEach((node, i) => { const r = node.getBoundingClientRect(); const d = Math.abs(r.top + r.height / 2 - target); if (d < distance) { distance = d; nearest = i; } });
      setActive(nearest);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    update(); window.addEventListener('scroll', schedule, { passive: true }); window.addEventListener('resize', schedule);
    return () => { cancelAnimationFrame(frame); window.removeEventListener('scroll', schedule); window.removeEventListener('resize', schedule); };
  }, [steps]);
  return <div className="fm-story" ref={root}>
    <figure className="fm-sticky">
      <div className="fm-photo">
        <img loading="lazy" src={inspection ? '/media/process/packaging-inspection.webp' : '/media/process/speaker-parts-carton.png'} alt={inspection ? t.inspectionAlt : t.packingAlt} />
        <div className="fm-progress" aria-hidden="true"><i style={{transform:`scaleX(${(active + 1) / steps.length})`}} /></div>
        <div className="fm-caption"><small>{inspection ? t.inspectionTrack : t.packingTrack}</small><strong>{steps[active][0]}</strong><span>0{active + 1} / 0{steps.length}</span></div>
      </div>
      <figcaption>{inspection ? t.inspectionCaption : t.packingCaption}</figcaption>
    </figure>
    <ol>{steps.map(([title, body], i) => <li className={`fm-step ${active === i ? 'fm-current' : ''}`} key={title}><span>0{i + 1}</span><h3>{title}</h3><p>{body}</p></li>)}</ol>
  </div>;
}

export function FieldReveal() {
  const { language } = useLanguage();
  const t = motionCopy[language];
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = root.current;
    if (!el || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let frame = 0;
    const update = () => {
      frame = 0; const r = el.getBoundingClientRect();
      const p = Math.max(0, Math.min(1, (innerHeight * .8 - r.top) / (innerHeight * .68)));
      el.style.setProperty('--fm-inset', `${(1 - p) * 19}%`);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    update(); window.addEventListener('scroll', schedule, { passive: true }); window.addEventListener('resize', schedule);
    return () => { cancelAnimationFrame(frame); window.removeEventListener('scroll', schedule); window.removeEventListener('resize', schedule); };
  }, []);
  return <section ref={root} className="fm-reveal" aria-label={t.revealAria}>
    <figure><img src="/media/process/export-loading-poster.webp" alt={t.revealAlt} loading="lazy" /><figcaption><small>{t.revealKicker}</small><h2>{t.revealTitle}</h2><p>{t.revealBody}</p><a href="#retail-case">{t.revealLink} ↗</a></figcaption></figure>
  </section>;
}
export function FieldGallery() {
  const { language } = useLanguage();
  const t = motionCopy[language];
  const photos = [
    ['/media/process/supplier-visit-speaker.webp', t.showroom],
    ['/media/process/kitchen-production-poster.webp', t.factory],
  ];
  const [active, setActive] = useState(0);
  const move = (delta: number) => setActive(i => (i + delta + photos.length) % photos.length);
  return <div className="fm-gallery" aria-label={t.galleryAria}>
    <div className="fm-deck">{photos.map(([src, caption], i) => {
      const slot = (i - active + photos.length) % photos.length;
      return <figure className={`fm-card fm-slot-${slot}`} key={src} aria-hidden={slot !== 0}>
        <img src={src} alt={caption} loading={i === 0 ? 'eager' : 'lazy'} /><figcaption>{caption}</figcaption>
      </figure>;
    })}</div>
    <div className="fm-gallery-controls"><button type="button" onClick={() => move(-1)} aria-label={t.previous}>←</button><span aria-live="polite">{active + 1} / {photos.length}</span><button type="button" onClick={() => move(1)} aria-label={t.next}>→</button></div>
    <p className="fm-gallery-note">{t.galleryNote}</p>
  </div>;
}
