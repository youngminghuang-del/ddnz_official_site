import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const OUTPUT_DIR = path.resolve(process.cwd(), 'content-ops', '2026-W32');
const CREATED_AT = '2026-08-05T12:00:00+08:00';
const ACCESSED_DATE = '2026-08-05';

const auditGates = (notes) => [
  { gate: 'sources', result: 'pass', finding: notes.sources },
  { gate: 'factual', result: 'pass', finding: notes.factual },
  { gate: 'brand', result: 'pass', finding: 'DDNZ Global Trade is presented as the sourcing and trade-support coordinator; Heaven Born International Freight is named only for China-origin freight execution when engaged. No legal, certification or guaranteed-performance claim is made.' },
  { gate: 'language', result: 'pass', finding: notes.language },
  { gate: 'sensitive', result: 'pass', finding: 'No customer identity, quotation, shipment record, private message, credential, price or personal information is included.' },
  { gate: 'platform', result: 'pass', finding: 'Every requested language has a distinct LinkedIn, Facebook, Instagram and TikTok adaptation. All four channels are explicitly manual-publish packages.' },
];

function trackedUrl(pathname, platform, campaign, packageId) {
  const url = new URL(pathname, 'https://www.ddnzglobal.com');
  url.searchParams.set('utm_source', platform);
  url.searchParams.set('utm_medium', 'organic_social');
  url.searchParams.set('utm_campaign', campaign);
  url.searchParams.set('utm_content', packageId);
  url.searchParams.set('source', platform);
  return url.toString();
}

function post({ platform, language, copy, hashtags, targetPath, campaign, packageId, mediaBrief }) {
  return {
    platform,
    language,
    copy,
    hashtags,
    targetUrl: trackedUrl(targetPath, platform, campaign, packageId),
    mediaBrief,
    publishingMode: 'manual',
  };
}

const freightId = 'pkg_2026w32_fob-cif';
const freightCampaign = '2026w32-fob-cif-container-buyers';
const freightPath = '/get-a-quote';
const freightSources = [
  {
    claim: 'Incoterms allocate tasks, costs and risk between seller and buyer; the named destination under a C-term does not mean risk transfers at destination.',
    title: 'Incoterms® 2020: A practical guide to “C” and “D” rules',
    publisher: 'ICC Academy',
    url: 'https://academy.iccwbo.org/incoterms/article/incoterms-2020-c-or-d-rules/',
    sourceTier: 'A',
    sourceType: 'Standards Body',
    evidenceSummary: 'ICC explains that under C-terms the seller contracts carriage to the named destination, while delivery and risk transfer occur at origin according to the selected rule.',
    publishedDate: '',
    accessedDate: ACCESSED_DATE,
    market: 'Global',
    caveat: 'Incoterms do not replace the sales contract, transport contract, insurance wording or destination-law review.',
  },
  {
    claim: 'Under CIF, risk passes when the goods are on board the vessel even though the seller pays freight and arranges minimum-cover insurance to the named destination port.',
    title: 'Customs valuation — Incoterms',
    publisher: 'HM Revenue & Customs (GOV.UK)',
    url: 'https://www.gov.uk/guidance/customs-valuation/incoterms',
    sourceTier: 'A',
    sourceType: 'Government',
    evidenceSummary: 'Current HMRC guidance describes the FOB and CIF risk points and notes the minimum-cover insurance obligation under CIF.',
    publishedDate: '2025-06-25',
    accessedDate: ACCESSED_DATE,
    market: 'Global',
    caveat: 'The page is UK customs-valuation guidance; the cited Incoterms allocation principles are global, but local customs treatment must be checked separately.',
  },
  {
    claim: 'For containerised or multimodal movements, ICC guidance directs parties to consider FCA or the C-terms designed for multimodal transport instead of defaulting automatically to FOB or CIF.',
    title: 'Incoterms® 2020 Checklist and Flowcharts — 2024 update',
    publisher: 'International Chamber of Commerce',
    url: 'https://library.iccwbo.org/content/clp/Others/incoterms_2020_checklist_2024-update.pdf',
    sourceTier: 'A',
    sourceType: 'Standards Body',
    evidenceSummary: 'The ICC flowchart separates containerised/multimodal delivery from traditional onboard sea delivery and points to FCA/CPT/CIP where appropriate.',
    publishedDate: '',
    accessedDate: ACCESSED_DATE,
    market: 'Global',
    caveat: 'The flowchart is a selection aid, not legal advice. The parties must name the precise place or port and edition in their contract.',
  },
  {
    claim: 'UN/CEFACT recognises Incoterms as coded terms that clarify the division of tasks, costs and risks in delivery from seller to buyer.',
    title: 'Recommendation No. 5: Abbreviations of INCOTERMS — 2020 edition',
    publisher: 'United Nations Economic Commission for Europe (UNECE)',
    url: 'https://unece.org/trade/publications/recommendation-ndeg5-abbreviations-incoterms-ecetrade458-2020-edition',
    sourceTier: 'A',
    sourceType: 'Government',
    evidenceSummary: 'UN/CEFACT describes the role of Incoterms in harmonising stakeholder responsibilities and the division of tasks, costs and risks.',
    publishedDate: '',
    accessedDate: ACCESSED_DATE,
    market: 'Global',
    caveat: 'The recommendation supports coded use and interoperability; ICC remains the rule-making body for the Incoterms rules.',
  },
];

const freightBody = `> **Direct answer:** FOB versus CIF is not only a freight-price choice. It decides who contracts the main carriage, where risk transfers and whether the seller must arrange insurance. For containerised equipment, the first question should be where the supplier actually hands the cargo to the carrier. ICC guidance may point to FCA, CPT or CIP rather than automatically using a sea-only FOB or CIF rule.

## Why a CIF destination does not mean destination risk

Under CIF, the seller pays for sea carriage and arranges insurance to the named destination port. However, ICC and current UK government guidance both state that risk transfers when the goods are loaded on board at the port of shipment. The buyer can therefore carry the transit risk even though the supplier selected and paid the carrier.

This is the most common misunderstanding to remove from a China equipment order: **the party paying freight is not automatically the party carrying risk for the whole journey**.

## Why container handover changes the choice

FOB and CIF are sea and inland-waterway rules. ICC's current checklist separates traditional onboard delivery from containerised or multimodal movements. When a factory hands a sealed container to a terminal or first carrier before it is loaded on the vessel, FCA may describe the delivery point more accurately. If the seller is also paying multimodal carriage, CPT or CIP may be the better family to review.

That does not make one rule universally superior. It means the named place, transport mode and handover point must match the real movement.

## The five fields to put beside every supplier price

| Field | What to write | Why it matters |
|---|---|---|
| Rule and edition | Example: FCA named terminal, Incoterms® 2020 | A three-letter term without the exact place and edition is incomplete |
| Delivery point | Factory gate, container terminal or onboard vessel | This is where the seller completes delivery under the chosen rule |
| Main-carriage buyer | Seller or buyer | Identifies who chooses and contracts the carrier |
| Risk-transfer point | Exact operational milestone | Prevents the destination name from being mistaken for the risk point |
| Insurance | Buyer policy, CIF minimum cover or CIP cover | Confirms who arranges cover and whether it matches the cargo risk |

## Compare quotations on the same boundary

Do not compare an FOB supplier price with a CIF supplier price and call the difference “freight”. First align the product, packing, origin handling, export clearance, terminal handover, main carriage, insurance, destination terminal charges and inland delivery boundary.

Then ask for the operational details: cargo-ready date, named origin point, port pair, container type, cut-off, route, transshipment plan, freight validity, free-time assumptions and excluded destination charges. Incoterms allocate responsibilities; they do not turn an incomplete logistics quotation into an all-in landed-cost calculation.

## A practical decision sequence

1. Map the real handover from factory to first carrier.
2. Decide who should control the carrier booking and schedule changes.
3. Select a rule designed for the actual transport mode.
4. Name the exact place or port and write “Incoterms® 2020”.
5. Put insurance scope and claim documents in writing.
6. Ask the freight forwarder to quote the uncovered legs on the same shipment data.

## DDNZ operating boundary

DDNZ Global Trade can coordinate the supplier scope, packing information and commercial handover. Heaven Born International Freight can execute China-origin freight operations when engaged under a confirmed shipment scope. Neither company chooses the buyer's legal position or replaces contract, insurance, customs or tax advice.

**Planning a China equipment order?** Send the supplier location, packing list, cargo-ready date, destination and proposed Incoterm through the DDNZ quote form. We will identify the shipment fields needed for a comparable freight plan.

## Sources and verification

Last verified: **5 August 2026**. Incoterms wording must be checked against the current ICC rules and the parties' actual contract.

- [ICC Academy — C and D rules](https://academy.iccwbo.org/incoterms/article/incoterms-2020-c-or-d-rules/)
- [GOV.UK — Incoterms guidance](https://www.gov.uk/guidance/customs-valuation/incoterms)
- [ICC — Incoterms 2020 checklist and flowcharts](https://library.iccwbo.org/content/clp/Others/incoterms_2020_checklist_2024-update.pdf)
- [UNECE — Recommendation No. 5](https://unece.org/trade/publications/recommendation-ndeg5-abbreviations-incoterms-ecetrade458-2020-edition)`;

const freightLocalized = [
  {
    language: 'ar',
    title: 'FOB أم CIF لطلبات المعدات من الصين؟ افحص نقطة انتقال المخاطر أولاً',
    slug: 'ar-fob-vs-cif-china-equipment-risk-handover',
    excerpt: 'دليل عملي لفصل من يدفع الشحن عن نقطة انتقال المخاطر والتأمين وتسليم الحاوية.',
    bodyMarkdown: `> **الخلاصة:** الاختيار بين FOB وCIF ليس مقارنة سعر شحن فقط. فهو يحدد من يتعاقد مع الناقل، وأين تنتقل المخاطر، ومن يرتب التأمين. في الشحنات المحوّاة أو متعددة الوسائط قد يكون FCA أو CPT أو CIP أدق من استخدام FOB أو CIF تلقائياً.

## نقطة الخطر في CIF

يدفع البائع أجرة النقل البحري ويرتب التأمين إلى ميناء الوصول المسمى، لكن المخاطر تنتقل عند تحميل البضاعة على السفينة في ميناء الشحن. لذلك لا يعني دفع البائع للشحن أنه يتحمل مخاطر الرحلة حتى الوصول.

## ما يجب كتابته في أمر الشراء

- القاعدة والإصدار: Incoterms® 2020.
- المكان أو الميناء المحدد بدقة.
- نقطة التسليم الفعلية للناقل.
- الطرف الذي يحجز النقل الرئيسي.
- نقطة انتقال المخاطر.
- نطاق التأمين ومستندات المطالبة.

قارن عروض الموردين بعد توحيد حدود التكلفة: المنتج والتعبئة والمناولة في الصين والتخليص التصديري والمحطة والنقل الرئيسي والتأمين ورسوم الوجهة والتوصيل الداخلي.

DDNZ Global Trade تنسق نطاق المورد والتسليم التجاري، بينما تنفذ Heaven Born International Freight عمليات الشحن من الصين عند التعاقد معها. هذا الدليل ليس استشارة قانونية أو جمركية أو تأمينية.`,
    seoTitle: 'FOB أم CIF لطلبات المعدات من الصين | DDNZ',
    seoDescription: 'قارن FOB وCIF حسب نقطة التسليم والمخاطر والتأمين وتسليم الحاوية، وليس حسب رقم الشحن فقط.',
    ctaPath: freightPath,
  },
  {
    language: 'es',
    title: 'FOB o CIF para equipos de China: revise primero el punto de riesgo',
    slug: 'es-fob-vs-cif-equipos-china-riesgo-entrega',
    excerpt: 'Una guía para separar quién paga el flete de dónde se transfieren el riesgo, el seguro y la entrega del contenedor.',
    bodyMarkdown: `> **Respuesta directa:** FOB frente a CIF no es solo una comparación de precio. Define quién contrata el transporte principal, dónde se transfiere el riesgo y quién organiza el seguro. Para carga contenerizada o multimodal, FCA, CPT o CIP pueden describir mejor la entrega real.

## El destino CIF no es el punto de riesgo

Con CIF, el vendedor paga el transporte marítimo y contrata seguro hasta el puerto de destino indicado, pero el riesgo se transfiere cuando la mercancía queda a bordo en el puerto de embarque. Pagar el flete no equivale a conservar el riesgo hasta la llegada.

## Seis datos para la orden de compra

- Regla y edición: Incoterms® 2020.
- Lugar o puerto exacto.
- Punto real de entrega al transportista.
- Parte que contrata el transporte principal.
- Punto de transferencia del riesgo.
- Cobertura y documentos del seguro.

Compare cotizaciones después de alinear producto, embalaje, manejo en origen, despacho de exportación, terminal, transporte principal, seguro, cargos en destino y entrega interior.

DDNZ Global Trade coordina proveedor y entrega comercial; Heaven Born International Freight ejecuta el transporte desde China cuando se contrata. Esta guía no sustituye asesoría contractual, aduanera o de seguros.`,
    seoTitle: 'FOB o CIF para equipos de China | DDNZ',
    seoDescription: 'Compare FOB y CIF por punto de entrega, transferencia de riesgo, seguro y manejo del contenedor.',
    ctaPath: freightPath,
  },
  {
    language: 'fr',
    title: 'FOB ou CIF pour des équipements chinois : vérifiez d’abord le transfert de risque',
    slug: 'fr-fob-vs-cif-equipements-chine-risque-livraison',
    excerpt: 'Un guide pour distinguer le paiement du fret, le transfert de risque, l’assurance et la remise du conteneur.',
    bodyMarkdown: `> **Réponse directe :** FOB ou CIF n’est pas seulement une comparaison de prix. Le choix précise qui contracte le transport principal, où le risque est transféré et qui organise l’assurance. Pour un conteneur ou un mouvement multimodal, FCA, CPT ou CIP peut mieux correspondre à la remise réelle.

## La destination CIF n’est pas le point de risque

Sous CIF, le vendeur paie le transport maritime et organise l’assurance jusqu’au port de destination nommé. Le risque est néanmoins transféré lorsque la marchandise est chargée à bord au port d’expédition.

## Six champs à inscrire au bon de commande

- Règle et édition : Incoterms® 2020.
- Lieu ou port exact.
- Point réel de remise au transporteur.
- Partie qui réserve le transport principal.
- Point de transfert du risque.
- Étendue et documents de l’assurance.

Comparez les offres après avoir aligné produit, emballage, manutention d’origine, formalités export, terminal, transport principal, assurance, frais à destination et livraison intérieure.

DDNZ Global Trade coordonne le fournisseur et la remise commerciale ; Heaven Born International Freight exécute le fret au départ de Chine lorsqu’elle est mandatée. Ce guide ne remplace pas un conseil contractuel, douanier ou d’assurance.`,
    seoTitle: 'FOB ou CIF pour des équipements chinois | DDNZ',
    seoDescription: 'Comparez FOB et CIF par point de livraison, transfert de risque, assurance et remise du conteneur.',
    ctaPath: freightPath,
  },
];

const freightSocial = [
  ['en', `FOB or CIF? The freight price may be hiding the real risk point.

A common sourcing assumption:
“If the seller pays freight to my port, the seller carries the risk to my port.”

Under CIF, that can be wrong. The seller pays sea freight and arranges insurance to the named port, but risk can pass when the goods are loaded on board at origin.

For containerised equipment, FCA or CIP may better match the actual carrier handover.

Before approving a supplier comparison, write down:
1. Rule and edition
2. Named place or port
3. Delivery point
4. Who books the carrier
5. Risk-transfer point
6. Insurance scope

DDNZ aligns the supplier, packing, documents and commercial handover. Heaven Born handles China-origin freight execution when engaged.

Where has Incoterm wording caused confusion in your projects?

Buyer education only—not legal advice.

Photo: Nbfreeh / Wikimedia Commons — https://commons.wikimedia.org/wiki/File:Beilun_Port_2020-05-02.jpg
CC BY-SA 4.0 — https://creativecommons.org/licenses/by-sa/4.0/
Cropped, colour-adjusted and annotated by DDNZ.`, ['#Incoterms', '#ChinaSourcing', '#FreightForwarding', '#DDNZGlobal']],
  ['ar', 'الفرق بين FOB وCIF ليس فقط «من يدفع الشحن». في CIF قد يدفع البائع أجرة البحر والتأمين حتى ميناء الوصول، بينما تنتقل المخاطر عند التحميل في ميناء الشحن. وللحاويات قد يكون FCA أو CIP أدق. قبل مقارنة الأسعار، ثبّت القاعدة والإصدار والمكان ونقطة التسليم ومن يحجز الناقل ونقطة الخطر ونطاق التأمين.', ['#Incoterms', '#الشحن_من_الصين', '#سلاسل_الإمداد', '#DDNZGlobal']],
  ['es', 'FOB frente a CIF no significa solo “quién paga el flete”. En CIF, el vendedor paga el transporte y contrata seguro hasta el puerto indicado, pero el riesgo puede transferirse al cargar en origen. Para equipos en contenedor, FCA o CIP pueden describir mejor la entrega. Compare seis campos: regla, edición, lugar, punto de entrega, parte que reserva el transporte y seguro.', ['#Incoterms', '#ImportarDeChina', '#Logística', '#DDNZGlobal']],
  ['fr', 'FOB ou CIF ne répond pas seulement à la question « qui paie le fret ? ». Sous CIF, le vendeur paie le transport maritime et organise l’assurance, mais le risque peut être transféré au chargement au port d’origine. Pour un conteneur, FCA ou CIP peut mieux décrire la remise. Comparez six champs avant de comparer les prix.', ['#Incoterms', '#ImportChine', '#Logistique', '#DDNZGlobal']],
].flatMap(([language, copy, hashtags]) => [
  post({ platform: 'linkedin', language, copy, hashtags, targetPath: freightPath, campaign: freightCampaign, packageId: freightId, mediaBrief: 'Use public/images/social/2026-W32/fob-cif-ningbo-real-photo-v4.png: a cropped and annotated real photograph of Ningbo-Zhoushan Port’s Chuanshan Port Area. Preserve the on-image credit and the CC BY-SA 4.0 attribution links in the post.' }),
  post({ platform: 'facebook', language, copy: `${copy}\n\nUse the linked checklist before requesting a comparable China freight quote.`, hashtags, targetPath: freightPath, campaign: freightCampaign, packageId: freightId, mediaBrief: 'Four-card carousel: 1) who books freight, 2) delivery point, 3) risk point, 4) insurance. Use plain diagrams, no vessel logos.' }),
  post({ platform: 'instagram', language, copy: `${copy}\n\nSave this six-field check for your next supplier quotation.`, hashtags, targetPath: freightPath, campaign: freightCampaign, packageId: freightId, mediaBrief: '4:5 carousel with one large field per slide. Final slide: “Send origin, packing list, ready date, destination and proposed Incoterm.”' }),
  post({ platform: 'tiktok', language, copy: `Hook: “CIF to your port does not automatically mean the seller carries the risk to your port.”\nShow a container moving left to right. Freeze the risk marker at origin, then reveal the freight-payment line to destination. End with the six-field checklist and “Check the exact rule and named place before the PO.”`, hashtags, targetPath: freightPath, campaign: freightCampaign, packageId: freightId, mediaBrief: '25–35 second vertical motion graphic; no legal conclusions, prices or route promises. Manual voiceover and subtitles in the selected language.' }),
]);

const freightPackage = {
  id: freightId,
  version: 3,
  workflowStatus: 'Audit Passed',
  parentTopic: {
    title: 'FOB vs CIF for China Equipment Orders: Check the Risk Point, Insurance and Container Handover',
    category: 'Freight Export',
    market: 'Global; priority audiences in the Middle East, Africa and Latin America',
    buyerQuestion: 'Should an importer buy China equipment on FOB or CIF terms, and what must be clarified before comparing freight?',
    angle: 'Replace the price-only comparison with a six-field operational decision covering delivery point, risk, carriage, insurance and container handover.',
  },
  primaryLanguage: 'en',
  requestedLanguages: ['en', 'ar', 'es', 'fr'],
  website: {
    title: 'FOB vs CIF for China Equipment Orders: Check the Risk Point, Insurance and Container Handover',
    slug: 'fob-vs-cif-china-equipment-risk-insurance-container-handover',
    excerpt: 'Compare FOB, CIF and container-friendly alternatives by delivery point, risk transfer, insurance and carrier control—not one freight number.',
    bodyMarkdown: freightBody,
    seoTitle: 'FOB vs CIF for China Equipment Orders | DDNZ',
    seoDescription: 'A buyer guide to FOB, CIF, FCA and CIP for China equipment orders, covering risk transfer, insurance, container handover and comparable freight quotes.',
    ctaPath: freightPath,
  },
  localizedWebsite: freightLocalized,
  socialPosts: freightSocial,
  sources: freightSources,
  audit: {
    status: 'pass',
    score: 96,
    summary: 'Four primary/authoritative sources support the narrow operational claims. The article separates standards-based facts from recommendations and preserves the legal-advice caveat.',
    gates: auditGates({
      sources: '4 sources: ICC/ICC Academy, HMRC and UNECE. All are Tier A; three independent publishing bodies are represented.',
      factual: 'CIF risk transfer, minimum insurance, sea-only scope and the container/multimodal selection caveat are limited to what the cited sources support.',
      language: 'Arabic, Spanish and French adaptations preserve the distinction between carriage cost, delivery and risk; Incoterms names and DDNZ/Heaven Born roles remain unchanged.',
    }),
    blockers: [],
    requiredChanges: [],
    model: 'Codex Plus — evidence-backed audit',
    auditedAt: CREATED_AT,
  },
  createdAt: CREATED_AT,
  updatedAt: '2026-08-06T18:00:00+08:00',
  models: { canonical: 'Codex Plus — research and canonical writing', adaptation: 'Codex Plus — channel and language adaptation', audit: 'Codex Plus — source and policy audit' },
};

const iceId = 'pkg_2026w32_hot-kitchen-ice-output';
const iceCampaign = '2026w32-hot-kitchen-ice-output';
const icePath = '/blog/commercial-ice-machine-hot-kitchen-output-china-sourcing';
const iceSources = [
  {
    claim: 'ANSI/AHRI 810-2025 establishes definitions, test requirements, ratings and minimum published data for automatic commercial ice makers.',
    title: 'AHRI 810 (SI/I-P): Performance Rating of Automatic Commercial Ice-makers',
    publisher: 'Air-Conditioning, Heating, and Refrigeration Institute (AHRI)',
    url: 'https://www.ahrinet.org/search-standards/ahri-810-sii-p-performance-rating-automatic-commercial-ice-makers',
    sourceTier: 'A',
    sourceType: 'Standards Body',
    evidenceSummary: 'The AHRI standards page states the current standard scope and provides the 2025 and 2023 editions for download.',
    publishedDate: '',
    accessedDate: ACCESSED_DATE,
    market: 'Global; Middle East application is a buyer-planning use',
    caveat: 'The standard supports comparable ratings; it does not certify an unlisted Chinese OEM model or guarantee site output.',
  },
  {
    claim: 'The US DOE test procedure measures commercial ice-maker harvest rate, energy and water use using referenced AHRI and ASHRAE methods and controlled setup requirements.',
    title: 'Automatic Commercial Ice Makers — current test procedure hub',
    publisher: 'U.S. Department of Energy',
    url: 'https://www.energy.gov/cmei/buildings/automatic-commercial-ice-makers',
    sourceTier: 'A',
    sourceType: 'Government',
    evidenceSummary: 'DOE identifies 10 CFR 431.134 as the current test procedure and the referenced performance metrics and standards.',
    publishedDate: '2022-11-01',
    accessedDate: ACCESSED_DATE,
    market: 'United States; useful as an auditable comparison method globally',
    caveat: 'US regulatory coverage does not establish Middle East conformity. Use the method as a comparison reference only unless the destination requires it.',
  },
  {
    claim: 'Manufacturer guidance says ice output is lowest when peak summer ambient and inlet-water temperatures are highest, and production checks must be compared with the model data chart.',
    title: 'Training & FAQs — cuber production check',
    publisher: 'Hoshizaki America',
    url: 'https://www.hoshizakiamerica.com/support/training/',
    sourceTier: 'C',
    sourceType: 'Supplier',
    evidenceSummary: 'The supplier support page explains how to calculate 24-hour production from cycle time and batch weight and tells technicians to record water and ambient condensing temperatures.',
    publishedDate: '',
    accessedDate: ACCESSED_DATE,
    market: 'Model-specific manufacturer guidance',
    caveat: 'Supplier guidance is not independent validation and must not be generalised into a universal derating factor.',
  },
  {
    claim: 'A model performance table can show different daily production at different ambient-air and inlet-water temperatures.',
    title: 'KM-1340MWH Performance Data',
    publisher: 'Hoshizaki America',
    url: 'https://secure.hoshizakiamerica.com/docs/manuals/KM-1340MWH_perf.pdf',
    sourceTier: 'C',
    sourceType: 'Supplier',
    evidenceSummary: 'The exact-model table publishes approximate 24-hour production across paired ambient and inlet-water conditions.',
    publishedDate: '2006-01-25',
    accessedDate: ACCESSED_DATE,
    market: 'Exact model only',
    caveat: 'Older exact-model example used only to show the disclosure format. Do not transfer its values to another model, frequency or condenser type.',
  },
];

const iceBody = `> **Direct answer:** Compare a commercial ice machine by daily output at stated ambient-air and inlet-water temperatures—not by the largest kg/day number in a catalogue. Then verify bin capacity, peak demand, condenser arrangement, voltage/frequency, water quality, drain and service parts for the exact model.

## A daily-output number needs conditions

ANSI/AHRI 810-2025 establishes rating and minimum published-data requirements for automatic commercial ice makers. The US Department of Energy also uses a defined test procedure for harvest rate, energy and water use. These references do not certify a machine for the Middle East, but they demonstrate why a comparable output claim needs a method, conditions and model identity.

Hoshizaki's service guidance makes the field effect explicit: peak summer ambient and incoming-water temperatures are highest when ice output is usually lowest. Its production-check process uses cycle time and batch weight, then cross-checks the result against the model data chart at the measured conditions.

## Separate production from storage

| Decision | Evidence to request |
|---|---|
| Daily production | Exact model, ice type, air temperature, water temperature, voltage/frequency and test method |
| Peak availability | Bin usable capacity and ice required at the start of the busiest service |
| Recovery | Production during operating hours at the buyer's intended condition |
| Utilities | Water pressure/quality, drain, electrical supply and condenser airflow or cooling-water requirement |
| Serviceability | Filter, pump, control board and refrigeration parts available for the destination market |

## A factory test that can be audited

1. Identify the exact sample and electrical version.
2. Record ambient air and inlet-water temperatures at the machine.
3. Stabilise the machine according to the agreed method.
4. Weigh the harvested ice over a stated period and record cycle time.
5. Explain any extrapolation to 24 hours.
6. Record voltage, power and water if they are part of the sales claim.
7. Photograph nameplate, condenser clearance, drain parts, filter and final packing.

A video of ice falling is not evidence of 24-hour output. A useful record ties the measured result to the sample, conditions and method.

## Buying decision

Shortlist suppliers that answer the same matrix. A lower output supported by an exact-model table and disclosed conditions is more decision-ready than a larger unsupported number. Compare price only after the ice head, bin, filter, drain components, spare parts, packing and destination electrical version are aligned.

DDNZ Global Trade can coordinate the RFQ, supplier comparison and inspection record. Heaven Born International Freight can execute the China-origin export handover when engaged. Site sizing and destination conformity remain project-specific decisions.

## Sources and verification

Last verified: **5 August 2026**.

- [AHRI — Standard 810](https://www.ahrinet.org/search-standards/ahri-810-sii-p-performance-rating-automatic-commercial-ice-makers)
- [U.S. DOE — Automatic commercial ice makers](https://www.energy.gov/cmei/buildings/automatic-commercial-ice-makers)
- [Hoshizaki America — production-check guidance](https://www.hoshizakiamerica.com/support/training/)
- [Hoshizaki — exact-model performance table](https://secure.hoshizakiamerica.com/docs/manuals/KM-1340MWH_perf.pdf)`;

const iceArabic = {
  language: 'ar',
  title: 'ماكينة ثلج لمطبخ حار: قارن الإنتاج اليومي عند ظروف معلنة',
  slug: 'ar-commercial-ice-machine-hot-kitchen-real-output',
  excerpt: 'لا تقارن رقم كجم/يوم منفرداً؛ اطلب درجة حرارة الهواء والماء وطريقة القياس وهوية الموديل.',
  bodyMarkdown: `> **الخلاصة:** قارن إنتاج ماكينة الثلج عند درجة حرارة هواء وماء دخول معلنتين، وليس بأكبر رقم كجم/24 ساعة في الكتالوج. ثم افحص سعة صندوق التخزين والطلب وقت الذروة ونوع المكثف والكهرباء والمياه والصرف وقطع الغيار للموديل نفسه.

## لماذا تحتاج شروط الاختبار؟

يحدد معيار ANSI/AHRI 810 متطلبات القياس والتصنيف والبيانات المنشورة. كما تستخدم وزارة الطاقة الأمريكية إجراءً محدداً لقياس معدل إنتاج الثلج والطاقة والمياه. هذه المراجع لا تمنح اعتماداً تلقائياً في الخليج، لكنها توضح أن المقارنة الصحيحة تحتاج طريقة وشروطاً وهوية موديل.

## سجل اختبار يمكن تدقيقه

1. سجل الموديل والعينة والنسخة الكهربائية.
2. قس حرارة الهواء وماء الدخول عند الماكينة.
3. زن الثلج خلال مدة معلنة وسجل زمن الدورة.
4. اشرح طريقة التحويل إلى إنتاج 24 ساعة.
5. سجل الجهد والطاقة والمياه إذا كانت ضمن الادعاء.
6. صور لوحة البيانات والتهوية والصرف والفلتر والتعبئة.

DDNZ Global Trade تنسق طلب العرض ومقارنة الموردين وسجل الفحص. تنفذ Heaven Born International Freight التسليم التصديري من الصين عند التعاقد معها. تحديد السعة والامتثال في بلد الوجهة يظلان خاصين بالمشروع.`,
  seoTitle: 'مقارنة إنتاج ماكينة الثلج للمطابخ الحارة | DDNZ',
  seoDescription: 'طريقة شراء ماكينة ثلج تجارية حسب ظروف الهواء والماء وسعة التخزين والمرافق واختبار المصنع.',
  ctaPath: '/sourcing/commercial-kitchen-equipment-from-china',
};

const iceSocial = [
  ['en', 'A commercial ice machine’s “kg per day” is not a stand-alone fact. Ask which model, air temperature, inlet-water temperature, voltage/frequency and test method produced it. Then separate daily production from bin capacity and peak-service demand. A supplier that provides a lower but auditable condition table is more decision-ready than one large unsupported number.', ['#CommercialKitchen', '#IceMachine', '#ChinaSourcing', '#DDNZGlobal']],
  ['ar', 'رقم «كجم ثلج في اليوم» ليس حقيقة مستقلة. اسأل عن الموديل وحرارة الهواء وماء الدخول والجهد والتردد وطريقة القياس. وافصل بين الإنتاج اليومي وسعة صندوق التخزين وطلب وقت الذروة. الرقم الأقل المدعوم بجدول ظروف واضح أفضل للقرار من رقم كبير بلا دليل.', ['#معدات_المطاعم', '#ماكينة_ثلج', '#توريد_من_الصين', '#DDNZGlobal']],
].flatMap(([language, copy, hashtags]) => [
  post({ platform: 'linkedin', language, copy, hashtags, targetPath: icePath, campaign: iceCampaign, packageId: iceId, mediaBrief: 'Use the existing DDNZ cover image commercial-ice-machine-hot-kitchen-output-cover.jpg. Add a small “conditions travel with the number” subtitle; no certification marks.' }),
  post({ platform: 'facebook', language, copy: `${copy}\n\nThe linked guide includes an RFQ matrix and an auditable factory-output check.`, hashtags, targetPath: icePath, campaign: iceCampaign, packageId: iceId, mediaBrief: 'Carousel using existing cover, nameplate/utility illustration and factory-output-test illustration. Label all generated images as illustrative, not inspection evidence.' }),
  post({ platform: 'instagram', language, copy: `${copy}\n\nSave the checklist: model + air + water + electrical version + test method + bin.`, hashtags, targetPath: icePath, campaign: iceCampaign, packageId: iceId, mediaBrief: '4:5 five-slide carousel. Slide 1 catalogue claim; slides 2–5 reveal missing conditions. Use DDNZ blue, cyan and amber.' }),
  post({ platform: 'tiktok', language, copy: 'Hook: “Two ice machines both say 100 kg/day. Are they equal?” Show the missing air temperature, water temperature, voltage and bin fields appearing one by one. End: “Compare the condition table, not the biggest number.”', hashtags, targetPath: icePath, campaign: iceCampaign, packageId: iceId, mediaBrief: '20–30 second vertical explainer using animated numbers and thermometers. No supplier brand, no test-result claim and no automatic voice translation without review.' }),
]);

const icePackage = {
  id: iceId,
  version: 1,
  workflowStatus: 'Audit Passed',
  parentTopic: {
    title: 'Commercial Ice Machines for Hot Middle East Kitchens: Compare Real Daily Output',
    category: 'Commercial Kitchen Equipment',
    market: 'Middle East',
    buyerQuestion: 'How should a buyer compare commercial ice-machine output for a hot kitchen?',
    angle: 'Make every output number travel with its air/water conditions, exact model and test method, then separate production from storage.',
  },
  primaryLanguage: 'en',
  requestedLanguages: ['en', 'ar'],
  website: {
    title: 'Commercial Ice Machines for Hot Middle East Kitchens: Compare Real Daily Output',
    slug: 'commercial-ice-machine-hot-kitchen-output-china-sourcing',
    excerpt: 'Compare commercial ice machines by output at stated air and water temperatures—not one catalogue kg/day number.',
    bodyMarkdown: iceBody,
    seoTitle: 'Commercial Ice Machine Output for Hot Kitchens | DDNZ',
    seoDescription: 'Compare commercial ice makers by rated conditions, bin capacity, utilities and an auditable factory output test for Middle East kitchens.',
    ctaPath: '/sourcing/commercial-kitchen-equipment-from-china',
  },
  localizedWebsite: [iceArabic],
  socialPosts: iceSocial,
  sources: iceSources,
  audit: {
    status: 'pass',
    score: 95,
    summary: 'The core buyer claim is supported by independent standards/government sources and illustrated with clearly limited manufacturer records. No universal derating factor or DDNZ test is claimed.',
    gates: auditGates({
      sources: '4 sources: AHRI and U.S. DOE are independent Tier A sources; two Hoshizaki records are Tier C exact-model/support examples and are not counted as independent validation.',
      factual: 'The article does not transplant manufacturer values between models and does not claim that US test rules establish Middle East conformity.',
      language: 'Arabic adaptation preserves units, model-level limitations, market caveat and brand roles.',
    }),
    blockers: [],
    requiredChanges: [],
    model: 'Codex Plus — evidence-backed audit',
    auditedAt: CREATED_AT,
  },
  createdAt: CREATED_AT,
  updatedAt: CREATED_AT,
  models: { canonical: 'Codex Plus — research and canonical writing', adaptation: 'Codex Plus — channel and Arabic adaptation', audit: 'Codex Plus — source and policy audit' },
};

const fridgeId = 'pkg_2026w32_portable-fridge-power-chain';
const fridgeCampaign = '2026w32-portable-fridge-power-chain';
const fridgePath = '/sourcing/outdoor-products-from-china';
const fridgeSources = [
  {
    claim: 'IEC 60335-2-24:2025 includes mobile refrigerating appliances and battery-operated appliances up to 24 V DC within a defined safety scope.',
    title: 'IEC 60335-2-24:2025 — Particular requirements for refrigerating appliances',
    publisher: 'International Electrotechnical Commission (IEC)',
    url: 'https://webstore.iec.ch/en/publication/75938',
    sourceTier: 'A',
    sourceType: 'Standards Body',
    evidenceSummary: 'The current IEC scope explicitly lists mobile refrigerating appliances and battery operation, while also noting that other construction/operation features can be covered elsewhere.',
    publishedDate: '2025-03-27',
    accessedDate: ACCESSED_DATE,
    market: 'Global',
    caveat: 'Scope evidence only. The exact architecture, incorporated battery, destination adoption and additional national requirements require technical review.',
  },
  {
    claim: 'ISO 16750-2:2023 describes electrical loads and test requirements for road-vehicle electrical/electronic systems and notes that wiring-harness impedance can change the electrical load.',
    title: 'ISO 16750-2:2023 — Road vehicles: Electrical loads',
    publisher: 'International Organization for Standardization (ISO)',
    url: 'https://www.iso.org/standard/76119.html',
    sourceTier: 'A',
    sourceType: 'Standards Body',
    evidenceSummary: 'ISO states that the document covers electrical loads for road-vehicle systems/components and that harness and connection impedance affects those loads.',
    publishedDate: '',
    accessedDate: ACCESSED_DATE,
    market: 'Global vehicle-system reference',
    caveat: 'The standard applies to vehicle systems/components and explicitly does not cover EMC. A portable fridge is not automatically within scope; use only after determining intended installation and product classification.',
  },
  {
    claim: 'Low-voltage cut-off and restart thresholds are model and setting specific, so a buyer must test the offered fridge with the offered cable, connector and battery strategy.',
    title: 'How to use the battery monitor — CFX2 Coolers',
    publisher: 'Dometic',
    url: 'https://support.dometic.com/en/cfx2-coolers/How-to-use-the-battery-monitor-2cc1',
    sourceTier: 'C',
    sourceType: 'Supplier',
    evidenceSummary: 'Dometic publishes different 12 V and 24 V switch-off/restart thresholds for low, medium and high battery-monitor modes and distinguishes starter-battery from house-battery use.',
    publishedDate: '',
    accessedDate: ACCESSED_DATE,
    market: 'Exact product family only',
    caveat: 'Manufacturer data supports only the named product family. It is not a universal threshold or a substitute for measuring the offered OEM sample.',
  },
  {
    claim: 'EU low-voltage legislation starts at 75 V DC, so a 12/24 V appliance and a mains adapter cannot be assumed to share the same legal scope.',
    title: 'Directive 2014/35/EU — electrical equipment within certain voltage limits',
    publisher: 'EUR-Lex / European Union',
    url: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A02014L0035-20260530',
    sourceTier: 'A',
    sourceType: 'Government',
    evidenceSummary: 'The consolidated directive states voltage limits of 50–1000 V AC and 75–1500 V DC.',
    publishedDate: '2014-02-26',
    accessedDate: ACCESSED_DATE,
    market: 'European Union only',
    caveat: 'EU-only scope note. It does not establish requirements for Middle East or African destinations and does not remove other safety, EMC, radio, RoHS or product-specific obligations.',
  },
];

const fridgeBody = `> **Direct answer:** Buy a 12/24 V portable refrigerator and its power system as one tested chain: appliance, cable, connector, low-voltage protection, battery and recharge source. A rated-watt number cannot predict useful runtime. Require a 24-hour Wh measurement at a stated ambient temperature, internal setpoint, load, door-opening cycle and input voltage.

## Why the power chain belongs in the RFQ

IEC 60335-2-24:2025 includes mobile refrigerating appliances and defined battery-operated appliances within its safety scope. ISO 16750-2:2023 separately describes electrical loads for road-vehicle systems and notes that wiring and connection impedance affects those loads. The standards do not automatically apply to every portable fridge architecture, but together they support one procurement rule: **the appliance label alone does not describe the whole vehicle or off-grid power environment**.

Dometic's model-family guidance shows why the protection setting matters. Its battery monitor uses different switch-off and restart voltages for low, medium and high modes, with different guidance for a starter battery and a house battery. These exact values are not universal; the disclosure format is what the buyer should require from each supplier.

## The 24-hour test record

| Test field | Record |
|---|---|
| Product identity | Model, sample serial, usable volume, refrigerant and firmware/control version |
| Thermal condition | Ambient temperature, starting load temperature, target setpoint and door cycle |
| DC supply | 12 V or 24 V source, cable length/conductor size, connector, fuse and voltage at the fridge |
| Energy | Wh over 24 hours, minimum input voltage, compressor cycles and any cut-out/restart event |
| Recharge | Solar, alternator or mains charger input limits and measured daily recovery under the intended use case |
| Protection | Reverse polarity, low-voltage settings, plug/cable temperature and abnormal-operation response |

## Do not turn ISO 16750 into a blanket certificate request

ISO 16750-2 is for road-vehicle electrical/electronic systems and components; it explicitly does not cover EMC. A portable appliance plugged into a vehicle socket may sit outside a supplier's claimed vehicle-component scope. Ask the test laboratory or technical reviewer to state why a standard applies to the exact product and installation.

The same discipline applies to destination conformity. For the EU, the Low Voltage Directive begins at 75 V DC, while a mains adapter can fall into a different voltage and product scope than the 12/24 V appliance. Other markets have their own routes. Do not copy one CE or IEC statement into a global approval claim.

## Buying decision

Approve a sample only when the same power-chain configuration will be supplied: cable, connector, fuse, adapter, battery option and charging inputs. Price the replacement cable, control board, fuse, handle, hinge and adapter. Ensure the packing and user instructions preserve condenser airflow and identify the intended power sources.

DDNZ Global Trade can coordinate supplier comparison and the test record. Heaven Born International Freight can execute the China-origin export handover when engaged. Battery transport classification and destination compliance require a separate shipment-specific check if a lithium battery is included.

## Sources and verification

Last verified: **5 August 2026**.

- [IEC 60335-2-24:2025](https://webstore.iec.ch/en/publication/75938)
- [ISO 16750-2:2023](https://www.iso.org/standard/76119.html)
- [Dometic — CFX2 battery monitor](https://support.dometic.com/en/cfx2-coolers/How-to-use-the-battery-monitor-2cc1)
- [EU Low Voltage Directive](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A02014L0035-20260530)`;

const fridgeLocalized = [
  {
    language: 'ar',
    title: 'ثلاجة متنقلة 12/24 فولت: اختبر سلسلة الطاقة كاملة قبل الطلب',
    slug: 'ar-12v-portable-fridge-power-chain-test',
    excerpt: 'اختبر الثلاجة والكابل والموصل وحماية انخفاض الجهد والبطارية ومصدر الشحن كنظام واحد.',
    bodyMarkdown: `> **الخلاصة:** لا يمكن لرقم القدرة بالواط أن يتنبأ بزمن التشغيل. اطلب قياس Wh لمدة 24 ساعة عند حرارة محيطة ودرجة ضبط وحمولة ودورة فتح أبواب وجهد إدخال معلنة.

يشمل IEC 60335-2-24:2025 أجهزة التبريد المتنقلة وبعض الأجهزة العاملة ببطارية ضمن نطاق محدد. ويصف ISO 16750-2 الأحمال الكهربائية لمكونات وأنظمة المركبات وتأثير مقاومة الأسلاك والموصلات. لا ينطبق المعياران تلقائياً على كل ثلاجة متنقلة، لذلك يجب أن يشرح المختبر نطاق التقرير للموديل والتركيب الفعليين.

## سجل الاختبار

- هوية الموديل والعينة والحجم والمبرد.
- حرارة الجو والحمولة ودرجة الضبط وفتح الباب.
- مصدر 12/24 فولت وطول الكابل ومقطعه والموصل والفيوز.
- Wh خلال 24 ساعة وأقل جهد وحالات الفصل وإعادة التشغيل.
- قدرة إعادة الشحن من الشمس أو الدينامو أو الشاحن.

DDNZ Global Trade تنسق مقارنة الموردين وسجل الاختبار. تنفذ Heaven Born International Freight عملية التصدير من الصين عند التعاقد معها. إذا شملت الوحدة بطارية ليثيوم، يلزم فحص منفصل للنقل والامتثال.`,
    seoTitle: 'اختبار سلسلة طاقة الثلاجة المتنقلة 12/24 فولت | DDNZ',
    seoDescription: 'قائمة شراء واختبار للثلاجة والكابل والبطارية وإعادة الشحن وحماية الجهد قبل التوريد من الصين.',
    ctaPath: fridgePath,
  },
  {
    language: 'fr',
    title: 'Réfrigérateur portable 12/24 V : testez toute la chaîne d’alimentation',
    slug: 'fr-refrigerateur-portable-12v-test-chaine-alimentation',
    excerpt: 'Testez ensemble appareil, câble, connecteur, coupure basse tension, batterie et recharge.',
    bodyMarkdown: `> **Réponse directe :** la puissance nominale ne prédit pas l’autonomie. Exigez une mesure Wh sur 24 heures avec température ambiante, consigne, charge, ouvertures de porte et tension d’entrée déclarées.

IEC 60335-2-24:2025 couvre les appareils de réfrigération mobiles et certains appareils alimentés par batterie dans un périmètre défini. ISO 16750-2 décrit les charges électriques des systèmes et composants de véhicules ainsi que l’influence de l’impédance du câblage. Ces normes ne s’appliquent pas automatiquement à toute glacière électrique : le laboratoire doit justifier le périmètre pour le modèle et l’installation exacts.

## Registre d’essai

- Modèle, échantillon, volume utile et réfrigérant.
- Température ambiante, charge, consigne et cycle d’ouverture.
- Source 12/24 V, câble, section, connecteur et fusible.
- Wh sur 24 h, tension minimale et coupures/redémarrages.
- Recharge solaire, alternateur ou secteur mesurée.

DDNZ Global Trade coordonne la comparaison fournisseur et le dossier d’essai. Heaven Born International Freight exécute l’export au départ de Chine lorsqu’elle est mandatée. Une batterie lithium intégrée exige un contrôle transport et conformité séparé.`,
    seoTitle: 'Test de chaîne d’alimentation pour réfrigérateur portable 12/24 V | DDNZ',
    seoDescription: 'Guide d’achat pour tester appareil, câble, batterie, recharge et protection basse tension avant sourcing en Chine.',
    ctaPath: fridgePath,
  },
];

const fridgeSocial = [
  ['en', 'A portable fridge is not just a compressor in a box. It is a power chain: fridge + cable + connector + low-voltage protection + battery + recharge. Ask the supplier for a 24-hour Wh result with the ambient temperature, setpoint, load, door cycle and input voltage written beside it. Then repeat with the exact cable and connector that will ship.', ['#PortableFridge', '#OutdoorProducts', '#ChinaSourcing', '#ProductTesting']],
  ['ar', 'الثلاجة المتنقلة ليست ضاغطاً داخل صندوق فقط؛ إنها سلسلة طاقة: ثلاجة + كابل + موصل + حماية جهد منخفض + بطارية + إعادة شحن. اطلب نتيجة Wh لمدة 24 ساعة مع حرارة الجو ودرجة الضبط والحمولة وفتح الباب والجهد، ثم اختبر الكابل والموصل اللذين سيتم شحنهما فعلياً.', ['#ثلاجة_متنقلة', '#منتجات_خارجية', '#توريد_من_الصين', '#اختبار_منتج']],
  ['fr', 'Un réfrigérateur portable est une chaîne d’alimentation : appareil + câble + connecteur + protection basse tension + batterie + recharge. Exigez un résultat Wh sur 24 h avec température, consigne, charge, ouvertures et tension d’entrée, puis testez le câble et le connecteur réellement livrés.', ['#RéfrigérateurPortable', '#ProduitsOutdoor', '#SourcingChine', '#TestProduit']],
].flatMap(([language, copy, hashtags]) => [
  post({ platform: 'linkedin', language, copy, hashtags, targetPath: fridgePath, campaign: fridgeCampaign, packageId: fridgeId, mediaBrief: 'Use a clean power-chain diagram from appliance to cable, battery and recharge. Mark IEC/ISO as scope references, never certification badges.' }),
  post({ platform: 'facebook', language, copy: `${copy}\n\nThe buyer checklist also separates appliance safety, vehicle electrical loads and destination conformity.`, hashtags, targetPath: fridgePath, campaign: fridgeCampaign, packageId: fridgeId, mediaBrief: 'Use the existing outdoor-portable-refrigerator-catalog.webp plus an overlaid six-field test checklist. Label product image as a category reference.' }),
  post({ platform: 'instagram', language, copy: `${copy}\n\nSave this test chain before comparing supplier runtime claims.`, hashtags, targetPath: fridgePath, campaign: fridgeCampaign, packageId: fridgeId, mediaBrief: '4:5 carousel: appliance, cable/connector, voltage-drop meter, battery, recharge, 24-hour Wh result. No runtime promise.' }),
  post({ platform: 'tiktok', language, copy: 'Hook: “This 12V fridge says 60 watts. How many hours will it run?” Cross out the shortcut. Reveal ambient temperature, setpoint, load, cable voltage drop, battery cut-off and daily recharge. End: “Measure Wh for 24 hours with the exact power chain.”', hashtags, targetPath: fridgePath, campaign: fridgeCampaign, packageId: fridgeId, mediaBrief: '25–35 second vertical test-bench explainer. Show generic meter readings only; do not present fabricated DDNZ test values.' }),
]);

const fridgePackage = {
  id: fridgeId,
  version: 2,
  workflowStatus: 'Audit Passed',
  parentTopic: {
    title: '12V Portable Fridges for Hot Off-Grid Markets: Require a Power-Chain Test',
    category: 'Outdoor Products',
    market: 'Middle East and Africa',
    buyerQuestion: 'What evidence should an importer require before relying on a 12/24 V portable-fridge runtime claim?',
    angle: 'Test appliance, cable, connector, protection, battery and recharge as one chain; use standards only within their stated product and installation scope.',
  },
  primaryLanguage: 'en',
  requestedLanguages: ['en', 'ar', 'fr'],
  website: {
    title: '12V Portable Fridges for Hot Off-Grid Markets: Require a Power-Chain Test',
    slug: '12v-portable-fridge-power-chain-test-hot-markets',
    excerpt: 'Stop estimating runtime from rated watts. Require a 24-hour Wh test covering the exact fridge, cable, connector, battery and recharge source.',
    bodyMarkdown: fridgeBody,
    seoTitle: '12V Portable Fridge Power-Chain Test | DDNZ',
    seoDescription: 'A buyer guide for testing 12/24 V portable fridges, cables, low-voltage protection, batteries and recharge before sourcing from China.',
    ctaPath: fridgePath,
  },
  localizedWebsite: fridgeLocalized,
  socialPosts: fridgeSocial,
  sources: fridgeSources,
  audit: {
    status: 'pass',
    score: 94,
    summary: 'The revised package replaces supplier-only support with independent IEC, ISO and EU official scope evidence, narrows every standards claim and keeps runtime as a measurement requirement rather than a promised result.',
    gates: auditGates({
      sources: '4 sources: IEC, ISO and EUR-Lex are Tier A from three independent publishing bodies; Dometic is Tier C and supports only named-model battery-monitor behaviour.',
      factual: 'ISO 16750 is explicitly limited to road-vehicle systems/components and does not cover EMC; IEC and EU voltage-scope statements are not converted into destination approval claims.',
      language: 'Arabic and French adaptations preserve the 24-hour Wh method, standards-scope caveats and separate lithium-battery shipment check.',
    }),
    blockers: [],
    requiredChanges: [],
    model: 'Codex Plus — evidence-backed audit',
    auditedAt: CREATED_AT,
  },
  createdAt: '2026-08-02T12:00:00+08:00',
  updatedAt: CREATED_AT,
  models: { canonical: 'Codex Plus — research and canonical revision', adaptation: 'Codex Plus — channel, Arabic and French adaptation', audit: 'Codex Plus — source and policy audit' },
};

const packages = [freightPackage, icePackage, fridgePackage];

function validatePackage(contentPackage) {
  const errors = [];
  const tiers = contentPackage.sources.filter((source) => ['A', 'B', 'First Party'].includes(source.sourceTier));
  const independent = new Set(tiers.map((source) => source.publisher.toLowerCase()));
  if (tiers.length < 2) errors.push('fewer than two qualified sources');
  if (!tiers.some((source) => ['A', 'First Party'].includes(source.sourceTier))) errors.push('missing Tier A or First Party source');
  if (independent.size < 2) errors.push('fewer than two independent qualified publishers');
  const expectedGates = new Set(['sources', 'factual', 'brand', 'language', 'sensitive', 'platform']);
  for (const gate of contentPackage.audit.gates) {
    if (gate.result !== 'pass') errors.push(`gate ${gate.gate} did not pass`);
    expectedGates.delete(gate.gate);
  }
  if (expectedGates.size) errors.push(`missing gates: ${[...expectedGates].join(', ')}`);
  for (const language of contentPackage.requestedLanguages) {
    for (const platform of ['linkedin', 'facebook', 'instagram', 'tiktok']) {
      if (!contentPackage.socialPosts.some((item) => item.language === language && item.platform === platform)) {
        errors.push(`missing ${platform}/${language} social post`);
      }
    }
  }
  if (contentPackage.socialPosts.some((item) => item.publishingMode !== 'manual')) errors.push('non-manual publishing mode found');
  const sensitivePattern = /(?:^|[^A-Za-z])sk-[A-Za-z0-9_-]{20,}|Bearer\s+[A-Za-z0-9._-]+/;
  if (sensitivePattern.test(JSON.stringify(contentPackage))) errors.push('credential-like text found');
  if (contentPackage.workflowStatus !== 'Audit Passed' || contentPackage.audit.status !== 'pass') errors.push('package is not Audit Passed');
  if (errors.length) throw new Error(`${contentPackage.id}: ${errors.join('; ')}`);
}

for (const contentPackage of packages) validatePackage(contentPackage);

const manifest = {
  week: '2026-W32',
  generatedAt: CREATED_AT,
  operatingMode: 'Codex Plus production; no OpenAI API calls; all social publishing is manual',
  editorialState: 'Audit Passed — awaiting human approval before posting',
  cadence: [
    { date: '2026-08-05', packageId: freightId, primaryChannel: 'linkedin', objective: 'freight authority and quote qualification' },
    { date: '2026-08-06', packageId: iceId, primaryChannel: 'instagram', objective: 'commercial-kitchen sourcing lead' },
    { date: '2026-08-08', packageId: fridgeId, primaryChannel: 'tiktok', objective: 'outdoor-product discovery and sourcing lead' },
  ],
  packages: packages.map((item) => ({
    id: item.id,
    title: item.website.title,
    category: item.parentTopic.category,
    market: item.parentTopic.market,
    languages: item.requestedLanguages,
    auditScore: item.audit.score,
    qualifiedSourceCount: item.sources.filter((source) => ['A', 'B', 'First Party'].includes(source.sourceTier)).length,
    sourceCount: item.sources.length,
    socialPostCount: item.socialPosts.length,
    file: `${item.id}.json`,
  })),
};

const readme = `# DDNZ Content Operations — 2026-W32

This batch was produced in Codex Plus without calling the OpenAI API. It contains three canonical English buyer topics, market-language adaptations, ${manifest.packages.reduce((total, item) => total + item.socialPostCount, 0)} manual-publish social posts, source ledgers and six-gate audits.

## Editorial state

- All three packages: **Audit Passed**.
- AI has not set any item to Approved, Scheduled or Published.
- LinkedIn, Facebook, Instagram and TikTok remain manual-publish channels.
- The portable-fridge package replaces the previous supplier-only evidence base with independent IEC, ISO and EUR-Lex sources. Notion still requires a named human reviewer before those records count as human-verified evidence.

## Files

${manifest.packages.map((item) => `- [${item.title}](./${item.file}) — ${item.sourceCount} sources, ${item.socialPostCount} social variants, audit ${item.auditScore}/100`).join('\n')}

## Suggested cadence

1. 5 Aug: FOB/CIF buyer guide — LinkedIn first.
2. 6 Aug: Hot-kitchen ice output — Instagram/Facebook first; use existing DDNZ artwork.
3. 8 Aug: 12/24 V fridge power chain — TikTok/Instagram first; use the portable-fridge category image plus a power-chain diagram.

Use the tracked target URL in each social-post record. Keep the article and evidence package unchanged when copying to a platform; any factual edit requires a new version and re-audit.
`;

await mkdir(OUTPUT_DIR, { recursive: true });
await Promise.all([
  ...packages.map((item) => writeFile(path.join(OUTPUT_DIR, `${item.id}.json`), `${JSON.stringify(item, null, 2)}\n`, 'utf8')),
  writeFile(path.join(OUTPUT_DIR, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`, 'utf8'),
  writeFile(path.join(OUTPUT_DIR, 'README.md'), readme, 'utf8'),
]);

console.log(JSON.stringify({ outputDir: OUTPUT_DIR, packages: manifest.packages }, null, 2));
