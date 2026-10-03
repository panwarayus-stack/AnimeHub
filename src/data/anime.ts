import { Anime } from '../types/anime';
import { createSampleSubtitleDataUrl } from '../services/video';

// The exact 2 official posters provided by the user for Season 1 and Season 2
const soloLevelingPoster1 = 'https://sololeveling-anime.net/assets/img/top/kv_shun.png';
const soloLevelingPoster2 = 'https://sololeveling-anime.net/assets/img/top/kv_kage.png';

const jjkBanner = 'https://jujutsukaisen.jp/news/images/20231031_01_01.jpg';
const jjkPoster = 'https://media.kitsu.io/anime/poster_images/16084/large.jpg';

const demonSlayerBanner = 'https://media.kitsu.io/anime/cover_images/16624/large.jpg';
const demonSlayerPoster = 'https://media.kitsu.io/anime/poster_images/16624/large.jpg';

const aotBanner = 'https://media.kitsu.io/anime/cover_images/15865/large.jpg';
const aotPoster = 'https://media.kitsu.io/anime/poster_images/15865/large.jpg';

const frierenBanner = 'https://media.kitsu.io/anime/cover_images/17585/large.jpg';
const frierenPoster = 'https://media.kitsu.io/anime/poster_images/17585/large.jpg';

export const INITIAL_ANIME_CATALOG: Anime[] = [
  {
    id: 'solo-leveling-s01',
    slug: 'solo-leveling-season-1',
    title: 'Solo Leveling (Season 1)',
    japaneseTitle: '俺だけレベルアップな件 (나 혼자만 레벨업)',
    synopsis: 'Known as the "Weakest Hunter of All Mankind", E-rank hunter Sung Jinwoo is brutally slaughtered along with his raid party in a double dungeon. Miraculously surviving, he awakens to a mysterious game-like "System" quest window only visible to him, granting him the unique ability to level up, acquire skills, and ascend beyond mortal limitations.',
    bannerImage: soloLevelingPoster1,
    posterImage: soloLevelingPoster1,
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
      return {
        id: `sl-s1-ep${pad}`,
        number: num,
        title: `Episode ${num}`,
        synopsis: `Sung Jinwoo fights to survive, level up and unlock the power of the Shadow Monarch in Season 1, Episode ${num}.`,
        duration: 1440,
        durationFormatted: '24m',
        thumbnail: soloLevelingPoster1, // Constant thumbnail for all Season 1 episodes using user's first image
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
    bannerImage: soloLevelingPoster2,
    posterImage: soloLevelingPoster2,
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
      return {
        id: `sl-s2-ep${pad}`,
        number: num,
        title: `Episode ${num}`,
        synopsis: `The hunter ascends further as Monarchs gather in Season 2, Episode ${num}.`,
        duration: 1440,
        durationFormatted: '24m',
        thumbnail: soloLevelingPoster2, // Constant thumbnail for all Season 2 episodes using user's second image
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
    episodes: Array.from({ length: 23 }, (_, i) => {
      const num = i + 1;
      return {
        id: `jjk-ep-${String(num).padStart(2, '0')}`,
        number: num,
        title: `Episode ${num}`,
        synopsis: 'Intense action and dark secrets unfold in Shibuya.',
        duration: 1440,
        durationFormatted: '24m',
        thumbnail: jjkPoster,
        videoUrl: `/anime/jujutsu-kaisen/season2/episode-${String(num).padStart(2, '0')}.mp4`,
        videoPath: `anime/jujutsu-kaisen/season2/episode-${String(num).padStart(2, '0')}.mp4`,
        subtitles: [
          { 
            id: `sub-jjk-${num}`, 
            label: 'English', 
            language: 'en', 
            url: createSampleSubtitleDataUrl('English', `JJK - Ep ${num}`), 
            src: createSampleSubtitleDataUrl('English', `JJK - Ep ${num}`), 
            default: true 
          }
        ]
      };
    })
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
    episodes: Array.from({ length: 11 }, (_, i) => {
      const num = i + 1;
      return {
        id: `ds-ep-${String(num).padStart(2, '0')}`,
        number: num,
        title: `Episode ${num}`,
        synopsis: 'The battle in the Entertainment District intensifies.',
        duration: 2700,
        durationFormatted: '45m',
        thumbnail: demonSlayerPoster,
        videoUrl: `/anime/demon-slayer/season3/episode-${String(num).padStart(2, '0')}.mp4`,
        videoPath: `anime/demon-slayer/season3/episode-${String(num).padStart(2, '0')}.mp4`,
        subtitles: [
          { 
            id: `sub-ds-${num}`, 
            label: 'English', 
            language: 'en', 
            url: createSampleSubtitleDataUrl('English', `Demon Slayer - Ep ${num}`), 
            src: createSampleSubtitleDataUrl('English', `Demon Slayer - Ep ${num}`), 
            default: true 
          }
        ]
      };
    })
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
    episodes: Array.from({ length: 28 }, (_, i) => {
      const num = i + 1;
      return {
        id: `aot-ep-${String(num).padStart(2, '0')}`,
        number: num,
        title: `Episode ${num}`,
        synopsis: 'The final battle for humanity begins.',
        duration: 1440,
        durationFormatted: '24m',
        thumbnail: aotPoster,
        videoUrl: `/anime/attack-on-titan/season4/episode-${String(num).padStart(2, '0')}.mp4`,
        videoPath: `anime/attack-on-titan/season4/episode-${String(num).padStart(2, '0')}.mp4`,
        subtitles: [
          { 
            id: `sub-aot-${num}`, 
            label: 'English', 
            language: 'en', 
            url: createSampleSubtitleDataUrl('English', `AoT - Ep ${num}`), 
            src: createSampleSubtitleDataUrl('English', `AoT - Ep ${num}`), 
            default: true 
          }
        ]
      };
    })
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
    episodes: Array.from({ length: 28 }, (_, i) => {
      const num = i + 1;
      return {
        id: `fr-ep-${String(num).padStart(2, '0')}`,
        number: num,
        title: `Episode ${num}`,
        synopsis: 'A journey beyond the end.',
        duration: 1440,
        durationFormatted: '24m',
        thumbnail: frierenPoster,
        videoUrl: `/anime/frieren/season1/episode-${String(num).padStart(2, '0')}.mp4`,
        videoPath: `anime/frieren/season1/episode-${String(num).padStart(2, '0')}.mp4`,
        subtitles: [
          { 
            id: `sub-fr-${num}`, 
            label: 'English', 
            language: 'en', 
            url: createSampleSubtitleDataUrl('English', 'Frieren - Ep 1'), 
            src: createSampleSubtitleDataUrl('English', 'Frieren - Ep 1'), 
            default: true 
          }
        ]
      };
    })
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
