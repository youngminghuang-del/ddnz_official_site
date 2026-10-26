import React,{useRef,useEffect,useMemo} from 'react';
import {renderBear,mountBearGallery} from './bear-gallery.mjs';
export default function BearFeature({locale='en',onSelect}){
 const root=useRef(null),callback=useRef(onSelect);callback.current=onSelect;
 useEffect(()=>mountBearGallery(root.current,id=>callback.current?.(id)),[locale]);
 const selectable=!!onSelect,markup=useMemo(()=>({__html:renderBear(locale,{selectable})}),[locale,selectable]);
 return <div ref={root} dangerouslySetInnerHTML={markup}/>;
}
