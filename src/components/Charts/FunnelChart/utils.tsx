// eslint-disable-next-line import/prefer-default-export
export const generateDescendingAlphaHexColors = (
  baseHex: string,
  count: number,
): string[] => {
  const hex = baseHex.replace('#', '');
  if (hex.length !== 6)
    throw new Error('Base color must be a valid 6-digit hex code');

  const maxOpacity = 1;
  const minOpacity = 0.2;
  const step = (maxOpacity - minOpacity) / Math.max(1, count - 1);

  const colors: string[] = [];

  for (let i = 0; i < count; i += 1) {
    const opacity = maxOpacity - i * step;
    const alphaHex = Math.round(opacity * 255)
      .toString(16)
      .padStart(2, '0')
      .toUpperCase();
    colors.push(`#${hex}${alphaHex}`);
  }

  return colors.reverse();
};
