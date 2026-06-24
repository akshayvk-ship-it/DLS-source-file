import {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  TickRendererProps,
  AxisTop,
  AxisLeft,
  ComputedTick,
  AxisScale,
} from '@visx/axis';
import { Group } from '@visx/group';
import { HeatmapRect } from '@visx/heatmap';
import { RectCell } from '@visx/heatmap/lib/heatmaps/HeatmapRect';
import { scaleLinear, scaleThreshold } from '@visx/scale';
import { NumberValue } from '@visx/vendor/d3-scale';
import { Text } from '@visx/text';

import { InfoChip } from '../../Chips';
import ToolTipDownIndicatorArrow from '../SuccessFailureIndicatorChart/ToolTipDownIndicatorArrow';
import {
  BinDataThreshold,
  BinsWithStatus,
  HealthHeatMapChartData,
  HeatMapChartData,
  HeatMapChartProps,
} from './types';
import { HeatMapLegend } from './HeatMapLegend';
import { Legends } from '../Legends';
import { measureTextWidth } from './helper';
import EmptyDataIcon from '../Legends/EmptyDataIcon';

interface HealthToolTipData {
  x: number;
  y: number;
  color: string;
  element: JSX.Element | undefined;
  textValue: string;
  isEmpty: boolean;
}

// TODO: Remove the ColorMapping.Empty in major release since we have internal empty state now.
const HeatMapChartComponent = forwardRef<HTMLDivElement, HeatMapChartProps>(
  (
    {
      height,
      width,
      heatMapLegends,
      wrapperClassName = '',
      margins,
      heatMapChartData,
      variant = 'vertical',
      enableMinBinWidth = false,
      heatMapGap = 4,
      binDataThreshold,
      legendsProps,
      highlightedLabels = [],
      heatMapBinRadius = 6,
      dataTestId = 'heat-map-chart',
      isHealth = false,
      tooltipValueFormatter,
      tooltipTopMargin,
      showTooltip = false,
      noDataLegendLabel = '0',
      noDataLegendDescription = 'No Data',
      noDataTooltipLabel = 'No Data',
      tooltipWrapperClassName = '',
      ...props
    },
    ref,
  ) => {
    const [maxWidth, setMaxWidth] = useState(0);
    const [hoveredCell, setHoveredCell] = useState<{
      row: number;
      column: number;
    } | null>(null);
    const [tooltipData, setTooltipData] = useState<{
      x: number;
      y: number;
      labelRow: string;
      labelColumn: string;
      value: number;
      color: string;
      row: number;
      textValue: string;
      element: JSX.Element | undefined;
      col: number;
      colorOpacity?: number;
    } | null>(null);

    const [healthToolTip, setHealthToolTip] =
      useState<HealthToolTipData | null>(null);
    const [legendHeight, setLegendHeight] = useState(0);
    const legendsRef = useRef<HTMLDivElement | null>(null);

    const isLegendsProps = !!legendsProps?.legendData;

    const labelRef = useRef(null);
    const tooltipRef = useRef<HTMLDivElement | null>(null);

    const xMax = width - margins.left - margins.right - maxWidth;
    const yMax = height - margins.bottom - margins.top - legendHeight;

    const sortedThresholds: BinDataThreshold[] = useMemo(
      () =>
        binDataThreshold?.slice().sort((a, b) => a.maxValue - b.maxValue) ?? [],
      [binDataThreshold],
    );

    const colorRange =
      !isHealth && 'colorRange' in props ? props.colorRange : undefined;
    const colorOpacityRange = useMemo(
      () =>
        !isHealth && 'colorOpacityRange' in props
          ? props.colorOpacityRange
          : [0.1, 1],
      [isHealth, props],
    );
    const colorMapping =
      isHealth && 'colorMapping' in props
        ? props.colorMapping
        : {
            Success: '#17B26A',
            Warning: '#FFC533',
            Danger: '#A8063C',
          };

    const colorMappingHover =
      isHealth && 'colorMappingHover' in props ? props.colorMappingHover : null;

    const isFillEmptyState =
      !isHealth && 'fillEmptyState' in props ? props.fillEmptyState : false;

    const indexWithMaxBins = heatMapChartData.reduce(
      (maxIdx, data, i, arr) =>
        data.bins.length > arr[maxIdx]!.bins.length ? i : maxIdx,
      0,
    );

    // transpose if horizontal
    const horizontalMapChartData = heatMapChartData[indexWithMaxBins]!.bins.map(
      (_, colIndex) => ({
        label: heatMapChartData[indexWithMaxBins]?.bins[colIndex]?.label ?? '',
        bins: heatMapChartData.map((row) => ({
          count: row.bins[colIndex]?.count ?? 0,
          label: row.label ?? '',
          status: isHealth
            ? (row.bins[colIndex] as BinsWithStatus)?.status || 'Empty'
            : undefined,
          tooltipElement: row.bins[colIndex]?.tooltipElement ?? undefined,
        })),
      }),
    );

    const dataSource: HeatMapChartData[] | HealthHeatMapChartData[] =
      variant === 'vertical' ? heatMapChartData : horizontalMapChartData;

    useEffect(() => {
      if (labelRef.current) {
        const widthLabel = (
          labelRef.current as SVGTextElement
        ).getBoundingClientRect().width;

        setMaxWidth(widthLabel + 15);
      }
    }, []);

    const yAxisLabel = useMemo(() => {
      const uniqueLabels = new Set<string>();
      dataSource.forEach((d) => {
        d.bins.forEach((bin) => uniqueLabels.add(bin.label));
      });
      return Array.from(uniqueLabels);
    }, [dataSource]);

    // Click outside and scroll handlers
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

      document.addEventListener('click', handleClickOutside);
      document.addEventListener('scroll', handleScroll, true);

      return () => {
        document.removeEventListener('click', handleClickOutside);
        document.removeEventListener('scroll', handleScroll, true);
      };
    }, []);

    const xAxisLabel = dataSource.map((d) => d.label);

    const labelWidths = xAxisLabel.map((label) =>
      measureTextWidth(label, '!label-small !fill-text-light'),
    );
    const maxTopAxisLabelWidth = Math.max(...labelWidths);

    const maxBinLength =
      variant === 'vertical'
        ? heatMapChartData.reduce((max, d) => Math.max(max, d.bins.length), 0)
        : heatMapChartData.length;

    const processedDataSource = useMemo(
      () =>
        dataSource.map((d) => {
          if (d.bins.length > maxBinLength) return d;

          const remainingBins = maxBinLength - d.bins.length;

          const newBins = Array.from({ length: remainingBins }, (_, i) =>
            isHealth
              ? {
                  count: 0,
                  label: yAxisLabel[d.bins.length + i] || '',
                  status: 'Empty',
                }
              : {
                  count: 0,
                  label: yAxisLabel[d.bins.length + i] || '',
                },
          );
          return { ...d, bins: [...d.bins, ...newBins] };
        }),
      [dataSource, isHealth, maxBinLength, yAxisLabel],
    );

    const binWidth = xMax / dataSource.length;

    const finalBinWidth =
      maxTopAxisLabelWidth < binWidth ? binWidth : maxTopAxisLabelWidth * 1.3;

    const effectiveBinWidth = enableMinBinWidth ? finalBinWidth : binWidth;

    const finalxmax = xMax + (effectiveBinWidth - binWidth) * dataSource.length;

    const xScale = scaleLinear<number>({
      domain: [0, xAxisLabel.length],
      range: [0, finalxmax],
    });

    const bucketSizeMax = Math.max(
      ...dataSource.map((data) => data.bins.length),
    );

    const yScale = scaleLinear<number>({
      domain: [0, yAxisLabel.length],
      range: [0, yMax],
    });

    const binHeight = yMax / bucketSizeMax;

    const colorMax = Math.max(
      ...dataSource.map((d) => Math.max(...d.bins.map((v) => v.count))),
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

    const rectColorScale =
      sortedThresholds && sortedThresholds.length > 0
        ? (value: number | { valueOf(): number }) => {
            const numericValue =
              typeof value === 'number' ? value : value.valueOf();

            if (numericValue === 0) return 'url(#empty-bin-pattern)';

            const match = sortedThresholds.find(
              (bin) =>
                numericValue >= bin.minValue && numericValue <= bin.maxValue,
            );

            if (match) return match.color;

            // below the first threshold
            if (numericValue < (sortedThresholds[0]?.minValue ?? 0))
              return sortedThresholds[0]?.color ?? '';

            // above the last threshold
            const last = sortedThresholds[sortedThresholds.length - 1];
            if (numericValue > (last?.maxValue ?? 0)) return last?.color ?? '';

            return last?.color ?? '';
          }
        : scaleLinear<string>({
            range:
              typeof colorRange === 'string'
                ? [colorRange, colorRange]
                : colorRange,
            domain: [0, colorMax],
          });

    const opacityScale = useCallback(
      (value: number | { valueOf(): number }) => {
        const numericValue =
          typeof value === 'number' ? value : value.valueOf();

        if (numericValue === 0) return 1;

        const scale = scaleLinear<number>({
          range: colorOpacityRange,
          domain: [0, colorMax],
        });

        return scale(numericValue);
      },
      [colorOpacityRange, colorMax],
    );

    const isMaxYLabelValue = useMemo(
      () => Math.max(...yAxisLabel.map((value) => value.length)),
      [yAxisLabel],
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

    const renderTextComponent = ({
      x,
      y,
      formattedValue,
    }: TickRendererProps) => (
      <Text
        x={x}
        y={y - binHeight / 2 + heatMapGap / 2}
        textAnchor="end"
        verticalAnchor="middle"
        className="!label-small fill-text-light text-left"
        innerTextRef={
          isMaxYLabelValue === formattedValue?.length ? labelRef : null
        }
      >
        {formattedValue}
      </Text>
    );

    const tooltipStyle = useMemo(
      () => ({
        top: (tooltipTopMargin ?? 0) + (tooltipData ? tooltipData.y - 15 : 0),
        left: tooltipData ? tooltipData.x : 0,
        pointerEvents: 'none' as const,
      }),
      [tooltipData, tooltipTopMargin],
    );

    const healthTooltipStyle = useMemo(
      () => ({
        top:
          (tooltipTopMargin ?? 0) + (healthToolTip ? healthToolTip.y - 15 : 0),
        left: healthToolTip ? healthToolTip.x : 0,
        pointerEvents: 'none' as const,
      }),
      [healthToolTip, tooltipTopMargin],
    );

    const getTooltipData = (tooltipValue: number) => {
      const value = Number(tooltipValue);
      if (Number.isNaN(value)) return '';
      return tooltipValueFormatter?.(value) || value.toFixed(2);
    };

    const getBinColor = (
      bin: RectCell<HeatMapChartData, unknown>,
      isBinEmpty: boolean,
    ) => {
      if (isBinEmpty) {
        return {
          color: 'url(#empty-bin-pattern)',
          opacity: 1,
          stroke: '#E1E2E4',
        };
      }

      if (!isHealth || !colorMapping)
        return { color: bin.color, opacity: bin.opacity, stroke: 'none' };

      const { status } = bin.datum.bins[bin.row] as BinsWithStatus;

      return {
        color: colorMapping[status],
        opacity: 1,
        stroke: 'none',
      };
    };

    const handleBinMouseEnter = (
      e: React.MouseEvent<SVGRectElement>,
      bin: RectCell<HeatMapChartData, unknown>,
      isBinEmpty: boolean,
      color: string,
    ) => {
      if (!showTooltip) return;

      if (isHealth) {
        const tooltipText = isBinEmpty
          ? noDataTooltipLabel
          : `${bin.datum.bins?.[bin.row]?.label ?? ''}, ${bin.datum.label}`;

        const bounds = (e.target as SVGRectElement).getBoundingClientRect();

        // Even if user passes a tooltipElement for empty bin, we show "No Data" text, override it here.
        const tooltipElement = isBinEmpty
          ? undefined
          : (
              bin.datum.bins?.[bin.row] as {
                tooltipElement?: JSX.Element;
              }
            )?.tooltipElement;

        setHealthToolTip({
          color: isBinEmpty ? '#E1E2E4' : color,
          element: tooltipElement,
          textValue: tooltipText,
          x: bounds.left + bin.width / 2,
          y: bounds.top,
          isEmpty: isBinEmpty,
        });
      }

      setHoveredCell({ row: bin.row, column: bin.column });
    };

    // Check if there is any zero or null data in the chart data. Use for legend data.
    const { hasZeroData } = useMemo(() => {
      let zeroFound = false;

      dataSource.some((row) =>
        row.bins.some((bin) => {
          if (bin.count === 0) zeroFound = true;
          return zeroFound;
        }),
      );

      return { hasZeroData: zeroFound };
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

      return legends;
    }, [
      legendsProps?.legendData,
      hasZeroData,
      noDataLegendLabel,
      noDataLegendDescription,
    ]);

    const renderLinearLegend = isLegendsProps ? (
      <Legends
        {...legendsProps}
        ref={legendsRef}
        wrapperClassName={`${legendsProps.wrapperClassName || ''} bg-fill-fill`}
        isOutlined
        isSelectable={false}
        legendType="linear"
        descriptionClassName={`${legendsProps.descriptionClassName} !font-normal !text-text-light`}
        labelTextClassName={`${legendsProps.labelTextClassName} !font-medium`}
        legendData={legendData || []}
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
    }, [isLegendsProps, dataSource]);

    const numBins = xAxisLabel.length;

    const svgWidth = enableMinBinWidth
      ? width + numBins * (finalBinWidth - binWidth)
      : width;

    const topAxis = (
      <AxisTop
        top={margins.top}
        scale={xScale}
        tickValues={Array.from({ length: xAxisLabel.length }, (_, i) => i)}
        hideTicks
        hideAxisLine
        left={margins.left + maxWidth}
        tickLabelProps={(_, index, tickProps) => {
          const tickValues = tickProps as ComputedTick<AxisScale>[];

          const formattedValue = tickValues[index]?.formattedValue || '';

          const isHighlightedValue =
            highlightedLabels &&
            highlightedLabels.length &&
            formattedValue &&
            highlightedLabels.includes(formattedValue.toString());

          return {
            className: `!label-small fill-text-light ${isHighlightedValue ? '!font-semibold !fill-text-text' : ''}`,
            textAnchor: 'middle',
            dx: `${effectiveBinWidth / 2 - heatMapGap / 2}px`,
          };
        }}
        tickFormat={(value: NumberValue) =>
          typeof value === 'number' ? (xAxisLabel[value] as string) : ''
        }
      />
    );

    const heatMapChart = (
      <svg
        width={svgWidth}
        height={`${height - legendHeight - (isLegendsProps ? 16 : 0)}px`}
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
        <Group top={margins.top} left={margins.left + maxWidth}>
          <HeatmapRect
            data={
              !isFillEmptyState && !isHealth ? dataSource : processedDataSource
            }
            xScale={(d) => xScale(d) ?? 0}
            yScale={(d) => yScale(d) ?? 0}
            binWidth={effectiveBinWidth}
            binHeight={binHeight}
            colorScale={rectColorScale}
            opacityScale={!isLegendsProps ? opacityScale : undefined}
            gap={heatMapGap}
          >
            {(heatmap) =>
              heatmap.map((heatmapBins) =>
                heatmapBins.map((bin) => {
                  const isHovered =
                    hoveredCell?.row === bin.row &&
                    hoveredCell?.column === bin.column;

                  const values = bin.datum.bins[bin.row] as BinsWithStatus;

                  // TODO: Remove the 'values.status === 'Empty'' check in major release.
                  const isBinEmpty = !values.count || values.status === 'Empty';

                  const { color, opacity, stroke } = getBinColor(
                    bin,
                    isBinEmpty,
                  );

                  const strokeColorHovered =
                    colorMappingHover && values.status
                      ? colorMappingHover[values.status]
                      : color;

                  const finalStrokeColor = isBinEmpty ? '#E1E2E4' : stroke;

                  return (
                    <rect
                      key={`heatmap-react-${bin.row}-${bin.column}`}
                      width={bin.width}
                      height={bin.height}
                      x={bin.x}
                      y={bin.y}
                      stroke={
                        isHovered && showTooltip && !isBinEmpty
                          ? strokeColorHovered
                          : finalStrokeColor
                      }
                      strokeWidth={1}
                      fill={color}
                      fillOpacity={opacity}
                      rx={heatMapBinRadius}
                      ry={heatMapBinRadius}
                      style={{
                        cursor: showTooltip ? 'pointer' : 'default',
                        transition: 'stroke 0.2s ease',
                        filter:
                          isHovered && showTooltip
                            ? 'drop-shadow(0px 3px 6px rgba(0, 0, 0, 0.18))'
                            : 'none',
                      }}
                      onMouseEnter={(e) => {
                        handleBinMouseEnter(
                          e,
                          bin,
                          isBinEmpty,
                          color as string,
                        );
                      }}
                      onMouseLeave={() => {
                        if (!showTooltip) return;

                        setHoveredCell(null);

                        setHealthToolTip(null);
                      }}
                      onClick={(e) => {
                        if (!showTooltip || isHealth) return;

                        e.stopPropagation();
                        const bounds = e.currentTarget.getBoundingClientRect();

                        setTooltipData({
                          x: bounds.left + bin.width / 2,
                          y: bounds.top,
                          labelRow: `${bin.datum.bins?.[bin.row]?.label ?? ''}, ${bin.datum.label}`,
                          labelColumn: bin.datum.bins?.[bin.row]?.label ?? '',
                          color: rectColorScale(bin.count ?? 0),
                          value: bin.count ?? 0,
                          row: bin.row,
                          textValue: rectTextScale(bin.count ?? 0) || 'NA',
                          element: (
                            bin.datum.bins?.[bin.row] as {
                              tooltipElement?: JSX.Element;
                            }
                          )?.tooltipElement,
                          colorOpacity: opacity,
                          col: bin.column,
                        });
                      }}
                    />
                  );
                }),
              )
            }
          </HeatmapRect>
        </Group>
        {topAxis}
        <AxisLeft
          scale={yScale}
          top={margins.top}
          hideTicks
          hideAxisLine
          hideZero
          tickValues={Array.from(
            { length: yAxisLabel.length },
            (_, i) => i + 1,
          )}
          left={maxWidth}
          tickLabelProps={() => ({
            className: '!label-small fill-text-light text-left',
            dy: '0.32em',
            textAnchor: 'end',
            verticalAnchor: 'end',
          })}
          tickFormat={(value: NumberValue) =>
            typeof value === 'number' && value % 1 === 0
              ? (yAxisLabel[value - 1] as string)
              : ''
          }
          tickComponent={renderTextComponent}
        />
      </svg>
    );

    return (
      <div
        className={`${wrapperClassName} relative  ${!isLegendsProps ? 'flex items-end gap-10' : ''}`}
        data-testid={dataTestId}
        ref={ref}
        style={{
          ...(isLegendsProps || enableMinBinWidth
            ? { width: `${width}px` }
            : {}),
          height: `${height}px`,
          paddingBottom: `${isLegendsProps ? legendHeight + 16 : 0}px`,
        }}
      >
        <div className={` ${enableMinBinWidth ? 'overflow-x-auto' : ''}`}>
          {heatMapChart}
        </div>

        {heatMapLegends && (
          <HeatMapLegend
            monthInfo={heatMapLegends.monthInfo}
            primaryColor={heatMapLegends.primaryColor}
            todayInfo={heatMapLegends.todayInfo}
            weekInfo={heatMapLegends.weekInfo}
            heatMapLegendClassName={heatMapLegends.heatMapLegendClassName}
          />
        )}
        {tooltipData && (
          <div
            ref={tooltipRef}
            className={`bg-fill-fill fixed z-50 rounded-md ${tooltipWrapperClassName}`}
            style={tooltipStyle}
          >
            <div className="bg-fill-fill absolute -bottom-1.5 right-1/2 flex min-w-[120px] translate-x-1/2 items-center justify-center rounded-md p-2 shadow-[0px_5px_3px_1px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(27,32,41,0.06),0px_-1px_2px_0px_rgba(0,0,0,0.08)]">
              <span className="bg-fill-fill border-fill-fill absolute -bottom-1.5 right-1/2 -z-10 h-3 w-3 translate-x-1/2 rotate-[45deg] border-b border-r" />
              {tooltipData.element ??
                (tooltipData.value === 0 ? (
                  <span className="heading-5-semibold text-text-text whitespace-nowrap text-center">
                    {noDataTooltipLabel}
                  </span>
                ) : (
                  <div className="flex w-[85px] flex-col items-center justify-center gap-1">
                    <span className="heading-5-semibold text-text-action">
                      {getTooltipData(tooltipData.value)}
                    </span>
                    <InfoChip
                      showCloseIcon={false}
                      wrapperClassName="!px-1.5 !h-4 !flex w-fit !justify-center !border !border-border-border-light !rounded-3xl !bg-fill-fill"
                      prefixElement={
                        <div
                          className="h-2 w-2 rounded-full"
                          style={{
                            backgroundColor: tooltipData.color || '#000000',
                            opacity: tooltipData.colorOpacity || '1',
                          }}
                        />
                      }
                      textClassName="!label-extra-small !text-text-light !font-normal"
                      text={tooltipData.textValue}
                    />
                    <span className="!label-extra-small !text-text-light">
                      {tooltipData.labelRow}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        )}
        {healthToolTip && (
          <div
            ref={tooltipRef}
            className={`bg-fill-fill fixed z-50 rounded-md ${tooltipWrapperClassName}`}
            style={healthTooltipStyle}
          >
            <div
              className="absolute"
              style={{
                transform: 'translate(calc(-20% - 1px),0px)',
                pointerEvents: 'none',
              }}
            >
              <div
                style={{
                  borderColor: healthToolTip.isEmpty
                    ? '#5E6879'
                    : healthToolTip.color,
                  backgroundColor: healthToolTip.color,
                  height: 15,
                }}
                className="bg-fill-fill top-full border-l border-solid"
              />
            </div>
            <div
              className=" absolute min-w-fit !bg-transparent !shadow-none"
              style={{
                transform: 'translate(-50%, -100%)',
              }}
            >
              <div
                className="bg-fill-fill relative rounded-xl  border border-solid px-6 py-3 !shadow-[0px_4px_4px_0px_rgba(0,0,0,0.08)]"
                style={{
                  borderColor: healthToolTip.isEmpty
                    ? '#5E6879'
                    : healthToolTip.color,
                }}
              >
                {healthToolTip.element ?? (
                  <div className="flex w-fit flex-col items-center justify-center gap-1">
                    <span className="heading-5-semibold text-text-text whitespace-nowrap">
                      {healthToolTip.textValue}
                    </span>
                  </div>
                )}
                <ToolTipDownIndicatorArrow
                  fillColor={
                    healthToolTip.isEmpty ? '#5E6879' : healthToolTip.color
                  }
                  className="absolute left-1/2 top-full -translate-x-1/2"
                />
              </div>
            </div>
          </div>
        )}
        {isLegendsProps && (
          <div className="bg-fill-fill mt-4 flex w-full items-start justify-center">
            {renderLinearLegend}
          </div>
        )}
      </div>
    );
  },
);

export default HeatMapChartComponent;
