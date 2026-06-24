/* eslint-disable import/prefer-default-export */
import { forwardRef } from 'react';
import { ChartMargins, ChartSkeleton } from '../../ChartsSkeletonLoader';
import { HeatMapVariantMonthProps } from './types';
import { HeatMapBar } from './HeatMapBar';
import { Bins } from '../types';
import { useAllZeroEffect } from '../../NoDataSkeleton/hook/useAllZeroEffect';
import HeatMapWeekMonthVariantNoDataSkeleton from '../../NoDataSkeleton/HeatMapWeekMonthVariantNoDataSkeleton';

export const HeatMapMonthVariant = forwardRef<
  HTMLDivElement,
  HeatMapVariantMonthProps
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
      enableMinBinWidth = false,
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
      binDataThreshold = [],
      legendsProps = { legendData: [] },
      heatMapMonthBinData,
      onBinClick,
      dataTestId = 'heat-map-month-chart',
      highlightedLabels = [],
      binHoverBorderColorClassName,
      isLoading = false,
      skeletonProps = {},
      chartData,
      noDataSkeletonProps = {},
      enableSorting = false,
    },
    ref,
  ) => {
    const allZero = useAllZeroEffect<Bins>({
      chartData: heatMapMonthBinData.flatMap((data) => data.bins),
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

    const dataForChart = chartData || heatMapMonthBinData;

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
        ref={ref}
        wrapperClassName={wrapperClassName}
        tooltipContentWrapperClassName={tooltipContentWrapperClassName}
        tooltipWrapperClassName={tooltipWrapperClassName}
        xAxisLabelClassName={xAxisLabelClassName}
        noDataLegendLabel={noDataLegendLabel}
        noDataLegendDescription={noDataLegendDescription}
        nullLegendLabel={nullLegendLabel}
        nullLegendDescription={nullLegendDescription}
        height={height}
        width={width}
        margins={margins}
        verticalGap={verticalGap}
        colorPalette={colorPalette}
        horizontalGap={horizontalGap}
        groupGap={groupGap}
        binDataThreshold={binDataThreshold}
        legendsProps={legendsProps}
        heatMapMonthBinData={dataForChart}
        onBinClick={onBinClick}
        dataTestId={dataTestId}
        highlightedLabels={highlightedLabels}
        enableMinBinWidth={enableMinBinWidth}
        enableSorting={enableSorting}
        binHoverBorderColorClassName={binHoverBorderColorClassName}
      />
    );
  },
);
