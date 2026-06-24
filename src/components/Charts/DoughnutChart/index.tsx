import { forwardRef, useMemo } from 'react';
import { Pie } from '@visx/shape';
import { Group } from '@visx/group';
import { scaleOrdinal } from '@visx/scale';
import { PieChartLegends, PieChartLegendProps } from '../PieChartLegends';
import { DoughnutChartData } from './types';
import { ChartSkeleton, DoughnutSkeletonProps } from '../ChartsSkeletonLoader';
import { useAllZeroEffect } from '../NoDataSkeleton/hook/useAllZeroEffect';
import { DoughnutChartNoDataSkeleton } from '../NoDataSkeleton/DoughnutChartNoDataSkeleton';
import { DataNotAvailableProps } from '../NoDataSkeleton/DataNotAvailable';

export interface DoughnutChartMargins {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export type DisplayType = 'percentage' | 'value';

export interface DoughnutChartProps {
  height: number;
  width: number;
  margin: DoughnutChartMargins;
  doughnutChartData: DoughnutChartData[];
  chartData?: DoughnutChartData[];
  colorPalette: string[];
  displayType?: DisplayType;
  innerRadius?: number;
  text?: string;
  subText?: string;
  disableSort?: boolean;
  wrapperClassName?: string;
  dataTestId?: string;
  textClassName?: string;
  legendProps?: Omit<PieChartLegendProps, 'color' | 'pieChartData'>;
  centerTextClassName?: string;
  centerSubTextClassName?: string;
  isLoading?: boolean;
  skeletonProps?: Omit<
    DoughnutSkeletonProps,
    'height' | 'width' | 'margins' | 'animate' | 'type'
  >;
  noDataSkeletonProps?: DataNotAvailableProps;
}

export const DoughnutChart = forwardRef<HTMLDivElement, DoughnutChartProps>(
  (
    {
      width,
      height,
      margin,
      doughnutChartData,
      chartData,
      colorPalette,
      displayType = 'percentage',
      innerRadius = 80,
      text = '',
      dataTestId = 'doughnut-chart-test-id',
      wrapperClassName = '',
      subText = '',
      disableSort = false,
      textClassName = '',
      legendProps = undefined,
      centerTextClassName = '',
      centerSubTextClassName = '',
      isLoading = false,
      skeletonProps = {},
      noDataSkeletonProps = {},
    },
    ref,
  ) => {
    const dataForChart = chartData || doughnutChartData;
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    const radius = Math.min(innerWidth, innerHeight) / 2;
    const centerY = innerHeight / 2;
    const centerX = innerWidth / 2;
    const top = centerY + margin.top;
    const left = centerX + margin.left;

    const filteredData = [...dataForChart].filter((d) => d.value > 0);

    const chartDatas = disableSort
      ? filteredData
      : filteredData.sort((a, b) => b.value - a.value);

    const colorScale = scaleOrdinal<string>({
      domain: chartDatas.map((d) => d.label),
      range: colorPalette.slice(0, chartDatas.length),
    });

    const totalValue = chartDatas.reduce((sum, item) => sum + item.value, 0);

    const MIN_PERCENTAGE = 0.027;

    /*
     * Rounds each slice's exact percentage to integers that sum to exactly 100
     * using the "largest remainder" method.
     *
     * Example:
     *   exact   = [29.2, 24.7, 23.6, 14.5, 7.0]
     *   floor   = [29,   24,   23,   14,   7]  // sum = 97 → remainder = 3
     *   remain  = [0.2,  0.7,  0.6,  0.5,  0.0]
     *   add +1 to the floor values of the 3 largest remainders (0.7, 0.6, 0.5)
     *   result  = [29,   25,   24,   15,   7]  // sum = 100
     *
     * This will be used to display the percentages in the chart and the legend.
     *
     * For drawing the arcs, we use adjusted percentages that enforce a minimum slice size (MIN_PERCENTAGE),
     */
    const roundedPercentages = useMemo(() => {
      const exactPercentages = chartDatas.map(
        (d) => (d.value / totalValue) * 100,
      );
      const flooredPercentages = exactPercentages.map((percentage) =>
        Math.floor(percentage),
      );
      const decimals = exactPercentages.map((percentage, index) => ({
        index,
        decimal: percentage - (flooredPercentages[index] ?? 0),
      }));

      decimals.sort((a, b) => b.decimal - a.decimal);

      // Calculate how many percentage points we need to distribute
      const sum = flooredPercentages.reduce((acc, val) => acc + val, 0);
      const remainder = 100 - sum;

      // Adds +1 to the slices with the largest fractional remainders
      for (let i = 0; i < remainder; i += 1) {
        const decimalItem = decimals[i];
        const flooredValue = flooredPercentages[decimalItem?.index ?? 0];
        if (decimalItem && flooredValue !== undefined) {
          flooredPercentages[decimalItem.index] = flooredValue + 1;
        }
      }
      return flooredPercentages;
    }, [chartDatas, totalValue]);

    const adjustedData = useMemo(
      () =>
        chartDatas.map((d, index) => {
          const segmentPercentage = d.value / totalValue;
          const adjustedPercentage = Math.max(
            segmentPercentage,
            MIN_PERCENTAGE,
          );
          const displayPercentage = roundedPercentages[index] ?? 0;
          return {
            ...d,
            adjustedValue: adjustedPercentage,
            rawValue: d.value,
            displayPercentage,
            value: displayPercentage,
          };
        }),
      [chartDatas, totalValue, roundedPercentages],
    );

    const allZero = useAllZeroEffect<DoughnutChartData>({
      chartData: dataForChart,
      valueKey: 'value',
    });

    if (isLoading) {
      return (
        <ChartSkeleton
          height={height}
          width={width}
          margins={margin}
          animate
          type="doughnut"
          showLegend={legendProps !== undefined}
          showText={text !== ''}
          showSubText={subText !== ''}
          {...skeletonProps}
        />
      );
    }

    if (allZero || dataForChart.length === 0) {
      return (
        <DoughnutChartNoDataSkeleton
          height={height}
          margins={margin}
          width={width}
          showSubText={text !== ''}
          showLegend={legendProps !== undefined}
          showText={subText !== ''}
          {...noDataSkeletonProps}
        />
      );
    }

    return (
      <div
        className={`${wrapperClassName} flex items-center gap-8`}
        data-testid={dataTestId}
        ref={ref}
      >
        <svg width={width} height={height}>
          <Group top={top} left={left}>
            <Pie
              data={adjustedData}
              pieValue={(d) => d.adjustedValue}
              outerRadius={radius}
              innerRadius={innerRadius}
              cornerRadius={8}
              padAngle={0.05}
              pieSortValues={
                disableSort ? null : (a, b) => b.valueOf() - a.valueOf()
              }
            >
              {(pie) =>
                pie.arcs.map((arc) => {
                  const [centroidX, centroidY] = pie.path.centroid(arc);
                  const hasSpaceForLabel =
                    arc.endAngle - arc.startAngle >= 0.35;
                  const arcPath = pie.path(arc);
                  const arcFill = colorScale(arc.data.label)?.toString();

                  return (
                    <g key={`arc-${arc.data.key}`}>
                      <path d={arcPath!} fill={arcFill} />
                      {hasSpaceForLabel && (
                        <text
                          className={`${textClassName} paragraph-small font-medium`}
                          x={centroidX}
                          y={centroidY}
                          dy=".33em"
                          fill="#000000"
                          textAnchor="middle"
                          pointerEvents="none"
                        >
                          {displayType === 'percentage'
                            ? `${arc.data.displayPercentage}%`
                            : arc.data.rawValue}
                        </text>
                      )}
                    </g>
                  );
                })
              }
            </Pie>
            <text
              className={`${centerTextClassName} heading-3 fill-text-text font-semibold`}
              y="-11"
              textAnchor="middle"
              dominantBaseline="central"
            >
              {text}
            </text>
            <text
              className={`${centerSubTextClassName} paragraph-extra-small fill-text-text font-normal`}
              y="11"
              textAnchor="middle"
              dominantBaseline="central"
            >
              {subText}
            </text>
          </Group>
        </svg>

        {legendProps && (
          <PieChartLegends
            {...legendProps}
            color={colorPalette}
            pieChartData={adjustedData}
          />
        )}
      </div>
    );
  },
);
