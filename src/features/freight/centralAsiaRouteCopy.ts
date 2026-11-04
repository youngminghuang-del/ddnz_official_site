import type { Language } from '../../i18n/translations';

type CorridorCopy = {
  label: string;
  schematic: string;
  photo: string;
  names: [string, string, string, string];
};

export const corridorCopy = {
  zh: {
    label: '陆运方案', schematic: '通道关系示意 · 不按比例 · 班次及卸货站逐票确认',
    photo: 'DDNZ 作业照片 · 乌兹别克斯坦公路货运装车',
    names: ['跨境卡车与 TIR', '中亚班列与铁公联运', '中俄铁路', '中欧班列'],
  },
  en: {
    label: 'Route planning', schematic: 'Schematic corridors · Not to scale · Confirm departures and unloading terminals per shipment',
    photo: 'DDNZ operations photo · Loading road freight for Uzbekistan',
    names: ['Cross-border trucking & TIR', 'Central Asia rail & road', 'China–Russia rail', 'China–Europe Railway Express'],
  },
  ru: {
    label: 'Планирование маршрута', schematic: 'Схема без масштаба · Рейс и станцию выгрузки уточняйте для каждой партии',
    photo: 'Фото DDNZ · Погрузка автогруза для Узбекистана',
    names: ['Автоперевозки и МДП (TIR)', 'Железная дорога и авто в Центральную Азию', 'Железная дорога Китай — Россия', 'Поезда Китай — Европа'],
  },
  es: {
    label: 'Planificación de rutas', schematic: 'Esquema sin escala · Confirme salida y terminal por envío',
    photo: 'Foto de DDNZ · Carga por carretera para Uzbekistán',
    names: ['Camión transfronterizo y TIR', 'Tren y camión a Asia Central', 'Tren China–Rusia', 'Tren China–Europa'],
  },
  fr: {
    label: 'Planification des itinéraires', schematic: 'Schéma hors échelle · Confirmer le départ et le terminal pour chaque envoi',
    photo: 'Photo DDNZ · Chargement routier pour l’Ouzbékistan',
    names: ['Route transfrontalière et TIR', 'Rail et route vers l’Asie centrale', 'Rail Chine–Russie', 'Trains Chine–Europe'],
  },
  ar: {
    label: 'تخطيط المسار', schematic: 'رسم توضيحي غير مقياسي · أكّد الرحلة ومحطة التفريغ لكل شحنة',
    photo: 'صورة عمليات DDNZ · تحميل شحنة برية إلى أوزبكستان',
    names: ['الشاحنات عبر الحدود ونظام TIR', 'السكك الحديدية والطرق إلى آسيا الوسطى', 'السكك الحديدية بين الصين وروسيا', 'قطارات الصين وأوروبا'],
  },
  pt: {
    label: 'Planejamento de rotas', schematic: 'Esquema sem escala · Confirme a partida e o terminal de descarga por remessa',
    photo: 'Foto da DDNZ · Carregamento rodoviário para o Uzbequistão',
    names: ['Caminhões transfronteiriços e TIR', 'Ferrovia e rodovia para a Ásia Central', 'Ferrovia China–Rússia', 'Trens China–Europa'],
  },
  tr: {
    label: 'Güzergâh planlama', schematic: 'Ölçeksiz şema · Her sevkiyat için kalkışı ve boşaltma terminalini teyit edin',
    photo: 'DDNZ operasyon fotoğrafı · Özbekistan için kara yolu yüklemesi',
    names: ['Sınır ötesi kamyon ve TIR', 'Orta Asya’ya demir yolu ve kara yolu', 'Çin–Rusya demir yolu', 'Çin–Avrupa trenleri'],
  },
} satisfies Record<Language, CorridorCopy>;

export const corridorNodes = {
  zh: [['乌鲁木齐', '哈萨克斯坦'], ['石家庄', '喀什', '中亚目的地'], ['中国', '铁路口岸', '俄罗斯'], ['中国', '欧亚铁路网', '欧洲']],
  ru: [['Урумчи', 'Казахстан'], ['Шицзячжуан', 'Кашгар', 'Центральная Азия'], ['Китай', 'Ж/д переход', 'Россия'], ['Китай', 'Сеть Евразии', 'Европа']],
  en: [['Urumqi', 'Kazakhstan'], ['Shijiazhuang', 'Kashgar', 'Central Asia'], ['China', 'Rail border', 'Russia'], ['China', 'Eurasian rail', 'Europe']],
};

