import './ddnz-brand.css';

/** The approved simplified globe with the horizontal 03 wordmark treatment. */
export default function DdnzBrand() {
  return <span className="ddnz-brand" dir="ltr" aria-hidden="true">
    <img className="ddnz-brand__mark" src="/images/brand/ddnz-global-mark-v2.png" width="1254" height="1254" alt="" />
    <span className="ddnz-brand__type">
      <span className="ddnz-brand__name"><b>DDNZ</b><span>GLOBAL</span></span>
      <span className="ddnz-brand__tagline">MANUFACTURING <em>&amp;</em> EXPORT</span>
    </span>
  </span>;
}
