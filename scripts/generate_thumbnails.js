import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// 1. Ensure target directories exist
const dirs = [
  path.join(rootDir, 'public', '.anime', 'Aura Leveling', 'Season-1'),
  path.join(rootDir, 'public', '.anime', 'Aura Leveling', 'Season-2'),
  path.join(rootDir, 'public', 'anime', 'Aura Leveling', 'Season-1'),
  path.join(rootDir, 'public', 'anime', 'Aura Leveling', 'Season-2'),
  path.join(rootDir, 'public', 'thumbnails', 's1'),
  path.join(rootDir, 'public', 'thumbnails', 's2')
];

dirs.forEach(d => fs.mkdirSync(d, { recursive: true }));

// 2. Copy user banners
const s1BannerSrc = path.join(rootDir, 'src', 'assets', 'images', 'solo_leveling_banner_1790860864866.jpg');
const s2BannerSrc = path.join(rootDir, 'src', 'assets', 'images', 'solo_leveling_poster_1790860845767.jpg');

if (fs.existsSync(s1BannerSrc)) {
  fs.copyFileSync(s1BannerSrc, path.join(rootDir, 'public', '.anime', 'Aura Leveling', 'Season-1', 'thumbnail.jpg'));
  fs.copyFileSync(s1BannerSrc, path.join(rootDir, 'public', 'anime', 'Aura Leveling', 'Season-1', 'thumbnail.jpg'));
  console.log('Season 1 banner copied successfully.');
}

if (fs.existsSync(s2BannerSrc)) {
  fs.copyFileSync(s2BannerSrc, path.join(rootDir, 'public', 'anime', 'Aura Leveling', 'Season-2', 'thumbnail.jpeg'));
  fs.copyFileSync(s2BannerSrc, path.join(rootDir, 'public', '.anime', 'Aura Leveling', 'Season-2', 'thumbnail.jpeg'));
  console.log('Season 2 banner copied successfully.');
}

// 3. Episode definitions with unique artistic styling for each episode
const s1Episodes = [
  { num: 1, title: "I'm Used to It", theme: '#3b82f6', bg2: '#1d4ed8', aura: 'Double Dungeon Gate', icon: 'gate' },
  { num: 2, title: "If I Had One More Chance", theme: '#6366f1', bg2: '#4338ca', aura: 'God Statue Commandments', icon: 'statue' },
  { num: 3, title: "It's Like a Game", theme: '#0ea5e9', bg2: '#0369a1', aura: 'System Daily Quest Awakening', icon: 'quest' },
  { num: 4, title: "I've Gotta Get Stronger", theme: '#10b981', bg2: '#047857', aura: 'Kasaka Poison Fang', icon: 'dagger' },
  { num: 5, title: "A Pretty Good Deal", theme: '#f59e0b', bg2: '#b45309', aura: 'C-Rank Dungeon Betrayal', icon: 'sword' },
  { num: 6, title: "The Real Hunt Begins", theme: '#ef4444', bg2: '#b91c1c', aura: 'Bloodlust: Hunter vs Hunter', icon: 'skull' },
  { num: 7, title: "Let's See How Far I Can Go", theme: '#8b5cf6', bg2: '#6d28d9', aura: 'Demon Castle Incursion', icon: 'castle' },
  { num: 8, title: "This is Frustrating", theme: '#ec4899', bg2: '#be185d', aura: 'Assassin Guild Duel', icon: 'dagger' },
  { num: 9, title: "You've Been Hiding Your Skills", theme: '#06b6d4', bg2: '#0e7490', aura: 'Red Gate Snow Field', icon: 'snow' },
  { num: 10, title: "What Is This, a Picnic?", theme: '#38bdf8', bg2: '#0284c7', aura: 'Baruka Ice Elf Lord', icon: 'ice' },
  { num: 11, title: "A Knight Who Defends an Empty Throne", theme: '#dc2626', bg2: '#991b1b', aura: 'Blood-Red Commander Igris', icon: 'knight' },
  { num: 12, title: "Arise", theme: '#9333ea', bg2: '#581c87', aura: 'The Shadow Monarch Awakens', icon: 'monarch' }
];

const s2Episodes = [
  { num: 1, title: "Shadow Army Resurgence", theme: '#8b5cf6', bg2: '#4c1d95', aura: 'Shadow Legion Mobilization', icon: 'monarch' },
  { num: 2, title: "Red Gate Snowstorm", theme: '#06b6d4', bg2: '#164e63', aura: 'Frozen Abyss Gate', icon: 'snow' },
  { num: 3, title: "High Orc Chieftain", theme: '#dc2626', bg2: '#7f1d1d', aura: 'Kargalgan Curse Magic', icon: 'skull' },
  { num: 4, title: "Hymn of the Giants", theme: '#d97706', bg2: '#78350f', aura: 'Tusk Transformation', icon: 'sword' },
  { num: 5, title: "Demon Castle 100th Floor", theme: '#7c3aed', bg2: '#3b0764', aura: 'Soul Extraction Forge', icon: 'castle' },
  { num: 6, title: "Baran: Demon King of White Flames", theme: '#38bdf8', bg2: '#0369a1', aura: 'Wyvern Kaisel Tamed', icon: 'dragon' },
  { num: 7, title: "S-Rank Hunter Re-Evaluation", theme: '#2563eb', bg2: '#1e3a8a', aura: 'National Hunter Recognition', icon: 'quest' },
  { num: 8, title: "Jeju Island Reconnaissance", theme: '#059669', bg2: '#064e3b', aura: 'Black Ant Swarm Infiltration', icon: 'gate' },
  { num: 9, title: "The Ant Queen's Nest", theme: '#b91c1c', bg2: '#450a0a', aura: 'Descent into Jeju Queen Hive', icon: 'statue' },
  { num: 10, title: "Beru: The Ant King", theme: '#4c1d95', bg2: '#1e1b4b', aura: 'Predator of S-Rank Hunters', icon: 'skull' },
  { num: 11, title: "Shadow Monarch vs Ant King", theme: '#7c2d12', bg2: '#431407', aura: 'Clash of Supreme Monarchs', icon: 'monarch' },
  { num: 12, title: "Extraction: General Beru", theme: '#9333ea', bg2: '#3b0764', aura: 'My King, I Obey Your Will', icon: 'monarch' },
  { num: 13, title: "The True Monarch Awakens", theme: '#4338ca', bg2: '#1e1b4b', aura: 'The Gate Between Realms', icon: 'castle' }
];

function generateSVG(ep, season) {
  const pad = String(ep.num).padStart(2, '0');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 720" width="1280" height="720">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#05070f" />
      <stop offset="40%" stop-color="#0a1020" />
      <stop offset="100%" stop-color="${ep.bg2}" stop-opacity="0.8" />
    </linearGradient>
    <radialGradient id="auraGlow" cx="65%" cy="45%" r="55%">
      <stop offset="0%" stop-color="${ep.theme}" stop-opacity="0.45" />
      <stop offset="60%" stop-color="${ep.theme}" stop-opacity="0.1" />
      <stop offset="100%" stop-color="#000000" stop-opacity="0" />
    </radialGradient>
    <linearGradient id="cardGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="${ep.theme}" stop-opacity="0.8" />
      <stop offset="100%" stop-color="#3b82f6" stop-opacity="0.2" />
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="25" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <!-- Background -->
  <rect width="1280" height="720" fill="url(#bgGrad)" />
  <rect width="1280" height="720" fill="url(#auraGlow)" />

  <!-- Geometric Anime Grid Lines & Ambient Particles -->
  <g stroke="white" stroke-opacity="0.04" stroke-width="1">
    <line x1="0" y1="180" x2="1280" y2="180" />
    <line x1="0" y1="360" x2="1280" y2="360" />
    <line x1="0" y1="540" x2="1280" y2="540" />
    <line x1="320" y1="0" x2="320" y2="720" />
    <line x1="640" y1="0" x2="640" y2="720" />
    <line x1="960" y1="0" x2="960" y2="720" />
  </g>

  <!-- Glowing Aura Rune Circle -->
  <g transform="translate(850, 360)">
    <circle r="220" fill="none" stroke="${ep.theme}" stroke-width="2" stroke-dasharray="16,8" opacity="0.4" />
    <circle r="180" fill="none" stroke="${ep.theme}" stroke-width="1.5" opacity="0.6" />
    <circle r="140" fill="none" stroke="${ep.theme}" stroke-width="3" stroke-dasharray="32,12" opacity="0.5" filter="url(#glow)" />
    <!-- Stylized Dagger / Monarch Wings Silhouette -->
    <path d="M0 -150 L25 -40 L90 0 L25 40 L0 150 L-25 40 L-90 0 L-25 -40 Z" fill="${ep.theme}" opacity="0.25" filter="url(#glow)" />
    <path d="M0 -110 L15 -25 L60 0 L15 25 L0 110 L-15 25 L-60 0 L-15 -25 Z" fill="#ffffff" opacity="0.35" />
    <!-- Glowing Eye Rune -->
    <circle cx="0" cy="0" r="14" fill="${ep.theme}" filter="url(#glow)" />
    <circle cx="0" cy="0" r="6" fill="#ffffff" />
  </g>

  <!-- Dark Bottom Gradient for readability -->
  <rect y="400" width="1280" height="320" fill="url(#bgGrad)" opacity="0.95" />

  <!-- Top Brand Header -->
  <g transform="translate(80, 80)">
    <rect width="180" height="36" rx="18" fill="rgba(15,23,42,0.8)" stroke="${ep.theme}" stroke-width="1.5" />
    <text x="90" y="23" fill="#ffffff" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="800" text-anchor="middle" letter-spacing="2">SOLO LEVELING</text>
  </g>

  <!-- Season & Episode Badge -->
  <g transform="translate(80, 480)">
    <rect width="170" height="38" rx="8" fill="${ep.theme}" />
    <text x="85" y="25" fill="#ffffff" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="16" font-weight="900" text-anchor="middle" letter-spacing="1">SEASON ${season} · EP ${pad}</text>
  </g>

  <!-- Episode Title -->
  <g transform="translate(80, 565)">
    <text fill="#ffffff" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="44" font-weight="900" letter-spacing="-0.5">${ep.title}</text>
  </g>

  <!-- Arc / Synopsis Hint -->
  <g transform="translate(80, 620)">
    <text fill="#94a3b8" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="20" font-weight="500">${ep.aura}</text>
  </g>

  <!-- Ultra HD & Audio Tags -->
  <g transform="translate(1020, 600)">
    <rect width="180" height="32" rx="6" fill="rgba(0,0,0,0.7)" stroke="rgba(255,255,255,0.2)" stroke-width="1" />
    <text x="90" y="21" fill="#38bdf8" font-family="monospace" font-size="13" font-weight="700" text-anchor="middle">1080p · MULTI-AUDIO</text>
  </g>
</svg>`;
}

// Generate Season 1 SVGs
s1Episodes.forEach(ep => {
  const pad = String(ep.num).padStart(2, '0');
  const svgContent = generateSVG(ep, 1);
  const outPath = path.join(rootDir, 'public', 'thumbnails', 's1', `ep${pad}.svg`);
  fs.writeFileSync(outPath, svgContent, 'utf-8');
});
console.log('Season 1 episode SVGs created.');

// Generate Season 2 SVGs
s2Episodes.forEach(ep => {
  const pad = String(ep.num).padStart(2, '0');
  const svgContent = generateSVG(ep, 2);
  const outPath = path.join(rootDir, 'public', 'thumbnails', 's2', `ep${pad}.svg`);
  fs.writeFileSync(outPath, svgContent, 'utf-8');
});
console.log('Season 2 episode SVGs created.');
