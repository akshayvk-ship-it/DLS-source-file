import { forwardRef } from 'react';
import ExpandedSuccessAndFailureChart from './ExpandedSuccessAndFailureChart';
import DeprecatedSuccessFailureIndicatorChart from './SuccessAndFailureChart';
import { SuccessFailureIndicatorSkeletonProps } from '../ChartsSkeletonLoader';
import { DataNotAvailableProps } from '../NoDataSkeleton/DataNotAvailable';

export interface SuccessAndFailureChartData {
  key: string;
  timestamp: string;
  isEmpty?: boolean;
  uptime: number;
  subText?: string;
  toolTipInfoText1?: string;
  toolTipInfoText2?: string;
}

export interface CurrentToolTipContent {
  color: string;
  content: SuccessAndFailureChartData;
}

export interface IndicatorBarToolTipContent {
  className?: string;
  CustomComponent: React.FC<{ currentToolTip: CurrentToolTipContent }>;
  arrowClassName?: string;
}

export interface SuccessAndFailureChartMargins {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface ThresholdValues {
  failure: number;
  medium: number;
}
export interface BarColors {
  failure: string;
  medium: string;
  success: string;
}

export interface SuccessFailureIndicatorChartProps {
  height: number;
  wrapperClassName?: string;
  toolTipContent?: IndicatorBarToolTipContent;
  chartData: SuccessAndFailureChartData[];
  margins: SuccessAndFailureChartMargins;
  threshold: ThresholdValues;
  barColors: BarColors;
  svgClassName?: string;
  barClickHandler?: (chartItem: SuccessAndFailureChartData) => void;
  isLoading?: boolean;
  skeletonProps?: Omit<
    SuccessFailureIndicatorSkeletonProps,
    'height' | 'width' | 'margins' | 'animate' | 'type'
  >;
  noDataSkeletonProps?: DataNotAvailableProps;
  dataTestId?: string;
  resizeBarWidth?: boolean;
}

export const SuccessFailureIndicatorChart = forwardRef<
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
    if (resizeBarWidth) {
      return (
        <ExpandedSuccessAndFailureChart
          height={height}
          wrapperClassName={wrapperClassName}
          toolTipContent={toolTipContent}
          chartData={chartData}
          margins={margins}
          threshold={threshold}
          barColors={barColors}
          svgClassName={svgClassName}
          barClickHandler={barClickHandler}
          dataTestId={dataTestId}
          resizeBarWidth={resizeBarWidth}
          ref={ref}
          isLoading={isLoading}
          skeletonProps={skeletonProps}
          noDataSkeletonProps={noDataSkeletonProps}
        />
      );
    }

    // TODO: Remove DeprecatedSuccessFailureIndicatorChart in next major release
    return (
      <DeprecatedSuccessFailureIndicatorChart
        height={height}
        wrapperClassName={wrapperClassName}
        toolTipContent={toolTipContent}
        chartData={chartData}
        margins={margins}
        threshold={threshold}
        barColors={barColors}
        svgClassName={svgClassName}
        barClickHandler={barClickHandler}
        dataTestId={dataTestId}
        ref={ref}
        isLoading={isLoading}
        skeletonProps={skeletonProps}
        noDataSkeletonProps={noDataSkeletonProps}
      />
    );
  },
);
