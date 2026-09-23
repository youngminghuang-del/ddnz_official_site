#!/usr/bin/env python3
"""Find verbatim English phrase carry-over in localized static pages.
This is a review aid, not a translation-quality or language-detection score.
"""
import argparse, json, re
from html.parser import HTMLParser
from pathlib import Path

class VisibleText(HTMLParser):
    def __init__(self):
        super().__init__()
        self.skip = 0
        self.anchor = ''
        self.parts = []
    def handle_starttag(self, tag, attrs):
        if tag in ('script', 'style'):
            self.skip += 1
        if tag == 'a':
            self.anchor = dict(attrs).get('href', '')
    def handle_endtag(self, tag):
        if tag in ('script', 'style'):
            self.skip = max(0, self.skip - 1)
        if tag == 'a':
            self.anchor = ''
    def handle_data(self, data):
        if not self.skip and data.strip():
            self.parts.append((data.strip(), self.anchor))

def parse(path):
    parser = VisibleText()
    parser.feed(path.read_text())
    return parser.parts

parser = argparse.ArgumentParser()
parser.add_argument('--dist', default='dist')
parser.add_argument('--out', required=True)
args = parser.parse_args()
root = Path(args.dist)
review, retained = [], []
checked = 0
for locale in ('zh-cn', 'es', 'ar', 'ru', 'fr', 'pt', 'tr'):
    for path in sorted((root / locale).rglob('index.html')):
        base = path.relative_to(root / locale)
        if str(base).startswith('blog/') or not (root / base).exists():
            continue
        checked += 1
        english = {text for text, _ in parse(root / base)}
        for text, href in parse(path):
            if text not in english or len(re.findall(r'[A-Za-z]+', text)) < 5:
                continue
            row = {'page': '/' + str(path.relative_to(root)).removesuffix('index.html'), 'text': text}
            if '/blog/' in href or str(base).startswith('insights/'):
                row['reason'] = 'Article titles/excerpts retained in source language by user request'
                retained.append(row)
            elif re.search(r'Co\.,? Ltd\.|Electrical Appliance Limited', text):
                row['reason'] = 'Official company/supplier name'
                retained.append(row)
            elif text in ('IMO / ILO / UNECE CTU Code', 'San Antonio / Valparaíso FCL / LCL') or re.search(r'CC BY(?:-SA)? [0-9]', text):
                row['reason'] = 'Official standard, port names with freight acronyms, or required image-credit text'
                retained.append(row)
            else:
                review.append(row)
result = {'localized_pages_checked': checked, 'review_occurrences': len(review),
          'retained_occurrences': len(retained),
          'qualification': 'Exact English matches of at least five words; excludes Blog articles. Not proof of native fluency, full parity or absence of shorter untranslated labels.',
          'review': review, 'retained': retained}
Path(args.out).parent.mkdir(parents=True, exist_ok=True)
Path(args.out).write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n')
print(json.dumps({key: result[key] for key in ('localized_pages_checked', 'review_occurrences', 'retained_occurrences')}))
