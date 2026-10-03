import { Anime, Episode } from '../types/anime';
import { getActiveCatalog, saveActiveCatalog, resetCatalogToDefault } from '../data/anime';

const ADMIN_AUTH_KEY = 'animehub_admin_authenticated';
const ADMIN_PASSCODE_KEY = 'animehub_admin_passcode';
const DEFAULT_PASSCODE = 'admin123';

/**
 * Checks if admin session is currently active
 */
export function isAdminAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  return sessionStorage.getItem(ADMIN_AUTH_KEY) === 'true';
}

/**
 * Validates admin passcode and starts an authenticated session
 */
export function adminLogin(passcode: string): boolean {
  if (typeof window === 'undefined') return false;
  const storedPasscode = localStorage.getItem(ADMIN_PASSCODE_KEY) || DEFAULT_PASSCODE;
  if (passcode.trim() === storedPasscode.trim()) {
    sessionStorage.setItem(ADMIN_AUTH_KEY, 'true');
    window.dispatchEvent(new Event('animehub:admin_auth_changed'));
    return true;
  }
  return false;
}

/**
 * Logs out of admin mode
 */
export function adminLogout(): void {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(ADMIN_AUTH_KEY);
  window.dispatchEvent(new Event('animehub:admin_auth_changed'));
}

/**
 * Changes admin security passcode
 */
export function changeAdminPasscode(newPasscode: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(ADMIN_PASSCODE_KEY, newPasscode.trim());
}

/**
 * Adds or updates an entire anime entity in the catalog
 */
export function upsertAnime(anime: Anime): void {
  const current = getActiveCatalog();
  const existingIndex = current.findIndex(a => a.id === anime.id || a.slug === anime.slug);

  let updated: Anime[];
  if (existingIndex >= 0) {
    updated = [...current];
    updated[existingIndex] = {
      ...updated[existingIndex],
      ...anime,
      totalEpisodes: anime.episodes.length
    };
  } else {
    updated = [{ ...anime, totalEpisodes: anime.episodes.length }, ...current];
  }

  saveActiveCatalog(updated);
}

/**
 * Deletes an anime from the catalog
 */
export function deleteAnime(animeId: string): void {
  const current = getActiveCatalog();
  const filtered = current.filter(a => a.id !== animeId && a.slug !== animeId);
  saveActiveCatalog(filtered);
}

/**
 * Adds an episode to an anime
 */
export function addEpisodeToAnime(animeId: string, episode: Episode): boolean {
  const current = getActiveCatalog();
  const animeIndex = current.findIndex(a => a.id === animeId || a.slug === animeId);
  if (animeIndex === -1) return false;

  const anime = current[animeIndex];
  const episodes = [...anime.episodes, episode].sort((a, b) => a.number - b.number);

  const updatedAnime: Anime = {
    ...anime,
    episodes,
    totalEpisodes: episodes.length
  };

  const updatedCatalog = [...current];
  updatedCatalog[animeIndex] = updatedAnime;
  saveActiveCatalog(updatedCatalog);
  return true;
}

/**
 * Updates an episode inside an anime
 */
export function updateEpisodeInAnime(animeId: string, updatedEpisode: Episode): boolean {
  const current = getActiveCatalog();
  const animeIndex = current.findIndex(a => a.id === animeId || a.slug === animeId);
  if (animeIndex === -1) return false;

  const anime = current[animeIndex];
  const episodeIndex = anime.episodes.findIndex(e => e.id === updatedEpisode.id);
  if (episodeIndex === -1) return false;

  const episodes = [...anime.episodes];
  episodes[episodeIndex] = updatedEpisode;
  episodes.sort((a, b) => a.number - b.number);

  const updatedAnime: Anime = {
    ...anime,
    episodes
  };

  const updatedCatalog = [...current];
  updatedCatalog[animeIndex] = updatedAnime;
  saveActiveCatalog(updatedCatalog);
  return true;
}

/**
 * Deletes an episode from an anime
 */
export function deleteEpisodeFromAnime(animeId: string, episodeId: string): boolean {
  const current = getActiveCatalog();
  const animeIndex = current.findIndex(a => a.id === animeId || a.slug === animeId);
  if (animeIndex === -1) return false;

  const anime = current[animeIndex];
  const episodes = anime.episodes.filter(e => e.id !== episodeId);

  const updatedAnime: Anime = {
    ...anime,
    episodes,
    totalEpisodes: episodes.length
  };

  const updatedCatalog = [...current];
  updatedCatalog[animeIndex] = updatedAnime;
  saveActiveCatalog(updatedCatalog);
  return true;
}

/**
 * Batch generates sequential episode paths for an anime season:
 * e.g. /anime/{slug}/season{seasonNumber}/episode-01.mp4
 */
export function batchGenerateEpisodes(
  animeId: string,
  seasonNumber: number,
  episodeCount: number,
  titlePrefix: string = 'Episode'
): boolean {
  const current = getActiveCatalog();
  const animeIndex = current.findIndex(a => a.id === animeId || a.slug === animeId);
  if (animeIndex === -1) return false;

  const anime = current[animeIndex];
  const newEpisodes: Episode[] = [];

  for (let i = 1; i <= episodeCount; i++) {
    const pad = String(i).padStart(2, '0');
    newEpisodes.push({
      id: `${anime.id}-s${seasonNumber}-ep${pad}`,
      number: i,
      title: `${titlePrefix} ${i}`,
      synopsis: `Official Season ${seasonNumber} Episode ${i}.`,
      duration: 1440,
      durationFormatted: '24m',
      thumbnail: anime.bannerImage,
      videoUrl: `/anime/${anime.slug}/season${seasonNumber}/episode-${pad}.mp4`,
      subtitles: [
        {
          id: `sub-${anime.id}-s${seasonNumber}-${i}`,
          label: 'English (ESub)',
          language: 'en',
          url: '',
          default: true
        }
      ],
      audioTracks: [
        {
          id: `aud-${anime.id}-s${seasonNumber}-${i}`,
          label: anime.audioInfo || 'Original Audio',
          language: 'ja',
          url: '',
          default: true
        }
      ]
    });
  }

  const updatedAnime: Anime = {
    ...anime,
    season: `Season ${seasonNumber}`,
    episodes: newEpisodes,
    totalEpisodes: newEpisodes.length
  };

  const updatedCatalog = [...current];
  updatedCatalog[animeIndex] = updatedAnime;
  saveActiveCatalog(updatedCatalog);
  return true;
}

/**
 * Exports entire catalog as JSON string
 */
export function exportCatalogJson(): string {
  const catalog = getActiveCatalog();
  return JSON.stringify(catalog, null, 2);
}

/**
 * Imports a JSON catalog string with validation
 */
export function importCatalogJson(jsonString: string): { success: boolean; count?: number; error?: string } {
  try {
    const parsed = JSON.parse(jsonString);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return { success: false, error: 'JSON must be an array of anime objects.' };
    }
    // Verify first object has required fields
    if (!parsed[0].id || !parsed[0].title || !Array.isArray(parsed[0].episodes)) {
      return { success: false, error: 'Invalid anime object schema in JSON.' };
    }
    saveActiveCatalog(parsed);
    return { success: true, count: parsed.length };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Invalid JSON file';
    return { success: false, error: message };
  }
}

export { resetCatalogToDefault, upsertAnime as saveCustomAnime };
