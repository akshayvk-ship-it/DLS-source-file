/* eslint-disable import/prefer-default-export */
import React, { useEffect, useState } from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import { HorizontalBarSkeletonProps } from '../types';
import { withRetryOverlay } from './WithRetryOverlay';

// eslint-disable-next-line
const HorizontalBarSkeletonComponent: React.FC<HorizontalBarSkeletonProps> = ({
  width,
  height,
  margins,
  animate = true,
  showXAxisLabel = true,
  showYAxisLabel = true,
}) => {
  const [stage, setStage] = useState<number>(0);
  const [loaderVisible, setLoaderVisible] = useState<boolean>(true);
  const [skeletonAnimate, setSkeletonAnimate] = useState<boolean>(false);
  const [revealedBarIndex, setRevealedBarIndex] = useState<number>(-1); // -1 = none revealed yet

  const BAR_COUNT = 7;

  useEffect(() => {
    let stageInterval: ReturnType<typeof setInterval> | undefined;
    let barInterval: ReturnType<typeof setInterval> | undefined;

    const loaderTimer = setTimeout(() => {
      setLoaderVisible(false);

      // stage animation: 1,2,3 (y-axis, x-axis, bars wrapper)
      let current = 0;
      stageInterval = setInterval(() => {
        current += 1;
        setStage(current);

        if (current >= 3) {
          if (stageInterval) clearInterval(stageInterval);

          // start revealing bars sequentially after final stage
          let barIdx = 0;
          setRevealedBarIndex(-1);
          // small initial delay so wrapper reveal can settle; then reveal bars one-by-one
          barInterval = setInterval(() => {
            setRevealedBarIndex((prev) => {
              const next = prev + 1;
              return next;
            });

            barIdx += 1;
            if (barIdx >= BAR_COUNT) {
              // all bars scheduled to reveal; clear interval and enable shimmer after a tiny delay
              if (barInterval) clearInterval(barInterval);
              // give last bar animation time to finish before enabling shimmer
              setTimeout(() => {
                if (animate) setSkeletonAnimate(true);
              }, 350);
            }
          }, 180); // interval between each bar reveal (ms)
        }
      }, 1000);
    }, 1000); // initial loader visible for 1000ms

    return () => {
      clearTimeout(loaderTimer);
      if (stageInterval) clearInterval(stageInterval);
      if (barInterval) clearInterval(barInterval);
    };
  }, [animate]);

  const chartWidth = width - margins.left - margins.right;
  const chartHeight = height - margins.top - margins.bottom;

  const spaceYAxisLabelAvailable = showYAxisLabel ? 22 : 0;
  const updatedChartWidth = chartWidth - spaceYAxisLabelAvailable - 40;
  const spaceXAxisLabelAvailable = showXAxisLabel ? 34 : 0;
  const updatedChartHeight = chartHeight - spaceXAxisLabelAvailable - 28;

  const barHeight = Math.floor((updatedChartHeight / BAR_COUNT) * 0.6);

  const barWidths = [
    Math.floor(updatedChartWidth * 0.85),
    Math.floor(updatedChartWidth * 0.65),
    Math.floor(updatedChartWidth * 0.9),
    Math.floor(updatedChartWidth * 0.45),
    Math.floor(updatedChartWidth * 0.75),
    Math.floor(updatedChartWidth * 0.55),
    Math.floor(updatedChartWidth * 0.5),
  ];

  // transforms & transitions
  const hiddenScaleX = 'scale-x-0 opacity-0';
  const visibleScaleX = 'scale-x-100 opacity-100';
  const scaleTransition =
    'transform transition-[transform,opacity] duration-1000 ease-in-out will-change-transform';
  const hiddenScaleY = 'scale-y-0 opacity-0';
  const visibleScaleY = 'scale-y-100 opacity-100';

  // staged visibility: loaderVisible OR stage reached
  const baseYAxisVisible = loaderVisible || stage >= 1;
  const baseXAxisVisible = loaderVisible || stage >= 2;
  const baseBarsWrapperVisible = loaderVisible || stage >= 3;

  const yAxisWrapperClasses = baseYAxisVisible
    ? `${visibleScaleY} ${scaleTransition}`
    : `${hiddenScaleY} ${scaleTransition}`;
  const xAxisWrapperClasses = baseXAxisVisible
    ? `${visibleScaleX} ${scaleTransition} origin-left`
    : `${hiddenScaleX} ${scaleTransition}`;
  const barsWrapperBase = baseBarsWrapperVisible
    ? `${visibleScaleY} ${scaleTransition}`
    : `${hiddenScaleY} ${scaleTransition}`;

  // delays for ticks (bottom -> top). DOM renders top->bottom, so reverse index:
  const tickDelays = [
    'delay-0',
    'delay-100',
    'delay-200',
    'delay-300',
    'delay-400',
    'delay-500',
    'delay-700',
  ]; // bottom-most -> top-most

  // bar delays for initial wrapper staggering (kept but actual reveal is controlled by revealedBarIndex)
  const barDelays = [
    'delay-0',
    'delay-75',
    'delay-150',
    'delay-200',
    'delay-300',
    'delay-500',
    'delay-700',
  ];

  return (
    <SkeletonTheme
      baseColor="#F7F7F8"
      highlightColor="#E6E8EA"
      enableAnimation={skeletonAnimate} // shimmer only after everything completes
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
          {showYAxisLabel && (
            <div
              className={`${yAxisWrapperClasses} absolute top-1/2 origin-bottom delay-300`}
              style={{
                marginTop: '-13%',
              }}
            >
              <Skeleton width={12} height={60} />
            </div>
          )}

          {/* Y-axis ticks (labels) — stacked top->bottom in DOM; reveal bottom->top by reversing index */}
          <div
            className={`${yAxisWrapperClasses} absolute flex flex-col justify-between py-1`}
            style={{
              height: `${updatedChartHeight}px`,
              marginLeft: `${spaceYAxisLabelAvailable}px`,
            }}
          >
            {Array.from({ length: BAR_COUNT }, (_, i) => {
              // i: 0 -> top-most. To get bottom->top delay, reverse index
              const tickFromBottom = BAR_COUNT - 1 - i; // 6..0
              const delayClass =
                tickDelays[tickFromBottom] ?? tickDelays[tickDelays.length - 1];

              return (
                <div
                  key={i}
                  className={`${yAxisWrapperClasses} ${delayClass} flex h-8 origin-bottom items-center justify-end`}
                >
                  <Skeleton width={30} height={12} />
                </div>
              );
            })}
          </div>

          {/* Bars column: bars appear one-by-one top->bottom, each grows left->right using scale-x */}
          <div
            className={`flex flex-col justify-between ${barsWrapperBase}`}
            style={{
              paddingRight: 4,
              height: updatedChartHeight,
              marginLeft: `${40 + spaceYAxisLabelAvailable}px`,
            }}
          >
            {Array.from({ length: BAR_COUNT }, (_, i) => {
              const delayClass =
                barDelays[i] ?? barDelays[barDelays.length - 1];
              const isRevealed = loaderVisible || revealedBarIndex >= i;

              // keep origin-left so scale-x grows left->right
              return (
                <div
                  key={i}
                  className={`flex items-center ${delayClass}`}
                  style={{ height: barHeight }}
                >
                  <div
                    className={`${isRevealed ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0'} origin-left transform`}
                    style={{
                      transition:
                        'transform 600ms ease-in-out, opacity 600ms ease-in-out',
                      width: `${barWidths[i]}px`,
                      height: barHeight + 6,
                      borderRadius: '0 4px 4px 0',
                      overflow: 'hidden',
                    }}
                  >
                    <Skeleton
                      width={barWidths[i]}
                      height={barHeight + 6}
                      style={{ borderRadius: '0 4px 4px 0' }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* X axis line */}
          <div
            className={`${xAxisWrapperClasses} absolute`}
            style={{
              top: updatedChartHeight + 8,
              width: updatedChartWidth,
              marginLeft: `${40 + spaceYAxisLabelAvailable}px`,
            }}
          >
            <Skeleton width={updatedChartWidth} height={12} />
          </div>

          {showXAxisLabel && (
            <div
              className={`${xAxisWrapperClasses} absolute flex justify-center`}
              style={{
                top: updatedChartHeight + 30,
                width: updatedChartWidth,
                marginLeft: `${40 + spaceYAxisLabelAvailable}px`,
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

export const HorizontalBarSkeleton = withRetryOverlay(
  HorizontalBarSkeletonComponent,
);
