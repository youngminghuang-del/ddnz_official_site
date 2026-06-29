import { useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface SchemaProps {
  type: 'Organization' | 'LocalBusiness' | 'Service' | 'BlogPosting';
  data: Record<string, any>;
}

export default function SchemaMarkup({ type, data }: SchemaProps) {
  const { language } = useLanguage();

  useEffect(() => {
    // Remove any existing JSON-LD script for schema markup
    const existingScript = document.getElementById('schema-jsonld');
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
        'name': language === 'zh' ? '华正邦泰国际货运' : 'DDNZ Global Logistics',
        'alternateName': ['DDNZ Global', '华正邦泰', '东达国际物流'],
        'url': 'https://www.ddnzglobal.com',
        'logo': 'https://raw.githubusercontent.com/youngminghuang-del/ddnz_photo_assets/main/website_logo_ddnzglobal_512x512.png',
        'description': language === 'zh' 
          ? '华正邦泰国际货运专注于全球一站式跨境多式海运拼箱整柜、特需空运包机、海外Amazon FBA贴标一件代发及广州大仓储理运，安全高效。'
          : 'DDNZ Global provides premium global supply chain logistics, sea freight consolidation, express air cargo, prep and fulfillment for Amazon FBA stores.',
        'contactPoint': [
          {
            '@type': 'ContactPoint',
            'email': 'partnership@ddnzglobal.com',
            'contactType': 'customer service',
            'areaServed': 'Global',
            'availableLanguage': ['English', 'Chinese', 'Russian', 'French']
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
        'name': language === 'zh' ? '华正邦泰（广州总部）' : 'DDNZ Global Logistics (Guangzhou HQ)',
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
        'serviceType': data.serviceType || 'Freight Forwarding',
        'provider': {
          '@type': 'LocalBusiness',
          'name': language === 'zh' ? '华正邦泰国际货运' : 'DDNZ Global Logistics'
        },
        'areaServed': data.areaServed || 'Global',
        'description': data.description || 'Global logistics transport and consolidation service',
        'name': data.name || 'Logistics Service',
        'offers': {
          '@type': 'Offer',
          'priceCurrency': 'USD',
          'description': 'Contact us dynamically for personalized freight estimates'
        }
      };
    } else if (type === 'BlogPosting') {
      finalSchema = {
        ...baseSchema,
        '@type': 'BlogPosting',
        'headline': data.headline || '',
        'description': data.description || '',
        'image': data.image || 'https://raw.githubusercontent.com/youngminghuang-del/ddnz_photo_assets/main/website_logo_ddnzglobal_512x512.png',
        'datePublished': data.datePublished || '2026-05-28',
        'dateModified': data.dateModified || '2026-06-08',
        'author': {
          '@type': 'Organization',
          'name': 'DDNZ Global Experts'
        },
        'publisher': {
          '@type': 'Organization',
          'name': language === 'zh' ? '华正邦泰国际货运' : 'DDNZ Global Logistics',
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
    script.id = 'schema-jsonld';
    script.type = 'application/ld+json';
    script.innerHTML = JSON.stringify(finalSchema, null, 2);
    document.head.appendChild(script);

    return () => {
      // Cleanup on unmount or route change
      const toRemove = document.getElementById('schema-jsonld');
      if (toRemove) {
        toRemove.remove();
      }
    };
  }, [type, data, language]);

  return null;
}
