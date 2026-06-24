import { OpacityValueType } from './types';

export function normalizeOpacity(opacity: OpacityValueType): number {
  return opacity / 100;
}

export function lightenColor(color: string, factor: number) {
  if (color.startsWith('#')) {
    const hex = color.slice(1);
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    // Lighten by blending with white
    const newR = Math.round(r + (255 - r) * factor);
    const newG = Math.round(g + (255 - g) * factor);
    const newB = Math.round(b + (255 - b) * factor);

    // Convert back to hex
    const toHex = (num: number) => num.toString(16).padStart(2, '0');
    return `#${toHex(newR)}${toHex(newG)}${toHex(newB)}`;
  }
  return color;
}
