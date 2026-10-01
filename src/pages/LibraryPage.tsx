import React, { useState } from 'react';
import { Bookmark, Clock, History, Trash2, Play, Film } from 'lucide-react';
import { Anime, WatchHistoryItem, WatchProgress } from '../types/anime';
import { getActiveCatalog, getAnimeById } from '../data/anime';
import { AnimeCard } from '../components/AnimeCard';

interface LibraryPageProps {
  favoriteIds: string[];
  historyItems: WatchHistoryItem[];
  onSelectAnime: (anime: Anime) => void;
  onPlayAnime: (anime: Anime, episodeNumber?: number) => void;
  isFavorite: (id: string) => boolean;
  onToggleFavorite: (id: string) => void;
  onRemoveHistoryItem: (animeId: string) => void;
  onClearHistory: () => void;
  getProgress: (animeId: string) => WatchProgress | null;
  onBrowse: () => void;
}

export const LibraryPage: React.FC<LibraryPageProps> = ({
  favoriteIds,
  historyItems,
  onSelectAnime,
  onPlayAnime,
  isFavorite,
  onToggleFavorite,
  onRemoveHistoryItem,
  onClearHistory,
  getProgress,
  onBrowse
}) => {
  const [activeTab, setActiveTab] = useState<'continue' | 'watchlist' | 'history'>('continue');
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Favorite Anime list
  const favoriteAnime = getActiveCatalog().filter(a => favoriteIds.includes(a.id));

  // In-progress items (percentage between 1 and 92)
  const continueItems = historyItems.filter(item => item.percentage < 92);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight font-display">
            My Library
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Your personal watchlist, bookmarks, and local playback progress
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-xl self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('continue')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'continue'
                ? 'bg-rose-600 text-white font-semibold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Continue Watching</span>
            {continueItems.length > 0 && (
              <span className="text-[10px] font-mono opacity-80">({continueItems.length})</span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('watchlist')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'watchlist'
                ? 'bg-rose-600 text-white font-semibold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>Watchlist</span>
            {favoriteAnime.length > 0 && (
              <span className="text-[10px] font-mono opacity-80">({favoriteAnime.length})</span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'history'
                ? 'bg-rose-600 text-white font-semibold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>History</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Continue Watching */}
      {activeTab === 'continue' && (
        <div className="space-y-6">
          {continueItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {continueItems.map(item => {
                const anime = getAnimeById(item.animeId);
                if (!anime) return null;
                const remainingSecs = Math.max(0, item.duration - item.currentTime);
                const remainingMins = Math.ceil(remainingSecs / 60);

                return (
                  <div
                    key={item.animeId}
                    onClick={() => onPlayAnime(anime, item.episodeNumber)}
                    className="group flex flex-col bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden shadow-md hover:border-slate-700 transition-all cursor-pointer"
                  >
                    <div className="relative aspect-video w-full bg-slate-950 overflow-hidden">
                      <img
                        src={item.animeBanner || item.animePoster}
                        alt={item.animeTitle}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                        <div className="p-3 bg-rose-600 text-white rounded-full shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                          <Play className="w-4 h-4 fill-white ml-0.5" />
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-slate-800">
                        <div
                          className="h-full bg-rose-500"
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                    </div>

                    <div className="p-4 space-y-1.5">
                      <div className="flex items-center justify-between text-xs text-slate-400">
                        <span className="font-semibold text-rose-400 font-mono">
                          Ep {item.episodeNumber}
                        </span>
                        <span className="font-mono tabular-nums">{remainingMins}m remaining</span>
                      </div>
                      <h4 className="text-sm font-semibold text-white truncate group-hover:text-rose-400 transition-colors">
                        {item.animeTitle}
                      </h4>
                      <p className="text-xs text-slate-400 truncate">
                        {item.episodeTitle || `Episode ${item.episodeNumber}`}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-20 text-center space-y-4 max-w-md mx-auto">
              <div className="p-4 bg-slate-900 rounded-full w-16 h-16 mx-auto flex items-center justify-center text-slate-500">
                <Clock className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-white">No Episodes in Progress</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                When you start watching any anime on AnimeHub, your playback progress will automatically save right here.
              </p>
              <button
                onClick={onBrowse}
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
              >
                Explore Shows
              </button>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Watchlist / Favorites */}
      {activeTab === 'watchlist' && (
        <div className="space-y-6">
          {favoriteAnime.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
              {favoriteAnime.map(anime => (
                <AnimeCard
                  key={anime.id}
                  anime={anime}
                  onSelect={onSelectAnime}
                  onPlay={onPlayAnime}
                  isFavorite={true}
                  onToggleFavorite={onToggleFavorite}
                  progress={getProgress(anime.id)}
                />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center space-y-4 max-w-md mx-auto">
              <div className="p-4 bg-slate-900 rounded-full w-16 h-16 mx-auto flex items-center justify-center text-slate-500">
                <Bookmark className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-white">Your Watchlist is Empty</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Save anime series you plan to stream later by clicking the bookmark icon on any title.
              </p>
              <button
                onClick={onBrowse}
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
              >
                Browse Popular Shows
              </button>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Full Watch History */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-mono">
              {historyItems.length} playback entries stored locally
            </span>

            {historyItems.length > 0 && (
              <div>
                {!showClearConfirm ? (
                  <button
                    onClick={() => setShowClearConfirm(true)}
                    className="text-xs text-slate-400 hover:text-rose-400 transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear Watch History</span>
                  </button>
                ) : (
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-slate-300">Are you sure?</span>
                    <button
                      onClick={() => {
                        onClearHistory();
                        setShowClearConfirm(false);
                      }}
                      className="px-2.5 py-1 bg-rose-600 text-white rounded font-medium hover:bg-rose-500"
                    >
                      Yes, Clear
                    </button>
                    <button
                      onClick={() => setShowClearConfirm(false)}
                      className="px-2.5 py-1 bg-slate-800 text-slate-300 rounded hover:text-white"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {historyItems.length > 0 ? (
            <div className="space-y-2">
              {historyItems.map(item => {
                const anime = getAnimeById(item.animeId);
                const dateStr = new Date(item.lastWatchedAt).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                });

                return (
                  <div
                    key={`${item.animeId}-${item.episodeId}`}
                    className="flex items-center justify-between p-3.5 bg-slate-900/60 border border-slate-800 rounded-xl hover:bg-slate-850 transition-colors"
                  >
                    <div
                      onClick={() => anime && onPlayAnime(anime, item.episodeNumber)}
                      className="flex items-center gap-4 flex-1 min-w-0 cursor-pointer"
                    >
                      <div className="relative aspect-video w-24 shrink-0 rounded-lg overflow-hidden bg-slate-950">
                        <img
                          src={item.animeBanner || item.animePoster}
                          alt={item.animeTitle}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-800">
                          <div className="h-full bg-rose-500" style={{ width: `${item.percentage}%` }} />
                        </div>
                      </div>

                      <div className="min-w-0 space-y-0.5">
                        <h4 className="text-sm font-semibold text-white truncate hover:text-rose-400 transition-colors">
                          {item.animeTitle}
                        </h4>
                        <p className="text-xs text-slate-400 truncate">
                          Episode {item.episodeNumber}: {item.episodeTitle}
                        </p>
                        <div className="text-[11px] text-slate-500 font-mono">
                          Watched {dateStr} · {item.percentage}% complete
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 ml-4">
                      {anime && (
                        <button
                          onClick={() => onPlayAnime(anime, item.episodeNumber)}
                          className="p-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg transition-colors cursor-pointer"
                          title="Resume"
                        >
                          <Play className="w-3.5 h-3.5 fill-white ml-0.5" />
                        </button>
                      )}
                      <button
                        onClick={() => onRemoveHistoryItem(item.animeId)}
                        className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                        title="Delete from history"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-20 text-center space-y-4 max-w-md mx-auto">
              <div className="p-4 bg-slate-900 rounded-full w-16 h-16 mx-auto flex items-center justify-center text-slate-500">
                <History className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-white">No Watch History Yet</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Titles you play will be recorded in this list so you can rewatch or jump straight back in.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
