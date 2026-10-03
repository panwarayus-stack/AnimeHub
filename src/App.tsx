/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { AnimeDetailsPage } from './pages/AnimeDetailsPage';
import { WatchPage } from './pages/WatchPage';
import { SearchPage } from './pages/SearchPage';
import { LibraryPage } from './pages/LibraryPage';
import { BrowsePage } from './pages/BrowsePage';
import { AdminPage } from './pages/AdminPage';
import { MobileBottomNav } from './components/MobileBottomNav';
import { TVRemoteGuide } from './components/TVRemoteGuide';

import { Anime, Episode } from './types/anime';
import { getAnimeById } from './data/anime';
import { useWatchHistory } from './hooks/useWatchHistory';
import { useFavorites } from './hooks/useFavorites';
import { useTVNavigation } from './hooks/useTVNavigation';
import { isAdminAuthenticated } from './services/catalogManager';

type ViewMode = 'home' | 'details' | 'watch' | 'browse' | 'genres' | 'library' | 'search' | 'admin';

export default function App() {
  const [viewMode, setViewMode] = useState<ViewMode>('home');
  const [selectedAnime, setSelectedAnime] = useState<Anime | null>(null);
  const [activeWatchAnime, setActiveWatchAnime] = useState<Anime | null>(null);
  const [activeEpisodeNumber, setActiveEpisodeNumber] = useState<number>(1);
  const [activeGenre, setActiveGenre] = useState<string>('All');
  const [isAdmin, setIsAdmin] = useState(isAdminAuthenticated());
  const [, setCatalogVersion] = useState(0);

  // Smart TV 10-Foot Mode & Remote Control Navigation Hook
  const { isTVMode, toggleTVMode } = useTVNavigation();

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

  // Listen for catalog & auth updates and fetch backend DB
  useEffect(() => {
    // Sync catalog from server
    fetch('/api/catalog')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          localStorage.setItem('animehub_live_catalog_v3', JSON.stringify(data));
          window.dispatchEvent(new Event('animehub:catalog_updated'));
        }
      })
      .catch(err => console.log('Using local catalog cache:', err));

    const handleCatalogUpdate = () => {
      setCatalogVersion(v => v + 1);
    };
    const handleAuthUpdate = () => {
      setIsAdmin(isAdminAuthenticated());
    };
    const handleGlobalKeys = (e: KeyboardEvent) => {
      if (e.altKey && (e.key === 'a' || e.key === 'A')) {
        e.preventDefault();
        handleNavClick('admin');
      }
    };

    window.addEventListener('animehub:catalog_updated', handleCatalogUpdate);
    window.addEventListener('animehub:admin_auth_changed', handleAuthUpdate);
    window.addEventListener('keydown', handleGlobalKeys);
    return () => {
      window.removeEventListener('animehub:catalog_updated', handleCatalogUpdate);
      window.removeEventListener('animehub:admin_auth_changed', handleAuthUpdate);
      window.removeEventListener('keydown', handleGlobalKeys);
    };
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

    if (route === 'admin') {
      setViewMode('admin');
      setSelectedAnime(null);
      setActiveWatchAnime(null);
      return;
    }

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
  const handleNavClick = (tab: 'home' | 'browse' | 'genres' | 'library' | 'search' | 'admin', genre?: string) => {
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
    } else if (tab === 'admin') {
      window.location.hash = 'admin';
      setViewMode('admin');
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

  const getActiveTabForNavbar = (): 'home' | 'browse' | 'genres' | 'library' | 'search' | 'admin' => {
    if (viewMode === 'browse') return 'browse';
    if (viewMode === 'genres') return 'genres';
    if (viewMode === 'library') return 'library';
    if (viewMode === 'search') return 'search';
    if (viewMode === 'admin') return 'admin';
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

  return (
    <div
      className={`min-h-screen bg-[#05070c] text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white ${
        isTVMode ? 'tv-mode-active text-lg' : ''
      }`}
    >
      {/* Smart TV Remote Banner */}
      {isTVMode && (
        <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-blue-950 border-b border-blue-800/40 text-center py-1.5 px-4 text-xs text-blue-300 font-mono flex items-center justify-center gap-2">
          <span>✦ Smart TV 10-Foot Mode Active</span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span>Remote D-Pad Navigation Enabled (Arrow Keys + OK / Enter) ✦</span>
        </div>
      )}

      {/* 3-Zone Top Navigation */}
      <Navbar
        currentTab={getActiveTabForNavbar()}
        onNavigate={handleNavClick}
        isAdmin={isAdmin}
        favoritesCount={favoriteIds.length}
        isTVMode={isTVMode}
        onToggleTVMode={toggleTVMode}
      />

      {/* Main Content Area (with bottom padding on mobile for sticky nav bar) */}
      <main className="flex-1 pb-20 md:pb-0">
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

        {viewMode === 'admin' && (
          <AdminPage
            onBackToSite={() => handleNavClick('home')}
            onPreviewAnime={handleSelectAnime}
            onPlayEpisode={handlePlayAnime}
          />
        )}
      </main>

      {/* Editorial Footer */}
      <Footer
        onNavigate={handleNavClick}
      />

      {/* Mobile Bottom Navigation Bar (Hidden on desktop & TVs) */}
      <MobileBottomNav
        currentTab={getActiveTabForNavbar()}
        onNavigate={handleNavClick}
        favoritesCount={favoriteIds.length}
        isTVMode={isTVMode}
        onToggleTVMode={toggleTVMode}
      />

      {/* Smart TV Remote Overlay Guide (visible only on TV mode) */}
      <TVRemoteGuide
        isTVMode={isTVMode}
        onToggleTVMode={toggleTVMode}
      />
    </div>
  );
}
