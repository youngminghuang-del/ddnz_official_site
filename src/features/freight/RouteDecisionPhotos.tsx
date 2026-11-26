const directory = '/images/freight/route-decision';
const commons = 'https://commons.wikimedia.org/wiki/File:';
const cc = 'https://creativecommons.org/licenses/';

type Photo = {
  file: string;
  width: number;
  height: number;
  alt: string;
  caption: string;
  source: string;
  author: string;
  license: string;
  licensePath: string;
};

const photos: Record<string, Photo[]> = {
  'zh:kyrgyzstan': [{
    file: 'erkeshtam-road', width: 960, height: 720,
    alt: '伊尔克什坦山口吉尔吉斯斯坦一侧的公路',
    caption: '伊尔克什坦山口吉方路段 · 2017 年',
    source: 'Erkeshtam_Pass_-_road_on_the_Kyrgyz_side.jpg',
    author: 'Radosław Botev / Fundacja Nomos', license: 'CC BY 3.0 PL', licensePath: 'by/3.0/pl/',
  }],
  'zh:tajikistan': [{
    file: 'tajik-freight-train', width: 960, height: 720,
    alt: '塔吉克斯坦铁路 TE33A-0113 机车牵引货运列车',
    caption: '塔吉克斯坦铁路货运列车 · 2014 年',
    source: 'TE33A-0113_with_freight_train.jpg',
    author: 'Serguei Bolachenko', license: 'CC BY-SA 3.0', licensePath: 'by-sa/3.0/',
  }],
  'es:chile': [
    {
      file: 'san-antonio-terminal', width: 704, height: 400,
      alt: 'Grúas y contenedores en la terminal de San Antonio, Chile',
      caption: 'San Antonio · Descarga de contenedores, 2012. Pida que la cotización identifique la terminal y el lugar de devolución del vacío.',
      source: 'Descarga_contenedores_san_antonio_terminal_internacional.jpg',
      author: 'Cristiangonzalo.m', license: 'CC BY-SA 3.0', licensePath: 'by-sa/3.0/',
    },
    {
      file: 'valparaiso-terminal', width: 960, height: 640,
      alt: 'Terminal de contenedores y bahía de Valparaíso, Chile',
      caption: 'Valparaíso · Terminal de contenedores, 2017. Confirme el retiro en puerto y el horario de recepción en Santiago.',
      source: 'J28_126_Valpara%C3%ADso%2C_Container-_und_Milit%C3%A4rhafen.jpg',
      author: 'Falk2', license: 'CC BY-SA 4.0', licensePath: 'by-sa/4.0/',
    },
  ],
};

export default function RouteDecisionPhotos({ country, locale }: { country: string; locale: string }) {
  if (locale === 'es' && country === 'argentina') {
    return <div className="freight-decision-photos freight-decision-photos--single">
      <figure>
        <img src={`${directory}/china-mixed-cargo-960.webp`}
          srcSet={`${directory}/china-mixed-cargo-480.webp 480w, ${directory}/china-mixed-cargo-960.webp 960w`}
          sizes="(max-width: 710px) calc(100vw - 36px), 672px"
          width="960" height="1109" loading="lazy" decoding="async"
          alt="Cajas y bultos de distintos tamaños durante la carga de un contenedor en China" />
        <figcaption className="freight-decision-photo-caption">
          <span>Carga mixta en China · Referencia de origen</span>
          <a className="freight-decision-photo-link" href="/es/services/lcl-shipping-from-china/#lcl-field-record">Ver operación</a>
        </figcaption>
      </figure>
    </div>;
  }

  const entries = photos[`${locale}:${country}`];
  if (!entries) return null;

  return <div className={`freight-decision-photos${entries.length === 1 ? ' freight-decision-photos--single' : ''}`}>
    {entries.map(({ file, width, height, alt, caption, source, author, license, licensePath }) => (
      <figure key={file}>
        <img src={`${directory}/${file}.webp`}
          srcSet={`${directory}/${file}-480.webp 480w, ${directory}/${file}.webp ${width}w`}
          sizes={locale === 'zh'
            ? '(max-width: 710px) calc(100vw - 36px), 672px'
            : '(max-width: 640px) calc(100vw - 36px), (max-width: 1200px) 45vw, 540px'}
          width={width} height={height} alt={alt} loading="lazy" decoding="async" />
        {locale === 'zh' ? (
          <figcaption className="freight-decision-photo-caption">
            <span>{caption}</span>
            <details className="freight-decision-photo-source">
              <summary>图片来源</summary>
              <div className="freight-decision-photo-credit">
                <a href={commons + source}>{author} · Wikimedia Commons</a> · <a href={cc + licensePath}>{license}</a> · 已缩放、裁切显示并转换为 WebP
              </div>
            </details>
          </figcaption>
        ) : (
          <figcaption>
            <p>{caption}</p>
            <p className="freight-decision-photo-credit">
              <a href={commons + source}>{author} · Wikimedia Commons</a> · <a href={cc + licensePath}>{license}</a> · Redimensionada, recortada en pantalla y convertida a WebP
            </p>
          </figcaption>
        )}
      </figure>
    ))}
  </div>;
}
