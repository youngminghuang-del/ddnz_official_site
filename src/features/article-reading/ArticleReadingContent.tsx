import {useEffect,useRef} from 'react';
import {ArrowLeft,ArrowRight,Calendar,Clock3,ChevronDown} from 'lucide-react';
import type {BlogPost,ArticleTocItem} from '../../types/content';
import {articleLocalePrefix,canonicalSitePath} from '../../lib/notionArticleRouting';
import {articleUi,articleLabel,readingDate,readingLocale,readingLabels,articleImageLabels} from './model';

type Props={post:BlogPost;language:string;articleHtml:{__html:string};primaryCta:{href:string;label:string};discovery?:{heading?:string;links:{href:string;label:string}[]};onCta?:()=>void;onDiscovery?:(href:string)=>void};
function Contents({items,label}:{items:ArticleTocItem[];label:string}){
 return <nav className="article-reading-toc" aria-label={label}><p>{label}</p><ol>{items.map((item,i)=><li key={item.id}><a href={'#'+item.id}><span aria-hidden="true">{String(i+1).padStart(2,'0')}</span><span>{item.text}</span></a></li>)}</ol></nav>;
}
export default function ArticleReadingContent({post,language,articleHtml,primaryCta,discovery,onCta,onDiscovery}:Props){
 const locale=readingLocale(language),ui=articleUi[locale as keyof typeof articleUi]||articleUi.en,root=useRef<HTMLDivElement>(null);
 const viewer=useRef<HTMLDialogElement>(null),viewerImage=useRef<HTMLImageElement>(null),viewerCaption=useRef<HTMLParagraphElement>(null),lastFocus=useRef<HTMLElement|null>(null),imageLabels=articleImageLabels[locale]||articleImageLabels.en;
 const prefix=locale==='id'?'':articleLocalePrefix(locale),toc=post.toc?.filter(t=>t.level===2)||[],items=toc.length?toc:(post.toc||[]),showToc=items.length>=3;
 const updated=(post.lastEdited||post.lastVerified||post.date).slice(0,10),reviewer=post.reviewMode==='human'&&post.reviewer?.length?post.reviewer.join(', '):'';
 useEffect(()=>{
  const node=root.current;if(!node)return;
  const headings=[...node.querySelectorAll<HTMLElement>('.article-reading-body h2[id]')],links=[...node.querySelectorAll<HTMLAnchorElement>('.article-reading-toc a')];let frame=0;
  const update=()=>{frame=0;let current=headings[0]?.id;for(const h of headings){if(h.getBoundingClientRect().top<=160)current=h.id;else break;}for(const a of links){if(a.hash==='#'+current)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');}};
  const scroll=()=>{if(!frame)frame=requestAnimationFrame(update);};
  window.addEventListener('scroll',scroll,{passive:true});update();
  if(window.location.hash){try{const id=decodeURIComponent(window.location.hash.slice(1)),target=headings.find(h=>h.id===id)||node.querySelector<HTMLElement>('[id="'+CSS.escape(id)+'"]');target?.scrollIntoView({block:'start'});}catch{/* Invalid fragments leave the article readable. */}}
  return()=>{window.removeEventListener('scroll',scroll);if(frame)cancelAnimationFrame(frame);};
 },[post.id,language]);
 useEffect(()=>{
  const node=root.current,dialog=viewer.current;if(!node||!dialog)return;
  const isImageLink=(a:HTMLAnchorElement,img:HTMLImageElement)=>{try{const url=new URL(a.href,window.location.href);return url.origin===window.location.origin&&url.pathname===new URL(img.src,window.location.href).pathname;}catch{return false;}};
  const images=[...node.querySelectorAll<HTMLImageElement>('.article-reading-body img')].filter(img=>!img.closest('button')&&(!img.closest('a')||isImageLink(img.closest('a')!,img)));
  const saved=images.map(img=>{const trigger=img.closest('a')||img;return {img,trigger,attrs:['tabindex','role','aria-label','data-reader-image'].map(a=>[a,trigger.getAttribute(a)] as const)};});
  for(const {img,trigger} of saved){if(trigger===img){trigger.setAttribute('tabindex','0');trigger.setAttribute('role','button');}trigger.setAttribute('aria-label',imageLabels[0]+(img.alt?' · '+img.alt:''));trigger.setAttribute('data-reader-image','');}
  const open=(img:HTMLImageElement)=>{lastFocus.current=node.ownerDocument.activeElement as HTMLElement;if(viewerImage.current){viewerImage.current.src=img.currentSrc||img.src;viewerImage.current.alt=img.alt||post.title;}if(viewerCaption.current)viewerCaption.current.textContent=img.closest('figure')?.querySelector('figcaption')?.textContent||img.alt||post.title;dialog.showModal();};
  const click=(e:MouseEvent)=>{const target=e.target as HTMLElement;if(target===dialog||target.closest('[data-reader-close]')){dialog.close();return;}const trigger=target.closest<HTMLElement>('[data-reader-image]');if(trigger){if(e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;e.preventDefault();const img=trigger.tagName==='IMG'?trigger as HTMLImageElement:trigger.querySelector('img');if(img)open(img);}};
  const key=(e:KeyboardEvent)=>{const target=e.target as HTMLElement;if(target.tagName==='IMG'&&target.hasAttribute('data-reader-image')&&['Enter',' '].includes(e.key)){e.preventDefault();open(target as HTMLImageElement);}};
  const close=()=>{if(lastFocus.current?.isConnected)lastFocus.current.focus();};
  node.addEventListener('click',click);node.addEventListener('keydown',key);dialog.addEventListener('close',close);
  return()=>{node.removeEventListener('click',click);node.removeEventListener('keydown',key);dialog.removeEventListener('close',close);for(const {trigger,attrs} of saved)for(const [a,v] of attrs){if(v===null)trigger.removeAttribute(a);else trigger.setAttribute(a,v);}};
 },[post.id,language]);
 return <div className="article-reading ddnz-home" ref={root} lang={locale==='zh'?'zh-CN':locale} dir={locale==='ar'?'rtl':'ltr'}>
  <header className="article-reading-hero"><div className="article-reading-wrap">
   <nav className="article-reading-breadcrumb" aria-label={ui.home+' / '+ui.insights}><a href={canonicalSitePath(prefix||'/')}>{ui.home}</a><span aria-hidden="true">/</span><a href={canonicalSitePath(prefix+'/insights')}>{ui.insights}</a></nav>
   <div className={'article-reading-hero-grid'+(!post.thumbnailUrl?' article-reading-no-cover':'')}><div className="article-reading-heading">
    <p className="article-reading-kicker"><span>{articleLabel(post.contentType||post.category,locale)}</span>{post.audienceMarket&&<span>{articleLabel(post.audienceMarket,locale)}</span>}</p>
    <h1 id="article-title">{post.title}</h1>{post.summary&&<p className="article-reading-summary">{post.summary}</p>}
    <div className="article-reading-meta"><span><Calendar aria-hidden="true"/>{ui.published} <time dateTime={post.date}>{readingDate(post.date,locale)}</time></span><span><Clock3 aria-hidden="true"/>{post.readMinutes||5} {ui.minRead}</span>{updated!==post.date&&<span>{ui.updated} <time dateTime={updated}>{readingDate(updated,locale)}</time></span>}</div>
    <p className="article-reading-byline"><strong>DDNZ GLOBAL</strong>{reviewer&&<span>{ui.reviewedBy} <bdi>{reviewer}</bdi></span>}</p>
   </div>{post.thumbnailUrl&&<figure className="article-reading-cover"><button type="button" className="article-reading-cover-button" data-reader-image aria-label={imageLabels[0]}><img src={post.thumbnailUrl} alt={post.title} width="1000" height="800" fetchPriority="high" referrerPolicy="no-referrer"/><span>{imageLabels[0]} ↗</span></button></figure>}</div>
  </div></header>
  <main id="main-content" className={'article-reading-layout article-reading-wrap'+(!showToc?' article-reading-without-toc':'')}>
   {showToc&&<aside className="article-reading-sidebar"><div className="article-reading-sticky"><Contents items={items} label={ui.onThisPage}/><a className="article-reading-top" href="#article-title">{(readingLabels[locale]||readingLabels.en)[16]} ↑</a></div></aside>}
   <article className="article-reading-main">
    {showToc&&<details className="article-reading-mobile-toc"><summary>{ui.onThisPage}<ChevronDown aria-hidden="true"/></summary><Contents items={items} label={ui.onThisPage}/></details>}
    <div className="article-reading-body blog-content post-content" dangerouslySetInnerHTML={articleHtml}/>
    {discovery&&<section className="article-reading-discovery" lang="en" aria-label="Related buying guides"><h2>{discovery.heading||'Compare equipment for your next order'}</h2><div>{discovery.links.map(link=><a key={link.href} href={link.href} onClick={()=>onDiscovery?.(link.href)}>{link.label}<ArrowRight aria-hidden="true"/></a>)}</div></section>}
    <section id="article-primary-cta" className="article-reading-cta"><p className="article-reading-kicker">{ui.nextStep}</p><h2>{ui.ctaTitle}</h2><p>{ui.ctaBody}</p><a className="article-reading-action" href={primaryCta.href} rel={primaryCta.href.includes('/get-a-quote')?undefined:'nofollow'} data-analytics-tracked="true" onClick={onCta}>{primaryCta.label}<ArrowRight aria-hidden="true"/></a></section>
    <a className="article-reading-back" href={canonicalSitePath(prefix+'/insights')}><ArrowLeft aria-hidden="true"/>{ui.backInsights}</a>
   </article>
  </main>
  <dialog className="article-reading-viewer" ref={viewer} aria-label={imageLabels[0]}><div><strong>{imageLabels[0]}</strong><button type="button" data-reader-close aria-label={imageLabels[1]}>×</button></div><img ref={viewerImage} alt="" width="1200" height="900"/><p ref={viewerCaption}/></dialog>
 </div>;
}
