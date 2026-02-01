#!/usr/bin/env node
/**
 * Quote Generator for DiaryOfCEO.online
 * 
 * Generates shareable quotes for Twitter/X, LinkedIn, etc.
 * Usage: node quote-generator.js [--category "Mind & Psychology"] [--count 5]
 * 
 * Created by Rudy 🦦 during overnight build session
 */

const fs = require('fs');
const path = require('path');

// Sample quotes embedded (in production, would load from data file)
const QUOTES = [
  { guest: "James Clear", text: "You do not rise to the level of your goals, you fall to the level of your systems.", category: "Mind & Psychology", topic: "Habits" },
  { guest: "Alex Hormozi", text: "Volume negates luck. The more you do, the luckier you get.", category: "Money & Business", topic: "Work ethic" },
  { guest: "Dr. Gabor Maté", text: "The question is not why the addiction, but why the pain.", category: "Mind & Psychology", topic: "Addiction" },
  { guest: "Mel Robbins", text: "You're never going to feel like it. That's the secret. You have to do it anyway.", category: "Mind & Psychology", topic: "Motivation" },
  { guest: "Andrew Huberman", text: "Dopamine is not about the reward. It's about the anticipation of the reward.", category: "Health & Body", topic: "Dopamine" },
  { guest: "Brené Brown", text: "Vulnerability is not weakness. It's our greatest measure of courage.", category: "Happiness & Fulfillment", topic: "Vulnerability" },
  { guest: "Morgan Housel", text: "The hardest financial skill is getting the goalpost to stop moving.", category: "Money & Business", topic: "Wealth" },
  { guest: "David Goggins", text: "I'm not talented. I just refuse to quit. That's my only advantage.", category: "Mind & Psychology", topic: "Discipline" },
  { guest: "Jordan Peterson", text: "Compare yourself to who you were yesterday, not to who someone else is today.", category: "Mind & Psychology", topic: "Self-improvement" },
  { guest: "Naval Ravikant", text: "Seek wealth, not money. Wealth is assets that earn while you sleep.", category: "Money & Business", topic: "Wealth" },
];

function generateTwitterPost(quote) {
  const post = `"${quote.text}"

— ${quote.guest} on @StevenBartlett's Diary of a CEO

🔗 More wisdom: diaryofceo.online

#DOAC #${quote.topic.replace(/\s+/g, '')} #Podcast`;
  
  const charCount = post.length;
  const isValid = charCount <= 280;
  
  return {
    post,
    charCount,
    isValid,
    warning: isValid ? null : `⚠️ ${charCount - 280} characters over limit`
  };
}

function generateLinkedInPost(quote) {
  return `💡 "${quote.text}"

— ${quote.guest}

This insight from The Diary of a CEO with Steven Bartlett really resonated with me.

${quote.guest} breaks down ${quote.topic.toLowerCase()} in a way that's both practical and profound.

What's your take on this? 👇

🎧 Full episode summaries at diaryofceo.online

#TheDiaryOfACEO #Leadership #${quote.topic.replace(/\s+/g, '')} #PersonalDevelopment`;
}

function generateInstagramCaption(quote) {
  return `"${quote.text}" 💫

— ${quote.guest}

Save this for when you need a reminder 🔖

📺 From @steven on The Diary of a CEO
🔗 Link in bio for 600+ episode summaries

.
.
.
#diaryofaceo #stevenbartlett #${quote.topic.toLowerCase().replace(/\s+/g, '')} #wisdom #podcast #motivation #mindset #success #quotes #entrepreneurship`;
}

// Parse command line args
const args = process.argv.slice(2);
let category = null;
let count = 3;

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--category' && args[i + 1]) {
    category = args[i + 1];
    i++;
  } else if (args[i] === '--count' && args[i + 1]) {
    count = parseInt(args[i + 1], 10);
    i++;
  }
}

// Filter quotes
let filteredQuotes = QUOTES;
if (category) {
  filteredQuotes = QUOTES.filter(q => 
    q.category.toLowerCase().includes(category.toLowerCase())
  );
}

// Random selection
const selected = filteredQuotes
  .sort(() => Math.random() - 0.5)
  .slice(0, count);

console.log('\n🦦 DIARY OF CEO QUOTE GENERATOR\n');
console.log('=' .repeat(50));

selected.forEach((quote, i) => {
  console.log(`\n📝 QUOTE ${i + 1}: ${quote.guest} on ${quote.topic}\n`);
  
  const twitter = generateTwitterPost(quote);
  console.log('🐦 TWITTER/X:');
  console.log('-'.repeat(40));
  console.log(twitter.post);
  console.log(`\n[${twitter.charCount}/280 chars${twitter.warning ? ' - ' + twitter.warning : ' ✅'}]\n`);
  
  console.log('💼 LINKEDIN:');
  console.log('-'.repeat(40));
  console.log(generateLinkedInPost(quote));
  console.log();
  
  console.log('📸 INSTAGRAM:');
  console.log('-'.repeat(40));
  console.log(generateInstagramCaption(quote));
  console.log('\n' + '='.repeat(50));
});

console.log('\n✅ Generated ' + selected.length + ' shareable posts');
console.log('💡 Tip: Use these to drive traffic once domain is live\n');
