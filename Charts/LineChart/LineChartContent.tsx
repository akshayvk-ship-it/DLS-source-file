/* eslint-disable import/prefer-default-export */
import { AxisBottom, AxisLeft, TickRendererProps } from '@visx/axis';
import { GridColumns, GridRows } from '@visx/grid';
import { Group } from '@visx/group';
import { scaleLinear, scalePoint } from '@visx/scale';
import { AreaClosed, Line, LinePath } from '@visx/shape';
import { Text } from '@visx/text';
import { curveLinear } from '@visx/curve';
import { useTooltip, useTooltipInPortal } from '@visx/tooltip';
import { localPoint } from '@visx/event';
import { EventType } from '@visx/event/lib/types';
import {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import ToolTipLeftArrow from './ToolTipLeftArrow';
import { LineChartData, LineChartProps, ShowLineAreaGradient } from './types';
import ToolTipLineChart from './ToolTipLineChart';
import { Legends, useLinearLegend } from '../Legends';
import { HorizontalGridLine } from '../common/HorizontalGridLine';
import { VerticalGridLine } from '../common/VerticalGridLine';
import { useDevicePixelRatio } from '../../hooks/useDevicePixelRatio';

export const LineChartContent = forwardRef<
  HTMLDivElement,
  Omit<LineChartProps, 'isLoading' | 'skeletonProps'>
>(
  (
    {
      height,
      width,
      margins,
      axisLeftValueGap,
      axisLeftTickFormatter,
      axisBottomTickFormatter,
      dataTestId = 'line-chart-test-id',
      toolTipContent,
      lineChartType,
      xAxisLabel,
      yAxisLabel,
      shouldShowMedianLine = false,
      showTooltipPositionTop = false,
      showColumnsLines = false,
      usePreciseTickCalculation = false,
      legendProps,
      tooltipBehavior = 'floating',
      enableHorizontalScroll = false,
      minPointWidth = 50,
    },
    ref,
  ) => {
    const devicePixelRatio = useDevicePixelRatio();

    const isCustomTooltip = toolTipContent?.renderCustomComponent?.showCustom;

    const { containerRef, TooltipInPortal, forceRefreshBounds } =
      useTooltipInPortal({
        scroll: true,
      });

    const { tooltipData, tooltipLeft, tooltipTop, showTooltip, hideTooltip } =
      useTooltip<LineChartData[]>();

    const scrollContainerRef = useRef(null);

    const medianValueTextRef = useRef(null);
    const medianLineTextRef = useRef(null);
    const [medianValueTextWidth, setMedianValueTextWidth] = useState(0);
    const [maxYLabelWidth, setMaxYLabelWidth] = useState(0);
    const [isMedianLineHovered, setIsMedianLineHovered] = useState(false);
    const [medianLineTextWidth, setMedianLineTextWidth] = useState(0);
    const [lastSnappedLabel, setLastSnappedLabel] = useState<string | null>(
      null,
    );

    const tickWidthsRef = useRef<Record<string, number>>({});
    const getTickRef =
      (formattedValue: string) => (node: SVGTextElement | null) => {
        if (!node) return;
        const labelWidth = node.getBoundingClientRect().width;
        const key = String(formattedValue);
        if (tickWidthsRef.current[key] !== labelWidth) {
          tickWidthsRef.current[key] = labelWidth;
          const nextMax = Math.max(...Object.values(tickWidthsRef.current));
          setMaxYLabelWidth((prev) => {
            const proposed = nextMax + 2;
            return Math.abs(prev - proposed) > 0.5 ? proposed : prev;
          });
        }
      };

    const GAP_WITH_LEFT_AXIS = 20;
    const Y_AXIS_LABEL_OFFSET = yAxisLabel ? 10 : 0;
    const Y_AXIS_LABEL_WIDTH = yAxisLabel ? 12 : 0;
    const X_AXIS_LABEL_OFFSET = xAxisLabel ? 10 : 0;

    const axisLabelWidth = enableHorizontalScroll ? 50 : 18;
    const X_AXIS_LABEL_WIDTH = xAxisLabel ? axisLabelWidth : 0;
    const PLOT_SIDE_PADDING = yAxisLabel ? 20 : 6;

    const legendData =
      legendProps?.legendType === 'linear' ? legendProps.legendData : [];
    const xAxisLabels =
      lineChartType.series && legendProps?.legendType === 'linear'
        ? lineChartType.lineChartSeries.map((_, index) => index)
        : [];

    const { selectedChartLabels, handleLegendSelection } =
      useLinearLegend<number>(legendData, xAxisLabels);

    const lineChartTypeData = useMemo(
      () =>
        lineChartType.series && legendProps?.legendType === 'linear'
          ? {
              ...lineChartType,
              lineChartSeries: lineChartType.lineChartSeries.filter(
                (_, index) => selectedChartLabels.includes(index),
              ),
              lineAreaGradient: lineChartType.lineAreaGradient?.filter(
                (_, index) => selectedChartLabels.includes(index),
              ),
              lineStrokeColor: lineChartType.lineStrokeColor?.filter(
                (_, index) => selectedChartLabels.includes(index),
              ),
            }
          : lineChartType,
      [legendProps?.legendType, lineChartType, selectedChartLabels],
    );

    const getDomains = useCallback(
      (typeData: keyof LineChartData) => {
        if (lineChartTypeData.series) {
          if (typeData === 'value') {
            const newSet = new Set();
            lineChartTypeData.lineChartSeries?.forEach((lineData) => {
              lineData.forEach((val) => {
                newSet.add(val.value);
              });
            });

            return Array.from(newSet);
          }

          return lineChartTypeData.lineChartSeries[0]?.map(
            (lineData) => lineData[typeData],
          );
        }

        return lineChartTypeData.lineChartData.map((d) => d[typeData]);
      },
      [lineChartTypeData],
    );

    const yScale = useMemo(
      () =>
        scaleLinear({
          range: [
            height - margins.bottom - X_AXIS_LABEL_OFFSET - X_AXIS_LABEL_WIDTH,
            margins.top,
          ],
          domain: [0, Math.max(...(getDomains('value') as number[]))],
          nice: true,
        }),
      [
        height,
        margins.bottom,
        margins.top,
        X_AXIS_LABEL_OFFSET,
        X_AXIS_LABEL_WIDTH,
        getDomains,
      ],
    );

    const getMedianYValue = useMemo(() => {
      const values = getDomains('value') as number[];
      const sortedValues = values.sort((a, b) => a - b);
      const medianIndex = Math.floor(sortedValues.length / 2);
      return sortedValues[medianIndex] ?? 0;
    }, [getDomains]);

    const axisLeftTotalOffset =
      margins.left + maxYLabelWidth + GAP_WITH_LEFT_AXIS;

    // Horizontal scroll calculations
    const dataPointCount = useMemo(
      () => (getDomains('label') as string[]).length,
      [getDomains],
    );

    const plotViewportWidth = Math.max(
      0,
      width - margins.right - axisLeftTotalOffset,
    );

    const requiredPlotWidth = Math.max(
      plotViewportWidth,
      dataPointCount * minPointWidth,
    );

    const shouldScroll =
      enableHorizontalScroll && requiredPlotWidth > plotViewportWidth;

    const effectivePlotWidth = shouldScroll
      ? requiredPlotWidth
      : plotViewportWidth;

    const xScaleScrollable = useMemo(
      () =>
        scalePoint({
          domain: getDomains('label') as string[],
          range: [
            PLOT_SIDE_PADDING,
            (shouldScroll ? requiredPlotWidth : plotViewportWidth) -
              PLOT_SIDE_PADDING,
          ],
          round: true,
        }),
      [
        getDomains,
        shouldScroll,
        requiredPlotWidth,
        plotViewportWidth,
        PLOT_SIDE_PADDING,
      ],
    );

    const xScale = useMemo(
      () =>
        scalePoint({
          domain: getDomains('label') as string[],
          range: [
            maxYLabelWidth +
              GAP_WITH_LEFT_AXIS +
              Y_AXIS_LABEL_WIDTH +
              Y_AXIS_LABEL_OFFSET,
            // +              margins.left
            width - margins.right,
          ],
          round: true,
        }),
      [
        getDomains,
        maxYLabelWidth,
        Y_AXIS_LABEL_WIDTH,
        Y_AXIS_LABEL_OFFSET,
        margins.right,
        width,
      ],
    );

    const yTickValues = useMemo(() => {
      if (!usePreciseTickCalculation) return undefined;
      return yScale.ticks(axisLeftValueGap ?? 5);
    }, [yScale, axisLeftValueGap, usePreciseTickCalculation]);

    const [xRangeStart, xRangeEnd] = useMemo(() => {
      const r = xScaleScrollable.range();
      const start = Array.isArray(r) ? r[0] : 0;
      const end = Array.isArray(r) ? r[1] : 0;
      return [start, end];
    }, [xScaleScrollable]);

    const xTickValues = useMemo(
      () => (getDomains('label') as string[]) ?? [],
      [getDomains],
    );

    const [firstX, lastX] = useMemo(() => {
      const labels = xTickValues;
      if (!labels || labels.length === 0) return [xRangeStart, xRangeEnd];
      const start = xScaleScrollable(labels[0] as string) ?? xRangeStart;
      const end =
        xScaleScrollable(labels[labels.length - 1] as string) ?? xRangeEnd;
      return [start, end];
    }, [xTickValues, xScaleScrollable, xRangeStart, xRangeEnd]);

    useEffect(() => {
      tickWidthsRef.current = {};
      setMaxYLabelWidth(0);
    }, [yTickValues, axisLeftTickFormatter]);

    useEffect(() => {
      if (medianValueTextRef.current) {
        const widthLabel = (
          medianValueTextRef.current as SVGTextElement
        ).getBoundingClientRect().width;

        setMedianValueTextWidth(widthLabel + 2);
      }
    }, [getDomains]);

    useEffect(() => {
      if (medianLineTextRef.current) {
        // This if condition is added because of cross browser compatibility issue
        if ((medianLineTextRef.current as SVGElement)?.childNodes.length > 0) {
          const medianElement = (medianLineTextRef.current as SVGElement)
            .childNodes[0];

          const widthElement = (
            medianElement as SVGTextElement
          )?.getBoundingClientRect().width;

          setMedianLineTextWidth(widthElement + 2);

          return;
        }

        const widthLabel = (
          medianLineTextRef.current as SVGTextElement
        ).getBoundingClientRect().width;

        setMedianLineTextWidth(widthLabel + 2);
      }
    }, [medianLineTextRef]);

    useEffect(() => {
      const scroller = scrollContainerRef.current as HTMLElement | null;
      scroller?.addEventListener('scroll', hideTooltip);

      return () => {
        scroller?.removeEventListener('scroll', hideTooltip);
      };
    }, [hideTooltip, scrollContainerRef]);

    const nonIntervalXValues = useMemo(() => {
      const values = lineChartTypeData.series
        ? lineChartTypeData.lineChartSeries.flat().map((d) => d.label)
        : lineChartTypeData.lineChartData
            .filter((d: LineChartData) => !(d.hasInterval ?? false))
            .map((d) => d.label);

      return [...new Set(values)];
    }, [lineChartTypeData]);

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

    const getSnappedPoint = (
      mouseX: number,
      lineData: LineChartData[],
    ): { point: LineChartData; snappedX: number } => {
      if (lineData.length === 0 || !lineData[0]) {
        const fallbackPoint: LineChartData = { label: '', value: 0 };
        return { point: fallbackPoint, snappedX: 0 };
      }

      // Get all x positions
      const xPositions = lineData.map((d) => ({
        data: d,
        x:
          (enableHorizontalScroll
            ? xScaleScrollable(d.label)
            : xScale(d.label)) ?? 0,
      }));

      const firstPosition = xPositions[0];
      const lastPosition = xPositions[xPositions.length - 1];

      // Cursor before first point
      if (firstPosition && mouseX <= firstPosition.x) {
        return { point: firstPosition.data, snappedX: firstPosition.x };
      }

      // Cursor after last point
      if (lastPosition && mouseX >= lastPosition.x) {
        return {
          point: lastPosition.data,
          snappedX: lastPosition.x,
        };
      }

      // Find the two adjacent points the cursor is between
      for (let i = 0; i < xPositions.length - 1; i += 1) {
        const current = xPositions[i];
        const next = xPositions[i + 1];

        if (current && next && mouseX >= current.x && mouseX <= next.x) {
          // Calculate the midpoint threshold
          const midpoint = (current.x + next.x) / 2;

          // Snap to the previous point
          if (mouseX < midpoint) {
            return { point: current.data, snappedX: current.x };
          }
          // Snap to the next point
          return { point: next.data, snappedX: next.x };
        }
      }

      const fallbackData = lineData[0];
      return {
        point: fallbackData,
        snappedX:
          (enableHorizontalScroll
            ? xScaleScrollable(fallbackData.label)
            : xScale(fallbackData.label)) ?? 0,
      };
    };

    const getNearestDataPoint = (
      mouseX: number,
      lineData: LineChartData[],
      scaleFn?: (label: string) => number | undefined,
    ): { point: LineChartData; snappedX: number } => {
      let closestPoint: LineChartData = lineData[0] as LineChartData;
      let snappedX = mouseX;

      if (tooltipBehavior === 'floating') {
        lineData.forEach((data) => {
          const pointX =
            (enableHorizontalScroll
              ? scaleFn?.(data.label)
              : xScale(data.label)) ?? 0;
          if (mouseX >= pointX) {
            closestPoint = data;
          }
        });
        // For floating, use the actual mouse position
        snappedX = mouseX;
      }

      if (tooltipBehavior === 'sticky') {
        const result = getSnappedPoint(mouseX, lineData);
        closestPoint = result.point;
        snappedX = result.snappedX;
      }

      return { point: closestPoint, snappedX };
    };

    const rectMouseLineHandler = (event: EventType) => {
      const { x: mouseX } = localPoint(event) || { x: 0 };

      const clampedX = Math.max(firstX, Math.min(lastX, mouseX));

      const tooltipPoints: LineChartData[] = [];
      let finalTooltipLeft = mouseX;

      if (lineChartTypeData.series && lineChartTypeData.lineChartSeries[0]) {
        lineChartTypeData.lineChartSeries.forEach((lineData, index) => {
          const result = getNearestDataPoint(
            enableHorizontalScroll ? clampedX : mouseX,
            lineData,
            enableHorizontalScroll
              ? (label) => xScaleScrollable(label)
              : undefined,
          );

          // For the first series, set the snapped X position for tooltip
          if (index === 0) {
            finalTooltipLeft = result.snappedX;
          }

          tooltipPoints.push(result.point);
        });
      } else if (!lineChartTypeData.series) {
        const result = getNearestDataPoint(
          enableHorizontalScroll ? clampedX : mouseX,
          lineChartTypeData.lineChartData,
          enableHorizontalScroll
            ? (label) => xScaleScrollable(label)
            : undefined,
        );
        tooltipPoints.push(result.point);
        finalTooltipLeft = result.snappedX;
      }

      // Calculate tooltip top position
      let finalTooltipTop = 0;

      if (tooltipBehavior === 'sticky') {
        // For sticky mode, position tooltip above the data point
        // For multi-series, use the highest point (smallest y-value in SVG coordinates)
        const yValues = tooltipPoints.map((point) => yScale(point.value) ?? 0);
        const highestPointY = Math.min(...yValues);
        let TOOLTIP_OFFSET = 0;
        if (isCustomTooltip) {
          TOOLTIP_OFFSET = 27;
        } else if (lineChartTypeData.series) {
          TOOLTIP_OFFSET = 59;
        } else {
          TOOLTIP_OFFSET = 40;
        }

        finalTooltipTop = highestPointY - TOOLTIP_OFFSET;

        const currentLabel = tooltipPoints[0]?.label ?? null;

        // Only update tooltip if the snapped point has changed (for sticky mode)
        if (currentLabel !== lastSnappedLabel) {
          setLastSnappedLabel(currentLabel);
          showTooltip({
            tooltipData: tooltipPoints,
            tooltipLeft: enableHorizontalScroll ? clampedX : finalTooltipLeft,
            tooltipTop: finalTooltipTop,
          });
        }
      } else {
        // For floating mode, use the original positioning logic
        finalTooltipTop = showTooltipPositionTop
          ? margins.top - 15
          : (height - margins.top - margins.bottom) / 2;

        // For floating mode, always update
        showTooltip({
          tooltipData: tooltipPoints,
          tooltipLeft: enableHorizontalScroll ? clampedX : finalTooltipLeft,
          tooltipTop: finalTooltipTop,
        });
      }
    };

    const renderLinearGradient = (
      lineAreaGradient: ShowLineAreaGradient,
      index: number,
    ) => (
      <linearGradient id={`gradient-${index}`} gradientTransform="rotate(90)">
        <stop
          offset={lineAreaGradient.stopOffset1}
          stopColor={lineAreaGradient.stopColor1}
        />
        <stop
          offset={lineAreaGradient.stopOffset2}
          stopColor={lineAreaGradient.stopColor2}
        />
      </linearGradient>
    );

    const renderLineAndArea = (
      lineData: LineChartData[],
      lineStroke: string,
      index: number,
      scaleFn?: (label: string) => number | undefined,
    ) => (
      <>
        {lineChartTypeData.lineAreaGradient ? (
          <AreaClosed
            data={lineData}
            x={(d: LineChartData) =>
              enableHorizontalScroll
                ? (scaleFn?.(d.label) ?? 0)
                : (xScale(d.label) ?? 0)
            }
            y={(d) => yScale(d.value) ?? 0}
            yScale={yScale}
            curve={curveLinear}
            fill={`url(#gradient-${index})`}
            width={width + margins.left + margins.right}
          />
        ) : (
          ''
        )}
        <LinePath
          data={lineData}
          x={(d: LineChartData) =>
            enableHorizontalScroll
              ? (scaleFn?.(d.label) ?? 0)
              : (xScale(d.label) ?? 0)
          }
          y={(d) => yScale(d.value) ?? 0}
          stroke={lineStroke}
          strokeWidth={1.5}
          strokeLinejoin="miter"
          curve={curveLinear}
        />
      </>
    );

    const gradients = (
      lineAreaGradientData: ShowLineAreaGradient[] | ShowLineAreaGradient,
    ) =>
      Array.isArray(lineAreaGradientData)
        ? lineAreaGradientData?.map((gradientValue, index) =>
            renderLinearGradient(gradientValue, index),
          )
        : renderLinearGradient(lineAreaGradientData, 0);

    const axisLeftContent = (
      <AxisLeft
        scale={yScale}
        axisClassName="mx-4 px-4"
        left={
          maxYLabelWidth +
          6 +
          Y_AXIS_LABEL_OFFSET +
          Y_AXIS_LABEL_WIDTH +
          (enableHorizontalScroll ? margins.left : 0)
          // +   margins.left
        }
        label={yAxisLabel}
        labelClassName="label-small font-medium fill-text-text"
        labelOffset={Y_AXIS_LABEL_OFFSET + maxYLabelWidth}
        numTicks={usePreciseTickCalculation ? undefined : axisLeftValueGap}
        tickValues={yTickValues}
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
    );

    const gridWidth = enableHorizontalScroll
      ? Math.max(0, lastX - firstX)
      : width -
        margins.right -
        GAP_WITH_LEFT_AXIS -
        maxYLabelWidth -
        Y_AXIS_LABEL_OFFSET -
        Y_AXIS_LABEL_WIDTH;

    const gridHeight =
      height -
      margins.top -
      X_AXIS_LABEL_OFFSET -
      X_AXIS_LABEL_WIDTH -
      (enableHorizontalScroll ? margins.bottom : 0);

    const gridRowsAndColumns = (
      <>
        <defs>
          {/* Horizontal grid line pattern */}
          <pattern
            id="horizontal-grid-dash-pattern-line"
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

          {/* Vertical grid line pattern */}
          <pattern
            id="vertical-grid-dash-pattern-line"
            patternUnits="userSpaceOnUse"
            width="1"
            height="8"
          >
            <rect
              x="0"
              y="0"
              width="1"
              height="4"
              fill="rgba(208, 211, 216, 1)"
            />
          </pattern>

          {/* Tooltip hover line pattern */}
          <pattern
            id="tooltip-line-dash-pattern"
            patternUnits="userSpaceOnUse"
            width="1"
            height="4"
          >
            <rect x="0" y="0" width="1" height="2" fill="#323C4D" />
          </pattern>
        </defs>
        <GridRows
          scale={yScale}
          width={gridWidth}
          tickValues={yTickValues}
          numTicks={usePreciseTickCalculation ? undefined : axisLeftValueGap}
          height={gridHeight}
          left={
            enableHorizontalScroll
              ? firstX
              : GAP_WITH_LEFT_AXIS +
                maxYLabelWidth +
                Y_AXIS_LABEL_OFFSET +
                Y_AXIS_LABEL_WIDTH
          }
        >
          {({ lines }) => (
            <>
              {lines.map((line, index) => {
                const fromY = line?.from?.y ?? 0;
                return (
                  <HorizontalGridLine
                    key={`horizontal-grid-line-${fromY ?? index}`}
                    yValue={fromY ?? 0}
                    index={index}
                    devicePixelRatio={devicePixelRatio}
                    width={gridWidth}
                    dashPatternId="horizontal-grid-dash-pattern-line"
                  />
                );
              })}
            </>
          )}
        </GridRows>
        {showColumnsLines && (
          <GridColumns
            height={
              height -
              margins.top -
              margins.bottom -
              X_AXIS_LABEL_OFFSET -
              X_AXIS_LABEL_WIDTH
            }
            scale={enableHorizontalScroll ? xScaleScrollable : xScale}
            top={margins.top}
            left={enableHorizontalScroll ? firstX : 0}
            width={
              enableHorizontalScroll
                ? Math.max(0, lastX - firstX)
                : width -
                  margins.left -
                  margins.right -
                  GAP_WITH_LEFT_AXIS -
                  maxYLabelWidth -
                  Y_AXIS_LABEL_OFFSET -
                  Y_AXIS_LABEL_WIDTH
            }
          >
            {({ lines }) => (
              <>
                {lines.map((line, index) => {
                  const fromX = line?.from?.x ?? 0;
                  return (
                    <VerticalGridLine
                      key={`vertical-grid-line-${fromX ?? index}`}
                      xValue={fromX ?? 0}
                      devicePixelRatio={devicePixelRatio}
                      height={
                        height -
                        margins.top -
                        margins.bottom -
                        X_AXIS_LABEL_OFFSET -
                        X_AXIS_LABEL_WIDTH
                      }
                      dashPatternId="vertical-grid-dash-pattern-line"
                    />
                  );
                })}
              </>
            )}
          </GridColumns>
        )}
      </>
    );

    const renderLineChartPlotting = (
      <>
        {lineChartTypeData.series
          ? lineChartTypeData.lineChartSeries.map((lineChart, index) =>
              renderLineAndArea(
                lineChart,
                lineChartTypeData.lineStrokeColor?.[index] ?? '',
                index,
                enableHorizontalScroll
                  ? (label) => xScaleScrollable(label) ?? 0
                  : undefined,
              ),
            )
          : renderLineAndArea(
              lineChartTypeData.lineChartData,
              lineChartTypeData.lineStrokeColor,
              0,
              enableHorizontalScroll
                ? (label) => xScaleScrollable(label) ?? 0
                : undefined,
            )}
        {lineChartTypeData.lineAreaGradient &&
          gradients(lineChartTypeData.lineAreaGradient)}
        <AxisBottom
          scale={enableHorizontalScroll ? xScaleScrollable : xScale}
          label={xAxisLabel}
          labelClassName="label-small font-medium fill-text-text"
          labelOffset={enableHorizontalScroll ? 25 : 20}
          hideTicks
          tickValues={nonIntervalXValues}
          hideZero
          top={
            height - margins.bottom - X_AXIS_LABEL_OFFSET - X_AXIS_LABEL_WIDTH
          }
          tickLabelProps={() => ({
            className: '!label-small fill-[rgba(0,0,0,0.4)]',
            textAnchor: 'start',
            dy: '0.5rem',
            dx: '-0.5rem',
          })}
          hideAxisLine
          tickFormat={
            axisBottomTickFormatter
              ? (value) => axisBottomTickFormatter(value)
              : undefined
          }
        />
        {/* Mouse hovering handler */}
        <rect
          width={
            enableHorizontalScroll
              ? Math.max(0, lastX - firstX)
              : width -
                // margins.left -
                margins.right -
                maxYLabelWidth -
                GAP_WITH_LEFT_AXIS -
                Y_AXIS_LABEL_OFFSET -
                Y_AXIS_LABEL_WIDTH
          }
          height={
            height -
            margins.top -
            margins.bottom -
            X_AXIS_LABEL_OFFSET -
            X_AXIS_LABEL_WIDTH
          }
          x={
            enableHorizontalScroll
              ? firstX
              : maxYLabelWidth +
                GAP_WITH_LEFT_AXIS +
                // margins.left +
                Y_AXIS_LABEL_OFFSET +
                Y_AXIS_LABEL_WIDTH
          }
          y={margins.top}
          fill="transparent"
          onMouseEnter={forceRefreshBounds}
          onMouseMove={rectMouseLineHandler}
          onMouseLeave={() => {
            hideTooltip();
            setLastSnappedLabel(null);
          }}
        />
        {shouldShowMedianLine && (
          <Group
            onMouseEnter={() => {
              setIsMedianLineHovered(true);
            }}
            onMouseLeave={() => {
              setIsMedianLineHovered(false);
            }}
            className="cursor-pointer"
          >
            {isMedianLineHovered && (
              <rect
                x={
                  enableHorizontalScroll
                    ? xRangeStart + 12
                    : GAP_WITH_LEFT_AXIS +
                      // margins.left +
                      Y_AXIS_LABEL_OFFSET +
                      Y_AXIS_LABEL_WIDTH +
                      maxYLabelWidth -
                      4 +
                      12 // Padding
                }
                y={yScale(getMedianYValue) - 20} // Adjusted to make the padding-y intact
                width={
                  medianValueTextWidth +
                  medianLineTextWidth +
                  (enableHorizontalScroll ? 14 : 4)
                } // Padding-x
                height={16}
                className="fill-fill-info-dark"
                rx={4}
                ry={4}
              />
            )}
            <Text
              innerTextRef={medianValueTextRef}
              x={
                enableHorizontalScroll
                  ? xRangeStart + 20
                  : GAP_WITH_LEFT_AXIS +
                    // margins.left +
                    Y_AXIS_LABEL_OFFSET +
                    Y_AXIS_LABEL_WIDTH +
                    maxYLabelWidth +
                    12
              }
              y={yScale(getMedianYValue) - 12}
              textAnchor="start"
              verticalAnchor="middle"
              className={`!label-small font-normal ${
                isMedianLineHovered ? 'fill-text-on-fill' : 'fill-text-dark'
              }`}
            >
              {`${
                axisLeftTickFormatter
                  ? axisLeftTickFormatter(getMedianYValue)
                  : getMedianYValue
              }`}
            </Text>
            <Text
              innerRef={medianLineTextRef}
              x={
                enableHorizontalScroll
                  ? xRangeStart + 20 + medianValueTextWidth
                  : GAP_WITH_LEFT_AXIS +
                    // margins.left +
                    Y_AXIS_LABEL_OFFSET +
                    Y_AXIS_LABEL_WIDTH +
                    maxYLabelWidth +
                    medianValueTextWidth +
                    12
              }
              y={yScale(getMedianYValue) - 12}
              textAnchor="start"
              verticalAnchor="middle"
              className={`!label-extra-small w-fit font-normal ${
                isMedianLineHovered ? 'fill-text-lighter' : 'fill-text-light'
              }`}
            >
              (median-line)
            </Text>
            <Line
              from={{
                x: enableHorizontalScroll
                  ? firstX
                  : GAP_WITH_LEFT_AXIS +
                    // margins.left +
                    Y_AXIS_LABEL_OFFSET +
                    Y_AXIS_LABEL_WIDTH +
                    maxYLabelWidth,
                y: yScale(getMedianYValue),
              }}
              to={{
                x: enableHorizontalScroll ? lastX : width - margins.right,
                y: yScale(getMedianYValue),
              }}
              strokeWidth={isMedianLineHovered ? 1.5 : 1}
              className={`stroke-border-dark ${
                isMedianLineHovered ? 'stroke-border-dark-hover' : ''
              }`}
              strokeDasharray="4 2"
            />
            {/* </Group>
            )} */}
            {tooltipData && (
              <g>
                <rect
                  x={
                    Math.round((tooltipLeft ?? 0) * devicePixelRatio) /
                    devicePixelRatio
                  }
                  y={margins.top}
                  width={1 / devicePixelRatio}
                  height={
                    height -
                    margins.bottom -
                    margins.top -
                    X_AXIS_LABEL_OFFSET -
                    X_AXIS_LABEL_WIDTH
                  }
                  fill="url('#tooltip-line-dash-pattern')"
                  pointerEvents="none"
                  shapeRendering="crispEdges"
                />
                {/* Render circle markers at the snapped data points for sticky mode */}
                {tooltipBehavior === 'sticky' &&
                  tooltipData.map((point, idx) => {
                    const cx =
                      (enableHorizontalScroll
                        ? xScaleScrollable(point.label)
                        : xScale(point.label)) ?? 0;
                    const cy = yScale(point.value) ?? 0;

                    const strokeColor = lineChartTypeData.series
                      ? (lineChartTypeData.lineStrokeColor?.[idx] ?? '#9355FA')
                      : lineChartTypeData.lineStrokeColor;

                    const uniqueKey = `tooltip-circle-${point.label}-${point.value}-${strokeColor}`;

                    return (
                      <circle
                        key={uniqueKey}
                        cx={cx}
                        cy={cy}
                        r={3}
                        fill={strokeColor}
                        stroke={strokeColor}
                        strokeWidth={2}
                        pointerEvents="none"
                      />
                    );
                  })}
              </g>
            )}
          </Group>
        )}
        {tooltipData && (
          <g>
            <rect
              x={
                Math.round((tooltipLeft ?? 0) * devicePixelRatio) /
                devicePixelRatio
              }
              y={margins.top}
              width={1 / devicePixelRatio}
              height={
                height -
                margins.bottom -
                margins.top -
                X_AXIS_LABEL_OFFSET -
                X_AXIS_LABEL_WIDTH
              }
              fill="url('#tooltip-line-dash-pattern')"
              pointerEvents="none"
              shapeRendering="crispEdges"
            />
          </g>
        )}
      </>
    );

    return (
      <div
        className={`relative ${legendProps ? 'flex flex-col items-center gap-4' : ''}`}
        ref={ref}
        data-testid={dataTestId}
      >
        {enableHorizontalScroll ? (
          <div className="flex" style={{ width }}>
            {/* Sticky Left Axis */}
            <svg
              width={axisLeftTotalOffset}
              height={height}
              className="pointer-events-none"
            >
              <Group>{axisLeftContent}</Group>
            </svg>
            {/* Scrollable Plot Area */}
            <div
              className="overflow-x-auto"
              style={{ width: plotViewportWidth }}
              ref={scrollContainerRef}
            >
              <svg
                width={effectivePlotWidth}
                height={height}
                ref={containerRef}
                style={{ maxWidth: 'none' }}
              >
                <Group>
                  {gridRowsAndColumns}
                  {renderLineChartPlotting}
                </Group>
              </svg>
            </div>
          </div>
        ) : (
          <svg width={width} height={height} ref={containerRef}>
            <Group>
              {gridRowsAndColumns}
              {axisLeftContent}
              {renderLineChartPlotting}
            </Group>
          </svg>
        )}
        {tooltipData ? (
          <TooltipInPortal
            left={tooltipLeft}
            top={tooltipTop}
            detectBounds={false}
            className="absolute w-fit !bg-transparent !shadow-none"
          >
            <div
              className={`
                ${toolTipContent?.className ?? ''}
                  bg-fill-fill relative rounded-xl border  border-solid border-[#9355FA] py-1 !shadow-[0px_4px_4px_0px_rgba(0,0,0,0.08)]
                    ${!lineChartTypeData.series ? '!px-3' : 'pl-1 pr-3'}
                  `}
              style={
                tooltipBehavior === 'floating' && !showTooltipPositionTop
                  ? {
                      transform: 'translateY(-34%)',
                    }
                  : undefined
              }
            >
              {isCustomTooltip ? (
                toolTipContent?.renderCustomComponent?.CustomComponent({
                  currentToolTip: tooltipData,
                })
              ) : (
                <ToolTipLineChart
                  lineChartType={lineChartTypeData}
                  tooltipData={tooltipData}
                  axisBottomTickFormatter={axisBottomTickFormatter}
                  axisLeftTickFormatter={axisLeftTickFormatter}
                />
              )}
              <ToolTipLeftArrow
                className={`${toolTipContent?.tooltipArrowClassName ?? ''} absolute right-full top-1/2 -translate-y-1/2 `}
                tooltipArrowColor={toolTipContent?.tooltipArrowColor}
              />
            </div>
          </TooltipInPortal>
        ) : (
          ''
        )}

        {legendProps && legendProps.legendType === 'linear' && (
          <Legends
            legendType="linear"
            isOutlined
            isSelectable
            legendData={legendProps.legendData}
            allowAllUnselected={false}
            onLegendChange={handleLegendSelection}
          />
        )}
      </div>
    );
  },
);
