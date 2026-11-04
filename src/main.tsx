import './features/freight/central-asia-route-options.css';
import './features/product-series/series.css';
import './features/equipment-buying-support/support.css';
import './features/commercial-kitchen/styles/induction-catalogue.css';
import './features/refrigeration/catalogue.css';
import './features/article-reading/article-reading.css';
import './features/article-reading/worksheet.css';
import './features/mobile-sourcing/bear-glass.css';
import './features/product-positioning/product-supply.css';
import './features/company-identity/about.css';
import './features/company-identity/company-identity.css';
import { installQuoteLinkHandoff } from './lib/quoteLinkPolicy.mjs';
import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App, { preparePrerenderedRoute } from './App.tsx';
import './index.css';
import './styles/ddnz-ribbon-backgrounds.css';
import './styles/ddnz-refinement.css';

installQuoteLinkHandoff();

const root = document.getElementById('root')!;
const mount = () => createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
const preparation = root.querySelector('main') && preparePrerenderedRoute(location.pathname);
if (preparation) {
  // On a rejected import, hand off to the existing route error boundary.
  void preparation.then(mount, mount);
} else {
  mount();
}

import './components/catalogue-hero/catalogue-hero.css';

import './features/mobile-sourcing/privacy-o-fold.css';
import './styles/ddnz-visual-system.css';
