# DiaryOfCEO.online Launch Checklist

A step-by-step guide to get the site live and driving traffic.
Created by Rudy 🦦 to help Hunter ship faster.

---

## 🔴 BLOCKING: Domain Issues

- [ ] **Fix Namecheap verification** — Site is unreachable without this
  - Check email for verification links
  - Log into Namecheap → Domain List → diaryofceo.online → Manage
  - If suspended, contact support: support@namecheap.com

---

## 🟡 PRE-LAUNCH (Do Once Domain Works)

### Hosting
- [ ] Verify Netlify is connected to GitHub repo
  - Go to: https://app.netlify.com
  - Should auto-deploy on push to main
- [ ] Add custom domain in Netlify
  - Site settings → Domain management → Add custom domain
  - Point Namecheap DNS to Netlify nameservers

### SEO Verification
- [ ] Submit sitemap to Google Search Console
  - Go to: https://search.google.com/search-console
  - Add property → diaryofceo.online
  - Verify via DNS TXT record
  - Sitemaps → Add → `https://diaryofceo.online/sitemap.xml`

### Analytics
- [ ] Add Google Analytics
  - Create GA4 property at analytics.google.com
  - Add tracking code to `<head>` of index.html
  - Rudy can help with this

### Social Preview Image
- [ ] Create og-image.png (1200x630px)
  - Should say "Diary of a CEO Podcast Summaries"
  - Gold/black color scheme to match site
  - Upload to root of repo
- [ ] Test with Facebook Sharing Debugger
  - https://developers.facebook.com/tools/debug/
  - Enter: https://diaryofceo.online/

---

## 🟢 POST-LAUNCH (Week 1)

### Content Marketing
- [ ] Run quote-generator.js to create social posts
  - `node scripts/quote-generator.js --count 10`
- [ ] Post 1-2 quotes daily on Twitter
- [ ] Post 1 LinkedIn article per week about top episodes
- [ ] Submit to podcast directories/blogs

### Community
- [ ] Share in relevant subreddits (don't spam!)
  - r/podcasts
  - r/entrepreneur
  - r/selfimprovement
  - r/getdisciplined
- [ ] Post in Diary of a CEO Facebook groups

### Monetization Prep
- [ ] Add email signup (ConvertKit or Mailchimp)
- [ ] Plan newsletter by category
- [ ] Research Google AdSense requirements

---

## 📊 Success Metrics (First Month)

- [ ] 1,000+ organic visitors from Google
- [ ] 100+ email signups
- [ ] Top 10 Google ranking for "diary of ceo summaries"
- [ ] 50+ social shares

---

## 🆘 Need Help?

Ask Rudy! Just message:
- "Help me with the domain setup"
- "Generate social posts for marketing"
- "Add analytics to the site"
- "What should I do next for DiaryOfCEO?"

---

*Last updated: 2026-02-01*
