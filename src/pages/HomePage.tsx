import React, { useState, useEffect } from 'react';
import { HeroBanner } from '../components/HeroBanner';
import { ContinueWatchingRow } from '../components/ContinueWatchingRow';
import { getActiveCatalog } from '../data/anime';
import { Anime, WatchHistoryItem, WatchProgress } from '../types/anime';
import { ChevronRight, Film, Star, Layers } from 'lucide-react';

interface HomePageProps {
  onSelectAnime: (anime: Anime) => void;
  onPlayAnime: (anime: Anime, episodeNumber?: number) => void;
  isFavorite: (id: string) => boolean;
  onToggleFavorite: (id: string) => void;
  continueWatchingItems: WatchHistoryItem[];
  onRemoveContinueWatching: (animeId: string) => void;
  getProgress: (animeId: string, episodeId?: string) => WatchProgress | null;
  getResumeEpisodeNumber: (animeId: string) => number;
  onNavigateToGenre?: (genre: string) => void;
  onNavigateToBrowse?: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onSelectAnime,
  onPlayAnime,
  isFavorite,
  onToggleFavorite,
  continueWatchingItems,
  onRemoveContinueWatching,
  getResumeEpisodeNumber
}) => {
  const catalog = getActiveCatalog();
  const season1 = catalog.find(a => a.id === 'solo-leveling-s01') || catalog[0];
  const season2 = catalog.find(a => a.id === 'solo-leveling-s02') || catalog[1];

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 650);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-10 pb-24 animate-pulse">
        {/* Hero Banner Skeleton */}
        <div className="relative w-full h-[520px] sm:h-[580px] lg:h-[640px] bg-slate-950 flex flex-col justify-end pb-14 sm:pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto w-full space-y-4">
            {/* Meta Line */}
            <div className="flex gap-2.5">
              <div className="h-4 w-16 bg-white/[0.08] rounded" />
              <div className="h-4 w-24 bg-white/[0.08] rounded" />
              <div className="h-4 w-20 bg-white/[0.08] rounded" />
            </div>
            {/* Big Title */}
            <div className="h-12 sm:h-16 w-3/4 max-w-xl bg-white/[0.1] rounded-2xl" />
            {/* Metadata Slashes */}
            <div className="h-4 w-1/2 max-w-md bg-white/[0.08] rounded" />
            {/* Synopsis */}
            <div className="space-y-2 max-w-lg">
              <div className="h-3 w-full bg-white/[0.06] rounded" />
              <div className="h-3 w-5/6 bg-white/[0.06] rounded" />
              <div className="h-3 w-4/6 bg-white/[0.06] rounded" />
            </div>
            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <div className="h-12 w-48 bg-white/[0.12] rounded-2xl" />
              <div className="h-12 w-32 bg-white/[0.08] rounded-2xl" />
            </div>
          </div>
        </div>

        {/* Content Container Skeletons */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Continue Watching Row Skeleton */}
          {continueWatchingItems.length > 0 && (
            <div className="space-y-4">
              <div className="h-5 w-40 bg-white/[0.08] rounded" />
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {[1, 2, 3].slice(0, continueWatchingItems.length).map(i => (
                  <div key={i} className="aspect-video w-full rounded-2xl bg-white/[0.02] border border-white/[0.08] p-3 flex flex-col justify-end space-y-2">
                    <div className="h-4 w-1/3 bg-white/[0.08] rounded" />
                    <div className="h-4 w-2/3 bg-white/[0.1] rounded" />
                    <div className="h-1.5 w-full bg-white/[0.05] rounded-full" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Series Showcase Skeletons */}
          <div className="space-y-6">
            <div className="border-b border-white/[0.08] pb-4 space-y-2">
              <div className="h-4 w-24 bg-white/[0.08] rounded" />
              <div className="h-8 w-48 bg-white/[0.1] rounded-lg" />
              <div className="h-4 w-64 bg-white/[0.06] rounded" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2].map(i => (
                <div key={i} className="rounded-2xl border border-white/[0.08] p-5 flex flex-col sm:flex-row gap-5 bg-white/[0.02]">
                  {/* Poster Thumbnail */}
                  <div className="aspect-[3/4] w-full sm:w-40 bg-white/[0.08] rounded-xl shrink-0" />
                  {/* Details block */}
                  <div className="flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="h-4 w-32 bg-white/[0.08] rounded" />
                      <div className="h-6 w-48 bg-white/[0.1] rounded" />
                      <div className="space-y-1.5">
                        <div className="h-3 w-full bg-white/[0.06] rounded" />
                        <div className="h-3 w-full bg-white/[0.06] rounded" />
                        <div className="h-3 w-2/3 bg-white/[0.06] rounded" />
                      </div>
                    </div>
                    <div className="flex justify-between items-center border-t border-white/[0.06] pt-3">
                      <div className="h-4 w-12 bg-white/[0.08] rounded" />
                      <div className="h-4 w-24 bg-white/[0.08] rounded" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-24">
      {/* Cinematic Hero - Clicking primary CTA opens details page, never plays instantly */}
      <HeroBanner
        featuredAnime={catalog}
        onSelect={onSelectAnime}
        onPlay={onPlayAnime}
        isFavorite={isFavorite}
        onToggleFavorite={onToggleFavorite}
        getResumeEpisodeNumber={getResumeEpisodeNumber}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Continue Watching (Only shown if user has active history) */}
        <ContinueWatchingRow
          items={continueWatchingItems}
          onPlay={onPlayAnime}
          onRemove={onRemoveContinueWatching}
          onSelect={onSelectAnime}
        />

        {/* Series & Seasons Showcase - Clicking opens details page to select Season & Episode */}
        <section className="space-y-6">
          <div className="border-b border-white/[0.08] pb-4">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-blue-400 font-semibold mb-1">
              <Layers className="w-4 h-4" />
              <span>Series Collection</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Solo Leveling: Seasons
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Select a season to view storyline details and choose an episode to watch.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Season 1 Card */}
            {season1 && (
              <button
                key={season1.id}
                onClick={() => onSelectAnime(season1)}
                className="group relative rounded-2xl overflow-hidden bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.08] hover:border-blue-500/50 p-5 flex flex-col sm:flex-row gap-5 text-left transition-all duration-300 cursor-pointer shadow-sm hover:shadow-2xl hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-blue-500"
              >
                {/* Poster */}
                <div className="aspect-[3/4] w-full sm:w-40 shrink-0 rounded-xl overflow-hidden bg-slate-950 border border-white/10 shadow-lg">
                  <img
                    src={season1.posterImage}
                    alt={season1.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-xs font-mono">
                      <span className="text-blue-400 font-bold uppercase tracking-wider">Season 1</span>
                      <span aria-hidden="true" className="text-slate-600">·</span>
                      <span className="text-slate-400">12 Episodes</span>
                      <span aria-hidden="true" className="text-slate-600">·</span>
                      <span className="text-emerald-400 font-semibold">Completed</span>
                    </div>

                    <h3 className="font-display text-lg sm:text-xl font-bold text-white group-hover:text-blue-300 transition-colors">
                      {season1.title}
                    </h3>

                    <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                      {season1.synopsis}
                    </p>
                  </div>

                  <div className="pt-2 flex items-center justify-between border-t border-white/[0.06] text-xs font-semibold">
                    <div className="flex items-center gap-1.5 text-amber-400 font-mono">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{season1.score?.toFixed(1)}</span>
                    </div>

                    <div className="text-blue-400 group-hover:text-blue-300 flex items-center gap-1 transition-colors">
                      <span>Select Season &amp; Episodes</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </button>
            )}

            {/* Season 2 Card */}
            {season2 && (
              <button
                key={season2.id}
                onClick={() => onSelectAnime(season2)}
                className="group relative rounded-2xl overflow-hidden bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.08] hover:border-purple-500/50 p-5 flex flex-col sm:flex-row gap-5 text-left transition-all duration-300 cursor-pointer shadow-sm hover:shadow-2xl hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-purple-500"
              >
                {/* Poster */}
                <div className="aspect-[3/4] w-full sm:w-40 shrink-0 rounded-xl overflow-hidden bg-slate-950 border border-white/10 shadow-lg">
                  <img
                    src={season2.posterImage}
                    alt={season2.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-xs font-mono">
                      <span className="text-purple-400 font-bold uppercase tracking-wider">Season 2</span>
                      <span aria-hidden="true" className="text-slate-600">·</span>
                      <span className="text-slate-400">13 Episodes</span>
                      <span aria-hidden="true" className="text-slate-600">·</span>
                      <span className="text-emerald-400 font-semibold">Ongoing</span>
                    </div>

                    <h3 className="font-display text-lg sm:text-xl font-bold text-white group-hover:text-purple-300 transition-colors">
                      {season2.title}
                    </h3>

                    <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                      {season2.synopsis}
                    </p>
                  </div>

                  <div className="pt-2 flex items-center justify-between border-t border-white/[0.06] text-xs font-semibold">
                    <div className="flex items-center gap-1.5 text-amber-400 font-mono">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{season2.score?.toFixed(1)}</span>
                    </div>

                    <div className="text-purple-400 group-hover:text-purple-300 flex items-center gap-1 transition-colors">
                      <span>Select Season &amp; Episodes</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </button>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};
