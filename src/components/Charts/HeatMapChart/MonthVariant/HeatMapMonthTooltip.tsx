import { Group } from '@visx/group';
import { HeatmapRect } from '@visx/heatmap';
import { scaleThreshold } from '@visx/scale';
import { forwardRef, useEffect, useMemo, useRef, useState } from 'react';
import { RectCell } from '@visx/heatmap/lib/heatmaps/HeatmapRect';
import { InfoChip } from '../../../Chips';
import {
  HeatMapMonthTooltipProps,
  HeatMapMonthBins,
  HeatMapMonthChartData,
} from './types';

const HeatMapMonthTooltip = forwardRef<
  HTMLDivElement,
  HeatMapMonthTooltipProps
>(
  (
    {
      isLoading,
      coordinates,
      miniBinThresholds,
      tooltipData,
      colorPalette,
      tooltipTrigger,
      tooltipWrapperClassName = '',
      tooltipContentWrapperClassName = '',
      tooltipMode = 'normal',
      noDataLegendDescription,
    },
    ref,
  ) => {
    const [hoveredMiniIndex, setHoveredMiniIndex] = useState<number | null>(
      null,
    );

    const [hoveredChipState, setHoveredChipState] = useState<{
      color: string | null;
      label: string | null;
    }>({
      color: null,
      label: null,
    });

    const [tooltipBinInfo, setTooltipBinInfo] = useState<{
      title?: string;
      subtitle?: string;
    } | null>(null);
    const [rightPanelHeight, setRightPanelHeight] = useState<number>(84);
    const measurementRef = useRef<HTMLDivElement | null>(null);
    const RIGHT_PANEL_WIDTH = 120;

    const highestThresholdColor = colorPalette[colorPalette.length - 1];

    const tooltipMiniData = useMemo((): HeatMapMonthChartData[] => {
      const bins = (tooltipData?.bins ?? []).map((b) => ({
        count: b.count,
        label: b.subtitle ?? b.title ?? '',
      }));
      return bins.length > 0 ? [{ label: 'mini', bins }] : [];
    }, [tooltipData?.bins]);

    const miniLocalMax = useMemo(
      () =>
        Math.max(
          0,
          ...tooltipMiniData.map((d) =>
            Math.max(0, ...d.bins.map((v) => v.count ?? 0)),
          ),
        ),
      [tooltipMiniData],
    );

    const miniColorScale = useMemo(() => {
      const miniThresholds = [
        miniLocalMax * 0.2,
        miniLocalMax * 0.4,
        miniLocalMax * 0.6,
        miniLocalMax * 0.8,
      ];

      const thresholdScale = scaleThreshold<number, string>({
        domain: miniThresholds,
        range: colorPalette,
      });
      return (value: number | { valueOf(): number }) => {
        const numericValue =
          typeof value === 'number' ? value : value.valueOf();

        if (miniBinThresholds && miniBinThresholds.length > 0) {
          const match = miniBinThresholds.find(
            (bin) =>
              numericValue >= bin.minValue && numericValue <= bin.maxValue,
          );
          if (match) return match.color;
          if (numericValue < (miniBinThresholds[0]?.minValue || 0))
            return miniBinThresholds[0]?.color || '';
          if (
            numericValue >
            (miniBinThresholds[miniBinThresholds.length - 1]?.maxValue || 0)
          )
            return miniBinThresholds[miniBinThresholds.length - 1]?.color || '';
          return miniBinThresholds[miniBinThresholds.length - 1]?.color || '';
        }

        return thresholdScale(numericValue);
      };
    }, [miniLocalMax, colorPalette, miniBinThresholds]);

    const getColorLabel = (color: string | null): string => {
      const colorLabels = ['Very Low', 'Low', 'Medium', 'High', 'Very High'];
      if (!color) return 'Unknown';
      if (miniBinThresholds && miniBinThresholds.length > 0) {
        const match = miniBinThresholds.find((bin) => color === bin.color);
        if (match) return match.tooltipLabel;
      }
      const colorIndex = colorPalette.indexOf(color);
      return colorLabels[colorIndex] ?? 'Unknown';
    };

    // Hover handlers for mini heatmap to drive right panel content and chip state
    const onTooltipBinMouseEnter = (
      bin: RectCell<HeatMapMonthChartData, HeatMapMonthBins>,
    ) => {
      const binColor = bin.color as string;
      setTooltipBinInfo({
        title:
          tooltipData?.bins?.[bin.row]?.title ??
          tooltipData?.bins?.[bin.row]?.subtitle,
        subtitle: tooltipData?.bins?.[bin.row]?.subtitle,
      });
      setHoveredMiniIndex(bin.row);
      setHoveredChipState({
        color: binColor,
        label: getColorLabel(binColor),
      });
    };

    const onTooltipBinMouseLeave = () => {
      setTooltipBinInfo(null);
      setHoveredMiniIndex(null);
      setHoveredChipState({
        color: null,
        label: null,
      });
    };

    // Measure max height needed across default and all hovered states
    useEffect(() => {
      const raf = requestAnimationFrame(() => {
        const container = measurementRef.current;
        if (!container) return;
        const items = container.querySelectorAll('.measurement-container');
        let max = 0;
        items.forEach((el) => {
          const rect = (el as HTMLElement).getBoundingClientRect();
          if (rect.height > max) max = rect.height;
        });
        if (max > 0) setRightPanelHeight(Math.ceil(max + 20));
      });
      return () => cancelAnimationFrame(raf);
    }, [tooltipData]);

    const isSameColor = highestThresholdColor === '#F15701';
    // Loading skeleton shown while awaiting async tooltip content
    const loadingContent = (
      <div className="flex h-[5.25rem] w-[10.875rem] flex-col items-center justify-center gap-1">
        <div
          className={`${isSameColor ? 'border-fill-action' : ''} h-4 w-4 animate-spin rounded-full border-2`}
          style={{
            borderColor: isSameColor ? '' : highestThresholdColor,
            borderTopColor: 'transparent',
          }}
        />
        <span
          className={`label-medium font-semibold ${isSameColor ? 'text-fill-action' : ''}`}
          style={{ color: isSameColor ? undefined : highestThresholdColor }}
        >
          Loading...
        </span>
      </div>
    );

    const defaultTooltipContent = (
      <>
        <span
          className={`heading-5-semibold ${isSameColor ? 'text-fill-action' : ''}`}
          style={{ color: isSameColor ? undefined : highestThresholdColor }}
        >
          {tooltipBinInfo?.title ?? tooltipData?.title}
        </span>
        <span className="!label-small !text-text-text">
          {tooltipBinInfo?.subtitle ?? tooltipData?.subtitle}
        </span>
      </>
    );

    const hoveredTooltipContent = (
      <div className="flex flex-col items-center justify-center gap-1">
        {tooltipBinInfo?.title && (
          <span
            className={`heading-5-semibold ${isSameColor ? 'text-fill-action' : ''}`}
            style={{ color: isSameColor ? undefined : highestThresholdColor }}
          >
            {tooltipBinInfo.title}
          </span>
        )}
        {hoveredChipState.label && hoveredChipState.color && (
          <InfoChip
            showCloseIcon={false}
            wrapperClassName="!px-1.5 !h-4 !flex w-fit !justify-center !border !border-border-border-light !rounded-3xl !bg-fill-fill"
            prefixElement={
              <div
                className="h-2 w-2 rounded-full"
                style={{
                  backgroundColor: hoveredChipState.color,
                }}
              />
            }
            textClassName="!label-extra-small !text-text-light !font-normal"
            text={hoveredChipState.label}
          />
        )}
        {tooltipData?.bins?.[hoveredMiniIndex ?? 0]?.subtitle && (
          <span className="!label-extra-small !text-text-light px-1">
            {tooltipData?.bins?.[hoveredMiniIndex ?? 0]?.subtitle}
          </span>
        )}
      </div>
    );

    const rightPanel = (
      <div
        className="flex flex-col items-center justify-center "
        style={{ width: RIGHT_PANEL_WIDTH, height: rightPanelHeight }}
      >
        {hoveredMiniIndex === null
          ? defaultTooltipContent
          : hoveredTooltipContent}
      </div>
    );

    // To measure the tooltip containers height
    const measurementContainer = (
      <div
        ref={measurementRef}
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 -z-50 opacity-0"
        style={{ width: RIGHT_PANEL_WIDTH }}
      >
        <div className="measurement-container flex flex-col items-center justify-center gap-1">
          <span
            className="heading-5-semibold"
            style={{ color: highestThresholdColor }}
          >
            {tooltipData?.title}
          </span>
          <span className="!label-small !text-text-text">
            {tooltipData?.subtitle}
          </span>
        </div>
        {(tooltipData?.bins ?? []).map((b, index) => (
          <div
            // eslint-disable-next-line react/no-array-index-key
            key={`measure-${b.subtitle ?? b.title ?? 'bin'}-${index}`}
            className="measurement-container flex flex-col items-center justify-center gap-1"
          >
            {b.title ? (
              <span
                className="heading-5-semibold"
                style={{ color: highestThresholdColor }}
              >
                {b.title}
              </span>
            ) : null}
            <InfoChip
              showCloseIcon={false}
              wrapperClassName="!px-1.5 !h-4 !flex w-fit !justify-center !border !border-border-border-light !rounded-3xl !bg-fill-fill"
              prefixElement={<div className="h-2 w-2 rounded-full" />}
              textClassName="!label-extra-small !text-text-light !font-normal"
              text={hoveredChipState?.label ?? ''}
            />
            {b.subtitle ? (
              <span className="!label-extra-small !text-text-light px-1">
                {b.subtitle}
              </span>
            ) : null}
          </div>
        ))}
      </div>
    );

    const tooltipWrapper = (children: React.ReactNode) => (
      <div
        ref={ref}
        className={`bg-fill-fill fixed z-50 rounded-md ${tooltipWrapperClassName}`}
        style={{
          top: coordinates.y - 16,
          left: coordinates.x,
        }}
      >
        <div className="bg-fill-fill absolute -bottom-1.5 right-1/2 flex translate-x-1/2 items-center justify-center rounded-md px-2 shadow-[0px_5px_3px_1px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(27,32,41,0.06),0px_-1px_2px_0px_rgba(0,0,0,0.08)]">
          <span className="bg-fill-fill border-fill-fill absolute -bottom-1.5 right-1/2 -z-10 h-3 w-3 translate-x-1/2 rotate-[45deg] border-b border-r" />
          {children}
        </div>
      </div>
    );

    const noDataContent = (
      <div className=" flex min-w-[7.438rem] flex-col items-center justify-center px-9 py-3">
        <span className="paragraph-extra-small text-text-text whitespace-nowrap">
          {noDataLegendDescription}
        </span>
      </div>
    );

    const hoverContent = (
      <div className="flex w-max min-w-[7.438rem] flex-col items-center justify-center p-2">
        {tooltipData?.title && (
          <span className="label-small text-text-text whitespace-nowrap">
            {tooltipData.title}
          </span>
        )}
        {tooltipData?.subtitle && (
          <span className="label-small text-text-text whitespace-nowrap">
            {tooltipData.subtitle}
          </span>
        )}
      </div>
    );

    // Full content rendered on click trigger: mini heatmap + right panel
    const mainContent = (
      <>
        <div className={`flex items-center ${tooltipContentWrapperClassName}`}>
          <svg
            width={46}
            height={Math.max(8, (tooltipData?.bins?.length ?? 0) * 9)}
            className="overflow-visible"
          >
            <Group top={0} left={0}>
              <HeatmapRect<HeatMapMonthChartData, HeatMapMonthBins>
                data={tooltipMiniData}
                xScale={(d) => (d / 1) * 46}
                yScale={(rowIndex) => rowIndex * 9}
                binWidth={46}
                binHeight={9}
                colorScale={miniColorScale}
                gap={1}
              >
                {(heatmap) =>
                  heatmap.map((heatmapBins) =>
                    heatmapBins.map((bin) => (
                      <g key={`mini-heatmap-${bin.row}-${bin.column}`}>
                        <rect
                          width={bin.width}
                          height={bin.height}
                          x={bin.x}
                          y={bin.y}
                          onMouseEnter={() => onTooltipBinMouseEnter(bin)}
                          onMouseLeave={onTooltipBinMouseLeave}
                          fill={bin.color}
                          fillOpacity={bin.opacity}
                          rx={0}
                          ry={0}
                        />
                        {hoveredMiniIndex === bin.row ? (
                          <svg
                            width="6"
                            height="8"
                            viewBox="0 0 6 8"
                            fill="none"
                            className="pointer-events-none"
                            x={bin.x + bin.width + 2}
                            y={bin.y + (bin.height - 8) / 2}
                          >
                            <path
                              d="M0 2.62268e-07L4.75192 3.16795C5.34566 3.56377 5.34566 4.43623 4.75193 4.83205L3.49691e-07 8L0 2.62268e-07Z"
                              fill="#00071A"
                            />
                          </svg>
                        ) : null}
                      </g>
                    )),
                  )
                }
              </HeatmapRect>
            </Group>
          </svg>
          {rightPanel}
        </div>
        {/* Hidden measurement container to compute max required height */}
        {measurementContainer}
      </>
    );

    if (isLoading) {
      return tooltipWrapper(loadingContent);
    }

    if (tooltipMode === 'no-data') {
      return tooltipWrapper(noDataContent);
    }

    if (!tooltipData || tooltipMode === 'null') return null;

    if (tooltipTrigger === 'hover') {
      return tooltipWrapper(hoverContent);
    }

    return tooltipWrapper(mainContent);
  },
);

HeatMapMonthTooltip.displayName = 'HeatMapMonthTooltip';

export default HeatMapMonthTooltip;
