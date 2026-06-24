import React, {
  forwardRef,
  Fragment,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';
import { AxisBottom, AxisLeft, TickRendererProps } from '@visx/axis';
import { scaleBand, scaleLinear } from '@visx/scale';
import { GridRows } from '@visx/grid';
import { Bar } from '@visx/shape';
import { Group } from '@visx/group';
import { useTooltip, useTooltipInPortal } from '@visx/tooltip';
import { Text } from '@visx/text';

import TooltipDownArrow from './ToolTipDownArrow';
import { Legends, LegendsProps, useLinearLegend } from '../Legends';
import { BarSkeletonProps, ChartSkeleton } from '../ChartsSkeletonLoader';
import { HorizontalGridLine } from '../common/HorizontalGridLine';
import { useDevicePixelRatio } from '../../hooks/useDevicePixelRatio';
import { useAllZeroEffect } from '../NoDataSkeleton/hook/useAllZeroEffect';
import { BarChartNoDataSkeleton } from '../NoDataSkeleton/BarChartNoDataSkeleton';
import { DataNotAvailableProps } from '../NoDataSkeleton/DataNotAvailable';

interface BarChartColors {
  bgColor?: string;
  diagonalPatternColor?: string;
  strokeColor?: string;
  shadowColor?: string;
}

export interface BarChartData {
  label: string;
  value: number;
  colors?: BarChartColors;
  isPrediction?: boolean;
}

type TooltipData = {
  currentElementSize: number;
  currentToolTip: BarChartData;
};

export interface BarChartMargins {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface ToolTipContent {
  className?: string;
  CustomComponent: React.FC<{ currentToolTip: BarChartData }>;
  arrowClassName?: string;
}

export interface DiagonalLineColors {
  bgClassName: string;
  lineClassName: string;
}

export interface BarGradientValues {
  stopColor1?: string;
  stopColor2?: string;
  offset1?: string;
  offset2?: string;
}

export interface ShadowColors {
  maxFloodColor?: string;
  floodColor?: string;
}

export interface BarChartProps {
  height: number;
  width: number;
  barChartData: BarChartData[];
  chartData?: BarChartData[];
  legendsProps?: LegendsProps;
  margins: BarChartMargins;
  xAxisPaddings?: number;
  axisLeftValueGap?: number;
  axisLeftTickFormatter?: (value: number) => string;
  axisBottomTickFormatter?: (value: string) => string;
  toolTipContent?: ToolTipContent;
  dataTestId?: string;
  maxBarWidth?: number;
  diagonalLineColors?: DiagonalLineColors;
  barGradientValues?: BarGradientValues;
  shadowColors?: ShadowColors;
  barPathClassName?: string;
  wrapperClassName?: string;
  xLabel?: string;
  yLabel?: string;
  highlightMaxBar?: boolean;
  gapWithLeftAxis?: number;
  includeLeftMarginInWidth?: boolean;
  isLoading?: boolean;
  skeletonProps?: Omit<
    BarSkeletonProps,
    'height' | 'width' | 'margins' | 'animate' | 'type'
  >;
  noDataSkeletonProps?: DataNotAvailableProps;
  customYAxisTicks?: number[];
  usePreciseTickCalculation?: boolean;
  enableHorizontalScroll?: boolean;
  minBarWidth?: number;
  gapWithBottomAxis?: number;
}

export const BarChart = forwardRef<HTMLDivElement, BarChartProps>(
  (
    {
      legendsProps,
      barChartData,
      chartData,
      height,
      width,
      margins,
      xAxisPaddings = 0.4,
      axisLeftTickFormatter,
      axisBottomTickFormatter,
      axisLeftValueGap,
      toolTipContent,
      dataTestId = 'bar-chart-test-id',
      diagonalLineColors = {
        bgClassName: '',
        lineClassName: '',
      },
      maxBarWidth,
      customYAxisTicks,
      barGradientValues,
      shadowColors,
      barPathClassName = '',
      wrapperClassName = '',
      xLabel,
      yLabel,
      highlightMaxBar = true,
      gapWithLeftAxis = 16,
      includeLeftMarginInWidth = false,
      isLoading,
      skeletonProps = {},
      noDataSkeletonProps = {},
      usePreciseTickCalculation = false,
      enableHorizontalScroll = false,
      gapWithBottomAxis,
      minBarWidth,
    },
    ref,
  ) => {
    const dataForChart = chartData || barChartData;
    const devicePixelRatio = useDevicePixelRatio();

    const { tooltipData, tooltipLeft, tooltipTop, showTooltip, hideTooltip } =
      useTooltip<TooltipData>();

    const { containerRef, TooltipInPortal, forceRefreshBounds } =
      useTooltipInPortal({
        scroll: true,
      });

    const uniqueId = useId();

    const MAX_BAR_WIDTH = 88;
    const legendData =
      legendsProps?.legendType === 'linear' ? legendsProps.legendData : [];
    const xAxisLabels =
      legendsProps?.legendType === 'linear'
        ? dataForChart.map((d) => d.label)
        : [];

    const { selectedChartLabels, handleLegendSelection } = useLinearLegend(
      legendData,
      xAxisLabels,
    );
    const filteredBarChartData =
      legendsProps?.legendType === 'linear'
        ? dataForChart.filter((data) =>
            selectedChartLabels.includes(data.label),
          )
        : dataForChart;

    const [tickMaxWidth, setTickMaxWidth] = useState(0);
    const tickWidthsRef = useRef<Record<string, number>>({});
    const getTickRef =
      (formattedValue: string) => (node: SVGTextElement | null) => {
        if (!node) return;
        const labelWidth = node.getBoundingClientRect().width;
        const key = String(formattedValue);
        if (tickWidthsRef.current[key] !== labelWidth) {
          tickWidthsRef.current[key] = labelWidth;
          const nextMax = Math.max(...Object.values(tickWidthsRef.current));
          setTickMaxWidth((prev) => {
            const proposed = nextMax + 15;
            return Math.abs(prev - proposed) > 0.5 ? proposed : prev;
          });
        }
      };

    const isXLabelGap = xLabel ? 16 : 0;
    const tickLabelsBottomGap = 30;
    const reservedBottomSpace = tickLabelsBottomGap + (xLabel ? 24 : 0);

    const maxValue = Math.max(...filteredBarChartData.map((d) => d.value));
    const minValue =
      customYAxisTicks && customYAxisTicks.length > 0
        ? Math.min(...customYAxisTicks)
        : 0;
    // TOD: Remove the calculation when major relase (For Backward Compatibility)
    const calculatedAxisBottomGap = useMemo(() => {
      if (gapWithBottomAxis) return gapWithBottomAxis;
      if (margins.bottom < 40) return margins.bottom + (40 - margins.bottom);
      return 0;
    }, [margins.bottom, gapWithBottomAxis]);

    const nonIncludeLeftMargin = enableHorizontalScroll
      ? tickMaxWidth + gapWithLeftAxis
      : margins.left + isXLabelGap;

    const rangeLeft = includeLeftMarginInWidth
      ? margins.left + tickMaxWidth + gapWithLeftAxis
      : nonIncludeLeftMargin;

    // According to min bar width the scroll will appear
    const MIN_BAR_WIDTH = minBarWidth ?? 32;
    const plotViewportWidth = Math.max(0, width - rangeLeft);
    const plotInnerRange = Math.max(
      0,
      plotViewportWidth - margins.right - isXLabelGap,
    );

    const provisionalScale = scaleBand({
      domain: dataForChart.map((d) => d.label),
      range: [0, plotInnerRange],
      round: true,
      padding: xAxisPaddings,
      paddingOuter: includeLeftMarginInWidth ? 0 : undefined,
    });

    const estimatedBandwidth = provisionalScale.bandwidth();
    let svgPlotWidth = plotViewportWidth;
    if (
      enableHorizontalScroll &&
      dataForChart.length > 0 &&
      estimatedBandwidth > 0 &&
      estimatedBandwidth < MIN_BAR_WIDTH
    ) {
      const ratio = MIN_BAR_WIDTH / estimatedBandwidth;
      const requiredInnerRange = plotInnerRange * ratio;
      svgPlotWidth = requiredInnerRange + margins.right + isXLabelGap;
    }

    const xScale = scaleBand({
      domain: filteredBarChartData.map((d) => d.label),
      range: enableHorizontalScroll
        ? [0, Math.max(0, svgPlotWidth - margins.right - isXLabelGap)]
        : [rangeLeft, width - margins.right - isXLabelGap],
      round: true,
      padding: xAxisPaddings,
      paddingOuter: includeLeftMarginInWidth ? 0 : undefined,
    });

    const yScale = useMemo(() => {
      const minimumValue = minValue;
      let maximumValue = 0;
      if (customYAxisTicks && customYAxisTicks.length > 0) {
        maximumValue = Math.max(...customYAxisTicks);
      } else {
        maximumValue = maxValue;
      }
      return scaleLinear({
        domain: [minimumValue, maximumValue],
        range: enableHorizontalScroll
          ? [
              height - margins.bottom - isXLabelGap - calculatedAxisBottomGap,
              margins.top,
            ]
          : [height - margins.bottom - reservedBottomSpace, margins.top],
        nice: true,
        round: true,
      });
    }, [
      customYAxisTicks,
      enableHorizontalScroll,
      height,
      margins,
      isXLabelGap,
      maxValue,
      calculatedAxisBottomGap,
      reservedBottomSpace,
      minValue,
    ]);

    const yTickValues = useMemo(() => {
      if (customYAxisTicks && customYAxisTicks.length > 0) {
        return customYAxisTicks;
      }
      if (!usePreciseTickCalculation) return undefined;
      return yScale.ticks(axisLeftValueGap);
    }, [yScale, axisLeftValueGap, usePreciseTickCalculation, customYAxisTicks]);

    useEffect(() => {
      const handleScroll = () => {
        hideTooltip();
      };

      document.addEventListener('scroll', handleScroll, true);

      return () => {
        document.removeEventListener('scroll', handleScroll, true);
      };
    }, [hideTooltip]);

    useEffect(() => {
      tickWidthsRef.current = {};
      setTickMaxWidth(0);
    }, [yTickValues, axisLeftTickFormatter]);

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
        innerTextRef={getTickRef(String(formattedValue))}
      >
        {formattedValue}
      </Text>
    );
    const allZero = useAllZeroEffect<BarChartData>({
      chartData: filteredBarChartData,
      valueKey: 'value',
    });

    if (isLoading) {
      return (
        <ChartSkeleton
          height={height}
          width={width}
          margins={margins}
          animate
          type="bar"
          {...skeletonProps}
        />
      );
    }

    if (allZero || filteredBarChartData.length === 0) {
      return (
        <BarChartNoDataSkeleton
          width={width}
          height={height}
          margins={margins}
          {...noDataSkeletonProps}
        />
      );
    }

    const toSafeId = (value?: string) =>
      (value || '').replace(/[^a-zA-Z0-9_-]/g, ''); // removes '#', '(', ')', ',', spaces, etc.

    const horizontalGridLinePattern = (
      <defs>
        <pattern
          id="horizontal-grid-dash-pattern"
          patternUnits="userSpaceOnUse"
          width="8"
          height="1"
        >
          <rect
            x="0"
            y="0"
            width="4"
            height="1"
            fill="rgba(208, 211, 216, 1)"
          />
        </pattern>
      </defs>
    );

    const groupContainsBarAndAxisBottom = (
      <>
        <Group
          width={enableHorizontalScroll ? svgPlotWidth : width}
          className="relative z-10"
        >
          {filteredBarChartData.map((d, index) => {
            const bandWidth = xScale.bandwidth();
            const barWidth = Math.min(
              bandWidth,
              maxBarWidth ?? bandWidth,
              MAX_BAR_WIDTH,
            );
            const x = (xScale(d.label) ?? 0) + (bandWidth - barWidth) / 2;
            const y = yScale(Math.max(d.value, 0));
            const radius = 8;

            let fillColor =
              d.colors?.bgColor || `url(#slantPattern-${uniqueId})`;

            if (d.isPrediction) {
              fillColor = `url(#slantPattern-dottedStroke-${toSafeId(d.colors?.bgColor ?? '#FEF4EE')}-${toSafeId(d.colors?.diagonalPatternColor ?? '#FFE3D4')}-${index}-${uniqueId})`;
            } else if (d.colors?.diagonalPatternColor) {
              fillColor = `url(#slantPattern-${toSafeId(d.colors?.bgColor)}-${toSafeId(d.colors?.diagonalPatternColor)}-${index}-${uniqueId})`;
            } else if (
              maxValue === d.value &&
              !d.colors?.bgColor &&
              highlightMaxBar
            ) {
              fillColor = `url(#barGradient-${uniqueId})`;
            }

            let filterShadow = `url(#shadow1-${uniqueId})`;

            if (d.isPrediction) {
              filterShadow = '';
            } else if (d.colors?.shadowColor) {
              filterShadow = `url(#shadow-dynamic-${toSafeId(d.colors?.shadowColor)}-${index}-${uniqueId})`;
            } else if (maxValue === d.value && highlightMaxBar) {
              filterShadow = `url(#shadow2-${uniqueId})`;
            }

            const strokeWidth =
              d.isPrediction ||
              maxValue !== d.value ||
              (maxValue === d.value && !highlightMaxBar)
                ? 0.5
                : 0;

            const baselineY = yScale(minValue);
            const barHeight = Math.abs(yScale(d.value) - yScale(minValue));

            const effectiveRadius = Math.min(radius, barHeight);
            return (
              <Fragment key={d.label}>
                <path
                  d={`
                        M ${x} ${y + effectiveRadius} 
                        Q ${x} ${y} ${x + effectiveRadius} ${y} 
                        H ${x + barWidth - effectiveRadius} 
                        Q ${barWidth + x} ${y} ${barWidth + x} ${y + effectiveRadius} 
                        V ${baselineY} 
                        H ${x} 
                        Z
                      `}
                  className={`${barPathClassName} ${d.value === 0 ? 'hidden' : ''}`}
                  stroke={d.colors?.strokeColor || '#FBCBB0'}
                  strokeWidth={strokeWidth}
                  strokeDasharray={d.isPrediction ? '1,1' : undefined}
                  fill={fillColor}
                  style={{
                    filter: filterShadow,
                  }}
                />
                <Bar
                  y={margins.top}
                  x={x}
                  fill="transparent"
                  width={barWidth}
                  height={height - margins.top - reservedBottomSpace}
                  onMouseEnter={
                    toolTipContent
                      ? () => {
                          showTooltip({
                            tooltipData: {
                              currentElementSize: yScale(Math.max(d.value, 0)),
                              currentToolTip: d,
                            },
                            tooltipTop: 0,
                            tooltipLeft: x + barWidth / 2,
                          });
                        }
                      : undefined
                  }
                  onMouseLeave={toolTipContent ? hideTooltip : undefined}
                />
                <defs>
                  <pattern
                    id={`slantPattern-${toSafeId(d.colors?.bgColor ?? '#FEF4EE')}-${toSafeId(d.colors?.diagonalPatternColor ?? '#FFE3D4')}-${index}-${uniqueId}`}
                    patternUnits="userSpaceOnUse"
                    width="10"
                    height="10"
                  >
                    <rect
                      width="10"
                      height="10"
                      fill={d.colors?.bgColor || '#FEF4EE'}
                    />
                    <path
                      d="M-2,2 l4,-4 M0,10 l10,-10 M8,12 l4,-4"
                      stroke={d.colors?.diagonalPatternColor || '#FFE3D4'}
                      strokeWidth="1"
                    />
                  </pattern>
                  <filter
                    id={`shadow-dynamic-${toSafeId(d.colors?.shadowColor)}-${index}-${uniqueId}`}
                    filterUnits="userSpaceOnUse"
                    colorInterpolationFilters="sRGB"
                  >
                    <feDropShadow
                      dx="4"
                      dy="0"
                      stdDeviation="0"
                      floodColor={d.colors?.shadowColor}
                    />
                  </filter>
                </defs>

                <defs>
                  <pattern
                    id={`slantPattern-dottedStroke-${toSafeId(d.colors?.bgColor ?? '#FEF4EE')}-${toSafeId(d.colors?.diagonalPatternColor ?? '#FFE3D4')}-${index}-${uniqueId}`}
                    patternUnits="userSpaceOnUse"
                    width="10"
                    height="10"
                  >
                    <rect width="10" height="10" fill="#FFFFFF" />
                    <path
                      d="M-2,2 l4,-4 M0,10 l10,-10 M8,12 l4,-4"
                      stroke={d.colors?.diagonalPatternColor || '#FFE3D4'}
                      strokeWidth="1"
                      strokeDasharray="1,1"
                    />
                  </pattern>
                  <filter
                    id={`shadow-dynamic-${toSafeId(d.colors?.shadowColor)}-${index}-${uniqueId}`}
                    filterUnits="userSpaceOnUse"
                    colorInterpolationFilters="sRGB"
                  >
                    <feDropShadow
                      dx="4"
                      dy="0"
                      stdDeviation="0"
                      floodColor={d.colors?.shadowColor}
                    />
                  </filter>
                </defs>
              </Fragment>
            );
          })}
          <defs>
            <linearGradient
              id={`barGradient-${uniqueId}`}
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
              id={`shadow2-${uniqueId}`}
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
              id={`shadow1-${uniqueId}`}
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
              id={`slantPattern-${uniqueId}`}
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
          top={
            enableHorizontalScroll
              ? height - margins.bottom - isXLabelGap - calculatedAxisBottomGap
              : height - margins.bottom - reservedBottomSpace
          }
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
          label={xLabel}
          tickValues={filteredBarChartData.map((d) => d.label)}
          labelProps={{
            className: 'label-small fill-text-text',
            textAnchor: 'middle',
            dy: '1rem',
          }}
        />
      </>
    );

    const nonHorizontalScrollWidth = includeLeftMarginInWidth
      ? width -
        (margins.left + tickMaxWidth + gapWithLeftAxis) -
        margins.right +
        2
      : width - margins.left + margins.right;

    const nonHorizontalScrollLeft = includeLeftMarginInWidth
      ? margins.left + gapWithLeftAxis + tickMaxWidth + 2
      : gapWithLeftAxis + tickMaxWidth;

    const gridRowsContent = (
      <GridRows
        scale={yScale}
        width={
          enableHorizontalScroll
            ? Math.max(0, xScale.range()[1])
            : nonHorizontalScrollWidth
        }
        height={height - margins.top - reservedBottomSpace}
        tickValues={yTickValues}
        numTicks={usePreciseTickCalculation ? undefined : axisLeftValueGap}
        left={enableHorizontalScroll ? 0 : nonHorizontalScrollLeft}
      >
        {({ lines }) => (
          <>
            {lines.map((line, index) => {
              const fromY = line?.from?.y ?? 0;
              const gridWidth = enableHorizontalScroll
                ? Math.max(0, xScale.range()[1])
                : nonHorizontalScrollWidth;
              return (
                <HorizontalGridLine
                  key={`grid-line-${fromY ?? index}`}
                  yValue={fromY ?? 0}
                  index={index}
                  devicePixelRatio={devicePixelRatio}
                  width={gridWidth}
                  dashPatternId="horizontal-grid-dash-pattern"
                />
              );
            })}
          </>
        )}
      </GridRows>
    );

    const axisLeftContent = (
      <AxisLeft
        scale={yScale}
        left={
          includeLeftMarginInWidth
            ? margins.left + tickMaxWidth
            : tickMaxWidth + isXLabelGap
        }
        numTicks={usePreciseTickCalculation ? undefined : axisLeftValueGap}
        tickValues={yTickValues}
        hideTicks
        hideAxisLine
        tickLabelProps={() => ({
          className: '!label-small fill-[rgba(0,0,0,0.4)] text-left',
          dx: '2rem',
          textAnchor: 'end',
          dominantBaseline: 'middle',
        })}
        tickFormat={
          axisLeftTickFormatter
            ? (value) => axisLeftTickFormatter(value as number)
            : undefined
        }
        tickComponent={renderTextComponent}
        label={yLabel}
        labelProps={{
          className: 'label-small fill-text-text',
          textAnchor: 'middle',
          dx: '0rem',
        }}
      />
    );

    return (
      <div
        className={`${wrapperClassName} relative flex items-end gap-10 ${legendsProps?.legendType === 'linear' ? 'flex-col gap-4' : ''}`}
        data-testid={dataTestId}
        ref={ref}
      >
        {enableHorizontalScroll ? (
          <div className="flex" style={{ width }}>
            <svg
              width={rangeLeft}
              height={height}
              className="pointer-events-none"
            >
              <Group>{axisLeftContent}</Group>
            </svg>
            {/* Scrollable Plot Area */}
            <div
              className="overflow-x-auto"
              style={{ width: plotViewportWidth }}
            >
              <svg
                width={svgPlotWidth}
                height={height}
                ref={containerRef}
                style={{ maxWidth: 'none' }}
                onMouseEnter={forceRefreshBounds}
              >
                {horizontalGridLinePattern}
                <Group>
                  {' '}
                  {gridRowsContent} {groupContainsBarAndAxisBottom}{' '}
                </Group>
              </svg>
            </div>
          </div>
        ) : (
          <svg
            width={width}
            height={height}
            ref={containerRef}
            onMouseEnter={forceRefreshBounds}
          >
            {horizontalGridLinePattern}
            <Group>
              {gridRowsContent}
              {axisLeftContent}
              {groupContainsBarAndAxisBottom}
            </Group>
          </svg>
        )}
        {tooltipData && toolTipContent ? (
          <>
            <TooltipInPortal
              left={tooltipLeft}
              top={tooltipTop}
              detectBounds={false}
              className=" absolute !bg-transparent !shadow-none"
              style={{
                transform: 'translate(-10px,12px)',
                pointerEvents: 'none',
              }}
            >
              <div
                style={{
                  height:
                    tooltipData.currentElementSize - 25 < 0
                      ? 0
                      : tooltipData.currentElementSize - 25,
                  borderColor: tooltipData?.currentToolTip?.colors?.strokeColor,
                }}
                className={`${!tooltipData?.currentToolTip?.colors?.strokeColor ? 'border-border-action-focused' : ''}  top-full border-l border-solid`}
              />
            </TooltipInPortal>

            <TooltipInPortal
              left={tooltipLeft}
              top={tooltipTop}
              detectBounds={false}
              className=" absolute w-fit !bg-transparent !shadow-none"
              style={{
                transform: 'translate(calc(-50% - 10px), -94%)',
              }}
            >
              <div
                className={`${toolTipContent?.className} bg-fill-fill border-fill-action relative rounded-xl  border border-solid px-6 py-3 !shadow-[0px_4px_4px_0px_rgba(0,0,0,0.08)]`}
                style={{
                  borderColor: tooltipData?.currentToolTip.colors?.bgColor,
                }}
              >
                {toolTipContent?.CustomComponent({
                  currentToolTip: tooltipData.currentToolTip,
                })}
                <TooltipDownArrow
                  className={`${toolTipContent?.arrowClassName} absolute left-1/2 top-full -translate-x-1/2`}
                  fillPathStyle={tooltipData?.currentToolTip?.colors?.bgColor}
                />
              </div>
            </TooltipInPortal>
          </>
        ) : (
          ''
        )}
        {legendsProps && legendsProps.legendType !== 'linear' && (
          <Legends {...legendsProps} />
        )}

        {legendsProps?.legendType === 'linear' && (
          <Legends {...legendsProps} onLegendChange={handleLegendSelection} />
        )}
      </div>
    );
  },
);
