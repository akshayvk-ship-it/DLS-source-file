import { LineSkeletonProps } from '../ChartsSkeletonLoader';
import { LegendsProps } from '../Legends';
import { DataNotAvailableProps } from '../NoDataSkeleton/DataNotAvailable';

export interface LineChartData {
  label: string;
  value: number;
  hasInterval?: boolean;
}

export interface ShowLineAreaGradient {
  stopColor1: string;
  stopColor2: string;
  stopOffset1: string;
  stopOffset2: string;
}

export type LineChartType =
  | {
      series: true;
      lineChartSeries: LineChartData[][];
      chartData?: LineChartData[][];
      lineStrokeColor: string[];
      lineAreaGradient?: ShowLineAreaGradient[];
    }
  | {
      series: false;
      lineChartData: LineChartData[];
      chartData?: LineChartData[];
      lineStrokeColor: string;
      lineAreaGradient?: ShowLineAreaGradient;
    };

export type LineChartRenderCustomComponent =
  | {
      showCustom: true;
      CustomComponent: React.FC<{ currentToolTip: LineChartData[] }>;
    }
  | {
      showCustom: false;
    };

export interface LineChartToolTipContent {
  className?: string;
  renderCustomComponent?: LineChartRenderCustomComponent;
  tooltipArrowClassName?: string;
  tooltipArrowColor?: string;
}

export interface LineChartMargins {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface LineChartProps {
  height: number;
  width: number;
  margins: LineChartMargins;
  axisLeftValueGap?: number;
  axisLeftTickFormatter?: (value: number) => string;
  axisBottomTickFormatter?: (value: string) => string;
  toolTipContent?: LineChartToolTipContent;
  dataTestId?: string;
  lineChartType: LineChartType;
  xAxisLabel?: string;
  yAxisLabel?: string;
  shouldShowMedianLine?: boolean;
  showTooltipPositionTop?: boolean;
  showColumnsLines?: boolean;
  isLoading?: boolean;
  skeletonProps?: Omit<
    LineSkeletonProps,
    'height' | 'width' | 'margins' | 'animate' | 'type'
  >;
  noDataSkeletonProps?: DataNotAvailableProps;
  usePreciseTickCalculation?: boolean;
  legendProps?: LegendsProps;
  tooltipBehavior?: 'sticky' | 'floating';
  enableHorizontalScroll?: boolean;
  minPointWidth?: number;
}
