import type { ReactNode } from 'react';

export default function CountryFreightIntro({ children, supporting }: {
  children: ReactNode;
  supporting: ReactNode;
}) {
  return <header className="country-freight-intro">
    <div className="country-freight-intro__grid">
      <div className="country-freight-intro__copy">{children}</div>
      <div className="country-freight-intro__support">{supporting}</div>
    </div>
  </header>;
}
