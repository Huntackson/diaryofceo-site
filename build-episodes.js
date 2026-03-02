const fs = require('fs');
const path = require('path');
const base = __dirname;

const topicDefs = [
  { key: 'mind', label: 'Mind & Psychology', file: 'topics/mind-psychology.html' },
  { key: 'health', label: 'Health & Body', file: 'topics/health-body.html' },
  { key: 'success', label: 'Success & Productivity', file: 'topics/success-productivity.html' },
  { key: 'money', label: 'Money & Business', file: 'topics/money-business.html' },
  { key: 'happiness', label: 'Happiness & Fulfillment', file: 'topics/happiness-fulfillment.html' },
  { key: 'tech', label: 'Technology & Future', file: 'topics/technology-future.html' },
  { key: 'relationships', label: 'Relationships & Love', file: 'topics/relationships.html' },
];

// Parse topic pages to get episode filenames per topic
const topicMap = {};
for (const t of topicDefs) {
  const content = fs.readFileSync(path.join(base, t.file), 'utf8');
  const matches = [...content.matchAll(/href=["']\/episodes\/([^"']+)["']/g)];
  topicMap[t.key] = matches.map(m => m[1]);
}

// Parse all episode files
const epDir = path.join(base, 'episodes');
const files = fs.readdirSync(epDir).filter(f => f.endsWith('.html') && f !== 'index.html');
const episodes = [];

for (const f of files) {
  const c = fs.readFileSync(path.join(epDir, f), 'utf8');
  const tm = c.match(/<title>([^<]*)<\/title>/i);
  const dm = c.match(/<meta\s+name=["']description["']\s+content=["']([^"']*)["']/i);
  let name = tm ? tm[1].replace(/\s*[-|–].*/,'').trim() : f.replace('.html','');
  const desc = dm ? dm[1] : '';
  const tags = [];
  for (const t of topicDefs) {
    if (topicMap[t.key].includes(f)) tags.push(t.key);
  }
  episodes.push({ file: f, name, desc, tags });
}

// Build HTML
const episodeDataJSON = JSON.stringify(episodes);
const topicDefsJSON = JSON.stringify(topicDefs.map(t => ({ key: t.key, label: t.label })));

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>All Episodes - The Diary of a CEO</title>
<meta name="description" content="Browse all episodes of The Diary of a CEO with Steven Bartlett. Filter by topic.">
<script async src="https://www.googletagmanager.com/gtag/js?id=G-1J3B0N6EMD"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-1J3B0N6EMD');</script>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#0f0f1e;color:#e0e0e0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;min-height:100vh}
a{color:#FFD700;text-decoration:none}
a:hover{text-decoration:underline}
nav{background:rgba(15,15,30,0.95);border-bottom:1px solid rgba(255,215,0,0.15);padding:1rem 2rem;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:100;backdrop-filter:blur(10px)}
.nav-brand{font-size:1.2rem;font-weight:700;color:#FFD700}
.nav-links{display:flex;gap:1.5rem}
.nav-links a{color:#ccc;font-size:0.95rem;transition:color 0.2s}
.nav-links a:hover,.nav-links a.active{color:#FFD700;text-decoration:none}
.container{max-width:1200px;margin:0 auto;padding:2rem 1.5rem}
h1{text-align:center;font-size:2.2rem;color:#FFD700;margin-bottom:0.5rem}
.subtitle{text-align:center;color:#888;margin-bottom:2rem}
.search-bar{display:flex;justify-content:center;margin-bottom:1.5rem}
.search-bar input{width:100%;max-width:500px;padding:0.75rem 1.2rem;border-radius:25px;border:1px solid rgba(255,215,0,0.3);background:rgba(255,255,255,0.05);color:#fff;font-size:1rem;outline:none;transition:border-color 0.3s}
.search-bar input:focus{border-color:#FFD700}
.search-bar input::placeholder{color:#666}
.topics{display:flex;flex-wrap:wrap;gap:0.5rem;justify-content:center;margin-bottom:2rem}
.topic-pill{padding:0.5rem 1.2rem;border-radius:20px;border:1px solid rgba(255,215,0,0.3);background:transparent;color:#ccc;cursor:pointer;font-size:0.9rem;transition:all 0.2s}
.topic-pill:hover{border-color:#FFD700;color:#FFD700}
.topic-pill.active{background:#FFD700;color:#0f0f1e;border-color:#FFD700;font-weight:600}
.count{text-align:center;color:#888;margin-bottom:1.5rem;font-size:0.95rem}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:1.2rem}
.card{background:rgba(255,255,255,0.04);border:1px solid rgba(255,215,0,0.08);border-radius:12px;padding:1.5rem;transition:all 0.3s;cursor:pointer;display:block}
.card:hover{border-color:rgba(255,215,0,0.4);transform:translateY(-2px);box-shadow:0 8px 25px rgba(255,215,0,0.08);text-decoration:none}
.card-name{font-size:1.15rem;font-weight:700;color:#FFD700;margin-bottom:0.5rem}
.card-desc{color:#aaa;font-size:0.9rem;line-height:1.5;margin-bottom:0.75rem;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}
.card-tags{display:flex;flex-wrap:wrap;gap:0.3rem}
.tag{font-size:0.7rem;padding:0.2rem 0.6rem;border-radius:10px;background:rgba(255,215,0,0.1);color:#FFD700;border:1px solid rgba(255,215,0,0.2)}
.no-results{text-align:center;color:#666;padding:3rem;font-size:1.1rem}
@media(max-width:600px){
  .grid{grid-template-columns:1fr}
  h1{font-size:1.6rem}
  nav{padding:0.8rem 1rem}
  .nav-links{gap:1rem}
  .nav-links a{font-size:0.85rem}
}
</style>
</head>
<body>
<nav>
  <a href="/" class="nav-brand">DOAC</a>
  <div class="nav-links">
    <a href="/">Home</a>
    <a href="/episodes/" class="active">Episodes</a>
    <a href="/topics/">Topics</a>
    <a href="/quotes/">Quotes</a>
    <a href="/best/">Best</a>
  </div>
</nav>
<div class="container">
  <h1>All Episodes</h1>
  <p class="subtitle">The Diary of a CEO with Steven Bartlett</p>
  <div class="search-bar"><input type="text" id="search" placeholder="Search by guest name..."></div>
  <div class="topics" id="topics"></div>
  <p class="count" id="count"></p>
  <div class="grid" id="grid"></div>
  <p class="no-results" id="noResults" style="display:none">No episodes found.</p>
</div>
<script>
const episodes = ${episodeDataJSON};
const topicDefs = ${topicDefsJSON};
let activeTopic = null;

const topicsEl = document.getElementById('topics');
const gridEl = document.getElementById('grid');
const countEl = document.getElementById('count');
const searchEl = document.getElementById('search');
const noResultsEl = document.getElementById('noResults');

// Build topic pills
function buildTopics() {
  let html = '<button class="topic-pill active" data-topic="all">All</button>';
  topicDefs.forEach(t => {
    html += '<button class="topic-pill" data-topic="' + t.key + '">' + t.label + '</button>';
  });
  topicsEl.innerHTML = html;
  topicsEl.querySelectorAll('.topic-pill').forEach(btn => {
    btn.addEventListener('click', () => {
      activeTopic = btn.dataset.topic === 'all' ? null : btn.dataset.topic;
      topicsEl.querySelectorAll('.topic-pill').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      render();
    });
  });
}

function render() {
  const q = searchEl.value.toLowerCase().trim();
  const filtered = episodes.filter(ep => {
    if (activeTopic && !ep.tags.includes(activeTopic)) return false;
    if (q && !ep.name.toLowerCase().includes(q)) return false;
    return true;
  });
  countEl.textContent = 'Showing ' + filtered.length + ' of ' + episodes.length + ' episodes';
  if (filtered.length === 0) {
    gridEl.innerHTML = '';
    noResultsEl.style.display = 'block';
    return;
  }
  noResultsEl.style.display = 'none';
  gridEl.innerHTML = filtered.map(ep => {
    const tagHtml = ep.tags.map(t => {
      const def = topicDefs.find(d => d.key === t);
      return '<span class="tag">' + (def ? def.label : t) + '</span>';
    }).join('');
    return '<a class="card" href="/episodes/' + ep.file + '">' +
      '<div class="card-name">' + ep.name + '</div>' +
      (ep.desc ? '<div class="card-desc">' + ep.desc + '</div>' : '') +
      (tagHtml ? '<div class="card-tags">' + tagHtml + '</div>' : '') +
      '</a>';
  }).join('');
}

buildTopics();
render();
searchEl.addEventListener('input', render);
</script>
</body>
</html>`;

fs.writeFileSync(path.join(base, 'episodes', 'index.html'), html, 'utf8');
console.log('Built episodes/index.html with ' + episodes.length + ' episodes');
console.log('Topic counts:', Object.fromEntries(topicDefs.map(t => [t.label, topicMap[t.key].length])));
