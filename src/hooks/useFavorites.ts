import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'animehub_favorites_v1';
const FAVORITES_UPDATE_EVENT = 'animehub:favorites_updated';

export function useFavorites() {
  const [favoriteIds, setFavoriteIds] = useState<string[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const reloadFavorites = useCallback(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      setFavoriteIds(saved ? JSON.parse(saved) : []);
    } catch {
      setFavoriteIds([]);
    }
  }, []);

  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) reloadFavorites();
    };
    const handleCustom = () => reloadFavorites();

    window.addEventListener('storage', handleStorage);
    window.addEventListener(FAVORITES_UPDATE_EVENT, handleCustom);
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener(FAVORITES_UPDATE_EVENT, handleCustom);
    };
  }, [reloadFavorites]);

  const isFavorite = useCallback(
    (animeId: string): boolean => {
      return favoriteIds.includes(animeId);
    },
    [favoriteIds]
  );

  const toggleFavorite = useCallback((animeId: string) => {
    setFavoriteIds(prev => {
      const exists = prev.includes(animeId);
      const next = exists ? prev.filter(id => id !== animeId) : [animeId, ...prev];
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        window.dispatchEvent(new Event(FAVORITES_UPDATE_EVENT));
      } catch {
        // Ignore
      }
      return next;
    });
  }, []);

  return {
    favoriteIds,
    isFavorite,
    toggleFavorite
  };
}
