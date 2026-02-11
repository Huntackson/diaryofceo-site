/**
 * DOAC Addiction Layer — Psychological Engagement System
 * Injects: fake social proof, streaks, achievements, exit intent, daily wisdom, trending badges
 */

(function() {
  'use strict';

  // ============================================
  // CONFIG
  // ============================================
  const STORAGE_KEY = 'doac_user';
  const NAMES = ['Sarah','James','Emma','Michael','Olivia','Liam','Sophia','Noah','Ava','Ethan','Isabella','Mason','Mia','Lucas','Charlotte','Logan','Amelia','Alexander','Harper','Daniel','Evelyn','Henry','Abigail','Sebastian','Emily','Jack','Ella','Owen','Scarlett','Aiden','Grace','Samuel','Chloe','Ryan','Victoria','Nathan','Riley','Leo','Aria','Caleb','Lily','Adrian','Nora','Dylan','Zoey','Elijah','Hannah','Mateo','Layla','Kai','Penelope','Omar','Fatima','Chen','Priya','Raj','Yuki','Hiroshi','Dmitri','Ingrid','Lars','Freya','Marco','Lucia','Andrei','Camille','Pierre','Aisha','Kwame','Thiago','Valentina'];
  const CITIES = ['London','New York','Toronto','Sydney','Dubai','Singapore','Berlin','Amsterdam','Stockholm','Paris','Tokyo','Mumbai','São Paulo','Lagos','Cape Town','Austin','Chicago','Seattle','Denver','Miami','Barcelona','Milan','Dublin','Melbourne','Auckland','Zurich','Copenhagen','Oslo','Helsinki','Seoul','Bangkok','Nairobi','Lima','Bogotá','Mexico City','Vancouver','Montreal','Edinburgh','Manchester','Bristol'];
  const ACTIONS = [
    'just read the {guest} episode',
    'just subscribed to the newsletter',
    'just shared a {guest} quote',
    'is reading the {guest} episode right now',
    'just bookmarked {guest}\'s top lessons',
    'just explored the {category} collection'
  ];
  const GUESTS_POPULAR = ['Alex Hormozi','Andrew Huberman','Jordan Peterson','MrBeast','Robert Greene','Michelle Obama','Simon Sinek','Chris Williamson','Jay Shetty','Gary Vaynerchuk','Naval Ravikant','Tim Ferriss','Brené Brown','Matthew Walker','David Goggins','Mark Manson','Cal Newport','James Clear','Mel Robbins','Tony Robbins'];
  const CATEGORIES = ['Mind & Psychology','Health & Body','Success & Productivity','Money & Business','Happiness & Fulfillment','Technology & Future','Relationships'];

  const LEVELS = [
    { name: 'Newcomer', min: 0, emoji: '🌱' },
    { name: 'Curious Mind', min: 3, emoji: '🔍' },
    { name: 'Knowledge Seeker', min: 10, emoji: '📚' },
    { name: 'Wisdom Hunter', min: 25, emoji: '🎯' },
    { name: 'Insight Collector', min: 50, emoji: '💎' },
    { name: 'Deep Thinker', min: 100, emoji: '🧠' },
    { name: 'Philosopher', min: 200, emoji: '🏛️' },
    { name: 'Enlightened', min: 400, emoji: '✨' },
    { name: 'DOAC Master', min: 600, emoji: '👑' }
  ];

  const DAILY_QUOTES = [
    { text: "The obstacle is the way. What stands in your way becomes the way.", guest: "Ryan Holiday" },
    { text: "You don't rise to the level of your goals, you fall to the level of your systems.", guest: "James Clear" },
    { text: "The moment you accept total responsibility for everything in your life is the moment you claim the power to change anything.", guest: "Hal Elrod" },
    { text: "Your input determines your outlook. Your outlook determines your output, and your output determines your future.", guest: "Zig Ziglar" },
    { text: "Discipline equals freedom.", guest: "Jocko Willink" },
    { text: "The quality of your life is determined by the quality of the questions you ask yourself.", guest: "Tony Robbins" },
    { text: "Don't watch the clock; do what it does. Keep going.", guest: "Sam Levenson" },
    { text: "What you do every day matters more than what you do once in a while.", guest: "Gretchen Rubin" },
    { text: "Success is not the key to happiness. Happiness is the key to success.", guest: "Albert Schweitzer" },
    { text: "The best time to plant a tree was 20 years ago. The second best time is now.", guest: "Chinese Proverb" },
    { text: "Stop being afraid of what could go wrong, and start being excited about what could go right.", guest: "Tony Robbins" },
    { text: "Small daily improvements over time lead to stunning results.", guest: "Robin Sharma" },
    { text: "The cave you fear to enter holds the treasure you seek.", guest: "Joseph Campbell" },
    { text: "Comparison is the thief of joy.", guest: "Theodore Roosevelt" },
    { text: "You become what you think about most of the time.", guest: "Earl Nightingale" },
    { text: "The only way to do great work is to love what you do.", guest: "Steve Jobs" },
    { text: "Vulnerability is the birthplace of innovation, creativity, and change.", guest: "Brené Brown" },
    { text: "Your network is your net worth.", guest: "Porter Gale" },
    { text: "We suffer more in imagination than in reality.", guest: "Seneca" },
    { text: "The secret of change is to focus all of your energy not on fighting the old, but on building the new.", guest: "Socrates" },
    { text: "If you want to be interesting, be interested.", guest: "Dale Carnegie" },
    { text: "Dopamine is not about pleasure. It's about the anticipation of pleasure.", guest: "Andrew Huberman" },
    { text: "Money follows attention. Attention follows value.", guest: "Alex Hormozi" },
    { text: "You can't connect the dots looking forward; you can only connect them looking backwards.", guest: "Steve Jobs" },
    { text: "The single most powerful asset we all have is our mind.", guest: "Robert Kiyosaki" },
    { text: "Motivation is what gets you started. Habit is what keeps you going.", guest: "Jim Ryun" },
    { text: "Your beliefs become your thoughts, your thoughts become your words, your words become your actions.", guest: "Mahatma Gandhi" },
    { text: "Don't let the noise of others' opinions drown out your own inner voice.", guest: "Steve Jobs" },
    { text: "The two most important days in your life are the day you are born and the day you find out why.", guest: "Mark Twain" },
    { text: "What you resist, persists. What you look at, disappears.", guest: "Neale Donald Walsch" },
    { text: "The man who moves a mountain begins by carrying away small stones.", guest: "Confucius" }
  ];

  // ============================================
  // USER STATE (localStorage)
  // ============================================
  function getUser() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch(e) {}
    return { episodes: [], streak: 0, lastVisit: null, totalVisits: 0, firstVisit: Date.now(), subscribedNewsletter: false, exitShown: false };
  }

  function saveUser(u) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(u)); } catch(e) {}
  }

  function updateStreak(user) {
    const now = new Date();
    const today = now.toDateString();
    if (user.lastVisit === today) return user;
    
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (user.lastVisit === yesterday.toDateString()) {
      user.streak++;
    } else if (user.lastVisit && user.lastVisit !== today) {
      user.streak = 1; // reset
    } else {
      user.streak = 1;
    }
    user.lastVisit = today;
    user.totalVisits++;
    return user;
  }

  function trackEpisode(slug) {
    const user = getUser();
    if (!user.episodes.includes(slug)) {
      user.episodes.push(slug);
    }
    saveUser(user);
    updateProgressBar();
  }

  function getLevel(count) {
    let level = LEVELS[0];
    for (const l of LEVELS) {
      if (count >= l.min) level = l;
    }
    return level;
  }

  function getNextLevel(count) {
    for (const l of LEVELS) {
      if (count < l.min) return l;
    }
    return null;
  }

  // ============================================
  // INJECT STYLES
  // ============================================
  function injectStyles() {
    const style = document.createElement('style');
    style.textContent = `
      /* Social proof toast */
      .doac-toast-container { position: fixed; bottom: 20px; left: 20px; z-index: 9999; display: flex; flex-direction: column; gap: 8px; pointer-events: none; }
      .doac-toast { background: rgba(20, 20, 40, 0.95); backdrop-filter: blur(10px); border: 1px solid rgba(255, 215, 0, 0.3); border-radius: 12px; padding: 12px 16px; display: flex; align-items: center; gap: 10px; animation: toastIn 0.5s ease, toastOut 0.5s ease 4.5s forwards; max-width: 340px; box-shadow: 0 8px 32px rgba(0,0,0,0.4); pointer-events: auto; }
      .doac-toast-dot { width: 8px; height: 8px; background: #4CAF50; border-radius: 50%; animation: pulse 1.5s infinite; flex-shrink: 0; }
      .doac-toast-text { color: #fff; font-size: 0.82rem; line-height: 1.4; }
      .doac-toast-text strong { color: #FFD700; }
      .doac-toast-time { color: #888; font-size: 0.7rem; margin-top: 2px; }
      @keyframes toastIn { from { opacity: 0; transform: translateX(-30px); } to { opacity: 1; transform: translateX(0); } }
      @keyframes toastOut { from { opacity: 1; } to { opacity: 0; transform: translateX(-30px); } }
      @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }

      /* Streak banner */
      .doac-streak-bar { background: linear-gradient(135deg, rgba(255,165,0,0.15), rgba(255,69,0,0.15)); border: 1px solid rgba(255,165,0,0.4); border-radius: 12px; padding: 10px 20px; margin: 0 auto 1.5rem; max-width: 600px; display: flex; align-items: center; justify-content: center; gap: 12px; animation: fadeIn 0.5s ease; }
      .doac-streak-fire { font-size: 1.5rem; animation: fireWiggle 0.5s ease infinite alternate; }
      .doac-streak-text { color: #FFD700; font-weight: 600; font-size: 0.95rem; }
      .doac-streak-sub { color: #aaa; font-size: 0.8rem; }
      @keyframes fireWiggle { from { transform: rotate(-5deg) scale(1); } to { transform: rotate(5deg) scale(1.1); } }

      /* Progress bar */
      .doac-progress-wrap { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 12px 20px; margin: 0 auto 1.5rem; max-width: 600px; animation: fadeIn 0.5s ease; }
      .doac-progress-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
      .doac-progress-level { color: #FFD700; font-weight: 600; font-size: 0.9rem; }
      .doac-progress-count { color: #aaa; font-size: 0.8rem; }
      .doac-progress-bar { height: 6px; background: rgba(255,255,255,0.1); border-radius: 3px; overflow: hidden; }
      .doac-progress-fill { height: 100%; background: linear-gradient(90deg, #FFD700, #FF6B6B); border-radius: 3px; transition: width 1s ease; }
      .doac-progress-next { color: #888; font-size: 0.75rem; margin-top: 6px; text-align: right; }

      /* Daily wisdom */
      .doac-daily-wisdom { background: linear-gradient(135deg, rgba(139,69,255,0.15), rgba(255,105,180,0.1)); border: 2px solid rgba(139,69,255,0.3); border-radius: 16px; padding: 24px; margin: 0 auto 2rem; max-width: 700px; text-align: center; animation: fadeIn 0.8s ease; position: relative; }
      .doac-daily-label { color: #8B45FF; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 12px; }
      .doac-daily-quote { color: #fff; font-size: 1.2rem; font-style: italic; line-height: 1.6; margin-bottom: 8px; }
      .doac-daily-author { color: #FFD700; font-size: 0.9rem; font-weight: 600; }
      .doac-daily-share { margin-top: 12px; display: flex; justify-content: center; gap: 8px; }
      .doac-daily-share button { background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: #fff; padding: 6px 14px; border-radius: 20px; cursor: pointer; font-size: 0.8rem; transition: all 0.3s; }
      .doac-daily-share button:hover { background: rgba(255,255,255,0.2); transform: scale(1.05); }

      /* Exit intent popup */
      .doac-exit-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.85); z-index: 10000; display: flex; align-items: center; justify-content: center; animation: fadeIn 0.3s ease; }
      .doac-exit-modal { background: linear-gradient(135deg, #1a1a2e, #16213e); border: 2px solid rgba(255,215,0,0.4); border-radius: 20px; padding: 40px; max-width: 480px; width: 90%; text-align: center; position: relative; box-shadow: 0 20px 60px rgba(0,0,0,0.5); animation: modalBounce 0.5s ease; }
      .doac-exit-close { position: absolute; top: 12px; right: 16px; background: none; border: none; color: #666; font-size: 1.5rem; cursor: pointer; }
      .doac-exit-emoji { font-size: 3rem; margin-bottom: 16px; }
      .doac-exit-title { color: #fff; font-size: 1.5rem; font-weight: 700; margin-bottom: 12px; line-height: 1.3; }
      .doac-exit-text { color: #aaa; font-size: 0.95rem; line-height: 1.5; margin-bottom: 20px; }
      .doac-exit-cta { display: inline-block; background: linear-gradient(135deg, #FFD700, #FFA500); color: #000; padding: 14px 32px; border-radius: 12px; font-weight: 700; font-size: 1.05rem; text-decoration: none; cursor: pointer; border: none; transition: all 0.3s; }
      .doac-exit-cta:hover { transform: scale(1.05); box-shadow: 0 8px 25px rgba(255,215,0,0.4); }
      .doac-exit-skip { color: #666; font-size: 0.8rem; margin-top: 12px; cursor: pointer; display: block; }
      @keyframes modalBounce { 0% { opacity: 0; transform: scale(0.8); } 50% { transform: scale(1.02); } 100% { opacity: 1; transform: scale(1); } }

      /* Trending badge */
      .doac-trending { display: inline-flex; align-items: center; gap: 4px; background: rgba(255,69,0,0.2); color: #FF6B6B; padding: 3px 10px; border-radius: 20px; font-size: 0.7rem; font-weight: 600; animation: trendPulse 2s infinite; }
      @keyframes trendPulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.7; } }

      /* Live counter */
      .doac-live-readers { display: inline-flex; align-items: center; gap: 6px; color: #4CAF50; font-size: 0.8rem; font-weight: 500; }
      .doac-live-dot { width: 6px; height: 6px; background: #4CAF50; border-radius: 50%; animation: pulse 1.5s infinite; }

      /* Notification bell */
      .doac-notif-badge { position: fixed; top: 80px; right: 20px; z-index: 8000; background: linear-gradient(135deg, #FFD700, #FFA500); color: #000; width: 48px; height: 48px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.3rem; cursor: pointer; box-shadow: 0 4px 15px rgba(255,215,0,0.4); transition: all 0.3s; animation: bellRing 0.5s ease; }
      .doac-notif-badge:hover { transform: scale(1.1); }
      .doac-notif-count { position: absolute; top: -4px; right: -4px; background: #FF6B6B; color: #fff; width: 20px; height: 20px; border-radius: 50%; font-size: 0.65rem; font-weight: 700; display: flex; align-items: center; justify-content: center; }
      @keyframes bellRing { 0%, 100% { transform: rotate(0); } 25% { transform: rotate(15deg); } 75% { transform: rotate(-15deg); } }

      @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

      @media (max-width: 768px) {
        .doac-toast { max-width: 280px; padding: 10px 12px; }
        .doac-toast-text { font-size: 0.75rem; }
        .doac-exit-modal { padding: 24px; }
        .doac-daily-wisdom { padding: 16px; margin: 0 1rem 1.5rem; }
      }
    `;
    document.head.appendChild(style);
  }

  // ============================================
  // 1. FAKE SOCIAL PROOF TOASTS
  // ============================================
  function startSocialProofToasts() {
    const container = document.createElement('div');
    container.className = 'doac-toast-container';
    document.body.appendChild(container);

    function showToast() {
      const name = NAMES[Math.floor(Math.random() * NAMES.length)];
      const city = CITIES[Math.floor(Math.random() * CITIES.length)];
      const guest = GUESTS_POPULAR[Math.floor(Math.random() * GUESTS_POPULAR.length)];
      const cat = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
      const actionTemplate = ACTIONS[Math.floor(Math.random() * ACTIONS.length)];
      const action = actionTemplate.replace('{guest}', guest).replace('{category}', cat);
      const timeAgo = Math.floor(Math.random() * 5) + 1;

      const toast = document.createElement('div');
      toast.className = 'doac-toast';
      toast.innerHTML = `
        <div class="doac-toast-dot"></div>
        <div>
          <div class="doac-toast-text"><strong>${name}</strong> from ${city} ${action}</div>
          <div class="doac-toast-time">${timeAgo} minute${timeAgo > 1 ? 's' : ''} ago</div>
        </div>
      `;
      container.appendChild(toast);

      setTimeout(() => { if (toast.parentNode) toast.remove(); }, 5500);

      // Keep max 2 toasts visible
      while (container.children.length > 2) container.firstChild.remove();
    }

    // First toast after 5-8 seconds
    setTimeout(showToast, 5000 + Math.random() * 3000);
    // Then every 15-35 seconds
    setInterval(() => {
      if (Math.random() > 0.3) showToast(); // 70% chance each interval
    }, 15000 + Math.random() * 20000);
  }

  // ============================================
  // 2. STREAK BANNER
  // ============================================
  function renderStreak(user) {
    if (user.streak < 2) return;
    const hero = document.querySelector('.hero') || document.querySelector('h1');
    if (!hero) return;

    const messages = [
      `${user.streak}-day streak! You're building wisdom habits 💪`,
      `${user.streak} days in a row! Top 5% of learners keep streaks alive`,
      `🔥 ${user.streak}-day streak! Don't break the chain!`,
      `Day ${user.streak}! Most people quit by day 3. Not you.`
    ];
    const msg = messages[user.streak % messages.length];
    const sub = user.streak >= 7 ? "You're in the top 1% of dedicated learners!" : "Come back tomorrow to keep it going!";

    const el = document.createElement('div');
    el.className = 'doac-streak-bar';
    el.innerHTML = `<span class="doac-streak-fire">🔥</span><div><div class="doac-streak-text">${msg}</div><div class="doac-streak-sub">${sub}</div></div>`;
    hero.parentNode.insertBefore(el, hero.nextSibling);
  }

  // ============================================
  // 3. PROGRESS BAR + LEVEL
  // ============================================
  function renderProgressBar(user) {
    const count = user.episodes.length;
    const level = getLevel(count);
    const nextLevel = getNextLevel(count);

    const target = document.querySelector('.newsletter-section') || document.querySelector('.category-section');
    if (!target) return;

    const pct = nextLevel ? ((count - level.min) / (nextLevel.min - level.min)) * 100 : 100;

    const el = document.createElement('div');
    el.className = 'doac-progress-wrap';
    el.id = 'doac-progress';
    el.innerHTML = `
      <div class="doac-progress-header">
        <span class="doac-progress-level">${level.emoji} ${level.name}</span>
        <span class="doac-progress-count">${count}/178 episodes explored</span>
      </div>
      <div class="doac-progress-bar"><div class="doac-progress-fill" style="width:${Math.min(pct, 100)}%"></div></div>
      ${nextLevel ? `<div class="doac-progress-next">Next: ${nextLevel.emoji} ${nextLevel.name} (${nextLevel.min - count} more)</div>` : '<div class="doac-progress-next">🏆 You\'ve reached the highest level!</div>'}
    `;
    target.parentNode.insertBefore(el, target);
  }

  function updateProgressBar() {
    const user = getUser();
    const existing = document.getElementById('doac-progress');
    if (existing) {
      const count = user.episodes.length;
      const level = getLevel(count);
      const nextLevel = getNextLevel(count);
      const pct = nextLevel ? ((count - level.min) / (nextLevel.min - level.min)) * 100 : 100;
      existing.querySelector('.doac-progress-level').textContent = `${level.emoji} ${level.name}`;
      existing.querySelector('.doac-progress-count').textContent = `${count}/178 episodes explored`;
      existing.querySelector('.doac-progress-fill').style.width = `${Math.min(pct, 100)}%`;
    }
  }

  // ============================================
  // 4. DAILY WISDOM QUOTE
  // ============================================
  function renderDailyWisdom() {
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
    const quote = DAILY_QUOTES[dayOfYear % DAILY_QUOTES.length];

    const hero = document.querySelector('.hero');
    if (!hero) return;

    const el = document.createElement('div');
    el.className = 'doac-daily-wisdom';
    el.innerHTML = `
      <div class="doac-daily-label">✨ Today's Wisdom — ${new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</div>
      <div class="doac-daily-quote">"${quote.text}"</div>
      <div class="doac-daily-author">— ${quote.guest}</div>
      <div class="doac-daily-share">
        <button onclick="window.open('https://twitter.com/intent/tweet?text=${encodeURIComponent('"' + quote.text + '" — ' + quote.guest + ' via @doacwisdom')}&url=${encodeURIComponent('https://diaryofceo.online')}', '_blank')">🐦 Share</button>
        <button onclick="navigator.clipboard.writeText('${quote.text.replace(/'/g,"\\'")} — ${quote.guest}');this.textContent='✅ Copied!'">📋 Copy</button>
      </div>
    `;
    hero.parentNode.insertBefore(el, hero.nextSibling);
  }

  // ============================================
  // 5. EXIT INTENT POPUP
  // ============================================
  function setupExitIntent() {
    const user = getUser();
    if (user.subscribedNewsletter) return;

    let cooldown = false;

    document.addEventListener('mouseleave', (e) => {
      if (e.clientY <= 0 && !cooldown) {
        cooldown = true;
        showExitPopup();
        // Allow showing again after 60 seconds
        setTimeout(() => { cooldown = false; }, 60000);
      }
    });

    // Mobile: show every 45 seconds of scrolling
    if ('ontouchstart' in window) {
      setInterval(() => {
        if (!cooldown && window.scrollY > document.body.scrollHeight * 0.3) {
          cooldown = true;
          showExitPopup();
          setTimeout(() => { cooldown = false; }, 60000);
        }
      }, 45000);
    }
  }

  function showExitPopup() {
    const quote = DAILY_QUOTES[Math.floor(Math.random() * DAILY_QUOTES.length)];
    const overlay = document.createElement('div');
    overlay.className = 'doac-exit-overlay';
    overlay.innerHTML = `
      <div class="doac-exit-modal">
        <button class="doac-exit-close" onclick="this.closest('.doac-exit-overlay').remove()">×</button>
        <div class="doac-exit-emoji">🧠</div>
        <div class="doac-exit-title">Wait — You Haven't Seen<br>Today's #1 Insight</div>
        <div class="doac-exit-text">"${quote.text}"<br><span style="color:#FFD700;">— ${quote.guest}</span></div>
        <div style="margin-bottom:8px;color:#aaa;font-size:0.8rem;">Join 10,000+ readers getting weekly DOAC wisdom 👇</div>
        <a href="#newsletter" class="doac-exit-cta" onclick="this.closest('.doac-exit-overlay').remove()">Get Free Weekly Insights →</a>
        <span class="doac-exit-skip" onclick="this.closest('.doac-exit-overlay').remove()">No thanks, I'll figure it out myself</span>
      </div>
    `;
    document.body.appendChild(overlay);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });
  }

  // ============================================
  // 6. TRENDING BADGES ON EPISODE CARDS
  // ============================================
  function addTrendingBadges() {
    // Add "trending" and "live readers" to episode cards on the homepage
    const cards = document.querySelectorAll('.episode-card, a[href*="/episodes/"]');
    cards.forEach((card, i) => {
      if (Math.random() > 0.4) { // 60% of visible cards get a badge
        const readers = Math.floor(Math.random() * 80) + 12;
        const badge = document.createElement('div');
        badge.style.cssText = 'margin-top:8px;display:flex;gap:10px;align-items:center;flex-wrap:wrap;';
        badge.innerHTML = `
          <span class="doac-trending">🔥 Trending</span>
          <span class="doac-live-readers"><span class="doac-live-dot"></span>${readers} reading now</span>
        `;
        card.appendChild(badge);
      }
    });
  }

  // ============================================
  // 7. EPISODE PAGE TRACKING
  // ============================================
  function trackCurrentPage() {
    const path = window.location.pathname;
    if (path.startsWith('/episodes/') && path.endsWith('.html')) {
      const slug = path.replace('/episodes/', '').replace('.html', '');
      trackEpisode(slug);
    }
  }

  // ============================================
  // 8. LIVE READER COUNT ON EPISODE PAGES
  // ============================================
  function addEpisodePageEngagement() {
    const path = window.location.pathname;
    if (!path.startsWith('/episodes/') || !path.endsWith('.html')) return;

    const readers = Math.floor(Math.random() * 45) + 8;
    const readTime = Math.floor(Math.random() * 4) + 3;

    const h1 = document.querySelector('h1');
    if (!h1) return;

    const el = document.createElement('div');
    el.style.cssText = 'display:flex;gap:16px;align-items:center;flex-wrap:wrap;margin:8px 0 16px;';
    el.innerHTML = `
      <span class="doac-live-readers"><span class="doac-live-dot"></span>${readers} people reading this right now</span>
      <span style="color:#888;font-size:0.8rem;">⏱️ ${readTime} min read</span>
      <span class="doac-trending">🔥 Popular this week</span>
    `;
    h1.parentNode.insertBefore(el, h1.nextSibling);
  }

  // ============================================
  // 9. "PEOPLE ALSO READ" URGENCY
  // ============================================
  function addScrollPrompt() {
    let prompted = false;
    window.addEventListener('scroll', () => {
      if (prompted) return;
      const scrollPct = window.scrollY / (document.body.scrollHeight - window.innerHeight);
      if (scrollPct > 0.6) {
        prompted = true;
        const el = document.createElement('div');
        el.style.cssText = 'position:fixed;bottom:80px;right:20px;background:rgba(20,20,40,0.95);backdrop-filter:blur(10px);border:1px solid rgba(255,215,0,0.3);border-radius:12px;padding:14px 18px;z-index:9000;animation:fadeIn 0.5s ease;max-width:280px;cursor:pointer;';
        el.innerHTML = `<div style="color:#FFD700;font-weight:600;font-size:0.85rem;margin-bottom:4px;">📚 Keep Learning?</div><div style="color:#ccc;font-size:0.8rem;">87% of readers explore 3+ episodes in their first visit</div>`;
        el.onclick = () => { window.scrollTo({ top: 0, behavior: 'smooth' }); el.remove(); };
        document.body.appendChild(el);
        setTimeout(() => { if (el.parentNode) el.remove(); }, 8000);
      }
    });
  }

  // ============================================
  // INIT
  // ============================================
  function init() {
    injectStyles();
    
    let user = getUser();
    user = updateStreak(user);
    saveUser(user);

    trackCurrentPage();

    // Homepage-only features
    const isHome = window.location.pathname === '/' || window.location.pathname === '/index.html';
    if (isHome) {
      renderDailyWisdom();
      renderStreak(user);
      renderProgressBar(user);
      setTimeout(addTrendingBadges, 1000); // wait for dynamic content to render
    }

    // All pages
    addEpisodePageEngagement();
    startSocialProofToasts();
    setupExitIntent();
    addScrollPrompt();
  }

  // Run when DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
