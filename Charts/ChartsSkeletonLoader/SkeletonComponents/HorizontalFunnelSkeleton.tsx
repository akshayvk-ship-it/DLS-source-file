/* eslint-disable import/prefer-default-export */
/* eslint-disable react/no-array-index-key */
import React, { useId } from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import { withRetryOverlay } from './WithRetryOverlay';
import { HorizontalFunnelSkeletonProps } from '../types';
// eslint-disable-next-line
const HorizontalFunnelSkeletonComponent: React.FC<
  HorizontalFunnelSkeletonProps
  // eslint-disable-next-line react/function-component-definition
> = ({ width, height, margins, animate = true }) => {
  const segmentsCount = 4;
  const chartWidth = width - margins.left - margins.right;
  const centerY = height / 2;
  const reactId = useId();
  const funnelGradientId = `funnel-skeleton-gradient-${reactId}`;

  const createFunnelPath = (): string => {
    const startWidth = 120;
    const endWidth = 30;

    const path = `
      M 0 ${centerY - startWidth / 2}
      C ${chartWidth * 0.2} ${centerY - startWidth * 0.4}, ${chartWidth * 0.4} ${centerY - startWidth * 0.3}, ${chartWidth * 0.6} ${centerY - endWidth * 1.2}
      C ${chartWidth * 0.8} ${centerY - endWidth * 0.8}, ${chartWidth * 0.9} ${centerY - endWidth * 0.6}, ${chartWidth} ${centerY - endWidth / 2}
      L ${chartWidth} ${centerY + endWidth / 2}
      C ${chartWidth * 0.9} ${centerY + endWidth * 0.6}, ${chartWidth * 0.8} ${centerY + endWidth * 0.8}, ${chartWidth * 0.6} ${centerY + endWidth * 1.2}
      C ${chartWidth * 0.4} ${centerY + startWidth * 0.3}, ${chartWidth * 0.2} ${centerY + startWidth * 0.4}, 0 ${centerY + startWidth / 2}
      Z
    `;

    return path;
  };

  const funnelPath = createFunnelPath();

  return (
    <SkeletonTheme
      baseColor="#e5e7eb"
      highlightColor="#f3f4f6"
      enableAnimation={animate}
    >
      <div style={{ width, height, position: 'relative', background: '#fff' }}>
        <svg width={width} height={height}>
          <defs>
            <linearGradient
              id={funnelGradientId}
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor="#e5e7eb" />
              <stop offset="100%" stopColor="#d1d5db" />
            </linearGradient>
          </defs>

          <path
            d={funnelPath}
            fill={`url(#${funnelGradientId})`}
            opacity={0.7}
            transform={`translate(${margins.left}, 0)`}
          />
        </svg>

        {Array.from({ length: segmentsCount }, (_, i) => {
          const x = (chartWidth / segmentsCount) * i + 5;
          return (
            <React.Fragment key={`text-group-${i}`}>
              <div
                style={{
                  position: 'absolute',
                  left: margins.left + x,
                  top: margins.top - 15,
                }}
              >
                <Skeleton width={60} height={12} />
              </div>

              <div
                style={{
                  position: 'absolute',
                  left: margins.left + x,
                  top: margins.top + 8,
                }}
              >
                <Skeleton width={50} height={16} />
              </div>

              <div
                style={{
                  position: 'absolute',
                  left: margins.left + x,
                  top: height - 15,
                }}
              >
                <Skeleton width={40} height={14} />
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </SkeletonTheme>
  );
};

export const HorizontalFunnelSkeleton = withRetryOverlay(
  HorizontalFunnelSkeletonComponent,
);
