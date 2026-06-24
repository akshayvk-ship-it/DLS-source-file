/* eslint-disable import/prefer-default-export */
/* eslint-disable react/no-array-index-key */
import React, { useCallback, useEffect, useRef, useState, useId } from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';

import { LineSkeletonProps } from '../types';
import { withRetryOverlay } from './WithRetryOverlay';

// eslint-disable-next-line
const LineSkeletonComponent: React.FC<LineSkeletonProps> = ({
  width,
  height,
  margins,
  animate = true,
  xAxisLabel = '',
  yAxisLabel = '',
}) => {
  const [stage, setStage] = useState<number>(0);
  const [loaderVisible, setLoaderVisible] = useState<boolean>(true);
  const [skeletonAnimate, setSkeletonAnimate] = useState<boolean>(false);
  const [drawProgress, setDrawProgress] = useState<number>(0); // 0 -> nothing, 1 -> full
  const pathRef = useRef<SVGPathElement | null>(null);
  const [pathLength, setPathLength] = useState<number>(0);

  const reactId = useId();
  // base chart area
  const chartWidth = width - margins.left - margins.right;
  const chartHeight = height - margins.top - margins.bottom;

  const yTickCount = 7;
  const xTickCount = 8;

  // inner chart area (inside labels)
  const spaceYAxisAvailable = yAxisLabel ? 22 : 0;
  const spaceXAxisLabelAvailable = xAxisLabel ? 34 : 0;

  const updatedChartWidth = chartWidth - spaceYAxisAvailable - 40;
  const updatedChartHeight = chartHeight - spaceXAxisLabelAvailable - 28;

  // --- staged loader + animation orchestration ---
  useEffect(() => {
    let stageInterval: ReturnType<typeof setInterval> | undefined;
    let drawInterval: ReturnType<typeof setInterval> | undefined;

    // 1) loader visible for 1s
    const loaderTimer = setTimeout(() => {
      setLoaderVisible(false);

      // 2) staged reveals: y-axis -> x-axis
      let current = 0;
      stageInterval = setInterval(() => {
        current += 1;
        setStage(current);

        if (current >= 3) {
          if (stageInterval) clearInterval(stageInterval);

          // 3) chart drawing: reset progress then animate from 0 -> 1
          setDrawProgress(0);

          let p = 0;
          const step = 0.1; // 10 steps
          const stepMs = 120; // 120ms per step

          drawInterval = setInterval(() => {
            p += step;
            if (p >= 1) {
              p = 1;
              setDrawProgress(p);
              if (drawInterval) clearInterval(drawInterval);
              // enable shimmer after chart fully drawn
              if (animate) {
                setTimeout(() => setSkeletonAnimate(true), 350);
              }
            } else {
              setDrawProgress(p);
            }
          }, stepMs);
        }
      }, 1000);
    }, 1000);

    return () => {
      clearTimeout(loaderTimer);
      if (stageInterval) clearInterval(stageInterval);
      if (drawInterval) clearInterval(drawInterval);
    };
  }, [animate]);

  // --- skeleton points based on UPDATED chart width/height (so they match x-axis) ---
  const generateSkeletonPoints = useCallback(() => {
    const points: Array<{ x: number; y: number }> = [];
    const stepX = updatedChartWidth / (xTickCount - 1 || 1);

    for (let i = 0; i < xTickCount; i += 1) {
      const x = i * stepX;
      const randomHeight = 0.3 + Math.random() * 0.4; // 30%–70% of height
      const y = updatedChartHeight * (1 - randomHeight);
      points.push({ x, y });
    }
    return points;
  }, [updatedChartWidth, updatedChartHeight, xTickCount]);

  const [skeletonPoints] = useState(() => generateSkeletonPoints());

  const createLinePath = (points: Array<{ x: number; y: number }>) => {
    if (points.length === 0) return '';

    let path = `M ${points[0]?.x} ${points[0]?.y}`;
    for (let i = 1; i < points.length; i += 1) {
      path += ` L ${points[i]?.x} ${points[i]?.y}`;
    }
    return path;
  };

  const createAreaPath = (points: Array<{ x: number; y: number }>) => {
    if (points.length === 0) return '';

    let path = `M ${points[0]?.x} ${updatedChartHeight}`;
    path += ` L ${points[0]?.x} ${points[0]?.y}`;

    for (let i = 1; i < points.length; i += 1) {
      path += ` L ${points[i]?.x} ${points[i]?.y}`;
    }

    path += ` L ${points[points.length - 1]?.x} ${updatedChartHeight}`;
    path += ' Z';
    return path;
  };

  const linePath = createLinePath(skeletonPoints);
  const areaPath = createAreaPath(skeletonPoints);

  // measure line path length AFTER path exists
  useEffect(() => {
    if (!pathRef.current) return;
    try {
      const len = pathRef.current.getTotalLength();
      setPathLength(len || 0);
    } catch {
      setPathLength(0);
    }
  }, [linePath]);

  // scale/opacity classes
  const hiddenScaleY = 'scale-y-0 opacity-0';
  const visibleScaleY = 'scale-y-100 opacity-100';
  const hiddenScaleX = 'scale-x-0 opacity-0';
  const visibleScaleX = 'scale-x-100 opacity-100';
  const scaleTransition =
    'transform transition-[transform,opacity] duration-1000 ease-in-out will-change-transform';

  // staged visibility
  const baseYAxisVisible = loaderVisible || stage >= 1;
  const baseXAxisVisible = loaderVisible || stage >= 2;
  const baseChartVisible = loaderVisible || stage >= 3;

  const yLabelClasses = baseYAxisVisible
    ? `${visibleScaleY} ${scaleTransition}`
    : `${hiddenScaleY} ${scaleTransition}`;
  const xAxisClasses = baseXAxisVisible
    ? `${visibleScaleX} ${scaleTransition} origin-left`
    : `${hiddenScaleX} ${scaleTransition}`;
  const chartWrapperClasses = baseChartVisible
    ? `${visibleScaleX} ${scaleTransition} origin-left`
    : `${hiddenScaleX} ${scaleTransition}`;

  // tick delays bottom -> top
  const tickDelays: string[] = [
    'delay-0',
    'delay-100',
    'delay-200',
    'delay-300',
    'delay-400',
    'delay-500',
    'delay-700',
  ];

  // point delays left -> right
  const pointDelays = [
    'delay-0',
    'delay-75',
    'delay-150',
    'delay-225',
    'delay-300',
    'delay-375',
    'delay-450',
    'delay-550',
  ];

  // effective drawing progress (during loader we keep it fully drawn)
  const effectiveProgress = loaderVisible ? 1 : drawProgress;

  // stroke dashoffset for line drawing
  const strokeDashoffset =
    pathLength > 0 ? pathLength * (1 - effectiveProgress) : 0;

  // reveal width for left→right
  const revealWidth = Math.max(
    0,
    Math.min(updatedChartWidth, updatedChartWidth * effectiveProgress),
  );

  // unique IDs to avoid collisions if multiple components on page
  const clipId = `area-clip-${reactId}`;
  const patternId = `grid-line-skel-${reactId}`;

  return (
    <SkeletonTheme
      baseColor="#e5e7eb"
      highlightColor="#f3f4f6"
      enableAnimation={skeletonAnimate}
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
          {/* Y-axis main label */}
          {yAxisLabel && (
            <div
              className={`${yLabelClasses} absolute top-[30%] origin-bottom delay-300`}
            >
              <Skeleton width={12} height={60} />
            </div>
          )}

          {/* Y-axis ticks */}
          <div
            className={`${yLabelClasses} absolute ${
              yAxisLabel ? 'ml-[22px]' : ''
            } flex flex-col justify-between py-1`}
            style={{ height: `${updatedChartHeight}px` }}
          >
            {Array.from({ length: yTickCount }, (_, i) => {
              const tickFromBottom = yTickCount - 1 - i;
              const delayClass =
                tickDelays[tickFromBottom] ?? tickDelays[tickDelays.length - 1];

              return (
                <div
                  key={i}
                  className={`${yLabelClasses} ${delayClass} flex h-8 origin-bottom items-center justify-end`}
                >
                  <Skeleton width={30} height={12} />
                </div>
              );
            })}
          </div>

          {/* Chart SVG */}
          <svg
            width={updatedChartWidth}
            height={updatedChartHeight}
            className={`ml-[40px] ${chartWrapperClasses}`}
            style={{
              marginLeft: `${40 + spaceYAxisAvailable}px`,
              overflow: 'visible',
            }}
            role="img"
            aria-hidden="true"
          >
            <defs>
              <pattern
                id={patternId}
                width="50"
                height={Math.max(1, updatedChartHeight / 6)}
                patternUnits="userSpaceOnUse"
              >
                <path
                  d={`M 50 0 L 0 0 0 ${Math.max(1, updatedChartHeight / 6)}`}
                  fill="none"
                  stroke="#f3f4f6"
                  strokeWidth="0.5"
                  strokeDasharray="4,4"
                />
              </pattern>

              {/* clipPath defined by areaPath */}
              <clipPath id={clipId}>
                <path d={areaPath} />
              </clipPath>
            </defs>

            {/* grid */}
            <rect
              width={updatedChartWidth}
              height={updatedChartHeight}
              fill={`url(#${patternId})`}
              opacity="0.3"
            />

            <g className={chartWrapperClasses}>
              {/* area fill clipped by mask left->right */}
              <g clipPath={`url(#${clipId})`}>
                <rect
                  x={0}
                  y={0}
                  width={revealWidth}
                  height={updatedChartHeight}
                  fill="#F7F7F8"
                  opacity={0.95}
                  style={{ transition: 'width 120ms linear' }}
                />
              </g>

              {/* shimmer overlay: place a Skeleton inside a foreignObject and clip it to the same areaPath */}
              <g clipPath={`url(#${clipId})`}>
                <foreignObject
                  x={0}
                  y={0}
                  width={updatedChartWidth}
                  height={updatedChartHeight}
                  style={{ pointerEvents: 'none' }}
                >
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    {/* put a left-aligned div with width = revealWidth to match the visible area */}
                    <div
                      style={{
                        width: `${revealWidth}px`,
                        height: '100%',
                        overflow: 'hidden',
                        transition: 'width 120ms linear',
                      }}
                    >
                      <div style={{ width: '100%', height: '100%' }}>
                        <Skeleton width="100%" height="100%" />
                      </div>
                    </div>
                  </div>
                </foreignObject>
              </g>

              {/* line drawing from left -> right */}
              <path
                ref={pathRef}
                d={linePath}
                fill="none"
                stroke="#d1d5db"
                strokeWidth="2"
                strokeDasharray={pathLength}
                strokeDashoffset={loaderVisible ? 0 : strokeDashoffset}
                style={{
                  transition: 'stroke-dashoffset 120ms linear',
                }}
              />
            </g>

            {/* points staggered left->right (they sit on top of where the line is) */}
            {skeletonPoints.map((point, i) => {
              const delayClass =
                pointDelays[i] ?? pointDelays[pointDelays.length - 1];
              const pointVisibleClass = baseChartVisible
                ? `scale-100 opacity-100`
                : `scale-0 opacity-0`;
              return (
                <g
                  key={i}
                  transform={`translate(${point.x}, ${point.y})`}
                  className={`${chartWrapperClasses} ${delayClass} transition-[transform,opacity] duration-700 ease-in-out`}
                >
                  <foreignObject x={-4} y={-4} width={8} height={8}>
                    <div className={pointVisibleClass}>
                      <Skeleton circle width={8} height={8} />
                    </div>
                  </foreignObject>
                </g>
              );
            })}
          </svg>

          {/* X-axis skeleton */}
          <div
            className={`${xAxisClasses} absolute`}
            style={{
              top: updatedChartHeight + 8,
              width: updatedChartWidth,
              marginLeft: `${40 + spaceYAxisAvailable}px`,
            }}
          >
            <Skeleton width={updatedChartWidth} height={12} />
          </div>

          {xAxisLabel && (
            <div
              className={`${xAxisClasses} absolute flex justify-center`}
              style={{
                top: updatedChartHeight + 30,
                width: updatedChartWidth,
                marginLeft: `${40 + spaceYAxisAvailable}px`,
              }}
            >
              <Skeleton width={80} height={12} />
            </div>
          )}
        </div>
      </div>
    </SkeletonTheme>
  );
};

export const LineSkeleton = withRetryOverlay(LineSkeletonComponent);
