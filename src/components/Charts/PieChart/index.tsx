import { forwardRef } from 'react';
import { Pie } from '@visx/shape';
import { Group } from '@visx/group';
import { scaleOrdinal } from '@visx/scale';
import { PieChartLegends, PieChartLegendProps } from '../PieChartLegends';
import { PieChartData } from './types';

export interface PieChartMargins {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

type DisplayType = 'percentage' | 'value';

export interface PieChartProps {
  height: number;
  width: number;
  margin: PieChartMargins;
  pieChartData: PieChartData[];
  chartData?: PieChartData[];
  colorPalette: string[];
  displayType?: DisplayType;
  wrapperClassName?: string;
  legendProps?: Omit<PieChartLegendProps, 'color' | 'pieChartData'>;
  dataTestId?: string;
  textClassName?: string;
  disableSort?: boolean;
}

export const PieChart = forwardRef<HTMLDivElement, PieChartProps>(
  (
    {
      width,
      height,
      margin,
      pieChartData,
      colorPalette,
      displayType = 'percentage',
      wrapperClassName = '',
      legendProps,
      dataTestId = 'pie-chart-test-id',
      textClassName = '',
      disableSort = false,
      chartData,
    },
    ref,
  ) => {
    const dataForChart = chartData || pieChartData;
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    const radius = Math.min(innerWidth, innerHeight) / 2;
    const centerY = innerHeight / 2;
    const centerX = innerWidth / 2;
    const top = centerY + margin.top;
    const left = centerX + margin.left;

    const chartDatas = disableSort
      ? dataForChart
      : [...dataForChart].sort((a, b) => b.value - a.value);

    const colorScale = scaleOrdinal<string>({
      domain: chartDatas.map((d) => d.label),
      range: colorPalette.slice(0, chartDatas.length),
    });

    const totalValue = chartDatas.reduce((sum, item) => sum + item.value, 0);

    return (
      <div
        className={`${wrapperClassName} relative flex items-center ${legendProps ? 'gap-8' : ''}`}
        data-testid={dataTestId}
        ref={ref}
      >
        <svg width={width} height={height}>
          <Group top={top} left={left}>
            <Pie
              data={chartDatas}
              pieValue={(d) => d.value}
              outerRadius={radius}
              // If null, the arcs match input data order.
              pieSort={null}
            >
              {(pie) =>
                pie.arcs.map((arc) => {
                  const [centroidX, centroidY] = pie.path.centroid(arc);
                  const hasSpaceForLabel = arc.endAngle - arc.startAngle >= 0.1;
                  const arcPath = pie.path(arc);
                  const arcFill = colorScale(arc.data.label)?.toString();
                  const percentage = (
                    (arc.data.value / totalValue) *
                    100
                  ).toFixed(0);

                  return (
                    <g key={`arc-${arc.data.key}`}>
                      <path d={arcPath!} fill={arcFill} />
                      {hasSpaceForLabel && (
                        <text
                          x={centroidX}
                          y={centroidY}
                          dy=".33em"
                          fill="#000000"
                          fontSize={13}
                          textAnchor="middle"
                          pointerEvents="none"
                          className={`${textClassName} font-medium`}
                        >
                          {displayType === 'percentage'
                            ? `${percentage}%`
                            : arc.value}
                        </text>
                      )}
                    </g>
                  );
                })
              }
            </Pie>
          </Group>
        </svg>
        {legendProps && (
          <PieChartLegends
            {...legendProps}
            color={colorPalette}
            pieChartData={dataForChart}
          />
        )}
      </div>
    );
  },
);
