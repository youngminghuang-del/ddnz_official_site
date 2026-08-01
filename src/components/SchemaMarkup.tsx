import { useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface SchemaProps {
  type: 'Organization' | 'LocalBusiness' | 'Service' | 'BlogPosting' | 'BreadcrumbList';
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
        'name': language === 'zh' ? '华正邦泰国际货运代理有限公司' : 'Heaven Born International Freight Co., Ltd',
        'alternateName': ['Heaven Born', '华正邦泰国际货运', '华正邦泰', 'DDNZ Global'],
        'url': 'https://www.ddnzglobal.com',
        'logo': 'https://raw.githubusercontent.com/youngminghuang-del/ddnz_photo_assets/main/website_logo_ddnzglobal_512x512.png',
        'description': language === 'zh' 
          ? '华正邦泰国际货运代理有限公司专注于全球一站式跨境海运拼箱整柜、空运、Amazon FBA 及广州仓储集拼服务。'
          : 'Heaven Born International Freight Co., Ltd provides global freight forwarding, sea freight consolidation, air cargo, Amazon FBA preparation, and warehouse services from China.',
        'contactPoint': [
          {
            '@type': 'ContactPoint',
            'email': 'partnership@ddnzglobal.com',
            'contactType': 'customer service',
            'areaServed': 'Global',
            'availableLanguage': ['English', 'Chinese', 'Russian', 'French', 'Spanish', 'Arabic']
          }
        ],
        'sameAs': [
          'https://linkedin.com/company/ddnz-global-logistics-supply-chain'
        ]
      };
    } else if (type === 'LocalBusiness') {
      finalSchema = {
        ...baseSchema,
        '@type': 'LocalBusiness',
        'name': language === 'zh' ? '华正邦泰国际货运代理有限公司（广州总部）' : 'Heaven Born International Freight Co., Ltd (Guangzhou HQ)',
        'image': 'https://raw.githubusercontent.com/youngminghuang-del/ddnz_photo_assets/main/website_logo_ddnzglobal_512x512.png',
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
      finalSchema = {
        ...baseSchema,
        '@type': 'Service',
        '@id': `${pageUrl}#service`,
        'serviceType': data.serviceType || 'Freight Forwarding',
        'provider': {
          '@type': 'LocalBusiness',
          'name': language === 'zh' ? '华正邦泰国际货运代理有限公司' : 'Heaven Born International Freight Co., Ltd'
        },
        'areaServed': data.areaServed || 'Global',
        'description': data.description || 'Global logistics transport and consolidation service',
        'name': data.name || 'Logistics Service',
        'offers': {
          '@type': 'Offer',
          'priceCurrency': 'USD',
          'url': data.offerUrl || 'https://www.ddnzglobal.com/get-a-quote/',
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
    } else if (type === 'BlogPosting') {
      const rawImage = data.image || 'https://raw.githubusercontent.com/youngminghuang-del/ddnz_photo_assets/main/website_logo_ddnzglobal_512x512.png';
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
          'name': language === 'zh' ? '华正邦泰国际货运代理有限公司' : 'Heaven Born International Freight Co., Ltd',
          'url': 'https://www.ddnzglobal.com/',
          'logo': {
            '@type': 'ImageObject',
            'url': 'https://raw.githubusercontent.com/youngminghuang-del/ddnz_photo_assets/main/website_logo_ddnzglobal_512x512.png'
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
