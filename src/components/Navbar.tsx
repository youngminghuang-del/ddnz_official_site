import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { cn } from '../lib/utils';

const navItems = [
  { label: 'WHO WE ARE', href: '#who-we-are' },
  { label: 'WHAT WE DO', href: '#what-we-do' },
  { label: 'WHY DDNZ?', href: '#why-ddnz' },
  { label: 'OUR FACILITIES', href: '#our-facilities' },
  { label: 'INSIGHTS', href: '#insights' },
  { label: 'GET A QUOTE', href: '#get-a-quote' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMenu = () => setIsOpen(false);

  return (
    <nav className={cn(
      'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
      scrolled ? 'bg-white/95 backdrop-blur-sm shadow-sm py-3' : 'bg-transparent py-5'
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* 升级后的 Logo + Text 组合 */}
          <div className="flex-shrink-0">
            <a href="#" className="flex items-center gap-3">
              {/* DDNZ 文字，也需要跟随滚屏变色 */}
              <span className={cn(
                "text-2xl font-extrabold tracking-tighter transition-all",
                scrolled ? "text-slate-900" : "text-white"
              )}>
                DDNZ Global
              </span>
            </a>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-8">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className={cn(
                    "text-sm tracking-widest font-bold transition-all",
                    item.label === 'GET A QUOTE' 
                      ? "bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 shadow-md" 
                      : (scrolled ? "text-slate-700 hover:text-blue-600" : "text-white/90 hover:text-white")
                  )}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>

          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className={cn("p-2 rounded-md focus:outline-none", scrolled ? "text-slate-900" : "text-white")}>
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-t border-slate-100 shadow-lg">
          <div className="px-4 pt-2 pb-6 space-y-2">
            {navItems.map((item) => {
              const isQuote = item.label === 'GET A QUOTE';
              return (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={closeMenu}
                  className={cn(
                    "block px-4 py-3 text-base font-semibold transition-colors",
                    isQuote
                      ? "bg-blue-600 text-white text-center rounded-lg mt-4 shadow-sm"
                      : "text-slate-700 hover:bg-slate-50 hover:text-blue-600 rounded-lg"
                  )}
                >
                  {item.label}
                </a>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
}
