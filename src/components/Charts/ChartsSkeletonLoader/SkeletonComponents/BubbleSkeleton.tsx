/* eslint-disable import/prefer-default-export */
/* eslint-disable react/no-array-index-key */
import React, { useId } from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';

import { BubbleSkeletonProps } from '../types';
import { withRetryOverlay } from './WithRetryOverlay';

// eslint-disable-next-line
const BubbleSkeletonComponent: React.FC<BubbleSkeletonProps> = ({
  width,
  height,
  margins,
  animate = true,
}) => {
  const chartWidth = width - margins.left - margins.right;
  const chartHeight = height - margins.top - margins.bottom;

  const yTickCount = 7;
  const bubbleCount = 8;
  const bubblesPerColumn = [2, 3, 1, 4, 2, 3, 1, 2];

  const updatedChartWidth = chartWidth - 24;
  const updatedChartHeight = chartHeight - 28;

  const reactId = useId();
  const patternId = `bubble-pattern-${reactId}`;
  const gradientId = `gradient-${reactId}`;

  const generateBubbleData = () => {
    const bubbles: { x: number; y: number; size: number | undefined }[] = [];
    const columnWidth = updatedChartWidth / bubbleCount;

    bubblesPerColumn.forEach((count, columnIndex) => {
      const columnX = columnIndex * columnWidth + columnWidth / 2;

      for (let i = 0; i < count; i += 1) {
        const yPosition = (updatedChartHeight / (count + 1)) * (i + 1);

        const sizes = [6, 12, 18, 24, 30];
        const randomSize = sizes[Math.floor(Math.random() * sizes.length)];

        bubbles.push({
          x: columnX,
          y: yPosition,
          size: randomSize,
        });
      }
    });

    return bubbles;
  };

  const bubbleData = generateBubbleData();

  return (
    <SkeletonTheme
      baseColor="#e5e7eb"
      highlightColor="#f3f4f6"
      enableAnimation={animate}
    >
      <div className="relative bg-white" style={{ width, height }}>
        <div
          className="absolute"
          style={{
            left: margins.left,
            top: margins.top,
            width: chartWidth,
            height: chartHeight,
          }}
        >
          <div
            className="absolute flex h-full flex-col justify-between py-1"
            // style={{ left: margins.left }}
          >
            {Array.from({ length: yTickCount }, (_, i) => (
              <div key={i} className="flex h-8 items-center justify-end">
                <Skeleton width={30} height={12} />
              </div>
            ))}
          </div>

          <svg
            width={updatedChartWidth}
            height={updatedChartHeight}
            className="ml-[40px]"
          >
            <defs>
              <pattern
                id={patternId}
                width="50"
                height={updatedChartHeight / 6}
                patternUnits="userSpaceOnUse"
              >
                <path
                  d={`M 50 0 L 0 0 0 ${updatedChartHeight / 6}`}
                  fill="none"
                  stroke="#f3f4f6"
                  strokeWidth="0.5"
                  strokeDasharray="4,4"
                />
              </pattern>

              <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#e5e7eb">
                  {animate && (
                    <animate
                      attributeName="stop-color"
                      values="#e5e7eb;#f3f4f6;#e5e7eb"
                      dur="2s"
                      repeatCount="indefinite"
                    />
                  )}
                </stop>
                <stop offset="50%" stopColor="#f3f4f6">
                  {animate && (
                    <animate
                      attributeName="stop-color"
                      values="#f3f4f6;#e5e7eb;#f3f4f6"
                      dur="2s"
                      repeatCount="indefinite"
                    />
                  )}
                </stop>
                <stop offset="100%" stopColor="#e5e7eb">
                  {animate && (
                    <animate
                      attributeName="stop-color"
                      values="#e5e7eb;#f3f4f6;#e5e7eb"
                      dur="2s"
                      repeatCount="indefinite"
                    />
                  )}
                </stop>
              </linearGradient>
            </defs>

            <rect
              width={updatedChartWidth}
              height={updatedChartHeight}
              fill={`url(#${patternId})`}
              opacity="0.3"
            />

            {bubbleData.map((bubble, index) => (
              <circle
                key={index}
                cx={bubble.x}
                cy={bubble.y}
                r={bubble.size}
                fill={`url(#${gradientId})`}
                opacity="0.8"
              >
                {animate && (
                  <animate
                    attributeName="opacity"
                    values="0.6;1;0.6"
                    dur="2s"
                    repeatCount="indefinite"
                    begin={`${index * 0.1}s`}
                  />
                )}
              </circle>
            ))}
          </svg>
          <div
            className="absolute ml-10"
            style={{
              top: updatedChartHeight + 8,
              width: updatedChartWidth,
            }}
          >
            <Skeleton width={updatedChartWidth - 15} height={12} />
          </div>
        </div>
      </div>
    </SkeletonTheme>
  );
};

export const BubbleSkeleton = withRetryOverlay(BubbleSkeletonComponent);
