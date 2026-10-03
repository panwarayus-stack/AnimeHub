import React, { useState } from 'react';
import { Play, Bookmark, Film } from 'lucide-react';
import { Anime, WatchProgress } from '../types/anime';

interface AnimeCardProps {
  anime: Anime;
  onSelect: (anime: Anime) => void;
  onPlay: (anime: Anime, episodeNumber?: number) => void;
  isFavorite: boolean;
  onToggleFavorite: (animeId: string) => void;
  progress?: WatchProgress | null;
}

export const AnimeCard: React.FC<AnimeCardProps> = ({
  anime,
  onSelect,
  onPlay,
  isFavorite,
  onToggleFavorite,
  progress
}) => {
  const [imgError, setImgError] = useState(false);

  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onPlay(anime, progress ? progress.episodeNumber : 1);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite(anime.id);
  };

  return (
    <div
      onClick={() => onSelect(anime)}
      className="group relative flex flex-col cursor-pointer transition-all duration-200 hover:-translate-y-1.5 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:scale-105 focus:z-20 rounded-xl"
      tabIndex={0}
      role="button"
      onKeyDown={e => {
        if (e.key === 'Enter') onSelect(anime);
      }}
    >
      {/* Poster Container */}
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-slate-950 border border-slate-800 shadow-md">
        {!imgError ? (
          <img
            src={anime.posterImage}
            alt={anime.title}
            onError={() => setImgError(true)}
            referrerPolicy="no-referrer"
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center p-4 text-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950">
            <Film className="w-8 h-8 text-blue-500/60 mb-2" />
            <span className="text-xs font-semibold text-slate-300 line-clamp-2">{anime.title}</span>
            <span className="text-[10px] text-slate-500 mt-1">{anime.releaseYear}</span>
          </div>
        )}

        {/* Video resolution text tag */}
        <div className="absolute top-2 left-2 text-[10px] font-mono font-semibold text-slate-300 drop-shadow-md pointer-events-none">
          1080p
        </div>

        {/* Hover Action Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-between p-3.5">
          {/* Top action: Watchlist */}
          <div className="flex justify-end">
            <button
              onClick={handleFavoriteClick}
              className={`p-2 rounded-lg backdrop-blur-md transition-colors cursor-pointer ${
                isFavorite
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-black/60 text-slate-300 hover:text-white hover:bg-black/80'
              }`}
              title={isFavorite ? 'Remove from Watchlist' : 'Add to Watchlist'}
              aria-label={isFavorite ? 'Remove from Watchlist' : 'Add to Watchlist'}
            >
              <Bookmark className={`w-4 h-4 ${isFavorite ? 'fill-white' : ''}`} />
            </button>
          </div>

          {/* Center Play Button */}
          <div className="flex justify-center items-center">
            <button
              onClick={handlePlayClick}
              className="p-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-full shadow-xl transform scale-90 group-hover:scale-100 transition-transform cursor-pointer"
              title="Play Now"
              aria-label="Play Now"
            >
              <Play className="w-5 h-5 fill-white ml-0.5" />
            </button>
          </div>

          {/* Bottom quick details */}
          <div className="text-left text-xs text-slate-300">
            <p className="line-clamp-2 font-medium text-white">{anime.synopsis}</p>
          </div>
        </div>

        {/* Watch Progress Bar if user has started this anime */}
        {progress && progress.percentage > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-black/60">
            <div
              className="h-full bg-blue-500 transition-all"
              style={{ width: `${progress.percentage}%` }}
            />
          </div>
        )}
      </div>

      {/* Card Info (Zero-Pill Discipline: clean unboxed text) */}
      <div className="mt-2.5 space-y-1 text-left">
        <h4 className="text-sm font-semibold text-slate-100 group-hover:text-blue-400 transition-colors line-clamp-1">
          {anime.title}
        </h4>
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <span>{anime.releaseYear}</span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span>{anime.genres[0]}</span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span className="font-mono tabular-nums text-slate-300 font-medium">★ {anime.score?.toFixed(1)}</span>
        </div>
      </div>
    </div>
  );
};
