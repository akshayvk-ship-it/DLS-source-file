/* eslint-disable import/prefer-default-export */
/* eslint-disable react/no-array-index-key */
import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import { BrushBarSkeletonProps } from '../types';
import { withRetryOverlay } from './WithRetryOverlay';

// eslint-disable-next-line
const BrushBarSkeletonComponent: React.FC<BrushBarSkeletonProps> = ({
  width,
  height,
  margins,
  animate = true,
}) => {
  const barCount = 35;
  const chartWidth = width - margins.left - margins.right;
  const chartHeight = height - margins.top - margins.bottom;

  const baselineY = chartHeight / 2;
  const barSpacing = 12;
  const barWidth = chartWidth / barCount - barSpacing;

  const successHeights = Array(barCount)
    .fill(0)
    .map(() => Math.random() * (chartHeight / 3) + chartHeight / 8);
  const failureHeights = Array(barCount)
    .fill(0)
    .map(() => Math.random() * (chartHeight / 4) + chartHeight / 10);

  return (
    <SkeletonTheme
      baseColor="#e5e7eb"
      highlightColor="#f3f4f6"
      enableAnimation={animate}
    >
      <div style={{ width, height, position: 'relative' }}>
        <div
          style={{
            position: 'absolute',
            left: margins.left,
            top: margins.top - 24,
          }}
        >
          <Skeleton width={40} height={16} />
        </div>

        <div
          style={{
            position: 'absolute',
            left: margins.left,
            top: margins.top + chartHeight + 8,
          }}
        >
          <Skeleton width={40} height={16} />
        </div>

        <div
          style={{
            position: 'absolute',
            left: margins.left + chartWidth - 160,
            top: margins.top - 24,
          }}
        >
          <Skeleton width={130} height={20} />
        </div>

        <div
          style={{
            position: 'absolute',
            left: margins.left + chartWidth - 160,
            top: margins.top + chartHeight + 8,
          }}
        >
          <Skeleton width={130} height={20} />
        </div>

        <svg width={width} height={height}>
          <g transform={`translate(${margins.left}, ${margins.top})`}>
            {Array(barCount)
              .fill(0)
              .map((_, index) => {
                const successHeight = successHeights[index] || 0;
                const failureHeight = failureHeights[index] || 0;
                const x = index * (chartWidth / barCount) + barSpacing / 2;
                const ySuccess = baselineY - successHeight;
                const yFailure = baselineY;
                const borderRadius = barWidth / 2;

                return (
                  <g key={`skeleton-bar-${index}`}>
                    {successHeight > 0 && (
                      <path
                        d={`
                        M ${x} ${ySuccess + borderRadius}
                        A ${borderRadius} ${borderRadius} 0 0 1 ${x + borderRadius} ${ySuccess}
                        L ${x + barWidth - borderRadius} ${ySuccess}
                        A ${borderRadius} ${borderRadius} 0 0 1 ${x + barWidth} ${ySuccess + borderRadius}
                        L ${x + barWidth} ${ySuccess + successHeight}
                        L ${x} ${ySuccess + successHeight}
                        Z
                      `}
                        fill="#e5e7eb"
                      />
                    )}
                    {failureHeight > 0 && (
                      <path
                        d={`
                        M ${x} ${yFailure}
                        L ${x} ${yFailure + failureHeight - borderRadius}
                        A ${borderRadius} ${borderRadius} 0 0 0 ${x + borderRadius} ${yFailure + failureHeight}
                        L ${x + barWidth - borderRadius} ${yFailure + failureHeight}
                        A ${borderRadius} ${borderRadius} 0 0 0 ${x + barWidth} ${yFailure + failureHeight - borderRadius}
                        L ${x + barWidth} ${yFailure}
                        Z
                      `}
                        fill="#F7F7F8"
                      />
                    )}
                  </g>
                );
              })}
          </g>
        </svg>

        <div
          style={{ position: 'absolute', top: margins.top, left: margins.left }}
        >
          {Array(barCount)
            .fill(0)
            .map((_, index) => {
              const successHeight = successHeights[index] || 0;
              const failureHeight = failureHeights[index] || 0;
              const x = index * (chartWidth / barCount) + barSpacing / 2;
              const ySuccess = baselineY - successHeight;
              const yFailure = baselineY;

              return (
                <div key={`skeleton-overlay-${index}`}>
                  {successHeight > 0 && (
                    <div
                      style={{
                        position: 'absolute',
                        left: x,
                        top: ySuccess,
                        width: barWidth,
                        height: successHeight,
                        clipPath: `polygon(
                        ${(barWidth / 2 / barWidth) * 100}% 0%, 
                        ${100 - (barWidth / 2 / barWidth) * 100}% 0%, 
                        100% ${(barWidth / 2 / successHeight) * 100}%, 
                        100% 100%, 
                        0% 100%, 
                        0% ${(barWidth / 2 / successHeight) * 100}%
                      )`,
                      }}
                    >
                      <Skeleton
                        width="100%"
                        height="100%"
                        baseColor="#e5e7eb"
                        highlightColor="#f3f4f6"
                        enableAnimation={animate}
                      />
                    </div>
                  )}

                  {failureHeight > 0 && (
                    <div
                      style={{
                        position: 'absolute',
                        left: x,
                        top: yFailure,
                        width: barWidth,
                        height: failureHeight,
                        clipPath: `polygon(
                        0% 0%, 
                        100% 0%, 
                        100% ${100 - (barWidth / 2 / failureHeight) * 100}%, 
                        ${100 - (barWidth / 2 / barWidth) * 100}% 100%, 
                        ${(barWidth / 2 / barWidth) * 100}% 100%, 
                        0% ${100 - (barWidth / 2 / failureHeight) * 100}%
                      )`,
                      }}
                    >
                      <Skeleton
                        width="100%"
                        height="100%"
                        baseColor="#F7F7F8"
                        highlightColor="#ffffff"
                        enableAnimation={animate}
                      />
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      </div>
    </SkeletonTheme>
  );
};

export const BrushBarSkeleton = withRetryOverlay(BrushBarSkeletonComponent);
