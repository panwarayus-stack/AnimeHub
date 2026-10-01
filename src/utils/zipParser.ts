import JSZip from 'jszip';
import { Anime, Episode } from '../types/anime';

export interface ParsedReleaseInfo {
  provider?: string;
  title: string;
  seasonNumber: number;
  quality?: string;
  codec?: string;
  audioInfo: string;
  subtitleInfo: string;
  rawFilename: string;
}

export interface ParsedEpisodeFile {
  filename: string;
  episodeNumber: number;
  title: string;
  extension: string;
  fileBlob?: Blob;
  size?: number;
}

/**
 * Parses release strings like:
 * "[Toonworld4all] Solo Leveling S02 1080p x265 10bit WEB-DL Multi Audio ESub.zip"
 */
export function parseReleaseFilename(filename: string): ParsedReleaseInfo {
  const cleanName = filename.replace(/\.(zip|rar|7z|tar)$/i, '').trim();

  // 1. Extract Provider [Provider]
  let provider = '';
  let withoutProvider = cleanName;
  const providerMatch = cleanName.match(/^\[([^\]]+)\]\s*/);
  if (providerMatch) {
    provider = providerMatch[1].trim();
    withoutProvider = cleanName.substring(providerMatch[0].length).trim();
  }

  // 2. Extract Season (e.g. S02, S2, Season 02, Season 2)
  let seasonNumber = 1;
  const seasonMatch = withoutProvider.match(/(?:^|[\s._-])(?:S|Season\s*)(\d{1,2})(?:[\s._-]|$)/i);
  if (seasonMatch) {
    seasonNumber = parseInt(seasonMatch[1], 10);
  }

  // 3. Extract Quality (e.g. 1080p, 720p, 2160p, 4K)
  const qualityMatch = withoutProvider.match(/(2160p|4k|1080p|720p|480p)/i);
  const quality = qualityMatch ? qualityMatch[1].toLowerCase() : '1080p';

  // 4. Extract Codec (e.g. x265 10bit, x264, hevc, etc.)
  const codecMatch = withoutProvider.match(/(x265\s*10bit|x265|x264\s*10bit|x264|hevc|avc|10bit)/i);
  const codec = codecMatch ? codecMatch[0] : '';

  // 5. Extract Audio info (e.g. Multi Audio, Dual Audio, Dub, etc.)
  let audioInfo = 'Original Audio';
  if (/Multi\s*Audio/i.test(withoutProvider)) {
    audioInfo = 'Multi Audio (Japanese, English, Hindi, etc.)';
  } else if (/Dual\s*Audio/i.test(withoutProvider)) {
    audioInfo = 'Dual Audio (Japanese, English)';
  } else if (/Dub/i.test(withoutProvider)) {
    audioInfo = 'English Dub';
  }

  // 6. Extract Subtitles (e.g. ESub, Eng Sub, Multi Sub)
  let subtitleInfo = 'English Subtitles';
  if (/Multi\s*Sub/i.test(withoutProvider)) {
    subtitleInfo = 'Multi Subtitles (English, Spanish, etc.)';
  } else if (/ESub|Eng\s*Sub/i.test(withoutProvider)) {
    subtitleInfo = 'English (ESub)';
  }

  // 7. Extract Anime Title: text before season tag (or before quality tag)
  let title = withoutProvider;
  if (seasonMatch && seasonMatch.index !== undefined) {
    title = withoutProvider.substring(0, seasonMatch.index).trim();
  } else if (qualityMatch && qualityMatch.index !== undefined) {
    title = withoutProvider.substring(0, qualityMatch.index).trim();
  }

  // Clean trailing punctuation or brackets
  title = title.replace(/[._-]+/g, ' ').replace(/\s+/g, ' ').trim();
  if (!title) {
    title = 'Anime Series';
  }

  return {
    provider,
    title,
    seasonNumber,
    quality,
    codec,
    audioInfo,
    subtitleInfo,
    rawFilename: filename
  };
}

/**
 * Parses individual episode files inside the folder or zip:
 * e.g. "[Toonworld4all] Solo Leveling S02E01 1080p.mp4", "Solo Leveling - 01.mkv", "E01.mp4"
 */
export function parseEpisodeFilename(
  filepath: string,
  fallbackSeasonNumber: number = 1
): ParsedEpisodeFile | null {
  const filename = filepath.split('/').pop() || filepath;

  // Filter out non-video files
  const extMatch = filename.match(/\.(mp4|mkv|webm|m4v|avi)$/i);
  if (!extMatch) return null;
  const extension = extMatch[1].toLowerCase();

  // Try standard episode patterns:
  // 1. S02E01 or S2E1 or E01 or E1
  let episodeNumber = 1;
  const epMatch1 = filename.match(/(?:S\d{1,2})?[._\s-]*E(\d{1,3})/i);
  const epMatch2 = filename.match(/(?:Episode|Ep)[._\s-]*(\d{1,3})/i);
  const epMatch3 = filename.match(/[-_]\s*(\d{1,3})\s*[-_\.]/);
  const epMatch4 = filename.match(/^(\d{1,3})[._\s-]/);

  if (epMatch1) {
    episodeNumber = parseInt(epMatch1[1], 10);
  } else if (epMatch2) {
    episodeNumber = parseInt(epMatch2[1], 10);
  } else if (epMatch3) {
    episodeNumber = parseInt(epMatch3[1], 10);
  } else if (epMatch4) {
    episodeNumber = parseInt(epMatch4[1], 10);
  } else {
    // Look for any 2-digit number in the filename
    const fallbackNumMatch = filename.match(/(\d{1,3})/);
    if (fallbackNumMatch) {
      episodeNumber = parseInt(fallbackNumMatch[1], 10);
    }
  }

  // Generate a clean episode title
  let title = `Episode ${episodeNumber}`;
  // If there's an episode title embedded between episode number and quality tags:
  const titleMatch = filename.match(/E\d{1,3}[._\s-]+([^\[\(]+)/i);
  if (titleMatch) {
    const rawEpTitle = titleMatch[1].replace(/[._-]+/g, ' ').replace(/\.(mp4|mkv|webm)$/i, '').trim();
    if (rawEpTitle.length > 2 && !/^(1080p|720p|x265|x264|web|bluray)/i.test(rawEpTitle)) {
      title = rawEpTitle;
    }
  }

  return {
    filename,
    episodeNumber,
    title,
    extension
  };
}

/**
 * Reads a Zip file and extracts file catalog without necessarily extracting all giant video blobs
 */
export async function inspectZipFile(
  zipFile: File,
  onProgress?: (percent: number, status: string) => void
): Promise<{
  releaseInfo: ParsedReleaseInfo;
  episodes: ParsedEpisodeFile[];
  zipInstance: JSZip;
}> {
  onProgress?.(10, 'Reading zip archive headers...');
  const zip = new JSZip();
  const loadedZip = await zip.loadAsync(zipFile);

  const releaseInfo = parseReleaseFilename(zipFile.name);
  onProgress?.(40, `Parsed release: ${releaseInfo.title} Season ${releaseInfo.seasonNumber}`);

  const episodeFiles: ParsedEpisodeFile[] = [];

  // Iterate over files in the zip
  const fileKeys = Object.keys(loadedZip.files);
  let checked = 0;

  for (const path of fileKeys) {
    const zipEntry = loadedZip.files[path];
    if (zipEntry.dir) continue;

    const parsed = parseEpisodeFilename(path, releaseInfo.seasonNumber);
    if (parsed) {
      episodeFiles.push({
        ...parsed,
        filename: path
      });
    }
    checked++;
    onProgress?.(40 + Math.round((checked / fileKeys.length) * 40), `Cataloging ${path}...`);
  }

  // Sort episodes by episode number ascending
  episodeFiles.sort((a, b) => a.episodeNumber - b.episodeNumber);

  onProgress?.(100, `Found ${episodeFiles.length} episodes ready!`);

  return {
    releaseInfo,
    episodes: episodeFiles,
    zipInstance: loadedZip
  };
}

/**
 * Converts parsed release & episode list into an AnimeHub Anime object:
 * Generates both R2 folder URL pattern (/anime/name/season/ep.mp4)
 * and can optionally store in-memory blob URLs for instant playback.
 */
export function createAnimeFromRelease(
  releaseInfo: ParsedReleaseInfo,
  episodes: ParsedEpisodeFile[],
  bannerPosterUrl?: string,
  blobUrls?: Record<number, string>
): Anime {
  const slug = releaseInfo.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  const id = `${slug}-s${releaseInfo.seasonNumber}`;
  const displayTitle =
    releaseInfo.seasonNumber > 1
      ? `${releaseInfo.title} Season ${releaseInfo.seasonNumber}`
      : releaseInfo.title;

  const animeEpisodes: Episode[] = episodes.map(ep => {
    const padEp = String(ep.episodeNumber).padStart(2, '0');
    // R2 target directory convention requested:
    // /anime/{name1}/season{N}/episode{M}.mp4
    const r2Path = `/anime/${slug}/season${releaseInfo.seasonNumber}/episode-${padEp}.${ep.extension || 'mp4'}`;
    const directBlobUrl = blobUrls && blobUrls[ep.episodeNumber];

    return {
      id: `${id}-ep-${ep.episodeNumber}`,
      number: ep.episodeNumber,
      title: ep.title,
      synopsis: `Official Season ${releaseInfo.seasonNumber} Episode ${ep.episodeNumber} in ${releaseInfo.quality || '1080p'} ${releaseInfo.codec || ''}.`,
      duration: 1440, // 24 minutes standard estimate
      durationFormatted: '24m',
      thumbnail: bannerPosterUrl || '',
      videoUrl: directBlobUrl || r2Path,
      subtitles: [
        {
          id: `sub-en-${ep.episodeNumber}`,
          label: 'English (ESub)',
          language: 'en',
          url: ''
        }
      ],
      audioTracks: [
        {
          id: `aud-multi-${ep.episodeNumber}`,
          label: releaseInfo.audioInfo,
          language: 'multi',
          url: '',
          default: true
        }
      ]
    };
  });

  return {
    id,
    slug,
    title: displayTitle,
    japaneseTitle: releaseInfo.title,
    synopsis: `${displayTitle} [${releaseInfo.quality || '1080p'} ${releaseInfo.codec || ''}]. Audio: ${releaseInfo.audioInfo}. Subtitles: ${releaseInfo.subtitleInfo}. Uploaded via automatic Zip sorter.`,
    bannerImage: bannerPosterUrl || '',
    posterImage: bannerPosterUrl || '',
    genres: ['Action', 'Fantasy', 'Adventure'],
    status: 'Completed',
    releaseYear: new Date().getFullYear(),
    season: `Season ${releaseInfo.seasonNumber}`,
    rating: 'PG-13',
    score: 9.0,
    studio: releaseInfo.provider || 'Self-Hosted R2',
    audioInfo: releaseInfo.audioInfo,
    subtitleInfo: releaseInfo.subtitleInfo,
    totalEpisodes: episodes.length,
    featured: true,
    trending: true,
    recentlyAdded: true,
    episodes: animeEpisodes
  };
}
