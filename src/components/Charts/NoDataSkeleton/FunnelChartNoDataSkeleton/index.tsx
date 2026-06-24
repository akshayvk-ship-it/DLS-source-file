import React from 'react';
import DataNotAvailable, { DataNotAvailableProps } from '../DataNotAvailable';

/* eslint-disable import/prefer-default-export */
interface FunnelChartNoDataSkeletonProps extends DataNotAvailableProps {
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

function FunnelChartNoDataSkeleton({
  height,
  width,
  margins,
  ...dataNotAvailableProps
}: Readonly<FunnelChartNoDataSkeletonProps>) {
  const segmentsCount = 4;
  const chartWidth = width - margins.left - margins.right;
  const centerY = height / 2;

  const createFunnelPath = (): string => {
    const startWidth = 120;
    const endWidth = 30;

    const path = `
      M 0 ${centerY - startWidth / 2}
      C ${chartWidth * 0.2} ${centerY - startWidth * 0.4}, ${chartWidth * 0.4} ${centerY - startWidth * 0.3}, ${chartWidth * 0.6} ${centerY - endWidth * 1.2}
      C ${chartWidth * 0.8} ${centerY - endWidth * 0.8}, ${chartWidth * 0.9} ${centerY - endWidth * 0.6}, ${chartWidth} ${centerY - endWidth / 2}
      L ${chartWidth} ${centerY + endWidth / 2}
      C ${chartWidth * 0.9} ${centerY + endWidth * 0.6}, ${chartWidth * 0.8} ${centerY + endWidth * 0.8}, ${chartWidth * 0.6} ${centerY + endWidth * 1.2}
      C ${chartWidth * 0.4} ${centerY + startWidth * 0.3}, ${chartWidth * 0.2} ${centerY + startWidth * 0.4}, 0 ${centerY + startWidth / 2}
      Z
    `;

    return path;
  };

  const funnelPath = createFunnelPath();

  return (
    <DataNotAvailable width={width} height={height} {...dataNotAvailableProps}>
      <div style={{ width, height, position: 'relative', background: '#fff' }}>
        <svg width={width} height={height}>
          <defs>
            <linearGradient
              id="funnel-skeleton-gradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor="#e5e7eb" />
              <stop offset="100%" stopColor="#d1d5db" />
            </linearGradient>
          </defs>

          <path
            d={funnelPath}
            fill="url(#funnel-skeleton-gradient)"
            opacity={0.7}
            transform={`translate(${margins.left}, 0)`}
          />
        </svg>

        {Array.from({ length: segmentsCount }, (_, i) => {
          const x = (chartWidth / segmentsCount) * i + 5;
          return (
            <React.Fragment key={`text-group-${i}`}>
              <div
                style={{
                  position: 'absolute',
                  left: margins.left + x,
                  top: margins.top - 15,
                }}
              >
                <div className="h-3 w-[60px] bg-[#e5e7eb]" />
              </div>

              <div
                style={{
                  position: 'absolute',
                  left: margins.left + x,
                  top: margins.top + 8,
                }}
              >
                <div className="h-4 w-[50px] bg-[#e5e7eb]" />
              </div>

              <div
                style={{
                  position: 'absolute',
                  left: margins.left + x,
                  top: height - 15,
                }}
              >
                <div className="h-3 w-10 bg-[#e5e7eb]" />
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </DataNotAvailable>
  );
}

export { FunnelChartNoDataSkeleton };
