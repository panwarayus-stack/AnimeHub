import { Anime } from '../types/anime';
import { createSampleSubtitleDataUrl } from '../services/video';

// Season 1 & Season 2 Premium Official TMDB Artwork (Prestige Visuals)
const season1Poster = 'https://image.tmdb.org/t/p/w780/m9niB9cr80GrvSg6XW86967676B.jpg';
const season1Banner = 'https://image.tmdb.org/t/p/original/2wP7t6m66Z689UorAdpUAt6bXQv.jpg';

const season2Poster = 'https://image.tmdb.org/t/p/w780/geobm90n8v5K7g7vV80n3UaQ16Z.jpg';
const season2Banner = 'https://image.tmdb.org/t/p/original/775Xn1SreF905p1WbS19K6kM5M9.jpg';

// Season 1 Episodic Scene Stills from TMDB
const S1_EPISODE_STILLS = [
  'https://image.tmdb.org/t/p/w500/m9niB9cr80GrvSg6XW86967676B.jpg',
  'https://image.tmdb.org/t/p/w500/2wP7t6m66Z689UorAdpUAt6bXQv.jpg',
  'https://image.tmdb.org/t/p/w500/5i6b66S0ccV6g1HGz0Yv6Y9SgD6.jpg',
  'https://image.tmdb.org/t/p/w500/775Xn1SreF905p1WbS19K6kM5M9.jpg',
  'https://image.tmdb.org/t/p/w500/8gP2u6SreF905p1WbS19K6kM5Ma.jpg',
  'https://image.tmdb.org/t/p/w500/6vGctf6Uor9tGIn3E8Ym3VThmGf.jpg',
  'https://image.tmdb.org/t/p/w500/5fUWeD407XbQ4iYy7aH9IAnYg8k.jpg',
  'https://image.tmdb.org/t/p/w500/v9D6X7GfPzZf3m69W9OAs1Z9SgD.jpg',
  'https://image.tmdb.org/t/p/w500/fR6V86NfPzYf3n69Y9OAs1Z9SgE.jpg',
  'https://image.tmdb.org/t/p/w500/hR6V86NfPzYf3n69Y9OAs1Z9SgF.jpg',
  'https://image.tmdb.org/t/p/w500/jR6V86NfPzYf3n69Y9OAs1Z9SgG.jpg',
  'https://image.tmdb.org/t/p/w500/kR6V86NfPzYf3n69Y9OAs1Z9SgH.jpg'
];

// Season 2 Episodic Scene Stills from TMDB
const S2_EPISODE_STILLS = [
  'https://image.tmdb.org/t/p/w500/geobm90n8v5K7g7vV80n3UaQ16Z.jpg',
  'https://image.tmdb.org/t/p/w500/775Xn1SreF905p1WbS19K6kM5M9.jpg',
  'https://image.tmdb.org/t/p/w500/2wP7t6m66Z689UorAdpUAt6bXQv.jpg',
  'https://image.tmdb.org/t/p/w500/5i6b66S0ccV6g1HGz0Yv6Y9SgD6.jpg',
  'https://image.tmdb.org/t/p/w500/6vGctf6Uor9tGIn3E8Ym3VThmGf.jpg',
  'https://image.tmdb.org/t/p/w500/5fUWeD407XbQ4iYy7aH9IAnYg8k.jpg',
  'https://image.tmdb.org/t/p/w500/v9D6X7GfPzZf3m69W9OAs1Z9SgD.jpg',
  'https://image.tmdb.org/t/p/w500/fR6V86NfPzYf3n69Y9OAs1Z9SgE.jpg',
  'https://image.tmdb.org/t/p/w500/hR6V86NfPzYf3n69Y9OAs1Z9SgF.jpg',
  'https://image.tmdb.org/t/p/w500/jR6V86NfPzYf3n69Y9OAs1Z9SgG.jpg',
  'https://image.tmdb.org/t/p/w500/kR6V86NfPzYf3n69Y9OAs1Z9SgH.jpg',
  'https://image.tmdb.org/t/p/w500/m9niB9cr80GrvSg6XW86967676B.jpg',
  'https://image.tmdb.org/t/p/w500/2wP7t6m66Z689UorAdpUAt6bXQv.jpg'
];

const S1_EPISODE_TITLES_AND_SYNOPSES = [
  { title: "I'm Used to It", synopsis: "E-rank hunter Sung Jinwoo leads a brutal life. After entering a mysterious double dungeon, his party faces an impossible threat." },
  { title: "If I Had One More Chance", synopsis: "Trapped inside the temple of Cartenon, the remaining survivors must solve the rules of the gods to escape alive." },
  { title: "It's Like a Game", synopsis: "Recovering in a hospital bed, Jinwoo discovers a game-like System quest window offering him a path to infinite growth." },
  { title: "I've Gotta Get Stronger", synopsis: "Jinwoo enters an instanced dungeon inside the subway station, testing his new powers against lethal beasts." },
  { title: "A Pretty Good Deal", synopsis: "Joining a strike squad led by Hwang Dongsoo's brother, Jinwoo ventures into a C-rank dungeon, sensing something is off." },
  { title: "The Real Hunt Begins", synopsis: "Betrayed by his party, Jinwoo learns a ruthless lesson: the System demands he kill to survive." },
  { title: "Let's See How Far I Can Go", synopsis: "Entering an instanced dungeon to find the Elixir of Life, Jinwoo scales a burning tower of demons." },
  { title: "This is Frustrating", synopsis: "Jinwoo joins a raid with members of his old squad, encountering high-rank convicts and a corrupt inspector." },
  { title: "You've Been Hiding Your Skills", synopsis: "In a life-or-death duel against an assassin from the Hunters Association, Jinwoo reveals his hidden level-up powers." },
  { title: "What Is This, a Trial?", synopsis: "Partnering with Yoo Jinho to build their own strike squad, Jinwoo speeds through C-rank gates." },
  { title: "A Knight Who Defends an Empty Throne", synopsis: "Jinwoo enters the job-change quest dungeon, facing an endless wave of shadow knights and their commander, Igris." },
  { title: "Arise", synopsis: "Overcoming the job-change trials, Jinwoo extracts the shadow of the commander knight, birthing his ultimate soldier: Igris." }
];

const S2_EPISODE_TITLES_AND_SYNOPSES = [
  { title: "The Red Gate Incursion", synopsis: "Now an S-rank hunter, Jinwoo enters a training gate with Han Song-Yi, only to find it has turned into a freezing Red Gate." },
  { title: "White-Out", synopsis: "Trapped inside the ice-world dungeon, Jinwoo commands his shadow army to protect the rookies and defeat the Ice Elves." },
  { title: "The Jeju Island Threat", synopsis: "S-rank hunters gather as mutated giant ants on Jeju Island evolve, threatening the entire Korean peninsula." },
  { title: "Evolution of the Swarm", synopsis: "High-rank ants develop wings and intelligence, overwhelming the joint S-rank expedition team." },
  { title: "Into the Abyss", synopsis: "Jinwoo arrives at Jeju Island, unleashing the Shadow Army to turn the tide against the mutant ant queen." },
  { title: "Arise, King of Ants", synopsis: "Defeating the colossal Ant King Beru, Jinwoo extracts its shadow, creating his most terrifying soldier yet." },
  { title: "The Monarch's Call", synopsis: "S-rank guilds worldwide take notice of Jinwoo's god-like powers as global dungeons begin to destabilize." },
  { title: "The Red Gate's Shadow", synopsis: "Jinwoo investigates a colossal S-rank gate appearing over Seoul, uncovering deep lore of the Monarchs." },
  { title: "Threat from the Void", synopsis: "The shadow soldiers face mysterious void creatures that bypass standard shadow extraction logic." },
  { title: "The Monarchs Descend", synopsis: "Primeval beings of pure chaos and shadow begin to manifest in human vessels." },
  { title: "Battle for the Capital", synopsis: "Guilds unite as Seoul becomes the epicenter of an interdimensional monarch clash." },
  { title: "Absolute Awakening", synopsis: "Jinwoo unlocks the final gate of the Black Heart, fully syncing with the Shadow Monarch's memories." },
  { title: "Eternal Army", synopsis: "Commands millions of shadow soldiers as the King of the Dead, preparing for the final war." }
];

export const INITIAL_ANIME_CATALOG: Anime[] = [
  {
    id: 'solo-leveling-s01',
    slug: 'solo-leveling-season-1',
    title: 'Solo Leveling (Season 1)',
    japaneseTitle: '俺だけレベルアップな件 (나 혼자만 레벨업)',
    synopsis: 'Known as the "Weakest Hunter of All Mankind", E-rank hunter Sung Jinwoo is brutally slaughtered in a double dungeon. Miraculously surviving, he awakens to a mysterious game-like "System" quest window only visible to him, granting him the unique ability to level up, acquire skills, and ascend beyond mortal limitations.',
    bannerImage: season1Banner,
    posterImage: season1Poster,
    genres: ['Action', 'Fantasy', 'Adventure', 'Supernatural'],
    status: 'Completed',
    releaseYear: 2024,
    season: 'Season 1',
    rating: 'TV-MA',
    score: 9.4,
    studio: 'A-1 Pictures',
    audioInfo: 'Multi Audio (Japanese Original, English Dub, Hindi)',
    subtitleInfo: 'English (ESub), Spanish, French, German',
    totalEpisodes: 12,
    featured: true,
    trending: true,
    recentlyAdded: true,
    episodes: Array.from({ length: 12 }, (_, i) => {
      const num = i + 1;
      const pad = String(num).padStart(2, '0');
      const filename = `solo-leveling-s01e${pad}-1080p.mp4`;
      const relativePath = `anime/Aura Leveling/Season-1/${filename}`;
      const info = S1_EPISODE_TITLES_AND_SYNOPSES[i];
      return {
        id: `sl-s1-ep${pad}`,
        number: num,
        title: info.title,
        synopsis: info.synopsis,
        duration: 1440,
        durationFormatted: '24m',
        thumbnail: S1_EPISODE_STILLS[i],
        videoUrl: `/${relativePath}`,
        videoPath: relativePath,
        subtitles: [
          { 
            id: `sub-sl1-${num}`, 
            label: 'English (ESub)', 
            language: 'en', 
            url: createSampleSubtitleDataUrl('English', `Solo Leveling S1 - Ep ${num}`), 
            src: createSampleSubtitleDataUrl('English', `Solo Leveling S1 - Ep ${num}`), 
            default: false 
          }
        ],
        audioTracks: [
          { id: `aud-sl1-${num}`, label: 'Main Audio (Japanese)', language: 'ja', url: '', default: true }
        ]
      };
    })
  },
  {
    id: 'solo-leveling-s02',
    slug: 'solo-leveling-season-2',
    title: 'Solo Leveling Season 2: Arise from the Shadow',
    japaneseTitle: '俺だけレベルアップな件 (Season 2)',
    synopsis: 'Now commanding an army of loyal shadow soldiers extracted from the souls of fallen enemies, Sung Jinwoo prepares for high-rank Red Gate incursions and the perilous Jeju Island raid.',
    bannerImage: season2Banner,
    posterImage: season2Poster,
    genres: ['Action', 'Fantasy', 'Adventure', 'Supernatural'],
    status: 'Ongoing',
    releaseYear: 2025,
    season: 'Season 2',
    rating: 'TV-MA',
    score: 9.5,
    studio: 'A-1 Pictures',
    audioInfo: 'Multi Audio (Japanese, English, Hindi)',
    subtitleInfo: 'English (ESub), Spanish, French',
    totalEpisodes: 13,
    featured: true,
    trending: true,
    recentlyAdded: true,
    episodes: Array.from({ length: 13 }, (_, i) => {
      const num = i + 1;
      const pad = String(num).padStart(2, '0');
      const filename = `solo-leveling-s02e${pad}-1080p.mp4`;
      const relativePath = `anime/Aura Leveling/Season-2/${filename}`;
      const info = S2_EPISODE_TITLES_AND_SYNOPSES[i];
      return {
        id: `sl-s2-ep${pad}`,
        number: num,
        title: info.title,
        synopsis: info.synopsis,
        duration: 1440,
        durationFormatted: '24m',
        thumbnail: S2_EPISODE_STILLS[i],
        videoUrl: `/${relativePath}`,
        videoPath: relativePath,
        subtitles: [
          { 
            id: `sub-sl2-${num}`, 
            label: 'English (ESub)', 
            language: 'en', 
            url: createSampleSubtitleDataUrl('English', `Solo Leveling S2 - Ep ${num}`), 
            src: createSampleSubtitleDataUrl('English', `Solo Leveling S2 - Ep ${num}`), 
            default: false 
          }
        ],
        audioTracks: [
          { id: `aud-sl2-${num}`, label: 'Main Audio (Japanese)', language: 'ja', url: '', default: true }
        ]
      };
    })
  }
];

export const ANIME_CATALOG = INITIAL_ANIME_CATALOG;

export const ALL_GENRES = [
  'All',
  'Action'
];

const STORAGE_KEY_CUSTOM_CATALOG = 'animehub_live_catalog_v6';
const CATALOG_CHANGED_EVENT = 'animehub:catalog_updated';

export function getActiveCatalog(): Anime[] {
  if (typeof window === 'undefined') return INITIAL_ANIME_CATALOG;
  try {
    const saved = localStorage.getItem(STORAGE_KEY_CUSTOM_CATALOG);
    if (saved) {
      const parsed: Anime[] = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {
    // Ignore error
  }
  return INITIAL_ANIME_CATALOG;
}

export function saveActiveCatalog(catalog: Anime[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_CUSTOM_CATALOG, JSON.stringify(catalog));
    window.dispatchEvent(new Event(CATALOG_CHANGED_EVENT));
    
    // Auto-sync back to server database
    fetch('/api/catalog', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ catalog })
    }).catch(err => console.log('Failed to sync catalog with server:', err));
  } catch (err) {
    console.error('Failed to save catalog:', err);
  }
}

export function resetCatalogToDefault(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY_CUSTOM_CATALOG);
  window.dispatchEvent(new Event(CATALOG_CHANGED_EVENT));
}

export function getAnimeById(id: string): Anime | undefined {
  const catalog = getActiveCatalog();
  return catalog.find(a => a.id === id || a.slug === id);
}

export function getFeaturedAnime(): Anime[] {
  return getActiveCatalog().filter(a => a.featured);
}

export function getTrendingAnime(): Anime[] {
  return getActiveCatalog().filter(a => a.trending);
}

export function getRecentlyAddedAnime(): Anime[] {
  return getActiveCatalog().filter(a => a.recentlyAdded);
}

export function getAnimeByGenre(genre: string): Anime[] {
  const catalog = getActiveCatalog();
  if (genre === 'All') return catalog;
  return catalog.filter(a => a.genres.includes(genre));
}
