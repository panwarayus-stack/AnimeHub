import React from 'react';
import { HeroBanner } from '../components/HeroBanner';
import { ContinueWatchingRow } from '../components/ContinueWatchingRow';
import { AnimeRow } from '../components/AnimeRow';
import {
  getFeaturedAnime,
  getTrendingAnime,
  getRecentlyAddedAnime,
  getAnimeByGenre,
  ALL_GENRES
} from '../data/anime';
import { Anime, WatchHistoryItem, WatchProgress } from '../types/anime';
import { Flame, Sparkles, Compass, FolderArchive, ArrowRight } from 'lucide-react';

interface HomePageProps {
  onSelectAnime: (anime: Anime) => void;
  onPlayAnime: (anime: Anime, episodeNumber?: number) => void;
  isFavorite: (id: string) => boolean;
  onToggleFavorite: (id: string) => void;
  continueWatchingItems: WatchHistoryItem[];
  onRemoveContinueWatching: (animeId: string) => void;
  getProgress: (animeId: string) => WatchProgress | null;
  getResumeEpisodeNumber: (animeId: string) => number;
  onNavigateToGenre: (genre: string) => void;
  onNavigateToBrowse: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onSelectAnime,
  onPlayAnime,
  isFavorite,
  onToggleFavorite,
  continueWatchingItems,
  onRemoveContinueWatching,
  getProgress,
  getResumeEpisodeNumber,
  onNavigateToGenre,
  onNavigateToBrowse
}) => {
  const featured = getFeaturedAnime();
  const trending = getTrendingAnime();
  const recentlyAdded = getRecentlyAddedAnime();
  const actionAnime = getAnimeByGenre('Action');
  const sciFiAnime = getAnimeByGenre('Sci-Fi');
  const fantasyAnime = getAnimeByGenre('Fantasy');

  return (
    <div className="space-y-6 pb-12">
      {/* Cinematic Hero */}
      <HeroBanner
        featuredAnime={featured}
        onSelect={onSelectAnime}
        onPlay={onPlayAnime}
        isFavorite={isFavorite}
        onToggleFavorite={onToggleFavorite}
        getResumeEpisodeNumber={getResumeEpisodeNumber}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Continue Watching (Active User Progress) */}
        <ContinueWatchingRow
          items={continueWatchingItems}
          onPlay={onPlayAnime}
          onRemove={onRemoveContinueWatching}
          onSelect={onSelectAnime}
        />

        {/* Quick Genre Pills / Filter Bar */}
        <div className="pt-2">
          <div className="flex items-center gap-2 mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
            <Compass className="w-4 h-4 text-blue-500" />
            <span>Popular Genres</span>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
            {ALL_GENRES.slice(1, 8).map(genre => (
              <button
                key={genre}
                onClick={() => onNavigateToGenre(genre)}
                className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-medium whitespace-nowrap transition-colors cursor-pointer"
              >
                {genre}
              </button>
            ))}
          </div>
        </div>

        {/* Trending Now */}
        <AnimeRow
          title="Trending on AnimeHub"
          subtitle="Most watched series this week"
          animeList={trending}
          onSelect={onSelectAnime}
          onPlay={onPlayAnime}
          isFavorite={isFavorite}
          onToggleFavorite={onToggleFavorite}
          getProgress={getProgress}
          onViewAll={onNavigateToBrowse}
        />

        {/* Recently Added */}
        <AnimeRow
          title="Recently Added"
          subtitle="Fresh episodes ready to stream"
          animeList={recentlyAdded}
          onSelect={onSelectAnime}
          onPlay={onPlayAnime}
          isFavorite={isFavorite}
          onToggleFavorite={onToggleFavorite}
          getProgress={getProgress}
        />

        {/* Genre Shelves */}
        <AnimeRow
          title="Action & High Stakes"
          subtitle="Fast-paced battles and relentless momentum"
          animeList={actionAnime}
          onSelect={onSelectAnime}
          onPlay={onPlayAnime}
          isFavorite={isFavorite}
          onToggleFavorite={onToggleFavorite}
          getProgress={getProgress}
          onViewAll={() => onNavigateToGenre('Action')}
        />

        <AnimeRow
          title="Sci-Fi & Cybernetic Worlds"
          subtitle="Futuristic megacities, orbital mecha, and quantum anomalies"
          animeList={sciFiAnime}
          onSelect={onSelectAnime}
          onPlay={onPlayAnime}
          isFavorite={isFavorite}
          onToggleFavorite={onToggleFavorite}
          getProgress={getProgress}
          onViewAll={() => onNavigateToGenre('Sci-Fi')}
        />

        <AnimeRow
          title="Fantasy & Mythic Realms"
          subtitle="Ancient blades, elemental magic, and twin moons"
          animeList={fantasyAnime}
          onSelect={onSelectAnime}
          onPlay={onPlayAnime}
          isFavorite={isFavorite}
          onToggleFavorite={onToggleFavorite}
          getProgress={getProgress}
          onViewAll={() => onNavigateToGenre('Fantasy')}
        />
      </div>
    </div>
  );
};
