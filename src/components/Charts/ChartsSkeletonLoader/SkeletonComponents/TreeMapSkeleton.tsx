/* eslint-disable import/prefer-default-export */
import React, { useEffect, useId, useMemo, useRef, useState } from 'react';
import { TreeMapSkeletonProps } from '../types';
import { withRetryOverlay } from './WithRetryOverlay';

type Rect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

// eslint-disable-next-line
const TreeMapSkeletonComponent: React.FC<TreeMapSkeletonProps> = ({
  width,
  height,
  margins,
  animate = true,
  retryIsAutoPhase,
}) => {
  const nodePadding = 2;
  const chartBuildUpDurationMs = 900;

  const [showShimmer, setShowShimmer] = useState(true);
  const [revealProgress, setRevealProgress] = useState<number>(animate ? 0 : 1);
  const rafRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const uniqueId = useId();
  const clipId = `treemap-clip-${uniqueId}`;
  const revealClipId = `treemap-reveal-${uniqueId}`;
  const shimmerId = 'treemap-shimmer-gradient';
  const shimmerAnimRef = useRef<SVGAnimateElement | null>(null);
  const lastProgressRef = useRef<number>(-1);

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

  // Control shimmer visibility
  useEffect(() => {
    if (retryIsAutoPhase) {
      setShowShimmer(true);
    } else {
      setShowShimmer(false);
    }
  }, [retryIsAutoPhase]);

  // Gradually build up the chart from 0 to 100% over 1200ms.
  useEffect(() => {
    if (!animate) {
      setRevealProgress(1);
      return () => {};
    }

    startTimeRef.current = null;

    const step = (timestamp: number) => {
      if (startTimeRef.current === null) {
        startTimeRef.current = timestamp;
      }

      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.max(
        0,
        Math.min(1, elapsed / chartBuildUpDurationMs),
      );
      if (progress !== lastProgressRef.current) {
        lastProgressRef.current = progress;
        setRevealProgress(progress);
      }
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step);
      }
    };

    rafRef.current = requestAnimationFrame(step);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, [width, height, animate]);

  // Begin the shimmer animation from extreme left (start) once the chart build up animation is complete
  useEffect(() => {
    if (
      animate &&
      showShimmer &&
      revealProgress >= 1 &&
      shimmerAnimRef.current
    ) {
      const anim = shimmerAnimRef.current as unknown as {
        beginElement?: () => void;
      } | null;
      anim?.beginElement?.();
    }
  }, [animate, showShimmer, revealProgress]);

  return (
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
              <rect
                x={0}
                y={0}
                width={width * revealProgress}
                height={height}
              />
            </clipPath>

            <linearGradient
              id={shimmerId}
              gradientUnits="userSpaceOnUse"
              x1={0}
              y1={0}
              x2={250}
              y2={133}
              gradientTransform={
                animate ? undefined : `translate(-${width}, 0)`
              }
            >
              <stop offset="0%" stopColor="rgba(255, 255, 255, 0)" />
              <stop offset="30.06%" stopColor="rgba(255, 255, 255, 0)" />
              <stop offset="44%" stopColor="rgba(230, 232, 234, 0.55)" />
              <stop offset="49.46%" stopColor="rgba(230, 232, 234, 0.95)" />
              <stop offset="55%" stopColor="rgba(230, 232, 234, 0.55)" />
              <stop offset="100%" stopColor="rgba(255, 255, 255, 0)" />
              {animate && (
                <animateTransform
                  ref={shimmerAnimRef}
                  begin="indefinite"
                  attributeName="gradientTransform"
                  type="translate"
                  dur="1.6s"
                  repeatCount="indefinite"
                  from="-250 0"
                  to={`${width + 250} 0`}
                />
              )}
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

          {/* Shimmer overlay */}
          {showShimmer && revealProgress >= 1 && (
            <g clipPath={`url(#${clipId})`}>
              <rect
                x={0}
                y={0}
                width={width}
                height={height}
                fill={`url(#${shimmerId})`}
              />
            </g>
          )}

          {/* Outlines to show gutters */}
          {showShimmer && revealProgress >= 1 && (
            <g clipPath={`url(#${revealClipId})`}>
              {rects.map((r) => (
                <rect
                  key={`outline-${r.x}-${r.y}`}
                  x={r.x}
                  y={r.y}
                  width={r.width}
                  height={r.height}
                  fill="none"
                  stroke="#fff"
                />
              ))}
            </g>
          )}
        </svg>
      </div>
    </div>
  );
};

export const TreeMapSkeleton = withRetryOverlay(TreeMapSkeletonComponent);
