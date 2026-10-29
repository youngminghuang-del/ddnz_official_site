/** Keep Chinese buying phrases intact without changing the heading's text. */
export default function CatalogueHeroHeading({text, language='en', className}:{text:string;language?:string;className?:string}) {
 const start=language.startsWith('zh')?text.match(/^(从中国批发采购|从中国采购|中国便携电源)/)?.[0]:undefined;
 return <h1 className={className}>{start?<><span className="ddnz-title-phrase">{start}</span><wbr/><span className="ddnz-title-phrase">{text.slice(start.length)}</span></>:text}</h1>;
}
