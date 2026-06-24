import {
  AxisLeft,
  AxisScale,
  AxisTop,
  ComputedTick,
  TickRendererProps,
} from '@visx/axis';
import { Group } from '@visx/group';
import { HeatmapRect } from '@visx/heatmap';
import { scaleLinear, scaleThreshold } from '@visx/scale';
import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';
import { NumberValue } from '@visx/vendor/d3-scale';
import { Text } from '@visx/text';
import { RectCell } from '@visx/heatmap/lib/heatmaps/HeatmapRect';
import { InfoChip } from '../../../Chips';
import {
  BinDataThreshold,
  Bins,
  HeatMapChartData,
  PartialExcept,
  TooltipData,
} from '../types';

import { useScrollbarWidth } from '../../../hooks/useScrollbarWidth';
import { LinearLegendProps } from '../../Legends/LinearLegend';
import { Legends } from '../../Legends';
import EmptyDataIcon from '../../Legends/EmptyDataIcon';
import {
  normalizeHeatMapBarData,
  measureTextWidth,
  getFullMonthNameFromString,
} from '../helper';
import { heatMapMargins } from './constants';

export interface HeatMapMargins {
  top?: number;
  left?: number;
  right?: number;
  bottom?: number;
}

type ColorScale = (value: number | { valueOf(): number }) => string;

export interface HeatMapBarProps {
  height: number;
  enableMinBinWidth?: boolean;
  width: number;
  wrapperClassName?: string;
  dataTestId?: string;
  margins: HeatMapMargins;
  legendsProps?: PartialExcept<
    Omit<LinearLegendProps, 'isOutlined' | 'isSelectable' | 'legendType'>,
    'legendData'
  >;
  horizontalGap?: number;
  verticalGap?: number;
  rowGroupSize?: number;
  heatMapChartData: HeatMapChartData[];
  variant?: 'horizontal' | 'vertical';
  colorArray: string[];
  heatMapGap?: number;
  groupGap?: number;
  binDataThreshold?: BinDataThreshold[];
  spanLabelsAcrossGroups?: boolean;
  heatMapBinRadius?: number;
  tooltipValueFormatter?: (value: number) => string;
  highlightedLabels?: string[];
  tooltipTopMargin?: number;
  showLegend?: boolean;
  noDataLegendLabel?: string;
  noDataLegendDescription?: string;
  nullLegendLabel?: string;
  nullLegendDescription?: string;
  tooltipLabelClassName?: string;
  binHoverBorderColorClassName?: string;
}

function DefaultYAxisTick({ x, y, formattedValue }: TickRendererProps) {
  return (
    <Text
      x={x}
      y={y}
      textAnchor="end"
      verticalAnchor="middle"
      className="!label-small fill-text-light text-left"
    >
      {formattedValue}
    </Text>
  );
}

export const HeatMapBar = forwardRef<HTMLDivElement, HeatMapBarProps>(
  (
    {
      height,
      width,
      wrapperClassName = '',
      margins = heatMapMargins,
      heatMapChartData,
      colorArray,
      enableMinBinWidth = false,
      horizontalGap,
      rowGroupSize,
      verticalGap,
      spanLabelsAcrossGroups = false,
      variant = 'horizontal',
      heatMapGap = 4,
      groupGap,
      legendsProps,
      binDataThreshold,
      heatMapBinRadius = 6,
      dataTestId = 'heat-map-chart',
      tooltipValueFormatter,
      highlightedLabels = [],
      tooltipTopMargin,
      noDataLegendLabel = '0',
      noDataLegendDescription = 'No Data',
      nullLegendLabel = 'Null',
      nullLegendDescription = 'Unavailable',
      tooltipLabelClassName = '',
      binHoverBorderColorClassName,
    },
    ref,
  ) => {
    const shadowUniqueId = useId();
    const [maxWidth, setMaxWidth] = useState(0);
    const [hoveredCell, setHoveredCell] = useState<{
      row: number;
      column: number;
    } | null>(null);

    const [tooltipData, setTooltipData] = useState<TooltipData | null>(null);

    const effectiveHorizontalGap = horizontalGap ?? heatMapGap;
    const effectiveVerticalGap = verticalGap ?? heatMapGap;
    const effectiveWeekRowGap = groupGap ?? effectiveVerticalGap;
    const tooltipRef = useRef<HTMLDivElement | null>(null);
    const isBinHoverClassProvided = binHoverBorderColorClassName !== undefined;
    const sortedThresholds: BinDataThreshold[] = useMemo(
      () =>
        binDataThreshold?.slice().sort((a, b) => a.maxValue - b.maxValue) ?? [],
      [binDataThreshold],
    );

    const xMax =
      width - (margins.left ?? 0) - (margins.right ?? 0) - maxWidth - 10;

    /**
     * Normalize the incoming data to ensure all weeks are complete (7 days each).
     * If the last week is incomplete, missing days are added as null bins with count -1.
     */
    const normalizedHeatMapData = useMemo(
      () => normalizeHeatMapBarData(heatMapChartData),
      [heatMapChartData],
    );

    const horizontalMapChartData = useMemo(
      () =>
        normalizedHeatMapData[0]?.bins
          ? normalizedHeatMapData[0].bins.map((_, colIndex) => ({
              label: normalizedHeatMapData[0]?.bins[colIndex]?.label ?? '',
              bins: normalizedHeatMapData.map((row) => ({
                count: row.bins[colIndex]?.count ?? 0,
                label: row.label ?? '',
                tooltipElement: row.bins[colIndex]?.tooltipElement ?? undefined,
              })),
            }))
          : [],
      [normalizedHeatMapData],
    );

    const dataSource: HeatMapChartData[] = useMemo(
      () =>
        variant === 'vertical' ? normalizedHeatMapData : horizontalMapChartData,
      [variant, normalizedHeatMapData, horizontalMapChartData],
    );

    const xAxisLabel = dataSource.map((d) => d.label);
    const yAxisLabel = useMemo(
      () => dataSource[0]?.bins.map((d) => d.label) ?? [],
      [dataSource],
    );
    const numRows = yAxisLabel.length;
    const rowsPerWeek = rowGroupSize ?? 7;
    const numWeeks = Math.ceil(numRows / rowsPerWeek);

    const labelWidths = xAxisLabel.map((label) =>
      measureTextWidth(label, '!label-small !fill-text-light !font-medium'),
    );
    const maxTopAxisLabelWidth = Math.max(...labelWidths);

    useEffect(() => {
      // Calculate maximum width across all weeks
      let maxLabelWidth = 0;
      Array.from({ length: numWeeks }, (_, weekIndex) => {
        const rowIndex = weekIndex * rowsPerWeek;
        const rowsInGroup = Math.min(rowsPerWeek, numRows - rowIndex);
        const lastRowIndex = rowIndex + rowsInGroup - 1;
        const weekLabel = `Week ${weekIndex + 1}`;
        const firstLabel = yAxisLabel[rowIndex] ?? '';
        const lastLabel = yAxisLabel[lastRowIndex] ?? '';
        const rangeLabel =
          firstLabel && lastLabel ? `${firstLabel} - ${lastLabel}` : '';

        const weekLabelWidth = measureTextWidth(
          weekLabel,
          '!label-medium !fill-text-text !text-left !font-medium',
        );
        const rangeLabelWidth = measureTextWidth(
          rangeLabel,
          '!label-small !fill-text-light !text-left !font-medium',
        );

        const totalWidth = Math.max(weekLabelWidth, rangeLabelWidth);
        maxLabelWidth = Math.max(maxLabelWidth, totalWidth);
        return maxLabelWidth;
      });

      setMaxWidth(maxLabelWidth + 25);
    }, [numWeeks, rowsPerWeek, numRows, yAxisLabel]);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        const target = event.target as Node;
        if (tooltipRef.current?.contains(target)) {
          return;
        }
        setTooltipData(null);
      };

      const handleScroll = () => {
        setTooltipData(null);
      };

      const handleResize = () => {
        setTooltipData(null);
      };

      document.addEventListener('click', handleClickOutside);
      document.addEventListener('scroll', handleScroll, true);
      window.addEventListener('resize', handleResize);

      return () => {
        document.removeEventListener('click', handleClickOutside);
        document.removeEventListener('scroll', handleScroll, true);
        window.removeEventListener('resize', handleResize);
      };
    }, []);

    const tooltipStyle = useMemo(
      () => ({
        top: tooltipTopMargin ?? 0 + (tooltipData ? tooltipData.y - 15 : 0),
        left: tooltipData ? tooltipData.x : 0,
        pointerEvents: 'none' as const,
      }),
      [tooltipData, tooltipTopMargin],
    );

    const totalHorizontalGaps =
      (dataSource.length - 1) * effectiveHorizontalGap;

    const binHeight = 10;
    const numBins = xAxisLabel.length;

    const fullRows = Math.ceil(yAxisLabel.length / rowsPerWeek) * rowsPerWeek;

    const yScale = scaleLinear<number>({
      domain: [0, fullRows],
      range: [
        0,
        fullRows * (binHeight + effectiveVerticalGap) +
          (numWeeks - 1) * effectiveWeekRowGap -
          8,
      ],
    });

    const binWidth =
      dataSource.length !== 0
        ? (xMax - totalHorizontalGaps) / dataSource.length
        : 0;

    const finalBinWidth =
      maxTopAxisLabelWidth < binWidth ? binWidth : maxTopAxisLabelWidth * 1.3;

    const effectiveBinWidth = enableMinBinWidth ? finalBinWidth : binWidth;

    const finalxmax = xMax + (effectiveBinWidth - binWidth) * numBins;

    const xScale = scaleLinear<number>({
      domain: [0, xAxisLabel.length],
      range: [0, finalxmax],
    });

    const colorMax = useMemo(
      () =>
        Math.max(
          ...dataSource.map((d) => Math.max(...d.bins.map((v) => v.count))),
        ),
      [dataSource],
    );

    const textArray = useMemo(
      () => [
        'Very Low', // 0-20%
        'Low', // 21-40%
        'Medium', // 41-60%
        'High', // 61-80%
        'Very High', // 81-100%
      ],
      [],
    );
    const thresholds = useMemo(
      () => [
        colorMax * 0.2, // 20%
        colorMax * 0.4, // 40%
        colorMax * 0.6, // 60%
        colorMax * 0.8, // 80%
      ],
      [colorMax],
    );

    const rectColorScale = useCallback<ColorScale>(
      (value: number | { valueOf(): number }) => {
        const numericValue =
          typeof value === 'number' ? value : value.valueOf();

        // No Data
        if (numericValue === 0) return 'url(#empty-bin-pattern)';
        // Null
        if (numericValue < 0) return '#EEEFF0';

        if (sortedThresholds && sortedThresholds.length > 0) {
          const match = sortedThresholds.find(
            (bin) =>
              numericValue >= bin.minValue && numericValue <= bin.maxValue,
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
          range: colorArray,
        });
        return thresholdScale(numericValue);
      },
      [thresholds, colorArray, sortedThresholds],
    );

    const rectTextScale = useCallback(
      (value: number | { valueOf(): number }) => {
        const numericValue =
          typeof value === 'number' ? value : value.valueOf();

        if (sortedThresholds && sortedThresholds.length > 0) {
          if (numericValue < (sortedThresholds[0]?.minValue || 0)) {
            return sortedThresholds[0]?.tooltipLabel || '';
          }

          if (
            numericValue >
            (sortedThresholds[sortedThresholds.length - 1]?.maxValue || 0)
          ) {
            return sortedThresholds[sortedThresholds.length - 1]?.tooltipLabel;
          }

          const match = sortedThresholds.find(
            (bin) =>
              numericValue >= bin?.minValue && numericValue <= bin?.maxValue,
          );

          return match?.tooltipLabel ?? 'N/A';
        }

        const thresholdScale = scaleThreshold<number, string>({
          domain: thresholds,
          range: textArray,
        });
        return thresholdScale(numericValue);
      },
      [thresholds, textArray, sortedThresholds],
    );

    const yOffsets = useMemo((): number[] => {
      const offsets: number[] = Array.from({ length: fullRows }, () => 0);
      let offset = 0;
      for (let i = 0; i < fullRows; i += 1) {
        offsets[i] = offset;
        if (i < fullRows - 1) {
          offset +=
            (i + 1) % rowsPerWeek === 0
              ? effectiveWeekRowGap
              : effectiveVerticalGap;
        }
      }
      return offsets;
    }, [fullRows, rowsPerWeek, effectiveWeekRowGap, effectiveVerticalGap]);

    const getYOffset = useCallback(
      (rowIndex: number) => yOffsets[rowIndex] || 0,
      [yOffsets],
    );

    const adjustedMargins = {
      ...margins,
      left: (margins.left ?? 0) + maxWidth,
    };

    const getTooltipData = (tooltipValue: number) => {
      const value = Number(tooltipValue);

      if (Number.isNaN(value)) return '';

      return tooltipValueFormatter?.(value) || value.toFixed(2);
    };

    // BIN HOVER STATES
    const handleBinMouseEnter = (
      event: React.MouseEvent<SVGRectElement>,
      bin: RectCell<HeatMapChartData, Bins>,
    ) => {
      event.stopPropagation();
      setHoveredCell({
        row: bin.row,
        column: bin.column,
      });
    };

    const handleBinMouseLeave = () => {
      setHoveredCell(null);
    };

    const handleBinClick = (
      event: React.MouseEvent<SVGRectElement>,
      bin: RectCell<HeatMapChartData, Bins>,
    ) => {
      event.stopPropagation();

      const bounds = event.currentTarget.getBoundingClientRect();
      const { count } = bin.bin;
      const isNoData = count === 0;
      const isNull = count < 0;

      const baseTooltip = {
        x: bounds.left + bin.width / 2,
        y: bounds.top,
        labelRow: '',
        labelColumn: '',
        color: '',
        value: 0,
        row: 0,
        textValue: '',
        element: undefined,
        col: 0,
      };

      if (isNoData || isNull) {
        setTooltipData({
          ...baseTooltip,
          mode: isNoData ? 'no-data' : 'null',
        });
        return;
      }

      setTooltipData({
        ...baseTooltip,
        labelRow: bin.datum.label,
        labelColumn: bin.datum.bins?.[bin.row]?.label ?? '',
        color: rectColorScale(count ?? 0),
        value: count ?? 0,
        row: bin.row,
        textValue: rectTextScale(count ?? 0) || 'N/A',
        element: bin.datum.bins?.[bin.row]?.tooltipElement ?? undefined,
        col: bin.column,
        mode: 'normal',
      });
    };

    const svgHeight = yScale(fullRows) + getYOffset(fullRows - 1) + binHeight;
    const svgWidth = enableMinBinWidth
      ? width + numBins * (finalBinWidth - binWidth)
      : width;

    const [legendHeight, setLegendHeight] = useState(0);
    const legendsRef = useRef<HTMLDivElement | null>(null);

    // Check if there is any zero or null data in the chart data. Use for legend data.
    const { hasZeroData, hasNullData } = useMemo(() => {
      let zeroFound = false;
      let nullFound = false;
      // TODO: Change to normalizedHeatMapData
      dataSource.some((row) =>
        row.bins.some((bin) => {
          if (bin.count === 0) zeroFound = true;
          if (bin.count < 0) nullFound = true;
          return zeroFound && nullFound;
        }),
      );

      return { hasZeroData: zeroFound, hasNullData: nullFound };
    }, [dataSource]);

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

    const isLegendsProps = !!legendsProps?.legendData;

    const scrollbarWidth = useScrollbarWidth();

    const scrollContainerHeight =
      height -
      adjustedMargins.top! -
      adjustedMargins.bottom! -
      legendHeight -
      (isLegendsProps ? 16 : 0);

    const topAxisHeight = 32;
    const chartContainerHeight = svgHeight + topAxisHeight;
    const isChartContainerOverflowing =
      chartContainerHeight > scrollContainerHeight;

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

    const tooltipWrapper = (children: React.ReactNode) => (
      <div className="bg-fill-fill absolute -bottom-1.5 right-1/2 flex min-w-[120px] max-w-[300px] translate-x-1/2 items-center justify-center rounded-md p-2 shadow-[0px_5px_3px_1px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(27,32,41,0.06),0px_-1px_2px_0px_rgba(0,0,0,0.08)]">
        <span className="bg-fill-fill border-fill-fill absolute -bottom-1.5 right-1/2 -z-10 h-3 w-3 translate-x-1/2 rotate-[45deg] border-b border-r" />
        {children}
      </div>
    );

    const mainTooltipContent = (
      <div className="flex flex-col items-center justify-center gap-1">
        <span
          className={`heading-5-semibold text-text-action ${tooltipLabelClassName}`}
        >
          {getTooltipData(tooltipData?.value ?? 0)}
        </span>
        <InfoChip
          showCloseIcon={false}
          wrapperClassName="!px-1.5 !h-4 !flex w-fit !justify-center !border !border-border-border-light !rounded-3xl !bg-fill-fill"
          prefixElement={
            <div
              className="h-2 w-2 rounded-full"
              style={{
                backgroundColor: tooltipData?.color || '#000000',
              }}
            />
          }
          textClassName="!label-extra-small !text-text-light !font-normal"
          text={tooltipData?.textValue || ''}
        />
        <span className="!label-extra-small !text-text-light">
          {tooltipData?.labelRow || ''},{' '}
          {getFullMonthNameFromString(tooltipData?.labelColumn || '')}
        </span>
      </div>
    );

    const noDataTooltipContent = (
      <div className=" flex min-w-[7.438rem] flex-col items-center justify-center px-9 py-3">
        <span className="paragraph-extra-small text-text-text whitespace-nowrap">
          {noDataLegendDescription}
        </span>
      </div>
    );

    const renderTooltipContent = () => {
      if (!tooltipData || tooltipData.mode === 'null') return null;

      if (tooltipData.mode === 'no-data') {
        return tooltipWrapper(noDataTooltipContent);
      }

      return tooltipWrapper(mainTooltipContent);
    };

    const topAxis = (
      <svg
        width={svgWidth}
        height={32}
        className={!enableMinBinWidth ? 'overflow-visible' : ''}
      >
        <Group top={adjustedMargins.top! + 28}>
          <AxisTop
            scale={xScale}
            hideTicks
            hideAxisLine
            left={adjustedMargins.left ?? 0}
            tickValues={Array.from({ length: xAxisLabel.length }, (_, i) => i)}
            tickLabelProps={(_, index, tickProps) => {
              const tickValues = tickProps as ComputedTick<AxisScale>[];

              const formattedValue = tickValues[index]?.formattedValue || '';

              const isHighlightedValue =
                highlightedLabels?.length &&
                formattedValue &&
                highlightedLabels.includes(formattedValue.toString());

              return {
                className: `!label-small fill-text-light  ${isHighlightedValue ? '!font-semibold !fill-text-light' : 'font-medium'}`,
                textAnchor: 'middle',
                dx: `${(effectiveBinWidth + effectiveHorizontalGap) / 1.75}px`,
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
        height={svgHeight}
        className={!enableMinBinWidth ? 'overflow-visible' : ''}
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
        <Group>
          <Group left={adjustedMargins.left + 10}>
            <HeatmapRect<HeatMapChartData, Bins>
              data={dataSource}
              xScale={(d) => xScale(d) ?? 0}
              yScale={(rowIndex) =>
                (yScale(rowIndex) ?? 0) + getYOffset(rowIndex)
              }
              left={adjustedMargins.left + 10}
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

                    const defaultHoverStrokeColor =
                      colorArray[colorArray.length - 1];

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

                    const getStrokeClassName = () => {
                      if (
                        (isBinHoverClassProvided ||
                          defaultHoverStrokeColor === '#f15701') &&
                        isHovered &&
                        !isEmptyBin &&
                        !isNullBin
                      ) {
                        return (
                          binHoverBorderColorClassName ?? 'stroke-fill-action'
                        );
                      }
                      return '';
                    };

                    return (
                      <rect
                        key={`heatmap-week-rect-${bin.row}-${bin.column}`}
                        width={bin.width}
                        height={bin.height}
                        x={bin.x}
                        y={bin.y}
                        onClick={(e) => {
                          handleBinClick(e, bin);
                        }}
                        fill={bin.color}
                        fillOpacity={bin.opacity}
                        stroke={getBinStrokeColor()}
                        className={getStrokeClassName()}
                        strokeWidth={1}
                        style={{
                          cursor:
                            !isEmptyBin && !isNullBin ? 'pointer' : 'default',
                          transition: 'stroke 0.2s ease',
                        }}
                        onMouseEnter={(event) => {
                          handleBinMouseEnter(event, bin);
                        }}
                        onMouseLeave={handleBinMouseLeave}
                        rx={heatMapBinRadius}
                        ry={heatMapBinRadius}
                        filter={
                          isHovered && !isNullBin
                            ? `url(#heatmap-week-hover-${shadowUniqueId}-shadow)`
                            : undefined
                        }
                      />
                    );
                  }),
                )
              }
            </HeatmapRect>
            <defs>
              <filter
                id={`heatmap-week-hover-${shadowUniqueId}-shadow`}
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

          {spanLabelsAcrossGroups ? (
            <Group left={(margins.left ?? 0) + 5}>
              {Array.from({ length: numWeeks }, (_, weekIndex) => {
                const rowIndex = weekIndex * rowsPerWeek;
                const rowsInGroup = rowsPerWeek;
                const lastRowIndex = Math.min(
                  rowIndex + rowsInGroup - 1,
                  numRows - 1,
                );
                const weekLabel = `Week ${weekIndex + 1}`;
                const firstLabel = yAxisLabel[rowIndex] ?? '';
                const lastLabel = yAxisLabel[lastRowIndex] ?? '';
                const rangeLabel =
                  firstLabel && lastLabel ? `${firstLabel} - ${lastLabel}` : '';
                const startY = yScale(rowIndex) + getYOffset(rowIndex);
                const endY =
                  yScale(rowIndex + rowsPerWeek - 1) +
                  getYOffset(rowIndex + rowsPerWeek - 1) +
                  binHeight;
                const centerY = (startY + endY) / 2;

                return (
                  <g key={`y-label-week-${weekIndex}`}>
                    <line
                      x1={maxWidth - 16}
                      x2={maxWidth - 16}
                      y1={yScale(rowIndex) + getYOffset(rowIndex) + 2}
                      y2={
                        yScale(rowIndex + rowsPerWeek - 1) +
                        getYOffset(rowIndex + rowsPerWeek - 1) +
                        binHeight
                      }
                      stroke="#d3d3d3"
                      strokeLinecap="butt"
                      strokeWidth={1}
                      className="fill-border-border"
                    />
                    <g transform={`translate(0, ${centerY})`}>
                      <Text
                        x={maxWidth - 25}
                        y={-2}
                        textAnchor="end"
                        verticalAnchor="end"
                        className="!label-medium !fill-text-text text-left font-medium"
                        fill="#3B475B"
                      >
                        {weekLabel}
                      </Text>
                      <Text
                        x={maxWidth - 25}
                        y={6}
                        textAnchor="end"
                        verticalAnchor="start"
                        className="!label-small fill-text-light text-left font-medium"
                      >
                        {rangeLabel}
                      </Text>
                    </g>
                  </g>
                );
              })}
            </Group>
          ) : (
            <AxisLeft
              scale={yScale}
              hideTicks
              hideAxisLine
              hideZero
              left={0}
              tickValues={Array.from(
                { length: yAxisLabel.length },
                (_, i) => i,
              )}
              tickFormat={(value) =>
                typeof value === 'number' ? (yAxisLabel[value] ?? '') : ''
              }
              tickLabelProps={() => ({
                dy: `${(binHeight + effectiveVerticalGap) / 2}px`,
                textAnchor: 'end',
                verticalAnchor: 'middle',
              })}
              tickComponent={DefaultYAxisTick}
            />
          )}
        </Group>
      </svg>
    );

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

    return (
      <div
        className="relative box-border"
        style={{
          height: `${height}px`,
          paddingBottom: `${legendHeight + (isLegendsProps ? 16 : 0)}px`,
        }}
      >
        <div
          className={`${wrapperClassName} relative flex items-start gap-10  ${isLegendsProps ? 'flex-1' : ''}`}
          data-testid={dataTestId}
          onScroll={() => {
            setTooltipData(null);
          }}
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
                  top: adjustedMargins.top!,
                  width:
                    width -
                    adjustedMargins.right! +
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
                    top: adjustedMargins.top! + 32,
                    width: width - adjustedMargins.right!,
                    height:
                      height -
                      32 -
                      adjustedMargins.top! -
                      adjustedMargins.bottom! -
                      legendHeight -
                      (isLegendsProps ? 16 : 0),
                  }}
                >
                  {heatMapChart}
                </div>
              </>
            )}
          </div>
          {tooltipData && (
            <div
              ref={tooltipRef}
              className="bg-fill-fill fixed z-50 rounded-md"
              style={tooltipStyle}
            >
              {renderTooltipContent()}
            </div>
          )}
        </div>
        <div className="bg-fill-fill absolute mt-4 flex w-full items-start justify-center">
          {renderLinearLegend}
        </div>
      </div>
    );
  },
);

export default HeatMapBar;
