import { Anime } from '../types/anime';
import { createSampleSubtitleDataUrl } from '../services/video';

// The exact 2 official posters provided by the user for Season 1 and Season 2
const soloLevelingPoster1 = 'https://sololeveling-anime.net/assets/img/top/kv_shun.png';
const soloLevelingPoster2 = 'https://sololeveling-anime.net/assets/img/top/kv_kage.png';

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
    totalEpisodes: 13,
    featured: true,
    trending: true,
    recentlyAdded: true,
    episodes: Array.from({ length: 13 }, (_, i) => {
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

const STORAGE_KEY_CUSTOM_CATALOG = 'animehub_live_catalog_v4';
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
