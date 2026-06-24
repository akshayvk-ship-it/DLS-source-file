import { useEffect, useMemo, useRef, useState } from 'react';
import { withRetryOverlay } from './WithRetryOverlay';
import { HeatMapWeekMonthSkeletonProps } from '../types';
import './styles/HeatMapWeekMonthSkeleton.css';
import { useScrollbarWidth } from '../../../hooks/useScrollbarWidth';

function HeatMapWeekMonthSkeletonComponent({
  width = 1313,
  height = 316,
  margins = { top: 0, right: 0, bottom: 0, left: 0 },
  animate = true,
  retryIsAutoPhase,
  showLegendsLoader = false,
}: Readonly<HeatMapWeekMonthSkeletonProps>): React.ReactElement {
  const scrollbarWidth = useScrollbarWidth(); // ← This is your hero

  const legendsSpacing = showLegendsLoader ? 74 : 0;

  const availableWidth = width - margins.left - margins.right;
  const availableHeight =
    height - margins.top - margins.bottom - legendsSpacing;

  const totalColumns = 24;
  const weekLabelWidth = 101;
  const minBinWidth = 22;
  const contentHeight = 340;
  const weekLabelHeight = 68;
  const binHeight = 8;

  const shimmerDuration = 1300;

  const heatmapDimensions = useMemo(() => {
    const hasVerticalOverflow = contentHeight > availableHeight;

    const effectiveWidth =
      hasVerticalOverflow && scrollbarWidth > 0
        ? availableWidth - scrollbarWidth
        : availableWidth;

    const heatmapAreaWidth = effectiveWidth - weekLabelWidth;
    const calculatedBinWidth = Math.floor(heatmapAreaWidth / totalColumns);
    const binWidth = Math.max(calculatedBinWidth, minBinWidth);
    const heatmapWidth = binWidth * totalColumns;

    return {
      binWidth,
      heatmapWidth,
    };
  }, [availableWidth, availableHeight, scrollbarWidth, contentHeight]);

  const { heatmapWidth, binWidth } = heatmapDimensions;
  const [activeShimmer, setActiveShimmer] = useState<'heatmap' | 'bars' | null>(
    null,
  );
  const [animation, setAnimation] = useState(false);
  const shimmerStartDelay = 1000;

  const shimmerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const firstRunRef = useRef(true);

  const legendSkeletonWidth = width * 0.6;

  useEffect(() => {
    if (!retryIsAutoPhase) {
      setActiveShimmer(null);
    }
  }, [retryIsAutoPhase]);

  useEffect(() => {
    if (!animate || !firstRunRef.current) return undefined;

    const timeout = setTimeout(() => setAnimation(true), 300);
    return () => clearTimeout(timeout);
  }, [animate]);

  useEffect(() => {
    if (shimmerIntervalRef.current) {
      clearInterval(shimmerIntervalRef.current);
      shimmerIntervalRef.current = null;
    }

    if (retryIsAutoPhase) {
      const delay = firstRunRef.current && animate ? shimmerStartDelay : 0;

      const startTimeout = setTimeout(() => {
        const interval = setInterval(() => {
          setActiveShimmer((prev) => (prev === 'heatmap' ? 'bars' : 'heatmap'));
        }, shimmerDuration);

        shimmerIntervalRef.current = interval;
        firstRunRef.current = false;
      }, delay);

      return () => clearTimeout(startTimeout);
    }

    return () => {};
  }, [retryIsAutoPhase, animate]);

  const shimmerOverlay = (background: string) => (
    <div
      className="pointer-events-none absolute left-0 top-0 h-full"
      style={{
        background,
        width: `${heatmapWidth}px`,
        animation: 'shimmer 1.3s linear infinite',
      }}
    />
  );

  const getOpacity = () => {
    if (animate) {
      return animation ? 1 : 0;
    }
    return 1;
  };

  const getWidthLegend = () => {
    if (animate) {
      return animation ? legendSkeletonWidth : 0;
    }

    return legendSkeletonWidth;
  };

  return (
    <div
      className="overflow-auto  bg-white"
      style={{
        width: availableWidth,
        height: availableHeight,
      }}
    >
      <div className="flex flex-col gap-4">
        <div className="flex  gap-4">
          <div
            className="flex w-full flex-col gap-1 pt-8"
            style={{ width: `${weekLabelWidth}px` }}
          >
            {Array.from({ length: 4 }, (_, i) => {
              const delay = (3 - i) * 10;
              return (
                <div
                  className="relative flex w-full overflow-hidden"
                  style={{
                    height: `${weekLabelHeight}px`,
                    opacity: getOpacity(),
                    transition: animate
                      ? `opacity 0.6s ease ${delay}ms`
                      : 'none',
                  }}
                  key={`skeleton-${i}`}
                >
                  <div className="flex w-full flex-col items-end justify-center gap-[2px] pr-2">
                    <div
                      className="bg-new-fill-light relative block h-5 overflow-hidden rounded leading-none"
                      style={{
                        width: '60%',
                      }}
                    >
                      {activeShimmer === 'bars' &&
                        shimmerOverlay(
                          'linear-gradient(-90deg, transparent 0%, transparent 15%, rgba(203, 209, 214, 0.20) 20%, rgba(203, 209, 214, 0.20) 22%, transparent 24%)',
                        )}
                    </div>

                    <div
                      className="bg-new-fill-light relative block h-[18px] overflow-hidden rounded leading-none"
                      style={{ width: '100%' }}
                    >
                      {activeShimmer === 'bars' &&
                        shimmerOverlay(
                          'linear-gradient(-90deg, transparent 0%, transparent 15%, rgba(203, 209, 214, 0.20) 20%, rgba(203, 209, 214, 0.20) 22%, transparent 24%)',
                        )}
                    </div>
                  </div>
                  <div
                    className="bg-new-fill-light w-[1px]"
                    style={{ height: `${weekLabelHeight}px` }}
                  />
                </div>
              );
            })}
          </div>
          <div
            className="flex flex-col gap-2"
            style={{
              width: `${heatmapWidth}px`,
            }}
          >
            <div
              className="relative flex gap-1 overflow-hidden"
              style={{ height: '24px' }}
            >
              {Array.from({ length: 24 }, (_, i) => {
                const delay = 10 + i * 30;
                return (
                  <div
                    key={`skeleton-${i}`}
                    style={{
                      opacity: getOpacity(),
                      transition: animate
                        ? `opacity 0.1s ease ${delay}ms`
                        : 'none',
                      width: `${binWidth}px`,
                    }}
                    className="bg-new-fill-light relative h-[24px] overflow-hidden rounded"
                  />
                );
              })}
              {activeShimmer === 'bars' &&
                shimmerOverlay(
                  'linear-gradient(-90deg, transparent 0%, transparent 9%, rgba(203, 209, 214, 0.20) 10%, rgba(203, 209, 214, 0.20) 17%, transparent 18%)',
                )}
            </div>
            <div
              className="relative overflow-hidden"
              style={{
                width: `${heatmapWidth}px`,
                height: `${4 * weekLabelHeight + 12}px`,
              }}
            >
              <div className="absolute left-0 top-0 flex h-full w-full flex-col gap-1">
                {Array.from({ length: 4 }, (__, i) => (
                  <div
                    className="flex flex-col gap-[2px]"
                    style={{ height: `${weekLabelHeight}px` }}
                    key={`week-${i}`}
                  >
                    {Array.from({ length: 7 }, (___, k) => (
                      <div
                        key={`skeleton-row-${k}`}
                        className="flex gap-1"
                        style={{ height: `${binHeight}px` }}
                      >
                        {Array.from({ length: 24 }, (____, j) => {
                          const delay = 150 + j * 30;
                          return (
                            <div
                              key={`skeleton-bin-${j}`}
                              className="bg-new-fill-light block rounded-none leading-none"
                              style={{
                                height: `${binHeight}px`,
                                width: `${binWidth}px`,
                                opacity: getOpacity(),
                                transition: animate
                                  ? `opacity 0.1s ease ${delay}ms`
                                  : 'none',
                              }}
                            />
                          );
                        })}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
              {activeShimmer === 'heatmap' && (
                <div
                  className="left pointer-events-none absolute top-0 w-full"
                  style={{
                    height: `${4 * weekLabelHeight + 12}px`,
                    background:
                      'linear-gradient(-90deg, transparent 0%, transparent 9%, rgba(203, 209, 214, 0.20) 10%,rgba(203, 209, 214, 0.20) 17%, transparent 18%)',
                    animation: 'shimmer 1.3s linear infinite',
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
      {showLegendsLoader ? (
        <div
          className="absolute left-1/2 mt-6 flex  justify-start overflow-hidden"
          style={{
            top: `${height - legendsSpacing - margins.top}px`,
            left: `${width * 0.2}px`,
          }}
        >
          <div
            style={{
              width: `${getWidthLegend()}px`,
              transition: animate
                ? `opacity 1s ease ${180}ms, width 1s ease ${180}ms`
                : 'none',
              opacity: getOpacity(),
            }}
            className="bg-new-fill-light h-[50px]"
          />
          {activeShimmer === 'heatmap' && (
            <div
              className="left pointer-events-none absolute top-0 h-[50px] w-full"
              style={{
                background:
                  'linear-gradient(-90deg, transparent 0%, transparent 9%, rgba(203, 209, 214, 0.20) 10%,rgba(203, 209, 214, 0.20) 17%, transparent 18%)',
                animation: 'shimmer 1.3s linear infinite',
              }}
            />
          )}
        </div>
      ) : null}
    </div>
  );
}

// eslint-disable-next-line import/prefer-default-export
export const HeatMapWeekMonthSkeleton = withRetryOverlay(
  HeatMapWeekMonthSkeletonComponent,
);
