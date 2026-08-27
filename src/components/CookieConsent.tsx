import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Cookie, X, ShieldCheck, Globe, ChevronDown } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Language } from '../i18n/translations';
import { trackPageView, updateAnalyticsConsent } from '../lib/analytics';

const cookieTextsBase = {
  en: {
    bannerTitle: "We value your privacy",
    bannerDesc: "Before you choose or after you decline, Microsoft Clarity provides limited site statistics without cookies. Google Analytics and optional analytics cookies run only with your consent. You can change your choice later.",
    btnAcceptAll: "Accept All",
    btnDecline: "Decline",
    btnSettings: "Cookie Settings",
    modalTitle: "Cookies Preferences Center",
    consentBy: "Cookie controls for DDNZ Global",
    btnSave: "Save my preferences",
    activeLabel: "Active",
    inactiveLabel: "Inactive",
    alwaysActive: "Always active",
    tabs: {
      privacy: "Your privacy",
      necessary: "Strictly necessary cookies",
      functionality: "Functionality cookies",
      tracking: "Tracking cookies",
      targeting: "Targeting and advertising cookies",
      more: "More information"
    },
    content: {
      privacy: {
        title: "Your privacy is important to us",
        p1: "Cookies are very small text files that are stored on your computer when you visit a website. We use cookies for a variety of purposes and to enhance your online experience on our website (for example, to remember your account login details).",
        p2: "You can change your preferences and decline certain types of cookies to be stored on your computer while browsing our website. You can also remove any cookies already stored on your computer, but keep in mind that deleting cookies may prevent you from using parts of our website."
      },
      necessary: {
        title: "Strictly necessary cookies",
        p1: "These cookies are essential to provide you with services available through our website and to enable you to use certain features of our website.",
        p2: "Without these cookies, we cannot provide you certain services on our website."
      },
      functionality: {
        title: "Functionality cookies",
        p1: "These cookies are used to provide you with a more personalized experience on our website and to remember choices you make when you use our website.",
        p2: "For example, we may use functionality cookies to remember your language preferences or remember your login details."
      },
      tracking: {
        title: "Tracking cookies",
        p1: "Before you choose or after you decline, Microsoft Clarity runs in limited no-consent mode. It may receive page and interaction data, but it uses a new identifier for each page view and does not set Clarity cookies.",
        p2: "If you enable analytics, Google Analytics and Microsoft Clarity may use analytics cookies to measure visits across pages and sessions. Targeting consent remains a separate choice.",
        p3: "We do not send contact-form fields to analytics. You can withdraw consent at any time; we then send denied consent metadata and the providers stop optional cookie storage."
      },
      targeting: {
        title: "Targeting and advertising cookies",
        p1: "These cookies are used to show advertising that is likely to be of interest to you based on your browsing habits.",
        p2: "These cookies, as served by our content and/or advertising providers, may combine information they collected from our website with other information they have independently collected relating to your web browser's activities across their network of websites.",
        p3: "If you choose to remove or disable these targeting or advertising cookies, you will still see adverts but they may not be relevant to you."
      },
      more: {
        title: "More information",
        p1: "For any queries in relation to our policy on cookies and your choices, please contact us."
      }
    }
  },
  zh: {
    bannerTitle: "我们重视您的隐私",
    bannerDesc: "在您作出选择前或拒绝后，Microsoft Clarity 会以无 Cookie 模式提供有限的网站统计。Google Analytics 与可选统计 Cookie 仅在您同意后启用；您可随时更改选择。",
    btnAcceptAll: "全部接受",
    btnDecline: "拒绝",
    btnSettings: "Cookie 设置",
    modalTitle: "Cookie 偏好设置中心",
    consentBy: "DDNZ Global Cookie 控制",
    btnSave: "保存我的偏好设置",
    activeLabel: "已激活",
    inactiveLabel: "未激活",
    alwaysActive: "始终激活",
    tabs: {
      privacy: "您的隐私",
      necessary: "绝对必要 Cookie",
      functionality: "功能性 Cookie",
      tracking: "追踪性 Cookie",
      targeting: "定向与广告 Cookie",
      more: "更多信息"
    },
    content: {
      privacy: {
        title: "您的隐私对我们至关重要",
        p1: "Cookie 是您访问网站时存储在计算机上的非常小的文本文件。我们使用 Cookie 出于多种目的，并旨在增强您的网站在线体验（例如：记住您的账户登录详细信息）。",
        p2: "您可以更改偏好并拒绝在计算机中存储某些类型的 Cookie。您也可以随时删除计算机中已有的 Cookie，但请注意，删除 Cookie 可能会影响您正常使用我们网站的部分功能。"
      },
      necessary: {
        title: "绝对必要 Cookie",
        p1: "这些 Cookie 对于向您提供网站服务以及启用某些网站功能是必不可少的。",
        p2: "如果没有这些 Cookie，我们无法为您提供这些必需的服务。"
      },
      functionality: {
        title: "功能性 Cookie",
        p1: "这些 Cookie 用于为您提供更具个性化的网站体验，并记住您在使用我们网站时所做的选择。",
        p2: "例如，我们可能使用功能性 Cookie 来记住您的语言偏好或登录状态。"
      },
      tracking: {
        title: "追踪性 Cookie",
        p1: "在您作出选择前或拒绝后，Microsoft Clarity 会在有限的无同意模式下运行。它可能接收页面与交互数据，但每次页面浏览都会使用新的标识，并且不会设置 Clarity Cookie。",
        p2: "如果您启用统计，Google Analytics 与 Microsoft Clarity 可能使用统计 Cookie 来衡量跨页面和跨会话的访问。定向同意仍是单独的选择。",
        p3: "我们不会把联系表单字段发送给统计工具。您可随时撤回同意；届时我们会发送拒绝同意的状态信息，服务商将停止可选 Cookie 存储。"
      },
      targeting: {
        title: "定向与广告 Cookie",
        p1: "这些 Cookie 用于根据您的浏览习惯向您展示您可能感兴趣的广告。",
        p2: "这些 Cookie 由我们的内容和/或广告服务商提供，它们可能会将从我们网站收集的信息与它们在其他网站网络上独立收集的有关您浏览活动的其他信息相结合。",
        p3: "如果您选择删除或禁用这些定向或广告 Cookie，您仍会看到广告，但它们可能与您不相关。"
      },
      more: {
        title: "更多信息",
        p1: "如果您对我们的 Cookie 政策及您的选择有任何疑问，请随时联系我们。"
      }
    }
  },
  ru: {
    bannerTitle: "Мы ценим вашу конфиденциальность",
    bannerDesc: "До вашего выбора или после отказа Microsoft Clarity предоставляет ограниченную статистику сайта без cookie. Google Analytics и необязательные аналитические cookie работают только с вашего согласия; выбор можно изменить позднее.",
    btnAcceptAll: "Принять все",
    btnDecline: "Отклонить",
    btnSettings: "Настройки файлов cookie",
    modalTitle: "Центр настроек файлов cookie",
    consentBy: "Настройки cookie DDNZ Global",
    btnSave: "Сохранить мои настройки",
    activeLabel: "Активно",
    inactiveLabel: "Неактивно",
    alwaysActive: "Всегда активно",
    tabs: {
      privacy: "Ваша конфиденциальность",
      necessary: "Строго необходимые файлы cookie",
      functionality: "Функциональные файлы cookie",
      tracking: "Отслеживающие файлы cookie",
      targeting: "Рекламные файлы cookie",
      more: "Дополнительная информация"
    },
    content: {
      privacy: {
        title: "Ваша конфиденциальность важна для нас",
        p1: "Файлы cookie — это очень маленькие текстовые файлы, которые сохраняются на вашем компьютере при посещении веб-сайта. Мы используем файлы cookie для различных целей и для улучшения вашего удобства работы на нашем сайте (например, для запоминания данных вашего входа).",
        p2: "Вы можете изменить свои предпочтения и отказаться от хранения определенных типов файлов cookie на своем компьютере во время просмотра нашего сайта. Вы также можете удалить любые файлы cookie, уже сохраненные на вашем компьютере, но помните, что удаление файлов cookie может помешать вам использовать некоторые части нашего веб-сайта."
      },
      necessary: {
        title: "Строго необходимые файлы cookie",
        p1: "Эти файлы cookie необходимы для предоставления вам услуг, доступных через наш веб-сайт, и для того, чтобы вы могли использовать определенные функции нашего веб-сайта.",
        p2: "Без этих файлов cookie мы не можем предоставить вам определенные услуги."
      },
      functionality: {
        title: "Функциональные файлы cookie",
        p1: "Эти файлы cookie используются для предоставления вам более персонализированного опыта на нашем веб-сайте и для запоминания выбора, который вы делаете при использовании нашего веб-сайта.",
        p2: "Например, мы можем использовать функциональные файлы cookie, чтобы запомнить ваши языковые предпочтения или данные вашего входа."
      },
      tracking: {
        title: "Отслеживающие файлы cookie",
        p1: "До вашего выбора или после отказа Microsoft Clarity работает в ограниченном режиме без согласия. Он может получать данные о страницах и взаимодействиях, но использует новый идентификатор для каждого просмотра страницы и не устанавливает cookie Clarity.",
        p2: "Если вы включите аналитику, Google Analytics и Microsoft Clarity могут использовать аналитические cookie для измерения посещений между страницами и сеансами. Согласие на таргетинг остается отдельным выбором.",
        p3: "Мы не передаем поля контактных форм в аналитику. Вы можете отозвать согласие в любое время; после этого мы отправим статус отказа, и поставщики прекратят хранение необязательных cookie."
      },
      targeting: {
        title: "Рекламные файлы cookie",
        p1: "Эти файлы cookie используются для показа рекламы, которая, скорее всего, будет вам интересна, на основе ваших привычек просмотра.",
        p2: "Эти файлы cookie, предоставляемые нашими поставщиками контента и/или рекламы, могут объединять информацию, собранную с нашего сайта, с другой информацией, которую они независимо собрали в отношении вашей активности.",
        p3: "Если вы решите удалить или отключить эти файлы cookie, вы все равно будете видеть рекламу, но она может быть нерелевантной."
      },
      more: {
        title: "Дополнительная информация",
        p1: "По любым вопросам относительно нашей политики в отношении файлов cookie и вашего выбора, пожалуйста, свяжитесь с нами."
      }
    }
  },
  fr: {
    bannerTitle: "Nous apprécions votre vie privée",
    bannerDesc: "Avant votre choix ou après un refus, Microsoft Clarity fournit des statistiques limitées sans cookies. Google Analytics et les cookies analytiques facultatifs ne fonctionnent qu’avec votre accord, que vous pouvez modifier.",
    btnAcceptAll: "Tout accepter",
    btnDecline: "Refuser",
    btnSettings: "Paramètres des cookies",
    modalTitle: "Centre de Préférences des Cookies",
    consentBy: "Contrôles des cookies DDNZ Global",
    btnSave: "Enregistrer mes préférences",
    activeLabel: "Actif",
    inactiveLabel: "Inactif",
    alwaysActive: "Toujours actif",
    tabs: {
      privacy: "Votre vie privée",
      necessary: "Cookies strictement nécessaires",
      functionality: "Cookies de fonctionnalité",
      tracking: "Cookies de suivi",
      targeting: "Cookies de ciblage et publicité",
      more: "Plus d'informations"
    },
    content: {
      privacy: {
        title: "Votre vie privée est importante pour nous",
        p1: "Les cookies sont de très petits fichiers texte qui sont stockés sur votre ordinateur lorsque vous visitez un site Web. Nous utilisons des cookies à diverses fins et pour améliorer votre expérience en ligne sur notre site (par exemple, pour mémoriser les détails de connexion à votre compte).",
        p2: "Vous pouvez modifier vos préférences et refuser le stockage de certains types de cookies sur votre ordinateur lors de votre navigation. Vous pouvez également supprimer tous les cookies déjà stockés sur votre ordinateur, mais gardez à l'esprit que la suppression des cookies peut vous empêcher d'utiliser certaines parties de notre site."
      },
      necessary: {
        title: "Cookies strictement nécessaires",
        p1: "Ces cookies sont essentiels pour vous fournir les services disponibles sur notre site et pour vous permettre d'utiliser certaines de ses fonctionnalités.",
        p2: "Sans ces cookies, nous ne pouvons pas vous fournir certains services."
      },
      functionality: {
        title: "Cookies de fonctionnalité",
        p1: "Ces cookies sont utilisés pour vous offrir une expérience plus personnalisée sur notre site et pour mémoriser les choix que vous faites lorsque vous l'utilisez.",
        p2: "Par exemple, nous pouvons utiliser des cookies de fonctionnalité pour mémoriser vos préférences linguistiques ou vos identifiants."
      },
      tracking: {
        title: "Cookies de suivi",
        p1: "Avant votre choix ou après un refus, Microsoft Clarity fonctionne en mode limité sans consentement. Il peut recevoir des données de page et d’interaction, mais utilise un nouvel identifiant à chaque page vue et ne dépose aucun cookie Clarity.",
        p2: "Si vous activez l’analyse, Google Analytics et Microsoft Clarity peuvent utiliser des cookies analytiques pour mesurer les visites entre les pages et les sessions. Le consentement au ciblage reste un choix distinct.",
        p3: "Nous n’envoyons aucun champ des formulaires de contact aux outils d’analyse. Vous pouvez retirer votre consentement à tout moment ; nous transmettons alors un statut de refus et les fournisseurs cessent le stockage facultatif de cookies."
      },
      targeting: {
        title: "Cookies de ciblage et de publicité",
        p1: "Ces cookies sont utilisés pour afficher des publicités susceptibles de vous intéresser en fonction de vos habitudes de navigation.",
        p2: "Ces cookies, fournis par nos partenaires, peuvent combiner des données de notre site avec d'autres informations collectées de manière indépendante.",
        p3: "Si vous les désactivez, vous verrez toujours des publicités mais elles seront moins pertinentes."
      },
      more: {
        title: "Plus d'informations",
        p1: "Pour toute question concernant notre politique de cookies et vos choix, veuillez nous contacter."
      }
    }
  }
};

const cookieTexts = {
  ...cookieTextsBase,
  pt: {
    ...cookieTextsBase.en,
    bannerTitle: 'Valorizamos sua privacidade',
    bannerDesc: 'Antes da sua escolha ou após a recusa, o Microsoft Clarity fornece estatísticas limitadas sem cookies. O Google Analytics e os cookies opcionais de análise funcionam somente com seu consentimento, que pode ser alterado depois.',
    btnAcceptAll: 'Aceitar todos',
    btnDecline: 'Recusar',
    btnSettings: 'Configurações de cookies',
    modalTitle: 'Central de preferências de cookies',
    consentBy: 'Controles de cookies da DDNZ Global',
    btnSave: 'Salvar preferências',
    activeLabel: 'Ativo',
    inactiveLabel: 'Inativo',
    alwaysActive: 'Sempre ativo',
    tabs: { privacy: 'Sua privacidade', necessary: 'Cookies estritamente necessários', functionality: 'Cookies de funcionalidade', tracking: 'Cookies de análise', targeting: 'Cookies de publicidade', more: 'Mais informações' },
    content: {
      privacy: { title: 'Sua privacidade é importante', p1: 'Cookies são pequenos arquivos armazenados no dispositivo. Usamos cookies necessários para operar o site e, com sua autorização, cookies opcionais para analisar e melhorar a experiência.', p2: 'Você pode mudar suas preferências, recusar categorias opcionais ou apagar cookies armazenados. A remoção de cookies necessários pode afetar algumas funções.' },
      necessary: { title: 'Cookies estritamente necessários', p1: 'Esses cookies são essenciais para prestar os serviços e habilitar funções básicas do site.', p2: 'Sem eles, algumas funções não podem ser oferecidas corretamente.' },
      functionality: { title: 'Cookies de funcionalidade', p1: 'Esses cookies lembram escolhas feitas durante o uso do site.', p2: 'Por exemplo, podem manter sua preferência de idioma.' },
      tracking: { title: 'Cookies de análise', p1: 'Antes da sua escolha ou após a recusa, o Microsoft Clarity funciona em modo limitado sem consentimento. Ele pode receber dados de páginas e interações, mas usa um novo identificador para cada visualização e não define cookies do Clarity.', p2: 'Se você ativar a análise, o Google Analytics e o Microsoft Clarity poderão usar cookies analíticos para medir visitas entre páginas e sessões. O consentimento para segmentação continua sendo uma escolha separada.', p3: 'Não enviamos campos de formulários de contato às ferramentas de análise. Você pode retirar o consentimento a qualquer momento; então enviamos o estado de recusa e os provedores deixam de armazenar cookies opcionais.' },
      targeting: { title: 'Cookies de publicidade', p1: 'Esses cookies podem ajudar a apresentar publicidade mais relevante conforme a navegação.', p2: 'Fornecedores de conteúdo ou publicidade podem combinar dados do site com informações coletadas em suas redes.', p3: 'Ao desativá-los, você ainda poderá ver anúncios, porém menos relevantes.' },
      more: { title: 'Mais informações', p1: 'Para dúvidas sobre cookies e suas escolhas, entre em contato conosco.' },
    },
  },
  tr: {
    ...cookieTextsBase.en,
    bannerTitle: 'Gizliliğinize önem veriyoruz',
    bannerDesc: 'Seçiminizden önce veya reddetmenizden sonra Microsoft Clarity, çerez kullanmadan sınırlı site istatistikleri sağlar. Google Analytics ve isteğe bağlı analiz çerezleri yalnızca onayınızla çalışır; seçiminizi daha sonra değiştirebilirsiniz.',
    btnAcceptAll: 'Tümünü kabul et',
    btnDecline: 'Reddet',
    btnSettings: 'Çerez ayarları',
    modalTitle: 'Çerez tercihleri merkezi',
    consentBy: 'DDNZ Global çerez kontrolleri',
    btnSave: 'Tercihleri kaydet',
    activeLabel: 'Etkin',
    inactiveLabel: 'Devre dışı',
    alwaysActive: 'Her zaman etkin',
    tabs: { privacy: 'Gizliliğiniz', necessary: 'Kesinlikle gerekli çerezler', functionality: 'İşlevsel çerezler', tracking: 'Analiz çerezleri', targeting: 'Reklam çerezleri', more: 'Daha fazla bilgi' },
    content: {
      privacy: { title: 'Gizliliğiniz bizim için önemlidir', p1: 'Çerezler cihazınızda saklanan küçük dosyalardır. Siteyi çalıştırmak için gerekli çerezleri, onayınızla da deneyimi analiz edip geliştirmek için isteğe bağlı çerezleri kullanırız.', p2: 'Tercihlerinizi değiştirebilir, isteğe bağlı kategorileri reddedebilir veya saklanan çerezleri silebilirsiniz. Gerekli çerezlerin silinmesi bazı işlevleri etkileyebilir.' },
      necessary: { title: 'Kesinlikle gerekli çerezler', p1: 'Bu çerezler site hizmetlerini sağlamak ve temel işlevleri çalıştırmak için gereklidir.', p2: 'Bunlar olmadan bazı hizmetler doğru şekilde sunulamaz.' },
      functionality: { title: 'İşlevsel çerezler', p1: 'Bu çerezler siteyi kullanırken yaptığınız seçimleri hatırlar.', p2: 'Örneğin dil tercihinizi saklayabilir.' },
      tracking: { title: 'Analiz çerezleri', p1: 'Seçiminizden önce veya reddetmenizden sonra Microsoft Clarity sınırlı, onaysız modda çalışır. Sayfa ve etkileşim verilerini alabilir; ancak her sayfa görüntülemesinde yeni bir tanımlayıcı kullanır ve Clarity çerezi yerleştirmez.', p2: 'Analizi etkinleştirirseniz Google Analytics ve Microsoft Clarity, sayfalar ve oturumlar arasındaki ziyaretleri ölçmek için analiz çerezleri kullanabilir. Hedefleme onayı ayrı bir seçim olarak kalır.', p3: 'İletişim formu alanlarını analiz araçlarına göndermeyiz. Onayınızı istediğiniz zaman geri çekebilirsiniz; ardından ret durumu gönderilir ve sağlayıcılar isteğe bağlı çerez depolamayı durdurur.' },
      targeting: { title: 'Reklam çerezleri', p1: 'Bu çerezler gezinme davranışınıza göre daha ilgili reklamlar gösterilmesine yardımcı olabilir.', p2: 'İçerik veya reklam sağlayıcıları site verilerini kendi ağlarında topladıkları bilgilerle birleştirebilir.', p3: 'Bunları kapatırsanız reklam görmeye devam edebilirsiniz ancak daha az ilgili olabilir.' },
      more: { title: 'Daha fazla bilgi', p1: 'Çerez politikamız ve seçimleriniz hakkında sorularınız için bize ulaşın.' },
    },
  },
};

const cookieTextMap = cookieTexts as Record<string, any>;
cookieTextMap.es = {
  ...cookieTexts.en,
  bannerTitle: 'Valoramos su privacidad', bannerDesc: 'Antes de elegir o después de rechazar, Microsoft Clarity ofrece estadísticas limitadas sin cookies. Google Analytics y las cookies analíticas opcionales solo funcionan con su consentimiento, que puede cambiar después.',
  btnAcceptAll: 'Aceptar todas', btnDecline: 'Rechazar', btnSettings: 'Configuración de cookies', modalTitle: 'Centro de preferencias de cookies', consentBy: 'Controles de cookies de DDNZ Global', btnSave: 'Guardar preferencias', activeLabel: 'Activo', inactiveLabel: 'Inactivo', alwaysActive: 'Siempre activo',
  tabs: { privacy: 'Su privacidad', necessary: 'Cookies estrictamente necesarias', functionality: 'Cookies de funcionalidad', tracking: 'Cookies de seguimiento', targeting: 'Cookies de publicidad', more: 'Más información' },
  content: {
    privacy: {
      title: 'Su privacidad es importante para nosotros',
      p1: 'Las cookies son pequeños archivos de texto que se almacenan en su dispositivo al visitar un sitio web. Las utilizamos para prestar funciones esenciales y, cuando usted lo permite, para comprender y mejorar el uso del sitio.',
      p2: 'Puede cambiar sus preferencias, rechazar categorías opcionales o eliminar cookies ya almacenadas. La eliminación de cookies necesarias puede afectar algunas funciones del sitio.'
    },
    necessary: {
      title: 'Cookies estrictamente necesarias',
      p1: 'Estas cookies son imprescindibles para prestar los servicios del sitio y habilitar funciones básicas.',
      p2: 'Sin ellas no podemos ofrecer correctamente determinados servicios.'
    },
    functionality: {
      title: 'Cookies de funcionalidad',
      p1: 'Estas cookies permiten recordar elecciones realizadas durante el uso del sitio.',
      p2: 'Por ejemplo, pueden conservar su preferencia de idioma.'
    },
    tracking: {
      title: 'Cookies de seguimiento',
      p1: 'Antes de elegir o después de rechazar, Microsoft Clarity funciona en un modo limitado sin consentimiento. Puede recibir datos de páginas e interacciones, pero usa un identificador nuevo para cada vista de página y no instala cookies de Clarity.',
      p2: 'Si activa las estadísticas, Google Analytics y Microsoft Clarity pueden usar cookies analíticas para medir visitas entre páginas y sesiones. El consentimiento de segmentación sigue siendo una elección independiente.',
      p3: 'No enviamos campos de formularios de contacto a las herramientas analíticas. Puede retirar el consentimiento en cualquier momento; entonces enviamos el estado de rechazo y los proveedores dejan de almacenar cookies opcionales.'
    },
    targeting: {
      title: 'Cookies de publicidad',
      p1: 'Estas cookies pueden utilizarse para mostrar publicidad basada en sus hábitos de navegación.',
      p2: 'Los proveedores de contenido o publicidad pueden combinar información del sitio con datos obtenidos de forma independiente en su red.',
      p3: 'Si las desactiva, seguirá viendo publicidad, aunque puede resultar menos relevante.'
    },
    more: {
      title: 'Más información',
      p1: 'Si tiene preguntas sobre nuestra política de cookies o sus opciones, póngase en contacto con nosotros.'
    }
  },
};
cookieTextMap.ar = {
  ...cookieTexts.en,
  bannerTitle: 'نحن نقدر خصوصيتكم', bannerDesc: 'قبل اختياركم أو بعد الرفض، يوفر Microsoft Clarity إحصاءات محدودة للموقع من دون ملفات ارتباط. ولا يعمل Google Analytics وملفات التحليل الاختيارية إلا بموافقتكم، ويمكنكم تغيير اختياركم لاحقاً.',
  btnAcceptAll: 'قبول الكل', btnDecline: 'رفض', btnSettings: 'إعدادات ملفات الارتباط', modalTitle: 'مركز تفضيلات ملفات الارتباط', consentBy: 'عناصر تحكم ملفات الارتباط لدى DDNZ Global', btnSave: 'حفظ التفضيلات', activeLabel: 'نشط', inactiveLabel: 'غير نشط', alwaysActive: 'نشط دائماً',
  tabs: { privacy: 'خصوصيتكم', necessary: 'ملفات الارتباط الضرورية', functionality: 'ملفات الارتباط الوظيفية', tracking: 'ملفات التتبع', targeting: 'ملفات الإعلان', more: 'معلومات إضافية' },
  content: {
    privacy: {
      title: 'خصوصيتكم مهمة بالنسبة لنا',
      p1: 'ملفات الارتباط هي ملفات نصية صغيرة تُخزّن على جهازكم عند زيارة الموقع. نستخدمها لتشغيل الوظائف الأساسية، وبعد موافقتكم لفهم استخدام الموقع وتحسينه.',
      p2: 'يمكنكم تغيير التفضيلات أو رفض الفئات الاختيارية أو حذف الملفات المخزنة. وقد يؤثر حذف الملفات الضرورية في بعض وظائف الموقع.'
    },
    necessary: {
      title: 'ملفات الارتباط الضرورية',
      p1: 'هذه الملفات ضرورية لتقديم خدمات الموقع وتمكين وظائفه الأساسية.',
      p2: 'لا يمكن تقديم بعض الخدمات بصورة صحيحة من دونها.'
    },
    functionality: {
      title: 'ملفات الارتباط الوظيفية',
      p1: 'تساعد هذه الملفات على تذكر الاختيارات التي تحددونها أثناء استخدام الموقع.',
      p2: 'ومن أمثلتها تذكر اللغة المفضلة.'
    },
    tracking: {
      title: 'ملفات التتبع',
      p1: 'قبل اختياركم أو بعد الرفض، يعمل Microsoft Clarity في وضع محدود من دون موافقة. وقد يتلقى بيانات الصفحات والتفاعل، لكنه يستخدم معرفاً جديداً لكل مشاهدة صفحة ولا يضع ملفات ارتباط خاصة بـ Clarity.',
      p2: 'إذا فعّلتم التحليلات، فقد يستخدم Google Analytics وMicrosoft Clarity ملفات ارتباط تحليلية لقياس الزيارات عبر الصفحات والجلسات. وتظل موافقة الاستهداف خياراً منفصلاً.',
      p3: 'لا نرسل حقول نماذج التواصل إلى أدوات التحليل. ويمكنكم سحب الموافقة في أي وقت؛ وعندها نرسل حالة الرفض ويتوقف المزودون عن تخزين ملفات الارتباط الاختيارية.'
    },
    targeting: {
      title: 'ملفات الإعلان',
      p1: 'قد تُستخدم هذه الملفات لعرض إعلانات مرتبطة بعادات التصفح.',
      p2: 'قد يجمع مزودو المحتوى أو الإعلان بيانات الموقع مع معلومات حصلوا عليها بشكل مستقل عبر شبكاتهم.',
      p3: 'عند تعطيلها ستستمر الإعلانات في الظهور، لكنها قد تكون أقل صلة باهتماماتكم.'
    },
    more: {
      title: 'معلومات إضافية',
      p1: 'لأي استفسار عن سياسة ملفات الارتباط أو خياراتكم، يرجى التواصل معنا.'
    }
  },
};

const languagesList = [
  { code: 'en', label: 'English' },
  { code: 'zh', label: '中文' },
  { code: 'ru', label: 'Русский' },
  { code: 'fr', label: 'Français' }
  ,{ code: 'es', label: 'Español' }
  ,{ code: 'ar', label: 'العربية' }
  ,{ code: 'pt', label: 'Português' }
  ,{ code: 'tr', label: 'Türkçe' }
];

const cookieAriaText: Record<Language, { close: string; categories: string }> = {
  en: { close: 'Close cookie settings', categories: 'Cookie categories' },
  zh: { close: '关闭 Cookie 设置', categories: 'Cookie 类别' },
  ru: { close: 'Закрыть настройки файлов cookie', categories: 'Категории файлов cookie' },
  fr: { close: 'Fermer les paramètres des cookies', categories: 'Catégories de cookies' },
  es: { close: 'Cerrar la configuración de cookies', categories: 'Categorías de cookies' },
  ar: { close: 'إغلاق إعدادات ملفات الارتباط', categories: 'فئات ملفات الارتباط' }
  ,pt: { close: 'Fechar configurações de cookies', categories: 'Categorias de cookies' }
  ,tr: { close: 'Çerez ayarlarını kapat', categories: 'Çerez kategorileri' }
};

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const [showPreferencesModal, setShowPreferencesModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'privacy' | 'necessary' | 'functionality' | 'tracking' | 'targeting' | 'more'>('privacy');
  
  const { language, setLanguage } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const dialogRef = useRef<HTMLDivElement>(null);

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);

    // Rewrite URL prefix dynamically based on target language
    let currentPath = location.pathname;
    
    // Remove current prefixes if present
    if (currentPath.startsWith('/zh-cn')) {
      currentPath = currentPath.slice(6);
    } else if (currentPath.startsWith('/ru')) {
      currentPath = currentPath.slice(3);
    } else if (currentPath.startsWith('/fr')) {
      currentPath = currentPath.slice(3);
    } else if (currentPath.startsWith('/es')) {
      currentPath = currentPath.slice(3);
    } else if (currentPath.startsWith('/ar')) {
      currentPath = currentPath.slice(3);
    } else if (currentPath.startsWith('/pt')) {
      currentPath = currentPath.slice(3);
    } else if (currentPath.startsWith('/tr')) {
      currentPath = currentPath.slice(3);
    }

    if (currentPath === '') currentPath = '/';

    // Construct target prefix path
    let targetPath = '';
    if (lang === 'zh') {
      targetPath = `/zh-cn${currentPath === '/' ? '' : currentPath}`;
    } else if (lang === 'ru') {
      targetPath = `/ru${currentPath === '/' ? '' : currentPath}`;
    } else if (lang === 'fr') {
      targetPath = `/fr${currentPath === '/' ? '' : currentPath}`;
    } else if (lang === 'es') {
      targetPath = `/es${currentPath === '/' ? '' : currentPath}`;
    } else if (lang === 'ar') {
      targetPath = `/ar${currentPath === '/' ? '' : currentPath}`;
    } else if (lang === 'pt') {
      targetPath = `/pt${currentPath === '/' ? '' : currentPath}`;
    } else if (lang === 'tr') {
      targetPath = `/tr${currentPath === '/' ? '' : currentPath}`;
    } else {
      targetPath = currentPath;
    }

    const searchAndHash = location.search + location.hash;
    navigate(targetPath + searchAndHash);
  };

  const [preferences, setPreferences] = useState({
    necessary: true,
    functionality: true,
    tracking: false,
    targeting: false
  });

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    const savedPrefs = localStorage.getItem('cookiePreferences');
    
    if (savedPrefs) {
      try {
        setPreferences(JSON.parse(savedPrefs));
      } catch (e) {
        console.error('Failed to parse cookie preferences');
      }
    }

    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    if (!showPreferencesModal) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const focusTimer = window.setTimeout(() => dialogRef.current?.focus(), 0);
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setShowPreferencesModal(false);
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.clearTimeout(focusTimer);
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [showPreferencesModal]);

  useEffect(() => {
    const handleOpenSettings = () => {
      setShowPreferencesModal(true);
    };
    window.addEventListener('open-cookie-settings', handleOpenSettings);
    return () => {
      window.removeEventListener('open-cookie-settings', handleOpenSettings);
    };
  }, []);

  const handleAccept = () => {
    const wasTrackingEnabled = preferences.tracking;
    const fullPrefs = {
      necessary: true,
      functionality: true,
      tracking: true,
      targeting: true
    };
    setPreferences(fullPrefs);
    localStorage.setItem('cookieConsent', 'accepted');
    localStorage.setItem('cookiePreferences', JSON.stringify(fullPrefs));
    updateAnalyticsConsent(true, true);
    if (!wasTrackingEnabled) trackPageView();
    setShowPreferencesModal(false);
    setIsVisible(false);
  };

  const handleDecline = () => {
    const declinedPrefs = {
      necessary: true,
      functionality: false,
      tracking: false,
      targeting: false
    };
    setPreferences(declinedPrefs);
    localStorage.setItem('cookieConsent', 'declined');
    localStorage.setItem('cookiePreferences', JSON.stringify(declinedPrefs));
    updateAnalyticsConsent(false, false);
    setShowPreferencesModal(false);
    setIsVisible(false);
  };

  const handleSavePreferences = () => {
    const previouslySaved = (() => {
      try {
        return JSON.parse(localStorage.getItem('cookiePreferences') || '{}') as { tracking?: boolean };
      } catch {
        return {};
      }
    })();
    localStorage.setItem('cookieConsent', 'custom');
    localStorage.setItem('cookiePreferences', JSON.stringify(preferences));
    updateAnalyticsConsent(preferences.tracking, preferences.targeting);
    if (preferences.tracking && !previouslySaved.tracking) {
      trackPageView();
    }
    setShowPreferencesModal(false);
    setIsVisible(false);
  };

  const togglePreference = (key: 'functionality' | 'tracking' | 'targeting') => {
    setPreferences((previous) => {
      const nextValue = !previous[key];
      if (key === 'tracking' && !nextValue) {
        return { ...previous, tracking: false, targeting: false };
      }
      if (key === 'targeting' && nextValue) {
        return { ...previous, tracking: true, targeting: true };
      }
      return { ...previous, [key]: nextValue };
    });
  };

  const tLocal = cookieTextMap[language] || cookieTexts.en;
  const ariaText = cookieAriaText[language] || cookieAriaText.en;

  const Toggle = ({ active, disabled, label, onChange }: { active: boolean; disabled?: boolean; label: string; onChange?: () => void }) => {
    return (
      <div className="flex items-center gap-3 mt-6">
        <button
          type="button"
          disabled={disabled}
          onClick={onChange}
          aria-label={label}
          aria-pressed={disabled || active}
          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#4B27B1] focus:ring-offset-2 ${
            disabled ? 'bg-emerald-500 cursor-not-allowed' : active ? 'bg-[#4B27B1]' : 'bg-slate-200'
          }`}
        >
          <span
            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
              disabled || active ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
        <span className={`text-sm font-bold tracking-tight ${disabled ? 'text-emerald-600' : active ? 'text-[#4B27B1]' : 'text-slate-400'}`}>
          {disabled ? tLocal.alwaysActive : active ? tLocal.activeLabel : tLocal.inactiveLabel}
        </span>
      </div>
    );
  };

  return (
    <>
      {/* Cookie Banner */}
      {isVisible && !showPreferencesModal && (
          <div className="fixed bottom-0 left-0 right-0 z-[90] p-2 sm:p-4 pointer-events-none">
            <div className="max-w-5xl mx-auto pointer-events-auto">
              <div className="bg-slate-900 border border-slate-700/50 text-slate-300 rounded-xl shadow-2xl p-4 flex flex-col lg:flex-row items-start lg:items-center gap-3 sm:gap-4 relative overflow-hidden backdrop-blur-md">

                <div className="hidden flex-shrink-0 bg-[#4B27B1]/20 p-2 rounded-full relative z-10 border border-[#4B27B1]/40 sm:block">
                  <Cookie className="w-6 h-6 text-[#FF8A00]" />
                </div>
                
                <div className="flex-1 text-left relative z-10">
                  <h4 className="text-white font-bold text-base mb-1">{tLocal.bannerTitle}</h4>
                  <p className="text-xs sm:text-sm leading-relaxed text-slate-400 line-clamp-2">
                    {tLocal.bannerDesc}
                  </p>
                </div>

                <div className="grid grid-cols-2 w-full lg:w-auto gap-2 relative z-10 sm:flex">
                  <button 
                    type="button"
                    onClick={() => setShowPreferencesModal(true)}
                    className="col-span-2 min-h-11 px-3 sm:col-span-1 sm:px-4 py-2 text-xs sm:text-sm font-bold text-slate-300 hover:text-white bg-slate-800/60 hover:bg-slate-800 rounded-lg transition-colors border border-slate-700/60"
                  >
                    {tLocal.btnSettings}
                  </button>
                  <button 
                    type="button"
                    onClick={handleDecline}
                    className="min-h-11 px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-slate-400 hover:text-white bg-transparent hover:bg-slate-800/40 rounded-lg transition-colors"
                  >
                    {tLocal.btnDecline}
                  </button>
                  <button 
                    type="button"
                    onClick={handleAccept}
                    className="min-h-11 px-3 sm:px-5 py-2 text-xs sm:text-sm font-extrabold text-white bg-[#4B27B1] hover:bg-[#3a1d91] rounded-lg shadow-lg shadow-purple-900/40 hover:shadow-purple-900/60 transition-all duration-300 whitespace-nowrap"
                  >
                    {tLocal.btnAcceptAll}
                  </button>
                </div>

              </div>
            </div>
          </div>
      )}

      {/* Preferences Center Modal */}
      {showPreferencesModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop overlay */}
            <div
              onClick={() => setShowPreferencesModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />

            {/* Modal Card */}
            <div
              ref={dialogRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="cookie-preferences-title"
              tabIndex={-1}
              className="relative bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden max-w-4xl w-full flex flex-col h-[min(650px,calc(100dvh-2rem))] z-10"
            >
              {/* Header */}
              <div className="px-6 py-5 border-b border-slate-150 flex items-center justify-between bg-slate-50/50">
                <h3 id="cookie-preferences-title" className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                  <ShieldCheck className="w-6 h-6 text-[#4B27B1]" />
                  {tLocal.modalTitle}
                </h3>

                <div className="flex items-center gap-4">
                  {/* Language Selector Dropdown */}
                  <div className="relative">
                    <select
                      value={language}
                      onChange={(e) => handleLanguageChange(e.target.value as Language)}
                      className="appearance-none bg-white border border-slate-200 hover:border-slate-300 rounded-lg pl-3 pr-8 py-1.5 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#4B27B1]/30 cursor-pointer shadow-sm"
                    >
                      {languagesList.map((lang) => (
                        <option key={lang.code} value={lang.code}>
                          {lang.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>

                  {/* Close Button */}
                  <button
                    type="button"
                    onClick={() => setShowPreferencesModal(false)}
                    aria-label={ariaText.close}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Central Content Split Panel */}
              <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
                {/* Left Tabs Column */}
                <div role="tablist" aria-label={ariaText.categories} className="w-full md:w-64 bg-slate-50 border-r border-slate-200 flex-shrink-0 flex flex-row md:flex-col overflow-x-auto md:overflow-x-visible md:overflow-y-auto scrollbar-none border-b md:border-b-0">
                  {[
                    { id: 'privacy', label: tLocal.tabs.privacy },
                    { id: 'necessary', label: tLocal.tabs.necessary },
                    { id: 'functionality', label: tLocal.tabs.functionality },
                    { id: 'tracking', label: tLocal.tabs.tracking },
                    { id: 'targeting', label: tLocal.tabs.targeting },
                    { id: 'more', label: tLocal.tabs.more }
                  ].map((tab) => {
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        type="button"
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        role="tab"
                        aria-selected={isActive}
                        className={`px-5 py-3 md:py-4 text-left text-xs md:text-sm font-bold tracking-tight border-b md:border-b-0 md:border-l-4 transition-all duration-200 whitespace-nowrap md:whitespace-normal flex-shrink-0 ${
                          isActive
                            ? 'border-[#4B27B1] text-[#4B27B1] bg-purple-50/50 md:bg-purple-50/30'
                            : 'border-transparent text-slate-600 hover:text-[#4B27B1] hover:bg-slate-100/50'
                        }`}
                      >
                        {tab.label}
                      </button>
                    );
                  })}
                </div>

                {/* Right Tab Content Pane */}
                <div role="tabpanel" className="flex-1 p-6 md:p-10 overflow-y-auto text-left flex flex-col justify-between">
                  <div className="space-y-4">
                    {activeTab === 'privacy' && (
                      <>
                        <h4 className="text-xl font-bold text-slate-900 tracking-tight">{tLocal.content.privacy.title}</h4>
                        <p className="text-slate-600 text-sm leading-relaxed">{tLocal.content.privacy.p1}</p>
                        <p className="text-slate-600 text-sm leading-relaxed">{tLocal.content.privacy.p2}</p>
                      </>
                    )}

                    {activeTab === 'necessary' && (
                      <>
                        <h4 className="text-xl font-bold text-slate-900 tracking-tight">{tLocal.content.necessary.title}</h4>
                        <p className="text-slate-600 text-sm leading-relaxed">{tLocal.content.necessary.p1}</p>
                        <p className="text-slate-600 text-sm leading-relaxed">{tLocal.content.necessary.p2}</p>
                        <Toggle active={true} disabled={true} label={tLocal.tabs.necessary} />
                      </>
                    )}

                    {activeTab === 'functionality' && (
                      <>
                        <h4 className="text-xl font-bold text-slate-900 tracking-tight">{tLocal.content.functionality.title}</h4>
                        <p className="text-slate-600 text-sm leading-relaxed">{tLocal.content.functionality.p1}</p>
                        <p className="text-slate-600 text-sm leading-relaxed">{tLocal.content.functionality.p2}</p>
                        <Toggle
                          active={preferences.functionality}
                          label={tLocal.tabs.functionality}
                          onChange={() => togglePreference('functionality')}
                        />
                      </>
                    )}

                    {activeTab === 'tracking' && (
                      <>
                        <h4 className="text-xl font-bold text-slate-900 tracking-tight">{tLocal.content.tracking.title}</h4>
                        <p className="text-slate-600 text-sm leading-relaxed">{tLocal.content.tracking.p1}</p>
                        <p className="text-slate-600 text-sm leading-relaxed">{tLocal.content.tracking.p2}</p>
                        <p className="text-slate-600 text-sm leading-relaxed">{tLocal.content.tracking.p3}</p>
                        <Toggle
                          active={preferences.tracking}
                          label={tLocal.tabs.tracking}
                          onChange={() => togglePreference('tracking')}
                        />
                      </>
                    )}

                    {activeTab === 'targeting' && (
                      <>
                        <h4 className="text-xl font-bold text-slate-900 tracking-tight">{tLocal.content.targeting.title}</h4>
                        <p className="text-slate-600 text-sm leading-relaxed">{tLocal.content.targeting.p1}</p>
                        <p className="text-slate-600 text-sm leading-relaxed">{tLocal.content.targeting.p2}</p>
                        <p className="text-slate-600 text-sm leading-relaxed">{tLocal.content.targeting.p3}</p>
                        <Toggle
                          active={preferences.targeting}
                          label={tLocal.tabs.targeting}
                          onChange={() => togglePreference('targeting')}
                        />
                      </>
                    )}

                    {activeTab === 'more' && (
                      <>
                        <h4 className="text-xl font-bold text-slate-900 tracking-tight">{tLocal.content.more.title}</h4>
                        <p className="text-slate-600 text-sm leading-relaxed">{tLocal.content.more.p1}</p>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Bottom Footer Action Bar */}
              <div className="px-6 py-4 border-t border-slate-150 flex flex-col sm:flex-row items-center justify-between bg-slate-50 gap-4">
                <div className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5" />
                  {tLocal.consentBy}
                </div>

                <div className="flex gap-3 w-full sm:w-auto justify-end">
                  <button
                    type="button"
                    onClick={handleDecline}
                    className="px-5 py-2.5 text-xs md:text-sm font-bold text-slate-500 hover:text-slate-700 transition-colors"
                  >
                    {tLocal.btnDecline}
                  </button>
                  <button
                    type="button"
                    onClick={handleAccept}
                    className="px-5 py-2.5 text-xs md:text-sm font-bold text-[#4B27B1] hover:text-white bg-purple-50 hover:bg-[#4B27B1] border border-[#4B27B1]/30 hover:border-transparent rounded-lg transition-all"
                  >
                    {tLocal.btnAcceptAll}
                  </button>
                  <button
                    type="button"
                    onClick={handleSavePreferences}
                    className="px-6 py-2.5 text-xs md:text-sm font-extrabold text-white bg-gradient-to-r from-[#4B27B1] to-[#3a1d91] hover:from-[#FF8A00] hover:to-[#e67c00] rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    {tLocal.btnSave}
                  </button>
                </div>
              </div>
            </div>
          </div>
      )}
    </>
  );
}
