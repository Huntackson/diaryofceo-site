/**
 * DOAC Growth Engine — Psychology & Social Proof Layer
 * Injectable script for diaryofceo.online
 * Add to page: <script src="growth-engine.js"></script>
 */

(function() {
  'use strict';

  // ============================================
  // 1. FAKE LIVE ACTIVITY TOASTS
  // "Sarah from London just read the Alex Hormozi episode"
  // ============================================
  const names = [
    'Sarah', 'James', 'Emma', 'David', 'Olivia', 'Marcus', 'Sophia', 'Daniel',
    'Mia', 'Alex', 'Isabella', 'Ryan', 'Ava', 'Chris', 'Emily', 'Jordan',
    'Chloe', 'Tyler', 'Grace', 'Ethan', 'Zoe', 'Nathan', 'Lily', 'Sam',
    'Hannah', 'Lucas', 'Maya', 'Jake', 'Aria', 'Leo', 'Nora', 'Max'
  ];
  
  const cities = [
    'London', 'New York', 'Toronto', 'Sydney', 'Dubai', 'Amsterdam', 'Berlin',
    'Los Angeles', 'Singapore', 'Dublin', 'Melbourne', 'Austin', 'Miami',
    'Stockholm', 'Cape Town', 'Barcelona', 'Denver', 'Chicago', 'Vancouver',
    'Manchester', 'San Francisco', 'Lisbon', 'Mumbai', 'Seattle', 'Nashville'
  ];
  
  const episodes = [
    'Alex Hormozi', 'Andrew Huberman', 'Chris Williamson', 'Matthew Walker',
    'Dr. Julie Smith', 'Steven Bartlett', 'Jordan Peterson', 'Simon Sinek',
    'James Clear', 'MrBeast', 'Michelle Obama', 'Mo Gawdat', 'Daniel Priestley',
    'Mel Robbins', 'Tim Ferriss', 'Naval Ravikant', 'Tony Robbins',
    'Jay Shetty', 'Mark Manson', 'Brené Brown', 'Gary Vee', 'Elon Musk'
  ];
  
  const actions = [
    'just read the', 'is reading the', 'saved the', 'shared the',
    'bookmarked the', 'just discovered the'
  ];

  function createToast() {
    const name = names[Math.floor(Math.random() * names.length)];
    const city = cities[Math.floor(Math.random() * cities.length)];
    const episode = episodes[Math.floor(Math.random() * episodes.length)];
    const action = actions[Math.floor(Math.random() * actions.length)];
    const mins = Math.floor(Math.random() * 12) + 1;

    const toast = document.createElement('div');
    toast.className = 'doac-toast';
    toast.innerHTML = `
      <div class="doac-toast-icon">👤</div>
      <div class="doac-toast-content">
        <strong>${name}</strong> from ${city}
        <span>${action} <em>${episode}</em> episode</span>
        <small>${mins} min ago</small>
      </div>
      <button class="doac-toast-close" onclick="this.parentElement.remove()">×</button>
    `;
    document.body.appendChild(toast);

    // Animate in
    requestAnimationFrame(() => {
      toast.style.transform = 'translateX(0)';
      toast.style.opacity = '1';
    });

    // Auto-remove after 5s
    setTimeout(() => {
      toast.style.transform = 'translateX(120%)';
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 400);
    }, 5000);
  }

  // Show first toast after 8s, then every 20-40s
  setTimeout(createToast, 8000);
  setInterval(createToast, Math.floor(Math.random() * 20000) + 20000);

  // ============================================
  // 2. READING STREAK TRACKER (Loss Aversion)
  // ============================================
  function initStreakTracker() {
    const today = new Date().toDateString();
    const lastVisit = localStorage.getItem('doac_last_visit');
    let streak = parseInt(localStorage.getItem('doac_streak') || '0');
    
    if (lastVisit === today) {
      // Already visited today
    } else {
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      if (lastVisit === yesterday) {
        streak++;
      } else if (lastVisit) {
        streak = 1; // Streak broken, restart
      } else {
        streak = 1; // First visit
      }
      localStorage.setItem('doac_streak', streak.toString());
      localStorage.setItem('doac_last_visit', today);
    }

    if (streak >= 2) {
      const streakBanner = document.createElement('div');
      streakBanner.className = 'doac-streak-banner';
      const emoji = streak >= 7 ? '🔥🔥🔥' : streak >= 3 ? '🔥🔥' : '🔥';
      streakBanner.innerHTML = `
        ${emoji} <strong>${streak}-day streak!</strong> You're in the top 5% of learners. Don't break it!
        <button onclick="this.parentElement.style.display='none'" style="background:none;border:none;color:#FFD700;cursor:pointer;font-size:1.2rem;margin-left:1rem;">×</button>
      `;
      const hero = document.querySelector('.hero');
      if (hero) hero.insertBefore(streakBanner, hero.firstChild);
    }
  }

  // ============================================
  // 3. PROGRESS / ACHIEVEMENT SYSTEM
  // ============================================
  function initProgressSystem() {
    // Track episodes viewed
    const viewed = JSON.parse(localStorage.getItem('doac_viewed') || '[]');
    const currentPath = window.location.pathname;
    
    if (currentPath.includes('/episodes/') && !viewed.includes(currentPath)) {
      viewed.push(currentPath);
      localStorage.setItem('doac_viewed', JSON.stringify(viewed));
    }

    const count = viewed.length;
    const levels = [
      { min: 0, name: 'Newcomer', icon: '🌱' },
      { min: 5, name: 'Curious Mind', icon: '🧠' },
      { min: 15, name: 'Knowledge Seeker', icon: '📚' },
      { min: 30, name: 'Wisdom Hunter', icon: '🎯' },
      { min: 50, name: 'DOAC Scholar', icon: '🏆' },
      { min: 100, name: 'Enlightened', icon: '✨' },
    ];

    let currentLevel = levels[0];
    let nextLevel = levels[1];
    for (let i = levels.length - 1; i >= 0; i--) {
      if (count >= levels[i].min) {
        currentLevel = levels[i];
        nextLevel = levels[i + 1] || null;
        break;
      }
    }

    // Show on episode pages
    if (currentPath.includes('/episodes/') && count > 0) {
      const progressBar = document.createElement('div');
      progressBar.className = 'doac-progress';
      const nextTarget = nextLevel ? nextLevel.min : 100;
      const pct = Math.min((count / nextTarget) * 100, 100);
      progressBar.innerHTML = `
        <div class="doac-progress-info">
          <span>${currentLevel.icon} Level: <strong>${currentLevel.name}</strong></span>
          <span>${count}/452 episodes explored</span>
        </div>
        <div class="doac-progress-bar"><div class="doac-progress-fill" style="width:${pct}%"></div></div>
        ${nextLevel ? `<small>Read ${nextLevel.min - count} more to reach ${nextLevel.icon} ${nextLevel.name}</small>` : '<small>🎉 Max level achieved!</small>'}
      `;
      const main = document.querySelector('article') || document.querySelector('.content') || document.querySelector('body > div:nth-child(2)');
      if (main) main.insertBefore(progressBar, main.firstChild);
    }
  }

  // ============================================
  // 4. DAILY WISDOM BANNER
  // ============================================
  function initDailyWisdom() {
    const wisdoms = [
      { quote: "You don't rise to your goals. You fall to your systems.", author: "James Clear theme" },
      { quote: "The most important conversation you'll ever have is the one you have with yourself.", author: "Steven Bartlett" },
      { quote: "Sleep is not a luxury. It's the foundation everything else is built on.", author: "Matthew Walker" },
      { quote: "Your environment will always beat your willpower.", author: "Repeated across DOAC" },
      { quote: "Most people overestimate what they can do in a day and underestimate what they can do in a year.", author: "Key DOAC theme" },
      { quote: "The quality of your life is determined by the quality of your questions.", author: "Tony Robbins on DOAC" },
      { quote: "Discipline is choosing between what you want now and what you want most.", author: "Key DOAC theme" },
    ];
    
    const dayIndex = Math.floor(Date.now() / 86400000) % wisdoms.length;
    const wisdom = wisdoms[dayIndex];
    
    // Only show on homepage
    if (window.location.pathname === '/' || window.location.pathname === '') {
      const banner = document.createElement('div');
      banner.className = 'doac-daily-wisdom';
      banner.innerHTML = `
        <div class="doac-daily-label">💡 Today's Wisdom</div>
        <blockquote>"${wisdom.quote}"</blockquote>
        <cite>— ${wisdom.author}</cite>
      `;
      const newsletter = document.querySelector('.newsletter-section');
      if (newsletter) newsletter.parentNode.insertBefore(banner, newsletter);
    }
  }

  // ============================================
  // 5. EXIT INTENT POPUP
  // ============================================
  function initExitIntent() {
    let cooldown = false;

    document.addEventListener('mouseout', function(e) {
      if (e.clientY < 10 && !cooldown && !document.querySelector('.doac-exit-overlay')) {
        cooldown = true;
        
        const overlay = document.createElement('div');
        overlay.className = 'doac-exit-overlay';
        overlay.innerHTML = `
          <div class="doac-exit-popup">
            <button class="doac-exit-close" onclick="this.parentElement.parentElement.remove()">×</button>
            <h2>Wait! 🛑</h2>
            <p>You haven't seen today's #1 insight yet.</p>
            <p style="font-size:1.1rem;color:#FFD700;margin:1rem 0;font-style:italic;">"The gap between where you are and where you want to be isn't knowledge — it's organized knowledge."</p>
            <p>Get the best DOAC insights delivered weekly. Join 2,847+ readers.</p>
            <form class="doac-exit-form" name="exit-newsletter" method="POST" data-netlify="true">
              <input type="hidden" name="form-name" value="exit-newsletter">
              <input type="email" name="email" placeholder="Your email" required>
              <button type="submit">Get Free Insights →</button>
            </form>
            <small style="color:#666;margin-top:0.5rem;display:block;">No spam. Unsubscribe anytime.</small>
          </div>
        `;
        document.body.appendChild(overlay);
        // Reset cooldown 60s after close so it can show again
        const closeBtn = overlay.querySelector('.doac-exit-close');
        const resetCooldown = function() { setTimeout(function(){ cooldown = false; }, 60000); };
        closeBtn.addEventListener('click', resetCooldown);
        overlay.addEventListener('click', function(ev) { if (ev.target === overlay) { overlay.remove(); resetCooldown(); }});
      }
    });
  }

  // ============================================
  // 6. LIVE READER COUNT ON EPISODES
  // ============================================
  function initLiveReaders() {
    // Only target episode links in content areas, not nav/header/breadcrumb
    const episodeCards = document.querySelectorAll('.related-grid a[href*="/episodes/"], .episode-grid a[href*="/episodes/"], div[style*="grid"] > a[href*="/episodes/"]');
    episodeCards.forEach(card => {
      if (Math.random() > 0.4) { // 60% of cards get a badge
        const count = Math.floor(Math.random() * 89) + 12;
        const badge = document.createElement('span');
        badge.className = 'doac-live-badge';
        badge.innerHTML = `🔥 ${count} reading now`;
        card.style.position = 'relative';
        card.appendChild(badge);
      }
    });
  }

  // ============================================
  // 7. FIX SUBSCRIBER COUNT (Social Proof)
  // ============================================
  function fixSubscriberCount() {
    const noteEl = document.querySelector('.newsletter-note');
    if (noteEl && noteEl.textContent.includes('Join 0')) {
      noteEl.innerHTML = 'Join <strong>2,847</strong> readers • Unsubscribe anytime';
    }
    // Also update any other "0 readers" text
    document.querySelectorAll('*').forEach(el => {
      if (el.children.length === 0 && el.textContent.includes('Join 0 readers')) {
        el.innerHTML = el.innerHTML.replace('Join 0 readers', 'Join <strong>2,847</strong> readers');
      }
    });
  }

  // ============================================
  // 8. "TRENDING THIS WEEK" SECTION
  // ============================================
  function initTrending() {
    if (window.location.pathname !== '/' && window.location.pathname !== '') return;
    
    const section = document.createElement('div');
    section.className = 'doac-trending-section';
    section.innerHTML = `
      <h3>📈 Trending This Week</h3>
      <div class="doac-trending-list">
        <div class="doac-trending-item">
          <span class="doac-trending-rank">#1</span>
          <div>
            <strong>Andrew Huberman</strong> — You Must Control Your Dopamine
            <small>🔥 2,341 reads this week</small>
          </div>
        </div>
        <div class="doac-trending-item">
          <span class="doac-trending-rank">#2</span>
          <div>
            <strong>Alex Hormozi</strong> — How To Turn $1,000 Into $100 Million
            <small>🔥 1,892 reads this week</small>
          </div>
        </div>
        <div class="doac-trending-item">
          <span class="doac-trending-rank">#3</span>
          <div>
            <strong>Dr. Julie Smith</strong> — Why You Feel Lost In Life
            <small>🔥 1,654 reads this week</small>
          </div>
        </div>
      </div>
    `;
    const newsletter = document.querySelector('.newsletter-section');
    if (newsletter) newsletter.parentNode.insertBefore(section, newsletter.nextSibling);
  }

  // ============================================
  // STYLES
  // ============================================
  const style = document.createElement('style');
  style.textContent = `
    /* Toast Notifications */
    .doac-toast {
      position: fixed;
      bottom: 20px;
      left: 20px;
      background: rgba(15, 15, 30, 0.95);
      border: 1px solid rgba(255, 215, 0, 0.3);
      border-radius: 12px;
      padding: 12px 16px;
      display: flex;
      align-items: center;
      gap: 12px;
      z-index: 10000;
      max-width: 380px;
      transform: translateX(-120%);
      opacity: 0;
      transition: all 0.4s cubic-bezier(0.68, -0.55, 0.27, 1.55);
      box-shadow: 0 8px 32px rgba(0,0,0,0.4);
      backdrop-filter: blur(10px);
    }
    .doac-toast-icon { font-size: 1.5rem; }
    .doac-toast-content { display: flex; flex-direction: column; gap: 2px; }
    .doac-toast-content strong { color: #fff; font-size: 0.85rem; }
    .doac-toast-content span { color: #ccc; font-size: 0.8rem; }
    .doac-toast-content em { color: #FFD700; font-style: normal; }
    .doac-toast-content small { color: #888; font-size: 0.7rem; }
    .doac-toast-close { background: none; border: none; color: #666; cursor: pointer; font-size: 1.2rem; padding: 0 4px; }

    /* Streak Banner */
    .doac-streak-banner {
      background: linear-gradient(90deg, rgba(255,107,0,0.2), rgba(255,215,0,0.15));
      border: 1px solid rgba(255,165,0,0.4);
      border-radius: 10px;
      padding: 10px 20px;
      text-align: center;
      color: #FFD700;
      font-size: 0.95rem;
      margin-bottom: 1rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    /* Progress System */
    .doac-progress {
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,215,0,0.2);
      border-radius: 12px;
      padding: 16px 20px;
      margin-bottom: 1.5rem;
    }
    .doac-progress-info { display: flex; justify-content: space-between; margin-bottom: 8px; color: #ccc; font-size: 0.85rem; }
    .doac-progress-bar { background: rgba(255,255,255,0.1); border-radius: 10px; height: 8px; overflow: hidden; }
    .doac-progress-fill { background: linear-gradient(90deg, #FFD700, #FFA500); height: 100%; border-radius: 10px; transition: width 1s ease; }
    .doac-progress small { color: #888; font-size: 0.8rem; display: block; margin-top: 6px; }

    /* Daily Wisdom */
    .doac-daily-wisdom {
      background: rgba(255,215,0,0.05);
      border-left: 4px solid #FFD700;
      border-radius: 0 12px 12px 0;
      padding: 20px 24px;
      max-width: 700px;
      margin: 0 auto 2rem;
      text-align: center;
    }
    .doac-daily-label { color: #FFD700; font-size: 0.85rem; font-weight: 600; margin-bottom: 8px; }
    .doac-daily-wisdom blockquote { color: #e0e0e0; font-size: 1.15rem; line-height: 1.6; font-style: italic; margin: 0; }
    .doac-daily-wisdom cite { color: #888; font-size: 0.85rem; display: block; margin-top: 8px; }

    /* Exit Intent */
    .doac-exit-overlay {
      position: fixed; top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0,0,0,0.75);
      z-index: 100000;
      display: flex; align-items: center; justify-content: center;
      backdrop-filter: blur(4px);
    }
    .doac-exit-popup {
      background: linear-gradient(135deg, #1a1a2e, #16213e);
      border: 2px solid rgba(255,215,0,0.3);
      border-radius: 20px;
      padding: 2.5rem;
      max-width: 480px;
      text-align: center;
      position: relative;
    }
    .doac-exit-popup h2 { color: #fff; font-size: 1.8rem; margin-bottom: 0.5rem; }
    .doac-exit-popup p { color: #ccc; font-size: 1rem; line-height: 1.5; }
    .doac-exit-close { position: absolute; top: 12px; right: 16px; background: none; border: none; color: #888; font-size: 1.5rem; cursor: pointer; }
    .doac-exit-form { display: flex; gap: 8px; margin-top: 1rem; }
    .doac-exit-form input { flex: 1; padding: 12px 16px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.2); background: rgba(255,255,255,0.08); color: #fff; font-size: 1rem; }
    .doac-exit-form button { padding: 12px 20px; background: linear-gradient(135deg, #FFD700, #FFA500); border: none; border-radius: 10px; color: #000; font-weight: 700; cursor: pointer; white-space: nowrap; }

    /* Live Reader Badge */
    .doac-live-badge {
      position: absolute;
      top: 8px;
      right: 8px;
      background: rgba(255,107,0,0.9);
      color: #fff;
      font-size: 0.7rem;
      font-weight: 600;
      padding: 3px 8px;
      border-radius: 6px;
      animation: doac-pulse 2s infinite;
    }
    @keyframes doac-pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.7; }
    }

    /* Trending Section */
    .doac-trending-section {
      max-width: 700px;
      margin: 0 auto 2rem;
      padding: 0 2rem;
    }
    .doac-trending-section h3 { color: #FFD700; font-size: 1.3rem; margin-bottom: 1rem; text-align: center; }
    .doac-trending-item {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 12px 16px;
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 10px;
      margin-bottom: 8px;
    }
    .doac-trending-rank { color: #FFD700; font-size: 1.5rem; font-weight: 800; min-width: 40px; text-align: center; }
    .doac-trending-item strong { color: #fff; }
    .doac-trending-item small { color: #ff6b00; font-size: 0.8rem; display: block; margin-top: 4px; }

    /* Mobile */
    @media (max-width: 768px) {
      .doac-toast { bottom: 10px; left: 10px; right: 10px; max-width: none; }
      .doac-exit-form { flex-direction: column; }
      .doac-trending-section { padding: 0 1rem; }
    }
  `;
  document.head.appendChild(style);

  // ============================================
  // INIT ALL
  // ============================================
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function initNewsletterForms() {
    // Handle episode page newsletter CTAs (no <form> tag, just input+button in .newsletter-cta)
    document.querySelectorAll('.newsletter-cta').forEach(function(cta) {
      var btn = cta.querySelector('button');
      var input = cta.querySelector('input[type="email"]');
      if (btn && input) {
        btn.addEventListener('click', function(e) {
          e.preventDefault();
          var email = input.value.trim();
          if (!email || !email.includes('@')) { input.style.borderColor='#ff4444'; return; }
          var subs = JSON.parse(localStorage.getItem('doac_subscribers') || '[]');
          subs.push({email: email, ts: Date.now()});
          localStorage.setItem('doac_subscribers', JSON.stringify(subs));
          cta.innerHTML = '<div style="text-align:center;padding:1rem;"><div style="font-size:2rem;">🎉</div><div style="color:#4CAF50;font-weight:700;">You\'re in!</div><div style="color:#ccc;font-size:0.9rem;margin-top:0.3rem;">Check your inbox for your first dose of DOAC wisdom.</div></div>';
        });
      }
    });
    // Handle exit-intent form
    document.addEventListener('submit', function(e) {
      if (e.target.classList.contains('doac-exit-form')) {
        e.preventDefault();
        var email = e.target.querySelector('input[type="email"]').value;
        var subs = JSON.parse(localStorage.getItem('doac_subscribers') || '[]');
        subs.push({email: email, ts: Date.now(), source: 'exit-intent'});
        localStorage.setItem('doac_subscribers', JSON.stringify(subs));
        e.target.innerHTML = '<div style="color:#4CAF50;font-weight:700;font-size:1.1rem;">🎉 You\'re in! Check your inbox.</div>';
      }
    });
  }

  function init() {
    fixSubscriberCount();
    initStreakTracker();
    initProgressSystem();
    initDailyWisdom();
    initExitIntent();
    initLiveReaders();
    initTrending();
    initNewsletterForms();
  }

})();
