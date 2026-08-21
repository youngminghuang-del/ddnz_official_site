import { useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { PUBLIC_SOCIAL_CHANNELS } from '../config/socialChannels';

interface SchemaProps {
  type: 'Organization' | 'LocalBusiness' | 'Service' | 'BlogPosting' | 'BreadcrumbList' | 'FAQPage';
  data: Record<string, any>;
}

export default function SchemaMarkup({ type, data }: SchemaProps) {
  const { language } = useLanguage();

  useEffect(() => {
    const rawPageUrl = data.url || `https://www.ddnzglobal.com${window.location.pathname}`;
    const pageUrl = rawPageUrl === 'https://www.ddnzglobal.com/'
      ? rawPageUrl
      : rawPageUrl.replace(/\/+$/, '');
    const scriptId = `schema-jsonld-${type.toLowerCase()}`;
    // The production build injects crawlable JSON-LD into the static HTML. Once
    // React mounts, replace that snapshot with the route-aware runtime schemas
    // instead of leaving duplicate Organization, Service or BlogPosting nodes.
    [
      'schema-jsonld-static-home',
      'schema-jsonld-static-page',
      'schema-jsonld-static-blog'
    ].forEach((staticScriptId) => document.getElementById(staticScriptId)?.remove());

    // Replace only the schema of the same type, so Organization and LocalBusiness
    // can coexist on the homepage.
    const existingScript = document.getElementById(scriptId);
    if (existingScript) {
      existingScript.remove();
    }

    // Base context
    const baseSchema: Record<string, any> = {
      '@context': 'https://schema.org',
    };

    let finalSchema = {};

    if (type === 'Organization') {
      finalSchema = {
        ...baseSchema,
        '@type': 'Organization',
        '@id': 'https://www.ddnzglobal.com/#organization',
        'name': language === 'zh' ? '大递诺展贸易有限公司' : 'DDNZ Global Trade Co., Ltd',
        'alternateName': ['DDNZ Global', '大递诺展'],
        'url': 'https://www.ddnzglobal.com',
        'logo': 'https://www.ddnzglobal.com/images/brand/ddnz-global-mark-v1.png',
        'description': language === 'zh' 
          ? '大递诺展贸易有限公司为国际进口商协调中国采购、供应商验证、质量检验、集货与出口交付。'
          : 'DDNZ Global Trade Co., Ltd coordinates China sourcing, supplier verification, quality inspection, consolidation and export delivery for international importers.',
        'contactPoint': [
          {
            '@type': 'ContactPoint',
            'email': 'partnership@ddnzglobal.com',
            'contactType': 'customer service',
            'areaServed': 'Global',
            'availableLanguage': ['English', 'Chinese', 'Russian', 'French', 'Spanish', 'Arabic']
          }
        ],
        'sameAs': PUBLIC_SOCIAL_CHANNELS.map((channel) => channel.publicUrl)
      };
    } else if (type === 'LocalBusiness') {
      finalSchema = {
        ...baseSchema,
        '@type': 'LocalBusiness',
        'name': language === 'zh' ? '华正邦泰国际货运代理有限公司（广州总部）' : 'Heaven Born International Freight Co., Ltd (Guangzhou HQ)',
        'image': 'https://www.ddnzglobal.com/images/brand/heaven-born-wing-logo-v1.png',
        'url': 'https://www.ddnzglobal.com',
        'telephone': '+86-20-3654-6132',
        'email': 'partnership@ddnzglobal.com',
        'address': {
          '@type': 'PostalAddress',
          'streetAddress': language === 'zh'
            ? '黄石街道国际单位创意园二期-C区6楼'
            : '6th Floor, Area C, Phase II, International Unit Creative Park, Huangshi Street, Baiyun District',
          'addressLocality': 'Guangzhou',
          'addressRegion': 'Guangdong',
          'postalCode': '510000',
          'addressCountry': 'CN'
        },
        'geo': {
          '@type': 'GeoCoordinates',
          'latitude': '23.1895',
          'longitude': '113.2730'
        },
        'openingHoursSpecification': {
          '@type': 'OpeningHoursSpecification',
          'dayOfWeek': [
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday'
          ],
          'opens': '09:00',
          'closes': '18:00'
        }
      };
    } else if (type === 'Service') {
      const isDDNZService = data.providerName === 'DDNZ Global Trade Co., Ltd';
      const defaultOfferUrl = isDDNZService
        ? 'https://www.ddnzglobal.com/get-a-quote?leadGoal=Product%20Sourcing&source=structured_data'
        : 'https://www.ddnzglobal.com/get-a-quote?leadGoal=Freight%20Only&source=structured_data';
      finalSchema = {
        ...baseSchema,
        '@type': 'Service',
        '@id': `${pageUrl}#service`,
        'serviceType': data.serviceType || 'Freight Forwarding',
        'provider': {
          '@type': isDDNZService ? 'Organization' : 'LocalBusiness',
          'name': isDDNZService
            ? (language === 'zh' ? '大递诺展贸易有限公司' : 'DDNZ Global Trade Co., Ltd')
            : (language === 'zh' ? '华正邦泰国际货运代理有限公司' : 'Heaven Born International Freight Co., Ltd'),
          'url': 'https://www.ddnzglobal.com/'
        },
        'areaServed': data.areaServed || 'Global',
        'description': data.description || 'Global logistics transport and consolidation service',
        'name': data.name || 'Logistics Service',
        'offers': {
          '@type': 'Offer',
          'priceCurrency': 'USD',
          'url': data.offerUrl || defaultOfferUrl,
          'description': data.offerDescription || 'Request a route-specific freight quotation based on cargo details and current capacity.'
        }
      };
    } else if (type === 'BreadcrumbList') {
      finalSchema = {
        ...baseSchema,
        '@type': 'BreadcrumbList',
        '@id': `${pageUrl}#breadcrumb`,
        'itemListElement': (data.items || []).map((item: { name: string; url: string }, index: number) => ({
          '@type': 'ListItem',
          'position': index + 1,
          'name': item.name,
          'item': item.url
        }))
      };
    } else if (type === 'FAQPage') {
      finalSchema = {
        ...baseSchema,
        '@type': 'FAQPage',
        '@id': `${pageUrl}#faq`,
        'url': pageUrl,
        'inLanguage': language,
        'mainEntity': (data.faqs || []).map((faq: { question: string; answer: string }) => ({
          '@type': 'Question',
          'name': faq.question,
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': faq.answer
          }
        }))
      };
    } else if (type === 'BlogPosting') {
      const rawImage = data.image || 'https://www.ddnzglobal.com/images/brand/ddnz-global-mark-v1.png';
      const absoluteImage = rawImage.startsWith('http')
        ? rawImage
        : `https://www.ddnzglobal.com${rawImage.startsWith('/') ? rawImage : `/${rawImage}`}`;
      finalSchema = {
        ...baseSchema,
        '@type': 'BlogPosting',
        'headline': data.headline || '',
        'description': data.description || '',
        'image': absoluteImage,
        'datePublished': data.datePublished || '',
        'dateModified': data.dateModified || data.datePublished || '',
        'author': {
          '@type': 'Organization',
          'name': data.governed ? 'DDNZ Global Editorial Desk' : 'DDNZ Global Editorial Archive',
          'url': 'https://www.ddnzglobal.com/'
        },
        'publisher': {
          '@type': 'Organization',
          '@id': 'https://www.ddnzglobal.com/#organization',
          'name': language === 'zh' ? '大递诺展贸易有限公司' : 'DDNZ Global Trade Co., Ltd',
          'url': 'https://www.ddnzglobal.com/',
          'logo': {
            '@type': 'ImageObject',
            'url': 'https://www.ddnzglobal.com/images/brand/ddnz-global-mark-v1.png'
          }
        },
        'mainEntityOfPage': {
          '@type': 'WebPage',
          '@id': data.url || 'https://www.ddnzglobal.com/insights'
        }
      };
    }

    // Create script tag and append to head
    const script = document.createElement('script');
    script.id = scriptId;
    script.type = 'application/ld+json';
    script.innerHTML = JSON.stringify(finalSchema, null, 2);
    document.head.appendChild(script);

    return () => {
      // Cleanup on unmount or route change
      const toRemove = document.getElementById(scriptId);
      if (toRemove) {
        toRemove.remove();
      }
    };
  }, [type, data, language]);

  return null;
}
