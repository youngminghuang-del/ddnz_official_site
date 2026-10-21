import {useEffect,useRef,useState} from 'react';
import {buildQuoteHref} from '../../lib/quoteLinks';
import catalogue from './catalogue.json';
import type {Language} from '../../i18n/translations';
type Product=Pick<typeof catalogue[number],'id'|'code'|'title'|'category'|'label'|'specs'|'gallery'|'enTitle'|'enSpecs'>;
export function CatalogueCard({product:p,zh,source='electric_mobility_catalogue',language,ui,note}:{product:Product & {enLabel?:string};zh:boolean;source?:string;language?:Language;ui?:string[];note?:string}){
 const text=(index:number,en:string,cn:string)=>ui?.[index]||(zh?cn:en);
 const [index,setIndex]=useState(0),[opened,setOpened]=useState(false),[zoom,setZoom]=useState(false);
 const dialog=useRef<HTMLDialogElement>(null),g=p.gallery[index],title=zh?p.title:p.enTitle;
 const name=(item:typeof g)=>zh?item.title:item.enTitle;
 const step=(direction:number)=>{setIndex(i=>(i+direction+p.gallery.length)%p.gallery.length);setZoom(false);};
 useEffect(()=>{if(!opened)return;const previous=document.body.style.overflow;document.body.style.overflow='hidden';return()=>{document.body.style.overflow=previous;};},[opened]);
 const open=()=>{setZoom(false);dialog.current?.showModal();setOpened(true);};
 const quote=buildQuoteHref({intent:'Product Sourcing',language:language||(zh?'zh':'en'),source,industry:'Other',subcategory:`${p.code} ${p.enTitle}`});
 return <article className="mobility-card" id={p.code.toLowerCase()}>
  <figure><button className="mobility-image" onClick={open} aria-label={`${text(0,'Enlarge','放大查看')} ${p.code}`}><img src={g.web} alt={`${title} · ${name(g)}`} width="1400" height="1400" loading="lazy"/></button><figcaption><span>{name(g)}</span><span>{index+1} / {p.gallery.length}</span></figcaption><div className="mobility-thumbs" aria-label={`${title} ${text(1,'image selection','图片选择')}`}>{p.gallery.map((item,n)=><button key={item.web} type="button" aria-pressed={index===n} aria-label={`${p.code}: ${name(item)}`} onClick={()=>setIndex(n)}><img src={item.thumb} alt="" width="64" height="64" loading="lazy"/></button>)}</div></figure>
  <div className="mobility-card-body"><p className="mobility-code">{p.code} · {zh?p.label:(p.enLabel||(p.category==='adult'?'Adult electric scooter':p.category==='kids'?'Children’s electric scooter':'Self-balancing scooter'))}</p><h2>{title}</h2><dl>{(zh?p.specs:p.enSpecs).map(([label,value])=><div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>{note&&<p className="mt-5 leading-7 text-slate-600">{note}</p>}<div className="mobility-card-actions"><a className="mobility-primary" href={quote}>{text(2,'Request a wholesale quote','询问此款批发报价')} ↗</a><button onClick={open}>{text(3,'View all images','查看全部图片')} · {p.gallery.length}</button></div></div>
  <dialog className={`mobility-dialog ${zoom?'is-zoomed':''}`} ref={dialog} onClose={()=>setOpened(false)} onClick={e=>{if(e.target===dialog.current)dialog.current.close();}} onKeyDown={e=>{if(e.key==='ArrowRight'){e.preventDefault();step(1);}if(e.key==='ArrowLeft'){e.preventDefault();step(-1);}}} aria-label={text(4,'Product image gallery','产品图片浏览')}><div className="mobility-dialog-head"><h3>{p.code} · {name(g)}</h3><button onClick={()=>dialog.current?.close()} aria-label={text(5,'Close gallery','关闭图片')}>×</button></div>{g.kind==='结构示意'&&<p>{text(10,'Component illustration','结构示意')}</p>}<img className="mobility-dialog-image" src={opened?g.web:undefined} alt={`${title} · ${name(g)}`}/><div className="mobility-dialog-tools"><button onClick={()=>step(-1)} aria-label={text(6,'Previous image','上一张')}>←</button><span aria-live="polite">{index+1} / {p.gallery.length}</span><button onClick={()=>step(1)} aria-label={text(7,'Next image','下一张')}>→</button><button aria-pressed={zoom} onClick={()=>setZoom(v=>!v)}>{zoom?text(8,'Fit screen','适合屏幕'):text(9,'Zoom in','放大细看')}</button></div></dialog>
 </article>;
}
