import { words, type FreightLocale } from './regions';

export default function LclMaterialPreview({ locale }: { locale: FreightLocale }) {
  if (!import.meta.env.DEV) return null;
  const t = (zh: string, en: string, es: string) => words(zh, en, es)[locale];
  return <section id="lcl-material-preview" className="mx-auto max-w-7xl px-6 py-16" data-material-slot="lcl-records">
    <p className="mb-4 text-sm font-semibold text-purple-800">{t('待补素材 · 仅本地预览', 'Material planning · local preview only', 'Material pendiente · solo vista local')}</p>
    <h2 className="text-3xl font-bold">{t('这几箱货，进仓后怎么处理？', 'What happens to these cartons after receiving?', '¿Qué pasa con estas cajas al recibirlas?')}</h2>
    <p className="mt-4 leading-8">{t('优先使用同一票真实 LCL 货物。验收前补充，不需要当地派送或签收单。', 'Use one actual LCL shipment where possible. Add material before acceptance; no delivery or signed receipt required.', 'Prioriza un envío LCL real. Añade material antes de la revisión; no se requiere entrega local ni recibo firmado.')}</p>
    <div className="mt-8 space-y-5">{[
      [t('01 / 数清：点数与唛头', '01 / Count and identify', '01 / Contar e identificar'), t('全景、箱号近景各 1 张，点数视频 10–20 秒；能对应同一批货。', 'One cargo overview, one carton-mark close-up and a 10–20 second counting clip from the same cargo.', 'Una vista general, un detalle de marcas y un video de conteo de 10–20 segundos de la misma carga.')],
      [t('02 / 量准：量尺与称重', '02 / Measure and weigh', '02 / Medir y pesar'), t('拍完整包装、量尺位置与秤上读数，附件数、外尺寸和毛重。', 'Show the complete package, measurement points and scale reading; provide count, outer dimensions and gross weight.', 'Muestra embalaje completo, puntos de medición y lectura de báscula; indica bultos, medidas exteriores y peso bruto.')],
      [t('03 / 保护：打托前后', '03 / Protect: before and after palletizing', '03 / Proteger: antes y después de paletizar'), t('同一批货打托前后各 1 张，附尺寸重量变化；没有打托就用实际包装处理，不摆拍。', 'One before/after photo with dimension and weight changes. If no pallet was used, show the actual packing work instead.', 'Una foto antes y después, con cambios de medidas y peso. Si no hubo palé, muestra el embalaje real.')],
    ].map(([title, body]) => <article key={title} className="border border-dashed border-purple-300 bg-purple-50 p-6"><h3 className="text-xl font-bold">{title}</h3><p className="mt-3 leading-7">{body}</p></article>)}</div>
  </section>;
}
