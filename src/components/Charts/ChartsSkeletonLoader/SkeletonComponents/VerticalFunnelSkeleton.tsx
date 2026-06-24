import React, { useEffect, useId, useState } from 'react';
import { SkeletonTheme } from 'react-loading-skeleton';
import { withRetryOverlay } from './WithRetryOverlay';
import { VerticalFunnelSkeletonProps } from '../types';
import createFunnelPath from '../utils';
import TextSkeletonGroup from './TextSkeletonGroup';
import './styles/VerticalFunnelSkeleton.css';

function VerticalFunnelSkeletonComponent({
  width,
  height,
  margins,
  animate = true,
  retryIsAutoPhase,
}: Readonly<VerticalFunnelSkeletonProps>): React.ReactElement {
  const [showShimmer, setShowShimmer] = useState(true);

  const SEGMENTS_COUNT = 4;
  const TOP_WIDTH = width * 0.744;
  const BOTTOM_WIDTH = width * 0.589;
  const chartHeight = height - margins.top - margins.bottom;
  const centerX = (width - 100) / 2;
  const reactId = useId();
  const gradientId = `funnel-gradient-${reactId}`;

  const funnelPath = createFunnelPath({
    topWidth: TOP_WIDTH,
    bottomWidth: BOTTOM_WIDTH,
    segmentsCount: SEGMENTS_COUNT,
    chartHeight,
    centerX,
    margins,
  });

  useEffect(() => {
    if (retryIsAutoPhase) {
      setShowShimmer(true);
    } else {
      setShowShimmer(false);
    }
  }, [retryIsAutoPhase]);

  return (
    <SkeletonTheme
      baseColor="#F7F7F8"
      highlightColor="#FCFCFD"
      enableAnimation={animate && showShimmer}
    >
      <div className="relative bg-white" style={{ width, height }}>
        <svg width={width - 80} height={height}>
          <defs>
            <linearGradient
              id={gradientId}
              x1="-100%"
              y1="-53.205%"
              x2="0%"
              y2="0%"
            >
              <stop offset="0%" stopColor="#F7F7F8" />
              <stop offset="80%" stopColor="#F7F7F8" />
              <stop offset="90%" stopColor="#E6E8EA" />
              <stop offset="98%" stopColor="#E6E8EA" />
              <stop offset="100%" stopColor="#F7F7F8" />
              {animate && showShimmer && (
                <>
                  <animate
                    attributeName="x1"
                    from="-100%"
                    to="100%"
                    dur="1.6s"
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="x2"
                    from="0%"
                    to="200%"
                    dur="1.6s"
                    repeatCount="indefinite"
                  />
                </>
              )}
            </linearGradient>
          </defs>
          <g className={`${animate ? 'vertical-funnel-animation' : ''}`}>
            <path d={funnelPath} fill={`url(#${gradientId})`} opacity={0.7} />
          </g>
        </svg>

        {Array.from({ length: 5 }, (_, i) => {
          const y = (chartHeight / SEGMENTS_COUNT) * i + margins.top + 10;
          const funnelRightX = centerX + TOP_WIDTH / 2;
          return (
            <React.Fragment key={`text-group-${i}`}>
              <TextSkeletonGroup
                animate={animate}
                left={funnelRightX + width * 0.0615}
                top={y * 0.8}
                widthReference={width}
                heightReference={height}
              />
            </React.Fragment>
          );
        })}
      </div>
    </SkeletonTheme>
  );
}

// eslint-disable-next-line import/prefer-default-export
export const VerticalFunnelSkeleton = withRetryOverlay(
  VerticalFunnelSkeletonComponent,
);
