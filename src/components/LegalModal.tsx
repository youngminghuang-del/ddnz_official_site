import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export type LegalType = 'privacy' | 'terms' | null;

interface LegalModalProps {
  type: LegalType;
  onClose: () => void;
}

export default function LegalModal({ type, onClose }: LegalModalProps) {
  const { language } = useLanguage();
  const labels = {
    en: { back: 'Back to Home', privacy: 'Privacy Policy', terms: 'Terms of Service', officialNote: 'The official legal text is provided in English.' },
    zh: { back: '返回首页', privacy: '隐私政策', terms: '服务条款', officialNote: '正式法律文本以英文版本为准。' },
    ru: { back: 'На главную', privacy: 'Политика конфиденциальности', terms: 'Условия обслуживания', officialNote: 'Официальный юридический текст представлен на английском языке.' },
    fr: { back: 'Retour à l’accueil', privacy: 'Politique de confidentialité', terms: 'Conditions de service', officialNote: 'Le texte juridique officiel est fourni en anglais.' },
    es: { back: 'Volver al inicio', privacy: 'Política de privacidad', terms: 'Términos de servicio', officialNote: 'El texto jurídico oficial se proporciona en inglés.' },
    ar: { back: 'العودة إلى الصفحة الرئيسية', privacy: 'سياسة الخصوصية', terms: 'شروط الخدمة', officialNote: 'النص القانوني الرسمي متاح باللغة الإنجليزية.' },
    pt: { back: 'Voltar ao início', privacy: 'Política de privacidade', terms: 'Termos de serviço', officialNote: 'O texto jurídico oficial é fornecido em inglês.' },
    tr: { back: 'Ana sayfaya dön', privacy: 'Gizlilik politikası', terms: 'Hizmet şartları', officialNote: 'Resmî hukuki metin İngilizce olarak sunulmaktadır.' },
  }[language];
  const content = {
    privacy: {
      title: labels.privacy,
      sections: [
        { title: 'Introduction', text: 'DDNZ Global values your privacy. We collect information (Name, Email, Phone, Company) solely to provide logistics consultancy and quotes.' },
        { title: 'Data Usage', text: 'Your data is never sold to third parties. We use industry-standard encryption to ensure your cargo details and contact info remain confidential.' },
        { title: 'Compliance', text: 'Our data handling complies with global business standards. For inquiries, contact manager@ddnzglobal.com.' }
      ]
    },
    terms: {
      title: labels.terms,
      sections: [
        { title: 'Service Basis', text: 'All quotes provided are based on current market rates and space availability at the time of inquiry.' },
        { title: 'Liabilities', text: 'DDNZ Global operates under standard international freight forwarding conditions. Specific liability limits apply to various modes of transport (Sea/Air/Land).' },
        { title: 'Jurisdiction', text: 'These terms are governed by the laws of the People\'s Republic of China.' }
      ]
    }
  };

  return (
    <AnimatePresence>
      {type && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed inset-0 z-[100] bg-[#4B27B1] overflow-y-auto font-sans"
        >
          <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
            <button
              onClick={onClose}
              className="inline-flex items-center text-gray-400 hover:text-white transition-colors mb-12 group py-2"
            >
              <ArrowLeft className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform rtl:rotate-180 rtl:mr-0 rtl:ml-2" />
              {labels.back}
            </button>

            <h1 className="text-3xl md:text-4xl font-bold text-white mb-12 tracking-tight">
              {content[type].title}
            </h1>
            <p className="-mt-8 mb-10 text-sm font-semibold text-violet-100">{labels.officialNote}</p>

            <div className="space-y-10">
              {content[type].sections.map((section, idx) => (
                <section key={idx}>
                  <h2 className="text-xl font-semibold text-white mb-4">{section.title}</h2>
                  <p className="text-gray-400 leading-relaxed hover:text-white transition-colors">
                    {section.text}
                  </p>
                </section>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
