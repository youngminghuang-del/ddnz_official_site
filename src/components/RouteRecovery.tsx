import { Component, useEffect, useState, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';

const messages = {
  en: ['Loading this page is taking longer than expected.', 'This page could not be loaded.', 'Please check your connection and try again.', 'Reload this page'],
  zh: ['页面加载时间较长。', '页面未能加载。', '请检查网络连接后重试。', '重新加载此页'],
  ar: ['يستغرق تحميل هذه الصفحة وقتاً أطول من المعتاد.', 'تعذّر تحميل هذه الصفحة.', 'تحقّق من اتصالك بالإنترنت ثم حاول مرة أخرى.', 'إعادة تحميل الصفحة'],
  ru: ['Загрузка страницы занимает больше времени, чем обычно.', 'Не удалось загрузить страницу.', 'Проверьте подключение к интернету и попробуйте ещё раз.', 'Перезагрузить страницу'],
  es: ['Esta página está tardando más de lo habitual en cargar.', 'No se pudo cargar la página.', 'Comprueba tu conexión e inténtalo de nuevo.', 'Volver a cargar la página'],
  fr: ['Le chargement de cette page prend plus de temps que prévu.', 'Impossible de charger cette page.', 'Vérifiez votre connexion, puis réessayez.', 'Recharger la page'],
  pt: ['Esta página está a demorar mais do que o habitual a carregar.', 'Não foi possível carregar a página.', 'Verifique a sua ligação à Internet e tente novamente.', 'Recarregar a página'],
  tr: ['Bu sayfanın yüklenmesi beklenenden uzun sürüyor.', 'Sayfa yüklenemedi.', 'İnternet bağlantınızı kontrol edip tekrar deneyin.', 'Sayfayı yeniden yükle'],
};
export function RecoveryMessage({ failed = false, pathname = '/' }: { failed?: boolean; pathname?: string }) {
  const segment = pathname.split('/')[1];
  const locale = segment === 'zh-cn' ? 'zh' : segment;
  const copy = messages[locale as keyof typeof messages] || messages.en;
  return <div className="mx-auto max-w-3xl px-6 py-16" lang={locale === 'zh' ? 'zh-CN' : locale in messages ? locale : 'en'} dir={locale === 'ar' ? 'rtl' : 'ltr'} role={failed ? 'alert' : 'status'}>
    <h1 className="text-2xl font-bold text-[#10233f]">{copy[failed ? 1 : 0]}</h1>
    <p className="my-5 text-slate-600">{copy[2]}</p>
    <button type="button" className="rounded-lg bg-[#71339a] px-6 py-3 font-semibold text-white" onClick={() => window.location.reload()}>{copy[3]}</button>
  </div>;
}
export function RouteLoadingFallback() {
  const [slow, setSlow] = useState(false);
  const { pathname } = useLocation();
  useEffect(() => { const timer = window.setTimeout(() => setSlow(true), 12000); return () => window.clearTimeout(timer); }, []);
  return <main data-route-loading className="min-h-[70dvh] bg-[#F5F8FC] pt-28" aria-busy={!slow}>
    {slow ? <RecoveryMessage pathname={pathname}/> : <div className="mx-auto max-w-7xl px-6" role="status" aria-label="Loading">
      <div className="h-7 w-44 rounded-lg bg-slate-200"/><div className="mt-6 h-12 max-w-2xl rounded-xl bg-slate-200"/><div className="mt-5 h-5 max-w-xl rounded-lg bg-slate-200"/>
    </div>}
  </main>;
}
export class RouteErrorBoundary extends Component<{ children: ReactNode; pathname: string }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? <main className="min-h-[70dvh] bg-[#F5F8FC] pt-28"><RecoveryMessage failed pathname={this.props.pathname}/></main> : this.props.children; }
}
export default function RouteRecovery({ children }: { children: ReactNode }) {
  const location = useLocation();
  // A new destination gets its own boundary; retry never clears stored purchase data.
  return <RouteErrorBoundary key={location.pathname + location.search} pathname={location.pathname}>{children}</RouteErrorBoundary>;
}
