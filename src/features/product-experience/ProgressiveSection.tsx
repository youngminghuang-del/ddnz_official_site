import {useEffect,useRef,type ReactNode} from 'react';
import copy from './copy.json';
export const experienceCopy=(locale='en')=>copy[locale==='zh-cn'?'zh':locale]||copy.en;
/** Content stays in server HTML. Hash links and keyboard navigation reveal its ancestor disclosures. */
export default function ProgressiveSection({title,children,locale='en',openWhen}:{title?:string;children?:ReactNode;locale?:string;openWhen?:boolean}){
 const ref=useRef<HTMLDetailsElement>(null);
 useEffect(()=>{function reveal(){let target:Element|null=null;try{target=document.getElementById(decodeURIComponent(location.hash.slice(1)));}catch{}if(!target)return;let parent=target.closest('details'),changed=false;while(parent){if(!parent.open){parent.open=true;changed=true;}parent=parent.parentElement?.closest('details')||null;}if(changed)requestAnimationFrame(()=>target?.scrollIntoView({block:'start'}));}function click(e:MouseEvent){const anchor=(e.target as Element)?.closest?.('a[href^="#"]');if(anchor?.getAttribute('href')===location.hash)reveal();}reveal();window.addEventListener('hashchange',reveal);document.addEventListener('click',click);return()=>{window.removeEventListener('hashchange',reveal);document.removeEventListener('click',click);};},[]);
 return <details open={openWhen||undefined} ref={ref} className="experience-disclosure"><summary>{title||experienceCopy(locale).more}<span aria-hidden="true"> +</span></summary>{children}</details>;
}

export function revealDisclosureTarget(id:string){const target=document.getElementById(id);let parent=target?.closest('details');while(parent){parent.open=true;parent=parent.parentElement?.closest('details');}return target;}
