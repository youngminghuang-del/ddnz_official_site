"""Verify public HTTP redirects using curl; no authenticated browser state."""
import json,subprocess,concurrent.futures,datetime
from pathlib import Path
root=Path(__file__).resolve().parents[1]
mappings=json.loads((root/'src/data/restoredBlogRedirects.json').read_text())
def response(url):
 p=subprocess.run(['curl','--silent','--show-error','--max-time','25','--dump-header','-','--output','/dev/null',url],capture_output=True,text=True)
 headers={};status=None
 for line in p.stdout.splitlines():
  if line.startswith('HTTP/'):
   status=int(line.split()[1]);headers={}
  elif ':' in line:
   k,v=line.split(':',1);headers[k.lower()]=v.strip()
 return {'status':status,'location':headers.get('location'),'error':p.stderr.strip() or None}
def check(row):
 source='https://www.ddnzglobal.com'+row['from'];target='https://www.ddnzglobal.com'+row['to'];a=response(source);b=response(target)
 return {**row,'source':a,'target':b,'passed':a['status']==301 and a['location']==target and b['status']==200}
rows=list(concurrent.futures.ThreadPoolExecutor(max_workers=3).map(check,mappings));out={'checked_at':datetime.datetime.now(datetime.timezone.utc).isoformat(),'passed':sum(r['passed'] for r in rows),'total':len(rows),'rows':rows}
(root/'docs/p0-remediation/live-redirect-verification.json').write_text(json.dumps(out,ensure_ascii=False,indent=2)+'\n');print(json.dumps(out,ensure_ascii=False,indent=2));raise SystemExit(0 if out['passed']==len(rows) else 1)
