export interface SubtitleTrack {
  id: string;
  label: string;
  language: string;
  url?: string; // compatibility with existing code
  src?: string; // compatibility with user specs
  default?: boolean;
}

export interface AudioTrack {
  id: string;
  label: string;
  language: string;
  url: string;
  default?: boolean;
}

export interface Episode {
  id: string;
  number: number;
  title: string;
  synopsis?: string;
  duration: number; // in seconds
  durationFormatted: string; // e.g. "24m"
  thumbnail: string;
  videoUrl: string; // relative path (e.g. "/series/ep1.mp4") or full URL
  videoPath?: string; // direct path inside Hugging Face repository
  subtitles?: SubtitleTrack[];
  audioTracks?: AudioTrack[];
}

export interface Anime {
  id: string;
  slug: string;
  title: string;
  japaneseTitle: string;
  synopsis: string;
  bannerImage: string;
  posterImage: string;
  genres: string[];
  status: 'Ongoing' | 'Completed';
  releaseYear: number;
  season?: string;
  rating?: string; // e.g. "PG-13", "16+"
  score?: number; // e.g. 8.9
  studio?: string;
  audioInfo: string; // e.g. "Dual Audio (JP/EN)"
  subtitleInfo: string; // e.g. "English, Spanish, French"
  totalEpisodes: number;
  featured?: boolean;
  trending?: boolean;
  recentlyAdded?: boolean;
  episodes: Episode[];
}

export interface WatchProgress {
  animeId: string;
  episodeId: string;
  episodeNumber: number;
  currentTime: number; // seconds
  duration: number; // seconds
  percentage: number; // 0 to 100
  lastWatchedAt: number; // timestamp
}

export interface WatchHistoryItem extends WatchProgress {
  animeTitle: string;
  animePoster: string;
  animeBanner: string;
  episodeTitle: string;
  totalEpisodes: number;
}
