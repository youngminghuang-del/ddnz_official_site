import {Fragment} from 'react';
/** Isolate Latin port names, brands and freight abbreviations within RTL prose. */
export default function MarketBidiText({text}:{text:string}){
 return <>{text.split(/(Guayaquil|Posorja|SENAE|CCPIT|BAHRAIN|HAMAD|DDNZ|FCL|LCL|CO|HB)/g).map((part,i)=>/^(Guayaquil|Posorja|SENAE|CCPIT|BAHRAIN|HAMAD|DDNZ|FCL|LCL|CO|HB)$/.test(part)?<bdi dir="ltr" key={i}>{part}</bdi>:<Fragment key={i}>{part}</Fragment>)}</>;
}
