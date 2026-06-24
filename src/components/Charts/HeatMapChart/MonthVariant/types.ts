import { HeatMapWeekMonthSkeletonProps } from '../../ChartsSkeletonLoader/types';
import { LinearLegendProps } from '../../Legends/LinearLegend';
import { DataNotAvailableProps } from '../../NoDataSkeleton/DataNotAvailable';
import { BinDataThreshold, PartialExcept } from '../types';

export type TooltipTrigger = 'hover' | 'click' | null;

export type TooltipMode = 'normal' | 'no-data' | 'null';

export type HeatMapBarProps = Omit<
  Required<HeatMapVariantMonthProps>,
  | 'isLoading'
  | 'skeletonProps'
  | 'noDataSkeletonProps'
  | 'binHoverBorderColorClassName'
> & {
  // make binHoverBorderColorClassName optional for the bar component
  binHoverBorderColorClassName?: string;
};

export type MonthGroup = {
  label: string;
  startIndex: number;
  endIndex: number;
};

export type ParsedEntry = {
  entry: HeatMapMonthChartData;
  parsed: ParsedDateRange | null;
};

export interface HeatMapMonthMargins {
  top: number;
  left: number;
  right: number;
  bottom: number;
}

export interface HeatMapMonthTooltipParams {
  label: string;
  binLabel: string;
  binCount: number;
}

export interface HeatMapMonthTooltipData {
  title: string;
  subtitle: string;
  bins?: {
    title?: string;
    subtitle?: string;
    count: number;
  }[];
}

export interface ParsedDateRange {
  startDay: number;
  endDay: number;
  startMonthIndex: number;
  endMonthIndex: number;
  startYear?: number;
  endYear?: number;
}

export interface HeatMapMonthBins {
  count: number;
  label: string;
}

export interface HeatMapMonthChartData {
  label: string;
  bins: HeatMapMonthBins[];
}

export interface HeatMapMonthTooltipProps {
  isLoading: boolean;
  coordinates: { x: number; y: number };
  tooltipData: HeatMapMonthTooltipData | null;
  colorPalette: string[];
  tooltipWrapperClassName?: string;
  miniBinThresholds?: BinDataThreshold[];
  tooltipContentWrapperClassName?: string;
  tooltipTrigger: TooltipTrigger;
  tooltipMode: TooltipMode;
  noDataLegendDescription: string;
}

export interface HeatMapVariantMonthProps
  extends Pick<
    HeatMapMonthTooltipProps,
    'tooltipWrapperClassName' | 'tooltipContentWrapperClassName'
  > {
  wrapperClassName?: string;
  xAxisLabelClassName?: string;
  binDataThreshold?: BinDataThreshold[];
  legendsProps?: PartialExcept<
    Omit<LinearLegendProps, 'isOutlined' | 'isSelectable' | 'legendType'>,
    'legendData'
  >;
  noDataLegendLabel?: string;
  enableMinBinWidth?: boolean;
  noDataLegendDescription?: string;
  nullLegendLabel?: string;
  nullLegendDescription?: string;
  height: number;
  verticalGap?: number;
  horizontalGap?: number;
  groupGap?: number;
  heatMapMonthBinData: HeatMapMonthChartData[];
  chartData?: HeatMapMonthChartData[];
  width: number;
  margins: HeatMapMonthMargins;
  colorPalette?: string[];
  dataTestId?: string;
  onBinClick: (
    params: HeatMapMonthTooltipParams,
  ) => Promise<HeatMapMonthTooltipData>;
  highlightedLabels?: string[];
  isLoading?: boolean;
  skeletonProps?: Omit<
    HeatMapWeekMonthSkeletonProps,
    'height' | 'width' | 'margins' | 'type' | 'animate'
  >;
  noDataSkeletonProps?: DataNotAvailableProps;
  enableSorting?: boolean;
  binHoverBorderColorClassName?: string;
}
