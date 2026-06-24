import { forwardRef } from 'react';
import { ChartSkeleton } from '../ChartsSkeletonLoader';

import HeatMapChartComponent from './HeatMapChart';
import {
  Bins,
  HealthHeatMapChartData,
  HeatMapChartData,
  HeatMapChartProps,
  HeatMapMargins,
} from './types';
import { useAllZeroEffect } from '../NoDataSkeleton/hook/useAllZeroEffect';
import { HeatMapChartNoDataSkeleton } from '../NoDataSkeleton/HeatMapChartNoDataSkeleton';

export type {
  HeatMapChartProps,
  HeatMapChartData,
  HealthHeatMapChartData,
  HeatMapMargins,
};
// eslint-disable-next-line import/prefer-default-export
export const HeatMapChart = forwardRef<HTMLDivElement, HeatMapChartProps>(
  (
    {
      height,
      width,
      heatMapLegends,
      wrapperClassName = '',
      margins,
      heatMapChartData,
      legendsProps,
      binDataThreshold,
      enableMinBinWidth = false,
      variant = 'vertical',
      heatMapGap = 4,
      highlightedLabels = [],
      heatMapBinRadius = 6,
      dataTestId = 'heat-map-chart',
      isHealth = false,
      isLoading = false,
      skeletonProps = {},
      noDataSkeletonProps = {},
      tooltipValueFormatter,
      tooltipTopMargin,
      showTooltip = false,
      chartData,
      ...props
    },
    ref,
  ) => {
    const dataForChart = chartData || heatMapChartData;
    const allZero = useAllZeroEffect<Bins>({
      chartData: dataForChart.map((data) => data.bins).flat(),
      valueKey: 'count',
    });

    if (isLoading) {
      return (
        <ChartSkeleton
          height={height}
          width={width}
          margins={margins}
          animate
          showLegendsLoader={(legendsProps?.legendData?.length || 0) > 0}
          type="heatmap"
          {...skeletonProps}
        />
      );
    }

    if (allZero) {
      return (
        <HeatMapChartNoDataSkeleton
          height={height}
          margins={margins}
          width={width}
          {...noDataSkeletonProps}
        />
      );
    }
    const baseProps = {
      ref,
      height,
      width,
      margins,
      wrapperClassName,
      variant,
      heatMapGap,
      enableMinBinWidth,
      heatMapBinRadius,
      legendsProps,
      highlightedLabels,
      binDataThreshold,
      dataTestId,
      tooltipValueFormatter,
      tooltipTopMargin,
      showTooltip,
      heatMapLegends,
    } as const;

    if (isHealth) {
      const healthProps = props as Extract<
        HeatMapChartProps,
        { isHealth: true }
      >;

      // Use Omit to get "everything else" safely
      type OtherHealthProps = Omit<
        Extract<HeatMapChartProps, { isHealth: true }>,
        | 'colorRange'
        | 'colorOpacityRange'
        | 'fillEmptyState'
        | keyof typeof baseProps
        | 'heatMapChartData'
        | 'isHealth'
      >;

      const otherHealthProps = healthProps as OtherHealthProps;

      return (
        <HeatMapChartComponent
          {...baseProps}
          isHealth
          heatMapChartData={dataForChart as HealthHeatMapChartData[]}
          {...otherHealthProps}
        />
      );
    }

    const regularProps = props as Extract<
      HeatMapChartProps,
      { isHealth?: false }
    >;

    type OtherRegularProps = Omit<
      Extract<HeatMapChartProps, { isHealth?: false }>,
      | 'colorMapping'
      | keyof typeof baseProps
      | 'colorMappingHover'
      | 'heatMapChartData'
      | 'isHealth'
    >;

    const otherRegularProps = regularProps as OtherRegularProps;

    return (
      <HeatMapChartComponent
        {...baseProps}
        isHealth={false}
        heatMapChartData={dataForChart}
        {...otherRegularProps}
      />
    );
  },
);
