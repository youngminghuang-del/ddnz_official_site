import { Fragment } from 'react';
import { freightBreadcrumbs, breadcrumbLabel } from './freightPageSchema';

/** Render only the existing breadcrumb placements, using the same data as JSON-LD. */
export default function FreightBreadcrumbs({ path, locale, className }: {path: string; locale: string; className: string}) {
  const items = freightBreadcrumbs(path, locale);
  return <nav className={className} aria-label={breadcrumbLabel(locale)} data-freight-breadcrumb>
    {items.map((item, i) => <Fragment key={item.path}>
      {i > 0 && <span aria-hidden="true"> / </span>}
      {i === items.length - 1 ? <span aria-current="page">{item.name}</span> : <a href={item.path}>{item.name}</a>}
    </Fragment>)}
  </nav>;
}
