function hexToRgb(hex: string): string {
  const cleanedHex = hex.replace('#', '');
  const r = parseInt(cleanedHex.substring(0, 2), 16);
  const g = parseInt(cleanedHex.substring(2, 4), 16);
  const b = parseInt(cleanedHex.substring(4, 6), 16);
  return `${r}, ${g}, ${b}`;
}

export default hexToRgb;
