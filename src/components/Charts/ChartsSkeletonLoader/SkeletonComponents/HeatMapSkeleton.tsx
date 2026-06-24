/* eslint-disable import/prefer-default-export */
/* eslint-disable react/no-array-index-key */
import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import { HeatMapSkeletonProps } from '../types';
import { withRetryOverlay } from './WithRetryOverlay';
// eslint-disable-next-line
const HeatMapSkeletonComponent: React.FC<HeatMapSkeletonProps> = ({
  width,
  height,
  margins,
  animate = true,
  showLegendsLoader = false,
}) => {
  const rowCount = 7;
  const colCount = 12;
  const heatMapGap = 4;
  const heatMapBinRadius = 6;
  const yLabelWidth = 80;
  const xMax = width - margins.left - margins.right - yLabelWidth;
  const legendsSpacing = showLegendsLoader ? 74 : 0;
  const yMax = height - margins.top - margins.bottom - legendsSpacing;

  const binWidth = xMax / colCount;
  const binHeight = yMax / rowCount;

  const legendSkeletonWidth = width * 0.6;

  return (
    <SkeletonTheme
      baseColor="#e5e7eb"
      highlightColor="#f3f4f6"
      enableAnimation={animate}
    >
      <div
        style={{
          width,
          height,
          position: 'relative',
          background: '#fff',
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: margins.left,
            top: margins.top,
            width: yLabelWidth,
            height: yMax,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            paddingTop: binHeight / 2,
            paddingBottom: binHeight / 2,
          }}
        >
          {Array.from({ length: rowCount }, (_, i) => (
            <Skeleton key={`y-label-${i}`} width={70} height={12} />
          ))}
        </div>
        <div
          style={{
            position: 'absolute',
            left: margins.left + yLabelWidth,
            top: margins.top - 20,
            width: xMax,
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Skeleton width={xMax} height={12} />
        </div>
        <svg width={width} height={height}>
          <g
            transform={`translate(${margins.left + yLabelWidth}, ${margins.top})`}
          >
            {Array.from({ length: rowCount }, (_, row) =>
              // eslint-disable-next-line @typescript-eslint/no-shadow
              Array.from({ length: colCount }, (_, col) => {
                const x = col * binWidth + heatMapGap / 2;
                const y = row * binHeight + heatMapGap / 2;
                const rectWidth = binWidth - heatMapGap;
                const rectHeight = binHeight - heatMapGap;

                return (
                  <rect
                    key={`heatmap-cell-${row}-${col}`}
                    x={x}
                    y={y}
                    width={rectWidth}
                    height={rectHeight}
                    rx={heatMapBinRadius}
                    ry={heatMapBinRadius}
                    fill="#e5e7eb"
                  />
                );
              }),
            )}
          </g>
        </svg>
        {showLegendsLoader ? (
          <div
            className="absolute left-1/2 mt-6 flex translate-x-[-50%] justify-center"
            style={{
              top: `${height - legendsSpacing - margins.top}px`,
            }}
          >
            <Skeleton width={legendSkeletonWidth} height={50} />
          </div>
        ) : null}
      </div>
    </SkeletonTheme>
  );
};

export const HeatMapSkeleton = withRetryOverlay(HeatMapSkeletonComponent);
