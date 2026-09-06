(() => {
  'use strict';
  const search = document.getElementById('episode-search');
  const grid = document.getElementById('episode-grid');
  if (search && grid) {
    let catalog = [], active = 'All', limit = 9;
    const status = document.getElementById('results-status');
    const more = document.getElementById('load-more');
    const escape = value => String(value || '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
    const render = () => {
      const terms = search.value.toLowerCase().trim().split(/\s+/).filter(Boolean);
      const results = catalog.filter(e => (active === 'All' || e.categories.split(',').map(s => s.trim()).includes(active)) && terms.every(q => `${e.guest} ${e.title} ${e.categories}`.toLowerCase().includes(q)));
      status.textContent = `${results.length} ${results.length === 1 ? 'conversation' : 'conversations'}${active === 'All' ? '' : ` in ${active.toLowerCase()}`}`;
      grid.innerHTML = results.length ? results.slice(0,limit).map(e => `<article class="episode-card"><span class="eyebrow">${escape(e.categories.split(',')[0])}</span><h3>${escape(e.guest === "The Diary of a CEO" ? e.title : e.guest)}</h3><p>${escape(e.guest === "The Diary of a CEO" ? "The Diary of a CEO · Original episode" : e.title)}</p><a href="https://www.youtube.com/watch?v=${encodeURIComponent(e.video_id)}" target="_blank" rel="noopener">Watch the original conversation ↗</a></article>`).join('') : '<p class="empty">No conversations match yet. Try a guest’s name, a shorter search, or another topic.</p>';
      more.hidden = results.length <= limit;
      document.querySelectorAll('[data-filter]').forEach(b => b.setAttribute('aria-pressed',String(b.dataset.filter === active)));
    };
    search.addEventListener('input',()=>{limit=9;render();});
    document.getElementById('clear-search').addEventListener('click',()=>{search.value='';active='All';limit=9;render();search.focus();});
    document.querySelectorAll('[data-filter]').forEach(b=>b.addEventListener('click',()=>{active=b.dataset.filter;limit=9;render();}));
    document.querySelectorAll('[data-topic]').forEach(a=>a.addEventListener('click',()=>{active=a.dataset.topic;search.value='';limit=9;render();}));
    more.addEventListener('click',()=>{limit+=9;render();});
    fetch('/assets/catalog.json').then(r=>{if(!r.ok)throw Error();return r.json();}).then(data=>{catalog=data.filter(e=>/^[a-zA-Z0-9_-]{11}$/.test(e.video_id));render();}).catch(()=>{status.textContent='The catalog could not load. Please refresh, or explore the featured conversations above.';});
  }
  const newsletter = document.getElementById('editorial-newsletter');
  if(newsletter) newsletter.addEventListener('submit',e=>{
    e.preventDefault();
    if(!window.DOACNewsletter){document.getElementById('newsletter-status').textContent='The signup form could not load. Please refresh and try again.';return;}
    window.DOACNewsletter.handleFormSubmit(newsletter,{messageId:'newsletter-status',source:'doac_editorial',formId:'weekly-edit',context:'homepage',colors:{success:'#283b19',error:'#8a2518'}});
  });
  const notes = document.getElementById('reflection-form');
  if(notes){
    document.getElementById('download-notes').addEventListener('click',()=>{
      const values=new FormData(notes); const text=['MY REFLECTION SHEET','DiaryOfCEO.online — independent editorial exercise','',...['source','idea','interpretation','experiment','review'].map(k=>`${notes.querySelector(`label[for="${k}"]`).textContent}\n${values.get(k)||'—'}\n`)].join('\n');
      const url=URL.createObjectURL(new Blob([text],{type:'text/plain;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='my-reflection.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);document.getElementById('notes-status').textContent='Your notes have been prepared for download.';
    });
    document.getElementById('print-notes').addEventListener('click',()=>window.print());
  }
})();
// Preserve the existing site's analytics property on production only. No email or notes are sent.
(() => {
  if(!['diaryofceo.online','www.diaryofceo.online'].includes(location.hostname)) return;
  window.dataLayer=window.dataLayer||[];
  window.gtag=window.gtag||function(){window.dataLayer.push(arguments);};
  window.gtag('js',new Date());window.gtag('config','G-1J3B0N6EMD');
  const script=document.createElement('script');script.async=true;script.src='https://www.googletagmanager.com/gtag/js?id=G-1J3B0N6EMD';document.head.appendChild(script);
  document.addEventListener('click',event=>{const link=event.target.closest('a[data-checkout]');if(link)window.gtag('event','checkout_click',{product:link.dataset.checkout});});
})();
