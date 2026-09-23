#!/usr/bin/env python3
"""Route inventory only. Presence is not proof of a fully translated body."""
import argparse,csv,json,re
from collections import defaultdict,Counter
from pathlib import Path
from urllib.parse import urlsplit
import xml.etree.ElementTree as ET
p=argparse.ArgumentParser();p.add_argument('--sitemap',default='public/sitemap.xml');p.add_argument('--out',default='docs/i18n-completion-2026-09-23');a=p.parse_args()
langs=['en','zh-cn','es','ar','ru','fr','pt','tr'];groups=defaultdict(dict)
for el in ET.parse(a.sitemap).getroot():
 path=urlsplit(el.find('{*}loc').text).path;parts=path.strip('/').split('/');lang=parts.pop(0) if parts[0] in langs[1:] else 'en';base='/'+'/'.join(parts);base=base.rstrip('/')+'/'
 groups[base][lang]=path
rows=[]
for base,available in groups.items():
 kind='article' if base.startswith('/blog/') else 'freight' if base.startswith(('/shipping-from-china','/services/')) else 'core' if base in ['/','/insights/','/how-we-work/','/get-a-quote/'] else 'sourcing-service' if base.startswith('/sourcing-services') else 'product'
 rows.append({'base':base,'kind':kind,'available_route_count':len(available),'available_languages':','.join(l for l in langs if l in available),'missing_languages':','.join(l for l in langs if l not in available),'scope':'excluded: retain article source language' if kind=='article' else 'required: eight languages','body_review':'preserve existing article language' if kind=='article' else 'route inventory only; see rendered-text review and functional verification'})
out=Path(a.out);out.mkdir(parents=True,exist_ok=True)
with (out/'routes.csv').open('w') as f:
 w=csv.DictWriter(f,fieldnames=list(rows[0]));w.writeheader();w.writerows(rows)
summary={'route_topics':len(rows),'existing_versions':sum(r['available_route_count'] for r in rows),'missing_route_versions':sum(8-r['available_route_count'] for r in rows if r['kind']!='article'),'excluded_article_topics':sum(r['kind']=='article' for r in rows),'groups':dict(Counter(r['kind'] for r in rows)),'qualification':'URL-based inventory; translated article groups with different slugs require review; existing route presence is not language-content verification'}
(out/'inventory.json').write_text(json.dumps(summary,ensure_ascii=False,indent=2)+'\n');print(json.dumps(summary,ensure_ascii=False))
