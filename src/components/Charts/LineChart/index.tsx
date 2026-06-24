import { forwardRef } from 'react';
import { LineChartData, LineChartProps } from './types';
import { LineChartContent } from './LineChartContent';
import { useAllZeroEffect } from '../NoDataSkeleton/hook/useAllZeroEffect';
import { ChartSkeleton } from '../ChartsSkeletonLoader';
import { LineChartNoDataSkeleton } from '../NoDataSkeleton/LineChartNoDataSkeleton';

export { type LineChartProps, type LineChartMargins } from './types';

export const LineChart = forwardRef<HTMLDivElement, LineChartProps>(
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
      isLoading = false,
      skeletonProps = {},
      noDataSkeletonProps = {},
      usePreciseTickCalculation = false,
      legendProps,
      tooltipBehavior = 'floating',
      enableHorizontalScroll = false,
      minPointWidth = 50,
    },
    ref,
  ) => {
    const filteredLineChartData = lineChartType.series
      ? lineChartType.lineChartSeries.flat()
      : lineChartType.lineChartData;

    const allZero = useAllZeroEffect<LineChartData>({
      chartData: filteredLineChartData,
      valueKey: 'value',
    });

    if (isLoading) {
      return (
        <ChartSkeleton
          type="line"
          height={height}
          width={width}
          margins={margins}
          animate
          xAxisLabel={xAxisLabel !== undefined}
          yAxisLabel={yAxisLabel !== undefined}
          {...skeletonProps}
        />
      );
    }

    if (allZero) {
      return (
        <LineChartNoDataSkeleton
          height={height}
          margins={margins}
          width={width}
          {...noDataSkeletonProps}
        />
      );
    }
    return (
      <LineChartContent
        ref={ref}
        height={height}
        width={width}
        margins={margins}
        axisLeftValueGap={axisLeftValueGap}
        axisLeftTickFormatter={axisLeftTickFormatter}
        axisBottomTickFormatter={axisBottomTickFormatter}
        dataTestId={dataTestId}
        toolTipContent={toolTipContent}
        lineChartType={lineChartType}
        xAxisLabel={xAxisLabel}
        yAxisLabel={yAxisLabel}
        shouldShowMedianLine={shouldShowMedianLine}
        showTooltipPositionTop={showTooltipPositionTop}
        showColumnsLines={showColumnsLines}
        usePreciseTickCalculation={usePreciseTickCalculation}
        legendProps={legendProps}
        tooltipBehavior={tooltipBehavior}
        enableHorizontalScroll={enableHorizontalScroll}
        minPointWidth={minPointWidth}
      />
    );
  },
);
