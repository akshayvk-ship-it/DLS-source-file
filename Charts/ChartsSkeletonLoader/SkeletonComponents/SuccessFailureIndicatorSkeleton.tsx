import 'react-loading-skeleton/dist/skeleton.css';
import { Bar } from '@visx/shape';
import { Group } from '@visx/group';
import { useEffect, useId, useRef, useState } from 'react';
import { withRetryOverlay } from './WithRetryOverlay';
import { SuccessFailureIndicatorSkeletonProps } from '../types';

const MIN_BAR_WIDTH = 8;
function SuccessFailureIndicatorSkeletonComponent({
  height,
  width,
  margins,
  retryIsAutoPhase,
}: SuccessFailureIndicatorSkeletonProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [barCount, setBarCount] = useState(
    (width - margins.left - margins.right + 2) / (MIN_BAR_WIDTH + 2),
  );
  const totalWidth = Math.max(
    width,
    (barCount - 1) * MIN_BAR_WIDTH +
      2 * (barCount - 2) +
      2 * margins.left +
      margins.right,
  );

  const reactId = useId();
  const shimmerId = `shimmer-${reactId}`;
  const shimmerGradientId = `shimmer-gradient-${reactId}`;
  const filterId = `blur-filter-${reactId}`;
  const revealMaskId = `reveal-mask-${reactId}`;

  useEffect(() => {
    if (!containerRef.current?.parentElement) return;

    function calculateTotalWidth() {
      if (!containerRef.current?.parentElement) return;
      const parentWidth =
        containerRef.current.parentElement.getBoundingClientRect().width;
      const calculatedBarCount = Math.floor(
        (parentWidth - margins.left - margins.right + 2) / (MIN_BAR_WIDTH + 2),
      );

      if (calculatedBarCount !== barCount) {
        setBarCount(calculatedBarCount);
      }
    }

    calculateTotalWidth();

    const resizeObserver = new ResizeObserver(calculateTotalWidth);
    resizeObserver.observe(containerRef.current?.parentElement);

    // eslint-disable-next-line consistent-return
    return () => resizeObserver.disconnect();
  }, [barCount, margins]);

  return (
    <div
      ref={containerRef}
      className="border-border-border-light w-full rounded-lg border border-solid px-2"
      style={{
        height: `${height}px`,
        paddingTop: `${margins.top - 2}px`,
        paddingBottom: `${margins.bottom - 2}px`,
      }}
    >
      <svg
        width={totalWidth - margins.left - margins.right}
        height={height - margins.top - margins.bottom}
        className="m-auto"
      >
        <Group mask={`url(#${revealMaskId})`} fill="#F1F1F1">
          {Array.from({ length: barCount }, (_, i) => (
            <Bar
              key={i}
              y={0}
              height={height}
              width={MIN_BAR_WIDTH}
              x={MIN_BAR_WIDTH * i + 2 * i}
              rx={2}
              ry={2}
              fill="#F7F7F8"
            />
          ))}

          {retryIsAutoPhase && (
            <>
              <rect
                id={shimmerId}
                width={40}
                height={height}
                transform="skewX(-45)"
                fill={`url(#${shimmerGradientId})`}
                filter={`url(#${filterId})`}
              />
              <animate
                xlinkHref={`#${shimmerId}`}
                attributeName="x"
                from={-totalWidth / 2}
                to={totalWidth}
                dur="2s"
                begin="0s"
                repeatCount="indefinite"
              />
            </>
          )}
        </Group>
        <defs>
          <linearGradient
            id={shimmerGradientId}
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
          >
            <stop offset="0%" stopColor="#FFFFFF00" />
            <stop offset="60%" stopColor="#E6E8EA99" />
          </linearGradient>
          <mask id={revealMaskId}>
            <rect width="100%" height="100%" fill="#000000" />
            <rect x="-100%" y="0" width="100%" height="100%" fill="#FFFFFF">
              <animate
                attributeName="x"
                from="-100%"
                to="0"
                dur="0.7s"
                fill="freeze"
                repeatCount="1"
              />
            </rect>
          </mask>

          <filter id={filterId} x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" />
          </filter>
        </defs>
      </svg>
    </div>
  );
}

// eslint-disable-next-line import/prefer-default-export
export const SuccessFailureIndicatorSkeleton = withRetryOverlay(
  SuccessFailureIndicatorSkeletonComponent,
);
