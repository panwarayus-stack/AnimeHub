import React, { useState, useMemo } from 'react';
import { Search, X, SlidersHorizontal, Sparkles } from 'lucide-react';
import { getActiveCatalog, ALL_GENRES } from '../data/anime';
import { Anime, WatchProgress } from '../types/anime';
import { AnimeCard } from '../components/AnimeCard';

interface SearchPageProps {
  onSelectAnime: (anime: Anime) => void;
  onPlayAnime: (anime: Anime, episodeNumber?: number) => void;
  isFavorite: (id: string) => boolean;
  onToggleFavorite: (id: string) => void;
  getProgress: (animeId: string) => WatchProgress | null;
  initialGenre?: string;
}

export const SearchPage: React.FC<SearchPageProps> = ({
  onSelectAnime,
  onPlayAnime,
  isFavorite,
  onToggleFavorite,
  getProgress,
  initialGenre
}) => {
  const [query, setQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string>(initialGenre || 'All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'score' | 'year' | 'title'>('score');

  const catalog = getActiveCatalog();

  const filteredResults = useMemo(() => {
    const q = query.toLowerCase().trim();

    return catalog.filter(anime => {
      // Query match across English title, Japanese title, synopsis, and genres
      const matchesQuery =
        !q ||
        anime.title.toLowerCase().includes(q) ||
        anime.japaneseTitle.toLowerCase().includes(q) ||
        anime.synopsis.toLowerCase().includes(q) ||
        anime.genres.some(g => g.toLowerCase().includes(q));

      // Genre filter
      const matchesGenre = selectedGenre === 'All' || anime.genres.includes(selectedGenre);

      // Status filter
      const matchesStatus = selectedStatus === 'All' || anime.status === selectedStatus;

      return matchesQuery && matchesGenre && matchesStatus;
    }).sort((a, b) => {
      if (sortBy === 'score') return (b.score || 0) - (a.score || 0);
      if (sortBy === 'year') return b.releaseYear - a.releaseYear;
      return a.title.localeCompare(b.title);
    });
  }, [query, selectedGenre, selectedStatus, sortBy, catalog]);

  const handleClearFilters = () => {
    setQuery('');
    setSelectedGenre('All');
    setSelectedStatus('All');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      {/* Search Header */}
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight font-display">
            Search Anime
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Search through our private streaming library by title, Japanese kanji, or genre
          </p>
        </div>

        {/* Search Bar Input */}
        <div className="relative max-w-2xl">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search by title, e.g. Cyber Genesis, Kamakura, Twin Moons..."
            className="w-full pl-11 pr-10 py-3.5 bg-slate-900/90 border border-slate-800 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 shadow-inner"
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Filter Chips Bar */}
      <div className="space-y-3 pb-2 border-b border-slate-800/80">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {ALL_GENRES.map(genre => (
            <button
              key={genre}
              onClick={() => setSelectedGenre(genre)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                selectedGenre === genre
                  ? 'bg-rose-600 text-white font-semibold'
                  : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-850'
              }`}
            >
              {genre}
            </button>
          ))}
        </div>

        {/* Secondary filters: Status and Sort */}
        <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-3">
            <span className="font-medium text-slate-300">Status:</span>
            {['All', 'Ongoing', 'Completed'].map(status => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`transition-colors cursor-pointer ${
                  selectedStatus === status ? 'text-rose-400 font-semibold underline' : 'hover:text-white'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="font-medium text-slate-300">Sort By:</span>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as 'score' | 'year' | 'title')}
              className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-slate-300 text-xs focus:outline-none focus:border-rose-500"
            >
              <option value="score">Highest Rated</option>
              <option value="year">Release Year</option>
              <option value="title">Title (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Count & Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs text-slate-400 font-mono">
            Showing <strong className="text-white font-semibold">{filteredResults.length}</strong> {filteredResults.length === 1 ? 'anime' : 'animes'}
          </span>
          {(query || selectedGenre !== 'All' || selectedStatus !== 'All') && (
            <button
              onClick={handleClearFilters}
              className="text-xs text-rose-400 hover:text-rose-300 transition-colors"
            >
              Reset Filters
            </button>
          )}
        </div>

        {filteredResults.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {filteredResults.map(anime => (
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
          /* Empty State */
          <div className="py-20 text-center space-y-4 max-w-md mx-auto">
            <div className="p-4 bg-slate-900/80 rounded-full w-16 h-16 mx-auto flex items-center justify-center text-slate-500">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-white">No Anime Found</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              We couldn&apos;t find any titles matching your query &ldquo;{query}&rdquo; or active filters. Try adjusting your search keywords.
            </p>
            <div className="pt-2">
              <button
                onClick={handleClearFilters}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
