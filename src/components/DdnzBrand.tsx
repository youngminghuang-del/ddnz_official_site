import './ddnz-brand.css';

/** Display the exact approved horizontal artwork, without regenerating letterforms. */
export default function DdnzBrand() {
  return <span className="ddnz-brand" dir="ltr" aria-hidden="true">
    <img className="ddnz-brand__lockup" src="/images/brand/ddnz-approved-combination.png" width="1774" height="887" alt="" />
  </span>;
}
