/* eslint-disable import/prefer-default-export */
import { useEffect, useState } from 'react';

import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { withRetryOverlay } from './WithRetryOverlay';
import { BarSkeletonProps } from '../types';

function BarSkeletonComponent({
  width,
  height,
  margins,
  animate = false,
  showXAxisLabel = true,
  showYAxisLabel = true,
}: BarSkeletonProps) {
  const [stage, setStage] = useState<number>(0);
  const [loaderVisible, setLoaderVisible] = useState<boolean>(true);
  const [skeletonAnimate, setSkeletonAnimate] = useState(false);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;

    const loaderTimer = setTimeout(() => {
      setLoaderVisible(false);

      let current = 0;
      interval = setInterval(() => {
        current += 1;
        setStage(current);

        if (current > 3) {
          clearInterval(interval);
          if (animate) setSkeletonAnimate(true); // <-- enable shimmer
        }
      }, 1000);
    }, 1000);

    return () => {
      clearTimeout(loaderTimer);
      if (interval) clearInterval(interval);
    };
  }, [animate]);

  const chartWidth = width - margins.left - margins.right;
  const chartHeight = height - margins.top - margins.bottom;

  const spaceYAxisAvailable = showYAxisLabel ? 22 : 0;
  const updatedChartWidth = chartWidth - spaceYAxisAvailable - 40;
  const spaceXAxisLabelAvailable = showXAxisLabel ? 34 : 0;
  const updatedChartHeight = chartHeight - spaceXAxisLabelAvailable - 28;

  const barCount = 7;
  const barWidth = Math.floor((updatedChartWidth / barCount) * 0.6);

  const barHeights = [
    Math.floor(updatedChartHeight * 0.85),
    Math.floor(updatedChartHeight * 0.65),
    Math.floor(updatedChartHeight * 0.9),
    Math.floor(updatedChartHeight * 0.45),
    Math.floor(updatedChartHeight * 0.75),
    Math.floor(updatedChartHeight * 0.25),
    Math.floor(updatedChartHeight * 0.55),
  ];

  // scale-based classes
  const hiddenScaleY = 'scale-y-0 opacity-0';
  const visibleScaleY = 'scale-y-100 opacity-100';

  const hiddenScaleX = 'scale-x-0 opacity-0';
  const visibleScaleX = 'scale-x-100 opacity-100';
  const scaleTransition =
    'transform transition-[transform,opacity] duration-1000 ease-in-out will-change-transform';

  // show element either while loaderVisible OR when appropriate stage reached
  const yAxisLabelClasses =
    loaderVisible || stage >= 1
      ? `${visibleScaleY} ${scaleTransition}`
      : `${hiddenScaleY} ${scaleTransition}`;

  const xAxisWrapperClasses =
    loaderVisible || stage >= 2
      ? `${visibleScaleX} ${scaleTransition} origin-left`
      : `${hiddenScaleX} ${scaleTransition}`;

  const barsWrapperClasses =
    loaderVisible || stage >= 3
      ? `${visibleScaleY} ${scaleTransition} origin-bottom`
      : `${hiddenScaleY} ${scaleTransition}`;

  return (
    <SkeletonTheme
      baseColor="#F7F7F8"
      highlightColor="#E6E8EA"
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
          {/* Y-axis: y-labels — reveal bottom-to-top via scale-y */}
          <div className={`relative ${yAxisLabelClasses}`}>
            {showYAxisLabel && (
              <div
                className={`${yAxisLabelClasses} absolute top-1/2 origin-bottom delay-300`}
                style={{
                  marginTop: '9%',
                }}
              >
                <Skeleton width={12} height={60} />
              </div>
            )}

            <div
              className={`${yAxisLabelClasses} absolute flex origin-bottom flex-col justify-between py-1`}
              style={{
                height: `${updatedChartHeight}px`,
                marginLeft: `${spaceYAxisAvailable}px`,
              }}
            >
              {Array.from({ length: 5 }, (_, i) => {
                const delayOrder = [
                  'delay-0', // bottom-most tick
                  'delay-100',
                  'delay-200',
                  'delay-300',
                  'delay-500', // top-most tick
                ];
                const delayClass = delayOrder[delayOrder.length - 1 - i];

                return (
                  <div
                    key={delayOrder.length - 1 - i}
                    className={`${yAxisLabelClasses} ${delayClass} flex origin-bottom items-center justify-end`}
                  >
                    <Skeleton width={30} height={12} />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bars wrapper — reveal bottom-to-top via scale-y. */}
          <div
            className={`flex items-end justify-between ${barsWrapperClasses}`}
            style={{
              paddingBottom: 2,
              height: updatedChartHeight,
              marginLeft: `${40 + spaceXAxisLabelAvailable}px`,
            }}
          >
            {Array.from({ length: barCount }, (_, i) => {
              const delayClasses = [
                'delay-0',
                'delay-75',
                'delay-150',
                'delay-200',
                'delay-300',
                'delay-500',
                'delay-700',
              ];
              const delayClass =
                delayClasses[i] ?? delayClasses[delayClasses.length - 1];

              // inside each bar we use transform/opacity with explicit transition so the staged reveal looks identical
              const barVisible = loaderVisible || stage >= 3;

              return (
                <div
                  key={i}
                  className={`flex origin-bottom flex-col items-center ${delayClass} transition-[transform,opacity] duration-1000 ease-in-out`}
                >
                  <div
                    className={`${barVisible ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0'} origin-bottom transform`}
                    style={{
                      transition:
                        'transform 1000ms ease-in-out, opacity 1000ms ease-in-out',
                      width: `${barWidth}px`,
                      height: `${barHeights[i]}px`,
                    }}
                  >
                    <Skeleton width={barWidth} height={barHeights[i]} />
                  </div>
                </div>
              );
            })}
          </div>
          {/* Bottom / X-axis area — reveal left-to-right via scale-x */}
          <div
            className={`relative ${xAxisWrapperClasses}`}
            style={{
              marginLeft: `${40 + spaceXAxisLabelAvailable}px`,
              width: updatedChartWidth,
              height: chartHeight - updatedChartHeight,
            }}
          >
            {/* X-axis line */}
            <div
              className={`${xAxisWrapperClasses} absolute`}
              style={{
                top: 8,
                width: updatedChartWidth,
              }}
            >
              <Skeleton width={updatedChartWidth} height={12} />
            </div>

            {showXAxisLabel && (
              <div
                className={`${xAxisWrapperClasses} absolute flex justify-center`}
                style={{
                  top: 32,
                  width: updatedChartWidth,
                }}
              >
                <Skeleton width={100} height={12} />
              </div>
            )}
          </div>
        </div>
      </div>
    </SkeletonTheme>
  );
}

export const BarSkeleton = withRetryOverlay(BarSkeletonComponent);
