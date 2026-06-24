import { AxisBottom, AxisLeft, TickRendererProps } from '@visx/axis';
import { GridColumns, GridRows } from '@visx/grid';
import { Group } from '@visx/group';
import { scaleLinear } from '@visx/scale';
import { Circle, LinePath } from '@visx/shape';
import { Text } from '@visx/text';
import { useTooltip, useTooltipInPortal } from '@visx/tooltip';
import { EventType } from '@visx/event/lib/types';
import { localPoint } from '@visx/event';
import {
  forwardRef,
  Fragment,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import CustomToolTipComponent from './CustomToolTipComponent';
import {
  ConnectedScatterPlotData,
  ConnectedScatterPlotProps,
  DataPoint,
  ToolTipPlotDataType,
} from './types';
import ToolTipLeftArrow from './ToolTipLeftArrow';
import { lightenColor, normalizeOpacity } from './helper';
import useBackwardCompatibility from './useBackwardCompatibility';
import { ChartSkeleton } from '../ChartsSkeletonLoader';
import { HorizontalGridLine } from '../common/HorizontalGridLine';
import { VerticalGridLine } from '../common/VerticalGridLine';
import { useDevicePixelRatio } from '../../hooks/useDevicePixelRatio';
import { useAllZeroEffect } from '../NoDataSkeleton/hook/useAllZeroEffect';
import { ConnectedScatterPlotNoDataSkeleton } from '../NoDataSkeleton/ConnectedScatterPlotNoDataSkeleton';

// eslint-disable-next-line import/prefer-default-export
export const ConnectedScatterPlot = forwardRef<
  HTMLDivElement,
  ConnectedScatterPlotProps
>((props, ref) => {
  const {
    height,
    width,
    xLabel,
    yLabel,
    xAxisNumTicks,
    yAxisNumTicks,
    yAxisTickFormatter,
    showToolTip = false,
    toolTipComponentProps,
    hideYAxisLabel = false,
    hideXAxisLabel = false,
    hideYAxisZero = false,
    scatterRadius = 4,
    wrapperClassName = '',
    dataTestId = 'ConnectedScatterPlotChart-testId',
    scatterColor = '#F15701',
    isSeries = false,
    hideGridColumns = false,
    showFirstBottomAxisValue = false,
    isLoading = false,
    skeletonProps = {},
    noDataSkeletonProps = {},
    usePreciseTickCalculation = false,
    customYAxisTicks,
    tooltipBehavior = 'floating',
  } = props;

  const TOOL_TIP_OFFSET = 10;

  const devicePixelRatio = useDevicePixelRatio();

  const { containerRef, TooltipInPortal, forceRefreshBounds } =
    useTooltipInPortal({
      scroll: true,
    });

  const { tooltipData, tooltipTop, tooltipLeft, showTooltip, hideTooltip } =
    useTooltip<ToolTipPlotDataType[]>();

  const { chartData, margins, xAxisTickFormatter } =
    useBackwardCompatibility(props);

  const isChartSeries = useMemo(() => chartData.length > 1, [chartData]);

  const [maxYLabelWidth, setMaxYLabelWidth] = useState(0);
  const [maxXLabelWidth, setMaxXLabelWidth] = useState(0);
  const [lastSnappedXValue, setLastSnappedXValue] = useState<number | null>(
    null,
  );

  const largestYValueRef = useRef(null);
  const largestXValueRef = useRef(null);

  const GAP_WITH_Y_LABEL = !hideYAxisLabel && yLabel ? 20 : 18;
  const OFFSET_WITH_Y_AXIS = !hideYAxisLabel && yLabel ? 20 : 0;

  const GAP_WITH_X_LABEL = !hideXAxisLabel && xLabel ? 2 : 10;
  const OFFSET_WITH_X_AXIS = !hideXAxisLabel && xLabel ? 20 : 0;

  const GAP_WITH_TOP = 8;

  const margin = useMemo(
    () => ({
      top: margins.top + GAP_WITH_TOP,
      right: margins.right + maxXLabelWidth,
      bottom: margins.bottom + GAP_WITH_X_LABEL + OFFSET_WITH_X_AXIS,
      left:
        margins.left + maxYLabelWidth + GAP_WITH_Y_LABEL + OFFSET_WITH_Y_AXIS,
    }),
    [
      margins,
      maxXLabelWidth,
      maxYLabelWidth,
      GAP_WITH_Y_LABEL,
      OFFSET_WITH_Y_AXIS,
      GAP_WITH_X_LABEL,
      OFFSET_WITH_X_AXIS,
      GAP_WITH_TOP,
    ],
  );

  const innerWidth = useMemo(
    () => width - margin.left - margin.right,
    [width, margin],
  );
  const innerHeight = useMemo(
    () =>
      height -
      (margin.top + GAP_WITH_TOP) -
      (margin.bottom + GAP_WITH_X_LABEL + OFFSET_WITH_X_AXIS),
    [height, margin, GAP_WITH_X_LABEL, OFFSET_WITH_X_AXIS],
  );

  // Separate actual and predicted data for each series
  const processedChartData = useMemo(
    () =>
      chartData.map((series) => {
        const actualData = (series.data ?? []).filter(
          (d) => !(d.isPredicted ?? false),
        );
        const predictedData = (series.data ?? []).filter(
          (d) => d.isPredicted === true,
        );

        // Create connection data (last actual point + all predicted points)
        const connectionData =
          actualData.length > 0 && predictedData.length > 0
            ? [actualData[actualData.length - 1], ...predictedData]
            : [];

        return {
          ...series,
          actualData,
          predictedData,
          connectionData,
        };
      }),
    [chartData],
  );

  const allDataPoints = useMemo(
    () => chartData.flatMap((s) => s.data ?? []),
    [chartData],
  );

  const nonIntervalXValues = useMemo(() => {
    const values = allDataPoints
      .filter((d) => !(d.hasInterval ?? false))
      .map((d) => d.xValue);

    return [...new Set(values)].sort((a, b) => a - b);
  }, [allDataPoints]);

  const xMax = useMemo(
    () =>
      allDataPoints.length > 0
        ? Math.max(...allDataPoints.map((d) => d.xValue))
        : 0,
    [allDataPoints],
  );
  const yMax = useMemo(
    () =>
      allDataPoints.length > 0
        ? Math.max(...allDataPoints.map((d) => d.yValue))
        : 0,
    [allDataPoints],
  );

  const xScale = useMemo(
    () =>
      scaleLinear({
        domain: [0, xMax],
        range: [0, innerWidth],
        nice: true,
      }),
    [xMax, innerWidth],
  );

  const yScale = useMemo(() => {
    if (customYAxisTicks && customYAxisTicks.length > 0) {
      return scaleLinear({
        domain: [Math.min(...customYAxisTicks), Math.max(...customYAxisTicks)],
        range: [innerHeight, 0],
      });
    }

    return scaleLinear({
      domain: [0, yMax],
      range: [innerHeight, 0],
      nice: !usePreciseTickCalculation,
    });
  }, [customYAxisTicks, yMax, innerHeight, usePreciseTickCalculation]);

  const maxYLabelValue = useMemo(() => Math.max(...yScale.domain()), [yScale]);
  const maxXLabelValue = useMemo(() => Math.max(...xScale.domain()), [xScale]);

  const yTicks = useMemo(() => {
    if (customYAxisTicks) {
      return customYAxisTicks;
    }

    if (!usePreciseTickCalculation) return yScale.ticks();
    if (yAxisNumTicks) {
      const step = Math.ceil(yMax / (yAxisNumTicks - 1));
      const ticks = Array.from({ length: yAxisNumTicks }, (_, i) => i * step);
      yScale.domain([0, ticks[ticks.length - 1] ?? 0]);
      return ticks;
    }

    return [];
  }, [
    customYAxisTicks,
    yAxisNumTicks,
    yMax,
    yScale,
    usePreciseTickCalculation,
  ]);

  const predictedAreaStartX = useMemo(() => {
    // Find the last actual data point's xValue
    let lastActualX = 0;
    processedChartData.forEach((series) => {
      if (series.actualData.length > 0) {
        const currentLastActual =
          series.actualData[series.actualData.length - 1];
        if (currentLastActual && currentLastActual.xValue > lastActualX) {
          lastActualX = currentLastActual.xValue;
        }
      }
    });
    return lastActualX;
  }, [processedChartData]);

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
          xAxisTickFormatter(maxXLabelValue) === formattedValue) ||
        maxXLabelValue.toString() === formattedValue?.replace(/,/g, '')
          ? largestXValueRef
          : null
      }
      dx="-0.5rem"
    >
      {formattedValue}
    </Text>
  );

  const getSnappedPoint = (
    mouseX: number,
    dataPoints: DataPoint[],
  ): { point: DataPoint; snappedX: number } => {
    if (dataPoints.length === 0 || !dataPoints[0]) {
      const fallbackPoint: DataPoint = { xValue: 0, yValue: 0 };
      return { point: fallbackPoint, snappedX: 0 };
    }

    // Get all x positions
    const xPositions = dataPoints.map((d) => ({
      data: d,
      x: xScale(d.xValue),
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

    const fallbackData = dataPoints[0];
    return { point: fallbackData, snappedX: xScale(fallbackData.xValue) };
  };

  const getNearestDataPoint = (
    mouseX: number,
    dataPoints: DataPoint[],
  ): { point: DataPoint; snappedX: number } => {
    let closestPoint: DataPoint = dataPoints[0] as DataPoint;
    let snappedX = mouseX;

    if (tooltipBehavior === 'floating') {
      const POINT_X_OFFSET = 2;
      dataPoints.forEach((dataPoint) => {
        const dataPointX = xScale(dataPoint.xValue) - POINT_X_OFFSET;
        if (mouseX >= dataPointX) {
          closestPoint = dataPoint;
        }
      });
      // For floating, use the actual mouse position
      snappedX = mouseX;
    }

    if (tooltipBehavior === 'sticky') {
      const result = getSnappedPoint(mouseX, dataPoints);
      closestPoint = result.point;
      snappedX = result.snappedX;
    }

    return { point: closestPoint, snappedX };
  };

  const rectMouseLineHandler = (event: EventType) => {
    const point = localPoint(event);
    if (!point) return;

    const { x: mouseX } = point;
    const adjustedMouseX = mouseX - margin.left;

    if (adjustedMouseX < 0 || adjustedMouseX > innerWidth) {
      hideTooltip();
      return;
    }

    const tooltipPayload: ToolTipPlotDataType[] = [];
    let finalTooltipLeft = adjustedMouseX;

    chartData.forEach((s, index) => {
      const seriesData = s.data ?? [];
      const dataToConsider = seriesData.filter(
        (d) => !(d.isPredicted ?? false),
      );

      if (dataToConsider.length === 0) return;

      const result = getNearestDataPoint(adjustedMouseX, dataToConsider);

      // For the first series, set the snapped X position for tooltip
      if (index === 0) {
        finalTooltipLeft = result.snappedX;
      }

      tooltipPayload.push({
        xValue: result.point.xValue,
        yValue: result.point.yValue,
        labelColor: s.scatterConnectionLineColor,
      });
    });

    const hasActualDataAtPosition = chartData.some((series) => {
      const actualData = series.data.filter((d) => !(d.isPredicted ?? false));

      if (actualData.length === 0) return false;

      const first = actualData[0];
      const last = actualData[actualData.length - 1];

      if (!first || !last) return false;

      const firstX = xScale(first.xValue);
      const lastX = xScale(last.xValue);

      return firstX <= adjustedMouseX && adjustedMouseX <= lastX + 5;
    });

    if (tooltipPayload.length > 0 && hasActualDataAtPosition) {
      // Calculate tooltip top position
      let finalTooltipTop = 0;

      if (tooltipBehavior === 'sticky') {
        // For sticky mode, position tooltip above the data point
        // For multi-series, use the highest point (smallest y-value in SVG coordinates)
        const yValues = tooltipPayload.map((p) => yScale(p.yValue));
        const highestPointY = Math.min(...yValues);
        const TOOLTIP_OFFSET = isChartSeries ? 59 : 40;
        finalTooltipTop = highestPointY - TOOLTIP_OFFSET;

        const currentXValue = tooltipPayload[0]?.xValue ?? null;

        // Only update tooltip if the snapped point has changed (for sticky mode)
        if (currentXValue !== lastSnappedXValue) {
          setLastSnappedXValue(currentXValue);
          showTooltip({
            tooltipData: tooltipPayload,
            tooltipLeft: finalTooltipLeft,
            tooltipTop: finalTooltipTop,
          });
        }
      } else {
        // For floating mode, always update
        showTooltip({
          tooltipData: tooltipPayload,
          tooltipLeft: finalTooltipLeft,
          tooltipTop: finalTooltipTop,
        });
      }
    } else {
      hideTooltip();
    }
  };

  useEffect(() => {
    if (largestXValueRef.current) {
      const maxWidth = (
        largestXValueRef.current as SVGTextElement
      ).getBoundingClientRect().width;

      setMaxXLabelWidth(maxWidth);
    }
  }, [largestXValueRef, chartData]);

  useEffect(() => {
    if (largestYValueRef.current) {
      const maxWidth = (
        largestYValueRef.current as SVGTextElement
      ).getBoundingClientRect().width;

      setMaxYLabelWidth(maxWidth);
    }
  }, [largestYValueRef, chartData]);

  const connectedScatterPlotChartData = isSeries
    ? chartData.map((d) => d.data).flat()
    : chartData[0]?.data;

  const allZero = useAllZeroEffect<ConnectedScatterPlotData>({
    chartData: connectedScatterPlotChartData || [],
    valueKey: 'yValue',
  });

  if (isLoading) {
    return (
      <ChartSkeleton
        height={height}
        width={width}
        margins={margin}
        animate
        type="connectedScatter"
        xLabel={xLabel !== undefined}
        yLabel={yLabel !== undefined}
        {...skeletonProps}
      />
    );
  }

  if (allZero) {
    return (
      <ConnectedScatterPlotNoDataSkeleton
        height={height}
        margins={margin}
        width={width}
        {...noDataSkeletonProps}
      />
    );
  }

  return (
    <div
      className={`${wrapperClassName} relative`}
      data-testid={dataTestId}
      ref={ref}
    >
      <svg width={width} height={height} ref={containerRef}>
        <Group left={margin.left} top={margin.top}>
          <defs>
            <pattern
              id="predictedStripesPattern"
              width="10"
              height="10"
              patternUnits="userSpaceOnUse"
              patternTransform="rotate(45)"
            >
              <rect
                x="0"
                y="0"
                width="1"
                height="10"
                fill="#FFFFFF"
                filter="url(#connected-scatter-plot=diagonal-shadow)"
              />
            </pattern>

            <filter
              id="connected-scatter-plot=diagonal-shadow"
              x="-50%"
              y="-50%"
              width="200%"
              height="200%"
            >
              <feDropShadow
                dx="0"
                dy="1"
                stdDeviation="0.5"
                floodColor="#000000"
                floodOpacity="0.07"
              />
            </filter>

            {/* Horizontal grid line pattern */}
            <pattern
              id="horizontal-grid-dash-pattern-csp"
              patternUnits="userSpaceOnUse"
              width="8"
              height="1"
            >
              <rect x="0" y="0" width="4" height="1" fill="#e0e0e0" />
            </pattern>

            {/* Vertical grid line pattern */}
            <pattern
              id="vertical-grid-dash-pattern-csp"
              patternUnits="userSpaceOnUse"
              width="1"
              height="8"
            >
              <rect x="0" y="0" width="1" height="4" fill="#e0e0e0" />
            </pattern>

            {/* Tooltip hover line pattern */}
            <pattern
              id="tooltip-line-dash-pattern-csp"
              patternUnits="userSpaceOnUse"
              width="1"
              height="4"
            >
              <rect x="0" y="0" width="1" height="2" fill="#323C4D" />
            </pattern>
          </defs>

          {processedChartData[0] &&
            processedChartData[0].connectionData?.length > 0 && (
              <>
                <rect
                  x={xScale(predictedAreaStartX)}
                  y={0}
                  width={innerWidth - xScale(predictedAreaStartX)}
                  height={innerHeight}
                  fill="#B7B7B71F"
                />
                <rect
                  x={xScale(predictedAreaStartX)}
                  y={0}
                  width={innerWidth - xScale(predictedAreaStartX)}
                  height={innerHeight}
                  fill="url(#predictedStripesPattern)"
                />
              </>
            )}

          {/* x axis */}
          <AxisBottom
            top={innerHeight}
            scale={xScale}
            label={!hideXAxisLabel ? xLabel : ''}
            hideTicks
            hideAxisLine
            numTicks={xAxisNumTicks}
            tickValues={nonIntervalXValues}
            labelClassName={
              !hideXAxisLabel ? 'label-small fill-text-text font-medium' : ''
            }
            hideZero={!showFirstBottomAxisValue}
            labelOffset={hideXAxisLabel ? 0 : OFFSET_WITH_X_AXIS}
            tickFormat={
              xAxisTickFormatter
                ? (value) => xAxisTickFormatter(Number(value))
                : undefined
            }
            tickComponent={renderXAxisTextComponent}
          />
          {/* y axis */}
          <AxisLeft
            hideTicks
            hideZero={hideYAxisZero}
            scale={yScale}
            labelOffset={
              !hideYAxisLabel && yLabel
                ? OFFSET_WITH_Y_AXIS + maxYLabelWidth
                : 0
            }
            label={!hideYAxisLabel && yLabel ? yLabel : ''}
            labelClassName="!label-small fill-text-text font-medium"
            strokeDasharray="4 4"
            left={0.2}
            numTicks={yAxisNumTicks}
            tickValues={yTicks}
            axisLineClassName="stroke-border-border"
            tickFormat={
              yAxisTickFormatter
                ? (value) => yAxisTickFormatter(Number(value))
                : undefined
            }
            tickComponent={renderYAxisTextComponent}
            hideAxisLine={hideGridColumns}
          />
          {/* x axis grids */}
          <GridRows
            scale={yScale}
            width={innerWidth}
            numTicks={yAxisNumTicks}
            tickValues={yTicks.filter((tick) => yScale(tick) !== yScale(0))}
          >
            {({ lines }) => (
              <>
                {lines.map((line, index) => {
                  const fromY = line?.from?.y ?? 0;
                  return (
                    <HorizontalGridLine
                      key={`horizontal-grid-line-${fromY ?? index}`}
                      yValue={fromY ?? 0}
                      devicePixelRatio={devicePixelRatio}
                      width={innerWidth}
                      dashPatternId="horizontal-grid-dash-pattern-csp"
                    />
                  );
                })}
              </>
            )}
          </GridRows>
          {/* Custom gridline for 0th y axis tick - Firefox compatibility */}
          <rect
            x={0}
            y={Math.round(innerHeight * devicePixelRatio) / devicePixelRatio}
            width={innerWidth}
            height={1 / devicePixelRatio}
            fill="rgba(208, 211, 216, 1)"
            shapeRendering="crispEdges"
          />
          {/* y axis grids */}
          {!hideGridColumns && (
            <GridColumns
              scale={xScale}
              height={innerHeight}
              numTicks={xAxisNumTicks}
              tickValues={nonIntervalXValues}
            >
              {({ lines }) => (
                <>
                  {lines.map((line, index) => {
                    const fromX = line?.from?.x ?? 0;
                    return (
                      <VerticalGridLine
                        index={index}
                        solidFillColor="transparent"
                        key={`vertical-grid-line-${fromX ?? index}`}
                        xValue={fromX ?? 0}
                        devicePixelRatio={devicePixelRatio}
                        height={innerHeight}
                        dashPatternId="vertical-grid-dash-pattern-csp"
                      />
                    );
                  })}
                </>
              )}
            </GridColumns>
          )}
          {processedChartData.map((s) => (
            <Fragment key={s.id}>
              {/* Actual data line (solid) */}
              {s.actualData.length > 0 && (
                <LinePath
                  data={s.actualData}
                  x={(d) => xScale(d.xValue)}
                  y={(d) => yScale(d.yValue)}
                  stroke={
                    isSeries ? s.scatterConnectionLineColor : scatterColor
                  }
                  strokeWidth={1}
                />
              )}

              {/* Prediction line (dashed) */}
              {s.connectionData.length > 0 && (
                <LinePath
                  data={s.connectionData.filter((d) => d !== undefined)}
                  x={(d) => xScale(d.xValue)}
                  y={(d) => yScale(d.yValue)}
                  stroke={
                    isSeries ? s.scatterConnectionLineColor : scatterColor
                  }
                  strokeWidth={1}
                  strokeDasharray="2 2"
                  opacity={0.4}
                />
              )}

              {/* Actual data scatter dots (filled) */}
              {s.actualData
                .filter((d) => !d.hasInterval)
                .map((d) => (
                  <Circle
                    key={`${s.id}-actual-${d.xValue}-${d.yValue}`}
                    cx={xScale(d.xValue)}
                    cy={yScale(d.yValue)}
                    r={scatterRadius}
                    fill={
                      (isSeries &&
                        (s.scatterDotVariant === 'filled'
                          ? lightenColor(
                              s.scatterDotColor,
                              1 - normalizeOpacity(s.scatterDotColorOpacity),
                            )
                          : '#ffffff')) ||
                      scatterColor
                    }
                    stroke={
                      s.scatterDotVariant === 'outlined'
                        ? lightenColor(
                            s.scatterDotColor,
                            1 - normalizeOpacity(s.scatterDotColorOpacity),
                          )
                        : 'none'
                    }
                    strokeWidth={s.scatterDotVariant === 'outlined' ? 2 : 0}
                  />
                ))}

              {/* Predicted data scatter dots (outlined/hollow) */}
              {s.predictedData
                .filter((d) => !d.hasInterval)
                .map((d) => (
                  <Circle
                    key={`${s.id}-predicted-${d.xValue}-${d.yValue}`}
                    cx={xScale(d.xValue)}
                    cy={yScale(d.yValue)}
                    r={scatterRadius}
                    fill={
                      (s.scatterDotVariant === 'filled'
                        ? lightenColor(
                            s.scatterDotColor,
                            1 -
                              normalizeOpacity(
                                s.scatterDotColorOpacity > 60 ? 40 : 24,
                              ),
                          )
                        : '#ffffff') || scatterColor
                    }
                    stroke={
                      s.scatterDotVariant === 'outlined'
                        ? lightenColor(
                            s.scatterDotColor,
                            1 - normalizeOpacity(40),
                          )
                        : 'none'
                    }
                    strokeWidth={s.scatterDotVariant === 'outlined' ? 2 : 0}
                  />
                ))}
            </Fragment>
          ))}
          <rect
            width={innerWidth}
            height={innerHeight}
            x={0}
            y={0}
            fill="transparent"
            onMouseEnter={forceRefreshBounds}
            onMouseMove={rectMouseLineHandler}
            onMouseLeave={() => {
              hideTooltip();
              setLastSnappedXValue(null);
            }}
          />
          {/* Tooltip hover line */}
          {showToolTip && tooltipLeft != null && (
            <rect
              x={Math.round(tooltipLeft * devicePixelRatio) / devicePixelRatio}
              y={0}
              width={1 / devicePixelRatio}
              height={innerHeight}
              fill="url('#tooltip-line-dash-pattern-csp')"
              pointerEvents="none"
              shapeRendering="crispEdges"
            />
          )}
        </Group>
      </svg>
      {showToolTip && tooltipData && (
        <TooltipInPortal
          left={(tooltipLeft ?? 0) + margin.left - TOOL_TIP_OFFSET}
          top={
            tooltipBehavior === 'sticky'
              ? (tooltipTop ?? 0) + margin.top
              : (tooltipTop ?? innerHeight / 2) + margin.top * 0.75
          }
          detectBounds={false}
          className="absolute w-fit !bg-transparent !shadow-none"
        >
          <div
            className={`
              ${toolTipComponentProps?.wrapperClassName ?? ''}
              bg-fill-fill border-border-dark-hover relative rounded-xl  border border-solid py-1 !shadow-[0px_4px_4px_0px_rgba(0,0,0,0.08)]
                ${!isChartSeries ? '!px-3' : 'pl-1 pr-3'}
            `}
          >
            {toolTipComponentProps?.customToolTipComponent ? (
              toolTipComponentProps.customToolTipComponent({
                currentToolTip: tooltipData,
              })
            ) : (
              <CustomToolTipComponent
                isSeries={isChartSeries}
                axisLeftTickFormatter={yAxisTickFormatter}
                axisBottomTickFormatter={xAxisTickFormatter}
                toolTipData={tooltipData}
              />
            )}
            <ToolTipLeftArrow
              className={`${toolTipComponentProps?.toolTipArrowClassName} absolute right-full top-1/2 -translate-y-1/2 `}
            />
          </div>
        </TooltipInPortal>
      )}
    </div>
  );
});
