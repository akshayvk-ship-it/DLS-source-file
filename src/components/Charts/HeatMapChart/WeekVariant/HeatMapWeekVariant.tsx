/* eslint-disable import/prefer-default-export */
import { forwardRef } from 'react';
import { heatMapColorArray, heatMapMargins } from './constants';
import { HeatMapBar } from './HeatMapBar';
import { Bins, HeatMapVariantWeekProps } from '../types';
import { ChartMargins, ChartSkeleton } from '../../ChartsSkeletonLoader';
import { useAllZeroEffect } from '../../NoDataSkeleton/hook/useAllZeroEffect';
import HeatMapWeekMonthVariantNoDataSkeleton from '../../NoDataSkeleton/HeatMapWeekMonthVariantNoDataSkeleton';

export const HeatMapWeekVariant = forwardRef<
  HTMLDivElement,
  HeatMapVariantWeekProps
>(
  (
    {
      wrapperClassName = '',
      height,
      width,
      margins = heatMapMargins,
      groupGap = 2,
      verticalGap = 0,
      legendsProps,
      colorArray = heatMapColorArray,
      binDataThreshold,
      enableMinBinWidth = false,
      horizontalGap = 2.5,
      heatMapWeekBinData,
      dataTestId = 'heat-map-chart',
      highlightedLabels = [],
      tooltipTopMargin,
      binHoverBorderColorClassName,
      tooltipFormatter,
      isLoading = false,
      skeletonProps = {},
      chartData,
      noDataSkeletonProps = {},
      noDataLegendLabel = '0',
      noDataLegendDescription = 'No Data',
      nullLegendLabel = 'Null',
      nullLegendDescription = 'Unavailable',
    },
    ref,
  ) => {
    const allZero = useAllZeroEffect<Bins>({
      chartData: heatMapWeekBinData.flatMap((data) => data.bins),
      valueKey: 'count',
    });
    if (isLoading) {
      return (
        <ChartSkeleton
          height={height}
          width={width}
          margins={margins as ChartMargins}
          animate
          showLegendsLoader={(legendsProps?.legendData?.length || 0) > 0}
          type="heatMapWeekMonthVariant"
          {...skeletonProps}
        />
      );
    }

    const dataForChart = chartData || heatMapWeekBinData;

    if (allZero) {
      return (
        <HeatMapWeekMonthVariantNoDataSkeleton
          height={height}
          margins={margins as ChartMargins}
          width={width}
          {...noDataSkeletonProps}
        />
      );
    }
    return (
      <HeatMapBar
        height={height}
        width={width}
        enableMinBinWidth={enableMinBinWidth}
        margins={margins}
        heatMapChartData={dataForChart}
        horizontalGap={horizontalGap}
        verticalGap={verticalGap}
        rowGroupSize={7}
        heatMapBinRadius={0}
        groupGap={groupGap}
        spanLabelsAcrossGroups
        variant="horizontal"
        colorArray={colorArray}
        binHoverBorderColorClassName={binHoverBorderColorClassName}
        ref={ref}
        wrapperClassName={wrapperClassName}
        dataTestId={dataTestId}
        highlightedLabels={highlightedLabels}
        tooltipTopMargin={tooltipTopMargin}
        binDataThreshold={binDataThreshold}
        legendsProps={legendsProps}
        tooltipValueFormatter={tooltipFormatter}
        noDataLegendLabel={noDataLegendLabel}
        noDataLegendDescription={noDataLegendDescription}
        nullLegendLabel={nullLegendLabel}
        nullLegendDescription={nullLegendDescription}
      />
    );
  },
);
