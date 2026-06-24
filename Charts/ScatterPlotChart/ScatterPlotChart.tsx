import { AxisBottom, AxisLeft, TickRendererProps } from '@visx/axis';
import { GridColumns, GridRows } from '@visx/grid';
import { Group } from '@visx/group';
import { scaleLinear } from '@visx/scale';
import { Circle } from '@visx/shape';
import { Text } from '@visx/text';
import { forwardRef, useEffect, useRef, useState } from 'react';

export type ScatterPlotData = {
  yValue: number;
  xValue: number;
  value: number;
};

export interface ScatterPlotChartProps {
  width: number;
  height: number;
  xLabel: string;
  yLabel: string;
  xAxisNumTicks?: number;
  yAxisNumTicks?: number;
  yAxisTickFormatter?: (value: number) => string;
  xAxisTickFormatter?: (value: string) => string;
  scatterRadius?: number;
  scatterColor?: string;
  chartData: ScatterPlotData[];
  wrapperClassName?: string;
  dataTestId?: string;
}

export const ScatterPlotChart = forwardRef<
  HTMLDivElement,
  ScatterPlotChartProps
>(
  (
    {
      chartData,
      width,
      height,
      xLabel,
      yLabel,
      yAxisTickFormatter,
      xAxisTickFormatter,
      xAxisNumTicks,
      yAxisNumTicks,
      scatterRadius = 4,
      scatterColor = '#F15701',
      wrapperClassName = '',
      dataTestId = 'scatter-plot-chart-testId',
    },
    ref,
  ) => {
    const [maxYLabelWidth, setMaxYLabelWidth] = useState(0);
    const [maxXLabelWidth, setMaxXLabelWidth] = useState(0);

    const largestYValueRef = useRef(null);
    const largestXValueRef = useRef(null);

    const margin = {
      top: 60,
      right: 10 + maxXLabelWidth,
      bottom: 60,
      left: 40 + maxYLabelWidth,
    };

    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const xMax = Math.max(...chartData.map((d) => d.xValue));
    const yMax = Math.max(...chartData.map((d) => d.yValue));
    const vMax = Math.max(...chartData.map((d) => d.value));
    const vMin = Math.min(...chartData.map((d) => d.value));

    const xScale = scaleLinear({
      domain: [0, xMax],
      range: [0, innerWidth],
      nice: true,
    });

    const yScale = scaleLinear({
      domain: [0, yMax],
      range: [innerHeight, 0],
      nice: true,
    });

    const opacityBuckets = [0.24, 0.4, 0.6, 0.72];

    const opacityScale = (val: number) => {
      const index = Math.floor(
        ((val - vMin) / (vMax - vMin + Number.EPSILON)) * opacityBuckets.length,
      );
      const clampedIndex = Math.min(
        Math.max(index, 0),
        opacityBuckets.length - 1,
      );
      return opacityBuckets[clampedIndex];
    };

    const maxYLabelValue = Math.max(...yScale.domain());
    const maxXLabelValue = Math.max(...xScale.domain());

    const yTicks = yScale.ticks();

    const renderYAxisTextComponent = ({
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
        dx="-0.5rem"
        dominantBaseline="middle"
        innerTextRef={
          (yAxisTickFormatter &&
            yAxisTickFormatter(maxYLabelValue) === formattedValue) ||
          maxYLabelValue.toString() === formattedValue?.replace(/,/g, '')
            ? largestYValueRef
            : null
        }
      >
        {formattedValue}
      </Text>
    );

    const renderXAxisTextComponent = ({
      x,
      y,
      formattedValue,
    }: TickRendererProps) => (
      <Text
        x={x}
        y={y}
        verticalAnchor="middle"
        className="!label-small fill-[rgba(0,0,0,0.4)] text-left"
        dominantBaseline="middle"
        textAnchor="start"
        innerTextRef={
          (xAxisTickFormatter &&
            xAxisTickFormatter(maxXLabelValue.toString()) === formattedValue) ||
          maxXLabelValue.toString() === formattedValue?.replace(/,/g, '')
            ? largestXValueRef
            : null
        }
        dx="-0.5rem"
      >
        {formattedValue}
      </Text>
    );

    useEffect(() => {
      if (largestXValueRef.current) {
        const maxWidth = (
          largestXValueRef.current as SVGTextElement
        ).getBoundingClientRect().width;

        setMaxXLabelWidth(maxWidth);
      }
    }, [largestXValueRef]);

    useEffect(() => {
      if (largestYValueRef.current) {
        const maxWidth = (
          largestYValueRef.current as SVGTextElement
        ).getBoundingClientRect().width;

        setMaxYLabelWidth(maxWidth);
      }
    }, [largestYValueRef]);

    return (
      <div className={wrapperClassName} data-testid={dataTestId} ref={ref}>
        <svg width={width} height={height}>
          <Group left={margin.left} top={margin.top}>
            {/* x axis */}
            <AxisBottom
              top={innerHeight}
              scale={xScale}
              label={xLabel}
              hideTicks
              numTicks={xAxisNumTicks}
              labelClassName="label-small fill-text-text font-medium"
              hideZero
              strokeWidth={0.5}
              axisLineClassName="stroke-border-border"
              labelOffset={24}
              tickFormat={
                xAxisTickFormatter
                  ? (value) => xAxisTickFormatter(String(value))
                  : undefined
              }
              tickComponent={renderXAxisTextComponent}
            />
            {/* y axis */}
            <AxisLeft
              hideTicks
              scale={yScale}
              strokeDasharray="4 4"
              numTicks={yAxisNumTicks}
              axisLineClassName="stroke-border-border"
              tickFormat={
                yAxisTickFormatter
                  ? (value) => yAxisTickFormatter(Number(value))
                  : undefined
              }
              tickComponent={renderYAxisTextComponent}
            />

            {/* Custom vertical y-axis label */}
            {maxYLabelWidth !== 0 && (
              <text
                x={-innerHeight / 2}
                y={-margin.left + 10}
                transform="rotate(-90)"
                textAnchor="middle"
                className="!label-small fill-text-text font-medium"
              >
                {yLabel}
              </text>
            )}
            {/* x axis grids */}
            <GridRows
              scale={yScale}
              width={innerWidth}
              numTicks={yAxisNumTicks}
              stroke="#e0e0e0"
              strokeDasharray="4 4"
              tickValues={yTicks.filter((tick) => yScale(tick) !== yScale(0))}
            />
            {/* y axis grids */}
            <GridColumns
              scale={xScale}
              height={innerHeight}
              numTicks={xAxisNumTicks}
              className="stroke-border-border-light"
              // stroke="#e0e0e0"
              strokeDasharray="4 4"
            />
            {/* scatter plot */}
            {chartData.map((d) => (
              // eslint-disable-next-line react/jsx-key
              <Circle
                cx={xScale(d.xValue)}
                cy={yScale(d.yValue)}
                r={scatterRadius}
                fill={scatterColor}
                opacity={opacityScale(d.value)}
              />
            ))}
          </Group>
        </svg>
      </div>
    );
  },
);
