"""DDNZ draft schema/content consistency gate. No network or publication effects."""
from datetime import datetime
from pathlib import Path
import hashlib, json, re, html

def tracked_files(package):
    return sorted(p for pattern in ('article.*.md','preview.*.html','schema.*.json','metadata.json','build.py','image-manifest.json','article-date.json','images/*') for p in package.glob(pattern))

def write_sync_manifest(package):
    hashes={p.name:hashlib.sha256(p.read_bytes()).hexdigest() for p in tracked_files(package)}
    (package/'schema-sync.json').write_text(json.dumps(hashes,indent=2)+'\n')

def plain(s):
    return ' '.join(html.unescape(re.sub('<[^>]+>',' ',s)).split())

def has_zoned_timestamp(value):
    if not isinstance(value, str) or not re.fullmatch(
        r"\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-](?:[01]\d|2[0-3]):[0-5]\d)", value
    ):
        return False
    try:
        return datetime.fromisoformat(value.replace("Z", "+00:00")).utcoffset() is not None
    except ValueError:
        return False


def publication_checks(graph, *, release=False):
    nodes = graph['@graph']
    articles = [node for node in nodes if node.get('@type') == 'BlogPosting']
    lists = {node['@id'] for node in nodes if node.get('@type') == 'ItemList' and '@id' in node}

    def list_part(part):
        if not isinstance(part, dict):
            return isinstance(part, str) and part in lists
        types = part.get('@type', [])
        return (types == 'ItemList' or 'ItemList' in (types if isinstance(types, list) else [])
                or part.get('@id') in lists)

    def parts(article):
        value = article.get('hasPart', [])
        return value if isinstance(value, list) else [value]

    return {
        'blog_posting_present': bool(articles),
        'item_lists_outside_article_has_part': all(
            not list_part(part) for article in articles for part in parts(article)
        ),
        'publication_dates_have_timezones': all(
            has_zoned_timestamp(article.get(field))
            for article in articles
            for field in ('datePublished', 'dateModified')
            if release or 'datePublished' in article
        ),
    }


def validate(package):
    package=Path(package)
    saved=json.loads((package/'schema-sync.json').read_text())
    current={p.name:hashlib.sha256(p.read_bytes()).hexdigest() for p in tracked_files(package)}
    results={'source_and_output_hashes_current':saved==current,'locales':{}}
    for path in sorted(package.glob('preview.*.html')):
        lang=path.name[len('preview.'):-len('.html')]
        page=path.read_text();md=(package/f'article.{lang}.md').read_text()
        payloads=re.findall(r'<script[^>]*type="application/ld\+json"[^>]*>(.*?)</script>',page,re.S)
        assert len(payloads)==1,f'{lang}: expected one package graph'
        graph=json.loads(payloads[0]);nodes=graph['@graph'];by_type={n['@type']:n for n in nodes}
        article=by_type['BlogPosting'];web=by_type['WebPage']
        visible=re.sub(r'<script\b.*?</script>|<style\b.*?</style>','',page,flags=re.S)
        text=plain(visible);ids=re.findall(r'\bid="([^"]+)"',visible)
        checks={
            'json_ld_matches_file':graph==json.loads((package/f'schema.{lang}.json').read_text()),
            'baseline_types':all(t in by_type for t in ['WebPage','BlogPosting','BreadcrumbList','Organization']),
            'headline_matches_h1':article['headline']==plain(re.search(r'<h1[^>]*>(.*?)</h1>',page,re.S)[1])==md.splitlines()[0][2:],
            'title_matches':plain(re.search(r'<title>(.*?)</title>',page,re.S)[1])==article['headline'],
            'description_matches':html.unescape(re.search(r'<meta name="description" content="([^"]*)"',page)[1])==article['description']==web['description'],
            'language_matches':re.search(r'<html lang="([^"]+)"',page)[1]==article['inLanguage']==web['inLanguage']==lang,
            'unique_dom_ids':len(ids)==len(set(ids)),
            'draft_noindex':'noindex' in page,
            'no_fabricated_publication':not any(k in article for k in ['datePublished','author','reviewedBy']),
            'citation_links_present':all(html.escape(u,quote=True) in page or u in page for u in article.get('citation',[])),
            'content_fragments_exist':all(n['@id'].rsplit('#',1)[-1] in ids for n in article.get('hasPart',[])),
        }
        checks.update(publication_checks(graph))
        known={n['@id'] for n in nodes if '@id' in n}
        def refs(o):
            if isinstance(o,dict):
                if set(o)=={'@id'}:yield o['@id']
                for v in o.values():yield from refs(v)
            elif isinstance(o,list):
                for v in o:yield from refs(v)
        checks['graph_references_resolve']=all(r in known for r in refs(nodes))
        date_config=package/'article-date.json'
        if date_config.exists():
            dates=json.loads(date_config.read_text())
            checks['owner_date_matches']=article.get('dateCreated')==dates['article_date'] and ('datetime="'+dates['article_date']+'"') in visible
            checks['actual_revision_date_matches']=article.get('dateModified')==dates['last_modified']
        faq=by_type.get('FAQPage')
        if faq:
            expected=[(q.strip(),a.strip()) for q,a in re.findall(r'### ([^\n]+)\n\n([^#]+)',md.split('\n## Technical references')[0].split('\n## 资料来源')[0])]
            actual=[(q['name'],q['acceptedAnswer']['text']) for q in faq['mainEntity']]
            checks['faq_exact_source_and_visible']=actual==expected and all(plain(q) in text and plain(a) in text for q,a in actual)
        listing=by_type.get('ItemList')
        if listing:
            entries=listing['itemListElement']
            fragment=listing['@id'].rsplit('#',1)[-1]
            table_html=visible.split('id="'+fragment+'"',1)[-1].split('</table>',1)[0]
            table_names=[plain(row[0]) for tr in re.findall(r'<tr[^>]*>(.*?)</tr>',table_html,re.S) if (row:=re.findall(r'<td[^>]*>(.*?)</td>',tr,re.S))]
            checks['list_matches_visible_rows']=fragment in ids and [e['name'] for e in entries]==table_names
            checks['list_count_order_visible']=listing['numberOfItems']==len(entries) and [e['position'] for e in entries]==list(range(1,len(entries)+1)) and all(e['name'] in text for e in entries)
        imgs=re.findall(r'<img\b[^>]*>',visible)
        checks['local_image_files_exist']=all((package/html.unescape(re.search(r'\bsrc="([^"]+)"',tag)[1])).is_file() for tag in imgs if not re.search(r'\bsrc="(?:https?:|data:)',tag))
        checks['image_nodes_match_rendered_count']=sum(n['@type']=='ImageObject' for n in nodes)==len(imgs)
        checks['images_have_alt']=all(re.search(r'\balt="[^"]+"',tag) for tag in imgs)
        checks['no_phantom_schema_images']=all(n.get('contentUrl','') in page for n in nodes if n['@type']=='ImageObject') and (bool(imgs) or 'image' not in article)
        results['locales'][lang]=checks
    results['passed']=bool(results['locales']) and results['source_and_output_hashes_current'] and all(all(c.values()) for c in results['locales'].values())
    return results
