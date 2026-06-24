import { FilterConfig } from './types';

export const sortCompareValue = (sortOrder: string) => {
  if (sortOrder !== 'asc' && sortOrder !== 'desc') return 0;
  return sortOrder === 'asc' ? 1 : -1;
};
export const sortCompare = (
  a: number | string | boolean | Array<string>,
  b: number | string | boolean | Array<string>,
  orderSort: string,
) => {
  if (!a || !b) return 0;
  if (typeof a === 'number' && typeof b === 'number') {
    if (a > b) {
      return 1 * sortCompareValue(orderSort);
    }

    if (b > a) {
      return -1 * sortCompareValue(orderSort);
    }

    return 0;
  }

  return (
    a.toString().localeCompare(b.toString(), 'en', {
      numeric: true,
    }) * sortCompareValue(orderSort)
  );
};

export const getFilterPosition = (
  position: FilterConfig['position'],
  rect: DOMRect,
  popupHeight: number = 200,
) => {
  const spaceBelow = window.innerHeight - rect.bottom;
  const spaceAbove = rect.top;
  const shouldFlipUp = spaceBelow < popupHeight && spaceAbove > spaceBelow;

  const top = shouldFlipUp ? rect.top - popupHeight - 8 : rect.bottom + 8;

  if (position === 'right') {
    return {
      top,
      left: rect.left + rect.width,
      transform: 'translateX(-100%)',
    };
  }

  if (position === 'left') {
    return { top, left: rect.left };
  }

  return { top, left: rect.left, transform: 'translateX(-50%)' };
};

export const getSafeContainer = (
  container: HTMLElement | undefined,
): HTMLElement => {
  if (!container) return document.body;

  if (!(container instanceof HTMLElement)) return document.body;

  if (!document.body.contains(container)) return document.body;

  return container;
};
