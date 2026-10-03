import { useState, useEffect, useCallback } from 'react';

const TV_MODE_STORAGE_KEY = 'animehub_tv_mode_enabled';

interface Point {
  x: number;
  y: number;
}

export function useTVNavigation() {
  const [isTVMode, setIsTVMode] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    const saved = localStorage.getItem(TV_MODE_STORAGE_KEY);
    if (saved !== null) return saved === 'true';

    // Auto-detect Smart TV or Desktop screen
    const ua = navigator.userAgent.toLowerCase();
    const isTV =
      ua.includes('smart-tv') ||
      ua.includes('tizen') ||
      ua.includes('webos') ||
      ua.includes('appletv') ||
      ua.includes('googletv') ||
      ua.includes('crkey') ||
      ua.includes('firetv') ||
      ua.includes('hbbtv') ||
      ua.includes('bravia');

    const isDesktop = window.innerWidth >= 1200 && !/mobi|android|iphone|ipad|tablet/i.test(ua);

    return isTV || isDesktop;
  });

  const toggleTVMode = useCallback(() => {
    setIsTVMode(prev => {
      const next = !prev;
      localStorage.setItem(TV_MODE_STORAGE_KEY, String(next));
      return next;
    });
  }, []);

  // Sync .tv-mode-active class on body for 10-foot UI styles
  useEffect(() => {
    if (typeof document === 'undefined') return;
    if (isTVMode) {
      document.body.classList.add('tv-mode-active');
    } else {
      document.body.classList.remove('tv-mode-active');
    }
  }, [isTVMode]);

  // Spatial 2D Navigation Engine for Smart TV D-Pad Remotes
  useEffect(() => {
    if (!isTVMode) return;

    const handleTVKeyDown = (e: KeyboardEvent) => {
      // Allow normal typing inside input/textarea fields
      const targetTag = (e.target as HTMLElement)?.tagName;
      if (['INPUT', 'TEXTAREA'].includes(targetTag)) {
        if (e.key === 'Escape') {
          (e.target as HTMLElement).blur();
        }
        return;
      }

      // Quick toggle TV mode with 't' or 'T' key
      if (e.key === 't' || e.key === 'T') {
        toggleTVMode();
        return;
      }

      // Back navigation for Smart TV remotes
      if (e.key === 'Escape' || e.key === 'Backspace' || e.key === 'GoBack') {
        e.preventDefault();
        if (window.location.hash && window.location.hash !== '#home' && window.location.hash !== '#') {
          window.location.hash = 'home';
        } else {
          window.history.back();
        }
        return;
      }

      const focusableSelector =
        'button:not([disabled]):not([tabindex="-1"]), [role="button"]:not([disabled]), a[href]:not([tabindex="-1"]), input:not([disabled]), [tabindex="0"]';
      
      const focusableElements = Array.from(
        document.querySelectorAll<HTMLElement>(focusableSelector)
      ).filter(el => {
        // Must be visible in viewport
        const rect = el.getBoundingClientRect();
        return (
          el.offsetParent !== null &&
          rect.width > 0 &&
          rect.height > 0 &&
          window.getComputedStyle(el).visibility !== 'hidden' &&
          window.getComputedStyle(el).display !== 'none'
        );
      });

      if (focusableElements.length === 0) return;

      const activeEl = document.activeElement as HTMLElement | null;
      const isCurrentlyFocusable = activeEl && focusableElements.includes(activeEl);

      // If nothing is focused yet, focus the first high-value element (e.g. Hero action or first nav button)
      if (!isCurrentlyFocusable) {
        if (['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight', 'Enter'].includes(e.key)) {
          e.preventDefault();
          const target = focusableElements.find(el => el.classList.contains('primary-cta')) || focusableElements[0];
          target?.focus();
          target?.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
          return;
        }
      }

      if (!activeEl) return;
      const currentRect = activeEl.getBoundingClientRect();
      const currentCenter: Point = {
        x: currentRect.left + currentRect.width / 2,
        y: currentRect.top + currentRect.height / 2
      };

      let bestCandidate: HTMLElement | null = null;
      let minDistance = Infinity;

      switch (e.key) {
        case 'ArrowRight': {
          e.preventDefault();
          for (const el of focusableElements) {
            if (el === activeEl) continue;
            const r = el.getBoundingClientRect();
            const center: Point = { x: r.left + r.width / 2, y: r.top + r.height / 2 };
            const dx = center.x - currentCenter.x;
            const dy = center.y - currentCenter.y;
            // Target must be to the right
            if (dx > 10) {
              // Weight vertical difference heavily so horizontal rows stay inside the shelf
              const distance = dx + Math.abs(dy) * 3.5;
              if (distance < minDistance) {
                minDistance = distance;
                bestCandidate = el;
              }
            }
          }
          break;
        }

        case 'ArrowLeft': {
          e.preventDefault();
          for (const el of focusableElements) {
            if (el === activeEl) continue;
            const r = el.getBoundingClientRect();
            const center: Point = { x: r.left + r.width / 2, y: r.top + r.height / 2 };
            const dx = currentCenter.x - center.x;
            const dy = center.y - currentCenter.y;
            // Target must be to the left
            if (dx > 10) {
              const distance = dx + Math.abs(dy) * 3.5;
              if (distance < minDistance) {
                minDistance = distance;
                bestCandidate = el;
              }
            }
          }
          break;
        }

        case 'ArrowDown': {
          e.preventDefault();
          for (const el of focusableElements) {
            if (el === activeEl) continue;
            const r = el.getBoundingClientRect();
            const center: Point = { x: r.left + r.width / 2, y: r.top + r.height / 2 };
            const dy = center.y - currentCenter.y;
            const dx = center.x - currentCenter.x;
            // Target must be below
            if (dy > 15) {
              const distance = dy + Math.abs(dx) * 1.8;
              if (distance < minDistance) {
                minDistance = distance;
                bestCandidate = el;
              }
            }
          }
          break;
        }

        case 'ArrowUp': {
          e.preventDefault();
          for (const el of focusableElements) {
            if (el === activeEl) continue;
            const r = el.getBoundingClientRect();
            const center: Point = { x: r.left + r.width / 2, y: r.top + r.height / 2 };
            const dy = currentCenter.y - center.y;
            const dx = center.x - currentCenter.x;
            // Target must be above
            if (dy > 15) {
              const distance = dy + Math.abs(dx) * 1.8;
              if (distance < minDistance) {
                minDistance = distance;
                bestCandidate = el;
              }
            }
          }
          break;
        }

        case 'Enter': {
          // Trigger click on active item
          if (activeEl && activeEl.click) {
            activeEl.click();
          }
          break;
        }
      }

      if (bestCandidate) {
        bestCandidate.focus();
        bestCandidate.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
      }
    };

    window.addEventListener('keydown', handleTVKeyDown);
    return () => window.removeEventListener('keydown', handleTVKeyDown);
  }, [isTVMode, toggleTVMode]);

  return {
    isTVMode,
    toggleTVMode
  };
}
