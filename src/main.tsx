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
import App from './App.tsx';
import './index.css';
import './styles/ddnz-ribbon-backgrounds.css';
import './styles/ddnz-refinement.css';

installQuoteLinkHandoff();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

import './components/catalogue-hero/catalogue-hero.css';

import './features/mobile-sourcing/privacy-o-fold.css';
