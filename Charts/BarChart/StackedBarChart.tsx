import { forwardRef, Fragment, useEffect, useRef, useState } from 'react';
import { AxisBottom, AxisLeft, TickRendererProps } from '@visx/axis';
import { scaleBand, scaleLinear } from '@visx/scale';
import { GridRows } from '@visx/grid';
import { BarStack } from '@visx/shape';
import { Group } from '@visx/group';
import { Text } from '@visx/text';
import { scaleOrdinal } from '@visx/vendor/d3-scale';

import { Legends, LegendsProps } from '../Legends';

interface StackedData {
  [key: string]: number;
}

interface BarChartData {
  label: string;
}

export type StackedBarChartData = BarChartData & StackedData;

export interface StackedBarChartMargins {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface StackedBarChartProps {
  height: number;
  width: number;
  stackedBarChartData: StackedBarChartData[];
  chartData?: StackedBarChartData[];
  legendsProps?: LegendsProps;
  margins: StackedBarChartMargins;
  xAxisPaddings?: number;
  axisLeftValueGap?: number;
  axisLeftTickFormatter?: (value: number) => string;
  axisBottomTickFormatter?: (value: string) => string;
  dataTestId?: string;
  shadowFloodColor: string;
  barPathClassName?: string;
  wrapperClassName?: string;
  colorPalette: string[];
  textClassName?: string;
}

export const StackedBarChart = forwardRef<HTMLDivElement, StackedBarChartProps>(
  (
    {
      legendsProps,
      stackedBarChartData,
      chartData,
      height,
      width,
      margins,
      xAxisPaddings = 0.4,
      axisLeftValueGap,
      axisLeftTickFormatter,
      axisBottomTickFormatter,
      dataTestId = 'bar-chart-test-id',
      shadowFloodColor,
      wrapperClassName = '',
      barPathClassName = '',
      colorPalette,
      textClassName = '',
    },
    ref,
  ) => {
    const dataForChart = chartData || stackedBarChartData;
    const gapWithLeftAxis = 16;

    const labelRef = useRef(null);
    const [maxWidth, setMaxWidth] = useState(0);

    const xScale = scaleBand({
      domain: dataForChart.map((d) => d.label),
      range: [margins.left, width - margins.right],
      round: true,
      padding: xAxisPaddings,
    });

    const keys = Object.keys(dataForChart[0] || {}).filter(
      (d) => d !== 'label',
    );

    const maxValue = Math.max(
      ...dataForChart.map((d) =>
        keys.reduce((sum, key) => sum + (d[key] || 0), 0),
      ),
    );

    const yScale = scaleLinear({
      domain: [0, maxValue],
      range: [height - margins.bottom, margins.top],
      nice: true,
    });

    const colorScale = scaleOrdinal<keyof StackedData, string>()
      .domain(keys)
      .range(colorPalette.slice(0, keys.length));

    const maxYLabelValue = Math.max(...yScale.domain());

    const calculateLabelWidth = (labels: string[]) => {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      context!.font = '12px Arial';
      return Math.max(
        ...labels.map(
          (label) =>
            context!.measureText(
              axisLeftTickFormatter?.(label as unknown as number) || label,
            ).width,
        ),
      );
    };

    useEffect(() => {
      setMaxWidth(calculateLabelWidth(dataForChart.map((d) => d.label)) + 20);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dataForChart]);

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
        className="!label-small fill-[rgba(0,0,0,0.4)] text-left"
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

    const calculateTextPercent = (val: number[]) => {
      if (!val[1]) return '';

      const currentValue = val[1] - val[0]!;

      if (currentValue === 0) return '';

      return `${Math.floor((currentValue * 100) / maxValue)}%`;
    };

    return (
      <div
        className={`${wrapperClassName} relative flex items-end gap-10`}
        data-testid={dataTestId}
        ref={ref}
      >
        <svg width={width} height={height}>
          <Group>
            <GridRows
              scale={yScale}
              width={width - margins.left + margins.right}
              height={height - margins.top}
              numTicks={axisLeftValueGap}
              strokeDasharray="4 4"
              strokeWidth={0.5}
              stroke="rgba(208, 211, 216, 1)"
              left={gapWithLeftAxis + maxWidth}
              className="[&>*:first-child]:[stroke-dasharray:none]"
            />
            <AxisLeft
              scale={yScale}
              left={maxWidth}
              numTicks={axisLeftValueGap}
              hideTicks
              hideAxisLine
              tickLabelProps={() => ({
                className: '!label-small fill-[rgba(0,0,0,0.4)] text-left',
                dx: '0rem',
                textAnchor: 'end',
                dominantBaseline: 'middle',
              })}
              tickFormat={
                axisLeftTickFormatter
                  ? (value) => axisLeftTickFormatter(value as number)
                  : undefined
              }
              tickComponent={renderTextComponent}
            />
            <Group width={width} className="relative z-10">
              <BarStack
                data={dataForChart}
                keys={keys}
                color={colorScale}
                x={(d) => d.label}
                xScale={xScale}
                yScale={yScale}
              >
                {(barStacks) =>
                  barStacks.map((barStack, index) =>
                    barStack.bars.map((bar) => {
                      const radius = index === keys.length - 1 ? 4 : 0;
                      return (
                        <Fragment
                          key={`bar-group-bar-${bar.index}-${bar.index}-${bar.key}`}
                        >
                          <path
                            d={`
                              M ${bar.x} ${bar.y + radius} 
                              Q ${bar.x} ${bar.y} ${bar.x + radius} ${bar.y} 
                              H ${bar.x + bar.width - radius} 
                              Q ${bar.width + bar.x} ${bar.y} ${bar.width + bar.x} ${bar.y + radius} 
                              V ${bar.y + bar.height} 
                              H ${bar.x} 
                              Z
                            `}
                            fill={bar.color}
                            style={{
                              filter: "url('#stacked-bar-shadow')",
                            }}
                            className={`${barPathClassName}`}
                          />
                          <Text
                            x={bar.x + bar.width / 2}
                            y={bar.y + bar.height / 2}
                            textAnchor="middle"
                            verticalAnchor="middle"
                            className={`${textClassName} !label-extra-small fill-[rgba(0,0,0,0.6)] text-left`}
                          >
                            {calculateTextPercent(bar.bar)}
                          </Text>
                        </Fragment>
                      );
                    }),
                  )
                }
              </BarStack>
              <defs>
                <filter
                  id="stacked-bar-shadow"
                  filterUnits="userSpaceOnUse"
                  colorInterpolationFilters="sRGB"
                >
                  <feDropShadow
                    dx="4"
                    dy="0"
                    stdDeviation="0"
                    floodColor={shadowFloodColor || 'rgb(251,203,176)'}
                  />
                </filter>
              </defs>
            </Group>
            <AxisBottom
              scale={xScale}
              hideTicks
              hideZero
              top={height - margins.bottom}
              tickLabelProps={() => ({
                className: '!label-small fill-[rgba(0,0,0,0.4)]',
                textAnchor: 'middle',
                dy: '0.5rem',
              })}
              hideAxisLine
              tickFormat={
                axisBottomTickFormatter
                  ? (value) => axisBottomTickFormatter(value)
                  : undefined
              }
            />
          </Group>
        </svg>
        {legendsProps && <Legends {...legendsProps} />}
      </div>
    );
  },
);
