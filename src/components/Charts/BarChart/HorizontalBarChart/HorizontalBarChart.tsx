import { forwardRef, Fragment, useEffect, useMemo, useState } from 'react';
import { AxisBottom, AxisLeft, TickRendererProps } from '@visx/axis';
import { scaleBand, scaleLinear } from '@visx/scale';
import { GridColumns } from '@visx/grid';
import { Group } from '@visx/group';
import { Text } from '@visx/text';

import { Legends, LegendsProps, useLinearLegend } from '../../Legends';
import {
  calculateMaxLabelWidth,
  getColor,
  getParentPassedOpacityValues,
} from './helper';
import BarLabel from './BarLabel';
import {
  ColorsSupported,
  HorizontalBarChartData,
  HorizontalBarChartMargins,
  HorizontalBarGradientValues,
  HorizontalChartShadowColors,
  HorizontalDiagonalLineColors,
} from './types';
import {
  ChartSkeleton,
  HorizontalBarSkeletonProps,
} from '../../ChartsSkeletonLoader';
import { VerticalGridLine } from '../../common/VerticalGridLine';
import { useDevicePixelRatio } from '../../../hooks/useDevicePixelRatio';
import { useAllZeroEffect } from '../../NoDataSkeleton/hook/useAllZeroEffect';
import { HorizontalBarChartNoDataSkeleton } from '../../NoDataSkeleton/HorizontalBarChartNoDataSkeleton';
import { DataNotAvailableProps } from '../../NoDataSkeleton/DataNotAvailable';

type BaseHorizontalBarChartProps = {
  height: number;
  width: number;
  barChartData: HorizontalBarChartData[];
  chartData?: HorizontalBarChartData[];
  legendsProps?: LegendsProps;
  margins: HorizontalBarChartMargins;
  xAxisPaddings?: number;
  axisBottomValueGap?: number;
  xAxisLabel?: string;
  yAxisLabel?: string;
  xAxisLabelClassName?: string;
  customXAxisTicks?: number[];
  yAxisLabelClassName?: string;
  axisLeftTickFormatter?: (value: string) => string;
  axisBottomTickFormatter?: (value: number) => string;
  dataTestId?: string;
  barGradientValues?: HorizontalBarGradientValues;
  globalBarBgColor?: ColorsSupported;
  highlightMaxBar?: boolean;
  barFillClassName?: string;
  shadowColors?: HorizontalChartShadowColors;
  barPathClassName?: string;
  wrapperClassName?: string;
  maxLabelWidth?: number;
  isLoading?: boolean;
  skeletonProps?: Omit<
    HorizontalBarSkeletonProps,
    'height' | 'width' | 'margins' | 'animate' | 'type'
  >;
  noDataSkeletonProps?: DataNotAvailableProps;
};

export type HorizontalBarChartProps = BaseHorizontalBarChartProps &
  (
    | {
        showDiagonalLines?: true;
        diagonalLineColor?: ColorsSupported;
        diagonalLineClassName?: string;
        diagonalLineColors?: HorizontalDiagonalLineColors;
      }
    | {
        showDiagonalLines?: false;
        diagonalLineColor?: never;
        diagonalLineClassName?: never;
        diagonalLineColors?: never;
      }
  );

export const HorizontalBarChart = forwardRef<
  HTMLDivElement,
  HorizontalBarChartProps
>(
  (
    {
      legendsProps,
      barChartData,
      chartData,
      height,
      width,
      margins,
      xAxisPaddings = 0.4,
      axisBottomValueGap,
      axisLeftTickFormatter,
      axisBottomTickFormatter,
      dataTestId = 'horizontal-bar-chart-test-id',
      showDiagonalLines = true,
      highlightMaxBar = true,
      globalBarBgColor = '#FF6914',
      diagonalLineColor = '#FF6914',
      diagonalLineClassName,
      xAxisLabel,
      yAxisLabel,
      customXAxisTicks,
      xAxisLabelClassName,
      yAxisLabelClassName,
      barFillClassName,
      barGradientValues,
      shadowColors,
      barPathClassName = '',
      wrapperClassName = '',
      maxLabelWidth = 120,
      isLoading = false,
      diagonalLineColors = {
        bgClassName: '',
        lineClassName: '',
      },
      skeletonProps = {},
      noDataSkeletonProps = {},
    },
    ref,
  ) => {
    const dataForChart = chartData || barChartData;
    const devicePixelRatio = useDevicePixelRatio();

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

    const [maxWidthOfAxisLeft, setMaxWidthOfAxisLeft] = useState(0);

    const maxValue = useMemo(
      () => Math.max(...filteredBarChartData.map((d) => d.value)),
      [filteredBarChartData],
    );

    const minValue = useMemo(() => {
      if (!customXAxisTicks || customXAxisTicks.length === 0) {
        return 0;
      }
      return Math.min(...customXAxisTicks);
    }, [customXAxisTicks]);

    const dynamicLeftMargin = useMemo(() => {
      const baseMargin = yAxisLabel ? margins.left + 20 : margins.left;
      const labelWidth = Math.min(maxWidthOfAxisLeft, maxLabelWidth);
      return Math.max(
        baseMargin,
        labelWidth === 10 ? labelWidth : labelWidth + 20,
      );
    }, [margins.left, yAxisLabel, maxWidthOfAxisLeft, maxLabelWidth]);

    const axisLabelFontSize = 16;
    const extraBottomPadding = 10;

    const effectiveMargins = useMemo(
      () => ({
        top: margins.top,
        bottom: margins.bottom + axisLabelFontSize + extraBottomPadding,
        left: dynamicLeftMargin,
        right: margins.right,
      }),
      [margins, dynamicLeftMargin],
    );

    const yScale = useMemo(
      () =>
        scaleBand({
          domain: filteredBarChartData.map((d) => d.label),
          range: [height - effectiveMargins.bottom, effectiveMargins.top],
          round: true,
          paddingInner: xAxisPaddings,
          paddingOuter: 0.1,
          align: 0.4,
        }),
      [
        filteredBarChartData,
        height,
        effectiveMargins.bottom,
        effectiveMargins.top,
        xAxisPaddings,
      ],
    );

    const xScale = useMemo(() => {
      let maximumValue = maxValue;
      const minimumValue = minValue;

      if (customXAxisTicks && customXAxisTicks.length > 0) {
        maximumValue = Math.max(...customXAxisTicks);

        return scaleLinear({
          domain: [minimumValue, maximumValue],
          range: [effectiveMargins.left, width - effectiveMargins.right - 40],
          nice: true,
          round: true,
        });
      }

      return scaleLinear({
        domain: [minimumValue, maximumValue],
        range: [effectiveMargins.left, width - effectiveMargins.right - 40],
        nice: true,
        round: true,
      });
    }, [
      maxValue,
      effectiveMargins.left,
      effectiveMargins.right,
      width,
      minValue,
      customXAxisTicks,
    ]);

    const getTickValues = () => {
      if (customXAxisTicks && customXAxisTicks.length > 0) {
        return customXAxisTicks;
      }
      return xScale.ticks(axisBottomValueGap);
    };

    useEffect(() => {
      setMaxWidthOfAxisLeft(
        calculateMaxLabelWidth(filteredBarChartData.map((d) => d.label.trim())),
      );
    }, [filteredBarChartData]);

    const renderWrappedTextComponent = ({
      x,
      y,
      formattedValue,
    }: TickRendererProps) => (
      <Text
        x={x}
        y={y}
        width={maxLabelWidth}
        verticalAnchor="middle"
        textAnchor="end"
        className="!label-small fill-[rgba(0,0,0,0.4)]"
        capHeight={10}
        lineHeight={1.1}
      >
        {formattedValue}
      </Text>
    );

    const allZero = useAllZeroEffect<HorizontalBarChartData>({
      chartData: dataForChart,
      valueKey: 'value',
    });

    if (isLoading) {
      return (
        <ChartSkeleton
          height={height}
          width={width}
          margins={margins}
          animate
          type="horizontalBar"
          {...skeletonProps}
        />
      );
    }

    if (allZero || dataForChart.length === 0) {
      return (
        <HorizontalBarChartNoDataSkeleton
          height={height}
          margins={margins}
          width={width}
          showXAxisLabel={!!xAxisLabel}
          showYAxisLabel={!!yAxisLabel}
          {...noDataSkeletonProps}
        />
      );
    }

    const verticalGridLinePattern = (
      <defs>
        <pattern
          id="vertical-grid-dash-pattern"
          patternUnits="userSpaceOnUse"
          width="1"
          height="8"
        >
          <rect x="0" y="0" width="1" height="4" fill="#00000029" />
        </pattern>
      </defs>
    );

    return (
      <div
        className={`${wrapperClassName} relative flex items-end gap-10 ${legendsProps?.legendType === 'linear' ? 'flex-col items-center gap-4' : ''}`}
        data-testid={dataTestId}
        ref={ref}
      >
        <svg width={width} height={height}>
          {verticalGridLinePattern}
          <Group>
            <GridColumns
              scale={xScale}
              width={width - effectiveMargins.left + effectiveMargins.right}
              height={height - effectiveMargins.bottom}
              numTicks={axisBottomValueGap}
              tickValues={getTickValues()}
            >
              {({ lines }) => (
                <>
                  {lines.map((line, index) => {
                    const fromX = line?.from?.x ?? 0;
                    return (
                      <VerticalGridLine
                        key={`grid-line-${fromX ?? index}`}
                        xValue={fromX ?? 0}
                        index={index}
                        devicePixelRatio={devicePixelRatio}
                        height={height}
                        dashPatternId="vertical-grid-dash-pattern"
                        solidFillColor="#0000001F"
                        heightAdjustment={{
                          effectiveMargins,
                          offset: 20,
                        }}
                      />
                    );
                  })}
                </>
              )}
            </GridColumns>
            <AxisLeft
              scale={yScale}
              left={effectiveMargins.left - 10}
              label={yAxisLabel}
              labelClassName={`${yAxisLabelClassName} label-small fill-text-text font-medium`}
              hideTicks
              hideAxisLine
              tickLabelProps={() => ({
                className: '!label-small fill-[rgba(0,0,0,0.4)]',
                textAnchor: 'end',
              })}
              tickFormat={
                axisLeftTickFormatter
                  ? (value) => axisLeftTickFormatter(value)
                  : undefined
              }
              tickComponent={renderWrappedTextComponent}
            />
            <Group width={width} className="relative z-10">
              {filteredBarChartData.map((d, i) => {
                const x = effectiveMargins.left;
                const y = yScale(d.label) ?? 0;
                const barHeight = yScale.bandwidth();
                const baseRadius = 8;
                const radius = Math.min(baseRadius, barHeight / 2);

                const baselineX = xScale(minValue);
                const barWidth = Math.abs(xScale(d.value) - baselineX);

                const effectiveRadius = Math.min(radius, barWidth);

                return (
                  <Fragment key={d.label}>
                    <path
                      key={d.label}
                      d={`M ${x + 0.5},${y} 
                      h${barWidth - effectiveRadius} 
                      a${effectiveRadius},${effectiveRadius} 0 0 1 ${effectiveRadius},${effectiveRadius} 
                      v${barHeight - 2 * effectiveRadius} 
                      a${effectiveRadius},${effectiveRadius} 0 0 1 -${effectiveRadius},${effectiveRadius} 
                      h-${barWidth - effectiveRadius} 
                      z`}
                      className={`${barPathClassName} ${d.value === 0 ? 'hidden' : ''}`}
                      stroke={
                        d.color
                          ? getColor(
                              'stroke',
                              d.color ?? globalBarBgColor,
                              getParentPassedOpacityValues(d),
                            )
                          : '#FBCBB0'
                      }
                      strokeWidth={`${
                        d.value !== maxValue ||
                        (maxValue === d.value && !highlightMaxBar)
                          ? 0.5
                          : 0
                      }`}
                      fill={
                        highlightMaxBar && maxValue === d.value
                          ? "url('#horizontal-bar-gradient-max')"
                          : `url('#horizontal-slant-pattern-${i}-${d.color ?? globalBarBgColor}')`
                      }
                      style={{
                        filter:
                          highlightMaxBar && maxValue === d.value
                            ? "url('#horizontal-shadow-max')"
                            : `url('#horizontal-shadow-${i}-${d.color ?? globalBarBgColor}')`,
                      }}
                    />
                    <BarLabel
                      x={x}
                      y={y}
                      barWidth={barWidth}
                      barHeight={barHeight}
                      insideLabel={d.insideLabel}
                      value={d.value}
                      axisBottomTickFormatter={axisBottomTickFormatter}
                    />
                  </Fragment>
                );
              })}
              <defs>
                <linearGradient
                  id="horizontal-bar-gradient-max"
                  gradientTransform="rotate(0)"
                >
                  <stop
                    offset={barGradientValues?.offset1 ?? '41.13%'}
                    stopColor={barGradientValues?.stopColor1 ?? '#FE9F69'}
                  />
                  <stop
                    offset={barGradientValues?.offset2 ?? '81.93%'}
                    stopColor={barGradientValues?.stopColor2 ?? '#F15701'}
                  />
                </linearGradient>
                <filter
                  id="horizontal-shadow-max"
                  filterUnits="userSpaceOnUse"
                  colorInterpolationFilters="sRGB"
                >
                  <feDropShadow
                    dx="0"
                    dy="4"
                    stdDeviation="0"
                    floodColor={shadowColors?.maxFloodColor ?? 'rgb(241,87,1)'}
                  />
                </filter>
                {filteredBarChartData.map((d, i) => (
                  <filter
                    // eslint-disable-next-line react/no-array-index-key
                    key={d.label + i + d.value}
                    id={`horizontal-shadow-${i}-${d.color ?? globalBarBgColor}`}
                    filterUnits="userSpaceOnUse"
                    colorInterpolationFilters="sRGB"
                  >
                    <feDropShadow
                      dx="0"
                      dy="4"
                      stdDeviation="0"
                      floodColor={
                        shadowColors?.floodColor ??
                        getColor(
                          'shadow',
                          d.color ?? globalBarBgColor,
                          getParentPassedOpacityValues(d),
                        ) ??
                        'rgb(251,203,176)'
                      }
                    />
                  </filter>
                ))}
                {filteredBarChartData.map((d, i) => (
                  <pattern
                    key={d.label}
                    id={`horizontal-slant-pattern-${i}-${d.color ?? globalBarBgColor}`}
                    patternUnits="userSpaceOnUse"
                    width="10"
                    height="10"
                  >
                    <rect width="10" height="10" fill="#FFFFFF" />
                    <rect
                      width="10"
                      height="10"
                      fill={
                        d.color
                          ? getColor(
                              'bar',
                              d.color ?? globalBarBgColor,
                              getParentPassedOpacityValues(d),
                            )
                          : '#FEF4EE'
                      }
                      className={`${diagonalLineColors?.bgClassName || barFillClassName}`}
                    />
                    {showDiagonalLines && (
                      <path
                        d="M-2,2 l4,-4 M0,10 l10,-10 M8,12 l4,-4"
                        stroke={
                          d.color
                            ? getColor(
                                'diagonal',
                                d.color ?? diagonalLineColor,
                                getParentPassedOpacityValues(d),
                              )
                            : '#FFE3D4'
                        }
                        strokeWidth="1"
                        className={`${diagonalLineColors?.lineClassName || diagonalLineClassName}`}
                      />
                    )}
                  </pattern>
                ))}
              </defs>
            </Group>
            <AxisBottom
              scale={xScale}
              hideTicks
              label={xAxisLabel}
              labelOffset={25}
              labelClassName={`${xAxisLabelClassName} label-small fill-text-text font-medium`}
              top={height - effectiveMargins.bottom}
              numTicks={axisBottomValueGap}
              tickValues={getTickValues()}
              tickLabelProps={() => ({
                className: '!label-small fill-[rgba(0,0,0,0.4)]',
                textAnchor: 'middle',
                dy: '0.5rem',
              })}
              hideAxisLine
              tickFormat={
                axisBottomTickFormatter
                  ? (value) => axisBottomTickFormatter(value as number)
                  : undefined
              }
            />
          </Group>
        </svg>
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
