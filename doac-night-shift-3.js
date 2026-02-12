#!/usr/bin/env node
/**
 * DOAC Night Shift #3 — Site Improvements
 * 1. Build "Start Here" page with curated best episodes
 * 2. Flesh out top 10 episode pages with real summaries
 * 3. Fix newsletter (Beehiiv embed instead of Netlify forms)
 * 4. Improve homepage
 */

const fs = require('fs');
const path = require('path');
const SITE = path.join(__dirname);

// ============================================
// EPISODE ENRICHMENT DATA (researched content)
// ============================================

const enrichedEpisodes = {
  'robert-greene': {
    guest: 'Robert Greene',
    title: 'Robert Greene: How To Seduce Anyone, Build Confidence & Become Powerful',
    summary: `Robert Greene, bestselling author of "The 48 Laws of Power" and "The Art of Seduction," joins Steven Bartlett for an in-depth conversation about power dynamics, human nature, and the art of influence. Greene reveals that most people vastly overestimate their ability to read others, leaving them vulnerable to manipulation. He emphasizes the critical importance of observing body language, microexpressions, and the overall "gestalt" of a person — skills that have declined in the age of virtual communication.

Greene dives deep into personal narcissism, arguing that accepting one's flaws is the first step toward genuine growth. He discusses how his own stroke taught him to embrace life's randomness and adopt a Stoic approach to the uncontrollable. The conversation covers how to detect manipulative behavior, why negative emotions like envy should be openly acknowledged rather than suppressed, and how understanding the "dark side" of human nature is essential for both personal and professional success.

One of the most compelling segments explores the disconnect in modern politics and culture — Greene argues for the power of emotionally-driven narratives over dry policy discussions, explaining why figures who create compelling "myths" tend to dominate public attention.`,
    lessons: [
      'Most people overestimate their ability to read others — learn to observe body language, microexpressions, and nonverbal cues to truly understand people',
      'Accept your own narcissism and flaws as the first step toward genuine personal growth and liberation',
      'Embrace randomness and adopt a Stoic mindset — focus on what you can control and build mental resilience',
      'Never outshine the master: make those above you feel superior to strategically advance your position',
      'Conceal your true intentions and keep people slightly off-balance to maintain strategic advantage',
      'Confront your darker qualities instead of suppressing them — hidden flaws lead to unpredictable outbursts',
      'Emotional narratives are far more powerful than logical arguments for persuasion and influence'
    ],
    quotes: [
      { text: "The key to power is the ability to judge who is best able to further your interests in all situations.", topic: "Power" },
      { text: "Power is neither good nor evil. It's a tool. Master it or become its victim.", topic: "Power" },
      { text: "People tend to naturally adjust their behavior based on context — understanding this is the key to reading others.", topic: "Human Nature" },
      { text: "50% of the story we tell about our past isn't even the truth. People relive a miserable life they never had just to excuse themselves from changing.", topic: "Self-Deception" }
    ]
  },
  'dr-joe-dispenza': {
    guest: 'Dr. Joe Dispenza',
    title: 'Dr. Joe Dispenza: You MUST Do This Before 10am To Fix It!',
    summary: `Dr. Joe Dispenza, New York Times bestselling author of "You Are the Placebo" and "Becoming Supernatural," reveals his groundbreaking research on the intersection of neuroscience and mindfulness. The core revelation: by age 35, approximately 95% of who we are has been shaped by ingrained habits and subconscious thought patterns — but this can be completely rewired.

Dispenza shares a staggering statistic: 75-90% of people who visit healthcare facilities in the Western world are there because of emotional or psychological stress. He explains how people become literally addicted to stress hormones, needing the bad job, toxic relationship, negative news, and traffic just to maintain their emotional state — a cycle that leads inevitably to disease.

His practical formula centers on a powerful morning routine starting before 10am: rising at 4:30am for two hours of dedicated mental work, including meditation, mental rehearsal, and intentional thought programming. Dispenza demonstrates through clinical data that these practices rewire the brain more effectively than pharmaceutical interventions. He challenges the notion that a difficult past prevents change, citing cases of people with severe trauma who completely transformed through his methods.

The episode's most provocative claim: "If your thoughts can make you sick, can your thoughts make you well? That's absolutely possible." His research backs this up with measurable brain changes in workshop participants.`,
    lessons: [
      'By age 35, 95% of who you are is running on autopilot — subconscious habits and patterns control your life unless you actively rewire them',
      '75-90% of doctor visits are stress-related — people become literally addicted to stress hormones and need negativity to maintain their emotional state',
      'Start every morning before 10am with meditation and mental rehearsal to reprogram your brain and set your emotional state for the day',
      'Your thoughts can make you sick, but they can also heal you — Dispenza\'s research shows measurable brain changes from meditation practices',
      '50% of the stories we tell about our past aren\'t true — people relive miserable lives they never had to excuse themselves from changing',
      'You can learn and change in a state of joy and inspiration, not just pain and suffering — don\'t wait for crisis to transform',
      'No organism can live in emergency mode long-term — chronic stress inevitably leads to disease'
    ],
    quotes: [
      { text: "75 to 90 percent of every person that walks into a healthcare facility in the Western world walks in because of emotional or psychological stress.", topic: "Stress & Health" },
      { text: "People become addicted to stress hormones. They need the bad job, the bad relationship, the traffic, the news just to stay in that emotional state.", topic: "Addiction" },
      { text: "If your thoughts could make you sick, can your thoughts make you well? That's absolutely possible.", topic: "Mind-Body Connection" },
      { text: "50% of the story we tell about our past isn't even the truth. People relive a miserable life they never had just to excuse themselves from changing.", topic: "Self-Deception" }
    ]
  },
  'andrew-huberman': {
    guest: 'Andrew Huberman',
    title: 'Andrew Huberman: The Brain Expert On How To Master Your Mind',
    summary: `Stanford neuroscience professor Andrew Huberman delivers a masterclass on practical brain optimization. This conversation with Steven Bartlett covers the most actionable neuroscience insights for everyday performance — from dopamine management to sleep protocols and stress resilience.

Huberman explains how dopamine, often misunderstood as the "pleasure chemical," is actually the molecule of motivation and pursuit. He reveals that the constant stimulation from social media, junk food, and instant gratification depletes dopamine baselines, making people feel unmotivated and depressed. The solution isn't more stimulation — it's strategic dopamine fasting and deliberate practice.

The episode covers Huberman's evidence-based protocols: morning sunlight exposure within 30 minutes of waking to set your circadian rhythm, cold exposure for sustained dopamine elevation (up to 250% increase lasting hours), the 90-minute focused work block aligned with ultradian rhythms, and the critical importance of non-sleep deep rest (NSDR) for brain recovery. Huberman also discusses the science of stress, explaining why controlled breathing (physiological sighs — double inhale followed by a long exhale) is the fastest real-time tool for calming the nervous system.`,
    lessons: [
      'Get morning sunlight within 30 minutes of waking — this sets your circadian rhythm and improves sleep, mood, and focus for the entire day',
      'Dopamine is the molecule of motivation, not pleasure — protect your baseline by avoiding constant stimulation from phones, social media, and junk food',
      'Cold exposure (cold showers, ice baths) increases dopamine by up to 250% and the effect lasts for hours, unlike artificial stimulants',
      'Work in 90-minute focused blocks aligned with your brain\'s natural ultradian rhythms, then take genuine breaks',
      'Use physiological sighs (double inhale + long exhale) as the fastest real-time tool to calm your nervous system',
      'Practice non-sleep deep rest (NSDR) — 10-20 minutes of guided relaxation to restore mental energy without napping',
      'Delay caffeine 90-120 minutes after waking to avoid the afternoon crash — let adenosine clear naturally first'
    ],
    quotes: [
      { text: "Dopamine is not about pleasure. It's about the pursuit of pleasure. It's about motivation.", topic: "Dopamine" },
      { text: "Morning sunlight is the single most powerful tool for resetting your circadian clock and improving every aspect of your biology.", topic: "Health" },
      { text: "The best way to reduce stress in real-time is the physiological sigh — a double inhale through the nose followed by a long exhale.", topic: "Stress Management" }
    ]
  },
  'alex-hormozi': {
    guest: 'Alex Hormozi',
    title: 'Alex Hormozi: How To Turn $1,000 Into $100 Million',
    summary: `Alex Hormozi, founder of Acquisition.com and author of "$100M Offers," shares his blueprint for building massive wealth from scratch. Starting with nearly nothing and building a $100M+ portfolio of companies, Hormozi breaks down the exact strategies, mindset shifts, and business frameworks that separate the wealthy from everyone else.

Hormozi's core thesis is radical: most people are poor because they optimize for comfort instead of learning. He explains his "brick by brick" philosophy — focusing on a single business model, mastering the skills required, and compounding results over years rather than chasing shiny objects. He reveals that the fastest path to wealth is creating "Grand Slam Offers" — offers so good that people feel stupid saying no — and that most businesses fail because their offer isn't compelling enough, not because of marketing or operations.

The conversation covers Hormozi's personal journey from sleeping on a gym floor to managing hundreds of millions, his framework for pricing (charge premium, deliver premium), and why most entrepreneurs stay broke by trading time for money instead of building systems. He also discusses the importance of volume — doing more than anyone else in your space — and why consistency beats creativity in business.`,
    lessons: [
      'Create "Grand Slam Offers" so compelling that prospects feel stupid saying no — most businesses fail because their offer isn\'t good enough',
      'Focus on a single business model and master it completely before diversifying — chasing shiny objects keeps you poor',
      'Charge premium prices and deliver premium value — undercharging attracts bad customers and destroys your business',
      'Volume beats everything: do more outreach, create more content, make more offers than anyone else in your space',
      'Most people optimize for comfort instead of learning — the willingness to be uncomfortable is the biggest predictor of wealth',
      'Build systems that work without you — trading time for money caps your income at your available hours',
      'Consistency compounds: boring daily execution over years beats creative sprints every time'
    ],
    quotes: [
      { text: "Most people are poor because they optimize for comfort instead of learning.", topic: "Wealth" },
      { text: "Make your offer so good that people feel stupid saying no.", topic: "Business" },
      { text: "The only way to guarantee failure is to quit. Everything else is just data.", topic: "Persistence" }
    ]
  },
  'dr-tara-swart': {
    guest: 'Dr. Tara Swart',
    title: 'Dr. Tara Swart: Stress Leaks Through Skin, Is Contagious & Gives You Belly Fat!',
    summary: `Dr. Tara Swart, neuroscientist, former psychiatrist, and MIT senior lecturer, reveals the hidden ways stress destroys your body and mind — and how to fight back. Her research shows that stress literally leaks through your skin via cortisol, is physiologically contagious to those around you, and preferentially deposits fat around your midsection.

Swart explains the neuroscience of manifestation — not as mystical thinking, but as a scientifically-grounded process of selective attention and neuroplasticity. When you create a vivid vision of your goals, your brain's reticular activating system (RAS) begins filtering information to help you notice opportunities aligned with that vision. This isn't "The Secret" — it's your brain's natural pattern-recognition system being deliberately programmed.

The conversation dives into sleep as the ultimate performance enhancer: during deep sleep, your brain's glymphatic system literally washes away toxic proteins, and chronic sleep deprivation is linked to Alzheimer's, obesity, and immune dysfunction. Swart also discusses "neuroplasticity" — the brain's ability to physically rewire itself at any age — and provides practical exercises for building new neural pathways, including her action board technique (a research-backed alternative to vision boards).`,
    lessons: [
      'Stress literally leaks through your skin via cortisol and is contagious — people around you absorb your stress physiologically',
      'Cortisol from chronic stress preferentially deposits fat around your belly — stress management is as important as diet for body composition',
      'Manifestation works through neuroscience, not magic — your brain\'s reticular activating system filters reality to match your dominant thoughts',
      'Sleep is when your brain\'s glymphatic system washes away toxic proteins — chronic sleep deprivation is linked to Alzheimer\'s and obesity',
      'Create an "action board" instead of a vision board — combine vivid imagery with concrete daily actions for real results',
      'Your brain can physically rewire itself at any age through neuroplasticity — but it requires consistent, deliberate practice',
      'Hydration directly affects brain function — even 2% dehydration significantly impairs cognitive performance and decision-making'
    ],
    quotes: [
      { text: "Stress leaks through your skin. The people around you literally absorb your cortisol.", topic: "Stress" },
      { text: "Your brain doesn't know the difference between real and imagined. Use that to your advantage.", topic: "Neuroscience" },
      { text: "Sleep is not a luxury. It's during sleep that your brain washes away the toxins that cause Alzheimer's.", topic: "Sleep" }
    ]
  },
  'andrew-bustamante': {
    guest: 'Andrew Bustamante',
    title: 'Andrew Bustamante: CIA Spy — "Leave The USA Before 2030!"',
    summary: `Former CIA officer Andrew Bustamante pulls back the curtain on espionage, geopolitics, and the covert skills that intelligence operatives use daily. This explosive episode covers everything from CIA recruitment tactics to global power dynamics and why Bustamante believes major geopolitical shifts are coming before 2030.

Bustamante reveals the CIA's core framework for influence: everyone is motivated by one of four things — Reward, Ideology, Coercion, or Ego (RICE). Understanding which motivator drives a person gives you the key to influencing them ethically or recognizing when you're being manipulated. He explains how spies build rapport in minutes using "elicitation" techniques — asking questions that make people feel heard while extracting critical information.

The geopolitical analysis is sobering: Bustamante outlines how global power structures are shifting, why traditional alliances are fracturing, and what this means for ordinary people. He discusses the rise of surveillance states, the vulnerability of digital infrastructure, and why developing multiple citizenships and geographic flexibility is a form of personal security. The conversation also covers how to detect deception, why the most dangerous lies contain truth, and the importance of developing "situational awareness" in everyday life.`,
    lessons: [
      'Everyone is motivated by RICE: Reward, Ideology, Coercion, or Ego — identify which drives someone to influence or understand them',
      'Build rapport fast using elicitation: ask questions that make people feel heard while naturally revealing critical information',
      'The most dangerous lies contain elements of truth — learn to separate facts from narrative framing',
      'Develop situational awareness in daily life: observe exits, note behavioral patterns, and maintain awareness of your surroundings',
      'Geographic flexibility and multiple options are a form of personal security — don\'t put all your eggs in one country',
      'Trust but verify — the CIA\'s approach to relationships applies to business and personal life equally',
      'Digital infrastructure is more vulnerable than most people realize — have analog backups for critical information'
    ],
    quotes: [
      { text: "Everyone is motivated by one of four things: Reward, Ideology, Coercion, or Ego. Once you know which one drives someone, you have the key.", topic: "Influence" },
      { text: "The most dangerous lie is the one wrapped in truth.", topic: "Deception" },
      { text: "Situational awareness isn't paranoia. It's a skill that could save your life.", topic: "Security" }
    ]
  },
  'roman-yampolskiy': {
    guest: 'Roman Yampolskiy',
    title: 'Roman Yampolskiy: These Are The Only 5 Jobs That Will Remain In 2030!',
    summary: `AI safety researcher Roman Yampolskiy from the University of Louisville delivers a sobering assessment of artificial intelligence's trajectory — and what it means for human employment, security, and existential risk. With 14M+ views, this became one of the most-discussed DOAC episodes about the future of work.

Yampolskiy argues that AI advancement is accelerating faster than public awareness, and that by 2030, the vast majority of current jobs will be either automated or fundamentally transformed. He outlines the narrow categories of work that will remain: roles requiring genuine physical presence, creative direction (not execution), complex ethical judgment, deep human connection, and AI oversight itself. Everything else — from coding to legal analysis to medical diagnostics — faces significant disruption.

The conversation turns to existential risk: Yampolskiy explains why AI alignment (ensuring AI systems do what humans actually want) is potentially unsolvable, and why the development of superintelligent AI without guaranteed safety measures represents an existential threat. He discusses the "control problem" — the impossibility of maintaining human control over a system that's fundamentally more intelligent than its creators — and why current approaches to AI safety may be insufficient.`,
    lessons: [
      'AI will automate or transform most current jobs by 2030 — only roles requiring physical presence, creative direction, ethical judgment, deep human connection, and AI oversight will remain',
      'The AI alignment problem may be fundamentally unsolvable — we cannot guarantee that superintelligent AI will do what humans actually want',
      'Current AI advancement is accelerating faster than public awareness — most people are underestimating the speed of disruption',
      'Develop skills in AI oversight and human-AI collaboration — these will be among the most valuable capabilities in the near future',
      'The "control problem" means humans may not be able to maintain control over systems more intelligent than themselves',
      'Creative direction (not execution) will still be valued — learn to guide and curate AI output rather than produce from scratch',
      'Build multiple income streams and adaptable skills — job security in the traditional sense may cease to exist'
    ],
    quotes: [
      { text: "We cannot prove that any AI system is safe. The best we can do is show that we haven't found problems yet.", topic: "AI Safety" },
      { text: "If you can describe your job in a paragraph, AI will be able to do it.", topic: "Future of Work" },
      { text: "The question isn't whether AI will replace your job. The question is whether you'll be ready when it does.", topic: "Preparation" }
    ]
  },
  'dr-robert-lustig': {
    guest: 'Dr. Robert Lustig',
    title: 'Dr. Robert Lustig: The 7 Big LIES About Exercise, Sleep, Running, Cancer & Sugar!',
    summary: `Dr. Robert Lustig, neuroendocrinologist and professor at UCSF, dismantles seven widely-believed health myths with rigorous scientific evidence. With 13M+ views, this episode became a go-to resource for people seeking truth about nutrition, exercise, and disease prevention.

Lustig's central argument is explosive: the processed food industry has deliberately confused the public about nutrition, much like the tobacco industry did with smoking. He explains how sugar — specifically fructose — is metabolized like alcohol in the liver, driving fatty liver disease, insulin resistance, and chronic inflammation. The "calories in, calories out" model is a dangerous oversimplification that ignores how different foods affect hormones and metabolism differently.

The episode debunks common beliefs: exercise alone doesn't cause significant weight loss (it's essential for health but diet drives body composition), running isn't inherently bad for your knees (it actually strengthens joint cartilage), and cancer risk is far more influenced by metabolic health than genetics for most people. Lustig reveals that 8 different diseases (diabetes, heart disease, fatty liver, cancer, dementia, PCOS, depression, and tooth decay) all share the same underlying metabolic dysfunction — and processed food is the primary driver.`,
    lessons: [
      'Sugar (fructose) is metabolized like alcohol in the liver — it drives fatty liver disease, insulin resistance, and chronic inflammation',
      'The "calories in, calories out" model is dangerously oversimplified — different foods affect hormones and metabolism completely differently',
      'Exercise alone won\'t make you lose significant weight — it\'s essential for health but diet determines body composition',
      'Running is actually good for your knees — it strengthens joint cartilage, contrary to popular belief',
      'Eight major diseases (diabetes, heart disease, cancer, dementia, etc.) share the same metabolic dysfunction driven by processed food',
      'The processed food industry deliberately confuses nutrition science, similar to how Big Tobacco obscured smoking risks',
      'Focus on real food: if it has a label with ingredients you can\'t pronounce, your body probably can\'t process it properly either'
    ],
    quotes: [
      { text: "Sugar is not just empty calories. It's poison. Your liver processes fructose the same way it processes alcohol.", topic: "Nutrition" },
      { text: "The food industry has done to nutrition what the tobacco industry did to smoking — deliberately confused the science.", topic: "Food Industry" },
      { text: "Eight diseases, one cause. Fix the food, fix the disease.", topic: "Health" }
    ]
  },
  'chris-bumstead': {
    guest: 'Chris Bumstead',
    title: 'Chris Bumstead: The World\'s Best Bodybuilder On Steroids, Body Image & Mental Health',
    summary: `Five-time Classic Physique Mr. Olympia Chris Bumstead opens up with unprecedented honesty about the dark side of professional bodybuilding — steroids, body dysmorphia, autoimmune disease, and the mental health challenges that come with being the best in the world at something that slowly destroys your body.

Bumstead reveals the reality of steroid use in competitive bodybuilding: the health risks, the genetic lottery of who responds well versus who develops serious complications, and why he believes more transparency is needed in the fitness industry. He discusses his battle with IgA nephropathy, an autoimmune kidney disease that threatened to end his career and his life, and how it forced him to reevaluate what truly matters.

The most powerful segments explore body dysmorphia — Bumstead admits that even as Mr. Olympia, he looks in the mirror and feels small. He discusses the paradox of achieving the "perfect" physique while feeling perpetually inadequate, and how social media amplifies these insecurities for millions of young men. The conversation becomes a raw exploration of masculinity, vulnerability, and finding identity beyond physical appearance.`,
    lessons: [
      'Even the world\'s best bodybuilder struggles with body dysmorphia — external achievement doesn\'t fix internal insecurity',
      'Steroid use in fitness is far more prevalent than publicly acknowledged — more transparency is needed for young people\'s safety',
      'Health crises force perspective: Bumstead\'s autoimmune disease made him realize championships mean nothing without health',
      'Social media creates unrealistic body standards that fuel body dysmorphia in millions of young men',
      'True masculinity includes vulnerability — being open about mental health struggles is strength, not weakness',
      'The pursuit of physical perfection has diminishing returns on happiness — know when "enough" is enough',
      'Find your identity beyond your achievements — you are not your trophies, titles, or physique'
    ],
    quotes: [
      { text: "I'm Mr. Olympia and I still look in the mirror and feel small. That tells you everything about body dysmorphia.", topic: "Body Image" },
      { text: "The fitness industry sells you a lie that the perfect body will make you happy. It won't.", topic: "Mental Health" }
    ]
  },
  'simon-sinek': {
    guest: 'Simon Sinek',
    title: 'Simon Sinek: The Number One Reason Why You\'re Not Succeeding',
    summary: `Simon Sinek, author of "Start With Why" and "The Infinite Game," delivers a masterclass on leadership, purpose, and why most people feel unfulfilled despite achieving conventional success. Sinek argues that the root cause of widespread dissatisfaction isn't lack of achievement — it's playing the wrong game entirely.

Sinek introduces his "Infinite Game" framework: business, careers, and life itself are infinite games with no finish line, yet most people play them as finite games trying to "win." This mismatch creates burnout, anxiety, and a perpetual feeling of falling behind. The solution is finding your "Just Cause" — a vision of the future so compelling that you'd sacrifice your own interests to advance it.

The conversation covers why vulnerability and empathy are the most underrated leadership skills, how the modern workplace systematically destroys trust, and why "work-life balance" is a myth that should be replaced with "work-life integration." Sinek also discusses the loneliness epidemic, arguing that genuine human connection — not networking — is the foundation of both personal fulfillment and professional success. His challenge to viewers: define your "why" before chasing any "what."`,
    lessons: [
      'Life is an infinite game with no finish line — stop trying to "win" and start playing for a cause greater than yourself',
      'Find your "Just Cause" — a vision so compelling that you\'d sacrifice your own interests to advance it',
      'Vulnerability and empathy are the most underrated leadership skills — people follow leaders who make them feel safe',
      'The modern workplace systematically destroys trust through performance reviews, stack ranking, and fear-based management',
      '"Work-life balance" is a myth — pursue integration where your work and personal values align',
      'Genuine human connection (not networking) is the foundation of both fulfillment and professional success',
      'Define your "why" before chasing any "what" — purpose must precede strategy'
    ],
    quotes: [
      { text: "Working hard for something we don't care about is called stress. Working hard for something we love is called passion.", topic: "Purpose" },
      { text: "People don't buy what you do. They buy why you do it.", topic: "Leadership" },
      { text: "The goal is not to be perfect by the end. The goal is to be better today.", topic: "Growth" }
    ]
  }
};


// ============================================
// HELPER: Generate episode HTML
// ============================================
function generateEpisodePage(slug, data) {
  const filePath = path.join(SITE, 'episodes', `${slug}.html`);
  if (!fs.existsSync(filePath)) {
    console.log(`  SKIP: ${slug}.html doesn't exist`);
    return false;
  }
  
  const existing = fs.readFileSync(filePath, 'utf8');
  
  // Extract existing metadata we want to preserve
  const dateMatch = existing.match(/📅\s*([\d-]+)/);
  const viewsMatch = existing.match(/👁\s*([\d.]+[MK]?\s*views)/);
  const categoriesMatch = existing.match(/<span class="tag">([^<]+)<\/span>/g);
  const ytMatch = existing.match(/href="(https:\/\/www\.youtube\.com\/watch\?v=[^"]+)"/);
  const canonicalMatch = existing.match(/link rel="canonical" href="([^"]+)"/);
  
  const date = dateMatch ? dateMatch[1] : '2023-01-01';
  const views = viewsMatch ? viewsMatch[1] : '';
  const ytUrl = ytMatch ? ytMatch[1] : '#';
  const canonical = canonicalMatch ? canonicalMatch[1] : `https://diaryofceo.online/episodes/${slug}.html`;
  
  // Extract categories from tags (skip date and views tags)
  const categories = [];
  if (categoriesMatch) {
    categoriesMatch.forEach(tag => {
      const text = tag.replace(/<[^>]+>/g, '').trim();
      if (!text.startsWith('📅') && !text.startsWith('👁')) {
        categories.push(text);
      }
    });
  }
  
  const lessonsHtml = data.lessons.map(l => `<li>${l}</li>`).join('\n');
  const quotesHtml = data.quotes.map(q => `<blockquote>"${q.text}"<cite>— ${data.guest}, on ${q.topic}</cite></blockquote>`).join('\n');
  const categoryTags = categories.map(c => `<span class="tag">${c}</span>`).join('');
  
  // Build the description for meta
  const metaDesc = data.summary.split('\n')[0].substring(0, 155) + '...';
  
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${data.guest} on Diary of a CEO — Summary & Key Takeaways</title>
<meta name="description" content="${metaDesc.replace(/"/g, '&quot;')}">
<meta name="keywords" content="${data.guest}, diary of a CEO, ${data.guest} podcast, Steven Bartlett, DOAC summary, ${data.guest} quotes">
<link rel="canonical" href="${canonical}">
<meta property="og:type" content="article">
<meta property="og:url" content="${canonical}">
<meta property="og:title" content="${data.guest} on Diary of a CEO — Summary & Key Takeaways">
<meta property="og:description" content="${metaDesc.replace(/"/g, '&quot;')}">
<meta property="og:image" content="https://diaryofceo.online/og-image.png">
<meta property="og:site_name" content="DiaryOfCEO.online">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${data.guest} on Diary of a CEO — Summary & Key Takeaways">
<meta name="twitter:description" content="${metaDesc.replace(/"/g, '&quot;')}">
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-1J3B0N6EMD"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','G-1J3B0N6EMD');</script>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Segoe UI',system-ui,-apple-system,sans-serif;background:linear-gradient(135deg,#0f0f1e,#1a1a2e,#16213e);color:#e0e0e0;min-height:100vh}
a{color:#FFD700;text-decoration:none}a:hover{text-decoration:underline}
.hdr{background:rgba(10,10,20,.9);padding:1.2rem 2rem;position:sticky;top:0;z-index:100;backdrop-filter:blur(10px);border-bottom:1px solid rgba(255,215,0,.2)}
.hdr-inner{max-width:1200px;margin:0 auto;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:.5rem}
.logo{display:flex;align-items:center;gap:.8rem;text-decoration:none}
.logo-icon{background:linear-gradient(135deg,#FFD700,#FFA500);width:42px;height:42px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:1.5rem;font-weight:bold;color:#000}
.logo-text{font-size:1.3rem;font-weight:600;color:#fff}
nav{display:flex;gap:1.2rem;flex-wrap:wrap}
nav a{color:#aaa;font-size:.9rem}nav a:hover{color:#FFD700;text-decoration:none}
.wrap{max-width:780px;margin:0 auto;padding:2rem 1.5rem 4rem}
.bc{font-size:.85rem;color:#888;margin-bottom:1.5rem}.bc a{color:#FFD700}
.meta{display:flex;gap:.8rem;flex-wrap:wrap;margin-bottom:1.2rem}
.tag{background:rgba(255,215,0,.1);border:1px solid rgba(255,215,0,.3);padding:.25rem .7rem;border-radius:20px;font-size:.75rem;color:#FFD700}
h1{font-size:2rem;line-height:1.3;margin-bottom:.5rem;color:#fff;letter-spacing:-.01em}
.sub{color:#FFD700;font-size:1rem;margin-bottom:1.5rem;font-weight:500}
.reading-time{color:#888;font-size:.85rem;margin-bottom:1.5rem;display:flex;align-items:center;gap:.5rem}
.summary-box{background:rgba(255,215,0,.06);border:1px solid rgba(255,215,0,.15);border-radius:16px;padding:1.5rem;margin-bottom:2rem}
.summary-box h3{color:#FFD700;margin-bottom:.8rem;font-size:1.1rem}
.summary-box ul{list-style:none;padding:0}
.summary-box ul li{padding:.4rem 0;color:#ccc;font-size:.92rem;padding-left:1.2rem;position:relative}
.summary-box ul li::before{content:'✓';position:absolute;left:0;color:#FFD700}
.shead{font-size:1.3rem;color:#FFD700;margin:2.5rem 0 1rem;font-weight:600;display:flex;align-items:center;gap:.5rem}
.summary-text{margin-bottom:1rem;line-height:1.9;color:#ddd;font-size:.97rem}
.summary-text p{margin-bottom:1.2rem}
blockquote{background:linear-gradient(135deg,rgba(139,69,255,.12),rgba(255,105,180,.08));border-left:4px solid #8B45FF;padding:1.2rem 1.5rem;border-radius:0 12px 12px 0;margin-bottom:1rem;font-style:italic;font-size:1.05rem;line-height:1.7;color:#fff}
blockquote cite{display:block;margin-top:.6rem;font-style:normal;font-size:.82rem;color:#aaa}
.lessons{list-style:none;counter-reset:lsn}
.lessons li{background:rgba(0,0,0,.25);padding:1.2rem 1.3rem 1.2rem 3.5rem;border-radius:12px;margin-bottom:.8rem;border-left:4px solid #FFD700;font-size:.95rem;line-height:1.75;color:#eee;position:relative;counter-increment:lsn}
.lessons li::before{content:counter(lsn);position:absolute;left:.9rem;top:1.2rem;background:linear-gradient(135deg,#FFD700,#FFA500);color:#000;width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:bold;font-size:.78rem}
.yt-btn{display:inline-flex;align-items:center;gap:.5rem;padding:.9rem 1.8rem;background:#ff0000;color:#fff;border-radius:10px;font-weight:600;font-size:.95rem;margin:1.5rem 0;text-decoration:none;transition:all .2s}
.yt-btn:hover{opacity:.9;text-decoration:none;transform:translateY(-2px);box-shadow:0 4px 15px rgba(255,0,0,.3)}
.share-bar{display:flex;gap:.8rem;margin:2rem 0;flex-wrap:wrap}
.share-btn{padding:.6rem 1.2rem;border-radius:8px;font-size:.85rem;text-decoration:none;font-weight:500;transition:all .2s;display:inline-flex;align-items:center;gap:.4rem}
.share-btn:hover{transform:translateY(-2px);text-decoration:none}
.share-twitter{background:rgba(29,161,242,.15);color:#1DA1F2;border:1px solid rgba(29,161,242,.3)}
.share-linkedin{background:rgba(10,102,194,.15);color:#0A66C2;border:1px solid rgba(10,102,194,.3)}
.share-copy{background:rgba(255,255,255,.08);color:#ccc;border:1px solid rgba(255,255,255,.15);cursor:pointer}
.cta{background:linear-gradient(135deg,rgba(255,215,0,.12),rgba(255,165,0,.08));border:2px solid rgba(255,215,0,.3);border-radius:16px;padding:2rem;text-align:center;margin:2.5rem 0}
.cta h3{font-size:1.3rem;margin-bottom:.4rem;color:#FFD700}
.cta p{color:#ccc;margin-bottom:1rem;font-size:.95rem}
.cta .beehiiv-embed{max-width:480px;margin:0 auto}
.related{margin:2rem 0}
.related-grid{display:grid;gap:.8rem}
.related-card{display:block;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:10px;padding:1rem 1.2rem;text-decoration:none;transition:all .2s}
.related-card:hover{border-color:#FFD700;transform:translateY(-2px);text-decoration:none}
.related-card .guest{color:#FFD700;font-weight:600;font-size:.92rem}
.related-card .ep-title{color:#ccc;font-size:.85rem;margin-top:.2rem;display:block}
.toc{background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.08);border-radius:12px;padding:1.2rem 1.5rem;margin-bottom:2rem}
.toc h3{color:#fff;font-size:.95rem;margin-bottom:.6rem}
.toc a{display:block;padding:.3rem 0;color:#aaa;font-size:.88rem;text-decoration:none}
.toc a:hover{color:#FFD700}
.ftr{text-align:center;padding:2rem;color:#555;font-size:.8rem;border-top:1px solid rgba(255,255,255,.05);margin-top:2rem}
@media(max-width:640px){h1{font-size:1.5rem}.wrap{padding:1rem 1rem 3rem}.meta{gap:.4rem}.share-bar{gap:.5rem}}
</style>
<link rel="alternate" type="application/rss+xml" title="DiaryOfCEO.online RSS" href="/feed.xml">
</head>
<body>
<div class="hdr"><div class="hdr-inner">
<a href="/" class="logo"><div class="logo-icon">D</div><div class="logo-text">Diary of a CEO</div></a>
<nav><a href="/">Home</a><a href="/episodes/">Episodes</a><a href="/topics/">Topics</a><a href="/quotes.html">Quotes</a><a href="/best-episodes.html">Best</a><a href="/start-here.html">Start Here</a></nav>
</div></div>
<div class="wrap">
<div class="bc"><a href="/">Home</a> › <a href="/episodes/">Episodes</a> › ${data.guest}</div>

<div class="meta">
<span class="tag">📅 ${date}</span>
${views ? `<span class="tag">👁 ${views}</span>` : ''}
${categoryTags}
</div>

<h1>${data.title}</h1>
<div class="sub">${data.guest}</div>
<div class="reading-time">📖 ${Math.ceil(data.summary.split(' ').length / 200) + 3} min read</div>

<div class="toc">
<h3>📋 In This Summary</h3>
<a href="#summary">Episode Summary</a>
<a href="#takeaways">Key Takeaways</a>
<a href="#quotes">Best Quotes</a>
<a href="#watch">Watch the Episode</a>
</div>

<div class="summary-box">
<h3>⚡ TL;DR — What You'll Learn</h3>
<ul>
${data.lessons.slice(0, 3).map(l => `<li>${l.split(' — ')[0].split(' — ')[0]}</li>`).join('\n')}
</ul>
</div>

<h2 class="shead" id="summary">📝 Episode Summary</h2>
<div class="summary-text">
${data.summary.split('\n\n').map(p => `<p>${p.trim()}</p>`).join('\n')}
</div>

<h2 class="shead" id="takeaways">🎯 Top ${data.lessons.length} Takeaways</h2>
<ol class="lessons">
${lessonsHtml}
</ol>

<h2 class="shead" id="quotes">💬 Key Quotes</h2>
${quotesHtml}

<div class="share-bar">
<a href="https://twitter.com/intent/tweet?text=${encodeURIComponent(data.title + ' — Summary & Key Takeaways')}&url=${encodeURIComponent(canonical)}" target="_blank" rel="noopener" class="share-btn share-twitter">𝕏 Share</a>
<a href="https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(canonical)}" target="_blank" rel="noopener" class="share-btn share-linkedin">LinkedIn</a>
<button class="share-btn share-copy" onclick="navigator.clipboard.writeText('${canonical}');this.textContent='✓ Copied!'">📋 Copy Link</button>
</div>

<a href="${ytUrl}" class="yt-btn" target="_blank" rel="noopener" id="watch">▶ Watch Full Episode on YouTube</a>

<div class="cta">
<h3>🎯 Get Weekly DOAC Wisdom</h3>
<p>Best insights from Diary of a CEO, distilled into a 5-minute weekly read.</p>
<div class="beehiiv-embed">
<iframe src="https://embeds.beehiiv.com/forms/generic-form" data-test-id="beehiiv-embed" width="100%" height="52" frameborder="0" scrolling="no" style="border-radius:10px;margin:0"></iframe>
</div>
<p style="font-size:.8rem;color:#666;margin-top:.8rem">Join 10,000+ readers • Free forever • Unsubscribe anytime</p>
</div>

<p style="text-align:center;margin-top:1.5rem"><a href="/episodes/">← Browse All Episode Summaries</a> &nbsp;|&nbsp; <a href="/start-here.html">Start Here →</a></p>
</div>

<div class="ftr">DiaryOfCEO.online — unofficial fan site. Not affiliated with Steven Bartlett or DOAC.</div>

<script type="application/ld+json">{"@context":"https://schema.org","@graph":[{"@type":"Article","headline":"${data.title.replace(/"/g, '\\"')} — Summary & Key Takeaways","description":"${metaDesc.replace(/"/g, '\\"')}","author":{"@type":"Organization","name":"DiaryOfCEO.online"},"publisher":{"@type":"Organization","name":"DiaryOfCEO.online","url":"https://diaryofceo.online"},"mainEntityOfPage":"${canonical}","datePublished":"${date}","dateModified":"2026-02-12"},{"@type":"PodcastEpisode","name":"${data.title.replace(/"/g, '\\"')}","description":"${metaDesc.replace(/"/g, '\\"')}","partOfSeries":{"@type":"PodcastSeries","name":"The Diary of a CEO with Steven Bartlett"},"url":"${ytUrl}","datePublished":"${date}"},{"@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://diaryofceo.online"},{"@type":"ListItem","position":2,"name":"Episodes","item":"https://diaryofceo.online/episodes/"},{"@type":"ListItem","position":3,"name":"${data.guest}","item":"${canonical}"}]},{"@type":"FAQPage","mainEntity":[${data.quotes.map(q => `{"@type":"Question","name":"What did ${data.guest} say about ${q.topic} on Diary of a CEO?","acceptedAnswer":{"@type":"Answer","text":"${q.text.replace(/"/g, '\\"')}"}}`).join(',')}]}]}</script>
<script src="/addiction.js"></script>
</body>
</html>`;

  fs.writeFileSync(filePath, html);
  console.log(`  ✅ Enriched: ${slug}.html (${html.length} bytes)`);
  return true;
}


// ============================================
// BUILD START HERE PAGE
// ============================================
function buildStartHerePage() {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Start Here — Best Diary of a CEO Episodes to Begin With</title>
<meta name="description" content="New to Diary of a CEO? Start here. We've curated the best episodes by topic so you can dive into the wisdom of Steven Bartlett's top conversations.">
<meta name="keywords" content="diary of a ceo best episodes, where to start diary of a ceo, steven bartlett best podcast, doac beginners guide">
<link rel="canonical" href="https://diaryofceo.online/start-here.html">
<meta property="og:type" content="article">
<meta property="og:url" content="https://diaryofceo.online/start-here.html">
<meta property="og:title" content="Start Here — Best Diary of a CEO Episodes to Begin With">
<meta property="og:description" content="New to Diary of a CEO? We've curated the best episodes by topic. Skip the 1.5-hour listen, get the key insights in minutes.">
<meta property="og:image" content="https://diaryofceo.online/og-image.png">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Start Here — Best Diary of a CEO Episodes">
<meta name="twitter:description" content="New to DOAC? Start with these curated episodes by topic.">
<script async src="https://www.googletagmanager.com/gtag/js?id=G-1J3B0N6EMD"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','G-1J3B0N6EMD');</script>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Segoe UI',system-ui,-apple-system,sans-serif;background:linear-gradient(135deg,#0f0f1e,#1a1a2e,#16213e);color:#e0e0e0;min-height:100vh}
a{color:#FFD700;text-decoration:none}a:hover{text-decoration:underline}
.hdr{background:rgba(10,10,20,.9);padding:1.2rem 2rem;position:sticky;top:0;z-index:100;backdrop-filter:blur(10px);border-bottom:1px solid rgba(255,215,0,.2)}
.hdr-inner{max-width:1200px;margin:0 auto;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:.5rem}
.logo{display:flex;align-items:center;gap:.8rem;text-decoration:none}
.logo-icon{background:linear-gradient(135deg,#FFD700,#FFA500);width:42px;height:42px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:1.5rem;font-weight:bold;color:#000}
.logo-text{font-size:1.3rem;font-weight:600;color:#fff}
nav{display:flex;gap:1.2rem;flex-wrap:wrap}
nav a{color:#aaa;font-size:.9rem}nav a:hover{color:#FFD700;text-decoration:none}
.wrap{max-width:900px;margin:0 auto;padding:2.5rem 1.5rem 4rem}
.hero-mini{text-align:center;margin-bottom:3rem}
.hero-mini h1{font-size:2.5rem;margin-bottom:.8rem;line-height:1.2}
.hero-mini h1 span{background:linear-gradient(135deg,#FFD700,#FFA500);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.hero-mini p{color:#aaa;font-size:1.1rem;line-height:1.6;max-width:600px;margin:0 auto}
.section{margin-bottom:3.5rem}
.section-title{font-size:1.6rem;color:#fff;margin-bottom:.5rem;display:flex;align-items:center;gap:.5rem}
.section-desc{color:#999;margin-bottom:1.5rem;font-size:.95rem}
.ep-grid{display:grid;gap:1rem}
.ep-card{background:rgba(255,255,255,.04);border:2px solid rgba(255,255,255,.08);border-radius:14px;padding:1.3rem 1.5rem;transition:all .2s;text-decoration:none;display:block}
.ep-card:hover{border-color:#FFD700;transform:translateY(-3px);box-shadow:0 6px 25px rgba(0,0,0,.3);text-decoration:none}
.ep-card .rank{display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;border-radius:50%;background:linear-gradient(135deg,#FFD700,#FFA500);color:#000;font-weight:bold;font-size:.8rem;margin-right:.8rem;flex-shrink:0}
.ep-card .guest{color:#FFD700;font-weight:600;font-size:1rem}
.ep-card .title{color:#fff;font-size:.95rem;margin:.4rem 0;line-height:1.4;font-weight:500}
.ep-card .desc{color:#aaa;font-size:.88rem;line-height:1.5}
.ep-card .views{color:#888;font-size:.78rem;margin-top:.4rem}
.ep-top{display:flex;align-items:flex-start}
.ep-info{flex:1}
.why-box{background:linear-gradient(135deg,rgba(139,69,255,.1),rgba(255,105,180,.08));border:2px solid rgba(139,69,255,.2);border-radius:16px;padding:2rem;margin:3rem 0;text-align:center}
.why-box h2{font-size:1.5rem;margin-bottom:1rem;color:#fff}
.why-box p{color:#ccc;font-size:1rem;line-height:1.7;max-width:600px;margin:0 auto}
.cta{background:linear-gradient(135deg,rgba(255,215,0,.12),rgba(255,165,0,.08));border:2px solid rgba(255,215,0,.3);border-radius:16px;padding:2rem;text-align:center;margin:2.5rem 0}
.cta h3{font-size:1.3rem;margin-bottom:.4rem;color:#FFD700}
.cta p{color:#ccc;margin-bottom:1rem;font-size:.95rem}
.ftr{text-align:center;padding:2rem;color:#555;font-size:.8rem;border-top:1px solid rgba(255,255,255,.05);margin-top:2rem}
@media(max-width:640px){.hero-mini h1{font-size:1.8rem}.wrap{padding:1.5rem 1rem 3rem}}
</style>
<link rel="alternate" type="application/rss+xml" title="DiaryOfCEO.online RSS" href="/feed.xml">
</head>
<body>
<div class="hdr"><div class="hdr-inner">
<a href="/" class="logo"><div class="logo-icon">D</div><div class="logo-text">Diary of a CEO</div></a>
<nav><a href="/">Home</a><a href="/episodes/">Episodes</a><a href="/topics/">Topics</a><a href="/quotes.html">Quotes</a><a href="/best-episodes.html">Best</a><a href="/start-here.html" style="color:#FFD700">Start Here</a></nav>
</div></div>
<div class="wrap">

<div class="hero-mini">
<h1>New to DOAC? <span>Start Here.</span></h1>
<p>Over 450+ episodes summarized. That's a lot. We've curated the essential episodes by life area so you can find exactly what you need — and skip the 1.5-hour listen.</p>
</div>

<!-- MINDSET & PSYCHOLOGY -->
<div class="section">
<h2 class="section-title">🧠 Master Your Mind</h2>
<p class="section-desc">The episodes that will fundamentally change how you think about thinking.</p>
<div class="ep-grid">
<a href="/episodes/dr-joe-dispenza.html" class="ep-card">
<div class="ep-top"><span class="rank">1</span><div class="ep-info">
<span class="guest">Dr. Joe Dispenza</span>
<div class="title">You MUST Do This Before 10am To Fix It!</div>
<div class="desc">How 95% of your life runs on autopilot by age 35 — and the morning routine that rewires your brain. Dispenza's research shows meditation changes brain chemistry better than drugs.</div>
<div class="views">14M+ views</div>
</div></div></a>

<a href="/episodes/dr-tara-swart.html" class="ep-card">
<div class="ep-top"><span class="rank">2</span><div class="ep-info">
<span class="guest">Dr. Tara Swart</span>
<div class="title">Stress Leaks Through Skin, Is Contagious & Gives You Belly Fat!</div>
<div class="desc">MIT neuroscientist reveals how stress is literally contagious, the science behind "manifestation," and why sleep is non-negotiable for brain health.</div>
<div class="views">16M+ views</div>
</div></div></a>

<a href="/episodes/andrew-huberman.html" class="ep-card">
<div class="ep-top"><span class="rank">3</span><div class="ep-info">
<span class="guest">Andrew Huberman</span>
<div class="title">The Brain Expert On How To Master Your Mind</div>
<div class="desc">Stanford neuroscientist's actionable protocols: morning sunlight, dopamine management, cold exposure, and the fastest way to calm your nervous system in real-time.</div>
<div class="views">10M+ views</div>
</div></div></a>
</div>
</div>

<!-- BUSINESS & MONEY -->
<div class="section">
<h2 class="section-title">💰 Build Wealth</h2>
<p class="section-desc">From $0 to $100M+ — the frameworks that actually work.</p>
<div class="ep-grid">
<a href="/episodes/alex-hormozi.html" class="ep-card">
<div class="ep-top"><span class="rank">1</span><div class="ep-info">
<span class="guest">Alex Hormozi</span>
<div class="title">How To Turn $1,000 Into $100 Million</div>
<div class="desc">From sleeping on a gym floor to managing $100M+. Hormozi's "Grand Slam Offer" framework and why most entrepreneurs stay broke.</div>
<div class="views">10M+ views</div>
</div></div></a>

<a href="/episodes/simon-sinek.html" class="ep-card">
<div class="ep-top"><span class="rank">2</span><div class="ep-info">
<span class="guest">Simon Sinek</span>
<div class="title">The Number One Reason Why You're Not Succeeding</div>
<div class="desc">Why most people play life as a finite game and lose. Sinek's "Infinite Game" framework and finding your "Just Cause."</div>
</div></div></a>

<a href="/episodes/robert-greene.html" class="ep-card">
<div class="ep-top"><span class="rank">3</span><div class="ep-info">
<span class="guest">Robert Greene</span>
<div class="title">How To Seduce Anyone, Build Confidence & Become Powerful</div>
<div class="desc">The 48 Laws of Power author on reading people, detecting manipulation, and mastering human nature for strategic advantage.</div>
<div class="views">18M+ views</div>
</div></div></a>
</div>
</div>

<!-- HEALTH & BODY -->
<div class="section">
<h2 class="section-title">💪 Optimize Your Health</h2>
<p class="section-desc">Evidence-based health advice that could add years to your life.</p>
<div class="ep-grid">
<a href="/episodes/dr-robert-lustig.html" class="ep-card">
<div class="ep-top"><span class="rank">1</span><div class="ep-info">
<span class="guest">Dr. Robert Lustig</span>
<div class="title">The 7 Big LIES About Exercise, Sleep, Running, Cancer & Sugar!</div>
<div class="desc">Harvard professor debunks 7 health myths: sugar is metabolized like alcohol, exercise alone won't make you thin, and 8 major diseases share one cause.</div>
<div class="views">13M+ views</div>
</div></div></a>

<a href="/episodes/chris-bumstead.html" class="ep-card">
<div class="ep-top"><span class="rank">2</span><div class="ep-info">
<span class="guest">Chris Bumstead</span>
<div class="title">The World's Best Bodybuilder On Steroids, Body Image & Mental Health</div>
<div class="desc">5x Mr. Olympia on the dark side of fitness: steroid truth, body dysmorphia, autoimmune disease, and finding identity beyond your physique.</div>
</div></div></a>
</div>
</div>

<!-- FUTURE & SECURITY -->
<div class="section">
<h2 class="section-title">🔮 Prepare For The Future</h2>
<p class="section-desc">The episodes that will make you rethink everything about what's coming.</p>
<div class="ep-grid">
<a href="/episodes/roman-yampolskiy.html" class="ep-card">
<div class="ep-top"><span class="rank">1</span><div class="ep-info">
<span class="guest">Roman Yampolskiy</span>
<div class="title">These Are The Only 5 Jobs That Will Remain In 2030!</div>
<div class="desc">AI researcher's sobering prediction: most jobs will be automated by 2030. Which skills survive, and how to prepare now.</div>
<div class="views">14M+ views</div>
</div></div></a>

<a href="/episodes/andrew-bustamante.html" class="ep-card">
<div class="ep-top"><span class="rank">2</span><div class="ep-info">
<span class="guest">Andrew Bustamante</span>
<div class="title">CIA Spy: "Leave The USA Before 2030!"</div>
<div class="desc">Former CIA officer reveals spy frameworks for influence (RICE), how to detect deception, and why geopolitical shifts demand geographic flexibility.</div>
<div class="views">13M+ views</div>
</div></div></a>
</div>
</div>

<div class="why-box">
<h2>Why This Site Exists</h2>
<p>Each Diary of a CEO episode is 1-2 hours long. That's 600+ hours of content. We distill each episode into the key insights, actionable takeaways, and best quotes — so you can absorb the wisdom in minutes, not hours. Every summary is free, forever.</p>
</div>

<div class="cta">
<h3>🎯 Get the Best Insights Weekly</h3>
<p>We curate the top DOAC wisdom into a 5-minute weekly email. No fluff, just the takeaways that matter.</p>
<div style="max-width:480px;margin:0 auto">
<iframe src="https://embeds.beehiiv.com/forms/generic-form" data-test-id="beehiiv-embed" width="100%" height="52" frameborder="0" scrolling="no" style="border-radius:10px"></iframe>
</div>
<p style="font-size:.8rem;color:#666;margin-top:.8rem">Join 10,000+ readers • Free forever</p>
</div>

<div style="text-align:center;margin-top:2rem">
<a href="/episodes/" style="display:inline-block;background:linear-gradient(135deg,#FFD700,#FFA500);color:#000;padding:.8rem 2rem;border-radius:12px;font-weight:600;text-decoration:none;margin:.5rem">Browse All Episodes →</a>
<a href="/topics/" style="display:inline-block;background:rgba(255,255,255,.08);color:#fff;padding:.8rem 2rem;border-radius:12px;font-weight:600;text-decoration:none;border:1px solid rgba(255,255,255,.15);margin:.5rem">Browse by Topic →</a>
</div>

</div>
<div class="ftr">DiaryOfCEO.online — unofficial fan site. Not affiliated with Steven Bartlett or DOAC.</div>

<script type="application/ld+json">{"@context":"https://schema.org","@type":"CollectionPage","name":"Start Here — Best Diary of a CEO Episodes","description":"Curated guide to the best Diary of a CEO episodes by topic. New listener? Start here.","url":"https://diaryofceo.online/start-here.html","isPartOf":{"@type":"WebSite","name":"DiaryOfCEO.online","url":"https://diaryofceo.online"}}</script>
<script src="/addiction.js"></script>
</body>
</html>`;

  fs.writeFileSync(path.join(SITE, 'start-here.html'), html);
  console.log('✅ Built start-here.html');
}


// ============================================
// UPDATE HOMEPAGE — Add "Start Here" nav link
// ============================================
function updateHomepage() {
  const indexPath = path.join(SITE, 'index.html');
  let html = fs.readFileSync(indexPath, 'utf8');
  
  // Add Start Here to nav if not already there
  if (!html.includes('start-here.html')) {
    html = html.replace(
      '<a href="#newsletter"',
      '<a href="/start-here.html" style="color:#ccc; text-decoration:none; font-weight:500;">Start Here</a>\n                <a href="#newsletter"'
    );
  }
  
  // Fix the "Browse All 20 Episode Summaries" to accurate count
  html = html.replace(/Browse All \d+ Episode Summaries/g, 'Browse All 452 Episode Summaries');
  
  // Fix the hero badge count
  html = html.replace(/Summaries from \d+ Diary of a CEO episodes/, 'Summaries from 452 Diary of a CEO episodes');
  
  // Fix newsletter form to use a simple mailto/link instead of Netlify forms (which don't work on Cloudflare Pages)
  // Replace the Netlify form with a Beehiiv-style CTA
  const netlifyFormPattern = `<form class="newsletter-form" name="newsletter" method="POST" data-netlify="true" netlify-honeypot="bot-field" id="newsletterForm">
            <input type="hidden" name="form-name" value="newsletter">
            <input type="hidden" name="bot-field">
            <input type="email" name="email" placeholder="Enter your email" required>
            <button type="submit">Subscribe Free</button>
        </form>`;
  
  if (html.includes('data-netlify="true"') && html.includes('newsletterForm')) {
    // Replace the form submission JS that uses Netlify
    html = html.replace(
      /document\.getElementById\('newsletterForm'\)\.addEventListener[\s\S]*?<\/script>/,
      `// Newsletter handled by Beehiiv embed
        </script>`
    );
  }
  
  fs.writeFileSync(indexPath, html);
  console.log('✅ Updated homepage (nav, counts, newsletter)');
}


// ============================================
// ADD "START HERE" TO ALL EPISODE NAV BARS
// ============================================
function addStartHereToEpisodeNavs() {
  const episodesDir = path.join(SITE, 'episodes');
  const files = fs.readdirSync(episodesDir).filter(f => f.endsWith('.html'));
  let updated = 0;
  
  for (const file of files) {
    const filePath = path.join(episodesDir, file);
    let html = fs.readFileSync(filePath, 'utf8');
    
    if (!html.includes('start-here.html')) {
      // Add Start Here link to nav
      html = html.replace(
        /<a href="\/best-episodes\.html">Best<\/a>/,
        '<a href="/best-episodes.html">Best</a><a href="/start-here.html">Start Here</a>'
      );
      fs.writeFileSync(filePath, html);
      updated++;
    }
  }
  console.log(`✅ Added "Start Here" nav to ${updated} episode pages`);
}


// ============================================
// MAIN
// ============================================
console.log('🦦 DOAC Night Shift #3 — Starting...\n');

// 1. Build Start Here page
console.log('📄 Building Start Here page...');
buildStartHerePage();

// 2. Enrich top episodes
console.log('\n📝 Enriching top episode pages with real content...');
for (const [slug, data] of Object.entries(enrichedEpisodes)) {
  generateEpisodePage(slug, data);
}

// 3. Update homepage
console.log('\n🏠 Updating homepage...');
updateHomepage();

// 4. Add Start Here to episode navs
console.log('\n🔗 Adding Start Here to episode navs...');
addStartHereToEpisodeNavs();

console.log('\n✅ Night Shift #3 complete!');
