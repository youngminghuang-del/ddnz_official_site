import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// 🛡️ 强制保护原生 fetch，防止任何插件或旧脚本篡改
const _originalFetch = window.fetch;
Object.defineProperty(window, 'fetch', {
  configurable: false,
  enumerable: true,
  get: () => _originalFetch,
  set: (v) => { 
    console.warn('DDNZ Security: Blocked attempt to overwrite fetch API.', v);
  }
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
