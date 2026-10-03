/**
 * Central Media & Direct Streaming Service for AnimeHub
 *
 * Supports:
 * - Direct local media streaming (/videos/... or /anime/...)
 * - Direct cloud storage / custom media server streaming
 * - Google Drive stream resolution
 * - Custom media server base URL
 */

// Default media base URL from environment or Hugging Face anime dataset repository
export const MEDIA_BASE_URL = (import.meta.env.VITE_MEDIA_BASE_URL as string) || 'https://huggingface.co/datasets/mrweirdoo/anime-library/resolve/main';
export const VIDEO_BASE_URL = MEDIA_BASE_URL;

export function getVideoUrl(videoPath: string): string {
  const base = import.meta.env.VITE_VIDEO_BASE_URL;

  if (!base) {
    throw new Error("VITE_VIDEO_BASE_URL is not configured");
  }

  const encodedPath = videoPath
    .split("/")
    .map(encodeURIComponent)
    .join("/");

  return `${base.replace(/\/$/, "")}/${encodedPath}`;
}

const STORAGE_KEY_MEDIA_OVERRIDE = 'animehub_media_base_url_override';

export function getCustomVideoBaseUrl(): string {
  if (typeof window === 'undefined') return MEDIA_BASE_URL;
  const stored = localStorage.getItem(STORAGE_KEY_MEDIA_OVERRIDE);
  if (stored !== null && stored !== '') {
    return stored.trim();
  }
  return MEDIA_BASE_URL;
}

export function setCustomVideoBaseUrl(url: string): void {
  if (typeof window === 'undefined') return;
  const clean = url.trim().replace(/\/$/, '');
  localStorage.setItem(STORAGE_KEY_MEDIA_OVERRIDE, clean);
}

export function resetCustomVideoBaseUrl(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY_MEDIA_OVERRIDE);
}

// High-speed direct sample video streams with 1080p WebM/MP4 CORS enabled
export const DEMO_VIDEOS = {
  action: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
  sololeveling: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
  fantasy: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
  scifi: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
  sliceOfLife: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  adventure: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
};

/**
 * Resolves Google Drive file IDs or URLs into direct streaming URLs
 */
export function resolveGoogleDriveStream(url: string): string {
  const match = url.match(/(?:file\/d\/|id=)([a-zA-Z0-9_-]{25,})/);
  if (match && match[1]) {
    const fileId = match[1];
    return `https://drive.google.com/uc?export=download&id=${fileId}`;
  }
  return url;
}

/**
 * Resolves an episode video path into a playable browser URL:
 * - If url is already absolute (http:// or https:// or blob:), use it directly.
 * - If url is a Google Drive link, format it for direct streaming.
 * - If a custom or configured MEDIA_BASE_URL exists, prepend it to relative path.
 * - If no base URL is configured and path is relative, return a reliable working stream
 *   so the player works immediately for testing.
 */
export function resolveVideoUrl(urlOrPath: string, fallbackKey: keyof typeof DEMO_VIDEOS = 'action'): string {
  if (!urlOrPath) {
    return DEMO_VIDEOS[fallbackKey] || DEMO_VIDEOS.action;
  }

  // Google Drive URL
  if (urlOrPath.includes('drive.google.com')) {
    return resolveGoogleDriveStream(urlOrPath);
  }

  // Already a full external URL or local blob URL
  if (urlOrPath.startsWith('http://') || urlOrPath.startsWith('https://') || urlOrPath.startsWith('blob:')) {
    return urlOrPath;
  }

  // Try using the new getVideoUrl helper as required
  try {
    const cleanPath = urlOrPath.startsWith('/') ? urlOrPath.substring(1) : urlOrPath;
    return getVideoUrl(cleanPath);
  } catch (err) {
    // Graceful fallback if VITE_VIDEO_BASE_URL is missing to prevent crashes
    const activeBaseUrl = getCustomVideoBaseUrl() || 'https://huggingface.co/datasets/mrweirdoo/anime-library/resolve/main';
    const cleanPath = urlOrPath.startsWith('/') ? urlOrPath : '/' + urlOrPath;
    const encodedPath = cleanPath
      .split('/')
      .map(part => encodeURIComponent(part))
      .join('/');
    const cleanBase = activeBaseUrl.replace(/\/$/, '');
    return `${cleanBase}${encodedPath}`;
  }
}

/**
 * Generates an in-memory sample WebVTT track for demo subtitles
 */
export function createSampleSubtitleDataUrl(language: string, animeTitle: string): string {
  const cues = `WEBVTT

00:00:02.000 --> 00:00:06.000
[AnimeHub Cinema] Now streaming: ${animeTitle}

00:00:07.500 --> 00:00:12.000
(${language}) "I will protect this world from the shadows."

00:00:14.000 --> 00:00:18.000
(${language}) The hunter awakens. System synchronization: Complete.

00:00:20.000 --> 00:00:25.000
(${language}) "Arise."

00:00:28.000 --> 00:00:33.000
(${language}) High definition streaming via AnimeHub Native Engine.
`;
  return `data:text/vtt;charset=utf-8,${encodeURIComponent(cues)}`;
}
