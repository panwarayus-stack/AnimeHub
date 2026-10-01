/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { R2ConfigModal } from './components/R2ConfigModal';
import { HomePage } from './pages/HomePage';
import { AnimeDetailsPage } from './pages/AnimeDetailsPage';
import { WatchPage } from './pages/WatchPage';
import { SearchPage } from './pages/SearchPage';
import { LibraryPage } from './pages/LibraryPage';
import { BrowsePage } from './pages/BrowsePage';
import { ZipUploadModal } from './components/ZipUploadModal';

import { Anime, Episode } from './types/anime';
import { ANIME_CATALOG, getAnimeById } from './data/anime';
import { useWatchHistory } from './hooks/useWatchHistory';
import { useFavorites } from './hooks/useFavorites';

type ViewMode = 'home' | 'details' | 'watch' | 'browse' | 'genres' | 'library' | 'search';

export default function App() {
  const [viewMode, setViewMode] = useState<ViewMode>('home');
  const [selectedAnime, setSelectedAnime] = useState<Anime | null>(null);
  const [activeWatchAnime, setActiveWatchAnime] = useState<Anime | null>(null);
  const [activeEpisodeNumber, setActiveEpisodeNumber] = useState<number>(1);
  const [activeGenre, setActiveGenre] = useState<string>('All');
  const [isR2ModalOpen, setIsR2ModalOpen] = useState(false);
  const [isZipModalOpen, setIsZipModalOpen] = useState(false);
  const [, setCatalogVersion] = useState(0);

  // Watch History & Favorites Hooks
  const {
    history,
    saveProgress,
    getProgress,
    getResumeEpisodeNumber,
    removeFromHistory,
    clearHistory
  } = useWatchHistory();

  const { favoriteIds, isFavorite, toggleFavorite } = useFavorites();

  // Listen for catalog updates (when user adds or sorts anime from zip)
  useEffect(() => {
    const handleCatalogUpdate = () => {
      setCatalogVersion(v => v + 1);
    };
    window.addEventListener('animehub:catalog_updated', handleCatalogUpdate);
    return () => window.removeEventListener('animehub:catalog_updated', handleCatalogUpdate);
  }, []);

  // Hash-based client router for browser Back/Forward and direct bookmarking
  const syncFromHash = useCallback(() => {
    const hash = window.location.hash.replace(/^#/, '');
    if (!hash) {
      setViewMode('home');
      setSelectedAnime(null);
      setActiveWatchAnime(null);
      return;
    }

    const [route, queryString] = hash.split('?');
    const params = new URLSearchParams(queryString || '');

    if (route === 'watch') {
      const animeId = params.get('id');
      const ep = parseInt(params.get('ep') || '1', 10);
      const found = animeId ? getAnimeById(animeId) : null;
      if (found) {
        setActiveWatchAnime(found);
        setActiveEpisodeNumber(isNaN(ep) ? 1 : ep);
        setViewMode('watch');
        return;
      }
    }

    if (route === 'anime') {
      const animeId = params.get('id');
      const found = animeId ? getAnimeById(animeId) : null;
      if (found) {
        setSelectedAnime(found);
        setViewMode('details');
        return;
      }
    }

    if (route === 'browse') {
      setViewMode('browse');
      return;
    }

    if (route === 'genres') {
      const genre = params.get('genre') || 'All';
      setActiveGenre(genre);
      setViewMode('genres');
      return;
    }

    if (route === 'library') {
      setViewMode('library');
      return;
    }

    if (route === 'search') {
      const genre = params.get('genre') || 'All';
      setActiveGenre(genre);
      setViewMode('search');
      return;
    }

    setViewMode('home');
  }, []);

  useEffect(() => {
    syncFromHash();
    window.addEventListener('hashchange', syncFromHash);
    return () => window.removeEventListener('hashchange', syncFromHash);
  }, [syncFromHash]);

  // Navigation handlers
  const handleNavClick = (tab: 'home' | 'browse' | 'genres' | 'library' | 'search', genre?: string) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (tab === 'home') {
      window.location.hash = '';
      setViewMode('home');
      setSelectedAnime(null);
      setActiveWatchAnime(null);
    } else if (tab === 'browse') {
      window.location.hash = 'browse';
      setViewMode('browse');
      setSelectedAnime(null);
      setActiveWatchAnime(null);
    } else if (tab === 'genres') {
      const g = genre || 'All';
      setActiveGenre(g);
      window.location.hash = `genres?genre=${encodeURIComponent(g)}`;
      setViewMode('genres');
      setSelectedAnime(null);
      setActiveWatchAnime(null);
    } else if (tab === 'library') {
      window.location.hash = 'library';
      setViewMode('library');
      setSelectedAnime(null);
      setActiveWatchAnime(null);
    } else if (tab === 'search') {
      window.location.hash = 'search';
      setViewMode('search');
      setSelectedAnime(null);
      setActiveWatchAnime(null);
    }
  };

  const handleSelectAnime = (anime: Anime) => {
    setSelectedAnime(anime);
    setViewMode('details');
    window.location.hash = `anime?id=${anime.id}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePlayAnime = (anime: Anime, episodeNumber?: number) => {
    const epNum = episodeNumber || getResumeEpisodeNumber(anime.id);
    setActiveWatchAnime(anime);
    setActiveEpisodeNumber(epNum);
    setViewMode('watch');
    window.location.hash = `watch?id=${anime.id}&ep=${epNum}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEpisodeChange = (newEpNumber: number) => {
    if (!activeWatchAnime) return;
    setActiveEpisodeNumber(newEpNumber);
    window.location.hash = `watch?id=${activeWatchAnime.id}&ep=${newEpNumber}`;
  };

  const handleBackToDetails = () => {
    if (activeWatchAnime) {
      setSelectedAnime(activeWatchAnime);
      setViewMode('details');
      window.location.hash = `anime?id=${activeWatchAnime.id}`;
    } else {
      handleNavClick('home');
    }
  };

  const getActiveTabForNavbar = (): 'home' | 'browse' | 'genres' | 'library' | 'search' => {
    if (viewMode === 'browse') return 'browse';
    if (viewMode === 'genres') return 'genres';
    if (viewMode === 'library') return 'library';
    if (viewMode === 'search') return 'search';
    return 'home';
  };

  // Saved resume time for current episode in watch player
  const currentEpisodeWatchProgress =
    activeWatchAnime
      ? getProgress(
          activeWatchAnime.id,
          activeWatchAnime.episodes.find(e => e.number === activeEpisodeNumber)?.id
        )
      : null;

  const handleAnimeAdded = (anime: Anime) => {
    setSelectedAnime(anime);
    setViewMode('details');
    window.location.hash = `anime?id=${anime.id}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#090b10] text-slate-100 flex flex-col font-sans">
      {/* 3-Zone Top Navigation */}
      <Navbar
        currentTab={getActiveTabForNavbar()}
        onNavigate={handleNavClick}
        onOpenR2Modal={() => setIsR2ModalOpen(true)}
        onOpenZipModal={() => setIsZipModalOpen(true)}
        favoritesCount={favoriteIds.length}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {viewMode === 'home' && (
          <HomePage
            onSelectAnime={handleSelectAnime}
            onPlayAnime={handlePlayAnime}
            isFavorite={isFavorite}
            onToggleFavorite={toggleFavorite}
            continueWatchingItems={history}
            onRemoveContinueWatching={removeFromHistory}
            getProgress={getProgress}
            getResumeEpisodeNumber={getResumeEpisodeNumber}
            onNavigateToGenre={genre => handleNavClick('genres', genre)}
            onNavigateToBrowse={() => handleNavClick('browse')}
            onOpenZipModal={() => setIsZipModalOpen(true)}
          />
        )}

        {viewMode === 'details' && selectedAnime && (
          <AnimeDetailsPage
            anime={selectedAnime}
            onBack={() => handleNavClick('home')}
            onPlay={handlePlayAnime}
            onSelectAnime={handleSelectAnime}
            isFavorite={isFavorite(selectedAnime.id)}
            onToggleFavorite={toggleFavorite}
            progress={getProgress(selectedAnime.id)}
            getAnimeProgress={getProgress}
            getResumeEpisodeNumber={getResumeEpisodeNumber}
          />
        )}

        {viewMode === 'watch' && activeWatchAnime && (
          <WatchPage
            anime={activeWatchAnime}
            episodeNumber={activeEpisodeNumber}
            onEpisodeChange={handleEpisodeChange}
            onBackToDetails={handleBackToDetails}
            onSaveProgress={saveProgress}
            initialTime={currentEpisodeWatchProgress ? currentEpisodeWatchProgress.currentTime : 0}
            isFavorite={isFavorite(activeWatchAnime.id)}
            onToggleFavorite={toggleFavorite}
            onOpenR2Modal={() => setIsR2ModalOpen(true)}
          />
        )}

        {viewMode === 'browse' && (
          <BrowsePage
            isPopularView={true}
            onSelectAnime={handleSelectAnime}
            onPlayAnime={handlePlayAnime}
            isFavorite={isFavorite}
            onToggleFavorite={toggleFavorite}
            getProgress={getProgress}
          />
        )}

        {viewMode === 'genres' && (
          <BrowsePage
            initialGenre={activeGenre}
            isPopularView={false}
            onSelectAnime={handleSelectAnime}
            onPlayAnime={handlePlayAnime}
            isFavorite={isFavorite}
            onToggleFavorite={toggleFavorite}
            getProgress={getProgress}
          />
        )}

        {viewMode === 'search' && (
          <SearchPage
            initialGenre={activeGenre}
            onSelectAnime={handleSelectAnime}
            onPlayAnime={handlePlayAnime}
            isFavorite={isFavorite}
            onToggleFavorite={toggleFavorite}
            getProgress={getProgress}
          />
        )}

        {viewMode === 'library' && (
          <LibraryPage
            favoriteIds={favoriteIds}
            historyItems={history}
            onSelectAnime={handleSelectAnime}
            onPlayAnime={handlePlayAnime}
            isFavorite={isFavorite}
            onToggleFavorite={toggleFavorite}
            onRemoveHistoryItem={removeFromHistory}
            onClearHistory={clearHistory}
            getProgress={getProgress}
            onBrowse={() => handleNavClick('home')}
          />
        )}
      </main>

      {/* Cloudflare R2 Video Source Configuration Modal */}
      <R2ConfigModal
        isOpen={isR2ModalOpen}
        onClose={() => setIsR2ModalOpen(false)}
      />

      {/* Zip Upload & Automatic Release Sorter Modal */}
      <ZipUploadModal
        isOpen={isZipModalOpen}
        onClose={() => setIsZipModalOpen(false)}
        onAnimeAdded={handleAnimeAdded}
      />

      {/* Editorial Footer */}
      <Footer
        onNavigate={handleNavClick}
        onOpenR2Modal={() => setIsR2ModalOpen(true)}
      />
    </div>
  );
}
