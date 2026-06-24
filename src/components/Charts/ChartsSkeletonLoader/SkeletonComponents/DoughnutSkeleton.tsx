/* eslint-disable import/prefer-default-export */
/* eslint-disable react/no-array-index-key */
import React, { useEffect, useState } from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import { DoughnutSkeletonProps } from '../types';
import { withRetryOverlay } from './WithRetryOverlay';

function polarToCartesian(
  centerX: number,
  centerY: number,
  radius: number,
  angleInDegrees: number,
) {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
}

function describeArc(
  x: number,
  y: number,
  radiusOuter: number,
  radiusInner: number,
  startAngle: number,
  endAngle: number,
) {
  const startOuter = polarToCartesian(x, y, radiusOuter, startAngle);
  const endOuter = polarToCartesian(x, y, radiusOuter, endAngle);
  const startInner = polarToCartesian(x, y, radiusInner, endAngle);
  const endInner = polarToCartesian(x, y, radiusInner, startAngle);

  const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;

  return [
    'M',
    startOuter.x,
    startOuter.y,
    'A',
    radiusOuter,
    radiusOuter,
    0,
    largeArcFlag,
    1,
    endOuter.x,
    endOuter.y,
    'L',
    startInner.x,
    startInner.y,
    'A',
    radiusInner,
    radiusInner,
    0,
    largeArcFlag,
    0,
    endInner.x,
    endInner.y,
    'Z',
  ].join(' ');
}

// eslint-disable-next-line
const DoughnutSkeletonComponent: React.FC<DoughnutSkeletonProps> = ({
  width,
  height,
  margins,
  animate = true, // kept for API compatibility; shimmer controlled internally
  showText = true,
  showSubText = true,
  showLegend = true,
}) => {
  // staged state
  const [stage, setStage] = useState<number>(0); // 0 = before animation, 1 = center text, 2 = doughnut group shown, 3 = legends done
  const [skeletonAnimate, setSkeletonAnimate] = useState<boolean>(false); // enable shimmer after all animations
  const [revealedLegendRowIndex, setRevealedLegendRowIndex] =
    useState<number>(-1); // which legend row is revealed

  // layout calculations
  const innerWidth = width - margins.left - margins.right;
  const innerHeight = height - margins.top - margins.bottom;
  const radius = Math.min(innerWidth, innerHeight) / 2;
  const centerX = innerWidth / 2;
  const centerY = innerHeight / 2;
  const innerRadius = radius * 0.6;

  const sliceValues = [30, 10, 15, 20, 7, 8, 10];
  const sliceCount = sliceValues.length;
  const padAngleDeg = 5;
  const totalValue = sliceValues.reduce((sum, v) => sum + v, 0);

  // generate path data
  let startAngle = 0;
  const slicePaths = sliceValues.map((value) => {
    const arcAngle = (value / totalValue) * (360 - sliceCount * padAngleDeg);
    const endAngle = startAngle + arcAngle;
    const d = describeArc(
      centerX,
      centerY,
      radius,
      innerRadius,
      startAngle,
      endAngle,
    );
    startAngle = endAngle + padAngleDeg;
    return d;
  });

  // legend layout
  const legendRows = 3;
  const itemsPerRow = 2;
  const legendItemWidth = 64;
  const legendItemHeight = 17;
  const legendIconSize = 17;
  const legendRowGap = 22;
  const legendItemGap = 36;
  const legendBlockHeight =
    legendRows * (legendItemHeight * 2 + 8) + (legendRows - 1) * legendRowGap;
  const legendBlockTop = margins.top + (innerHeight - legendBlockHeight) / 2;

  // sequencing constants
  const centerTextDelayMs = 50; // tiny initial delay to allow mount (keeps animation smooth)
  const sliceGroupRevealDelayMs = 700; // delay after center text before revealing whole doughnut
  const legendRowRevealIntervalMs = 300; // time between revealing legend rows
  const finalShimmerDelayMs = 350; // give last animation time to finish before enabling shimmer

  // run staged animation immediately (no initial loader)
  useEffect(() => {
    let legendInterval: ReturnType<typeof setInterval> | undefined;
    // 1) show center text
    const t1 = setTimeout(() => {
      setStage(1);

      // 2) after small delay, reveal the whole slices group as a single circle
      const t2 = setTimeout(() => {
        setStage(2);

        // 3) reveal legend rows top->bottom
        let li = 0;
        legendInterval = setInterval(() => {
          setRevealedLegendRowIndex((prev) => prev + 1);
          li += 1;
          if (li >= legendRows) {
            if (legendInterval) clearInterval(legendInterval);
            setStage(3);
            // enable shimmer after last animation finishes
            setTimeout(() => {
              if (animate) setSkeletonAnimate(true);
            }, finalShimmerDelayMs);
          }
        }, legendRowRevealIntervalMs);
      }, sliceGroupRevealDelayMs);

      // cleanup t2 if unmounted early
      return () => clearTimeout(t2);
    }, centerTextDelayMs);

    return () => {
      clearTimeout(t1);
      if (legendInterval) clearInterval(legendInterval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once on mount

  // visibility helpers based on stage
  const textVisible = () => stage >= 1;
  const slicesGroupVisible = () => stage >= 2;
  const legendRowVisible = (rowIdx: number) => revealedLegendRowIndex >= rowIdx;

  // CSS transition settings used inline
  const groupTransition =
    'transform 1s cubic-bezier(.22,.9,.3,1), opacity 750ms ease';
  const textTransition =
    'transform 1s cubic-bezier(.22,.9,.3,1), opacity 750ms ease';
  const legendTransition = 'transform 1000ms ease, opacity 750ms ease';

  return (
    <SkeletonTheme
      baseColor="#f3f4f6"
      highlightColor="#e5e7eb"
      enableAnimation={skeletonAnimate} // shimmer only after staged animation
    >
      <div style={{ width, height, position: 'relative', background: '#fff' }}>
        {/* SVG doughnut — entire slices group scales from center (inside -> outside) */}
        <svg
          width={innerWidth}
          height={innerHeight}
          style={{
            position: 'absolute',
            top: margins.top,
            left: margins.left,
            pointerEvents: 'none',
            overflow: 'visible',
          }}
        >
          {
            // group all slices to animate as a single unit
          }
          <g
            // use CSS transform on group with transformOrigin set to the center in px
            style={{
              transform: slicesGroupVisible() ? 'scale(1)' : 'scale(0)',
              transformOrigin: `${centerX}px ${centerY}px`,
              transition: groupTransition,
              opacity: slicesGroupVisible() ? 1 : 0,
            }}
          >
            {slicePaths.map((d, i) => (
              <path key={i} d={d} fill="#f3f4f6" />
            ))}
            <circle cx={centerX} cy={centerY} r={innerRadius} fill="#fff" />
          </g>
        </svg>

        {/* Center showText area — animate from inside to outside (scale from 0->1) */}
        {showText && (
          <div
            style={{
              position: 'absolute',
              top: margins.top + innerHeight / 2 - 24,
              left: margins.left + innerWidth / 2 - 46,
              width: 92,
              height: 48,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 2,
              // center animation: scale from 0->1
              transform: textVisible() ? 'scale(1)' : 'scale(0)',
              transformOrigin: 'center center',
              transition: textTransition,
              opacity: textVisible() ? 1 : 0,
            }}
          >
            <Skeleton width={72} height={18} style={{ marginBottom: 6 }} />
            {showSubText && <Skeleton width={72} height={18} />}
          </div>
        )}

        {/* Legend block: rows reveal top -> bottom */}
        {showLegend && (
          <div
            style={{
              position: 'absolute',
              top: legendBlockTop,
              left: margins.left + innerWidth + 48,
              display: 'flex',
              flexDirection: 'column',
              gap: legendRowGap,
            }}
          >
            {Array.from({ length: legendRows }).map((_, rowIdx) => {
              const visible = legendRowVisible(rowIdx);
              return (
                <div
                  key={rowIdx}
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: legendItemGap,
                    transform: visible
                      ? 'translateY(0) scale(1)'
                      : 'translateY(-6px) scale(.98)',
                    transformOrigin: 'top left',
                    transition: legendTransition,
                    opacity: visible ? 1 : 0,
                  }}
                >
                  {Array.from({ length: itemsPerRow }).map((__, colIdx) => (
                    <div
                      key={colIdx}
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'flex-start',
                        minWidth: 100,
                      }}
                    >
                      <Skeleton
                        circle
                        width={legendIconSize}
                        height={legendIconSize}
                      />
                      <div style={{ marginLeft: 12 }}>
                        <Skeleton
                          width={legendItemWidth}
                          height={legendItemHeight}
                          style={{ marginBottom: 8 }}
                        />
                        <Skeleton
                          width={legendItemWidth}
                          height={legendItemHeight}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </SkeletonTheme>
  );
};

export const DoughnutSkeleton = withRetryOverlay(DoughnutSkeletonComponent);
