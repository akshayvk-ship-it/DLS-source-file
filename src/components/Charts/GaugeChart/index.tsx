import { forwardRef } from 'react';
import { Group } from '@visx/group';
import { LinearGradient } from '@visx/gradient';
import { scaleLinear } from '@visx/scale';
import { ChartSkeleton, GaugeSkeletonProps } from '../ChartsSkeletonLoader';
import { GaugeChartNoDataSkeleton } from '../NoDataSkeleton/GaugeChartNoDataSkeleton';
import { DataNotAvailableProps } from '../NoDataSkeleton/DataNotAvailable';

export interface GaugeChartMargins {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface ChartDataItem {
  value: number;
  label?: string;
  unit?: string;
  color?: string;
}

export interface BottomInfoData {
  label?: string;
  color?: string;
}

export interface GaugeChartData {
  mainInfo: ChartDataItem;
  info1?: ChartDataItem;
  info2?: ChartDataItem;
  info3?: ChartDataItem;
  bottomInfo?: BottomInfoData;
  bottomSubInfo?: BottomInfoData;
}

export interface GaugeChartProps {
  height: number;
  width: number;
  chartData?: GaugeChartData;
  margin: GaugeChartMargins;
  successColor?: [string, string];
  radius?: number;
  segmentThickness?: number;
  segmentCount?: number;
  failureColor?: string | undefined;
  labelColor?: string | undefined;
  wrapperClassName?: string;
  dataTestId?: string;
  isLoading?: boolean;
  skeletonProps?: Omit<
    GaugeSkeletonProps,
    'height' | 'width' | 'margins' | 'animate' | 'type'
  >;
  noDataSkeletonProps?: DataNotAvailableProps;
  showZeroData?: boolean;

  // TODO: Deprecated all these props on Major version Update
  successRate?: number;
  failureRate?: number;
  averageTime?: number;
  dropOffRate?: number;
  startColor?: string | undefined;
  endColor?: string | undefined;
  // ------ Till here ---
}

export const GaugeChart = forwardRef<HTMLDivElement, GaugeChartProps>(
  (
    {
      height,
      width,
      chartData,
      margin,
      successColor,
      radius = 150,
      segmentThickness = 40,
      segmentCount = 20,
      failureColor = '#F5F5F5',
      labelColor = '#848B98',
      wrapperClassName = '',
      dataTestId = 'gauge-chart-test-id',
      successRate,
      failureRate,
      averageTime,
      dropOffRate,
      startColor,
      endColor,
      isLoading = false,
      skeletonProps = {},
      noDataSkeletonProps = {},
      showZeroData = false,
    },
    ref,
  ) => {
    const innerWidth = width - (margin.left + margin.right);
    const innerHeight = height - (margin.top + margin.bottom);
    const centerY = innerHeight / 2;
    const centerX = innerWidth / 2;

    const startAngle = Math.PI * 0.85;
    const endAngle = Math.PI * 2.15 + 0.07;
    const totalAngle = endAngle - startAngle;

    const count = segmentCount;
    const segmentRadius = radius;
    const segThickness = segmentThickness;

    const filledSegments =
      chartData?.mainInfo && chartData.mainInfo.value !== undefined
        ? Math.round((chartData.mainInfo.value / 100) * count)
        : Math.round(((successRate || 1) / 100) * count);

    const padAngle = 0.075;
    const segmentAngle = totalAngle / count - padAngle;

    const colorScale = scaleLinear({
      domain: [0, count - 1],
      range: [successColor?.[0] || startColor, successColor?.[1] || endColor],
    });

    const segments = Array.from({ length: count }, (_, i) => {
      const segmentStartAngle = startAngle + i * (segmentAngle + padAngle);
      const segmentEndAngle = segmentStartAngle + segmentAngle;
      const isFilled = i < filledSegments;
      const segmentColor = colorScale(i);

      return {
        startAngle: segmentStartAngle,
        endAngle: segmentEndAngle,
        isFilled,
        segmentColor,
      };
    });

    const tickCount = 71;
    const tickHeight = 13;
    const tickSegmentGap = 20;

    const ticks = Array.from({ length: tickCount }, (_, i) => {
      const angle = startAngle + i * (totalAngle / tickCount);

      const isLongTick = i % 7 === 0 || i === 0 || i === tickCount - 1;
      const tickInnerOffset =
        segmentRadius -
        segThickness -
        tickHeight -
        tickSegmentGap -
        (isLongTick ? tickHeight / 2 : 0);

      const innerPoint = {
        x: centerX + tickInnerOffset * Math.cos(angle),
        y: centerY + tickInnerOffset * Math.sin(angle),
      };
      const outerPoint = {
        x: centerX + (segmentRadius - segThickness - 20) * Math.cos(angle),
        y: centerY + (segmentRadius - segThickness - 20) * Math.sin(angle),
      };
      return { innerPoint, outerPoint };
    });

    if (isLoading) {
      return (
        <ChartSkeleton
          height={height}
          width={width}
          margins={margin}
          animate
          type="gauge"
          {...skeletonProps}
        />
      );
    }

    if (showZeroData) {
      return (
        <GaugeChartNoDataSkeleton
          height={height}
          margins={margin}
          width={width}
          {...noDataSkeletonProps}
        />
      );
    }

    return (
      <div
        className={`${wrapperClassName} relative flex items-center justify-center`}
        data-testid={dataTestId}
        ref={ref}
      >
        <svg width={width} height={height}>
          <LinearGradient
            id="linearGradient"
            from={successColor?.[0] || startColor}
            to={successColor?.[1] || endColor}
          />
          <Group top={margin.top} left={margin.left}>
            {ticks.map((tick, i) => (
              <line
                // eslint-disable-next-line react/no-array-index-key
                key={`tick-${i}`}
                x1={tick.innerPoint.x}
                y1={tick.innerPoint.y}
                x2={tick.outerPoint.x}
                y2={tick.outerPoint.y}
                stroke="#EFEFF1"
                strokeWidth={1}
              />
            ))}
            {segments.map((segment, i) => {
              const outerRadius = segmentRadius;
              const innerRadius = segmentRadius - segThickness;

              const largeArcFlag = segmentAngle > Math.PI ? 1 : 0;

              const outerStart = {
                x: centerX + outerRadius * Math.cos(segment.startAngle),
                y: centerY + outerRadius * Math.sin(segment.startAngle),
              };
              const outerEnd = {
                x: centerX + outerRadius * Math.cos(segment.endAngle),
                y: centerY + outerRadius * Math.sin(segment.endAngle),
              };
              const innerEnd = {
                x: centerX + innerRadius * Math.cos(segment.endAngle),
                y: centerY + innerRadius * Math.sin(segment.endAngle),
              };
              const innerStart = {
                x: centerX + innerRadius * Math.cos(segment.startAngle),
                y: centerY + innerRadius * Math.sin(segment.startAngle),
              };

              const pathData = `
                M ${outerStart.x},${outerStart.y}
                A ${outerRadius},${outerRadius} 0 ${largeArcFlag} 1 ${outerEnd.x},${outerEnd.y}
                L ${innerEnd.x},${innerEnd.y}
                A ${innerRadius},${innerRadius} 0 ${largeArcFlag} 0 ${innerStart.x},${innerStart.y}
                Z
              `;

              return (
                <path
                  // eslint-disable-next-line react/no-array-index-key
                  key={i}
                  d={pathData}
                  fill={segment.isFilled ? segment.segmentColor : failureColor}
                  stroke={
                    segment.isFilled ? segment.segmentColor : failureColor
                  }
                  strokeWidth="6"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
              );
            })}
            <text
              x={centerX}
              y={centerY - 15}
              textAnchor="middle"
              alignmentBaseline="central"
              fontFamily="inter"
              fontSize={51}
              fontWeight="normal"
              fill={chartData?.mainInfo?.color || endColor}
            >
              {chartData?.mainInfo?.value ?? successRate}

              <tspan dy={0} fontSize={17}>
                {chartData?.mainInfo?.unit || (successRate && '%')}
              </tspan>
            </text>
            {chartData?.mainInfo.label && (
              <text
                x={centerX}
                y={centerY + 20}
                textAnchor="middle"
                alignmentBaseline="central"
                fontFamily="inter"
                fontSize={14}
                fill={labelColor || '#888888'}
              >
                {chartData?.mainInfo?.label || 'Success rate'}
              </text>
            )}
            {chartData?.info1 && (
              <>
                <text
                  x={centerX - 70}
                  y={centerY + 70}
                  textAnchor="middle"
                  fontFamily="inter"
                  fontSize={14}
                  fill={chartData?.info1?.color || '#D2205B'}
                >
                  {chartData?.info1?.value ?? failureRate}
                  {chartData?.info1?.unit || (failureRate && '%')}
                </text>
                <text
                  x={centerX - 70}
                  y={centerY + 90}
                  textAnchor="middle"
                  fontFamily="inter"
                  fontSize={12}
                  fill={labelColor || '#848B98'}
                >
                  {chartData?.info1?.label || 'Failure'}
                </text>
              </>
            )}
            {chartData?.info2 && (
              <>
                <text
                  x={centerX}
                  y={centerY + 70}
                  textAnchor="middle"
                  fontFamily="inter"
                  fontSize={14}
                  fill={chartData?.info2?.color || '#EDA200'}
                >
                  {chartData?.info2?.value ?? averageTime}{' '}
                  {chartData?.info2?.unit || (averageTime && 'sec')}
                </text>
                <text
                  x={centerX}
                  y={centerY + 90}
                  textAnchor="middle"
                  fontFamily="inter"
                  fontSize={12}
                  fill={labelColor || '#848B98'}
                >
                  {chartData?.info2?.label || 'Avg time'}
                </text>
              </>
            )}
            {chartData?.info3 && (
              <>
                <text
                  x={centerX + 70}
                  y={centerY + 70}
                  textAnchor="middle"
                  fontFamily="inter"
                  fontSize={14}
                  fill={chartData?.info3?.color || '#D2205B'}
                >
                  {chartData?.info3?.value ?? dropOffRate}
                  {chartData?.info3?.unit || (dropOffRate && '%')}
                </text>
                <text
                  x={centerX + 70}
                  y={centerY + 90}
                  textAnchor="middle"
                  fontFamily="inter"
                  fontSize={12}
                  fill={labelColor || '#848B98'}
                >
                  {chartData?.info3?.label || 'Drop-off'}
                </text>
              </>
            )}
            {chartData?.bottomInfo && (
              <text
                x={centerX}
                y={centerY + 75}
                textAnchor="middle"
                fontFamily="inter"
                fontSize={16}
                fontWeight="600"
                fill={chartData?.bottomInfo?.color}
              >
                {chartData?.bottomInfo?.label}
              </text>
            )}
            {chartData?.bottomSubInfo && (
              <text
                x={centerX}
                y={centerY + 95}
                textAnchor="middle"
                fontFamily="inter"
                fontSize={14}
                fontWeight="normal"
                fill={chartData?.bottomSubInfo?.color || '#848B98'}
              >
                {chartData?.bottomSubInfo?.label}
              </text>
            )}
          </Group>
        </svg>
      </div>
    );
  },
);
