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
  // Fabricated activity notifications removed.

  // ============================================
  // 2. READING STREAK TRACKER (Loss Aversion)
  // ============================================
  function initStreakTracker() {
    if (window.innerWidth < 768) return;
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
      { quote: "Atomic Habits: every action is a vote for the type of person you wish to become.", author: "James Clear", title: "Author of Atomic Habits" },
      { quote: "The most important conversation you'll ever have is the one you have with yourself.", author: "Steven Bartlett", title: "Host of Diary of a CEO" },
      { quote: "Sleep is the greatest legal performance-enhancing drug that most people are neglecting.", author: "Matthew Walker", title: "Neuroscientist & Sleep Expert" },
      { quote: "By age 35, 95% of who you are is a memorized set of behaviors and emotional reactions.", author: "Dr. Joe Dispenza", title: "Neuroscientist & Author" },
      { quote: "The hallmark of wisdom is knowing what you don't know. Intelligence is overrated.", author: "Adam Grant", title: "Organizational Psychologist" },
      { quote: "If you want to master anything, you have to be willing to be bad at it first.", author: "Alex Hormozi", title: "Entrepreneur & Author" },
      { quote: "Vulnerability is not weakness. It's our greatest measure of courage.", author: "Brene Brown", title: "Research Professor" },
      { quote: "Your brain is lying to you. The thoughts you think are not always the truth.", author: "Dr. Daniel Amen", title: "Psychiatrist & Brain Disorder Specialist" },
      { quote: "The way to seduce anyone is to make them feel like the most important person in the room.", author: "Robert Greene", title: "Author of The 48 Laws of Power" },
      { quote: "Stress literally leaks through your skin via cortisol and is contagious to others.", author: "Dr. Tara Swart", title: "Neuroscientist" },
      { quote: "The gap between where you are and where you want to be is closed by discipline, not motivation.", author: "Chris Williamson", title: "Podcaster & Author" },
      { quote: "Never be yourself at work. Be a strategic version of yourself.", author: "Evy Poumpouras", title: "Former Secret Service Agent" },
      { quote: "You cannot pour from an empty cup. Take care of yourself first.", author: "Dr. Julie Smith", title: "Clinical Psychologist" },
      { quote: "The only way to do great work is to love what you do, and to keep iterating.", author: "Simon Sinek", title: "Author of Start With Why" },
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
        <cite>— ${wisdom.author}, ${wisdom.title}</cite>
      `;
      const newsletter = document.querySelector('.newsletter-section');
      if (newsletter) newsletter.parentNode.insertBefore(banner, newsletter);
    }
  }

  // ============================================
  // 5. EXIT INTENT POPUP
  // ============================================
  function initExitIntent() {
    if (sessionStorage.getItem('doac_exit_shown')) return;

    document.addEventListener('mouseout', function(e) {
      if (e.clientY < 10 && !document.querySelector('.doac-exit-overlay')) {
        sessionStorage.setItem('doac_exit_shown', 'true');

        const overlay = document.createElement('div');
        overlay.className = 'doac-exit-overlay';
        overlay.innerHTML = `
          <div class="doac-exit-popup">
            <button class="doac-exit-close" onclick="this.parentElement.parentElement.remove()">×</button>
            <h2>Wait! 🛑</h2>
            <p>You haven't seen today's #1 insight yet.</p>
            <p style="font-size:1.1rem;color:#FFD700;margin:1rem 0;font-style:italic;">"By age 35, 95% of who you are is a memorized set of behaviors and emotional reactions."</p>
            <p style="color:#aaa;font-size:0.85rem;">— Dr. Joe Dispenza, Neuroscientist & Author</p>
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
        overlay.addEventListener('click', function(ev) { if (ev.target === overlay) { overlay.remove(); }});
      }
    });
  }

  // ============================================
  // 6. LIVE READER COUNT ON EPISODES
  // ============================================
  // ============================================
  // 7. FIX SUBSCRIBER COUNT (Social Proof)
  // ============================================
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

    /* Live Reader Badge - Floating */
    .doac-live-badge-float {
      background: rgba(255,107,0,0.95);
      color: #fff;
      font-size: 0.85rem;
      font-weight: 600;
      padding: 8px 14px;
      border-radius: 10px;
      box-shadow: 0 4px 15px rgba(255,107,0,0.4);
      animation: doac-pulse 2s infinite;
      cursor: default;
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
      .doac-toast { bottom: 10px; left: 10px; right: 10px; max-width: none; font-size: 0.8rem; padding: 8px 12px; }
      .doac-exit-form { flex-direction: column; }
      .doac-trending-section { padding: 0 1rem; }
      .doac-live-badge-float { font-size: 0.7rem !important; padding: 4px 10px !important; bottom: 10px !important; right: 10px !important; }
      .doac-progress { padding: 10px 14px; font-size: 0.8rem; }
      .doac-daily-wisdom { padding: 14px 16px; margin: 0 1rem 1.5rem; }
      .doac-daily-wisdom blockquote { font-size: 1rem; }
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

  // Newsletter signup — posts to the live newsletter-api worker (same list
  // used for the weekly email). Replaces the dead Beehiiv embed.
  var NL_API = 'https://newsletter-api.maxwellgrey014.workers.dev';
  var NL_FORM = '<form class="doac-nl-form" style="display:flex;gap:8px;max-width:460px;margin:0 auto;">'
    + '<input type="email" name="email" placeholder="Enter your email" required style="flex:1;padding:0.7rem 1rem;font-size:1rem;background:rgba(0,0,0,0.3);border:2px solid rgba(255,255,255,0.15);border-radius:12px;color:#fff;">'
    + '<button type="submit" style="padding:0.7rem 1.3rem;font-size:1rem;font-weight:600;background:linear-gradient(135deg,#FFD700,#FFA500);border:none;border-radius:12px;color:#000;cursor:pointer;white-space:nowrap;">Subscribe Free</button>'
    + '</form><p class="doac-nl-msg" style="color:#FFD700;font-size:0.85rem;margin-top:0.5rem;min-height:16px;text-align:center;"></p>';

  function handleNlSubmit(form) {
    var input = form.querySelector('input[type="email"]');
    var btn = form.querySelector('button');
    var msg = form.parentElement.querySelector('.doac-nl-msg');
    var email = input ? input.value.trim() : '';
    if (!email || email.indexOf('@') < 0) {
      if (msg) { msg.style.color = '#ff6b6b'; msg.textContent = 'Please enter a valid email.'; }
      return;
    }
    if (btn) { btn.disabled = true; btn.textContent = '...'; }
    fetch(NL_API + '/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email, source: 'episode_cta', pagePath: window.location.pathname })
    }).then(function(r) {
      return r.json().then(function(d) { return { ok: r.ok, data: d }; });
    }).then(function(r) {
      if (msg) { msg.style.color = r.ok ? '#FFD700' : '#ff6b6b'; msg.textContent = (r.data && (r.data.message || r.data.error)) || (r.ok ? 'Subscribed!' : 'Something went wrong.'); }
      if (r.ok && input) input.value = '';
    }).catch(function() {
      if (msg) { msg.style.color = '#ff6b6b'; msg.textContent = 'Something went wrong.'; }
    }).finally(function() {
      if (btn) { btn.disabled = false; btn.textContent = 'Subscribe Free'; }
    });
  }

  function initNewsletterForms() {
    // Replace episode-page newsletter CTAs with the working signup form
    document.querySelectorAll('.newsletter-cta').forEach(function(cta) {
      var btn = cta.querySelector('button');
      var input = cta.querySelector('input[type="email"]');
      if (btn && input) {
        var wrapper = input.parentElement;
        if (wrapper) wrapper.innerHTML = NL_FORM;
      }
    });
    // Delegated submit handler for injected forms + the exit-intent form
    document.addEventListener('submit', function(e) {
      if (e.target.classList.contains('doac-nl-form')) {
        e.preventDefault();
        handleNlSubmit(e.target);
      } else if (e.target.classList.contains('doac-exit-form')) {
        e.preventDefault();
        var wrap = e.target.parentElement;
        if (wrap) { e.target.outerHTML = NL_FORM; var f = wrap.querySelector('.doac-nl-form'); }
      }
    });
  }

  function init() {
    // No inferred subscriber counts.
    initStreakTracker();
    initProgressSystem();
    // Quote promotion waits for source verification.
    // initExitIntent(); // Disabled — too annoying
    // No simulated live readers.
    // No unmeasured popularity claims.
    initNewsletterForms();
  }

})();
