import { SuccessFailureIndicatorSkeletonProps } from '../ChartsSkeletonLoader';
import { DataNotAvailableProps } from '../NoDataSkeleton/DataNotAvailable';

// TODO: Use this file for types in next major release and remove types from index.tsx

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

export type TooltipData = {
  currentElementSize: number;
  currentToolTip: CurrentToolTipContent;
};

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
  dataTestId?: string;
  resizeBarWidth?: boolean;
  isLoading?: boolean;
  skeletonProps?: Omit<
    SuccessFailureIndicatorSkeletonProps,
    'height' | 'width' | 'margins' | 'animate' | 'type'
  >;
  noDataSkeletonProps?: DataNotAvailableProps;
}
