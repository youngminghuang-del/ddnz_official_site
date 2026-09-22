import { useRef, useState } from 'react';
import { Maximize2, X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export default function ServiceVisual({inspection}:{inspection:boolean}) {
  const { language } = useLanguage();
  const zh = language === 'zh';
  const dialog=useRef<HTMLDialogElement>(null);
  const [active,setActive]=useState(0);
  const image=inspection ? '/media/process/device-spec-check.webp' : '/images/operations/container-loading-forklift-anonymized.jpg';
  const items=inspection ? [
    ['01','Inspect','Compare the agreed product, quantity, appearance and packing.'],
    ['02','Hold','Separate affected goods and establish the issue and quantity.'],
    ['03','Resolve','Agree a practical remedy and schedule with the customer.'],
    ['04','Release','Confirm the affected goods are ready before moving forward.'],
  ] : [
    ['01','Identify','Keep the model, part name and batch visible on each carton.'],
    ['02','Count','Record the component quantity so the receiving team can reconcile the parts.'],
    ['03','Plan','Use carton dimensions and weights to organize the loading plan.'],
  ];
  const localizedItems = zh ? (inspection ? [['01','检查','核对约定产品、数量、外观与包装。'],['02','暂缓','隔离受影响货物，确认问题和数量。'],['03','处理','与客户确认解决方案和时间安排。'],['04','放行','确认受影响货物处理完成，再进入下一环节。']] : [['01','核标','核对纸箱上的型号、部件名称与批次。'],['02','点数','记录部件数量，便于收货方逐项核对。'],['03','配载','根据纸箱尺寸与重量规划装载。']]) : items;
  return <div className="sv-wrap">
    <div className="sv-photo"><img src={image} alt={zh ? (inspection ? '电子设备拆机检查现场' : '叉车与包装货物装柜现场') : inspection ? 'Hands-on inspection of an opened electronic device' : 'Forklift and packed cargo during container loading'} />
      <span className="sv-label">{zh ? (inspection ? '产品检查现场' : '从订单确认到出口交接') : inspection?'HANDS-ON PRODUCT CHECKS':'FROM APPROVED ORDERS TO EXPORT'}</span>
      <button className="sv-zoom" onClick={()=>dialog.current?.showModal()} aria-label={zh ? '放大现场照片' : 'Enlarge field photograph'}><Maximize2 size={17}/></button>
    </div>
    <div className="sv-controls" role="group" aria-label={zh ? '查看操作环节' : 'Explore the workflow'}>{localizedItems.map(([number,title],i)=><button key={title} aria-pressed={active===i} onClick={()=>setActive(i)}><small>{number}</small>{title}</button>)}</div>
    <div className="sv-detail" aria-live="polite" key={active}><strong>{localizedItems[active][1]}</strong><p>{localizedItems[active][2]}</p></div>
    <p className="sv-caption">{zh ? (inspection ? 'DDNZ 现场记录 · 电子设备检查' : 'DDNZ 现场记录 · 集装箱装载') : inspection?'DDNZ field photo · Electronic device inspection':'DDNZ field photo · Container loading'}</p>
    <dialog className="sv-dialog" ref={dialog} onClick={e=>{if(e.target===e.currentTarget)dialog.current?.close();}}><button autoFocus onClick={()=>dialog.current?.close()} aria-label={zh ? '关闭大图' : 'Close enlarged photograph'}><X/></button><img src={image} alt={zh ? 'DDNZ 现场照片大图' : 'Enlarged DDNZ field photograph'}/></dialog>
  </div>;
}
