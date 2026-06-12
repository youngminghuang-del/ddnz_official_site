import fs from 'fs';
import path from 'path';

// Define the static page configurations mapping language routes to SEO meta headers
const seoConfigs = {
  root: {
    lang: 'en',
    title: 'DDNZ Global & Heaven Born International Freight | China Sourcing & Cargo Logistics',
    desc: 'Optimize your China supply chain with Heaven Born International Freight and DDNZ Supply Chain. Offering professional China sourcing, sea freight forwarding, air cargo logistics, and FBA warehouse services from Guangzhou.',
    keywords: 'Heaven Born International Freight, DDNZ Supply Chain, China Cargo Agent, Guangzhou Freight Forwarder, Sea Freight From China, Air Cargo, Amazon FBA Logistics, China Sourcing Agent',
    canonical: 'https://www.ddnzglobal.com/'
  },
  'zh-cn': {
    lang: 'zh-CN',
    title: '华正邦泰国际物流 | DDNZ 供应链 | 广州靠谱实力出口货运代理与国际海运空运',
    desc: '广州靠谱实力出口货运代理，华正邦泰国际物流联合 DDNZ 供应链为您提供专业的中国商品采购代理、广州货代、集装箱海运（拼箱/整柜）、航空高特空运、亚马逊 FBA 及全球一站式跨境物流和海外仓增值支持。',
    keywords: '广州货代, 广州靠谱货代, 实力出口货代, 华正邦泰国际物流, DDNZ供应链, 广州出口货运代理, 广州集装箱海运, 广州空运专线, 中国商品采购代理, 国际货运代理',
    canonical: 'https://www.ddnzglobal.com/zh-cn'
  },
  'fr': {
    lang: 'fr',
    title: 'Heaven Born International Freight & DDNZ Supply Chain | Transitaire de Fret en Chine & Logistique',
    desc: 'Optimisez votre chaîne d\'approvisionnement en Chine avec Heaven Born International Freight et DDNZ Supply Chain. Services professionnels d\'approvisionnement, fret maritime, fret aérien et logistique globale à Guangzhou.',
    keywords: 'Heaven Born International Freight, DDNZ Supply Chain, Transitaire maritime Chine, Fret aérien direct, Commissionnaire de transport Guangzhou, Logistique Chine Europe',
    canonical: 'https://www.ddnzglobal.com/fr'
  },
  'ru': {
    lang: 'ru',
    title: 'Heaven Born International Freight & DDNZ Supply Chain | Международная доставка грузов из Китая',
    desc: 'Оптимизируйте ваши поставки из Китая с Heaven Born International Freight и DDNZ Supply Chain. Профессиональный поиск надежных поставщиков, недорогие морские контейнерные перевозки, авиадоставка под ключ и сборные грузы из Гуанчжоу.',
    keywords: 'Heaven Born International Freight, DDNZ Supply Chain, Доставка грузов из Китая, Карго Гуанчжоу, Морской фрахт Китай, Авиаперевозки из Китая, Экспортный логистический брокер',
    canonical: 'https://www.ddnzglobal.com/ru'
  }
};

const distDir = path.resolve(process.cwd(), 'dist');
const sourceHtmlPath = path.join(distDir, 'index.html');

function run() {
  console.log('🚀 Starting Multilingual SEO static pages post-build generator...');

  if (!fs.existsSync(sourceHtmlPath)) {
    console.error(`❌ Source HTML not found at: ${sourceHtmlPath}. Please run "npm run build" first.`);
    process.exit(1);
  }

  // Read base built HTML
  const originalHtml = fs.readFileSync(sourceHtmlPath, 'utf-8');

  // Helper to replace or inject tags securely in the HTML string
  const injectSeoMeta = (htmlContent: string, langCode: string, config: typeof seoConfigs.root): string => {
    let output = htmlContent;

    // 1. Update <html lang="..."> attribute
    output = output.replace(/<html lang="[^"]*"/i, `<html lang="${config.lang}"`);

    // 2. Replace or Inject <title> tag
    const titleRegex = /<title>([\s\S]*?)<\/title>/gi;
    if (titleRegex.test(output)) {
      output = output.replace(titleRegex, `<title>${config.title}</title>`);
    } else {
      output = output.replace(/<\/head>/i, `  <title>${config.title}</title>\n</head>`);
    }

    // Helper to replace or append specific meta tags in head
    const setMetaTag = (htmlStr: string, name: string, content: string): string => {
      const metaRegex = new RegExp(`<meta\\s+name="${name}"\\s+content="[^"]*"\\s*\\/?>`, 'i');
      if (metaRegex.test(htmlStr)) {
        return htmlStr.replace(metaRegex, `<meta name="${name}" content="${content}" />`);
      } else {
        return htmlStr.replace(/<\/head>/i, `  <meta name="${name}" content="${content}" />\n</head>`);
      }
    };

    // Helper to replace or append specific open graph/twitter tags
    const setOgMetaTag = (htmlStr: string, property: string, content: string): string => {
      const propertyAttr = property.startsWith('og:') ? 'property' : 'name';
      const ogRegex = new RegExp(`<meta\\s+${propertyAttr}="${property}"\\s+content="[^"]*"\\s*\\/?>`, 'i');
      if (ogRegex.test(htmlStr)) {
        return htmlStr.replace(ogRegex, `<meta ${propertyAttr}="${property}" content="${content}" />`);
      } else {
        return htmlStr.replace(/<\/head>/i, `  <meta ${propertyAttr}="${property}" content="${content}" />\n</head>`);
      }
    };

    output = setMetaTag(output, 'title', config.title);
    output = setMetaTag(output, 'description', config.desc);
    output = setMetaTag(output, 'keywords', config.keywords);

    output = setOgMetaTag(output, 'og:title', config.title);
    output = setOgMetaTag(output, 'og:description', config.desc);
    output = setOgMetaTag(output, 'twitter:title', config.title);
    output = setOgMetaTag(output, 'twitter:description', config.desc);

    // 3. Set Canonical Link
    const canonRegex = /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/i;
    if (canonRegex.test(output)) {
      output = output.replace(canonRegex, `<link rel="canonical" href="${config.canonical}" />`);
    } else {
      output = output.replace(/<\/head>/i, `  <link rel="canonical" href="${config.canonical}" />\n</head>`);
    }

    return output;
  };

  // --- 1. Update Root English HTML in place ---
  console.log('📝 Injecting SEO keywords into root Index HTML (en)...');
  const updatedRootHtml = injectSeoMeta(originalHtml, 'root', seoConfigs.root);
  fs.writeFileSync(sourceHtmlPath, updatedRootHtml, 'utf-8');

  // --- 2. Write Physical Subdirectories (zh-cn, fr, ru) ---
  const subDirs = ['zh-cn', 'fr', 'ru'] as const;
  subDirs.forEach((subDir) => {
    const config = seoConfigs[subDir];
    const subDirPath = path.join(distDir, subDir);

    // Create the physical subdirectory if it doesn't exist
    if (!fs.existsSync(subDirPath)) {
      fs.mkdirSync(subDirPath, { recursive: true });
    }

    const localizedHtml = injectSeoMeta(originalHtml, subDir, config);
    const targetFilePath = path.join(subDirPath, 'index.html');

    fs.writeFileSync(targetFilePath, localizedHtml, 'utf-8');
    console.log(`✅ Pre-rendered static pages at: dist/${subDir}/index.html`);
  });

  // --- 3. Generate GitHub Pages fallback 404.html for SPA router redirection support ---
  // To keep canonical and default fallback metadata tidy, we copy the updated root.html to 404.html
  const path404 = path.join(distDir, '404.html');
  fs.writeFileSync(path404, updatedRootHtml, 'utf-8');
  console.log('✅ Generated GitHub Pages route fallback at: dist/404.html');

  console.log('🎉 Multilingual SEO static generation complete!');
}

run();
