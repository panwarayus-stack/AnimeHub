import React, { useState, useEffect, useMemo } from 'react';
import { ALL_GENRES, getActiveCatalog } from '../data/anime';
import { Anime, WatchProgress } from '../types/anime';
import { AnimeCard } from '../components/AnimeCard';
import { Flame, Compass } from 'lucide-react';

interface BrowsePageProps {
  initialGenre?: string;
  isPopularView?: boolean;
  onSelectAnime: (anime: Anime) => void;
  onPlayAnime: (anime: Anime, episodeNumber?: number) => void;
  isFavorite: (id: string) => boolean;
  onToggleFavorite: (id: string) => void;
  getProgress: (animeId: string) => WatchProgress | null;
}

export const BrowsePage: React.FC<BrowsePageProps> = ({
  initialGenre = 'All',
  isPopularView = false,
  onSelectAnime,
  onPlayAnime,
  isFavorite,
  onToggleFavorite,
  getProgress
}) => {
  const [selectedGenre, setSelectedGenre] = useState(initialGenre);
  const [sortBy, setSortBy] = useState<'score' | 'year' | 'title'>(isPopularView ? 'score' : 'score');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 550);
    return () => clearTimeout(timer);
  }, [selectedGenre, sortBy]);

  const filteredAnime = useMemo(() => {
    let list = [...getActiveCatalog()];

    if (isPopularView) {
      list = list.filter(a => a.trending || (a.score && a.score >= 8.7));
    }

    if (selectedGenre !== 'All') {
      list = list.filter(a => a.genres.includes(selectedGenre));
    }

    return list.sort((a, b) => {
      if (sortBy === 'score') return (b.score || 0) - (a.score || 0);
      if (sortBy === 'year') return b.releaseYear - a.releaseYear;
      return a.title.localeCompare(b.title);
    });
  }, [selectedGenre, sortBy, isPopularView]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2">
            {isPopularView ? (
              <Flame className="w-6 h-6 text-blue-500" />
            ) : (
              <Compass className="w-6 h-6 text-blue-500" />
            )}
            <h1 className="text-3xl font-extrabold text-white tracking-tight font-display">
              {isPopularView ? 'Popular & Trending' : 'Browse by Genre'}
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {isPopularView
               ? 'Top rated and most watched series across the AnimeHub community'
               : 'Discover anime across our curated genres and collections'}
          </p>
        </div>

        {/* Sort Select */}
        <div className="flex items-center gap-2 self-start sm:self-auto text-xs">
          <span className="text-slate-400">Sort by:</span>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as 'score' | 'year' | 'title')}
            className="bg-slate-900 border border-white/[0.08] rounded-xl px-3.5 py-2 text-slate-300 text-xs focus:outline-none focus:border-blue-500 cursor-pointer"
          >
            <option value="score">Highest Rated</option>
            <option value="year">Release Year</option>
            <option value="title">Title (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Genre Pills */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
        {ALL_GENRES.map(genre => (
          <button
            key={genre}
            onClick={() => setSelectedGenre(genre)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedGenre === genre
                ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-600/25'
                : 'bg-white/[0.03] text-slate-400 border border-white/[0.05] hover:text-white hover:bg-white/[0.07]'
            }`}
          >
            {genre}
          </button>
        ))}
      </div>

      {/* Catalog Grid */}
      <div>
        <div className="text-xs text-slate-400 font-mono mb-4 flex items-center justify-between">
          <span>
            Showing <span className="text-white font-semibold">{filteredAnime.length}</span> titles
          </span>
          {isLoading && <span className="text-[10px] text-slate-500 animate-pulse">Syncing catalog...</span>}
        </div>

        {isLoading ? (
          /* High-fidelity pulsing grid skeleton loaders matching the AnimeCard geometry */
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 animate-pulse">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="space-y-3">
                <div className="aspect-[3/4] w-full bg-white/[0.05] rounded-2xl border border-white/[0.08]" />
                <div className="space-y-2">
                  <div className="h-4 w-5/6 bg-white/[0.08] rounded" />
                  <div className="h-3.5 w-1/2 bg-white/[0.06] rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredAnime.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {filteredAnime.map(anime => (
              <AnimeCard
                key={anime.id}
                anime={anime}
                onSelect={onSelectAnime}
                onPlay={onPlayAnime}
                isFavorite={isFavorite(anime.id)}
                onToggleFavorite={onToggleFavorite}
                progress={getProgress(anime.id)}
              />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center space-y-3">
            <p className="text-slate-400 text-sm">No anime found in this category.</p>
            <button
              onClick={() => setSelectedGenre('All')}
              className="text-xs text-blue-400 hover:text-blue-300 underline"
            >
              Show all anime
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
