/* eslint-disable import/prefer-default-export */

import { useEffect, useRef, useState } from 'react';

export function useIsCellOverflowing(
  headerRefsMap: React.RefObject<Map<string, HTMLDivElement>>,
  columnKey: string,
) {
  const textRef = useRef<HTMLDivElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  useEffect(() => {
    const textEl = textRef.current;
    const headerEl = headerRefsMap.current?.get(columnKey);
    if (!textEl || !headerEl) return () => {};

    const check = () => {
      const headerWidth = headerEl.getBoundingClientRect().width;
      const textWidth = textEl.scrollWidth;
      setIsOverflowing(textWidth > headerWidth);
    };

    check();

    const observer = new ResizeObserver(check);
    observer.observe(textEl);
    observer.observe(headerEl); // re-check if header resizes too

    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [columnKey]);

  return { textRef, isOverflowing };
}
