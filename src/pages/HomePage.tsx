import React, { useState } from 'react';
import { HeroBanner } from '../components/HeroBanner';
import { ContinueWatchingRow } from '../components/ContinueWatchingRow';
import { getActiveCatalog } from '../data/anime';
import { Anime, Episode, WatchHistoryItem, WatchProgress } from '../types/anime';
import { Play, Tv, Monitor, ChevronRight, Layers, Film } from 'lucide-react';

interface HomePageProps {
  onSelectAnime: (anime: Anime) => void;
  onPlayAnime: (anime: Anime, episodeNumber?: number) => void;
  isFavorite: (id: string) => boolean;
  onToggleFavorite: (id: string) => void;
  continueWatchingItems: WatchHistoryItem[];
  onRemoveContinueWatching: (animeId: string) => void;
  getProgress: (animeId: string, episodeId?: string) => WatchProgress | null;
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
  getResumeEpisodeNumber
}) => {
  const catalog = getActiveCatalog();
  const season1 = catalog.find(a => a.id === 'solo-leveling-s01') || catalog[0];
  const season2 = catalog.find(a => a.id === 'solo-leveling-s02') || catalog[1];
  const [activeSeasonTab, setActiveSeasonTab] = useState<'all' | 's1' | 's2'>('all');

  return (
    <div className="space-y-8 pb-16">
      {/* Cinematic Hero */}
      <HeroBanner
        featuredAnime={catalog}
        onSelect={onSelectAnime}
        onPlay={onPlayAnime}
        isFavorite={isFavorite}
        onToggleFavorite={onToggleFavorite}
        getResumeEpisodeNumber={getResumeEpisodeNumber}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Continue Watching (Active User Progress) */}
        <ContinueWatchingRow
          items={continueWatchingItems}
          onPlay={onPlayAnime}
          onRemove={onRemoveContinueWatching}
          onSelect={onSelectAnime}
        />

        {/* Season Navigation Filter Bar for Desktop & TV */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-400">
              <Layers className="w-4 h-4" />
              <span>Full Series Catalog</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white font-display">
              Solo Leveling: Complete Collection
            </h2>
          </div>

          {/* Interactive Season Filter Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-900/90 rounded-xl border border-slate-800/80 self-start sm:self-auto">
            <button
              onClick={() => setActiveSeasonTab('all')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                activeSeasonTab === 'all'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              All Seasons
            </button>
            <button
              onClick={() => setActiveSeasonTab('s1')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                activeSeasonTab === 's1'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              Season 1 (12 Ep)
            </button>
            <button
              onClick={() => setActiveSeasonTab('s2')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                activeSeasonTab === 's2'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              Season 2 (13 Ep)
            </button>
          </div>
        </div>

        {/* Season 1 Interactive Shelf */}
        {(activeSeasonTab === 'all' || activeSeasonTab === 's1') && season1 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Film className="w-4 h-4 text-blue-400" />
                  <span>Solo Leveling: Season 1</span>
                  <span className="text-xs font-mono text-slate-400 font-normal">
                    · 12 Episodes · 2024 · Completed
                  </span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Sung Jinwoo awakens from the double dungeon and discovers the System.
                </p>
              </div>

              <button
                onClick={() => onSelectAnime(season1)}
                className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span>View Season Details</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Horizontal Episode Shelf with Big TV & Desktop Cards */}
            <div className="flex gap-4 overflow-x-auto pb-4 pt-1 no-scrollbar focus:outline-none">
              {season1.episodes.map(ep => {
                const prog = getProgress(season1.id, ep.id);
                const pct = prog && prog.duration > 0 ? (prog.currentTime / prog.duration) * 100 : 0;

                return (
                  <button
                    key={ep.id}
                    onClick={() => onPlayAnime(season1, ep.number)}
                    className="group relative flex-none w-64 sm:w-72 md:w-80 rounded-2xl overflow-hidden bg-slate-900 border border-slate-800/80 hover:border-blue-500/70 focus:outline-none focus:ring-4 focus:ring-blue-500 transition-all transform hover:-translate-y-1 hover:shadow-xl text-left cursor-pointer"
                    title={`Play Episode ${ep.number}: ${ep.title}`}
                  >
                    {/* High-res SVG Episode Thumbnail */}
                    <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
                      <img
                        src={ep.thumbnail}
                        alt={ep.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                      {/* Runtime Badge */}
                      <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/80 font-mono text-[10px] text-slate-300">
                        {ep.durationFormatted || '24m'}
                      </span>

                      {/* Hover / Focus Play Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity bg-black/40">
                        <div className="p-3.5 rounded-full bg-blue-600 text-white shadow-xl shadow-blue-500/50 transform scale-90 group-hover:scale-100 transition-transform">
                          <Play className="w-5 h-5 fill-current translate-x-0.5" />
                        </div>
                      </div>

                      {/* Watch progress indicator */}
                      {pct > 0 && (
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-800">
                          <div className="h-full bg-blue-500" style={{ width: `${pct}%` }} />
                        </div>
                      )}
                    </div>

                    {/* Card Content */}
                    <div className="p-3.5 space-y-1.5">
                      <div className="flex items-center justify-between text-[11px] font-mono">
                        <span className="text-blue-400 font-bold">Episode {ep.number}</span>
                        <span className="text-slate-500">1080p Ultra HD</span>
                      </div>
                      <h4 className="text-sm font-bold text-white truncate group-hover:text-blue-300 transition-colors">
                        {ep.title}
                      </h4>
                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                        {ep.synopsis}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Season 2 Interactive Shelf */}
        {(activeSeasonTab === 'all' || activeSeasonTab === 's2') && season2 && (
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Film className="w-4 h-4 text-purple-400" />
                  <span>Solo Leveling Season 2: Arise from the Shadow</span>
                  <span className="text-xs font-mono text-slate-400 font-normal">
                    · 13 Episodes · 2025 · Ongoing
                  </span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Commander of the Shadow Army ascends into the Red Gate and Jeju Island raid.
                </p>
              </div>

              <button
                onClick={() => onSelectAnime(season2)}
                className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span>View Season Details</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Horizontal Episode Shelf with Big TV & Desktop Cards */}
            <div className="flex gap-4 overflow-x-auto pb-4 pt-1 no-scrollbar focus:outline-none">
              {season2.episodes.map(ep => {
                const prog = getProgress(season2.id, ep.id);
                const pct = prog && prog.duration > 0 ? (prog.currentTime / prog.duration) * 100 : 0;

                return (
                  <button
                    key={ep.id}
                    onClick={() => onPlayAnime(season2, ep.number)}
                    className="group relative flex-none w-64 sm:w-72 md:w-80 rounded-2xl overflow-hidden bg-slate-900 border border-slate-800/80 hover:border-purple-500/70 focus:outline-none focus:ring-4 focus:ring-purple-500 transition-all transform hover:-translate-y-1 hover:shadow-xl text-left cursor-pointer"
                    title={`Play Episode ${ep.number}: ${ep.title}`}
                  >
                    {/* High-res SVG Episode Thumbnail */}
                    <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
                      <img
                        src={ep.thumbnail}
                        alt={ep.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                      {/* Runtime Badge */}
                      <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/80 font-mono text-[10px] text-slate-300">
                        {ep.durationFormatted || '24m'}
                      </span>

                      {/* Hover / Focus Play Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity bg-black/40">
                        <div className="p-3.5 rounded-full bg-purple-600 text-white shadow-xl shadow-purple-500/50 transform scale-90 group-hover:scale-100 transition-transform">
                          <Play className="w-5 h-5 fill-current translate-x-0.5" />
                        </div>
                      </div>

                      {/* Watch progress indicator */}
                      {pct > 0 && (
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-800">
                          <div className="h-full bg-purple-500" style={{ width: `${pct}%` }} />
                        </div>
                      )}
                    </div>

                    {/* Card Content */}
                    <div className="p-3.5 space-y-1.5">
                      <div className="flex items-center justify-between text-[11px] font-mono">
                        <span className="text-purple-400 font-bold">Episode {ep.number}</span>
                        <span className="text-slate-500">1080p Ultra HD</span>
                      </div>
                      <h4 className="text-sm font-bold text-white truncate group-hover:text-purple-300 transition-colors">
                        {ep.title}
                      </h4>
                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                        {ep.synopsis}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Desktop & Smart TV Navigation Cheatsheet Banner */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-blue-950/40 to-slate-900 border border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs text-slate-300">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 shrink-0">
              <Tv className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-white text-sm">Smart TV &amp; Desktop Quick Navigation</p>
              <p className="text-slate-400 text-[11px]">Designed for high-speed couch remote and keyboard control</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[11px] font-mono">
            <span className="px-2 py-1 rounded bg-black/60 border border-slate-800 text-blue-300">
              [◄ ▲ ▼ ►] D-Pad
            </span>
            <span className="px-2 py-1 rounded bg-black/60 border border-slate-800 text-blue-300">
              [OK / Enter] Play
            </span>
            <span className="px-2 py-1 rounded bg-black/60 border border-slate-800 text-blue-300">
              [Space] Pause
            </span>
            <span className="px-2 py-1 rounded bg-black/60 border border-slate-800 text-blue-300">
              [F] Fullscreen
            </span>
            <span className="px-2 py-1 rounded bg-black/60 border border-slate-800 text-blue-300">
              [T] TV Mode
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
