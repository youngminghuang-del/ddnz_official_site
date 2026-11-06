#!/usr/bin/env python3
"""Check rendered blog JSON-LD before GitHub Pages artifact upload."""
import argparse
from concurrent.futures import ThreadPoolExecutor
from html.parser import HTMLParser
import json
from pathlib import Path
from urllib.request import Request, urlopen

from blog_schema_checks import publication_checks


class PageSchema(HTMLParser):
    def __init__(self, html):
        super().__init__()
        self.nodes = []
        self.payload = None
        self.feed(html)

    def handle_starttag(self, tag, attrs):
        if tag == 'script' and dict(attrs).get('type') == 'application/ld+json':
            self.payload = ''

    def handle_data(self, data):
        if self.payload is not None:
            self.payload += data

    def handle_endtag(self, tag):
        if tag == 'script' and self.payload is not None:
            data = json.loads(self.payload)
            for graph in data if isinstance(data, list) else [data]:
                self.nodes.extend(graph.get('@graph', [graph]))
            self.payload = None


def inspect(path, root, origin, allow_live_baseline):
    route = path.relative_to(root).parent.as_posix()
    try:
        schema = PageSchema(path.read_text(encoding='utf-8'))
        checks = publication_checks({'@graph': schema.nodes}, release=True)
        if all(checks.values()):
            return route, 'pass'
        # Existing invalid markup can remain only when every JSON-LD node
        # is identical to the page already served at this same route.
        if allow_live_baseline and checks['blog_posting_present']:
            request = Request(f'{origin}/{route}/',
                              headers={'User-Agent': 'DDNZ-publication-verification/1.0'})
            with urlopen(request, timeout=15) as response:
                live = PageSchema(response.read().decode('utf-8'))
            if schema.nodes == live.nodes:
                return route, 'unchanged live baseline'
        return route, 'FAIL ' + ', '.join(key for key, ok in checks.items() if not ok)
    except (ValueError, OSError, TypeError, AttributeError) as error:
        return route, f'FAIL {error}'


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('dist', type=Path)
    parser.add_argument('--allow-live-baseline', action='store_true')
    args = parser.parse_args()
    paths = sorted(path for path in args.dist.rglob('index.html')
                   if 'blog' in path.relative_to(args.dist).parts[:-2])
    if not paths:
        parser.error('no rendered blog articles found')
    with ThreadPoolExecutor(max_workers=8) as pool:
        results = list(pool.map(lambda path: inspect(
            path, args.dist, 'https://www.ddnzglobal.com', args.allow_live_baseline), paths))
    for route, result in results:
        if result != 'pass':
            print(f'{route}: {result}')
    print(f'Checked {len(results)} rendered blog pages')
    return int(any(result.startswith('FAIL') for _, result in results))


if __name__ == '__main__':
    raise SystemExit(main())
