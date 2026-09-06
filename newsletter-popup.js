/**
 * DOAC Smart Newsletter Popup v1.0
 * 
 * Psychology-driven newsletter capture with:
 * - Exit intent detection (desktop)
 * - Scroll-depth trigger (60% = "invested reader")
 * - Timed delay (45s on page)
 * - Social proof counter
 * - Smart frequency: shows max 1x per 3 days if dismissed
 * - Never shows to existing subscribers
 * - Mobile slide-up (no exit intent on mobile)
 * - A/B headline testing with localStorage tracking
 * 
 * Add to page: <script src="/newsletter-popup.js" defer></script>
 */
(function() {
  'use strict';

  const API = 'https://newsletter-api.maxwellgrey014.workers.dev';
  const DISMISS_KEY = 'doac_popup_dismissed';
  const SUB_KEY = 'doac_subscribed';
  const VARIANT_KEY = 'doac_popup_variant';
  const DISMISS_DAYS = 3;
  const SCROLL_TRIGGER = 0.6; // 60% scroll depth
  const TIME_TRIGGER = 45000; // 45 seconds
  const SUBSCRIBER_BASE = 247; // Social proof floor (real + implied community)

  // Don't show if already subscribed or recently dismissed
  if (localStorage.getItem(SUB_KEY)) return;
  const dismissed = localStorage.getItem(DISMISS_KEY);
  if (dismissed && (Date.now() - parseInt(dismissed)) < DISMISS_DAYS * 86400000) return;

  // A/B test headlines
  const variants = [
    {
      headline: '🎯 Get the 5-Minute CEO Breakdown',
      subhead: 'Every week: 1 episode, 1 case study, 1 actionable playbook. No fluff.',
      cta: 'Send Me the Insights'
    },
    {
      headline: '📧 Join ' + (SUBSCRIBER_BASE + Math.floor(Math.random() * 30)) + ' Smart Readers',
      subhead: 'The best Diary of a CEO insights, distilled into a weekly email you actually want to read.',
      cta: 'Subscribe Free'
    },
    {
      headline: '🧠 Stop Watching 2-Hour Podcasts',
      subhead: 'Get the key insights from every Diary of a CEO episode in 5 minutes. Free, weekly.',
      cta: "Yes, I'm In"
    }
  ];

  // Sticky variant per user
  let variantIdx = parseInt(localStorage.getItem(VARIANT_KEY));
  if (isNaN(variantIdx) || variantIdx >= variants.length) {
    variantIdx = Math.floor(Math.random() * variants.length);
    localStorage.setItem(VARIANT_KEY, variantIdx);
  }
  const v = variants[variantIdx];

  let shown = false;
  const isMobile = window.innerWidth < 768;

  function createPopup() {
    if (shown) return;
    shown = true;

    const overlay = document.createElement('div');
    overlay.id = 'doac-nl-overlay';
    overlay.innerHTML = `
      <div id="doac-nl-popup" role="dialog" aria-label="Newsletter signup">
        <button id="doac-nl-close" aria-label="Close">&times;</button>
        <div class="doac-nl-badge">FREE WEEKLY EMAIL</div>
        <h2>${v.headline}</h2>
        <p class="doac-nl-sub">${v.subhead}</p>
        <form id="doac-nl-form">
          <input type="email" id="doac-nl-email" placeholder="your@email.com" required autocomplete="email">
          <button type="submit" id="doac-nl-btn">${v.cta}</button>
        </form>
        <p class="doac-nl-proof">
          <span class="doac-nl-dot"></span>
          <span id="doac-nl-count">${SUBSCRIBER_BASE + Math.floor(Math.random() * 30)}</span> readers this week &middot; Unsubscribe anytime
        </p>
        <p class="doac-nl-success" id="doac-nl-success" style="display:none;">
          ✅ You're in! Check your inbox for a welcome email.
        </p>
      </div>
    `;

    // Styles
    const style = document.createElement('style');
    style.textContent = `
      #doac-nl-overlay {
        position: fixed; inset: 0; z-index: 99999;
        background: rgba(0,0,0,0.65);
        display: flex; align-items: center; justify-content: center;
        animation: doac-fade-in 0.3s ease;
        backdrop-filter: blur(3px);
      }
      @keyframes doac-fade-in { from { opacity: 0; } to { opacity: 1; } }
      @keyframes doac-slide-up { from { transform: translateY(30px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      
      #doac-nl-popup {
        background: linear-gradient(145deg, #1a1a2e 0%, #16213e 50%, #0f0f1e 100%);
        border: 1px solid rgba(255, 215, 0, 0.25);
        border-radius: 16px;
        padding: 2.5rem 2rem;
        max-width: 440px;
        width: 90%;
        position: relative;
        text-align: center;
        animation: doac-slide-up 0.4s ease;
        box-shadow: 0 20px 60px rgba(0,0,0,0.5), 0 0 30px rgba(255,215,0,0.05);
        overflow: hidden;
      }
      
      #doac-nl-close {
        position: absolute; top: 12px; right: 16px;
        background: none; border: none; color: #666;
        font-size: 1.8rem; cursor: pointer; line-height: 1;
        transition: color 0.2s;
      }
      #doac-nl-close:hover { color: #FFD700; }
      
      .doac-nl-badge {
        display: inline-block;
        background: rgba(255,215,0,0.12);
        border: 1px solid rgba(255,215,0,0.3);
        color: #FFD700;
        font-size: 0.7rem;
        font-weight: 700;
        letter-spacing: 0.15em;
        padding: 0.3rem 1rem;
        border-radius: 20px;
        margin-bottom: 1rem;
      }
      
      #doac-nl-popup h2 {
        color: #fff;
        font-size: 1.5rem;
        margin: 0 0 0.5rem 0;
        line-height: 1.3;
        font-weight: 700;
      }
      
      .doac-nl-sub {
        color: #aaa;
        font-size: 0.95rem;
        margin: 0 0 1.25rem 0;
        line-height: 1.5;
      }
      
      #doac-nl-form {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        margin-bottom: 0.75rem;
      }
      
      #doac-nl-email {
        width: 100%;
        padding: 0.85rem 1rem;
        background: rgba(255,255,255,0.07);
        border: 1px solid rgba(255,255,255,0.15);
        border-radius: 10px;
        color: #fff;
        font-size: 0.95rem;
        outline: none;
        transition: border-color 0.2s;
      }
      #doac-nl-email:focus {
        border-color: rgba(255,215,0,0.5);
      }
      #doac-nl-email::placeholder { color: #666; }
      
      #doac-nl-btn {
        padding: 0.85rem 1.5rem;
        background: linear-gradient(135deg, #FFD700, #FFA500);
        border: none;
        border-radius: 10px;
        color: #000;
        font-weight: 700;
        font-size: 0.95rem;
        cursor: pointer;
        white-space: nowrap;
        transition: transform 0.2s, box-shadow 0.2s;
        width: 100%;
      }
      #doac-nl-btn:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 15px rgba(255,215,0,0.3);
      }
      #doac-nl-btn:disabled {
        opacity: 0.7;
        cursor: wait;
      }
      
      .doac-nl-proof {
        color: #666;
        font-size: 0.78rem;
        margin: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.4rem;
      }
      .doac-nl-dot {
        width: 6px; height: 6px;
        background: #22c55e;
        border-radius: 50%;
        display: inline-block;
        animation: doac-pulse 2s infinite;
      }
      @keyframes doac-pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.4; }
      }
      
      .doac-nl-success {
        color: #22c55e !important;
        font-size: 1rem !important;
        font-weight: 600;
        margin-top: 0.5rem !important;
      }

      @media (max-width: 500px) {
        #doac-nl-popup {
          padding: 2rem 1.25rem;
          border-radius: 16px 16px 0 0;
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          width: 100%;
          max-width: 100%;
          animation: doac-mobile-slide 0.4s ease;
        }
        @keyframes doac-mobile-slide {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        #doac-nl-overlay {
          align-items: flex-end;
        }
        #doac-nl-form {
          flex-direction: column;
        }
        #doac-nl-popup h2 { font-size: 1.25rem; }
      }
    `;

    document.head.appendChild(style);
    document.body.appendChild(overlay);

    // Close handlers
    const close = () => {
      localStorage.setItem(DISMISS_KEY, Date.now().toString());
      overlay.style.animation = 'doac-fade-in 0.2s ease reverse';
      setTimeout(() => overlay.remove(), 200);
    };

    document.getElementById('doac-nl-close').onclick = close;
    overlay.onclick = (e) => { if (e.target === overlay) close(); };
    document.addEventListener('keydown', function escHandler(e) {
      if (e.key === 'Escape') { close(); document.removeEventListener('keydown', escHandler); }
    });

    // Form submission
    document.getElementById('doac-nl-form').onsubmit = async (e) => {
      e.preventDefault();
      const email = document.getElementById('doac-nl-email').value.trim();
      if (!email) return;

      const btn = document.getElementById('doac-nl-btn');
      btn.disabled = true;
      btn.textContent = 'Subscribing...';

      try {
        const res = await fetch(API + '/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email })
        });
        
        if (res.ok || res.status === 409) {
          // Success or already subscribed
          localStorage.setItem(SUB_KEY, '1');
          document.getElementById('doac-nl-form').style.display = 'none';
          document.querySelector('.doac-nl-proof').style.display = 'none';
          document.getElementById('doac-nl-success').style.display = 'block';
          
          // Track in GA if available
          if (typeof gtag === 'function') {
            gtag('event', 'newsletter_signup', {
              event_category: 'engagement',
              event_label: 'popup_v' + variantIdx,
              value: 1
            });
          }
          
          setTimeout(close, 3000);
        } else {
          btn.textContent = 'Try again';
          btn.disabled = false;
        }
      } catch (err) {
        btn.textContent = 'Try again';
        btn.disabled = false;
      }
    };
  }

  // === Trigger 1: Exit Intent (desktop only) ===
  if (!isMobile) {
    let exitFired = false;
    document.addEventListener('mouseout', (e) => {
      if (exitFired || shown) return;
      if (e.clientY <= 5 && e.relatedTarget == null) {
        exitFired = true;
        createPopup();
      }
    });
  }

  // === Trigger 2: Scroll depth ===
  let scrollFired = false;
  window.addEventListener('scroll', () => {
    if (scrollFired || shown) return;
    const scrollPct = (window.scrollY + window.innerHeight) / document.body.scrollHeight;
    if (scrollPct >= SCROLL_TRIGGER) {
      scrollFired = true;
      createPopup();
    }
  }, { passive: true });

  // === Trigger 3: Time-based (mobile fallback + desktop backup) ===
  setTimeout(() => {
    if (!shown) createPopup();
  }, TIME_TRIGGER);

})();
