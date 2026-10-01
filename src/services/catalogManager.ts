import { Anime } from '../types/anime';
import { ANIME_CATALOG } from '../data/anime';

const STORAGE_KEY_CUSTOM_ANIME = 'animehub_custom_anime_v1';
const CATALOG_UPDATE_EVENT = 'animehub:catalog_updated';

// In-memory registry for active blob URLs (if user loaded files locally in browser)
const inMemoryBlobRegistry = new Map<string, string>();

export function registerLocalVideoBlob(episodeId: string, blobUrl: string): void {
  inMemoryBlobRegistry.set(episodeId, blobUrl);
}

export function getLocalVideoBlob(episodeId: string): string | undefined {
  return inMemoryBlobRegistry.get(episodeId);
}

export function getCustomAnimeList(): Anime[] {
  if (typeof window === 'undefined') return [];
  try {
    const saved = localStorage.getItem(STORAGE_KEY_CUSTOM_ANIME);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export function saveCustomAnime(anime: Anime): void {
  if (typeof window === 'undefined') return;
  try {
    const list = getCustomAnimeList();
    const filtered = list.filter(a => a.id !== anime.id);
    const updated = [anime, ...filtered];
    localStorage.setItem(STORAGE_KEY_CUSTOM_ANIME, JSON.stringify(updated));
    window.dispatchEvent(new Event(CATALOG_UPDATE_EVENT));
  } catch (err) {
    console.error('Failed to save custom anime to localStorage:', err);
  }
}

export function removeCustomAnime(animeId: string): void {
  if (typeof window === 'undefined') return;
  try {
    const list = getCustomAnimeList();
    const updated = list.filter(a => a.id !== animeId);
    localStorage.setItem(STORAGE_KEY_CUSTOM_ANIME, JSON.stringify(updated));
    window.dispatchEvent(new Event(CATALOG_UPDATE_EVENT));
  } catch (err) {
    console.error('Failed to remove custom anime:', err);
  }
}

export function getAllAnime(): Anime[] {
  const customList = getCustomAnimeList();
  if (!customList.length) return ANIME_CATALOG;

  // Custom anime takes precedence if IDs collide
  const customIds = new Set(customList.map(a => a.id));
  const defaultRemaining = ANIME_CATALOG.filter(a => !customIds.has(a.id));
  return [...customList, ...defaultRemaining];
}

export function getAnimeByIdMerged(id: string): Anime | undefined {
  const all = getAllAnime();
  return all.find(a => a.id === id || a.slug === id);
}

export function exportCatalogJson(): string {
  const all = getAllAnime();
  return JSON.stringify(all, null, 2);
}
