/* eslint-disable import/prefer-default-export */
/* eslint-disable react/no-array-index-key */
import {
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Group } from '@visx/group';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import { ConnectedScatterSkeletonProps } from '../types';
import { withRetryOverlay } from './WithRetryOverlay';

const createLinePath = (points: Array<{ x: number; y: number }>) => {
  if (points.length === 0) return '';
  let path = `M ${points[0]?.x.toFixed(2)} ${points[0]?.y.toFixed(2)}`;
  for (let i = 1; i < points.length; i += 1) {
    path += ` L ${points[i]?.x.toFixed(2)} ${points[i]?.y.toFixed(2)}`;
  }
  return path;
};

export function ConnectedScatterSkeletonComponent({
  width,
  height,
  margins,
  animate = true,
  xLabel = false,
  yLabel = false,
}: ConnectedScatterSkeletonProps) {
  const [stage, setStage] = useState<number>(0);
  const [loaderVisible, setLoaderVisible] = useState<boolean>(true);
  const [skeletonAnimate, setSkeletonAnimate] = useState<boolean>(false);

  const [drawProgress, setDrawProgress] = useState<number>(0);

  const pathRef = useRef<SVGPathElement | null>(null);
  const [pathLength, setPathLength] = useState<number>(0);
  const [pointFractions, setPointFractions] = useState<number[] | null>(null);
  const [pointPositions, setPointPositions] = useState<Array<{
    x: number;
    y: number;
  }> | null>(null);

  const chartWidth = width - margins.left - margins.right;
  const chartHeight = height - margins.top - margins.bottom;

  const spaceYAxisLabelAvailable = yLabel ? 26 : 0;
  const updatedChartWidth = chartWidth - spaceYAxisLabelAvailable - 50;
  const spaceXAxisLabelAvailable = xLabel ? 34 : 0;
  const updatedChartHeight = chartHeight - spaceXAxisLabelAvailable - 28;
  const reactId = useId();
  const gridLineId = `grid-line-skel-cs-${reactId}`;

  const skeletonPoints = useMemo(() => {
    const customYValues = [22, 54, 23, 76, 56, 48];
    const maxYValue = Math.max(...customYValues);
    const pointCount = customYValues.length;
    const stepX = (updatedChartWidth - 10) / Math.max(1, pointCount - 1);

    return customYValues.map((yVal, idx) => ({
      x: idx * stepX,
      y:
        updatedChartHeight -
        10 -
        (yVal / maxYValue) * (updatedChartHeight - 10),
    }));
  }, [updatedChartWidth, updatedChartHeight]);

  const linePath = useMemo(
    () => createLinePath(skeletonPoints),
    [skeletonPoints],
  );

  // orchestration: loader -> stages -> draw
  useEffect(() => {
    let stageInterval: ReturnType<typeof setInterval> | undefined;
    let drawInterval: ReturnType<typeof setInterval> | undefined;

    const loaderTimer = setTimeout(() => {
      setLoaderVisible(false);

      let current = 0;
      stageInterval = setInterval(() => {
        current += 1;
        setStage(current);

        if (current > 2) {
          if (stageInterval) clearInterval(stageInterval);

          setDrawProgress(0);
          const STEPS = 14;
          const stepMs = 90;
          let stepIdx = 0;

          drawInterval = setInterval(() => {
            stepIdx += 1;
            const p = Math.min(1, stepIdx / STEPS);
            setDrawProgress(p);
            if (p >= 1) {
              if (drawInterval) clearInterval(drawInterval);
              if (animate) setTimeout(() => setSkeletonAnimate(true), 300);
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

  // measure path length synchronously after layout (useLayoutEffect)
  useLayoutEffect(() => {
    if (!pathRef.current || !(loaderVisible || stage === 3)) {
      setPathLength(0);
      return;
    }

    try {
      const len = pathRef.current.getTotalLength();
      setPathLength(len || 0);
    } catch {
      setPathLength(0);
    }
  }, [stage, loaderVisible, linePath]);

  // compute fractions along path for each logical skeleton point
  useLayoutEffect(() => {
    if (!pathRef.current || !pathLength || pathLength <= 0) {
      setPointFractions(null);
      return;
    }

    const path = pathRef.current;

    const findLengthForPoint = (targetX: number, targetY: number) => {
      // coarse sample to get seed
      const SAMPLES = 40;
      let best = 0;
      let bestDist = Infinity;
      for (let s = 0; s <= SAMPLES; s += 1) {
        const t = (s / SAMPLES) * pathLength;
        const p = path.getPointAtLength(t);
        const dx = p.x - targetX;
        const dy = p.y - targetY;
        const dist = dx * dx + dy * dy;
        if (dist < bestDist) {
          bestDist = dist;
          best = t;
        }
      }

      // refine around best
      let low = Math.max(0, best - pathLength / SAMPLES);
      let high = Math.min(pathLength, best + pathLength / SAMPLES);
      for (let iter = 0; iter < 24; iter += 1) {
        const mid = (low + high) / 2;
        const p = path.getPointAtLength(mid);
        const dx = p.x - targetX;
        const dy = p.y - targetY;
        const dist = dx * dx + dy * dy;
        if (dist < bestDist) {
          bestDist = dist;
          best = mid;
        }
        const left = path.getPointAtLength((low + mid) / 2);
        const right = path.getPointAtLength((mid + high) / 2);
        if (Math.abs(left.x - targetX) < Math.abs(right.x - targetX)) {
          high = mid;
        } else {
          low = mid;
        }
      }

      return best;
    };

    try {
      const fractions = skeletonPoints.map((pt) => {
        const lenAtPoint = findLengthForPoint(pt.x, pt.y);
        const frac = Math.min(1, Math.max(0, lenAtPoint / pathLength));
        return frac;
      });
      setPointFractions(fractions);
    } catch {
      setPointFractions(null);
    }
  }, [pathLength, skeletonPoints, updatedChartWidth]);

  // compute exact SVG coords for each point using getPointAtLength
  useLayoutEffect(() => {
    if (!pathRef.current || !pathLength || !pointFractions) {
      setPointPositions(null);
      return;
    }

    try {
      const path = pathRef.current;
      const positions = pointFractions.map((frac) => {
        const len = Math.max(0, Math.min(pathLength, frac * pathLength));
        const p = path.getPointAtLength(len);
        return { x: p.x, y: p.y };
      });
      setPointPositions(positions);
    } catch {
      setPointPositions(null);
    }
  }, [pathLength, pointFractions]);

  // visibility helpers
  const baseYAxisVisible = loaderVisible || stage >= 1;
  const baseXAxisVisible = loaderVisible || stage >= 2;
  const baseChartVisible = loaderVisible || stage === 3;

  const hiddenScaleY = 'scale-y-0 opacity-0';
  const visibleScaleY = 'scale-y-100 opacity-100';
  const hiddenScaleX = 'scale-x-0 opacity-0';
  const visibleScaleX = 'scale-x-100 opacity-100';
  const scaleTransition =
    'transform transition-[transform,opacity] duration-1000 ease-in-out will-change-transform';

  const yLabelWrapper = baseYAxisVisible
    ? `${visibleScaleY} ${scaleTransition}`
    : `${hiddenScaleY} ${scaleTransition}`;
  const xAxisWrapper = baseXAxisVisible
    ? `${visibleScaleX} ${scaleTransition} origin-left`
    : `${hiddenScaleX} ${scaleTransition}`;
  const chartWrapper = baseChartVisible
    ? `${visibleScaleX} ${scaleTransition} origin-left`
    : `${hiddenScaleX} ${scaleTransition}`;

  const delays = [
    'delay-0',
    'delay-100',
    'delay-200',
    'delay-300',
    'delay-400',
    'delay-500',
    'delay-700',
  ];

  const effectiveProgress = loaderVisible ? 1 : drawProgress;
  const strokeDashoffset =
    pathLength > 0 ? pathLength * (1 - effectiveProgress) : 0;

  // choose positions source: exact pointPositions if available, else fallback to skeletonPoints
  const renderPointsSource = pointPositions ?? skeletonPoints;

  return (
    <SkeletonTheme
      baseColor="#F7F7F8"
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
          {yLabel && (
            <div
              className={`${yLabelWrapper} absolute top-[30%] origin-bottom delay-300`}
            >
              <div>
                <Skeleton width={16} height={80} />
              </div>
            </div>
          )}

          {/* Y-axis ticks */}
          <div
            className={`${yLabelWrapper} absolute flex flex-col justify-between py-1`}
            style={{
              height: updatedChartHeight,
              marginLeft: `${spaceYAxisLabelAvailable}px`,
            }}
            aria-hidden="true"
          >
            {Array.from({ length: 7 }).map((_, i) => {
              const fromBottomIndex = 7 - 1 - i;
              const delayClass =
                delays[fromBottomIndex] ?? delays[delays.length - 1];
              return (
                <div
                  key={i}
                  className={`${yLabelWrapper} ${delayClass} flex origin-bottom items-center justify-end`}
                >
                  <Skeleton width={40} height={12} />
                </div>
              );
            })}
          </div>

          {/* SVG chart area */}
          <svg
            width={updatedChartWidth}
            height={updatedChartHeight}
            style={{
              position: 'absolute',
              marginLeft: `${50 + spaceYAxisLabelAvailable}px`,
              right: '5px',
            }}
            className={chartWrapper}
          >
            <defs>
              <pattern
                id={gridLineId}
                width="50"
                height={Math.max(1, updatedChartHeight / 6)}
                patternUnits="userSpaceOnUse"
              >
                <path
                  d={`M 50 0 L 0 0 0 ${Math.max(1, updatedChartHeight / 6)}`}
                  fill="none"
                  stroke="#EFEFF1"
                  strokeWidth="0.5"
                  strokeDasharray="4,4"
                />
              </pattern>
            </defs>

            <rect
              width={updatedChartWidth}
              height={updatedChartHeight}
              fill={`url(#${gridLineId})`}
              opacity="0.3"
            />

            <Group top={7} left={7}>
              <g>
                <path
                  ref={pathRef}
                  d={linePath}
                  fill="none"
                  stroke="#EFEFF1"
                  strokeWidth={3}
                  strokeDasharray={pathLength}
                  strokeDashoffset={strokeDashoffset}
                  style={{ transition: 'stroke-dashoffset 90ms linear' }}
                />
              </g>

              {/* render circles using cx/cy so they use SVG coordinates exactly */}
              {renderPointsSource.map((pt, i) => {
                // fraction for reveal
                const fracFallback =
                  updatedChartWidth > 0 ? pt.x / updatedChartWidth : 0;
                const frac = pointFractions
                  ? (pointFractions[i] ?? fracFallback)
                  : fracFallback;
                const visible =
                  loaderVisible || drawProgress >= Math.max(0, frac - 0.01);

                const cx = Number(pt.x.toFixed(2));
                const cy = Number(pt.y.toFixed(2));

                return (
                  <circle
                    key={i}
                    cx={i === renderPointsSource.length - 1 ? cx - 5 : cx}
                    cy={cy}
                    r={6}
                    fill="#EFEFF1"
                    style={{
                      opacity: visible ? 1 : 0,
                      transformOrigin: `${cx}px ${cy}px`, // ensure scale origin for any CSS transform
                      transform: visible ? 'scale(1)' : 'scale(0.85)',
                      transition: 'opacity 220ms ease, transform 220ms ease',
                    }}
                  />
                );
              })}
            </Group>
          </svg>

          {/* x-axis skeleton */}
          <div
            className={`${xAxisWrapper} absolute`}
            style={{
              top: updatedChartHeight + 8,
              width: updatedChartWidth,
              marginLeft: `${50 + spaceYAxisLabelAvailable}px`,
            }}
          >
            <Skeleton width={updatedChartWidth} height={12} />
          </div>

          {xLabel && (
            <div
              className={`${xAxisWrapper} absolute flex justify-center`}
              style={{
                top: updatedChartHeight + 30,
                width: updatedChartWidth,
                marginLeft: `${50 + spaceYAxisLabelAvailable}px`,
              }}
            >
              <Skeleton width={80} height={12} />
            </div>
          )}
        </div>
      </div>
    </SkeletonTheme>
  );
}

export const ConnectedScatterSkeleton = withRetryOverlay(
  ConnectedScatterSkeletonComponent,
);
