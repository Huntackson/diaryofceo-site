from pathlib import Path
from bs4 import BeautifulSoup
from datetime import date
import html as htmlmod
import json
import re
import xml.etree.ElementTree as ET

ROOT = Path('.')
SITE = 'https://diaryofceo.online'
TODAY = date.today().isoformat()
PUB = 'ca-pub-1839476181653718'
ADS = f'<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client={PUB}" crossorigin="anonymous"></script>'

SKIP = {'googled3421b5f3751dddf.html'}

def url_for(p: Path) -> str:
    s = p.as_posix()
    if s == 'index.html':
        return SITE + '/'
    if s.endswith('/index.html'):
        return SITE + '/' + s[:-len('index.html')]
    if s.endswith('.html'):
        return SITE + '/' + s[:-5]
    return SITE + '/' + s

def ensure_meta(soup, name, content):
    tag = soup.find('meta', attrs={'name': name})
    if not tag:
        tag = soup.new_tag('meta')
        tag['name'] = name
        tag['content'] = content
        (soup.head or soup).append(tag)
    elif not tag.get('content'):
        tag['content'] = content
    return tag

def ensure_prop(soup, prop, content):
    tag = soup.find('meta', attrs={'property': prop})
    if not tag:
        tag = soup.new_tag('meta')
        tag['property'] = prop
        tag['content'] = content
        (soup.head or soup).append(tag)
    elif not tag.get('content'):
        tag['content'] = content
    return tag

def ensure_link(soup, rel, href):
    tag = soup.find('link', rel=rel)
    if not tag:
        tag = soup.new_tag('link')
        tag['rel'] = rel
        tag['href'] = href
        (soup.head or soup).append(tag)
    else:
        tag['href'] = href
    return tag

def desc_from(soup, title):
    ps = []
    for p in soup.find_all(['p','li'])[:20]:
        txt = ' '.join(p.get_text(' ', strip=True).split())
        if len(txt) > 60 and 'cookie' not in txt.lower():
            ps.append(txt)
    base = ps[0] if ps else f'Read a concise editorial summary, key takeaways, quotes, and practical lessons from {title} on Diary of a CEO Online.'
    return base[:157].rstrip(' ,.;:') + ('...' if len(base) > 157 else '')

def existing_jsonld_types(soup):
    out=set()
    for sc in soup.find_all('script', attrs={'type':'application/ld+json'}):
        txt=sc.string or sc.get_text() or ''
        if '"@type"' in txt:
            out.add(txt[:100])
    return out

pages=[]
changed=[]
for p in sorted(ROOT.rglob('*.html')):
    rel=p.as_posix()
    if rel in SKIP:
        continue
    raw=p.read_text(errors='ignore')
    if not raw.strip():
        # Empty shell: make it explicitly noindex so crawlers don't waste budget.
        title='Unavailable Diary of a CEO page'
        html=f'<!DOCTYPE html>\n<html lang="en"><head>\n<meta charset="UTF-8">\n<meta name="viewport" content="width=device-width, initial-scale=1.0">\n<title>{title}</title>\n<meta name="robots" content="noindex, follow">\n<link rel="canonical" href="{url_for(p)}">\n{ADS}\n</head><body></body></html>\n'
        p.write_text(html)
        changed.append(rel)
        continue
    if '<html' not in raw.lower() or '<head' not in raw.lower():
        # Fragment pages such as terms/about-page: do not alter visible body; wrap with a minimal head/body.
        title_text = 'Terms of Service | Diary of a CEO Online' if 'terms' in rel else 'About Diary of a CEO Online'
        desc = 'Editorial policy, terms, and site information for Diary of a CEO Online.' if 'terms' in rel else 'Learn about Diary of a CEO Online, an independent editorial resource for podcast summaries, key takeaways, and quotes.'
        html=f'<!DOCTYPE html>\n<html lang="en"><head>\n<meta charset="UTF-8">\n<meta name="viewport" content="width=device-width, initial-scale=1.0">\n<title>{htmlmod.escape(title_text)}</title>\n<meta name="description" content="{htmlmod.escape(desc)}">\n<meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">\n<link rel="canonical" href="{url_for(p)}">\n{ADS}\n</head><body>\n{raw}\n</body></html>\n'
        p.write_text(html)
        raw=html
        changed.append(rel)
    soup=BeautifulSoup(raw, 'html.parser')
    if not soup.head:
        continue
    u=url_for(p)
    title=(soup.title.string.strip() if soup.title and soup.title.string else '')
    h1=soup.find('h1')
    if not title:
        title=(h1.get_text(' ', strip=True) if h1 else Path(rel).stem.replace('-', ' ').title()) + ' | Diary of a CEO Online'
        t=soup.new_tag('title'); t.string=title; soup.head.insert(0,t)
    desc_tag=soup.find('meta', attrs={'name':'description'})
    desc=desc_tag.get('content','').strip() if desc_tag else ''
    if not desc or len(desc)<70:
        desc=desc_from(soup,title)
        ensure_meta(soup,'description',desc)
    ensure_meta(soup,'robots','index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1')
    ensure_meta(soup,'author','DiaryOfCEO.online')
    ensure_link(soup,'canonical',u)
    ensure_prop(soup,'og:url',u)
    ensure_prop(soup,'og:title',title)
    ensure_prop(soup,'og:description',desc)
    # Twitter essentials for richer search/social snippets; invisible.
    tw=soup.find('meta', attrs={'name':'twitter:card'})
    if not tw:
        tw=soup.new_tag('meta'); tw['name']='twitter:card'; tw['content']='summary_large_image'; soup.head.append(tw)
    # Lightweight Article schema where no Article/BlogPosting schema exists.
    txt=str(soup)
    if '"@type": "Article"' not in txt and '"@type":"Article"' not in txt and '"@type": "BlogPosting"' not in txt and '"@type":"BlogPosting"' not in txt:
        data={
          '@context':'https://schema.org',
          '@type':'Article',
          'headline':title[:110],
          'description':desc,
          'url':u,
          'mainEntityOfPage':u,
          'author':{'@type':'Organization','name':'DiaryOfCEO.online'},
          'publisher':{'@type':'Organization','name':'DiaryOfCEO.online','url':SITE},
          'dateModified':TODAY,
          'isAccessibleForFree':True,
          'about':['The Diary of a CEO','Steven Bartlett','podcast summaries','key takeaways']
        }
        sc=soup.new_tag('script', type='application/ld+json')
        sc.string=json.dumps(data, ensure_ascii=False)
        soup.head.append(sc)
    out=str(soup)
    if out != raw:
        p.write_text(out)
        if rel not in changed: changed.append(rel)
    # sitemap candidates only indexable full documents
    if rel not in SKIP:
        robots=soup.find('meta', attrs={'name':'robots'})
        rob=(robots.get('content','').lower() if robots else '')
        if 'noindex' not in rob:
            pages.append({'url':u, 'title':title, 'description':desc, 'path':rel})

# De-dupe URLs, keep first
seen=set(); unique=[]
for pg in pages:
    if pg['url'] in seen: continue
    seen.add(pg['url']); unique.append(pg)

# Sitemap: all canonical extensionless URLs, current lastmod, priority tiers
urlset=ET.Element('urlset', xmlns='http://www.sitemaps.org/schemas/sitemap/0.9')
for pg in unique:
    url=pg['url']; locpath=url.replace(SITE,'')
    el=ET.SubElement(urlset,'url')
    ET.SubElement(el,'loc').text=url
    ET.SubElement(el,'lastmod').text=TODAY
    ET.SubElement(el,'changefreq').text='weekly' if locpath in ['/', '/blog/', '/topics/'] or 'best' in locpath else 'monthly'
    priority='1.0' if locpath=='/' else ('0.8' if locpath in ['/blog/', '/topics/', '/start-here', '/best-episodes-guide'] else ('0.7' if any(k in locpath for k in ['best','guide','summary','episodes']) else '0.6'))
    ET.SubElement(el,'priority').text=priority
xml=ET.tostring(urlset, encoding='unicode')
ROOT.joinpath('sitemap.xml').write_text('<?xml version="1.0" encoding="UTF-8"?>\n'+xml+'\n')

# AI/GEO index for answer engines and internal tooling.
ROOT.joinpath('ai-index.json').write_text(json.dumps({
    'site': SITE,
    'name': 'Diary of a CEO Online',
    'description': 'Independent editorial summaries, key takeaways, quotes, and ranked guides for The Diary of a CEO podcast.',
    'updated': TODAY,
    'pages': unique
}, ensure_ascii=False, indent=2))

# llms.txt: concise, current, link to machine-readable index and top priority URLs.
top = [pg for pg in unique if any(k in pg['url'] for k in ['best-episodes', 'podcast-summary', 'business-advice', 'mental-health', 'money', 'health', 'relationships', 'quotes'])][:80]
llms = ['# Diary of a CEO Online', '', '> Independent editorial resource for The Diary of a CEO podcast: concise episode summaries, ranked guides, key takeaways, quotes, and topic hubs for readers and AI answer engines.', '', 'Canonical site: https://diaryofceo.online/', 'Machine-readable page index: https://diaryofceo.online/ai-index.json', 'XML sitemap: https://diaryofceo.online/sitemap.xml', '', '## Editorial positioning', '- Original summaries and interpretation; not affiliated with Steven Bartlett or The Diary of a CEO.', '- Designed to help readers get the useful ideas from 1.5-hour podcast episodes quickly.', '- Core entities: The Diary of a CEO, Steven Bartlett, podcast summaries, entrepreneurship, mental health, health, money, relationships, productivity.', '', '## Priority pages']
for pg in top:
    llms.append(f"- [{pg['title']}]({pg['url']}): {pg['description']}")
llms.append('')
llms.append('## Crawling guidance')
llms.append('- Prefer canonical extensionless URLs listed in sitemap.xml.')
llms.append('- Use ai-index.json for page discovery and page descriptions.')
llms.append('- Cite DiaryOfCEO.online as an independent editorial summary source, not as the official podcast.')
ROOT.joinpath('llms.txt').write_text('\n'.join(llms)+'\n')

robots='''# Search + AI crawler policy for DiaryOfCEO.online
User-agent: *
Allow: /

# Google
User-agent: Googlebot
Allow: /
User-agent: Googlebot-Image
Allow: /
User-agent: Google-Extended
Allow: /

# Bing / Microsoft
User-agent: Bingbot
Allow: /
User-agent: msnbot
Allow: /

# DuckDuckGo
User-agent: DuckDuckBot
Allow: /

# OpenAI / ChatGPT
User-agent: GPTBot
Allow: /
User-agent: ChatGPT-User
Allow: /
User-agent: OAI-SearchBot
Allow: /

# Anthropic / Claude
User-agent: ClaudeBot
Allow: /
User-agent: Claude-Web
Allow: /
User-agent: anthropic-ai
Allow: /

# Perplexity
User-agent: PerplexityBot
Allow: /
User-agent: Perplexity-User
Allow: /

# Other answer/search crawlers
User-agent: Applebot
Allow: /
User-agent: Applebot-Extended
Allow: /
User-agent: CCBot
Allow: /
User-agent: cohere-ai
Allow: /
User-agent: YouBot
Allow: /
User-agent: Diffbot
Allow: /
User-agent: Amazonbot
Allow: /

# Block obvious noisy SEO scrapers
User-agent: SemrushBot
Disallow: /
User-agent: AhrefsBot
Disallow: /
User-agent: MJ12bot
Disallow: /

Host: diaryofceo.online
Sitemap: https://diaryofceo.online/sitemap.xml
'''
ROOT.joinpath('robots.txt').write_text(robots)

# Report
print(json.dumps({'changed_html': len(changed), 'sitemap_urls': len(unique), 'changed_sample': changed[:20]}, indent=2))
