#!/usr/bin/env python3
"""Audit sitemap HTML by page intent; navigation/footer/JSON-LD do not count as copy.
Run: python3 scripts/audit-search-intent.py --dist dist --out audit/search-intent
This is a lexical first pass, not a search-volume or ranking assessment.
"""
import argparse, csv, json, re
from collections import Counter
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit
import xml.etree.ElementTree as ET

class CopyParser(HTMLParser):
    def __init__(self):
        super().__init__(); self.excluded=[]; self.capture=None; self.buffer=[]
        self.h1=[]; self.paragraphs=[]; self.title=[]; self.body=[]; self.description=''
    def handle_starttag(self, tag, attrs):
        attrs=dict(attrs)
        if tag=='meta' and attrs.get('name')=='description': self.description=attrs.get('content','')
        if tag in ('script','style','nav','footer','noscript'): self.excluded.append(tag)
        if not self.excluded and tag in ('h1','p','title'):
            self.capture=tag; self.buffer=[]
    def handle_endtag(self,tag):
        if self.excluded:
            if tag==self.excluded[-1]: self.excluded.pop()
            return
        if tag==self.capture:
            value=' '.join(' '.join(self.buffer).split())
            getattr(self,{'h1':'h1','p':'paragraphs','title':'title'}[tag]).append(value)
            self.capture=None
    def handle_data(self,data):
        if self.excluded:return
        if self.capture:self.buffer.append(data)
        if self.capture!='title':self.body.append(data)

LEXICON={
 'en':(r'\bchina\b|\bchinese\b',r'\b(source|sourc\w+|buy|buying|wholesale|purchas\w+|suppliers?|inspection|consolidation|export)\b'),
 'es':(r'china|chinos?',r'compr|adqui|mayor|abastec|proveedor|inspecci|consolida|export|sourcing'),
 'ar':(r'الصين|صيني',r'توريد|اشتر|شراء|جملة|مورد|فحص|تجميع|تصدير|احصل'),
 'zh-cn':(r'中国|国内',r'采购|批发|购买|供应|验货|检验|集货|拼货|出口'),
 'fr':(r'chine|chinois',r'ach[aeè]|sourcing|fourniss|gros|inspection|consolid|export'),
 'ru':(r'кита',r'закуп|постав|опт|покуп|\bкуп(?:ить|ите)\b|контрол|консолида|экспорт|инспек'),
 'pt':(r'china|chin[eê]s',r'compr|fornece|atacado|inspe|consolida|export'),
 'tr':(r'çin',r'tedarik|satın|toptan|kontrol|konsolida|ihracat'),
}
def classify(path):
    if path=='get-a-quote':return 'utility'
    if path.startswith(('blog/','insights','how-we-work')) or any(x in path for x in ('/guides','/videos','/calculator','selection-guide','materials-and-pricing')):return 'information'
    if path.startswith(('shipping-from-china','services/')):return 'freight'
    if path.startswith('sourcing-services'):return 'sourcing-service'
    return 'product' if path else 'home'

def audit(dist):
    rows=[]
    for item in ET.parse(dist/'sitemap.xml').getroot():
        url=item.find('{*}loc').text; route=urlsplit(url).path; parts=route.strip('/').split('/')
        lang=parts.pop(0) if parts[0] in LEXICON and parts[0]!='en' else 'en'
        path='/'.join(parts); kind=classify(path); file=dist/route.strip('/')/'index.html'
        parsed=CopyParser(); parsed.feed(file.read_text()); title=' '.join(parsed.title); h1=' '.join(parsed.h1)
        opening=' '.join([h1,*parsed.paragraphs[:3]])
        source,action=LEXICON[lang]; origin=bool(re.search(source,opening,re.I)); purchase=bool(re.search(action,opening,re.I))
        issues=[]
        if kind in ('utility','information'): status='context-only'
        elif not h1: status='review';issues.append('No H1/body in static HTML; inspect rendered route')
        else:
            if not origin:issues.append('Origin absent from H1/opening paragraphs')
            if kind in ('product','home','sourcing-service') and not purchase:issues.append('Purchase/service action absent from H1/opening paragraphs')
            status='review' if issues else 'pass'
        if re.search(r'(sourc\w*|buy\w*|purchas\w*).{0,70}from Asia',opening,re.I):issues.append('Verify actual Asian supply coverage');status='review'
        rows.append(dict(path=route,locale=lang,intent=kind,status=status,title=title,h1=h1,opening=opening,issues='; '.join(issues)))
    return rows

def main():
    p=argparse.ArgumentParser();p.add_argument('--dist',default='dist');p.add_argument('--out',default='audit/search-intent');args=p.parse_args()
    rows=audit(Path(args.dist));out=Path(args.out);out.mkdir(parents=True,exist_ok=True)
    (out/'pages.json').write_text(json.dumps(rows,ensure_ascii=False,indent=2)+'\n')
    with (out/'pages.csv').open('w',newline='') as f:
        w=csv.DictWriter(f,fieldnames=list(rows[0]));w.writeheader();w.writerows(rows)
    counts=Counter(r['status'] for r in rows); locales=Counter(r['locale'] for r in rows)
    lines=['# Search-intent audit', '',f'Sitemap pages: {len(rows)}. Results: {dict(counts)}. Languages: {dict(locales)}.', '',
      'Scope: local generated HTML, not a production crawl. Navigation, footer, scripts and metadata do not satisfy opening-copy requirements. A pass confirms lexical evidence only; it does not establish search volume, naturalness, translation quality, rankings or complete search-intent coverage.', '',
      'Products: specific product + purchase/sourcing action + China origin in the opening. Services: service + object/scope + China origin. Freight: preserve shipping origin/destination intent, with no buying phrase requirement. Information and utility pages retain their own intent. Asia sourcing requires separate evidence; Central Asia as a destination is not an Asian supply-origin claim.', '', '## Review queue', '']
    for row in rows:
        if row['status']=='review':lines.append(f"- `{row['path']}` — {row['issues']}")
    (out/'summary.md').write_text('\n'.join(lines)+'\n');print(json.dumps({'pages':len(rows),'statuses':dict(counts),'locales':dict(locales),'report':str(out/'summary.md')},ensure_ascii=False))
if __name__=='__main__':main()
