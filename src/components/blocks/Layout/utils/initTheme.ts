interface ColorVariants {
  main: string;
  hover: string;
  active: string;
}

const OPACITY_LEVELS = {
  main: 0.25,
  hover: 0.45,
  active: 0.65,
} as const;

/**
 * Converts a hex color to rgba format
 * @param hex - Hex color string (with or without #)
 * @param opacity - Opacity value between 0 and 1
 * @returns RGBA color string
 */
function hexToRgba(hex: string, opacity: number): string {
  const cleanedHex = hex.replace('#', '');
  const r = Number.parseInt(cleanedHex.substring(0, 2), 16);
  const g = Number.parseInt(cleanedHex.substring(2, 4), 16);
  const b = Number.parseInt(cleanedHex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

/**
 * Converts RGB/RGBA color string to RGBA with specified opacity
 * @param color - Color in rgb() or rgba() format
 * @param opacity - Target opacity (0-1)
 * @returns RGBA color string
 */
function rgbToRgba(color: string, opacity: number): string {
  const regex = /rgba?\((\d+),\s*(\d+),\s*(\d+)/;
  const match = regex.exec(color);
  if (match) {
    const [, r, g, b] = match;
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }
  return color;
}

/**
 * Gets the computed color value from a Tailwind theme color by creating
 * a temporary element with the corresponding Tailwind class
 * @param colorPath - The color path (e.g., 'layout.brand')
 * @returns The resolved color value or null
 */
function getTailwindColor(colorPath: string): string | null {
  try {
    const tempEl = document.createElement('div');
    tempEl.style.cssText = 'display:none;position:absolute;pointer-events:none';
    tempEl.className = `bg-${colorPath.replaceAll('.', '-')}`;

    document.body.appendChild(tempEl);
    const color = getComputedStyle(tempEl).backgroundColor;
    tempEl.remove();

    const isValidColor =
      color && color !== 'rgba(0, 0, 0, 0)' && color !== 'transparent';

    return isValidColor ? color : null;
  } catch {
    return null;
  }
}

/**
 * Creates color variants with different opacity levels
 * @param color - Base color in any CSS format
 * @returns Object with main, hover, and active color variants or null
 */
function createColorVariants(color: string): ColorVariants | null {
  // Handle hex colors
  if (color.startsWith('#')) {
    return {
      main: hexToRgba(color, OPACITY_LEVELS.main),
      hover: hexToRgba(color, OPACITY_LEVELS.hover),
      active: hexToRgba(color, OPACITY_LEVELS.active),
    };
  }

  // Handle rgb/rgba colors
  if (color.startsWith('rgb')) {
    return {
      main: rgbToRgba(color, OPACITY_LEVELS.main),
      hover: rgbToRgba(color, OPACITY_LEVELS.hover),
      active: rgbToRgba(color, OPACITY_LEVELS.active),
    };
  }

  return null;
}

/**
 * Sets CSS custom properties for scrollbar colors
 * @param variants - Color variants for different states
 */
function setScrollBarColors(variants: ColorVariants): void {
  const { style } = document.documentElement;
  style.setProperty('--layout-sidebar-main', variants.main);
  style.setProperty('--layout-sidebar-hover', variants.hover);
  style.setProperty('--layout-sidebar-active', variants.active);
}

/**
 * Configures scrollbar colors based on the layout.brand Tailwind color
 */
function configureScrollbarColors(): void {
  const brandColor = getTailwindColor('layout.brand');

  if (!brandColor) return;

  const colorVariants = createColorVariants(brandColor);

  if (!colorVariants) return;

  setScrollBarColors(colorVariants);
}

/**
 * Initializes theme configuration with proper DOM ready checks
 */
function initTheme(): void {
  if (globalThis.window === undefined) return;
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', configureScrollbarColors);
  } else {
    configureScrollbarColors();
  }
}

export default initTheme;
