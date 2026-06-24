export type ColorFormat = 'hex' | 'rgb';

export interface HSV {
  h: number;
  s: number;
  v: number;
}

export interface RGB {
  r: number;
  g: number;
  b: number;
}

// HSV to RGB
export function hsvToRgb(hsv: HSV): RGB {
  const { h } = hsv;
  const s = hsv.s / 100;
  const v = hsv.v / 100;

  const c = v * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = v - c;

  let r1 = 0;
  let g1 = 0;
  let b1 = 0;

  if (h >= 0 && h < 60) {
    r1 = c;
    g1 = x;
    b1 = 0;
  } else if (h >= 60 && h < 120) {
    r1 = x;
    g1 = c;
    b1 = 0;
  } else if (h >= 120 && h < 180) {
    r1 = 0;
    g1 = c;
    b1 = x;
  } else if (h >= 180 && h < 240) {
    r1 = 0;
    g1 = x;
    b1 = c;
  } else if (h >= 240 && h < 300) {
    r1 = x;
    g1 = 0;
    b1 = c;
  } else if (h >= 300 && h < 360) {
    r1 = c;
    g1 = 0;
    b1 = x;
  }

  const r = Math.round((r1 + m) * 255);
  const g = Math.round((g1 + m) * 255);
  const b = Math.round((b1 + m) * 255);

  return { r, g, b };
}

// RGB to HSV
export function rgbToHsv(rgb: RGB): HSV {
  const rNorm = rgb.r / 255;
  const gNorm = rgb.g / 255;
  const bNorm = rgb.b / 255;

  const max = Math.max(rNorm, gNorm, bNorm);
  const min = Math.min(rNorm, gNorm, bNorm);
  const delta = max - min;

  let h = 0;
  if (delta === 0) {
    h = 0;
  } else if (max === rNorm) {
    h = 60 * (((gNorm - bNorm) / delta) % 6);
  } else if (max === gNorm) {
    h = 60 * ((bNorm - rNorm) / delta + 2);
  } else if (max === bNorm) {
    h = 60 * ((rNorm - gNorm) / delta + 4);
  }
  if (h < 0) h += 360;

  const s = max === 0 ? 0 : (delta / max) * 100;
  const v = max * 100;

  return { h, s, v };
}

// RGB to HEX
export function rgbToHex(rgb: RGB): string {
  const rHex = rgb.r.toString(16).padStart(2, '0');
  const gHex = rgb.g.toString(16).padStart(2, '0');
  const bHex = rgb.b.toString(16).padStart(2, '0');
  return `#${rHex}${gHex}${bHex}`.toUpperCase();
}

// HEX to RGB
export function hexToRgb(hex: string): RGB | null {
  const hexString = hex.replace(/^#/, '');
  if (hexString.length !== 6) return null;

  const r = parseInt(hexString.slice(0, 2), 16);
  const g = parseInt(hexString.slice(2, 4), 16);
  const b = parseInt(hexString.slice(4, 6), 16);

  return { r, g, b };
}
