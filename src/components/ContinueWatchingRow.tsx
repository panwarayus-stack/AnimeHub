import React from 'react';
import { Play, X, Clock } from 'lucide-react';
import { WatchHistoryItem } from '../types/anime';
import { Anime } from '../types/anime';
import { getAnimeById } from '../data/anime';

interface ContinueWatchingRowProps {
  items: WatchHistoryItem[];
  onPlay: (anime: Anime, episodeNumber: number) => void;
  onRemove: (animeId: string) => void;
  onSelect: (anime: Anime) => void;
}

export const ContinueWatchingRow: React.FC<ContinueWatchingRowProps> = ({
  items,
  onPlay,
  onRemove,
  onSelect
}) => {
  if (!items || items.length === 0) return null;

  return (
    <section className="py-6 border-b border-slate-850">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-rose-500" />
          <h2 className="text-xl font-bold tracking-tight text-white font-display">Continue Watching</h2>
        </div>
        <span className="text-xs text-slate-400 font-mono">
          {items.length} {items.length === 1 ? 'title' : 'titles'} in progress
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {items.slice(0, 4).map(item => {
          const anime = getAnimeById(item.animeId);
          if (!anime) return null;

          const remainingSeconds = Math.max(0, item.duration - item.currentTime);
          const remainingMinutes = Math.ceil(remainingSeconds / 60);

          return (
            <div
              key={item.animeId}
              onClick={() => onPlay(anime, item.episodeNumber)}
              className="group relative flex flex-col bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden shadow-md hover:border-slate-700 transition-all cursor-pointer"
            >
              {/* Thumbnail Container */}
              <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
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

                {/* Remove button */}
                <button
                  onClick={e => {
                    e.stopPropagation();
                    onRemove(item.animeId);
                  }}
                  className="absolute top-2 right-2 p-1 bg-black/60 hover:bg-black/90 text-slate-300 hover:text-white rounded-md transition-colors"
                  title="Remove from Continue Watching"
                  aria-label="Remove from Continue Watching"
                >
                  <X className="w-3.5 h-3.5" />
                </button>

                {/* Progress Bar at base of thumbnail */}
                <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-slate-800">
                  <div
                    className="h-full bg-rose-500"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>

              {/* Card Meta */}
              <div className="p-3.5 space-y-1">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-semibold text-rose-400">Ep {item.episodeNumber}</span>
                  <span className="font-mono tabular-nums">{remainingMinutes}m left</span>
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
    </section>
  );
};
