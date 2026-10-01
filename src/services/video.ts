/**
 * Central Video Configuration Layer for AnimeHub
 *
 * Architecture:
 * Browser -> Vercel (frontend website)
 * Browser -> Cloudflare R2 (video files)
 *
 * When deploying your own authorized video collection to Cloudflare R2:
 * 1. Upload files to your R2 bucket (e.g. /anime/tokyo-2088/ep01.mp4)
 * 2. Connect a custom domain or enable R2 public bucket access (e.g. https://media.yourdomain.com)
 * 3. Set VITE_VIDEO_BASE_URL in your Vercel Environment Variables or in the in-app settings
 *
 * No video data is proxied through Vercel. Video streams directly from R2 to the user's browser.
 */

// Default base URL. Can be set via environment variable during build/Vercel deployment:
export const VIDEO_BASE_URL = (import.meta.env.VITE_VIDEO_BASE_URL as string) || '';

const STORAGE_KEY_R2_OVERRIDE = 'animehub_r2_base_url_override';

// Local storage override for testing R2 URLs directly in the browser
export function getCustomVideoBaseUrl(): string {
  if (typeof window === 'undefined') return VIDEO_BASE_URL;
  const stored = localStorage.getItem(STORAGE_KEY_R2_OVERRIDE);
  if (stored !== null && stored !== '') {
    return stored.trim();
  }
  return VIDEO_BASE_URL;
}

export function setCustomVideoBaseUrl(url: string): void {
  if (typeof window === 'undefined') return;
  const clean = url.trim().replace(/\/$/, ''); // Remove trailing slash
  localStorage.setItem(STORAGE_KEY_R2_OVERRIDE, clean);
}

export function resetCustomVideoBaseUrl(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY_R2_OVERRIDE);
}

// Reliable open-source demo anime/animation streams for out-of-the-box local testing
// These are CC-BY open videos hosted on Wikimedia and public high-speed CDNs with CORS enabled:
export const DEMO_VIDEOS = {
  action: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
  cyberpunk: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  fantasy: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
  scifi: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
  sliceOfLife: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  adventure: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackSeeTheWorld.mp4'
};

/**
 * Resolves an episode video path into a playable browser URL:
 * - If url is already absolute (http:// or https://), use it directly.
 * - If a custom or configured VIDEO_BASE_URL exists, prepend it to relative path.
 * - If no base URL is configured and path is relative, return a reliable working demo stream
 *   so the player works immediately for testing before R2 is populated.
 */
export function resolveVideoUrl(urlOrPath: string, fallbackKey: keyof typeof DEMO_VIDEOS = 'cyberpunk'): string {
  if (!urlOrPath) {
    return DEMO_VIDEOS[fallbackKey] || DEMO_VIDEOS.cyberpunk;
  }

  // Already a full external URL
  if (urlOrPath.startsWith('http://') || urlOrPath.startsWith('https://') || urlOrPath.startsWith('blob:')) {
    return urlOrPath;
  }

  const activeBaseUrl = getCustomVideoBaseUrl();

  // If Cloudflare R2 base URL is configured, construct the direct R2 link
  if (activeBaseUrl) {
    const cleanBase = activeBaseUrl.replace(/\/$/, '');
    const cleanPath = urlOrPath.startsWith('/') ? urlOrPath : `/${urlOrPath}`;
    return `${cleanBase}${cleanPath}`;
  }

  // When no R2 base URL is set yet, gracefully return the demo video stream
  return DEMO_VIDEOS[fallbackKey] || DEMO_VIDEOS.cyberpunk;
}

/**
 * Generates an in-memory sample WebVTT track for demo subtitles
 */
export function createSampleSubtitleDataUrl(language: string, animeTitle: string): string {
  const cues = `WEBVTT

00:00:02.000 --> 00:00:06.000
[AnimeHub Player] Now streaming: ${animeTitle}

00:00:07.500 --> 00:00:12.000
(${language}) The journey begins across the horizon.

00:00:14.000 --> 00:00:18.000
(${language}) Prepare the thrusters. Synchronizing core system.

00:00:20.000 --> 00:00:25.000
(${language}) "No matter what happens, we forge our own destiny."

00:00:28.000 --> 00:00:33.000
(${language}) Subtitles rendered smoothly via AnimeHub custom player.
`;
  return `data:text/vtt;charset=utf-8,${encodeURIComponent(cues)}`;
}
