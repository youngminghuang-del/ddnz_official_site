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
