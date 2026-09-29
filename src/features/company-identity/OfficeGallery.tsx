import { useLanguage } from '../../contexts/LanguageContext';
const labels = {
  "en": [
    "Our Guangzhou office",
    "DDNZ and HB · office entrance",
    "Our team at work",
    "Office lounge"
  ],
  "zh": [
    "我们的广州办公室",
    "DDNZ 与 HB · 办公室入口",
    "团队日常办公",
    "办公室休息区"
  ],
  "es": [
    "Nuestra oficina en Guangzhou",
    "DDNZ y HB · entrada de la oficina",
    "Nuestro equipo trabajando",
    "Zona de descanso"
  ],
  "fr": [
    "Nos bureaux à Guangzhou",
    "DDNZ et HB · entrée des bureaux",
    "Notre équipe au travail",
    "Espace de détente"
  ],
  "pt": [
    "Nosso escritório em Guangzhou",
    "DDNZ e HB · entrada do escritório",
    "Nossa equipe no trabalho",
    "Área de descanso"
  ],
  "ru": [
    "Наш офис в Гуанчжоу",
    "DDNZ и HB · вход в офис",
    "Наша команда за работой",
    "Зона отдыха"
  ],
  "tr": [
    "Guangzhou’daki ofisimiz",
    "DDNZ ve HB · ofis girişi",
    "Ekibimiz iş başında",
    "Dinlenme alanı"
  ],
  "ar": [
    "مكتبنا في قوانغتشو",
    "DDNZ وHB · مدخل المكتب",
    "فريقنا أثناء العمل",
    "استراحة المكتب"
  ]
} as const;
export default function OfficeGallery() {
 const {language}=useLanguage(); const c=labels[language];
 return <section className="about-office" aria-labelledby="office-title"><div className="about-inner"><h2 id="office-title">{c[0]}</h2><div className="about-office-grid">
 {['workspace','entrance','lounge'].map((name,i)=><figure key={name} className={`about-office-${name}`}><img src={`/images/company/office/${name}-1600.webp`} srcSet={`/images/company/office/${name}-800.webp 800w, /images/company/office/${name}-1600.webp 1600w`} sizes={i===0?'(max-width:700px) 100vw, 1200px':'(max-width:700px) 100vw, 600px'} alt={c[name==='workspace'?2:name==='entrance'?1:3]} width={i===0?1600:1290} height={i===0?877:1690} loading="lazy" decoding="async"/><figcaption>{c[name==='workspace'?2:name==='entrance'?1:3]}</figcaption></figure>)}
 </div></div></section>;
}
