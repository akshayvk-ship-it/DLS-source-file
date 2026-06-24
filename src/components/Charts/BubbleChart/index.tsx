import { AxisBottom, AxisLeft, TickRendererProps } from '@visx/axis';
import { Group } from '@visx/group';
import { scaleBand, scaleLinear } from '@visx/scale';
import { Circle } from '@visx/shape';
import { Text } from '@visx/text';
import { forwardRef, useRef } from 'react';
import { BubbleSkeletonProps, ChartSkeleton } from '../ChartsSkeletonLoader';
import { useAllZeroEffect } from '../NoDataSkeleton/hook/useAllZeroEffect';
import { BubbleChartNoDataSkeleton } from '../NoDataSkeleton/BubbleChartNoDataSkeleton';
import { DataNotAvailableProps } from '../NoDataSkeleton/DataNotAvailable';

export interface BubbleChartData {
  xValue: string;
  yValue: number;
  zValue: number;
}

export interface BubbleChartProps {
  bubbleChartData: BubbleChartData[];
  chartData?: BubbleChartData[];
  height: number;
  width: number;
  margin: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  colors: string[];
  axisLeftTickFormatter?: (value: number) => string;
  axisBottomTickFormatter?: (value: string) => string;
  dataTestId?: string;
  wrapperClassName?: string;
  isLoading?: boolean;
  skeletonProps?: Omit<
    BubbleSkeletonProps,
    'height' | 'width' | 'margins' | 'animate' | 'type'
  >;
  noDataSkeletonProps?: DataNotAvailableProps;
}

export const BubbleChart = forwardRef<HTMLDivElement, BubbleChartProps>(
  (
    {
      bubbleChartData,
      chartData,
      height,
      width,
      margin,
      colors,
      axisLeftTickFormatter,
      axisBottomTickFormatter,
      dataTestId = 'bubble-chart-test-id',
      wrapperClassName = '',
      isLoading = false,
      skeletonProps = {},
      noDataSkeletonProps = {},
    },
    ref,
  ) => {
    const dataForChart = chartData || bubbleChartData;
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const xScale = scaleBand({
      domain: dataForChart.map((d) => d.xValue),
      range: [0, innerWidth],
      padding: 0.3,
    });

    const yMax = Math.max(...dataForChart.map((d) => d.yValue)) * 1.1;
    const yScale = scaleLinear({
      domain: [0, yMax],
      range: [innerHeight, 0],
    });

    const zMin = Math.min(...dataForChart.map((d) => d.zValue));
    const zMax = Math.max(...dataForChart.map((d) => d.zValue));
    const zStep = (zMax - zMin) / 5;

    const getSizeLevel = (z: number) =>
      Math.min(Math.floor((z - zMin) / zStep), 4);

    const rScale = [6, 12, 18, 24, 30];

    const labelRef = useRef(null);
    const maxYLabelValue = Math.max(...yScale.domain());

    const renderTextComponent = ({
      x,
      y,
      formattedValue,
    }: TickRendererProps) => (
      <Text
        x={x}
        y={y}
        textAnchor="end"
        verticalAnchor="middle"
        className="label-small fill-text-light"
        innerTextRef={
          (axisLeftTickFormatter &&
            axisLeftTickFormatter(maxYLabelValue) === formattedValue) ||
          maxYLabelValue.toString() === formattedValue
            ? labelRef
            : null
        }
      >
        {formattedValue}
      </Text>
    );

    const allZero = useAllZeroEffect<BubbleChartData>({
      chartData: dataForChart,
      valueKey: 'yValue',
    });

    if (isLoading) {
      return (
        <ChartSkeleton
          height={height}
          width={width}
          margins={margin}
          animate
          type="bubble"
          {...skeletonProps}
        />
      );
    }

    if (allZero || dataForChart.length === 0) {
      return (
        <BubbleChartNoDataSkeleton
          height={height}
          margins={margin}
          width={width}
          {...noDataSkeletonProps}
        />
      );
    }

    return (
      <div className={wrapperClassName} data-testid={dataTestId} ref={ref}>
        <svg width={width} height={height}>
          <Group top={margin.top} left={margin.left}>
            <AxisLeft
              scale={yScale}
              left={0}
              hideTicks
              hideAxisLine
              tickFormat={
                axisLeftTickFormatter
                  ? (value) => axisLeftTickFormatter(value as number)
                  : undefined
              }
              tickComponent={renderTextComponent}
            />

            <AxisBottom
              scale={xScale}
              top={innerHeight}
              hideTicks
              tickLabelProps={() => ({
                className: 'label-small fill-text-light',
                textAnchor: 'middle',
              })}
              hideAxisLine
              tickFormat={
                axisBottomTickFormatter
                  ? (value) => axisBottomTickFormatter(value)
                  : undefined
              }
            />

            {dataForChart.map((d, index) => {
              const x = xScale(d.xValue);
              const y = yScale(d.yValue);
              if (x == null || y == null) return null;

              const sizeLevel = getSizeLevel(d.zValue);
              const radius = rScale[sizeLevel];
              const fill = colors[sizeLevel];

              return (
                // eslint-disable-next-line react/no-array-index-key
                <Group key={`${d.xValue}-${index}`}>
                  <Circle
                    cx={x + xScale.bandwidth() / 2}
                    cy={y}
                    r={radius}
                    fill={fill}
                  />
                  {sizeLevel >= 2 && (
                    <Text
                      x={x + xScale.bandwidth() / 2}
                      y={y}
                      textAnchor="middle"
                      verticalAnchor="middle"
                      className="label-small fill-text-text"
                    >
                      {d.zValue}
                    </Text>
                  )}
                </Group>
              );
            })}
          </Group>
        </svg>
      </div>
    );
  },
);
