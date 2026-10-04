"""Check every unique HTTPS anchor in the built export; classify blocked links honestly."""
import concurrent.futures
import html
import json
from pathlib import Path
import re
import urllib.error
import urllib.request

root = Path(__file__).resolve().parents[1]
urls = set()
for path in (root / 'out').rglob('*.html'):
    for value in re.findall(r'href="(https://[^"]+)"', path.read_text()):
        urls.add(html.unescape(value))
if not urls:
    raise SystemExit('No HTTPS anchors collected; build the portfolio first')

def check(url):
    try:
        request = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        response = urllib.request.urlopen(request, timeout=30)
        return {'url': url, 'status': response.status, 'final_url': response.geturl(), 'classification': 'reachable'}
    except urllib.error.HTTPError as error:
        return {'url': url, 'status': error.code, 'classification': 'blocked' if error.code in [999, 403, 429] else 'broken'}
    except Exception as error:
        return {'url': url, 'status': None, 'classification': 'unverified', 'error': type(error).__name__}

with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
    results = list(pool.map(check, sorted(urls)))
(root / 'docs' / 'validation').mkdir(parents=True, exist_ok=True)
(root / 'docs' / 'validation' / 'external-links.json').write_text(json.dumps(results, indent=2))
print(json.dumps(results, indent=2))
broken = sum(result['classification'] == 'broken' for result in results)
print(f'Checked {len(results)} unique links; {broken} confirmed broken')
raise SystemExit(1 if broken else 0)
