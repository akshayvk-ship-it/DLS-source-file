/* eslint-disable import/prefer-default-export */
interface VerticalGridLineProps {
  xValue: number;
  index?: number;
  devicePixelRatio: number;
  height: number;
  dashPatternId: string;
  solidFillColor?: string;
  heightAdjustment?: {
    effectiveMargins: { bottom: number; top: number };
    offset?: number;
  };
}

/**
 * Common vertical grid line component for charts.
 * Renders pixel-perfect vertical lines that work consistently across browsers including Firefox.
 *
 * @param xValue - The x-coordinate where the line should be rendered
 * @param index - Optional index to determine if this is the first line (for solid styling)
 * @param devicePixelRatio - The device pixel ratio for crisp rendering
 * @param height - The height of the grid line
 * @param dashPatternId - The ID of the SVG pattern to use for dashed lines
 * @param solidFillColor - Optional color for the first line (when index === 0)
 * @param heightAdjustment - Optional height adjustment for HorizontalBarChart compatibility
 */
export function VerticalGridLine({
  xValue,
  index,
  devicePixelRatio,
  height,
  dashPatternId,
  solidFillColor,
  heightAdjustment,
}: Readonly<VerticalGridLineProps>) {
  // Compute the CSS width that corresponds to 1 device pixel
  const devicePixel = 1 / devicePixelRatio;

  // Moves the line to sit exactly on physical pixel columns, avoiding sub‑pixel placement.
  const xPosition = Math.round(xValue / devicePixel) * devicePixel;

  // Calculate adjusted height (for HorizontalBarChart)
  let adjustedHeight = height;

  if (heightAdjustment) {
    const { effectiveMargins, offset = 20 } = heightAdjustment;
    adjustedHeight =
      height - effectiveMargins.bottom - effectiveMargins.top + offset;
  }

  const fillValue =
    index === 0 && solidFillColor ? solidFillColor : `url('#${dashPatternId}')`;

  return (
    <rect
      x={xPosition}
      y={0}
      width={devicePixel}
      height={adjustedHeight}
      fill={fillValue}
      shapeRendering="crispEdges"
    />
  );
}
