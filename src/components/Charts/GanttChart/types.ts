export type GanttChartData = {
  label: string;
  startDate: Date;
  endDate: Date;
  progress: number;
  textValue: string;
};

export type GanttChartMargins = {
  top: number;
  right: number;
  bottom: number;
  left: number;
};

export interface GanttChartProps {
  chartColor: ColorMappingGanttChart;
  margins: GanttChartMargins;
  minProgress?: number;
  maxProgress?: number;
  ganttChartData: GanttChartData[];
  wrapperClassName?: string;
  dataTestId?: string;
  width: number;
  height: number;
}

/* eslint-disable import/prefer-default-export */
export enum ColorMappingGanttChart {
  ORANGE = 'orange',
  PURPLE = 'purple',
  BLUE = 'blue',
}
