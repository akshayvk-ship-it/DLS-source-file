import {
  HeatMapSkeletonProps,
  HeatMapWeekMonthSkeletonProps,
} from '../ChartsSkeletonLoader';
import { LinearLegendProps } from '../Legends/LinearLegend';
import { DataNotAvailableProps } from '../NoDataSkeleton/DataNotAvailable';
import { HeatMapLegendProps } from './HeatMapLegend';

export type PartialExcept<T, K extends keyof T> = Partial<T> & Pick<T, K>;

export type TooltipMode = 'normal' | 'no-data' | 'null';
export interface BinDataThreshold {
  color: string;
  minValue: number;
  maxValue: number;
  tooltipLabel: string;
}

export interface HeatMapMargins {
  top: number;
  left: number;
  right: number;
  bottom: number;
}

export type Bins = {
  count: number;
  label: string;
  tooltipElement?: JSX.Element;
};

export interface HealthToolTipData {
  x: number;
  y: number;
  color: string;
  element: JSX.Element | undefined;
  textValue: string;
  isEmpty: boolean;
}

export type BinsWithStatus = Bins & {
  status: 'Success' | 'Warning' | 'Danger' | 'Empty';
};

export type HeatMapChartData = { label: string; bins: Bins[] };
export type HealthHeatMapChartData = { label: string; bins: BinsWithStatus[] };

type BaseHeatMapChartProps = {
  height: number;
  width: number;
  wrapperClassName?: string;
  legendsProps?: PartialExcept<
    Omit<LinearLegendProps, 'isOutlined' | 'isSelectable' | 'legendType'>,
    'legendData'
  >;
  binDataThreshold?: BinDataThreshold[];
  enableMinBinWidth?: boolean;
  highlightedLabels?: string[];
  dataTestId?: string;
  margins: HeatMapMargins;
  heatMapLegends?: HeatMapLegendProps;
  variant?: 'horizontal' | 'vertical';
  heatMapGap?: number;
  heatMapBinRadius?: number;
  isLoading?: boolean;
  skeletonProps?: Omit<
    HeatMapSkeletonProps,
    'height' | 'width' | 'margins' | 'animate' | 'type'
  >;
  noDataSkeletonProps?: DataNotAvailableProps;
  tooltipValueFormatter?: (value: number) => string;
  tooltipTopMargin?: number;
  noDataLegendLabel?: string;
  noDataLegendDescription?: string;
  noDataTooltipLabel?: string;
  tooltipWrapperClassName?: string;
};

export type HeatMapChartProps = BaseHeatMapChartProps &
  (
    | {
        isHealth?: false;
        heatMapChartData: HeatMapChartData[];
        chartData?: HeatMapChartData[];
        colorRange: [string, string] | string;
        colorOpacityRange?: [number, number];
        fillEmptyState?: boolean;
        showTooltip?: boolean;
      }
    | {
        isHealth?: true;
        colorMapping?: Record<'Success' | 'Warning' | 'Danger', string> &
          Partial<Record<'Empty', string>>;
        heatMapChartData: HealthHeatMapChartData[];
        showTooltip?: boolean;
        chartData?: HeatMapChartData[];
        colorMappingHover?: Record<'Success' | 'Warning' | 'Danger', string> &
          Partial<Record<'Empty', string>>;
      }
  );

export interface HeatMapVariantWeekProps {
  wrapperClassName?: string;
  height: number;
  groupGap?: number;
  verticalGap?: number;
  legendsProps?: PartialExcept<
    Omit<LinearLegendProps, 'isOutlined' | 'isSelectable' | 'legendType'>,
    'legendData'
  >;
  enableMinBinWidth?: boolean;
  binHoverBorderColorClassName?: string;
  horizontalGap?: number;
  heatMapWeekBinData: HeatMapChartData[];
  chartData?: HeatMapChartData[];
  width: number;
  margins?: HeatMapMargins;
  colorArray?: string[];
  dataTestId?: string;
  highlightedLabels?: string[];
  tooltipTopMargin?: number;
  tooltipFormatter?: (value: number) => string;
  binDataThreshold?: BinDataThreshold[];
  isLoading?: boolean;
  skeletonProps?: Omit<
    HeatMapWeekMonthSkeletonProps,
    'height' | 'width' | 'margins' | 'type' | 'animate'
  >;
  noDataSkeletonProps?: DataNotAvailableProps;
  noDataLegendLabel?: string;
  noDataLegendDescription?: string;
  nullLegendLabel?: string;
  nullLegendDescription?: string;
}

export type TooltipData = {
  x: number;
  y: number;
  labelRow: string;
  labelColumn: string;
  value: number;
  color: string;
  row: number;
  textValue: string;
  element: JSX.Element | undefined;
  col: number;
  mode: TooltipMode;
};
