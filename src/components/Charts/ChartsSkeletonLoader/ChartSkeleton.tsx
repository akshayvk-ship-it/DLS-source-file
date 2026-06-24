/* eslint-disable react/destructuring-assignment */
import {
  BarSkeletonProps,
  ChartSkeletonProps,
  ConnectedScatterSkeletonProps,
  DoughnutSkeletonProps,
  HeatMapSkeletonProps,
  HeatMapWeekMonthSkeletonProps,
  HorizontalBarSkeletonProps,
  LineSkeletonProps,
} from './types';
import { BarSkeleton } from './SkeletonComponents/BarSkeleton';
import { HorizontalBarSkeleton } from './SkeletonComponents/HorizontalBarSkeleton';
import { DoughnutSkeleton } from './SkeletonComponents/DoughnutSkeleton';
import { LineSkeleton } from './SkeletonComponents/LineSkeleton';
import { BubbleSkeleton } from './SkeletonComponents/BubbleSkeleton';
import { ConnectedScatterSkeleton } from './SkeletonComponents/ConnectedScatterSkeleton';
import { HorizontalFunnelSkeleton } from './SkeletonComponents/HorizontalFunnelSkeleton';
import { HeatMapSkeleton } from './SkeletonComponents/HeatMapSkeleton';
import { GaugeSkeleton } from './SkeletonComponents/GaugeSkeleton';
import { BrushBarSkeleton } from './SkeletonComponents/BrushBarSkeleton';
import { TreeMapSkeleton } from './SkeletonComponents/TreeMapSkeleton';
import { VerticalFunnelSkeleton } from './SkeletonComponents/VerticalFunnelSkeleton';
import { SuccessFailureIndicatorSkeleton } from './SkeletonComponents/SuccessFailureIndicatorSkeleton';
import { GeoMapSkeleton } from './SkeletonComponents/GeoMapSkeleton';
import { HeatMapWeekMonthSkeleton } from './SkeletonComponents/HeatMapWeekMonthSkeleton';

// eslint-disable-next-line import/prefer-default-export, func-names
export function ChartSkeleton(props: ChartSkeletonProps): JSX.Element {
  const {
    type,
    width,
    height,
    margins,
    animate = true,
    retryClick,
    retryMode,
    showRetryAfter,
    errorIcon,
    autoRetryHeadingText,
    manualRetryHeadingText,
    manualRetrySubText,
    autoRetryInterval,
    autoRetryAttempts,
  } = props;

  const commonProps = {
    width,
    height,
    margins,
    animate,
    retryClick,
    retryMode,
    showRetryAfter,
    errorIcon,
    autoRetryHeadingText,
    manualRetryHeadingText,
    manualRetrySubText,
    autoRetryInterval,
    autoRetryAttempts,
  };

  const skeletonTypes = {
    bar: (
      <BarSkeleton
        {...commonProps}
        type="bar"
        showXAxisLabel={(props as BarSkeletonProps).showXAxisLabel}
        showYAxisLabel={(props as BarSkeletonProps).showYAxisLabel}
      />
    ),
    horizontalBar: (
      <HorizontalBarSkeleton
        {...commonProps}
        type="horizontalBar"
        showXAxisLabel={(props as HorizontalBarSkeletonProps).showXAxisLabel}
        showYAxisLabel={(props as HorizontalBarSkeletonProps).showYAxisLabel}
      />
    ),
    doughnut: (
      <DoughnutSkeleton
        {...commonProps}
        type="doughnut"
        showText={(props as DoughnutSkeletonProps).showText}
        showSubText={(props as DoughnutSkeletonProps).showSubText}
        showLegend={(props as DoughnutSkeletonProps).showLegend}
      />
    ),
    line: (
      <LineSkeleton
        {...commonProps}
        type="line"
        xAxisLabel={(props as LineSkeletonProps).xAxisLabel}
        yAxisLabel={(props as LineSkeletonProps).yAxisLabel}
      />
    ),
    connectedScatter: (
      <ConnectedScatterSkeleton
        {...commonProps}
        type="connectedScatter"
        xLabel={(props as ConnectedScatterSkeletonProps).xLabel}
        yLabel={(props as ConnectedScatterSkeletonProps).yLabel}
      />
    ),
    bubble: <BubbleSkeleton {...commonProps} type="bubble" />,
    horizontalFunnel: (
      <HorizontalFunnelSkeleton {...commonProps} type="horizontalFunnel" />
    ),
    verticalFunnel: (
      <VerticalFunnelSkeleton {...commonProps} type="verticalFunnel" />
    ),
    heatmap: (
      <HeatMapSkeleton
        {...commonProps}
        type="heatmap"
        showLegendsLoader={(props as HeatMapSkeletonProps).showLegendsLoader}
      />
    ),
    heatMapWeekMonthVariant: (
      <HeatMapWeekMonthSkeleton
        {...commonProps}
        type="heatMapWeekMonthVariant"
        showLegendsLoader={
          (props as HeatMapWeekMonthSkeletonProps).showLegendsLoader
        }
      />
    ),
    gauge: <GaugeSkeleton {...commonProps} type="gauge" />,
    brushBar: <BrushBarSkeleton {...commonProps} type="brushBar" />,
    treeMap: <TreeMapSkeleton {...commonProps} type="treeMap" />,
    successFailureIndicator: (
      <SuccessFailureIndicatorSkeleton
        {...commonProps}
        type="successFailureIndicator"
      />
    ),
    geoMap: <GeoMapSkeleton {...commonProps} type="geoMap" />,
  };

  return skeletonTypes[type];
}
