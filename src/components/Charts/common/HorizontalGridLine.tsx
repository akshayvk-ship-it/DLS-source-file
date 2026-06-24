/* eslint-disable import/prefer-default-export */
interface HorizontalGridLineProps {
  yValue: number;
  index?: number;
  devicePixelRatio: number;
  width: number;
  dashPatternId: string;
  solidFillColor?: string;
}

/**
 * Common horizontal grid line component for charts.
 * Renders pixel-perfect horizontal lines that work consistently across browsers including Firefox.
 *
 * @param yValue - The y-coordinate where the line should be rendered
 * @param index - Optional index to determine if this is the first line (for solid styling)
 * @param devicePixelRatio - The device pixel ratio for crisp rendering
 * @param width - The width of the grid line
 * @param dashPatternId - The ID of the SVG pattern to use for dashed lines
 * @param solidFillColor - Optional color for the first line (when index === 0), defaults to 'rgba(208, 211, 216, 1)'
 */
export function HorizontalGridLine({
  yValue,
  index,
  devicePixelRatio,
  width,
  dashPatternId,
  solidFillColor = 'rgba(208, 211, 216, 1)',
}: Readonly<HorizontalGridLineProps>) {
  // Compute the CSS height that corresponds to 1 device pixel
  const devicePixel = 1 / devicePixelRatio;

  // Moves the line to sit exactly on physical pixel rows, avoiding sub‑pixel placement.
  const yPosition = Math.round(yValue / devicePixel) * devicePixel;

  const fillValue = index === 0 ? solidFillColor : `url('#${dashPatternId}')`;

  return (
    <rect
      x={0}
      y={yPosition}
      width={width}
      height={devicePixel}
      fill={fillValue}
      shapeRendering="crispEdges"
    />
  );
}
