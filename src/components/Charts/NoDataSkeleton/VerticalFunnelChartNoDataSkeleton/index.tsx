import React, { useId } from 'react';
import DataNotAvailable, { DataNotAvailableProps } from '../DataNotAvailable';
import createFunnelPath from '../../ChartsSkeletonLoader/utils';

/* eslint-disable import/prefer-default-export */
interface VerticalFunnelChartNoDataSkeletonProps extends DataNotAvailableProps {
  width: number;
  height: number;
  margins: ChartMargins;
}

interface ChartMargins {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

function VerticalFunnelChartNoDataSkeleton({
  height,
  width,
  margins,
  ...dataNotAvailableProps
}: Readonly<VerticalFunnelChartNoDataSkeletonProps>) {
  const gradientId = useId();

  const SEGMENTS_COUNT = 4;
  const TOP_WIDTH = width * 0.744;
  const BOTTOM_WIDTH = width * 0.589;
  const chartHeight = height - margins.top - margins.bottom;
  const centerX = (width - 100) / 2;

  const funnelPath = createFunnelPath({
    topWidth: TOP_WIDTH,
    bottomWidth: BOTTOM_WIDTH,
    segmentsCount: SEGMENTS_COUNT,
    chartHeight,
    centerX,
    margins,
  });

  return (
    <DataNotAvailable width={width} height={height} {...dataNotAvailableProps}>
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
            </linearGradient>
          </defs>
          <g>
            <path d={funnelPath} fill={`url(#${gradientId})`} opacity={0.7} />
          </g>
        </svg>

        {Array.from({ length: 5 }, (_, i) => {
          const y = (chartHeight / SEGMENTS_COUNT) * i + margins.top + 10;
          const funnelRightX = centerX + TOP_WIDTH / 2;
          const middleTextWidth = width * 0.1323;
          const middleTextHeight = height * 0.0277;
          const subTextWidth = width * 0.0923;
          const subTextHeight = height * 0.0169;
          return (
            <React.Fragment key={`text-group-${i}`}>
              <div
                className="text-group absolute mt-4 flex w-[5.375rem] flex-col items-center justify-center"
                style={{
                  left: funnelRightX + width * 0.0615,
                  top: y * 0.8,
                  gap: height * 0.0123,
                }}
              >
                <div className="block overflow-hidden leading-[0]">
                  <div
                    className="bg-new-fill-light block delay-[200ms]"
                    style={{
                      width: `${subTextWidth}px`,
                      height: `${subTextHeight}px`,
                    }}
                  />
                </div>
                <div className="block overflow-hidden leading-[0]">
                  <div
                    className="bg-new-fill-light block delay-[200ms]"
                    style={{ width: middleTextWidth, height: middleTextHeight }}
                  />
                </div>
                <div className="mb-[1px] block overflow-hidden leading-[0]">
                  <div
                    className="bg-new-fill-light block delay-[200ms]"
                    style={{
                      width: subTextWidth,
                      height: subTextHeight,
                    }}
                  />
                </div>
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </DataNotAvailable>
  );
}

export { VerticalFunnelChartNoDataSkeleton };
