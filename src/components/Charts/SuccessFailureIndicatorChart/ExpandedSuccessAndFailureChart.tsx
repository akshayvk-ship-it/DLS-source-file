import {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Group } from '@visx/group';
import { Bar } from '@visx/shape';
import { useTooltip, useTooltipInPortal } from '@visx/tooltip';
import ToolTipDownIndicatorArrow from './ToolTipDownIndicatorArrow';
import {
  SuccessFailureIndicatorChartProps,
  TooltipData,
  SuccessAndFailureChartData,
} from './types';
import { ChartSkeleton } from '../ChartsSkeletonLoader';
import { useAllZeroEffect } from '../NoDataSkeleton/hook/useAllZeroEffect';
import { SuccessFailureIndicatorChartNoDataSkeleton } from '../NoDataSkeleton/SuccessFailureIndicatorChartNoDataSkeleton';

const ExpandedSuccessAndFailureChart = forwardRef<
  HTMLDivElement,
  SuccessFailureIndicatorChartProps
>(
  (
    {
      height,
      wrapperClassName = '',
      toolTipContent,
      chartData,
      margins,
      threshold,
      barColors,
      svgClassName = '',
      barClickHandler,
      dataTestId = 'success-failure-indicator-chart',
      resizeBarWidth = false,
      isLoading,
      skeletonProps = {},
      noDataSkeletonProps = {},
    },
    ref,
  ) => {
    const { tooltipData, tooltipLeft, tooltipTop, showTooltip, hideTooltip } =
      useTooltip<TooltipData>();

    const { containerRef, TooltipInPortal, forceRefreshBounds } =
      useTooltipInPortal({
        scroll: true,
      });

    const wrapperRef = useRef<HTMLDivElement>(null);
    const [wrapperWidth, setWrapperWidth] = useState<number>(0);

    const handleResize = useCallback((entries: ResizeObserverEntry[]) => {
      const entry = entries[0];
      if (entry?.contentRect) {
        setWrapperWidth(entry.contentRect.width);
      }
    }, []);

    useEffect(() => {
      if (!resizeBarWidth || !wrapperRef.current) return undefined;

      const resizeObserver = new ResizeObserver(handleResize);
      resizeObserver.observe(wrapperRef.current);

      return () => {
        resizeObserver.disconnect();
      };
    }, [chartData, resizeBarWidth, handleResize]);

    const getColorSet = (val: number) => {
      if (val < threshold.failure) return barColors.failure;
      if (val >= threshold.failure && val < threshold.medium)
        return barColors.medium;
      return barColors.success;
    };

    const totalItems = chartData.length;

    const layoutAttributes = useMemo(() => {
      const gap = 2;

      if (resizeBarWidth && wrapperWidth > 0) {
        const containerWidth = wrapperWidth - margins.left - margins.right;
        const barWidth = (containerWidth - gap * (totalItems - 1)) / totalItems;
        return {
          barWidth: Math.max(barWidth, 2),
          gap,
          totalWidth: wrapperWidth,
        };
      }

      const barWidth = 8;
      const gapCount = Math.max(totalItems - 1, 0);
      const totalWidth =
        totalItems * barWidth + gap * gapCount + margins.left + margins.right;

      return { barWidth, gap, totalWidth };
    }, [resizeBarWidth, totalItems, margins, wrapperWidth]);

    const allZero = useAllZeroEffect<SuccessAndFailureChartData>({
      chartData,
      valueKey: 'uptime',
    });

    if (isLoading) {
      return (
        <div ref={wrapperRef}>
          <ChartSkeleton
            animate
            type="successFailureIndicator"
            height={height}
            width={layoutAttributes.totalWidth}
            margins={margins}
            {...skeletonProps}
          />
        </div>
      );
    }

    if (allZero || chartData.length === 0) {
      return (
        <div ref={wrapperRef}>
          <SuccessFailureIndicatorChartNoDataSkeleton
            height={height}
            margins={margins}
            width={layoutAttributes.totalWidth}
            {...noDataSkeletonProps}
        />
        </div>
      );
    }

    return (
      <div
        ref={resizeBarWidth ? wrapperRef : ref}
        className={`${wrapperClassName} border-border-border-light
        relative max-w-full overflow-y-hidden overflow-x-scroll rounded-lg border border-solid
        px-2
      `}
        style={{
          width: resizeBarWidth ? '100%' : `${layoutAttributes.totalWidth}px`,
          height: `${height}px`,
        }}
        data-testid={dataTestId}
      >
        <svg
          width={resizeBarWidth ? wrapperWidth : layoutAttributes.totalWidth}
          height={height}
          ref={containerRef}
          className={svgClassName}
          onMouseEnter={forceRefreshBounds}
        >
          <Group top={margins.top} left={margins.left}>
            {chartData.map((chartItem, index) => {
              const x =
                index * (layoutAttributes.barWidth + layoutAttributes.gap);
              const fillColor = chartItem.isEmpty
                ? '#EBEDEF'
                : getColorSet(chartItem.uptime);
              return (
                <Bar
                  key={chartItem.key}
                  y={0}
                  x={x}
                  fill={fillColor}
                  width={layoutAttributes.barWidth}
                  height={height - margins.top - margins.bottom}
                  rx={2}
                  ry={2}
                  onMouseEnter={
                    toolTipContent
                      ? () => {
                          showTooltip({
                            tooltipData: {
                              currentElementSize: Math.max(
                                chartItem.uptime || 0,
                                0,
                              ),
                              currentToolTip: {
                                color: fillColor,
                                content: chartItem,
                              },
                            },
                            tooltipTop: margins.top - 20,
                            tooltipLeft:
                              margins.left +
                              x +
                              layoutAttributes.barWidth / 2 -
                              10,
                          });
                        }
                      : undefined
                  }
                  onMouseLeave={toolTipContent ? hideTooltip : undefined}
                  onClick={() => barClickHandler?.(chartItem)}
                />
              );
            })}
          </Group>
        </svg>

        {tooltipData && toolTipContent ? (
          <>
            <TooltipInPortal
              left={tooltipLeft}
              top={tooltipTop}
              detectBounds={false}
              className=" absolute !bg-transparent !shadow-none"
              style={{
                transform: 'translate(calc(-20% - 1px),0px)',
                pointerEvents: 'none',
              }}
            >
              <div
                style={{
                  borderColor: tooltipData?.currentToolTip?.color,
                  backgroundColor: tooltipData?.currentToolTip?.color,
                  height: 20,
                }}
                className="bg-fill-fill top-full border-l border-solid"
              />
            </TooltipInPortal>

            <TooltipInPortal
              left={tooltipLeft}
              top={tooltipTop}
              detectBounds={false}
              className=" absolute w-fit !bg-transparent !shadow-none"
              style={{
                transform: 'translate(-50%, -100%)',
              }}
            >
              <div
                className={`${toolTipContent?.className} bg-fill-fill relative rounded-xl  border border-solid px-6 py-3 !shadow-[0px_4px_4px_0px_rgba(0,0,0,0.08)]`}
                style={{
                  borderColor: tooltipData?.currentToolTip.content.isEmpty
                    ? '#5E6879'
                    : tooltipData?.currentToolTip?.color,
                }}
              >
                {toolTipContent?.CustomComponent({
                  currentToolTip: tooltipData.currentToolTip,
                })}
                <ToolTipDownIndicatorArrow
                  fillColor={
                    tooltipData.currentToolTip.content.isEmpty
                      ? '#5E6879'
                      : tooltipData.currentToolTip.color
                  }
                  className={`${toolTipContent?.arrowClassName || ''} absolute left-1/2 top-full -translate-x-1/2`}
                />
              </div>
            </TooltipInPortal>
          </>
        ) : null}
      </div>
    );
  },
);

export default ExpandedSuccessAndFailureChart;
