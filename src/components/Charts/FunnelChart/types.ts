import { HorizontalFunnelSkeletonProps } from '../ChartsSkeletonLoader';
import { DataNotAvailableProps } from '../NoDataSkeleton/DataNotAvailable';

export type FunnelType = 'Stepped' | 'Curved';
export type ColorPalette = [string, string];
export type LegendVariant = 'Type1Variant' | 'Type2Variant' | 'Type3Variant';

export interface FunnelChartData {
  index: number;
  label: string;
  value: number;
  subLabel?: string;
}

export interface FunnelChartMargins {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface FunnelChartProps {
  type?: FunnelType;
  width: number;
  height: number;
  chartData: FunnelChartData[];
  margins: FunnelChartMargins;
  colorPalette: ColorPalette;
  hasLayers: boolean;
  chartType?: FunnelType;
  dataTestId?: string;
  wrapperClassName?: string;
  isLoading?: boolean;
  skeletonProps?: Omit<
    HorizontalFunnelSkeletonProps,
    'height' | 'width' | 'margins' | 'animate' | 'type'
  >;
  noDataSkeletonProps?: DataNotAvailableProps;
}
