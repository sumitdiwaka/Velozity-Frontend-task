import { useState, useRef, useCallback, useEffect } from 'react';

interface VirtualScrollOptions {
  itemCount: number;
  itemHeight: number;
  containerHeight: number;
  buffer?: number;
}

interface VirtualScrollResult {
  startIndex: number;
  endIndex: number;
  offsetY: number;
  totalHeight: number;
  containerRef: React.RefObject<HTMLDivElement | null>;
  onScroll: () => void;
}

/**
 * Custom virtual scrolling hook.
 * Only renders rows in the visible window + a buffer above and below.
 * No external library used.
 */
export function useVirtualScroll({
  itemCount,
  itemHeight,
  containerHeight,
  buffer = 5,
}: VirtualScrollOptions): VirtualScrollResult {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);

  const totalHeight = itemCount * itemHeight;

  // How many items fit in the viewport
  const visibleCount = Math.ceil(containerHeight / itemHeight);

  // First visible index (clamped)
  const rawStart = Math.floor(scrollTop / itemHeight);
  const startIndex = Math.max(0, rawStart - buffer);

  // Last index to render (clamped to itemCount)
  const endIndex = Math.min(itemCount - 1, rawStart + visibleCount + buffer);

  // Top offset so rendered rows appear in the correct position
  const offsetY = startIndex * itemHeight;

  const onScroll = useCallback(() => {
    if (containerRef.current) {
      setScrollTop(containerRef.current.scrollTop);
    }
  }, []);

  // Listen for programmatic scroll resets (e.g., after filter change)
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const handler = () => setScrollTop(el.scrollTop);
    el.addEventListener('scroll', handler, { passive: true });
    return () => el.removeEventListener('scroll', handler);
  }, []);

  return { startIndex, endIndex, offsetY, totalHeight, containerRef, onScroll };
}