import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, X } from 'lucide-react';

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      // Add a slight delay before showing the banner for a smoother user experience
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookieConsent', 'declined');
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 150, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 150, opacity: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="fixed bottom-0 left-0 right-0 z-[100] p-4 sm:p-6 pointer-events-none"
        >
          <div className="max-w-6xl mx-auto pointer-events-auto">
            <div className="bg-slate-900 border border-slate-700/50 text-slate-300 rounded-2xl shadow-2xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center gap-6 relative overflow-hidden backdrop-blur-md">
              {/* Decorative background blur */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>

              <div className="flex-shrink-0 bg-blue-600/20 p-3 rounded-full relative z-10">
                <Cookie className="w-8 h-8 text-blue-400" />
              </div>
              
              <div className="flex-1 text-left relative z-10 pr-6 md:pr-0">
                <h4 className="text-white font-bold text-lg mb-2">We value your privacy</h4>
                <p className="text-sm leading-relaxed text-slate-400">
                  We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. By clicking "Accept All", you consent to our use of cookies ensuring the best logistics portal experience.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row w-full md:w-auto gap-3 relative z-10 mt-2 md:mt-0">
                <button 
                  onClick={handleDecline}
                  className="px-6 py-2.5 text-sm font-semibold text-slate-300 hover:text-white bg-slate-800/50 hover:bg-slate-800 rounded-xl transition-colors border border-slate-700/50"
                >
                  Decline
                </button>
                <button 
                  onClick={handleAccept}
                  className="px-6 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-lg shadow-blue-900/20 transition-colors whitespace-nowrap"
                >
                  Accept All
                </button>
              </div>

              <button 
                onClick={handleDecline}
                className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors z-20 pointer-events-auto p-1"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
