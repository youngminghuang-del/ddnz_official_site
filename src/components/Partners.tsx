import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { trackEvent } from '../lib/utils';
import { 
  HelpCircle, 
  ChevronDown, 
  Search, 
  ShieldCheck, 
  FileText, 
  Truck, 
  AlertTriangle, 
  Coins, 
  X,
  MessageSquare
} from 'lucide-react';

interface FAQItem {
  id: number;
  category: 'cred' | 'terms' | 'shipping' | 'issues' | 'quality';
  icon: React.ComponentType<{ className?: string }>;
  question: {
    zh: string;
    en: string;
    ru: string;
    fr: string;
  };
  answer: {
    zh: string;
    en: string;
    ru: string;
    fr: string;
  };
}

type SupportedFaqLanguage = 'zh' | 'en' | 'ru' | 'fr' | 'es' | 'ar';
type SupplementalFaqLanguage = 'es' | 'ar';

const faqData: FAQItem[] = [
  {
    id: 1,
    category: 'cred',
    icon: ShieldCheck,
    question: {
      zh: '我该如何选择靠谱的中国国际货运代理公司？',
      en: 'How do I choose a reliable international freight forwarder in China?',
      ru: 'Как мне выбрать надежного международного экспедитора в Китае?',
      fr: 'Comment choisir un commissionnaire de transport international fiable en Chine ?'
    },
    answer: {
      zh: '建议从三方面考察：一是查看公司是否具备正规资质（如无船承运人NVOCC备案、营业执照）；二是评估其服务网络，是否覆盖您目的港的主要航线；三是通过客户评价、行业展会记录或第三方平台（如锦程物流网、阿里巴巴物流频道）核实口碑。同时要求对方提供真实案例和运价明细，避免隐形收费。',
      en: 'We recommend evaluating them on three fronts: First, check regulatory credentials (e.g., NVOCC registration, business license). Second, assess their service network and whether it covers major shipping routes to your destination port. Third, verify their reputation via customer reviews, industry trade show records, or third-party logistics directories (like JCtrans or Alibaba Logistics). Always request actual case studies and transparent, itemized quotes to prevent hidden fees.',
      ru: 'Мы рекомендуем оценивать их по трем направлениям: во-первых, проверьте наличие официальных лицензий (например, регистрацию NVOCC, бизнес-лицензию); во-вторых, оцените сеть обслуживания и то, охватывает ли она основные маршруты до вашего порта назначения; в-третьих, проверьте репутацию по отзывам клиентов или на логистических платформах. Всегда требуйте реальные кейсы и детализированную смету без скрытых платежей.',
      fr: 'Nous vous conseillons d\'analyser trois aspects : d\'abord, les certifications officielles (agrément NVOCC, licence commerciale) ; ensuite, l\'étendue de leur réseau et leur couverture des lignes maritimes vers vos ports de destination ; enfin, leur réputation via les avis clients ou annuaires professionnels (comme JCtrans ou Alibaba Logistics). Exigez toujours des cas réels et un devis transparent et détaillé pour éviter tout frais masqué.'
    }
  },
  {
    id: 2,
    category: 'cred',
    icon: FileText,
    question: {
      zh: '如何验证中国厂家的真实性，防止被骗？',
      en: 'How can I verify the authenticity of a Chinese factory to avoid scams?',
      ru: 'Как проверить подлинность китайского завода и избежать мошенничества?',
      fr: 'Comment vérifier l\'authenticité d\'un fabricant chinois pour éviter les arnaques ?'
    },
    answer: {
      zh: '可采取以下步骤：①要求提供营业执照并登录“国家企业信用信息公示系统”核对；②申请视频验厂或委托第三方机构（如SGS、TÜV）实地审核；③查看工厂是否拥有出口权（海关编码）、产品认证（CE、FCC等）；④通过阿里巴巴金品诚企、中国制造网认证标识辅助判断；⑤小额试单测试产品质量与交货能力。',
      en: 'Take these five steps: ① Request their business license and verify it on the National Enterprise Credit Information Publicity System; ② Arrange a live video walk-through or hire third-party inspection firms (e.g., SGS, TÜV) for on-site audits; ③ Verify if the factory holds direct export rights (customs registration code) and necessary product certifications (CE, FCC, etc.); ④ Look for verified gold badges on trade portals like Alibaba (Verified Supplier) or Made-in-China; ⑤ Place a small trial order first to test their actual product quality and lead times.',
      ru: 'Предпримите следующие шаги: ① Запросите бизнес-лицензию и проверьте её в Государственной системе раскрытия кредитной информации предприятий; ② Организуйте видеоэкскурсию или наймите стороннее инспекционное агентство (например, SGS, TÜV) для аудита; ③ Убедитесь, что у завода есть экспортные права (таможенный код) и сертификаты качества (CE, FCC и др.); ④ Проверьте статус верификации на Alibaba или Made-in-China; ⑤ Разместите пробный мини-заказ для оценки качества и сроков.',
      fr: 'Suivez ces cinq étapes clés : ① Demandez leur licence commerciale et vérifiez-la sur le Système National d\'Information sur le Crédit des Entreprises ; ② Planifiez une visite d\'usine par vidéo ou mandatez un organisme tiers (SGS, TÜV) pour un audit physique ; ③ Vérifiez s\'ils possèdent des droits d\'exportation directs (code douanier) et les certifications requises (CE, FCC, etc.) ; ④ Utilisez les statuts de fournisseurs vérifiés sur Alibaba ou Made-in-China ; ⑤ Lancez une petite commande d\'essai pour tester la qualité et la réactivité.'
    }
  },
  {
    id: 3,
    category: 'terms',
    icon: Truck,
    question: {
      zh: '从中国进口货物，常见的贸易术语（Incoterms）怎么选最安全？',
      en: 'Which Incoterms should I choose for the safest imports from China?',
      ru: 'Какие условия поставок (Incoterms) выбрать для наиболее безопасного импорта из Китая?',
      fr: 'Quels Incoterms devrais-je choisir pour importer en toute sécurité depuis la Chine ?'
    },
    answer: {
      zh: '对新手买家推荐FOB（装运港船上交货）或CIF（成本、保险费加运费）。FOB由您指定货代，控制运输环节；CIF则由卖方负责海运与保险，适合小批量采购。若希望全程可控，可选用EXW（工厂交货），但需自行安排所有物流，风险较高。务必在合同中明确费用分摊节点。',
      en: 'For new buyers, we recommend FOB (Free on Board) or CIF (Cost, Insurance, and Freight). Under FOB, you appoint your own forwarder, maintaining full control over transport and local costs. Under CIF, the seller arranges freight and basic insurance, ideal for small batches. If you want maximum supply chain control, you can choose EXW (Ex Works), but this requires managing all logistics from the factory door, presenting a higher risk. Always clarify cost transfer points clearly in your sales contract.',
      ru: 'Новичкам рекомендуются условия FOB (Франко-борт) или CIF (Стоимость, страхование и фрахт). При FOB вы назначаете своего экспедитора и контролируете доставку; при CIF продавец оплачивает фрахт и страховку, что подходит для небольших партий. Если вы хотите полностью контролировать цепочку, выберите EXW (Франко-завод), но помните, что все риски и расходы по вывозу ложатся на вас. Четко прописывайте точки перехода ответственности в контракте.',
      fr: 'Pour les acheteurs débutants, nous recommandons le FOB (Free on Board) ou le CIF (Cost, Insurance, et Freight). Avec le FOB, vous nommez votre propre transitaire, ce qui vous permet de maîtriser l\'expédition de bout en bout. Avec le CIF, le vendeur organise le fret et l\'assurance de base, ce qui est idéal pour les petits volumes. Si vous souhaitez un contrôle absolu, choisissez l\'EXW (Ex Works), mais cela implique de gérer toute la logistique depuis les portes de l\'usine, ce qui est plus risqué. Précisez toujours clairement la répartition des frais dans le contrat.'
    }
  },
  {
    id: 4,
    category: 'terms',
    icon: FileText,
    question: {
      zh: '中国出口到我的国家，清关需要哪些文件？容易遇到什么问题？',
      en: 'What customs clearance documents are needed for exporting from China, and what are the common issues?',
      ru: 'Какие документы нужны для таможенного оформления экспорта из Китая и с какими проблемами можно столкнуться?',
      fr: 'Quels documents sont requis pour le dédouanement depuis la Chine et quels sont les problèmes fréquents ?'
    },
    answer: {
      zh: '核心单据包括：商业发票、装箱单、原产地证（CO或FORM A/F/E）、提单、保险单、可能需要的检验证书（如植物检疫、卫生证）。常见问题：HS编码归类错误导致关税差异、原产地证未及时办理、唛头不符被扣货。建议提前与货代确认目的港特殊要求（如欧盟REACH法规、美国FDA）。',
      en: 'The core documents include the Commercial Invoice, Packing List, Certificate of Origin (CO, or FORM A/E/F), Bill of Lading (B/L), Insurance Policy, and any required inspection certificates (such as phytosanitary or health certificates). Common pitfalls include: Incorrect HS code classification leading to tariff disputes, delayed Certificates of Origin, and shipping mark discrepancies causing hold-ups. We strongly advise pre-clearing destination-specific requirements (e.g., REACH for EU, FDA for USA) with your forwarder.',
      ru: 'Основные документы: коммерческий инвойс, упаковочный лист, сертификат происхождения (CO или FORM A/E/F), коносамент (B/L), страховой полис и фитосанитарные/ветеринарные сертификаты при необходимости. Частые проблемы: неверная классификация кодов ТН ВЭД (тарифные споры), задержки в оформлении сертификатов происхождения, несоответствие маркировки. Заранее согласуйте требования страны назначения (например, REACH для ЕС или FDA для США) со своим экспедитором.',
      fr: 'Les documents clés comprennent : la facture commerciale, la liste de colisage (packing list), le certificat d\'origine (CO, ou FORM A/E/F), le connaissement (B/L), la police d\'assurance et d\'éventuels certificats d\'inspection (phytosanitaire, sanitaire). Problèmes fréquents : mauvaise classification du code SH entraînant des amendes, certificats d\'origine manquants, ou marquages de colis non conformes. Validez toujours au préalable les réglementations de votre pays (par ex. REACH pour l\'UE, FDA pour les États-Unis) avec votre transitaire.'
    }
  },
  {
    id: 5,
    category: 'shipping',
    icon: Truck,
    question: {
      zh: '拼箱（LCL）和整柜（FCL）分别适合什么情况？哪个更划算？',
      en: 'When should I choose LCL vs FCL shipping, and which is more cost-effective?',
      ru: 'Когда выбирать доставку в сборных контейнерах (LCL), а когда целыми контейнерами (FCL), и что выгоднее?',
      fr: 'Quand choisir l\'expédition en LCL (groupage) ou en FCL (conteneur complet), et qu\'est-ce qui est le plus avantageux ?'
    },
    answer: {
      zh: '当货物体积不足15立方米时，通常拼箱更经济；超过15立方米则整柜性价比更高。拼箱需注意：等待其他货物拼满才发船，时效不稳定；多次装卸易损坏。整柜可门到门，减少中转风险。建议根据货量、紧急程度和货物价值综合计算，并要求货代提供两种方案的详细报价对比。',
      en: 'LCL (Less than Container Load) is usually more economical for shipments under 15 cubic meters (CBM), while FCL (Full Container Load) is highly cost-effective for cargo exceeding 15 CBM. Note that LCL shipments require consolidated packing, which might cause minor transit delays and involves more cargo handling, increasing damage risk. FCL offers direct door-to-door transit and minimal handling. We advise requesting quotes for both options from your freight forwarder to calculate the ideal solution based on volume, urgency, and cargo value.',
      ru: 'Сборные грузы (LCL) обычно выгоднее при объеме до 15 куб. м (CBM), в то время как целые контейнеры (FCL) экономичнее при объеме более 15 куб. м. Помните: LCL требует консолидации, что может вызвать задержки, а частые погрузочно-разгрузочные работы повышают риск повреждения. FCL обеспечивает доставку напрямую «от двери до двери». Рекомендуем запросить у экспедитора расчет для обоих вариантов, исходя из объема, срочности и стоимости груза.',
      fr: 'Le LCL (Less than Container Load) est généralement plus économique pour les volumes inférieurs à 15 mètres cubes (CBM), tandis que le FCL (Full Container Load) devient plus rentable au-delà de cette limite. Attention : le LCL implique une consolidation des marchandises, ce qui peut rallonger les délais et multiplier les manipulations de colis. Le FCL offre un trajet direct porte-à-porte et sécurisé. Nous vous conseillons de demander les deux devis à votre transitaire pour comparer selon le volume, l\'urgence et la fragilité de vos produits.'
    }
  },
  {
    id: 6,
    category: 'shipping',
    icon: Coins,
    question: {
      zh: '海运费波动很大，如何锁定成本？有没有长期合作优惠？',
      en: 'Ocean freight rates fluctuate constantly. How can I lock in costs? Are there long-term partnership benefits?',
      ru: 'Ставки морского фрахта сильно колеблются. Как зафиксировать расходы и есть ли скидки при долгосрочном сотрудничестве?',
      fr: 'Les tarifs de fret maritime fluctuent constamment. Comment sécuriser mes coûts ? Y a-t-il des remises à long terme ?'
    },
    answer: {
      zh: '可与货代签订季度或年度合约价，约定固定费率或浮动上限。部分大型货代提供“运费期货”类服务，支付少量保证金锁定未来运价。另外，选择非高峰月份出货、合并多批次订单、采用内陆联运替代纯海运都能降低成本。长期合作客户通常能获得额外折扣和优先舱位。',
      en: 'You can sign quarterly or annual contract rates with your freight forwarder to agree on fixed rates or cap maximum surcharges. Many top-tier forwarders offer allocation agreements with a deposit to secure space and prices. Additionally, scheduling shipments during off-peak seasons, consolidating multiple orders, or utilizing multimodal transport options can significantly lower overall logistics budgets. Long-term strategic partners benefit from discounted service fees and priority space guarantees during peak shipping periods.',
      ru: 'Вы можете подписать квартальный или годовой контракт со своим экспедитором, зафиксировав базовые ставки или ограничив максимальные надбавки. Дополнительно снизить затраты поможет планирование отгрузок во внепиковый сезон, консолидация заказов или мультимодальная доставка. Постоянные партнеры всегда получают дополнительные скидки и гарантированные места на судах в пиковые периоды.',
      fr: 'Vous pouvez signer des contrats tarifaires trimestriels ou annuels avec votre transitaire pour convenir de taux fixes ou plafonnés. De plus, expédier hors saison de pointe, regrouper plusieurs commandes ou utiliser des solutions multimodales (mer-rail-air) aide à limiter l\'exposition aux hausses. Les partenaires réguliers à long terme bénéficient de tarifs préférentiels et d\'une garantie d\'espace prioritaire sur les navires en période de forte affluence.'
    }
  },
  {
    id: 7,
    category: 'issues',
    icon: Coins,
    question: {
      zh: '样品费和国际快递费应该由谁承担？怎么谈才不伤和气？',
      en: 'Who should bear sample and international courier costs? How do I negotiate this amicably?',
      ru: 'Кто должен оплачивать стоимость образцов и международную курьерскую доставку? Как договориться без разногласий?',
      fr: 'Qui doit payer les échantillons et les frais de coursier international ? Comment négocier cela au mieux ?'
    },
    answer: {
      zh: '行业惯例：小样（如布料、电子元件）供应商免费提供，买家付运费；大样或定制模具费双方各半。谈判时可提出“若后续订单达到一定金额，退还样品费”，或采用DDP（完税交付）方式让供应商承担全部费用并计入首批货款。保持礼貌，强调合作诚意，多数中国供应商愿意灵活协商。',
      en: 'Standard industry practice dictates that suppliers provide basic/small samples (e.g., fabric swatches, simple electronic components) free of charge while the buyer pays the courier fee. For complex prototypes or custom mold making, costs are often split 50/50. To negotiate smoothly, suggest a clause stating that "sample fees will be fully refunded or credited towards the first mass production deposit." Emphasize your long-term intent, as most Chinese suppliers are very open to flexible, mutual arrangements.',
      ru: 'Согласно общепринятой практике, небольшие и простые образцы (например, ткань, электронные компоненты) поставщик предоставляет бесплатно, а покупатель оплачивает экспресс-доставку. Для сложных прототипов или пресс-форм расходы делятся пополам. Для успешных переговоров предложите условие: «стоимость образцов будет полностью возмещена или вычтена из суммы первого оптового заказа». Большинство китайских поставщиков охотно идут навстречу при серьезных намерениях.',
      fr: 'L\'usage veut que le fournisseur fournisse les échantillons simples gratuitement, tandis que l\'acheteur prend à sa charge les frais d\'expédition express. Pour les prototypes complexes ou les moules sur mesure, les coûts sont souvent partagés à 50/50. Pour négocier sereinement, proposez d\'insérer une clause : « Les frais d\'échantillon seront intégralement déduits de l\'acompte de la première commande finale. » Valorisez votre projet à long terme, les fabricants chinois apprécient cette flexibilité.'
    }
  },
  {
    id: 8,
    category: 'issues',
    icon: AlertTriangle,
    question: {
      zh: '货物在中国港口滞留产生高额滞箱费怎么办？',
      en: 'What should I do if my cargo is delayed at a Chinese port and incurs high demurrage/detention fees?',
      ru: 'Что делать, если груз задерживается в порту Китая и начисляются высокие сборы за демередж/детеншен?',
      fr: 'Que faire si ma cargaison est bloquée dans un port chinois et génère des frais de surestaries (demurrage) élevés ?'
    },
    answer: {
      zh: '首先确认原因：如果是货代订舱失误或船公司甩柜，应由责任方承担；若是您自身文件延迟或收货人弃货，需尽快联系货代申请减免（一般可争取3-7天免堆期）。预防措施：提前备齐报关资料，预留至少2-3天缓冲时间；购买货物运输险覆盖部分滞期损失；与船公司签订长期协议获取免费延长期。',
      en: 'First, pinpoint the root cause. If the delay is caused by forwarder booking errors or carrier roll-overs, the responsible party should bear the cost. If it arises from delayed custom documents or recipient issues on your end, contact your forwarder immediately to negotiate with the ocean carrier for a waiver (often securing an extra 3–7 free days). Preventive measures include: Preparing export declarations 2-3 days in advance, purchasing cargo insurance that covers demurrage losses, and relying on forwarders with established service-level agreements with carriers.',
      ru: 'Сначала выясните причину. Если задержка произошла из-за ошибок экспедитора или перевозчика, расходы несет ответственная сторона. Если дело в задержке ваших документов, немедленно свяжитесь с экспедитором для ведения переговоров с линией о скидках или продлении свободного времени. Меры профилактики: готовьте документы за 2-3 дня до затаможки, оформляйте страхование грузов и работайте с авторитетными экспедиторами.',
      fr: 'Identifiez d\'abord la cause. S\'il s\'agit d\'une erreur de réservation du transitaire ou d\'un report de navire (roll-over) par la compagnie, la partie responsable doit payer. S\'il s\'agit d\'un retard de vos documents de douane, contactez votre transitaire immédiatement pour négocier une réduction de frais auprès de l\'armateur (on peut souvent obtenir une extension de franchise de 3 à 7 jours). Astuces préventives : préparez vos déclarations d\'exportation 3 jours à l\'avance et souscrivez à une assurance cargo adaptée.'
    }
  },
  {
    id: 9,
    category: 'quality',
    icon: ShieldCheck,
    question: {
      zh: '如何确保中国工厂的产品质量符合我的标准？',
      en: 'How can I ensure the products manufactured by a Chinese factory meet my quality standards?',
      ru: 'Как убедиться, что качество продукции китайского завода соответствует моим стандартам?',
      fr: 'Comment m\'assurer que la qualité des produits fabriqués par l\'usine chinoise respecte mes exigences ?'
    },
    answer: {
      zh: '建议三步走：①下单前提供详细技术规格书（含图纸、材料、公差、测试方法）；②生产过程中委托第三方验货（中期检验、出货前抽检）；③要求工厂提供首件确认报告。重要品类（如玩具、电器）还需取得目的地强制认证。保留样品作为仲裁依据，并在合同里写明质量不符的赔偿条款。',
      en: 'We recommend a three-tiered approach: ① Provide a highly detailed Technical Specification Sheet (including exact blueprints, materials, tolerances, and testing methods) before placing the order; ② Appoint an independent third-party inspection agency (such as SGS or QIMA) to conduct in-line and pre-shipment inspections; ③ Always request a Golden Sample for final pre-production sign-off. For regulated categories (like electronics or toys), verify compliance certificates required in your country. Include clear quality dispute and penalty clauses in your contracts.',
      ru: 'Мы рекомендуем трехэтапный подход: ① Предоставьте подробную техническую спецификацию (чертежи, материалы, допуски, методы испытаний) перед размещением заказа; ② Поручите независимой инспекционной компании (например, SGS или QIMA) провести проверку на линии сборки и перед отправкой; ③ Требуйте предоставления эталонного образца. Для регулируемых товаров убедитесь в наличии обязательных сертификатов. Обязательно фиксируйте штрафные санкции за брак в контракте.',
      fr: 'Suivez cette approche en 3 étapes : ① Fournissez une fiche technique ultra-détaillée (plans, matériaux, tolérances, critères de test) avant de valider la commande ; ② Mandatez un organisme de contrôle indépendant (comme SGS ou QIMA) pour effectuer des inspections en cours de production et avant expédition ; ③ Validez toujours un « échantillon témoin » (Golden Sample). Prévoyez des clauses de pénalités claires dans votre contrat d\'achat en cas de non-conformité.'
    }
  },
  {
    id: 10,
    category: 'quality',
    icon: Coins,
    question: {
      zh: '付款方式上，T/T和L/C哪种更适合国际贸易新手？',
      en: 'Is T/T or L/C payment better for international trade beginners?',
      ru: 'Какой способ оплаты лучше подходит для начинающих импортеров: T/T или L/C?',
      fr: 'Quel mode de paiement est le plus adapté pour débuter : le virement T/T ou la Lettre de Crédit (L/C) ?'
    },
    answer: {
      zh: '初期建议采用30%预付款T/T + 70%见提单副本付清，平衡双方风险。信用证（L/C）安全性高但操作复杂，银行审单严格，稍有瑕疵即可能拒付，适合熟悉流程的买家。若供应商信誉好，也可尝试阿里巴巴信保或PayPal等第三方担保支付。无论哪种方式，都要警惕全额预付或异常低价的诱惑。',
      en: 'For beginners, we recommend a split Telegraphic Transfer (T/T), specifically 30% advance deposit and 70% payment against the copy of the Bill of Lading (B/L), which balances the risk between buyer and seller. Letters of Credit (L/C) offer high security but are highly complex with strict banking compliance, where even minor documentation discrepancies can lead to payment rejections. Alternatively, secure platform escrows (such as Alibaba Trade Assurance) provide excellent transactional protection for initial trades. Never agree to 100% upfront T/T with unverified suppliers.',
      ru: 'Для начала мы рекомендуем комбинированный телеграфный перевод (T/T): 30% предоплаты и 70% оплаты против копии коносамента (B/L), что балансирует риски. Аккредитив (L/C) обеспечивает высокую безопасность, но он сложен в оформлении, и малейшая неточность в документах может привести к блокировке платежа банком. Альтернативой может стать торговая гарантия (Alibaba Trade Assurance) для первых сделок. Никогда не вносите 100% предоплату непроверенным поставщикам.',
      fr: 'Pour les débutants, nous recommandons le virement bancaire (T/T) fractionné : un acompte de 30 % à la commande, et le solde de 70 % contre présentation d\'une copie du connaissement (B/L). Cela équilibre le risque entre l\'acheteur et le vendeur. La Lettre de Crédit (L/C) est très sécurisée mais complexe à gérer, la moindre erreur de frappe pouvant bloquer les fonds. Privilégiez l\'Alibaba Trade Assurance pour les premières transactions, et fuyez les demandes d\'acompte à 100 % de fournisseurs non certifiés.'
    }
  }
];

const supplementalFaqTranslations: Record<
  SupplementalFaqLanguage,
  Record<number, { question: string; answer: string }>
> = {
  es: {
    1: {
      question: '¿Cómo elijo un transitario internacional fiable en China?',
      answer: 'Compruebe la licencia comercial y el registro NVOCC, confirme que su red cubre el puerto de destino y revise referencias verificables. Pida un presupuesto desglosado, condiciones de pago claras y ejemplos reales de embarques similares antes de reservar.'
    },
    2: {
      question: '¿Cómo verifico que una fábrica china es real y evito fraudes?',
      answer: 'Solicite la licencia comercial y verifíquela en el registro empresarial chino. Organice una videovisita en directo o una auditoría presencial, confirme los certificados del producto y empiece con una orden de prueba antes de aumentar el volumen.'
    },
    3: {
      question: '¿Qué Incoterm conviene para importar con más seguridad desde China?',
      answer: 'FOB suele dar al comprador mayor control sobre el transporte principal. CIF puede simplificar una compra pequeña, pero debe revisar qué costes quedan fuera. EXW exige gestionar la recogida y la exportación desde fábrica. Defina por contrato el punto exacto de transferencia de costes y riesgos.'
    },
    4: {
      question: '¿Qué documentos necesito para el despacho de aduanas y qué errores son frecuentes?',
      answer: 'Normalmente se requieren factura comercial, lista de empaque, conocimiento de embarque o guía aérea y, cuando corresponda, certificado de origen, seguro o certificados técnicos. Los problemas más comunes son códigos HS incorrectos, valores incoherentes y marcas de bultos que no coinciden.'
    },
    5: {
      question: '¿Cuándo conviene usar LCL o FCL?',
      answer: 'LCL suele ser práctico para volúmenes pequeños y FCL ofrece mayor control cuando el volumen se acerca a la capacidad de un contenedor. Compare el coste total, no solo el flete: consolidación, manipulación, riesgo de daños, tiempo de tránsito y gastos en destino.'
    },
    6: {
      question: '¿Cómo puedo controlar la variación de las tarifas marítimas?',
      answer: 'Solicite validez y recargos por escrito, planifique con antelación y compare una tarifa puntual con una asignación mensual o trimestral. Consolidar pedidos y evitar semanas punta también puede reducir exposición. La tarifa final depende de ruta, equipo, temporada y disponibilidad.'
    },
    7: {
      question: '¿Quién paga las muestras y el envío internacional?',
      answer: 'En muchas operaciones el proveedor cubre una muestra básica y el comprador paga el mensajero. Los prototipos o moldes personalizados suelen negociarse por separado. Puede acordar que el coste de la muestra se descuente de la primera orden de producción.'
    },
    8: {
      question: '¿Qué hago si la carga se retrasa y genera demoras o detención?',
      answer: 'Identifique primero si el retraso proviene de documentos, aduanas, terminal, transportista o destinatario. Pida al transitario un desglose diario, la fecha límite de tiempo libre y opciones de retirada o devolución. Documente la causa antes de negociar una reducción de cargos.'
    },
    9: {
      question: '¿Cómo aseguro que la calidad de fábrica cumple mis requisitos?',
      answer: 'Prepare una especificación con materiales, tolerancias, embalaje y método de prueba. Apruebe una muestra patrón y programe inspecciones durante la producción o antes del embarque. El contrato debe indicar el criterio de aceptación y la solución ante no conformidades.'
    },
    10: {
      question: '¿Es mejor pagar por T/T o por carta de crédito?',
      answer: 'T/T fraccionado es más sencillo, pero el calendario debe vincularse a hitos verificables. La carta de crédito reduce ciertos riesgos en operaciones mayores, aunque exige documentos exactos y costes bancarios. No pague el total por adelantado a un proveedor no verificado.'
    }
  },
  ar: {
    1: {
      question: 'كيف أختار وكيل شحن دولي موثوقا في الصين؟',
      answer: 'تحقق من الرخصة التجارية وتسجيل NVOCC، وتأكد من تغطية شبكة الخدمة لميناء الوصول. اطلب مراجع قابلة للتحقق، وأمثلة لشحنات مشابهة، وعرض سعر مفصل يوضح الرسوم وشروط الدفع قبل الحجز.'
    },
    2: {
      question: 'كيف أتحقق من أن المصنع الصيني حقيقي وأتجنب الاحتيال؟',
      answer: 'اطلب الرخصة التجارية وتحقق منها في السجل الوطني للشركات في الصين. رتب جولة فيديو مباشرة أو تدقيقا ميدانيا، وافحص شهادات المنتج، وابدأ بطلبية اختبار صغيرة قبل زيادة الكمية.'
    },
    3: {
      question: 'ما شرط Incoterms الأنسب للاستيراد الآمن من الصين؟',
      answer: 'يمنح FOB المشتري عادة تحكما أكبر في الشحن الرئيسي. قد يكون CIF أسهل للشحنات الصغيرة، لكن يجب مراجعة الرسوم غير المشمولة. يتطلب EXW إدارة الاستلام والتصدير من باب المصنع. حدد نقطة انتقال التكلفة والمخاطر بوضوح في العقد.'
    },
    4: {
      question: 'ما مستندات التخليص الجمركي المطلوبة وما الأخطاء الشائعة؟',
      answer: 'تشمل المستندات الأساسية الفاتورة التجارية وقائمة التعبئة وبوليصة الشحن أو الشحن الجوي. قد يلزم أيضا إثبات المنشأ أو التأمين أو شهادات فنية. أكثر المشكلات شيوعا هي رمز HS غير الصحيح، وتعارض القيم، وعدم تطابق علامات الطرود.'
    },
    5: {
      question: 'متى أختار الشحن الجزئي LCL أو الحاوية الكاملة FCL؟',
      answer: 'يناسب LCL الأحجام الصغيرة غالبا، بينما يمنح FCL تحكما أفضل عندما تقترب الكمية من سعة الحاوية. قارن التكلفة الكاملة التي تشمل التجميع والمناولة والوقت ورسوم الوجهة، وليس سعر الشحن الأساسي فقط.'
    },
    6: {
      question: 'كيف أتحكم في تقلب أسعار الشحن البحري؟',
      answer: 'اطلب مدة صلاحية السعر والرسوم الإضافية كتابة، وخطط مبكرا، وقارن السعر الفوري باتفاق شهري أو ربع سنوي. يساعد دمج الطلبات وتجنب أسابيع الذروة على تقليل التعرض للتقلب. يعتمد السعر النهائي على المسار والموسم وتوفر المعدات.'
    },
    7: {
      question: 'من يتحمل تكلفة العينات والشحن السريع الدولي؟',
      answer: 'في كثير من الصفقات يقدم المورد العينة الأساسية ويدفع المشتري تكلفة البريد السريع. يتم التفاوض بشكل منفصل على النماذج المعقدة أو القوالب. يمكن الاتفاق على خصم تكلفة العينة من أول طلبية إنتاج.'
    },
    8: {
      question: 'ماذا أفعل إذا تأخرت الشحنة وتراكمت رسوم الأرضيات أو الاحتجاز؟',
      answer: 'حدد أولا ما إذا كان السبب في المستندات أو الجمارك أو المحطة أو الناقل أو المستلم. اطلب بيانا يوميا للرسوم وآخر يوم مجاني وخيارات سحب الحاوية أو إعادتها. وثق السبب قبل التفاوض على تخفيض الرسوم.'
    },
    9: {
      question: 'كيف أضمن مطابقة جودة المصنع لمتطلباتي؟',
      answer: 'أعد مواصفة واضحة للمواد والأبعاد والتفاوتات والتعبئة وطريقة الاختبار. اعتمد عينة مرجعية ورتب فحصا أثناء الإنتاج أو قبل الشحن. يجب أن يحدد العقد معيار القبول والإجراء المتفق عليه عند وجود عدم مطابقة.'
    },
    10: {
      question: 'هل الدفع عبر T/T أم الاعتماد المستندي L/C أفضل للمبتدئ؟',
      answer: 'يعد T/T المجزأ أبسط، لكن اربط كل دفعة بمرحلة يمكن التحقق منها. يوفر الاعتماد المستندي حماية إضافية للصفقات الأكبر، لكنه يتطلب مستندات دقيقة وتكاليف مصرفية. تجنب الدفع الكامل مقدما لمورد غير موثق.'
    }
  }
};

const getFaqText = (
  item: FAQItem,
  language: SupportedFaqLanguage,
  field: 'question' | 'answer'
) => {
  if (language === 'es' || language === 'ar') {
    return supplementalFaqTranslations[language][item.id][field];
  }
  return item[field][language];
};

export default function Partners() {
  const { language } = useLanguage();
  const currentLang: SupportedFaqLanguage = (
    language === 'zh' ||
    language === 'en' ||
    language === 'ru' ||
    language === 'fr' ||
    language === 'es' ||
    language === 'ar'
  ) ? language : 'en';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [openId, setOpenId] = useState<number | null>(null);

  // Localization resources
  const content = {
    title: {
      zh: '中国进口与国际运输实务问答',
      en: 'China Import & Shipping Answers',
      ru: 'Ответы по импорту и доставке из Китая',
      fr: 'Questions pratiques sur l’import et le transport depuis la Chine',
      es: 'Respuestas sobre importación y envíos desde China',
      ar: 'إجابات عملية حول الاستيراد والشحن من الصين'
    },
    subtitle: {
      zh: '面向海外买家的中国采购、付款、验货、清关与国际运输实务解答',
      en: 'Practical guidance for sourcing, payments, inspections, customs and shipping from China.',
      ru: 'Практические рекомендации по закупкам, оплате, инспекции, таможне и доставке из Китая.',
      fr: 'Des réponses pratiques sur les achats, paiements, inspections, douanes et expéditions depuis la Chine.',
      es: 'Orientación práctica sobre compras, pagos, inspecciones, aduanas y envíos desde China.',
      ar: 'إرشادات عملية حول الشراء والدفع والفحص والجمارك والشحن من الصين.'
    },
    searchPlaceholder: {
      zh: '搜索您关心的问题（如：清关、拼箱、付款、产品质量）...',
      en: 'Search trade queries (e.g., customs, LCL, T/T, quality)...',
      ru: 'Поиск вопросов (например: растаможка, LCL, T/T, качество)...',
      fr: 'Rechercher une question (ex : douane, LCL, virement, qualité)...',
      es: 'Buscar temas (aduanas, LCL, T/T, calidad)...',
      ar: 'ابحث عن موضوع مثل الجمارك أو LCL أو الدفع أو الجودة...'
    },
    noResults: {
      zh: '没有找到符合条件的问题。您可以尝试其他关键词。',
      en: 'No matching questions found. Try searching with other keywords.',
      ru: 'Вопросы не найдены. Попробуйте другие ключевые слова.',
      fr: 'Aucun résultat trouvé. Essayez avec d\'autres mots-clés.',
      es: 'No encontramos resultados. Pruebe con otras palabras.',
      ar: 'لم نعثر على نتائج مطابقة. جرب كلمات بحث أخرى.'
    },
    resetSearch: {
      zh: '重置搜索',
      en: 'Reset Search',
      ru: 'Сбросить поиск',
      fr: 'Réinitialiser',
      es: 'Restablecer búsqueda',
      ar: 'إعادة ضبط البحث'
    },
    ctaTitle: {
      zh: '还有其他贸易或物流难题？',
      en: 'Still have other supply chain challenges?',
      ru: 'Остались вопросы по логистике или торговле?',
      fr: 'D\'autres défis logistiques ou commerciaux ?',
      es: '¿Tiene otro reto de comercio o logística?',
      ar: 'هل لديكم تحد آخر في التجارة أو الخدمات اللوجستية؟'
    },
    ctaDesc: {
      zh: '我们的 24/7 国际运营专家随时待命，为您免费提供量身定制的物流航线规划和运费报价。',
      en: 'Our 24/7 Global Operations Desk is ready to provide you with tailored shipping routes and zero-obligation freight quotes.',
      ru: 'Наша круглосуточная служба поддержки 24/7 готова бесплатно рассчитать маршрут и стоимость доставки вашего груза.',
      fr: 'Nos experts de permanence 24h/24 et 7j/7 conçoivent gratuitement vos plans de transport et devis sur mesure.',
      es: 'Nuestro equipo internacional puede preparar una ruta y un presupuesto adaptados a su carga.',
      ar: 'يمكن لفريق العمليات الدولي إعداد مسار وعرض شحن مناسبين لطبيعة بضاعتكم.'
    },
    ctaBtn: {
      zh: '立即获取免费解决方案与报价',
      en: 'Get Free Solution & Quote Now',
      ru: 'Получить бесплатный расчет',
      fr: 'Obtenir mon devis gratuit',
      es: 'Solicitar solución y cotización',
      ar: 'اطلب حلا وعرض سعر'
    }
  };

  const categories = {
    all: { zh: '全部问题', en: 'All topics', ru: 'Все темы', fr: 'Tout', es: 'Todos', ar: 'كل المواضيع' },
    cred: { zh: '资质与验证', en: 'Credentials', ru: 'Проверка фабрик', fr: 'Vérifications', es: 'Verificación', ar: 'التحقق' },
    terms: { zh: '贸易条款', en: 'Incoterms', ru: 'Инкотермс', fr: 'Incoterms', es: 'Incoterms', ar: 'شروط التجارة' },
    shipping: { zh: '运输与费率', en: 'Shipping', ru: 'Доставка и тарифы', fr: 'Expéditions', es: 'Envíos', ar: 'الشحن' },
    issues: { zh: '异常解决', en: 'Issues', ru: 'Решение споров', fr: 'Litiges', es: 'Incidencias', ar: 'المشكلات' },
    quality: { zh: '质量与付款', en: 'Quality & payment', ru: 'Оплата и качество', fr: 'Paiements', es: 'Calidad y pago', ar: 'الجودة والدفع' }
  };

  const filteredFaqs = useMemo(() => {
    return faqData.filter(item => {
      // Category match
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }
      // Search match
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const qText = getFaqText(item, currentLang, 'question').toLowerCase();
        const aText = getFaqText(item, currentLang, 'answer').toLowerCase();
        return qText.includes(query) || aText.includes(query);
      }
      return true;
    });
  }, [selectedCategory, searchQuery, currentLang]);

  const handleToggle = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  const handleReset = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setOpenId(null);
  };

  return (
    <section
      id="partners"
      dir={currentLang === 'ar' ? 'rtl' : 'ltr'}
      className="py-16 md:py-24 bg-[var(--hb-surface)] border-t border-slate-200 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 id="faq-title" className="text-2xl md:text-4xl font-bold text-slate-950 tracking-tight">
            {content.title[currentLang]}
          </h2>
          <div className="mt-4 h-1 w-20 bg-[var(--hb-amber)] mx-auto rounded-full" />
          <p id="faq-subtitle" className="mt-4 text-slate-600 font-medium max-w-3xl mx-auto leading-relaxed text-sm md:text-base">
            {content.subtitle[currentLang]}
          </p>
        </div>

        {/* Filter Controls (Search + Categories) */}
        <div className="max-w-4xl mx-auto mb-10 space-y-6">
          {/* Search Box */}
          <div className="relative rounded-2xl bg-white shadow-[0_14px_35px_rgba(15,23,42,0.08)] border border-slate-200 p-1.5 flex items-center gap-2">
            <div className="pl-3.5 text-slate-400">
              <Search className="w-5 h-5 stroke-[2.5]" />
            </div>
            <input
              id="faq-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={content.searchPlaceholder[currentLang]}
              className="w-full py-2.5 pr-4 text-slate-800 placeholder-slate-400 bg-transparent border-none focus:outline-none focus:ring-0 text-sm md:text-base font-medium"
            />
            {searchQuery && (
              <button
                id="faq-search-clear"
                onClick={() => setSearchQuery('')}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors mr-1"
                title="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Categories Pill Grid */}
          <div className="flex flex-wrap items-center justify-center gap-2 pb-2">
            {Object.entries(categories).map(([key, label]) => {
              const isActive = selectedCategory === key;
              return (
                <button
                  key={key}
                  id={`faq-tab-${key}`}
                  onClick={() => {
                    setSelectedCategory(key);
                    setOpenId(null);
                  }}
                  className={`px-4 py-2 rounded-full text-xs md:text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-[var(--hb-navy-deep)] text-white shadow-sm'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80 hover:border-slate-300'
                  }`}
                >
                  {label[currentLang]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Q&A Accordion List */}
        <div className="max-w-4xl mx-auto space-y-4">
          <AnimatePresence mode="popLayout">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((item) => {
                const isOpen = openId === item.id;
                const IconComponent = item.icon;
                return (
                  <motion.div
                    key={item.id}
                    id={`faq-item-${item.id}`}
                    layout="position"
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.25 }}
                    className={`rounded-2xl border transition-all duration-300 overflow-hidden bg-white ${
                      isOpen
                        ? 'border-sky-700 shadow-[0_16px_38px_rgba(15,67,100,0.10)]'
                        : 'border-slate-200/80 hover:border-slate-300 shadow-sm hover:shadow-md'
                    }`}
                  >
                    {/* Header Button */}
                    <button
                      id={`faq-trigger-${item.id}`}
                      onClick={() => handleToggle(item.id)}
                      className="w-full text-left p-5 md:p-6 flex items-start justify-between gap-4 focus:outline-none"
                      aria-expanded={isOpen}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`p-2.5 rounded-xl transition-colors shrink-0 ${
                          isOpen ? 'bg-[var(--hb-navy)] text-white' : 'bg-slate-100 text-slate-600'
                        }`}>
                          <IconComponent className="w-5 h-5 stroke-[2]" />
                        </div>
                        <span className={`text-sm md:text-base font-bold leading-snug transition-colors pt-1 ${
                          isOpen ? 'text-[var(--hb-navy)]' : 'text-slate-800 hover:text-[var(--hb-navy)]'
                        }`}>
                          {item.id}. {getFaqText(item, currentLang, 'question')}
                        </span>
                      </div>
                      <div className={`p-1.5 rounded-full shrink-0 mt-1 transition-transform duration-300 ${
                        isOpen ? 'rotate-180 bg-sky-50 text-[var(--hb-navy)]' : 'bg-slate-50 text-slate-400'
                      }`}>
                        <ChevronDown className="w-4 h-4 stroke-[2.5]" />
                      </div>
                    </button>

                    {/* Expandable Content */}
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          id={`faq-panel-${item.id}`}
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: 'easeInOut' }}
                        >
                          <div className="px-5 md:px-6 pb-6 pt-1 border-t border-slate-100/80">
                            <div className="pl-4 sm:pl-12 text-slate-600 text-xs md:text-sm leading-relaxed font-medium whitespace-pre-line space-y-2">
                              {getFaqText(item, currentLang, 'answer')}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })
            ) : (
              // Empty State
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16 bg-white rounded-3xl border border-slate-200/80 p-8 shadow-sm"
              >
                <HelpCircle className="w-12 h-12 text-slate-300 mx-auto mb-4 stroke-[1.5]" />
                <p className="text-slate-500 font-medium mb-4">{content.noResults[currentLang]}</p>
                <button
                  id="faq-reset-btn"
                  onClick={handleReset}
                  className="px-5 py-2.5 bg-[var(--hb-navy-deep)] text-white font-semibold rounded-full hover:bg-[var(--hb-navy)] shadow-sm hover:shadow transition-all duration-200 text-sm"
                >
                  {content.resetSearch[currentLang]}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom CTA Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-16 max-w-4xl mx-auto rounded-3xl bg-[var(--hb-navy-deep)] text-white p-8 md:p-10 shadow-[0_24px_60px_rgba(11,28,44,0.18)] relative overflow-hidden border border-white/10"
        >
          <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-3 text-center md:text-left">
              <h3 className="text-xl md:text-2xl font-bold tracking-tight flex items-center justify-center md:justify-start gap-2">
                <MessageSquare className="w-6 h-6 stroke-[2]" />
                {content.ctaTitle[currentLang]}
              </h3>
              <p className="text-slate-200 text-sm leading-relaxed max-w-xl font-medium">
                {content.ctaDesc[currentLang]}
              </p>
            </div>
            <a
              id="faq-contact-btn"
              href="#get-a-quote"
              onClick={() => trackEvent('faq_cta_click', { 'location': 'partners_faq_section' })}
              className="shrink-0 px-6 py-3.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-2xl shadow-lg shadow-amber-600/20 hover:shadow-xl hover:translate-y-[-1px] active:translate-y-[1px] transition-all duration-200 text-sm uppercase tracking-wide text-center w-full md:w-auto"
            >
              {content.ctaBtn[currentLang]}
            </a>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
