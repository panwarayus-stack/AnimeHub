import { Anime } from '../types/anime';
import { createSampleSubtitleDataUrl } from '../services/video';

// Real high-definition official anime visual assets from secure CDNs
const soloLevelingBanner = 'https://sololeveling-anime.net/assets/img/top/visual3.jpg';
const soloLevelingBannerS2 = 'https://images.squarespace-cdn.com/content/v1/5fe4ca91702f3542289658ec/ec543ba6-e630-4e00-bf64-16a75908b981/Solo+Leveling+Season+2+Arise+from+the+Shadow+Key+Visual.jpg';
const soloLevelingPoster = 'https://sololeveling-anime.net/assets/img/top/kv_shun.png';

const jjkBanner = 'https://jujutsukaisen.jp/news/images/20231031_01_01.jpg';
const jjkPoster = 'https://media.kitsu.io/anime/poster_images/16084/large.jpg';

const demonSlayerBanner = 'https://media.kitsu.io/anime/cover_images/16624/large.jpg';
const demonSlayerPoster = 'https://media.kitsu.io/anime/poster_images/16624/large.jpg';

const aotBanner = 'https://media.kitsu.io/anime/cover_images/15865/large.jpg';
const aotPoster = 'https://media.kitsu.io/anime/poster_images/15865/large.jpg';

const frierenBanner = 'https://media.kitsu.io/anime/cover_images/17585/large.jpg';
const frierenPoster = 'https://media.kitsu.io/anime/poster_images/17585/large.jpg';

// High-resolution direct landscape-oriented scene backdrops from the official series episodes (Season 1 and Season 2)
const S1_THUMBNAILS = [
  '311231652', // Ep 1: The Double Dungeon altar scene
  '311231654', // Ep 2: The Statue of God with glowing red eyes
  '311231656', // Ep 3: Jinwoo waking up in the hospital
  '311231658', // Ep 4: Fighting the blue venom-fanged Kasaka serpent
  '311231660', // Ep 5: Entering a C-Rank dungeon
  '311231662', // Ep 6: The Golem boss fight
  '311231664', // Ep 7: The Demon Castle elixir quest
  '311231666', // Ep 8: The Hunter's Guild meeting Cha Hae-in
  '311231668', // Ep 9: Survivors reunion in D-Rank gate
  '311231670', // Ep 10: Strike team clash with Kang Taeshik
  '311231672', // Ep 11: The Job Change infinite castle quest
  '311231674'  // Ep 12: Commanding first Shadow Soldiers: "Arise!"
];

const S2_THUMBNAILS = [
  '311231676', // Ep 1: Shadow Army marches
  '311231678', // Ep 2: Red Gate cold icy landscape
  '311231680', // Ep 3: Fighting the Ice Elves
  '311231682', // Ep 4: Demon Castle upper floors
  '311231684', // Ep 5: Vulcan boss encounter
  '311231686', // Ep 6: Esil Radiru meeting
  '311231688', // Ep 7: S-Rank hunters gathering
  '311231690', // Ep 8: Jeju Island mutated ants preview
  '311231692', // Ep 9: Helicopter flight to Jeju
  '311231694', // Ep 10: Ant Queen raid
  '311231696', // Ep 11: Beru the Ant King appears
  '311231698'  // Ep 12: Extracting Beru: "Arise!"
];

export const INITIAL_ANIME_CATALOG: Anime[] = [
  {
    id: 'solo-leveling-s01',
    slug: 'solo-leveling-season-1',
    title: 'Solo Leveling (Season 1)',
    japaneseTitle: '俺だけレベルアップな件 (나 혼자만 레벨업)',
    synopsis: 'Known as the "Weakest Hunter of All Mankind", E-rank hunter Sung Jinwoo is brutally slaughtered along with his raid party in a double dungeon. Miraculously surviving, he awakens to a mysterious game-like "System" quest window only visible to him, granting him the unique ability to level up, acquire skills, and ascend beyond mortal limitations.',
    bannerImage: soloLevelingBanner,
    posterImage: soloLevelingPoster,
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
      const filename = `[Toonworld4all] Solo Leveling S01E${pad} 1080p HEVC 10bit WEB-DL Multi Audio ESub.mp4`;
      const relativePath = `anime/Aura Leveling/Season-1/${filename}`;
      const thumbId = S1_THUMBNAILS[i] || '311231652';
      return {
        id: `sl-s1-ep${pad}`,
        number: num,
        title: `Episode ${num}`,
        synopsis: `Sung Jinwoo fights to survive, level up and unlock the power of the Shadow Monarch in Season 1, Episode ${num}.`,
        duration: 1440,
        durationFormatted: '24m',
        thumbnail: `https://images.justwatch.com/backdrop/${thumbId}/s640/solo-leveling.webp`,
        videoUrl: `/${relativePath}`,
        videoPath: relativePath,
        subtitles: [
          { 
            id: `sub-sl1-${num}`, 
            label: 'English (ESub)', 
            language: 'en', 
            url: createSampleSubtitleDataUrl('English', `Solo Leveling S1 - Ep ${num}`), 
            src: createSampleSubtitleDataUrl('English', `Solo Leveling S1 - Ep ${num}`), 
            default: true 
          }
        ],
        audioTracks: [
          { id: `aud-sl1-${num}`, label: 'Multi Audio (JP / EN / HI)', language: 'multi', url: '', default: true }
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
    bannerImage: soloLevelingBannerS2,
    posterImage: soloLevelingPoster,
    genres: ['Action', 'Fantasy', 'Adventure', 'Supernatural'],
    status: 'Ongoing',
    releaseYear: 2025,
    season: 'Season 2',
    rating: 'TV-MA',
    score: 9.5,
    studio: 'A-1 Pictures',
    audioInfo: 'Multi Audio (Japanese, English, Hindi)',
    subtitleInfo: 'English (ESub), Spanish, French',
    totalEpisodes: 12,
    featured: true,
    trending: true,
    recentlyAdded: true,
    episodes: Array.from({ length: 12 }, (_, i) => {
      const num = i + 1;
      const pad = String(num).padStart(2, '0');
      const filename = `[Toonworld4all] Solo Leveling S02E${pad} 1080p x265 10bit WEB-DL Multi Audio ESub.mp4`;
      const relativePath = `anime/Aura Leveling/Season-2/${filename}`;
      const thumbId = S2_THUMBNAILS[i] || '311231676';
      return {
        id: `sl-s2-ep${pad}`,
        number: num,
        title: `Episode ${num}`,
        synopsis: `The hunter ascends further as Monarchs gather in Season 2, Episode ${num}.`,
        duration: 1440,
        durationFormatted: '24m',
        thumbnail: `https://images.justwatch.com/backdrop/${thumbId}/s640/solo-leveling.webp`,
        videoUrl: `/${relativePath}`,
        videoPath: relativePath,
        subtitles: [
          { 
            id: `sub-sl2-${num}`, 
            label: 'English (ESub)', 
            language: 'en', 
            url: createSampleSubtitleDataUrl('English', `Solo Leveling S2 - Ep ${num}`), 
            src: createSampleSubtitleDataUrl('English', `Solo Leveling S2 - Ep ${num}`), 
            default: true 
          }
        ]
      };
    })
  },
  {
    id: 'jujutsu-kaisen-s02',
    slug: 'jujutsu-kaisen',
    title: 'Jujutsu Kaisen: Shibuya Incident',
    japaneseTitle: '呪術廻戦',
    synopsis: 'On October 31st, 2019, a mysterious curtain descends over Shibuya Station during Halloween, trapping tens of thousands of civilians. Satoru Gojo enters the underground alone to confront Pseudo-Geto and the disaster curses.',
    bannerImage: jjkBanner,
    posterImage: jjkPoster,
    genres: ['Action', 'Supernatural', 'Dark Fantasy', 'Mystery'],
    status: 'Completed',
    releaseYear: 2024,
    season: 'Season 2',
    rating: 'TV-MA',
    score: 9.2,
    studio: 'MAPPA',
    audioInfo: 'Dual Audio (Japanese, English Dub)',
    subtitleInfo: 'English (Full), Spanish, French',
    totalEpisodes: 23,
    featured: true,
    trending: true,
    recentlyAdded: false,
    episodes: [
      {
        id: 'jjk-ep-01',
        number: 1,
        title: 'Hidden Inventory',
        synopsis: 'In spring 2006, second-year Jujutsu High students Satoru Gojo and Suguru Geto receive a mission to protect the Star Plasma Vessel.',
        duration: 1440,
        durationFormatted: '24m',
        thumbnail: jjkBanner,
        videoUrl: '/anime/jujutsu-kaisen/season2/episode-01.mp4',
        videoPath: 'anime/jujutsu-kaisen/season2/episode-01.mp4',
        subtitles: [
          { 
            id: 'sub-jjk-1', 
            label: 'English', 
            language: 'en', 
            url: createSampleSubtitleDataUrl('English', 'Jujutsu Kaisen - Ep 1'), 
            src: createSampleSubtitleDataUrl('English', 'Jujutsu Kaisen - Ep 1'), 
            default: true 
          }
        ]
      }
    ]
  },
  {
    id: 'demon-slayer-entertainment-district',
    slug: 'demon-slayer',
    title: 'Demon Slayer: Entertainment District Arc',
    japaneseTitle: '鬼滅の刃 遊郭編',
    synopsis: 'Tanjiro, Zenitsu, and Inosuke accompany the Sound Hashira Tengen Uzui into the Yoshiwara entertainment district to investigate the disappearance of his kunoichi wives.',
    bannerImage: demonSlayerBanner,
    posterImage: demonSlayerPoster,
    genres: ['Action', 'Fantasy', 'Historical', 'Supernatural'],
    status: 'Completed',
    releaseYear: 2024,
    season: 'Season 3',
    rating: 'TV-14',
    score: 9.0,
    studio: 'Ufotable',
    audioInfo: 'Dual Audio (Japanese, English Dub)',
    subtitleInfo: 'English, Spanish, German',
    totalEpisodes: 11,
    featured: true,
    trending: true,
    recentlyAdded: false,
    episodes: [
      {
        id: 'ds-ep-01',
        number: 1,
        title: 'Sound Hashira Tengen Uzui',
        synopsis: 'Tanjiro and his comrades return from the Mugen Train mission and volunteer to assist Sound Hashira Tengen Uzui on a perilous infiltration.',
        duration: 2700,
        durationFormatted: '45m',
        thumbnail: demonSlayerBanner,
        videoUrl: '/anime/demon-slayer/season3/episode-01.mp4',
        videoPath: 'anime/demon-slayer/season3/episode-01.mp4',
        subtitles: [
          { 
            id: 'sub-ds-1', 
            label: 'English', 
            language: 'en', 
            url: createSampleSubtitleDataUrl('English', 'Demon Slayer - Ep 1'), 
            src: createSampleSubtitleDataUrl('English', 'Demon Slayer - Ep 1'), 
            default: true 
          }
        ]
      }
    ]
  },
  {
    id: 'attack-on-titan-the-final-season',
    slug: 'attack-on-titan',
    title: 'Attack on Titan: The Final Season',
    japaneseTitle: '進撃の巨人 The Final Season',
    synopsis: 'Four years after the Scouts reached the sea, the true nature of the world beyond the walls is revealed. Eren Yeager launches an attack on Marley, setting into motion the Rumbling.',
    bannerImage: aotBanner,
    posterImage: aotPoster,
    genres: ['Action', 'Drama', 'Military', 'Mystery'],
    status: 'Completed',
    releaseYear: 2023,
    season: 'The Final Season',
    rating: 'TV-MA',
    score: 9.4,
    studio: 'MAPPA / Wit Studio',
    audioInfo: 'Dual Audio (Japanese, English Dub)',
    subtitleInfo: 'English, Spanish, French, Italian',
    totalEpisodes: 28,
    featured: false,
    trending: true,
    recentlyAdded: false,
    episodes: [
      {
        id: 'aot-ep-01',
        number: 1,
        title: 'The Other Side of the Ocean',
        synopsis: 'As Marley battles the Mid-East Allied Forces to end a four-year war, the military unleashes its Eldian titan warrior unit.',
        duration: 1440,
        durationFormatted: '24m',
        thumbnail: aotBanner,
        videoUrl: '/anime/attack-on-titan/season4/episode-01.mp4',
        videoPath: 'anime/attack-on-titan/season4/episode-01.mp4',
        subtitles: [
          { 
            id: 'sub-aot-1', 
            label: 'English', 
            language: 'en', 
            url: createSampleSubtitleDataUrl('English', 'Attack on Titan - Ep 1'), 
            src: createSampleSubtitleDataUrl('English', 'Attack on Titan - Ep 1'), 
            default: true 
          }
        ]
      }
    ]
  },
  {
    id: 'frieren-beyond-journeys-end',
    slug: 'frieren',
    title: "Frieren: Beyond Journey's End",
    japaneseTitle: '葬送のフリーレン',
    synopsis: 'After a 10-year quest, the elven mage Frieren and her heroic companions defeated the Demon King. Fifty years later, she watches her mortal comrade pass away from old age.',
    bannerImage: frierenBanner,
    posterImage: frierenPoster,
    genres: ['Fantasy', 'Adventure', 'Slice of Life', 'Drama'],
    status: 'Completed',
    releaseYear: 2024,
    season: 'Season 1',
    rating: 'PG-13',
    score: 9.3,
    studio: 'Madhouse',
    audioInfo: 'Dual Audio (Japanese, English Dub)',
    subtitleInfo: 'English, Spanish, French',
    totalEpisodes: 28,
    featured: false,
    trending: true,
    recentlyAdded: true,
    episodes: [
      {
        id: 'fr-ep-01',
        number: 1,
        title: "The Journey's End",
        synopsis: 'Frieren and the hero party celebrate the victory banquet in the royal capital, viewing the Era Meteor Shower that occurs once every half-century.',
        duration: 1440,
        durationFormatted: '24m',
        thumbnail: frierenBanner,
        videoUrl: '/anime/frieren/season1/episode-01.mp4',
        videoPath: 'anime/frieren/season1/episode-01.mp4',
        subtitles: [
          { 
            id: 'sub-fr-1', 
            label: 'English', 
            language: 'en', 
            url: createSampleSubtitleDataUrl('English', 'Frieren - Ep 1'), 
            src: createSampleSubtitleDataUrl('English', 'Frieren - Ep 1'), 
            default: true 
          }
        ]
      }
    ]
  }
];

export const ANIME_CATALOG = INITIAL_ANIME_CATALOG;

export const ALL_GENRES = [
  'All',
  'Action',
  'Fantasy',
  'Adventure',
  'Supernatural',
  'Sci-Fi',
  'Dark Fantasy',
  'Slice of Life',
  'Drama',
  'Mystery',
  'Military',
  'Historical'
];

const STORAGE_KEY_CUSTOM_CATALOG = 'animehub_live_catalog_v3';
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
