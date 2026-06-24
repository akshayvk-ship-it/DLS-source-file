export interface HorizontalBarChartData {
  label: string;
  value: number;
  insideLabel?: string;
  color?: string;
  barBorderColorOpacity?: number;
  barBgColorOpacity?: number;
  barShadowColorOpacity?: number;
  barDiagonalColorOpacity?: number;
}

export interface HorizontalBarChartMargins {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface HorizontalBarGradientValues {
  stopColor1?: string;
  stopColor2?: string;
  offset1?: string;
  offset2?: string;
}

export interface HorizontalChartShadowColors {
  maxFloodColor?: string;
  floodColor?: string;
}

export type BarColorType = 'bar' | 'shadow' | 'stroke' | 'diagonal';

export type ColorsSupported =
  | '#FF6914'
  | '#5F6FFC'
  | '#9355FA'
  | '#FEC75F'
  | '#DF53DE'
  | '#93D410';

export interface HorizontalDiagonalLineColors {
  bgClassName: string;
  lineClassName: string;
}

export type OpacityValues = {
  bar?: number;
  diagonal?: number;
  shadow?: number;
  border?: number;
};
