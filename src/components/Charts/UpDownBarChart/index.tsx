import { forwardRef } from 'react';
import { scaleLinear } from '@visx/scale';
import { Group } from '@visx/group';
import { BrushBarSkeletonProps, ChartSkeleton } from '../ChartsSkeletonLoader';
import { useAllZeroEffect } from '../NoDataSkeleton/hook/useAllZeroEffect';
import { UpDownBarChartNoDataSkeleton } from '../NoDataSkeleton/UpDownBarChartNoDataSkeleton';
import { DataNotAvailableProps } from '../NoDataSkeleton/DataNotAvailable';

export interface UpDownBarChartData {
  label: string;
  successRate: number;
  failureRate: number;
}

export interface UpDownBarChartMargins {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface UpDownColors {
  success: string;
  failure: string;
  separationColor?: string;
}

export interface UpDownBarChartProps {
  height: number;
  width: number;
  barChartData: UpDownBarChartData[];
  chartData?: UpDownBarChartData[];
  margins: UpDownBarChartMargins;
  dataTestId?: string;
  wrapperClassName?: string;
  barColors?: UpDownColors;
  isLoading?: boolean;
  skeletonProps?: Omit<
    BrushBarSkeletonProps,
    'height' | 'width' | 'margins' | 'animate' | 'type'
  >;
  noDataSkeletonProps?: DataNotAvailableProps;
}

export const UpDownBarChart = forwardRef<HTMLDivElement, UpDownBarChartProps>(
  (
    {
      height,
      width,
      barChartData,
      chartData,
      margins,
      dataTestId = 'UpDownBarChart-testId',
      wrapperClassName = '',
      barColors,
      isLoading,
      skeletonProps = {},
      noDataSkeletonProps = {},
    },
    ref,
  ) => {
    const dataForChart = chartData || barChartData;
    const chartWidth = width - margins.left - margins.right;
    const chartHeight = height - margins.top - margins.bottom;
    const barSpacing = 6;

    const barWidth = chartWidth / dataForChart.length - barSpacing;

    const xScale = scaleLinear({
      domain: [0, dataForChart.length - 1],
      range: [0, chartWidth - barWidth],
    });

    const baselineY = chartHeight / 2;

    const total = dataForChart.length;

    const totalSuccessRate = dataForChart.reduce(
      (sum, item) => sum + item.successRate,
      0,
    );
    const avgSuccessRate = totalSuccessRate / total;

    const allZeroSuccess = useAllZeroEffect<UpDownBarChartData>({
      chartData: dataForChart,
      valueKey: 'successRate',
    });

    const allZeroFailure = useAllZeroEffect<UpDownBarChartData>({
      chartData: dataForChart,
      valueKey: 'failureRate',
    });

    if (isLoading) {
      return (
        <ChartSkeleton
          height={height}
          width={width}
          margins={margins}
          animate
          type="brushBar"
          {...skeletonProps}
        />
      );
    }

    if (allZeroSuccess && allZeroFailure) {
      return (
        <UpDownBarChartNoDataSkeleton
          height={height}
          margins={margins}
          width={width}
          {...noDataSkeletonProps}
        />
      );
    }

    return (
      <div className={wrapperClassName} data-testid={dataTestId} ref={ref}>
        <svg width={width} height={height}>
          <Group left={margins.left} top={margins.top}>
            {dataForChart.map((item, index) => {
              const successHeight =
                (item.successRate / 100) * (chartHeight / 2);
              const failureHeight =
                (item.failureRate / 100) * (chartHeight / 2);
              const x = xScale(index) + barSpacing / 2;
              const ySuccess = baselineY - successHeight;
              const yFailure = baselineY;
              const borderRadius = barWidth / 2;

              return (
                <g key={`bar-${item.label}`}>
                  {successHeight > 0 && (
                    <path
                      d={`
                        M ${x} ${ySuccess + borderRadius}
                        A ${borderRadius} ${borderRadius} 0 0 1 ${x + borderRadius} ${ySuccess}
                        L ${x + barWidth - borderRadius} ${ySuccess}
                        A ${borderRadius} ${borderRadius} 0 0 1 ${x + barWidth} ${ySuccess + borderRadius}
                        L ${x + barWidth} ${ySuccess + successHeight}
                        L ${x} ${ySuccess + successHeight}
                        Z
                        `}
                      fill={barColors?.success || '#00DD76'}
                    />
                  )}
                  {failureHeight > 0 && (
                    <path
                      d={`
                        M ${x} ${yFailure}
                        L ${x} ${yFailure + failureHeight - borderRadius}
                        A ${borderRadius} ${borderRadius} 0 0 0 ${x + borderRadius} ${yFailure + failureHeight}
                        L ${x + barWidth - borderRadius} ${yFailure + failureHeight}
                        A ${borderRadius} ${borderRadius} 0 0 0 ${x + barWidth} ${yFailure + failureHeight - borderRadius}
                        L ${x + barWidth} ${yFailure}
                        Z
                      `}
                      fill={barColors?.failure || '#F06470'}
                    />
                  )}
                </g>
              );
            })}
            <line
              x1={2}
              y1={baselineY}
              x2={chartWidth + barSpacing / 2}
              y2={baselineY}
              stroke={barColors?.separationColor || '#000000'}
              strokeWidth="1"
            />
            <text
              x={0}
              y={0}
              className="fill-text-text paragraph-medium"
              dy={-10}
            >
              100%
            </text>
            <text
              x={0}
              y={chartHeight}
              className="fill-text-text paragraph-medium"
              dy={24}
            >
              100%
            </text>
            <text
              x={chartWidth}
              y={0}
              textAnchor="end"
              className="fill-text-text heading-3-semibold  !text-base"
              dy={-10}
            >
              Success {avgSuccessRate.toFixed(2)}%
            </text>
            <text
              x={chartWidth}
              y={chartHeight}
              textAnchor="end"
              className="fill-text-text heading-3-semibold !text-base"
              dy={24}
            >
              Failure {100 - Number(avgSuccessRate.toFixed(2))}%
            </text>
          </Group>
        </svg>
      </div>
    );
  },
);
