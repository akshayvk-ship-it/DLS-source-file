import { FunnelPathOptions } from './types';

function createFunnelPath({
  topWidth,
  bottomWidth,
  segmentsCount,
  chartHeight,
  centerX,
  margins,
}: FunnelPathOptions): string {
  const segmentHeight = chartHeight / segmentsCount;

  let path = `M ${centerX - topWidth / 2} ${margins.top}`; // start top-left
  let currentWidth = topWidth;
  let y = margins.top;

  const segments: {
    topWidth: number;
    bottomWidth: number;
    yLine: number;
    yCurveStart: number;
    yBottom: number;
  }[] = [];

  // LEFT EDGE
  for (let i = 0; i < segmentsCount; i += 1) {
    const nextWidth =
      bottomWidth +
      ((topWidth - bottomWidth) * (segmentsCount - i - 1)) / segmentsCount;
    const nextY = y + segmentHeight;

    const yLine = y + segmentHeight * 0.8;
    const yCurveStart = y + segmentHeight * 0.9;

    path += ` L ${centerX - currentWidth / 2} ${yLine}`;
    path += ` C ${centerX - currentWidth / 2} ${yCurveStart}, 
                   ${centerX - nextWidth / 2} ${nextY - segmentHeight * 0.1}, 
                   ${centerX - nextWidth / 2} ${nextY}`;

    segments.push({
      topWidth: currentWidth,
      bottomWidth: nextWidth,
      yLine,
      yCurveStart,
      yBottom: nextY,
    });

    y = nextY;
    currentWidth = nextWidth;
  }

  // BOTTOM EDGE
  path += ` L ${centerX + currentWidth / 2} ${y}`;

  // RIGHT EDGE
  for (let i = segmentsCount - 1; i >= 0; i -= 1) {
    const seg = segments[i];
    if (!seg) break;

    path += ` L ${centerX + seg.bottomWidth / 2} ${seg.yBottom}`;
    path += ` C ${centerX + seg.bottomWidth / 2} ${
      seg.yBottom - segmentHeight * 0.1
    }, 
               ${centerX + seg.topWidth / 2} ${seg.yCurveStart}, 
               ${centerX + seg.topWidth / 2} ${seg.yLine}`;
  }

  path += ` L ${centerX + topWidth / 2} ${margins.top}`;
  path += ' Z';

  return path;
}

export default createFunnelPath;
