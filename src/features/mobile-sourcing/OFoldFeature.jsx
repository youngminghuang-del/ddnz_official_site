import React,{useEffect,useRef} from 'react';
import {renderOFold,mountOFoldGallery} from './o-fold-gallery.mjs';
import {privacyOFold} from './privacy-o-fold.mjs';
export default function OFoldFeature({locale='en',selected=false,onSelect}){
 const root=useRef(null),callback=useRef(onSelect);callback.current=onSelect;
 useEffect(()=>mountOFoldGallery(root.current,()=>callback.current?.(privacyOFold.id)),[locale,selected]);
 return <div ref={root} dangerouslySetInnerHTML={{__html:renderOFold(locale,{selectable:!!onSelect,selected})}}/>;
}
