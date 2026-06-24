/* eslint-disable import/prefer-default-export */

import { useId, useMemo } from 'react';
import DataNotAvailable, { DataNotAvailableProps } from '../DataNotAvailable';

type Rect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

interface TreeMapNoDataSkeletonProps extends DataNotAvailableProps {
  width: number;
  height: number;
  margins: ChartMargins;
}

interface ChartMargins {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

function TreeMapNoDataSkeleton({
  height,
  width,
  margins,
  ...dataNotAvailableProps
}: Readonly<TreeMapNoDataSkeletonProps>) {
  const nodePadding = 2;

  const uniqueId = useId();
  const clipId = `treemap-clip-${uniqueId}`;
  const revealClipId = `treemap-reveal-${uniqueId}`;
  const shimmerId = 'treemap-shimmer-gradient';

  const rects = useMemo<Rect[]>(() => {
    const col1Width = Math.floor(width * 0.27);
    const col2Width = Math.floor(width * 0.27);
    const col3Width = Math.floor(width * 0.23);
    const rightWidth = Math.max(0, width - (col1Width + col2Width + col3Width));
    const col1X = 0;
    const col2X = col1Width;
    const col3X = col1Width + col2Width;
    const rightX = col1Width + col2Width + col3Width;

    const results: Rect[] = [];

    // First two full-height columns
    results.push({
      x: col1X + nodePadding,
      y: nodePadding,
      width: Math.max(0, col1Width - nodePadding * 2),
      height: Math.max(0, height - nodePadding * 2),
    });
    results.push({
      x: col2X + nodePadding,
      y: nodePadding,
      width: Math.max(0, col2Width - nodePadding * 2),
      height: Math.max(0, height - nodePadding * 2),
    });

    // Third column: large top block + two smaller blocks below
    const col3TopH = Math.floor(height * 0.42);
    const col3BottomH = height - col3TopH;
    results.push({
      x: col3X + nodePadding,
      y: nodePadding,
      width: Math.max(0, col3Width - nodePadding * 2),
      height: Math.max(0, col3TopH - nodePadding * 2),
    });
    const col3HalfW = Math.floor(col3Width / 2);
    results.push({
      x: col3X + nodePadding,
      y: col3TopH + nodePadding,
      width: Math.max(0, col3HalfW - nodePadding * 2),
      height: Math.max(0, col3BottomH - nodePadding * 2),
    });
    results.push({
      x: col3X + col3HalfW + nodePadding,
      y: col3TopH + nodePadding,
      width: Math.max(0, col3Width - col3HalfW - nodePadding * 2),
      height: Math.max(0, col3BottomH - nodePadding * 2),
    });

    // Rightmost area
    const r1 = Math.floor(rightWidth * 0.28);
    const r2 = Math.floor(rightWidth * 0.24);
    const r3 = Math.floor(rightWidth * 0.24);
    const r4 = Math.max(0, rightWidth - (r1 + r2 + r3));

    const r1X = rightX;
    const r2X = rightX + r1;
    const r3X = rightX + r1 + r2;
    const r4X = rightX + r1 + r2 + r3;

    // r1: rows
    const r1RowH = height / 6;
    results.push({
      x: r1X + nodePadding,
      y: nodePadding,
      width: Math.max(0, r1 - nodePadding * 2),
      height: Math.max(0, r1RowH - nodePadding * 2),
    });
    results.push({
      x: r1X + nodePadding,
      y: r1RowH + nodePadding,
      width: Math.max(0, r1 - nodePadding * 2),
      height: Math.max(0, r1RowH - nodePadding * 2),
    });

    // middle wide bar across r1 + r2
    results.push({
      x: r1X + nodePadding,
      y: 2 * r1RowH + nodePadding,
      width: Math.max(0, r1 + r2 - nodePadding * 2),
      height: Math.max(0, r1RowH - nodePadding * 2),
    });

    // bottom combined tall
    results.push({
      x: r1X + nodePadding,
      y: 3 * r1RowH + nodePadding,
      width: Math.max(0, r1 - nodePadding * 2),
      height: Math.max(0, 3 * r1RowH - nodePadding * 2),
    });

    // r2 stack
    results.push({
      x: r2X + nodePadding,
      y: nodePadding,
      width: Math.max(0, r2 - nodePadding * 2),
      height: Math.max(0, r1RowH - nodePadding * 2),
    });
    results.push({
      x: r2X + nodePadding,
      y: r1RowH + nodePadding,
      width: Math.max(0, r2 - nodePadding * 2),
      height: Math.max(0, r1RowH - nodePadding * 2),
    });
    results.push({
      x: r2X + nodePadding,
      y: 3 * r1RowH + nodePadding,
      width: Math.max(0, r2 - nodePadding * 2),
      height: Math.max(0, r1RowH - nodePadding * 2),
    });
    results.push({
      x: r2X + nodePadding,
      y: 4 * r1RowH + nodePadding,
      width: Math.max(0, r2 - nodePadding * 2),
      height: Math.max(0, r1RowH - nodePadding * 2),
    });
    results.push({
      x: r2X + nodePadding,
      y: 5 * r1RowH + nodePadding,
      width: Math.max(0, r2 - nodePadding * 2),
      height: Math.max(0, r1RowH - nodePadding * 2),
    });

    // r3 column
    const r3TopH = Math.floor(height * 0.28);
    const r3BottomH = height - r3TopH;
    const r3CellH = r3BottomH / 3;
    results.push({
      x: r3X + nodePadding,
      y: nodePadding,
      width: Math.max(0, r3 - nodePadding * 2),
      height: Math.max(0, r3TopH - nodePadding * 2),
    });
    for (let i = 0; i < 3; i += 1) {
      results.push({
        x: r3X + nodePadding,
        y: r3TopH + i * r3CellH + nodePadding,
        width: Math.max(0, r3 - nodePadding * 2),
        height: Math.max(0, r3CellH - nodePadding * 2),
      });
    }

    // r4 grid
    const gridRows = 3;
    const gridCols = 2;
    const cellWidth = r4 / gridCols;
    const cellHeight = height / gridRows;
    results.push({
      x: r4X + nodePadding,
      y: nodePadding,
      width: Math.max(0, cellWidth - nodePadding * 2),
      height: Math.max(0, cellHeight - nodePadding * 2),
    });
    results.push({
      x: r4X + cellWidth + nodePadding,
      y: nodePadding,
      width: Math.max(0, cellWidth - nodePadding * 2),
      height: Math.max(0, cellHeight - nodePadding * 2),
    });
    results.push({
      x: r4X + nodePadding,
      y: cellHeight + nodePadding,
      width: Math.max(0, r4 - nodePadding * 2),
      height: Math.max(0, cellHeight - nodePadding * 2),
    });
    results.push({
      x: r4X + nodePadding,
      y: 2 * cellHeight + nodePadding,
      width: Math.max(0, cellWidth - nodePadding * 2),
      height: Math.max(0, cellHeight - nodePadding * 2),
    });
    results.push({
      x: r4X + cellWidth + nodePadding,
      y: 2 * cellHeight + nodePadding,
      width: Math.max(0, cellWidth - nodePadding * 2),
      height: Math.max(0, cellHeight - nodePadding * 2),
    });

    return results;
  }, [height, nodePadding, width]);

  return (
    <DataNotAvailable width={width} height={height} {...dataNotAvailableProps}>
      <div className="relative bg-white" style={{ width, height }}>
        <div
          className="absolute"
          style={{
            left: margins.left,
            top: margins.top,
            width,
            height,
          }}
        >
          <svg width={width} height={height}>
            <defs>
              <clipPath id={clipId}>
                {rects.map((r) => (
                  <rect
                    key={`clip-${r.x}-${r.y}`}
                    x={r.x}
                    y={r.y}
                    width={r.width}
                    height={r.height}
                    rx={2}
                    ry={2}
                  />
                ))}
              </clipPath>
              <clipPath id={revealClipId}>
                <rect x={0} y={0} width={width} height={height} />
              </clipPath>

              <linearGradient
                id={shimmerId}
                gradientUnits="userSpaceOnUse"
                x1={0}
                y1={0}
                x2={250}
                y2={133}
                gradientTransform={`translate(-${width}, 0)`}
              >
                <stop offset="0%" stopColor="rgba(255, 255, 255, 0)" />
                <stop offset="30.06%" stopColor="rgba(255, 255, 255, 0)" />
                <stop offset="44%" stopColor="rgba(230, 232, 234, 0.55)" />
                <stop offset="49.46%" stopColor="rgba(230, 232, 234, 0.95)" />
                <stop offset="55%" stopColor="rgba(230, 232, 234, 0.55)" />
                <stop offset="100%" stopColor="rgba(255, 255, 255, 0)" />
              </linearGradient>
            </defs>

            {/* Base background blocks */}
            <g clipPath={`url(#${revealClipId})`}>
              {rects.map((r) => (
                <rect
                  key={`base-${r.x}-${r.y}`}
                  x={r.x}
                  y={r.y}
                  width={r.width}
                  height={r.height}
                  fill="#F7F7F8"
                  rx={2}
                  ry={2}
                />
              ))}
            </g>
          </svg>
        </div>
      </div>
    </DataNotAvailable>
  );
}

export { TreeMapNoDataSkeleton };
