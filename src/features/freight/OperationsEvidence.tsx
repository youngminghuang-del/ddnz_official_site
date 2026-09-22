import { useEffect } from 'react';
import { freightPrefix, words, type FreightLocale } from './regions';
import './freight.css';

export default function OperationsEvidence({ locale = 'en', receiving = false }: { locale?: FreightLocale; receiving?: boolean }) {
  const sectionId = receiving ? 'receiving-record' : 'loading-proof-title';
  useEffect(() => {
    if (window.location.hash !== `#${sectionId}`) return;
    const frame = requestAnimationFrame(() => document.getElementById(sectionId)?.scrollIntoView({ block: 'start' }));
    return () => cancelAnimationFrame(frame);
  }, [sectionId]);
  const t = (zh: string, en: string, es: string) => words(zh, en, es)[locale];
  const steps = receiving ? [
    [t('对照到货清单', 'Match the receiving list', 'Comparar con la lista de recepción'), t('把供应商、订单、箱号与到货件数对应起来；差异单独列出，避免混在总数里。', 'Match supplier, order, carton marks and package counts. Record discrepancies separately.', 'Relacionar proveedor, pedido, marcas y bultos. Registrar las diferencias por separado.')],
    [t('区分收货与验货', 'Separate receiving from inspection', 'Distinguir recepción e inspección'), t('点数和核标不等于开箱验货。需要抽检、功能测试或重新包装时，应另外确认范围。', 'Counting and label checks are not an unpacking or functional inspection. Agree any extra inspection or repacking scope.', 'Contar y revisar etiquetas no equivale a inspeccionar el producto. Acordar aparte pruebas o reembalaje.')],
    [t('齐货后再确认交接', 'Confirm the handover after reconciliation', 'Confirmar la entrega tras conciliar'), t('汇总缺货、包装差异与待确认事项，明确哪些货本票走、哪些留待下一票。', 'Reconcile shortages, packing differences and open items; confirm which goods ship now or later.', 'Conciliar faltantes, diferencias de embalaje y pendientes; confirmar qué mercancía sale ahora o después.')],
  ] : [
    [t('先看包装，不只看立方数', 'Look beyond cubic metres', 'No mirar solo los metros cúbicos'), t('纸箱、袋装、托盘和木箱的可堆叠条件不同。询价时提供每件尺寸、毛重和包装照片，才能讨论装载安排。', 'Cartons, bags, pallets and crates have different stacking constraints. Share package dimensions, gross weights and packing photos.', 'Cajas, sacos, palés y cajones tienen distintas limitaciones. Compartir medidas, peso bruto y fotos del embalaje.')],
    [t('把装载方案与现场分开记录', 'Keep the plan and field record distinct', 'Separar el plan del registro real'), t('模拟图用于讨论摆放与装入数量；现场照片用于记录实际状态。输入数量或柜型不同，不能直接算成优化前后。', 'A loading simulation supports planning; photographs record the actual condition. Different inputs are not a before-and-after comparison.', 'La simulación ayuda a planificar; las fotos registran el estado real. Entradas distintas no son una comparación antes/después.')],
    [t('报价范围写清楚', 'Make the quotation scope explicit', 'Definir el alcance de la cotización'), t('提货、仓储、重包装、装柜、起运港和目的地费用逐项确认。到港报价与到门报价不能只比较一个总数。', 'Confirm pickup, storage, repacking, loading, origin and destination charges. Port and door quotes cover different scopes.', 'Confirmar recogida, almacenaje, reembalaje, carga y gastos en origen/destino. Puerto y domicilio tienen alcances diferentes.')],
  ];
  return <section className="freight-editorial freight-evidence" id={receiving ? 'receiving-record' : 'loading-proof-title'}>
    <div className="freight-wrap freight-section">
      <p className="freight-kicker">{t('中国端操作记录', 'China-origin operations', 'Operaciones en China')}</p>
      <h2 className="mt-4 mb-8">{receiving ? t('收货时，把箱号与数量对上。', 'Receiving starts with the carton marks.', 'La recepción empieza por las marcas de los bultos.') : t('一柜货，不只是装得下。', 'A shipment is more than the space it fills.', 'Un envío es más que el espacio que ocupa.')}</h2>
      <div className="freight-media">
        <figure>
          {receiving ? <video controls playsInline preload="none" poster="/media/freight-20260918/receiving-poster.jpg" muted className="mx-auto max-h-[580px] w-full rounded-xl bg-slate-950" aria-label={t('收货核标现场，无声视频', 'Receiving and label checks, silent video', 'Recepción y etiquetas, video sin sonido')} src="/media/freight-20260918/receiving-silent.mp4" /> : <img src="/media/freight-20260918/mixed-cargo-loading.jpg" alt={t('柜内纸箱、袋装货与托盘的混合装载现场', 'Mixed cartons, bags and pallets inside a container', 'Cajas, sacos y palés en un contenedor')} loading="lazy" decoding="async" />}
          <figcaption>{receiving ? t('收货现场 · 箱号与标签核对', 'Receiving · Carton marks and label checks', 'Recepción · Revisión de marcas y etiquetas') : t('拼柜现场 · 纸箱、袋装货与托盘', 'Mixed loading · Cartons, bags and pallets', 'Carga mixta · Cajas, sacos y palés')}</figcaption>
        </figure>
        <div>{steps.map(([title, body], i) => <article className="freight-check" key={title}><span>0{i + 1}</span><div><h3>{title}</h3><p>{body}</p></div></article>)}
          <div className="freight-links"><a href={`${freightPrefix(locale)}/${receiving ? 'services/sea-freight/' : 'sourcing-services/consolidation-export/'}`}>{receiving ? t('查看海运安排', 'Explore sea freight', 'Ver transporte marítimo') : t('查看集货与出口交接', 'Explore consolidation and handover', 'Ver consolidación y entrega')} →</a></div>
        </div>
      </div>
    </div>
  </section>;
}
