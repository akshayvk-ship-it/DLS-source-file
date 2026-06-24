import { ConnectedScatterSkeletonProps } from '../ChartsSkeletonLoader';
import { DataNotAvailableProps } from '../NoDataSkeleton/DataNotAvailable';

export type OpacityValueType = 100 | 72 | 60 | 40 | 24;

export type ScatterDotType = 'filled' | 'outlined';

export type DataPoint = { xValue: number; yValue: number };

export type ScatterDataPointType = {
  xValue: number;
  yValue: number;
  hasInterval?: boolean;
  isPredicted?: boolean;
};

export interface MarginDataType {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface ToolTipDataType {
  wrapperClassName?: string;
  customToolTipComponent?: React.FC<{ currentToolTip: ToolTipPlotDataType[] }>;
  toolTipArrowClassName?: string;
}

export type SeriesConnectedScatterPlotData = {
  id: string;
  data: ScatterDataPointType[];
  scatterDotColorOpacity: OpacityValueType;
  scatterDotColor: string;
  scatterConnectionLineColor: string;
  scatterDotVariant: ScatterDotType;
};

export type ConnectedScatterPlotData = {
  xValue: number;
  yValue: number;
  hasInterval?: boolean;
  isPredicted?: boolean;
};

type BaseConnectedScatterPlotProps = {
  width: number;
  height: number;
  xLabel: string;
  yLabel: string;
  margins?: MarginDataType;
  scatterRadius?: number;
  xAxisNumTicks?: number;
  yAxisNumTicks?: number;
  hideYAxisLabel?: boolean;
  hideXAxisLabel?: boolean;
  hideYAxisZero?: boolean;
  scatterColor?: string;
  yAxisTickFormatter?: (value: number) => string;
  xAxisTickFormatter?: (value: string) => string;
  wrapperClassName?: string;
  dataTestId?: string;
  hideGridColumns?: boolean;
  showFirstBottomAxisValue?: boolean;
  isLoading?: boolean;
  skeletonProps?: Omit<
    ConnectedScatterSkeletonProps,
    'height' | 'width' | 'margins' | 'animate' | 'type'
  >;
  noDataSkeletonProps?: DataNotAvailableProps;
  usePreciseTickCalculation?: boolean;
  customYAxisTicks?: number[];
  tooltipBehavior?: 'floating' | 'sticky';
};

export type ConnectedScatterPlotProps = BaseConnectedScatterPlotProps &
  (
    | {
        showToolTip?: true;
        toolTipComponentProps?: ToolTipDataType;
      }
    | {
        showToolTip?: false;
        toolTipComponentProps?: never;
      }
  ) &
  (
    | {
        isSeries?: false;
        chartData: ConnectedScatterPlotData[];
      }
    | {
        isSeries?: true;
        chartData: SeriesConnectedScatterPlotData[];
      }
  );

export interface ToolTipPlotDataType {
  xValue: number;
  yValue: number;
  labelColor: string;
}

export interface ToolTipLeftArrowProps
  extends React.SVGAttributes<HTMLOrSVGElement> {
  className?: string;
}

export interface CustomToolTipComponentProps {
  isSeries: boolean;
  axisLeftTickFormatter?: (value: number) => string;
  axisBottomTickFormatter?: (value: number) => string;
  toolTipData: ToolTipPlotDataType[];
}
