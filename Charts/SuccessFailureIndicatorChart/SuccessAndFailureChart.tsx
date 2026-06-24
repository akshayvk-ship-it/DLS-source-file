import { forwardRef, useEffect, useRef, useState } from 'react';
import { Group } from '@visx/group';
import { Bar } from '@visx/shape';
import { useTooltip, useTooltipInPortal } from '@visx/tooltip';
import ToolTipDownIndicatorArrow from './ToolTipDownIndicatorArrow';
import {
  SuccessAndFailureChartData,
  SuccessFailureIndicatorChartProps,
  TooltipData,
} from './types';
import { ChartSkeleton } from '../ChartsSkeletonLoader';
import { useAllZeroEffect } from '../NoDataSkeleton/hook/useAllZeroEffect';
import { SuccessFailureIndicatorChartNoDataSkeleton } from '../NoDataSkeleton/SuccessFailureIndicatorChartNoDataSkeleton';

const DeprecatedSuccessFailureIndicatorChart = forwardRef<
  HTMLDivElement,
  SuccessFailureIndicatorChartProps
>(
  ({
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
    isLoading,
    skeletonProps = {},
    noDataSkeletonProps = {},
  }) => {
    const wrapperRef = useRef<HTMLDivElement>(null);

    const [wrapperWidth, setWrapperWidth] = useState<number>(0);

    const { tooltipData, tooltipLeft, tooltipTop, showTooltip, hideTooltip } =
      useTooltip<TooltipData>();

    const { containerRef, TooltipInPortal, forceRefreshBounds } =
      useTooltipInPortal({
        scroll: true,
      });

    const getColorSet = (val: number) => {
      if (val < threshold.failure) {
        return barColors.failure;
      }

      if (val >= threshold.failure && val < threshold.medium) {
        return barColors.medium;
      }

      return barColors.success;
    };

    const totalItems = chartData.length;
    const barWidth = 8;

    const totalWidth =
      (totalItems - 1) * barWidth +
      2 * (totalItems - 2) +
      2 * margins.left +
      margins.right;

    const allZero = useAllZeroEffect<SuccessAndFailureChartData>({
      chartData,
      valueKey: 'uptime',
    });

    useEffect(() => {
      if (wrapperRef.current?.parentElement) {
        setWrapperWidth(
          wrapperRef.current?.parentElement?.getBoundingClientRect().width,
        );
      }
    }, [isLoading]);

    if (isLoading) {
      return (
        <div ref={wrapperRef}>
          <ChartSkeleton
            animate
            type="successFailureIndicator"
            height={height}
            width={wrapperWidth}
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
            width={wrapperWidth}
            {...noDataSkeletonProps}
        />
        </div>
      );
    }

    return (
      <div
        className={`${wrapperClassName} border-border-border-light
        relative max-w-full overflow-x-scroll rounded-lg border border-solid
        px-2
      `}
        style={{
          width: `${totalWidth}px`,
          height: `${height}px`,
          paddingTop: `${margins.top - 2}px`,
          paddingBottom: `${margins.bottom - 2}px`,
        }}
        data-testid={dataTestId}
      >
        <svg
          width={totalWidth - margins.left - margins.right}
          height={height - margins.top - margins.bottom}
          ref={containerRef}
          className={svgClassName}
          onMouseEnter={forceRefreshBounds}
        >
          <Group>
            {chartData.map((chartItem, index) => {
              const fillColor = chartItem.isEmpty
                ? '#EBEDEF'
                : getColorSet(chartItem.uptime);
              return (
                <Bar
                  key={chartItem.key}
                  y={0}
                  x={barWidth * index + 2 * index}
                  fill={fillColor}
                  width={barWidth}
                  height={height - margins.top - margins.bottom}
                  rx={2}
                  ry={2}
                  onMouseEnter={
                    toolTipContent
                      ? () => {
                          showTooltip({
                            tooltipData: {
                              currentElementSize: Math.max(chartItem.uptime, 0),
                              currentToolTip: {
                                color: fillColor,
                                content: chartItem,
                              },
                            },
                            tooltipTop: -20,
                            tooltipLeft:
                              barWidth / 2 + (barWidth + 2) * (index - 1),
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
        ) : (
          ''
        )}
      </div>
    );
  },
);

export default DeprecatedSuccessFailureIndicatorChart;
