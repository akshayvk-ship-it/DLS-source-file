export type ChartType =
  | 'bar'
  | 'horizontalBar'
  | 'doughnut'
  | 'line'
  | 'bubble'
  | 'connectedScatter'
  | 'horizontalFunnel'
  | 'heatmap'
  | 'gauge'
  | 'brushBar'
  | 'successFailureIndicator';

export interface ChartMargins {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface FunnelPathOptions {
  topWidth: number;
  bottomWidth: number;
  segmentsCount: number;
  chartHeight: number;
  centerX: number;
  margins: ChartMargins;
}

export interface BaseSkeletonProps {
  width: number;
  height: number;
  margins: ChartMargins;
  animate?: boolean;
  retryClick?: () => void;
  autoRetryAttempts?: number;
  showRetryAfter?: number;
  autoRetryInterval?: number;
  errorIcon?: React.ReactElement;
  autoRetryHeadingText?: string;
  manualRetryHeadingText?: string;
  manualRetrySubText?: string;
  retryMode?: 'auto' | 'manual' | 'disabled';
}

export interface BarSkeletonProps extends BaseSkeletonProps {
  type: 'bar';
  showXAxisLabel?: boolean;
  showYAxisLabel?: boolean;
}

export interface HorizontalBarSkeletonProps extends BaseSkeletonProps {
  type: 'horizontalBar';
  showXAxisLabel?: boolean;
  showYAxisLabel?: boolean;
}

export interface DoughnutSkeletonProps extends BaseSkeletonProps {
  type: 'doughnut';
  innerRadius?: number;
  showText?: boolean;
  showSubText?: boolean;
  showLegend?: boolean;
}

export interface LineSkeletonProps extends BaseSkeletonProps {
  type: 'line';
  xAxisLabel?: boolean;
  yAxisLabel?: boolean;
}

export interface BubbleSkeletonProps extends BaseSkeletonProps {
  type: 'bubble';
}

export interface ConnectedScatterSkeletonProps extends BaseSkeletonProps {
  type: 'connectedScatter';
  xLabel?: boolean;
  yLabel?: boolean;
}

export interface HorizontalFunnelSkeletonProps extends BaseSkeletonProps {
  type: 'horizontalFunnel';
}

export interface VerticalFunnelSkeletonProps extends BaseSkeletonProps {
  type: 'verticalFunnel';
  retryIsAutoPhase?: boolean;
}

export interface HeatMapWeekMonthSkeletonProps extends BaseSkeletonProps {
  type: 'heatMapWeekMonthVariant';
  retryIsAutoPhase?: boolean;
  showLegendsLoader?: boolean;
}

export interface HeatMapSkeletonProps extends BaseSkeletonProps {
  type: 'heatmap';
  showLegendsLoader?: boolean;
}

export interface GaugeSkeletonProps extends BaseSkeletonProps {
  type: 'gauge';
}

export interface BrushBarSkeletonProps extends BaseSkeletonProps {
  type: 'brushBar';
}

export interface TreeMapSkeletonProps extends BaseSkeletonProps {
  type: 'treeMap';
  retryIsAutoPhase?: boolean;
}

export interface SuccessFailureIndicatorSkeletonProps
  extends BaseSkeletonProps {
  type: 'successFailureIndicator';
  retryIsAutoPhase?: boolean;
}

export interface GeoMapSkeletonProps extends BaseSkeletonProps {
  type: 'geoMap';
  retryIsAutoPhase?: boolean;
}

export type ChartSkeletonProps =
  | BarSkeletonProps
  | HorizontalBarSkeletonProps
  | DoughnutSkeletonProps
  | LineSkeletonProps
  | ConnectedScatterSkeletonProps
  | BubbleSkeletonProps
  | HorizontalFunnelSkeletonProps
  | HeatMapSkeletonProps
  | HeatMapWeekMonthSkeletonProps
  | GaugeSkeletonProps
  | VerticalFunnelSkeletonProps
  | BrushBarSkeletonProps
  | TreeMapSkeletonProps
  | SuccessFailureIndicatorSkeletonProps
  | GeoMapSkeletonProps;

export const SKELETON_ANIMATION_CLASSES = {
  pulse: 'animate-pulse',
  shimmer: 'animate-shimmer',
  wave: 'animate-wave',
} as const;
