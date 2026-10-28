import './ddnz-brand.css';

/** Approved artwork retains the custom letterforms; never substitute browser fonts. */
export default function DdnzBrand() {
  return <span className="ddnz-brand" dir="ltr" aria-hidden="true">
    <img className="ddnz-brand__lockup" src="/images/brand/ddnz-global-lockup-v3.png" width="2172" height="724" alt="" />
  </span>;
}
