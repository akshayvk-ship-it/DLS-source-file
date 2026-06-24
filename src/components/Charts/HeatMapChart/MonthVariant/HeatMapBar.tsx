/* eslint-disable import/prefer-default-export */
import { RectCell } from '@visx/heatmap/lib/heatmaps/HeatmapRect';
import { AxisScale, AxisTop, ComputedTick } from '@visx/axis';
import { Group } from '@visx/group';
import { HeatmapRect } from '@visx/heatmap';
import { scaleLinear, scaleThreshold } from '@visx/scale';
import { forwardRef, useEffect, useId, useMemo, useRef, useState } from 'react';
import { NumberValue } from '@visx/vendor/d3-scale';
import { Text } from '@visx/text';
import {
  HeatMapMonthTooltipData,
  MonthGroup,
  HeatMapMonthBins,
  HeatMapMonthChartData,
  HeatMapBarProps,
  TooltipMode,
  TooltipTrigger,
} from './types';
import { BinDataThreshold } from '../types';
import EmptyDataIcon from '../../Legends/EmptyDataIcon';
import { measureTextWidth } from '../helper';
import { extractMonthName, normalizeHeatMapMonthData } from './helper';
import { Legends } from '../../Legends';
import HeatMapMonthTooltip from './HeatMapMonthTooltip';
import { useScrollbarWidth } from '../../../hooks/useScrollbarWidth';

type ColorScale = (value: number | { valueOf(): number }) => string;

export const HeatMapBar = forwardRef<
  HTMLDivElement,
  Omit<HeatMapBarProps, 'chartData'>
>(
  (
    {
      wrapperClassName = '',
      tooltipContentWrapperClassName = '',
      tooltipWrapperClassName = '',
      xAxisLabelClassName = '',
      noDataLegendLabel = '0',
      noDataLegendDescription = 'No Data',
      nullLegendLabel = 'Null',
      nullLegendDescription = 'Unavailable',
      height,
      width,
      margins = {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
      },
      verticalGap = 0,
      colorPalette = [
        '#FDE4D6', // 0-20%
        '#FCD7C2', // 21-40%
        '#FBC9AE', // 41-60%
        '#F9BC99', // 61-80%
        '#F15701', // 81-100%
      ],
      horizontalGap = 2,
      groupGap = 4,
      enableMinBinWidth = false,
      binDataThreshold,
      legendsProps,
      heatMapMonthBinData,
      binHoverBorderColorClassName,
      onBinClick,
      dataTestId = 'heat-map-month-chart',
      highlightedLabels = [],
      enableSorting,
    },
    ref,
  ) => {
    const shadowUniqueId = useId();
    const heatMapBinRadius = 0;
    const [maxWidth, setMaxWidth] = useState(0);
    const [hoveredCell, setHoveredCell] = useState<{
      row: number;
      column: number;
    } | null>(null);
    const [isToolTipLoading, setIsToolTipLoading] = useState(false);
    const [tooltipCoordinates, setTooltipCoordinates] = useState<{
      x: number;
      y: number;
    }>({ x: 0, y: 0 });
    const [tooltipData, setTooltipData] =
      useState<HeatMapMonthTooltipData | null>(null);
    const tooltipRef = useRef<HTMLDivElement | null>(null);
    const [showToolTip, setShowToolTip] = useState(false);
    const [tooltipTrigger, setTooltipTrigger] = useState<TooltipTrigger>(null);
    const [tooltipMode, setTooltipMode] = useState<TooltipMode>('normal');

    const effectiveHorizontalGap = horizontalGap;

    const BIN_STROKE_WIDTH_OFFSET = 0.5;
    const effectiveVerticalGap = verticalGap + BIN_STROKE_WIDTH_OFFSET;
    const effectiveWeekRowGap = groupGap ?? effectiveVerticalGap;
    const topOffset = 28;

    const isBinHoverClassProvided = binHoverBorderColorClassName !== undefined;
    const defaultHoverStrokeColor = colorPalette[colorPalette.length - 1];

    // xMax: remaining width for the grid after reserving space for left labels and margins
    const xMax = width - maxWidth - margins.left - margins.right;

    const memorizedTooltipCoordinates = useMemo(
      () => ({ x: tooltipCoordinates.x, y: tooltipCoordinates.y }),
      [tooltipCoordinates.x, tooltipCoordinates.y],
    );

    // Sort custom thresholds if provided to support deterministic color lookup
    const sortedThresholds: BinDataThreshold[] = useMemo(
      () =>
        binDataThreshold?.slice().sort((a, b) => a.maxValue - b.maxValue) ?? [],
      [binDataThreshold],
    );

    /**
     * Normalize the incoming data to ensure all week ranges are present.
     * If any week ranges are missing, they will be added as null bins with count -1.
     */
    const normalizedHeatMapData = useMemo(
      () => normalizeHeatMapMonthData(heatMapMonthBinData, enableSorting),
      [enableSorting, heatMapMonthBinData],
    );

    /**
     * Pivot the normalized rows into a column-major dataset required by HeatmapRect:
     * - Each top-level entry describes a column with label and a list of row bins
     */
    const chartData: HeatMapMonthChartData[] = useMemo(
      () =>
        normalizedHeatMapData[0]?.bins
          ? normalizedHeatMapData[0].bins.map((_, colIndex) => ({
              label: normalizedHeatMapData[0]?.bins[colIndex]?.label ?? '',
              bins: normalizedHeatMapData.map((row) => ({
                count: row.bins[colIndex]?.count ?? 0,
                label: row.label ?? '',
              })),
            }))
          : [],
      [normalizedHeatMapData],
    );

    const xAxisLabel = chartData.map((d) => d.label);
    const yAxisLabel = useMemo(
      () => chartData[0]?.bins.map((d) => d.label) ?? [],
      [chartData],
    );

    const labelWidths = xAxisLabel.map((label) =>
      measureTextWidth(label, '!label-small !fill-text-light !font-medium'),
    );

    const maxTopAxisLabelWidth = Math.max(...labelWidths);
    /**
     * Build contiguous groups of rows that belong to the same month label.
     * Used to render collapsible group lines and dual labels (Month N / Name).
     */
    const monthGroups = useMemo(() => {
      const groups: MonthGroup[] = [];
      yAxisLabel.forEach((label, idx) => {
        const startPart = (label ?? '').split('-')[0] ?? '';
        const month =
          extractMonthName(startPart) || extractMonthName(label) || '';
        const last = groups[groups.length - 1];
        if (!last || last.label !== month) {
          groups.push({ label: month, startIndex: idx, endIndex: idx });
        } else {
          last.endIndex = idx;
        }
      });
      return groups;
    }, [yAxisLabel]);

    const numRows = yAxisLabel.length;
    const numGroups = monthGroups.length;

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        const target = event.target as Node;
        if (tooltipRef.current?.contains(target)) {
          return;
        }
        setTooltipData(null);
        setIsToolTipLoading(false);
        setShowToolTip(false);
        setTooltipTrigger(null);
      };

      const handleScroll = () => {
        setTooltipData(null);
        setIsToolTipLoading(false);
        setShowToolTip(false);
        setTooltipTrigger(null);
      };

      document.addEventListener('click', handleClickOutside);
      document.addEventListener('scroll', handleScroll, true);

      return () => {
        document.removeEventListener('click', handleClickOutside);
        document.removeEventListener('scroll', handleScroll, true);
      };
    }, []);

    useEffect(() => {
      const longestGroupWidth = Math.max(
        0,
        ...monthGroups.map((group, index) => {
          const monthTextWidth = measureTextWidth(
            `Month ${index + 1}`,
            '!label-small fill-text-light text-left',
          );
          const labelTextWidth = measureTextWidth(
            group.label,
            '!label-small fill-text-light text-left',
          );
          return Math.max(monthTextWidth, labelTextWidth);
        }),
      );
      const longestYAxisWidth = Math.max(
        0,
        ...yAxisLabel.map((label) =>
          measureTextWidth(label, '!label-small fill-text-light text-left'),
        ),
      );
      const longestTextWidth = Math.max(longestGroupWidth, longestYAxisWidth);
      setMaxWidth(longestTextWidth);
    }, [yAxisLabel, monthGroups]);

    const totalHorizontalGaps = (chartData.length - 1) * effectiveHorizontalGap;
    const binHeight = 14;

    const yScale = scaleLinear<number>({
      domain: [0, yAxisLabel.length],
      range: [
        0,
        yAxisLabel.length * (binHeight + effectiveVerticalGap) +
          (numGroups - 1) * effectiveWeekRowGap -
          8,
      ],
    });

    const binWidth = (xMax - totalHorizontalGaps) / chartData.length;

    const numBins = xAxisLabel.length;
    const finalBinWidth =
      maxTopAxisLabelWidth < binWidth ? binWidth : maxTopAxisLabelWidth * 1.3;

    const effectiveBinWidth = enableMinBinWidth ? finalBinWidth : binWidth;

    const finalxmax = xMax + (effectiveBinWidth - binWidth) * numBins;
    const xScale = scaleLinear<number>({
      domain: [0, xAxisLabel.length],
      range: [0, finalxmax],
    });

    const colorMax = Math.max(
      ...chartData.map((d) => Math.max(...d.bins.map((v) => v.count))),
    );

    const thresholds = [
      colorMax * 0.2,
      colorMax * 0.4,
      colorMax * 0.6,
      colorMax * 0.8,
    ];

    /**
     * Map a numeric value to a fill color for a heatmap cell.
     * Special cases:
     * - 0 => diagonal lines pattern (No Data)
     * - -1 => gray background (Null / placeholder rows)
     * Otherwise, resolve against provided thresholds or fallback to uniform threshold scale.
     */
    const rectColorScale: ColorScale = (
      value: number | { valueOf(): number },
    ) => {
      const numericValue = typeof value === 'number' ? value : value.valueOf();

      // No Data
      if (numericValue === 0) return 'url(#empty-bin-pattern)';
      // Null
      if (numericValue < 0) return '#EEEFF0';

      if (sortedThresholds && sortedThresholds.length > 0) {
        const match = sortedThresholds.find(
          (bin) => numericValue >= bin.minValue && numericValue <= bin.maxValue,
        );
        if (match) return match.color;
        if (numericValue < (sortedThresholds[0]?.minValue || 0))
          return sortedThresholds[0]?.color || '';
        if (
          numericValue >
          (sortedThresholds[sortedThresholds.length - 1]?.maxValue || 0)
        )
          return sortedThresholds[sortedThresholds.length - 1]?.color || '';
        return sortedThresholds[sortedThresholds.length - 1]?.color || '';
      }

      const thresholdScale = scaleThreshold<number, string>({
        domain: thresholds,
        range: colorPalette,
      });
      return thresholdScale(numericValue);
    };

    /**
     * For each row index, record which month-group it belongs to.
     * This powers y-offset calculations to add extra spacing between groups.
     */
    const groupIndexByRow = useMemo(() => {
      const map = Array.from({ length: numRows }, () => 0);
      monthGroups.forEach((g, gi) => {
        for (let i = g.startIndex; i <= g.endIndex; i += 1) {
          map[i] = gi;
        }
      });
      return map;
    }, [monthGroups, numRows]);

    /**
     * Cumulative y-offset per row to insert additional spacing when the month changes.
     */
    const yOffsets = useMemo((): number[] => {
      const offsets: number[] = Array.from({ length: numRows }, () => 0);
      let offset = 0;
      for (let i = 0; i < numRows; i += 1) {
        offsets[i] = offset;
        if (i < numRows - 1) {
          const currentGroup = groupIndexByRow[i];
          const nextGroup = groupIndexByRow[i + 1];
          offset +=
            nextGroup !== currentGroup
              ? effectiveWeekRowGap
              : effectiveVerticalGap;
        }
      }
      return offsets;
    }, [numRows, groupIndexByRow, effectiveWeekRowGap, effectiveVerticalGap]);

    const getYOffset = (rowIndex: number) => yOffsets[rowIndex] || 0;

    const chartLeft = margins.left + maxWidth;
    const chartTop = margins.top + topOffset;

    // Total SVG height including dynamic offsets and top padding
    const svgHeight =
      chartTop +
      yScale(yAxisLabel.length) +
      getYOffset(yAxisLabel.length - 1) +
      binHeight;

    const svgWidth = enableMinBinWidth
      ? width + numBins * (finalBinWidth - binWidth)
      : width;
    // BIN HOVER STATES
    const handleBinMouseEnter = (
      event: React.MouseEvent<SVGRectElement>,
      bin: RectCell<HeatMapMonthChartData, HeatMapMonthBins>,
    ) => {
      event.stopPropagation();

      setHoveredCell({
        row: bin.row,
        column: bin.column,
      });

      if (tooltipTrigger === 'click') return;

      setTooltipTrigger('hover');
      setTooltipMode('normal');

      const bounds = event.currentTarget.getBoundingClientRect();
      setTooltipCoordinates({
        x: bounds.left + bin.width / 2,
        y: bounds.top,
      });

      if (bin.bin.count === 0) {
        setTooltipMode('no-data');
        setShowToolTip(true);
        return;
      }

      if (bin.bin.count < 0) {
        setTooltipMode('null');
        setShowToolTip(true);
        return;
      }

      setTooltipData({
        title: bin.bin.label,
        subtitle: bin.datum.label,
      });
      setShowToolTip(true);
    };

    const handleBinMouseLeave = () => {
      setHoveredCell(null);
      if (tooltipTrigger === 'click') return;
      setTooltipData(null);
      setTooltipTrigger(null);
      setIsToolTipLoading(false);
      setShowToolTip(false);
      setTooltipMode('normal');
    };

    // BIN CLICK STATES
    const handleBinClick = async (
      event: React.MouseEvent<SVGRectElement>,
      bin: RectCell<HeatMapMonthChartData, HeatMapMonthBins>,
    ) => {
      event.stopPropagation();
      const bounds = event.currentTarget.getBoundingClientRect();
      setTooltipCoordinates({
        x: bounds.left + bin.width / 2,
        y: bounds.top,
      });

      if (bin.bin.count === 0) {
        setTooltipMode('no-data');
        setShowToolTip(true);
        return;
      }

      if (bin.bin.count < 0) {
        setTooltipMode('null');
        setShowToolTip(true);
        return;
      }

      setIsToolTipLoading(true);
      setShowToolTip(true);
      setTooltipTrigger('click');

      try {
        const response = await onBinClick({
          label: bin.datum.bins[bin.row]?.label ?? '',
          binLabel: bin.datum.label ?? '',
          binCount: bin.datum.bins[bin.row]?.count ?? 0,
        });
        if (response) {
          setTooltipData({
            title: response.title,
            subtitle: response.subtitle,
            bins: response.bins,
          });
        } else {
          setTooltipData(null);
          setShowToolTip(false);
          setTooltipTrigger(null);
          setTooltipMode('normal');
        }
        setIsToolTipLoading(false);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error fetching tooltip data: ', error);
        setTooltipData(null);
        setIsToolTipLoading(false);
        setShowToolTip(false);
        setTooltipTrigger(null);
        setTooltipMode('normal');
      }
    };

    const [legendHeight, setLegendHeight] = useState(0);
    const legendsRef = useRef<HTMLDivElement | null>(null);

    const isLegendsProps = !!legendsProps?.legendData;

    // Check if there is any zero or null data in the chart data. Use for legend data.
    const { hasZeroData, hasNullData } = useMemo(() => {
      let zeroFound = false;
      let nullFound = false;

      normalizedHeatMapData.some((row) =>
        row.bins.some((bin) => {
          if (bin.count === 0) zeroFound = true;
          if (bin.count < 0) nullFound = true;
          return zeroFound && nullFound;
        }),
      );

      return { hasZeroData: zeroFound, hasNullData: nullFound };
    }, [normalizedHeatMapData]);

    const legendData = useMemo(() => {
      const legends = [...(legendsProps?.legendData ?? [])];
      if (hasZeroData) {
        legends.push({
          label: noDataLegendLabel,
          description: noDataLegendDescription,
          customLegendIcon: <EmptyDataIcon />,
        });
      }
      if (hasNullData) {
        legends.push({
          label: nullLegendLabel,
          description: nullLegendDescription,
          color: '#EEEFF0',
        });
      }
      return legends;
    }, [
      legendsProps?.legendData,
      hasZeroData,
      hasNullData,
      noDataLegendLabel,
      noDataLegendDescription,
      nullLegendLabel,
      nullLegendDescription,
    ]);

    const scrollbarWidth = useScrollbarWidth();

    const scrollContainerHeight =
      height -
      margins.top -
      margins.bottom -
      legendHeight -
      (isLegendsProps ? 16 : 0);

    const isChartContainerOverflowing = svgHeight > scrollContainerHeight;

    const renderLinearLegend = isLegendsProps ? (
      <Legends
        {...legendsProps}
        ref={legendsRef}
        wrapperClassName={`${legendsProps.wrapperClassName}  bg-fill-fill`}
        isOutlined
        isSelectable={false}
        legendType="linear"
        descriptionClassName={`${legendsProps.descriptionClassName} !font-normal !text-text-light`}
        labelTextClassName={`${legendsProps.labelTextClassName} !font-medium`}
        legendData={legendData}
      />
    ) : null;

    useEffect(() => {
      if (isLegendsProps && legendsRef.current) {
        const observer = new ResizeObserver(() => {
          if (legendsRef.current) {
            setLegendHeight(legendsRef.current.getBoundingClientRect().height);
          }
        });

        observer.observe(legendsRef.current);

        return () => {
          observer.disconnect();
        };
      }

      setLegendHeight(0);
      return () => {};
    }, [isLegendsProps]);

    const TOP_AXIS_HEIGHT = 32;

    const topAxis = (
      <svg
        width={svgWidth}
        height={TOP_AXIS_HEIGHT}
        className={!enableMinBinWidth ? 'overflow-visible' : ''}
      >
        <Group top={chartTop}>
          <AxisTop
            scale={xScale}
            hideTicks
            hideAxisLine
            left={chartLeft}
            tickValues={Array.from({ length: xAxisLabel.length }, (_, i) => i)}
            tickLabelProps={(_, index, tickProps) => {
              const tickValues = tickProps as ComputedTick<AxisScale>[];

              const formattedValue = tickValues[index]?.formattedValue || '';

              const isHighlightedValue =
                highlightedLabels &&
                highlightedLabels.length &&
                formattedValue &&
                highlightedLabels.includes(formattedValue.toString());

              return {
                className: `${xAxisLabelClassName} !label-small fill-text-light font-medium 
        ${isHighlightedValue ? '!font-semibold !fill-text-text' : ''}
        `,
                textAnchor: 'middle',
                dx: `${(effectiveBinWidth + effectiveHorizontalGap) / 2.3}px`,
              };
            }}
            tickFormat={(value: NumberValue) =>
              typeof value === 'number' ? (xAxisLabel[value] as string) : ''
            }
          />
        </Group>
      </svg>
    );

    const heatMapChart = (
      <svg
        width={svgWidth}
        height={svgHeight - TOP_AXIS_HEIGHT}
        style={{ overflow: 'visible' }}
      >
        <defs>
          <pattern
            id="empty-bin-pattern"
            width="4"
            height="4"
            patternUnits="userSpaceOnUse"
          >
            <rect width="4" height="4" fill="#FFF" />
            <path
              d="M-1,1 l2,-2 M0,4 l4,-4 M3,5 l2,-2"
              stroke="#E1E2E4"
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <Group left={chartLeft}>
          <HeatmapRect<HeatMapMonthChartData, HeatMapMonthBins>
            data={chartData}
            xScale={(d) => xScale(d) ?? 0}
            yScale={(rowIndex) =>
              (yScale(rowIndex) ?? 0) + getYOffset(rowIndex)
            }
            binWidth={effectiveBinWidth}
            binHeight={binHeight}
            colorScale={rectColorScale}
            gap={effectiveHorizontalGap}
          >
            {(heatmap) =>
              heatmap.map((heatmapBins) =>
                heatmapBins.map((bin) => {
                  const isHovered =
                    hoveredCell?.row === bin.row &&
                    hoveredCell?.column === bin.column;

                  const isEmptyBin = bin.bin.count === 0;
                  const isNullBin = bin.bin.count < 0;
                  let strokeColor = bin.color;
                  if (isEmptyBin) {
                    strokeColor = '#E1E2E4';
                  } else if (isNullBin) {
                    strokeColor = '#EEEFF0';
                  }

                  const getBinStrokeColor = () => {
                    if (!isBinHoverClassProvided) {
                      return isHovered && !isEmptyBin && !isNullBin
                        ? defaultHoverStrokeColor
                        : strokeColor;
                    }

                    return isHovered && !isEmptyBin && !isNullBin
                      ? undefined
                      : strokeColor;
                  };

                  return (
                    <rect
                      key={`heatmap-rect-${bin.row}-${bin.column}`}
                      width={bin.width}
                      height={bin.height}
                      x={bin.x}
                      y={bin.y}
                      stroke={getBinStrokeColor()}
                      strokeWidth={1}
                      onMouseEnter={(event) => {
                        handleBinMouseEnter(event, bin);
                      }}
                      onMouseLeave={handleBinMouseLeave}
                      onClick={(event) => {
                        handleBinClick(event, bin).catch(() => {});
                      }}
                      fill={bin.color}
                      fillOpacity={bin.opacity}
                      rx={heatMapBinRadius}
                      ry={heatMapBinRadius}
                      style={{
                        cursor:
                          !isEmptyBin && !isNullBin ? 'pointer' : 'default',
                        transition: 'stroke 0.2s ease',
                      }}
                      filter={
                        isHovered && !isNullBin
                          ? `url(#heatmap-month-hover-${shadowUniqueId}-shadow)`
                          : undefined
                      }
                      className={
                        (isBinHoverClassProvided ||
                          defaultHoverStrokeColor === '#F15701') &&
                        isHovered &&
                        !isEmptyBin &&
                        !isNullBin
                          ? (binHoverBorderColorClassName ??
                            'stroke-fill-action')
                          : ''
                      }
                    />
                  );
                }),
              )
            }
          </HeatmapRect>
          <defs>
            <filter
              id={`heatmap-month-hover-${shadowUniqueId}-shadow`}
              x="-20%"
              y="-20%"
              width="150%"
              height="150%"
            >
              <feDropShadow
                dx="0"
                dy="2"
                stdDeviation="1.5"
                floodColor="#000000"
                floodOpacity="0.16"
              />
            </filter>
          </defs>
        </Group>
        <Group left={margins.left}>
          {monthGroups.map((group, groupIndex) => {
            const rowIndex = group.startIndex;
            const lastRowIndex = group.endIndex;
            const primaryLabel = `Month ${groupIndex + 1}`;
            const secondaryLabel = group.label;

            const startY = yScale(rowIndex) + getYOffset(rowIndex);
            const endY =
              yScale(lastRowIndex) + getYOffset(lastRowIndex) + binHeight;

            const minLineHeight = binHeight * 4;
            const actualLineHeight = endY - startY;
            const lineHeight = Math.max(actualLineHeight, minLineHeight);
            const adjustedEndY = startY + lineHeight;
            const centerY = startY + lineHeight / 2;

            const lineX = maxWidth - 10;

            return (
              // eslint-disable-next-line react/no-array-index-key
              <g key={`y-label-${groupIndex}`}>
                <line
                  x1={lineX}
                  x2={lineX}
                  y1={yScale(rowIndex) + getYOffset(rowIndex) + 2}
                  y2={adjustedEndY}
                  stroke="#d3d3d3"
                  strokeLinecap="butt"
                  strokeWidth={1}
                  className="fill-border-border"
                />
                <g transform={`translate(0, ${centerY})`}>
                  <Text
                    x={lineX - 8}
                    y={-2}
                    textAnchor="end"
                    verticalAnchor="end"
                    className="!label-medium !fill-text-text text-left font-medium"
                    fill="#3B475B"
                  >
                    {primaryLabel}
                  </Text>
                  <Text
                    x={lineX - 8}
                    y={10}
                    textAnchor="end"
                    verticalAnchor="start"
                    className="!label-small fill-text-light text-left font-medium"
                  >
                    {secondaryLabel}
                  </Text>
                </g>
              </g>
            );
          })}
        </Group>
      </svg>
    );

    return (
      <div
        className="relative box-border"
        style={{
          height: `${height}px`,
          paddingBottom: `${legendHeight + (isLegendsProps ? 16 : 0)}px`,
        }}
      >
        <div
          className={`${wrapperClassName} relative flex items-start gap-10`}
          data-testid={dataTestId}
          ref={ref}
          style={{
            height: `${height - legendHeight - (isLegendsProps ? 16 : 0)}px`,
          }}
        >
          <div className="relative" style={{ width }}>
            {enableMinBinWidth ? (
              <div
                className="overflow-x-auto overflow-y-auto"
                style={{
                  position: 'absolute',
                  top: margins.top,
                  width:
                    width -
                    margins.right +
                    (isChartContainerOverflowing ? scrollbarWidth : 0),
                  height: scrollContainerHeight,
                }}
              >
                <div className="bg-fill-fill sticky top-0 min-w-max">
                  {topAxis}
                </div>
                {heatMapChart}
              </div>
            ) : (
              <>
                {topAxis}
                <div
                  className="overflow-y-auto overflow-x-hidden"
                  style={{
                    position: 'absolute',
                    top: margins.top + TOP_AXIS_HEIGHT,
                    width: width - margins.right,
                    height: scrollContainerHeight - TOP_AXIS_HEIGHT,
                  }}
                >
                  {heatMapChart}
                </div>
              </>
            )}
          </div>

          {(isToolTipLoading || tooltipData || tooltipMode) &&
            showToolTip &&
            tooltipTrigger && (
              <HeatMapMonthTooltip
                ref={tooltipRef}
                isLoading={isToolTipLoading}
                coordinates={memorizedTooltipCoordinates}
                tooltipData={tooltipData}
                colorPalette={colorPalette}
                miniBinThresholds={sortedThresholds}
                tooltipWrapperClassName={tooltipWrapperClassName}
                tooltipContentWrapperClassName={tooltipContentWrapperClassName}
                tooltipTrigger={tooltipTrigger}
                tooltipMode={tooltipMode}
                noDataLegendDescription={noDataLegendDescription}
              />
            )}
        </div>
        <div className="bg-fill-fill absolute mt-4 flex w-full items-start justify-center">
          {renderLinearLegend}
        </div>
      </div>
    );
  },
);
