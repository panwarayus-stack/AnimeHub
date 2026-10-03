import React, { useState } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight, ListVideo, Cloud, CheckCircle2, Bookmark } from 'lucide-react';
import { Anime, Episode } from '../types/anime';
import { VideoPlayer } from '../components/VideoPlayer';
import { resolveVideoUrl } from '../services/video';

interface WatchPageProps {
  anime: Anime;
  episodeNumber: number;
  onEpisodeChange: (episodeNumber: number) => void;
  onBackToDetails: () => void;
  onSaveProgress: (anime: Anime, episode: Episode, currentTime: number, duration: number) => void;
  initialTime?: number;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
}

export const WatchPage: React.FC<WatchPageProps> = ({
  anime,
  episodeNumber,
  onEpisodeChange,
  onBackToDetails,
  onSaveProgress,
  initialTime = 0,
  isFavorite,
  onToggleFavorite
}) => {
  const [theaterMode, setTheaterMode] = useState(false);

  // Locate the active episode
  const currentEpisode =
    anime.episodes.find(e => e.number === episodeNumber) || anime.episodes[0] || null;

  if (!currentEpisode) {
    return (
      <div className="max-w-4xl mx-auto py-20 text-center text-slate-300">
        <p>Episode not found.</p>
        <button
          onClick={onBackToDetails}
          className="mt-4 px-4 py-2 bg-blue-600 rounded-lg text-white text-xs"
        >
          Back to Details
        </button>
      </div>
    );
  }

  const currentIndex = anime.episodes.findIndex(e => e.id === currentEpisode.id);
  const prevEpisode = currentIndex > 0 ? anime.episodes[currentIndex - 1] : null;
  const nextEpisode = currentIndex < anime.episodes.length - 1 ? anime.episodes[currentIndex + 1] : null;

  const currentStreamUrl = resolveVideoUrl(currentEpisode.videoUrl);

  return (
    <div className="pb-16 animate-in fade-in duration-300">
      {/* Top Bar for Watch Page */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between text-xs text-slate-300">
        <button
          onClick={onBackToDetails}
          className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-blue-500" />
          <span className="font-medium text-slate-200">{anime.title}</span>
          <span aria-hidden="true" className="text-slate-600">/</span>
          <span className="text-slate-400">Episode {currentEpisode.number}</span>
        </button>

        <div className="flex items-center gap-3">
          <span className="px-2 py-0.5 rounded bg-blue-600/20 text-blue-300 font-mono text-[11px] font-semibold border border-blue-500/30">
            {anime.season || 'Season 1'}
          </span>
          <span className="px-2 py-0.5 rounded bg-slate-900 text-slate-300 font-mono text-[11px] border border-slate-800">
            1080p Ultra HD
          </span>
        </div>
      </div>

      {/* Main Player Container (Edge-to-Edge 100% width on Mobile, padded on Desktop) */}
      <div className={`transition-all ${theaterMode ? 'w-full px-0' : 'max-w-7xl mx-auto px-0 sm:px-6 lg:px-8'}`}>
        <VideoPlayer
          anime={anime}
          currentEpisode={currentEpisode}
          onEpisodeChange={ep => onEpisodeChange(ep.number)}
          onSaveProgress={onSaveProgress}
          initialTime={initialTime}
          theaterMode={theaterMode}
          onToggleTheater={() => setTheaterMode(!theaterMode)}
        />
      </div>

      {/* Under Player Information & Episode Selector */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left 2 Cols: Episode Metadata & Actions */}
          <div className="lg:col-span-2 space-y-4 text-left">
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-blue-400 font-mono">
                  Episode {currentEpisode.number} of {anime.totalEpisodes}
                </span>
                <h1 className="text-xl sm:text-2xl font-bold text-white font-display mt-0.5">
                  {currentEpisode.title}
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                  {anime.title} ({anime.japaneseTitle})
                </p>
              </div>

              {/* Prev / Next Buttons */}
              <div className="flex items-center gap-2">
                <button
                  disabled={!prevEpisode}
                  onClick={() => prevEpisode && onEpisodeChange(prevEpisode.number)}
                  className={`px-3 py-2 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-colors ${
                    prevEpisode
                      ? 'bg-slate-900 border-slate-700 text-white hover:bg-slate-800 cursor-pointer'
                      : 'bg-slate-950 border-slate-900 text-slate-600 cursor-not-allowed'
                  }`}
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                <button
                  disabled={!nextEpisode}
                  onClick={() => nextEpisode && onEpisodeChange(nextEpisode.number)}
                  className={`px-3 py-2 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-colors ${
                    nextEpisode
                      ? 'bg-blue-600 border-blue-500 text-white hover:bg-blue-500 cursor-pointer'
                      : 'bg-slate-950 border-slate-900 text-slate-600 cursor-not-allowed'
                  }`}
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Episode Synopsis */}
            <div className="space-y-2">
              <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Episode Synopsis
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                {currentEpisode.synopsis || anime.synopsis}
              </p>
            </div>

            {/* Direct stream inspection */}
            <div className="p-3 bg-slate-900/60 border border-slate-800/80 rounded-xl space-y-1.5 text-xs">
              <div className="flex items-center justify-between text-slate-400">
                <span className="font-semibold text-slate-300">Direct Media Stream</span>
                <span className="font-mono text-[11px] text-blue-400">1080p High Speed</span>
              </div>
              <p className="font-mono text-[11px] text-slate-400 break-all bg-slate-950/70 p-2 rounded border border-slate-850">
                {currentStreamUrl}
              </p>
            </div>
          </div>

          {/* Right Col: Episode Selector Sidebar */}
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <ListVideo className="w-4 h-4 text-blue-500" />
                <h3 className="text-sm font-bold text-white">Episodes</h3>
              </div>
              <span className="text-xs text-slate-400 font-mono">
                {anime.episodes.length} episodes
              </span>
            </div>

            <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
              {anime.episodes.map(ep => {
                const isActive = ep.id === currentEpisode.id;
                const progressKey = `video-progress-${ep.id}`;
                const savedTimeStr = typeof window !== 'undefined' ? localStorage.getItem(progressKey) : null;
                const savedTime = savedTimeStr ? parseFloat(savedTimeStr) : 0;
                const totalDuration = ep.duration || 1440;
                const progressPct = savedTime > 0 ? Math.min(100, (savedTime / totalDuration) * 100) : 0;

                return (
                  <button
                    key={ep.id}
                    onClick={() => onEpisodeChange(ep.number)}
                    className={`w-full flex items-center gap-3 p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      isActive
                        ? 'bg-blue-500/15 border-blue-500/60 shadow-md'
                        : 'bg-slate-900/60 hover:bg-slate-850 border-slate-800/70 hover:border-slate-700'
                    }`}
                  >
                    <div className="relative aspect-video w-20 shrink-0 rounded-lg overflow-hidden bg-slate-950">
                      <img
                        src={ep.thumbnail || anime.bannerImage}
                        alt={ep.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-1 right-1 px-1 bg-black/80 rounded text-[9px] font-mono text-slate-300">
                        {ep.durationFormatted}
                      </div>

                      {/* Visual Watch Progress Bar */}
                      {progressPct > 0 && (
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-900/80">
                          <div
                            className="h-full bg-blue-500 rounded-r"
                            style={{ width: `${progressPct}%` }}
                          />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className={`font-semibold font-mono ${isActive ? 'text-blue-400' : 'text-slate-400'}`}>
                          Ep {ep.number}
                        </span>
                        {isActive && (
                          <span className="text-[10px] font-medium text-blue-400 uppercase">
                            Now Playing
                          </span>
                        )}
                      </div>
                      <h4 className={`text-xs font-medium truncate ${isActive ? 'text-white' : 'text-slate-200'}`}>
                        {ep.title}
                      </h4>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
