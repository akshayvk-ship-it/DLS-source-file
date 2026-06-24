/* eslint-disable import/prefer-default-export */
import { useEffect, useState } from 'react';

/**
 * Detect user's browser scrollbar width
 * Returns 0 for overlay scrollbars (firefox, macos, some linux setups)
 */

const FALLBACK_SCROLLBAR_WIDTH = 20;

export function useScrollbarWidth(): number {
  const [scrollbarWidth, setScrollbarWidth] = useState(
    FALLBACK_SCROLLBAR_WIDTH,
  );

  useEffect(() => {
    const calculateScrollbarWidth = () => {
      // Outer div with scrollbar
      const outer = document.createElement('div');
      outer.style.visibility = 'hidden';
      outer.style.overflow = 'scroll';
      outer.style.width = '100px';
      outer.style.height = '100px';
      outer.style.position = 'absolute';
      outer.style.top = '-9999px';

      document.body.appendChild(outer);

      // Inner div with no scrollbar
      const inner = document.createElement('div');
      inner.style.width = '100%';
      outer.appendChild(inner);

      // Calculate the difference between the outer and inner divs which will be the scrollbar width
      const width = outer.offsetWidth - inner.offsetWidth;

      outer.remove();
      setScrollbarWidth(width);
    };

    calculateScrollbarWidth();
  }, []);

  return scrollbarWidth;
}
