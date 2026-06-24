import { forwardRef, Fragment, useEffect, useRef, useState } from 'react';
import { AxisBottom, AxisLeft, TickRendererProps } from '@visx/axis';
import { scaleBand, scaleLinear } from '@visx/scale';
import { GridRows } from '@visx/grid';
import { BarGroup } from '@visx/shape';
import { Group } from '@visx/group';
import { Text } from '@visx/text';
import { scaleOrdinal } from '@visx/vendor/d3-scale';

import { Legends, LegendsProps } from '../Legends';

interface GroupedData {
  [key: string]: number;
}

interface BarChartData {
  label: string;
}

export type GroupedBarChartData = BarChartData & GroupedData;

export interface GroupedBarChartMargins {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface GroupedDiagonalLineColors {
  bgClassName: string;
  lineClassName: string;
}

export interface GroupedBarGradientValues {
  stopColor1?: string;
  stopColor2?: string;
  offset1?: string;
  offset2?: string;
}

export interface GroupedBarShadowColors {
  maxFloodColor?: string;
  floodColor?: string;
}

export interface GroupedBarChartProps {
  height: number;
  width: number;
  barChartData: GroupedBarChartData[];
  chartData?: GroupedBarChartData[];
  legendsProps?: LegendsProps;
  margins: GroupedBarChartMargins;
  xAxisPaddings?: number;
  axisLeftValueGap?: number;
  axisLeftTickFormatter?: (value: number) => string;
  axisBottomTickFormatter?: (value: string) => string;
  dataTestId?: string;
  diagonalLineColors?: GroupedDiagonalLineColors;
  barGradientValues?: GroupedBarGradientValues;
  shadowColors?: GroupedBarShadowColors;
  barPathClassName?: string;
  wrapperClassName?: string;
  textClassName?: string;
}

export const GroupedBarChart = forwardRef<HTMLDivElement, GroupedBarChartProps>(
  (
    {
      legendsProps,
      barChartData,
      chartData,
      height,
      width,
      margins,
      xAxisPaddings = 0.4,
      axisLeftValueGap,
      axisLeftTickFormatter,
      axisBottomTickFormatter,
      dataTestId = 'bar-chart-test-id',
      diagonalLineColors = {
        bgClassName: '',
        lineClassName: '',
      },
      barGradientValues = {
        offset1: '',
        offset2: '',
        stopColor1: '',
        stopColor2: '',
      },
      shadowColors = {
        floodColor: '',
        maxFloodColor: '',
      },
      barPathClassName = '',
      wrapperClassName = '',
      textClassName = '',
    },
    ref,
  ) => {
    const dataForChart = chartData || barChartData;
    const gapWithLeftAxis = 16;

    const labelRef = useRef(null);
    const [maxWidth, setMaxWidth] = useState(0);

    const keys = Object.keys(dataForChart[0] || {}).filter(
      (d) => d !== 'label',
    );

    const maxValue = Math.max(
      ...dataForChart.map((d) => Math.max(...keys.map((key) => d[key] || 0))),
    );

    const xScale = scaleBand({
      domain: dataForChart.map((d) => d.label),
      range: [margins.left, width - margins.right],
      padding: xAxisPaddings,
    });

    const yScale = scaleLinear({
      domain: [0, maxValue],
      nice: true,
      range: [height - margins.bottom, margins.top],
      round: true,
    });

    const x1Scale = scaleBand({
      domain: keys,
      range: [0, xScale.bandwidth()],
      padding: 0.1,
    });

    const colorScale = scaleOrdinal<keyof GroupedData, string>()
      .domain(keys)
      .range([]);

    const maxYLabelValue = Math.max(...yScale.domain());

    useEffect(() => {
      if (labelRef.current) {
        const widthLabel = (
          labelRef.current as SVGTextElement
        ).getBoundingClientRect().width;

        setMaxWidth(widthLabel + 15);
      }
    }, []);

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

    const calculateTextPercent = (val: number) =>
      `${Math.floor((val * 100) / maxValue)}%`;

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
              hideTicks
              hideAxisLine
              numTicks={axisLeftValueGap}
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
              <BarGroup
                data={dataForChart}
                keys={keys}
                color={colorScale}
                x0={(d) => d.label}
                x0Scale={xScale}
                x1Scale={x1Scale}
                yScale={yScale}
                height={height - margins.bottom}
              >
                {(barGroups) => {
                  const radius = 4;

                  return barGroups.map((groupbar) => (
                    <Group key={groupbar.index} left={groupbar.x0}>
                      {groupbar.bars.map((bar) => {
                        const effectiveRadius = Math.min(radius, bar.height);
                        return (
                          <Fragment
                            key={`bar-group-bar-${groupbar.index}-${bar.index}-${bar.value}-${bar.key}`}
                          >
                            <path
                              d={`
                          M ${bar.x} ${bar.y + effectiveRadius} 
                          Q ${bar.x} ${bar.y} ${bar.x + effectiveRadius} ${bar.y} 
                          H ${bar.x + bar.width - effectiveRadius} 
                          Q ${bar.width + bar.x} ${bar.y} ${bar.width + bar.x} ${bar.y + effectiveRadius} 
                          V ${bar.y + bar.height} 
                          H ${bar.x} 
                          Z
                        `}
                              className={`${barPathClassName} ${bar.value === 0 ? 'hidden' : ''}`}
                              stroke="#FBCBB0"
                              strokeWidth={`${bar.value !== maxValue ? 0.5 : 0}`}
                              fill={
                                maxValue === bar.value
                                  ? "url('#grouped-bar-gradient')"
                                  : "url('#grouped-slant-pattern')"
                              }
                              style={{
                                filter:
                                  maxValue === bar.value
                                    ? "url('#grouped-bar-max-shadow')"
                                    : "url('#grouped-bar-shadow')",
                              }}
                            />
                            <Text
                              x={bar.x + bar.width / 2 + 2}
                              y={bar.y - 6}
                              textAnchor="middle"
                              verticalAnchor="end"
                              className={`${textClassName} !label-extra-small relative z-10 fill-[rgba(0,0,0,0.6)] text-left`}
                            >
                              {calculateTextPercent(bar.value)}
                            </Text>
                          </Fragment>
                        );
                      })}
                    </Group>
                  ));
                }}
              </BarGroup>
              <defs>
                <linearGradient
                  id="grouped-bar-gradient"
                  gradientTransform="rotate(90)"
                >
                  <stop
                    offset={barGradientValues?.offset1 || '41.13%'}
                    stopColor={barGradientValues?.stopColor1 || '#FE9F69'}
                  />
                  <stop
                    offset={barGradientValues?.offset2 || '81.93%'}
                    stopColor={barGradientValues?.stopColor2 || '#F15701'}
                  />
                </linearGradient>
                <filter
                  id="grouped-bar-max-shadow"
                  filterUnits="userSpaceOnUse"
                  colorInterpolationFilters="sRGB"
                >
                  <feDropShadow
                    dx="4"
                    dy="0"
                    stdDeviation="0"
                    floodColor={shadowColors?.maxFloodColor || 'rgb(241,87,1)'}
                  />
                </filter>
                <filter
                  id="grouped-bar-shadow"
                  filterUnits="userSpaceOnUse"
                  colorInterpolationFilters="sRGB"
                >
                  <feDropShadow
                    dx="4"
                    dy="0"
                    stdDeviation="0"
                    floodColor={shadowColors?.floodColor || 'rgb(251,203,176)'}
                  />
                </filter>
                <pattern
                  id="grouped-slant-pattern"
                  patternUnits="userSpaceOnUse"
                  width="10"
                  height="10"
                >
                  <rect
                    width="10"
                    height="10"
                    fill="#FEF4EE"
                    className={`${diagonalLineColors?.bgClassName}`}
                  />
                  <path
                    d="M-2,2 l4,-4 M0,10 l10,-10 M8,12 l4,-4"
                    stroke="#FFE3D4"
                    strokeWidth="1"
                    className={`${diagonalLineColors?.lineClassName}`}
                  />
                </pattern>
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
