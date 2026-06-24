import { BarColorType, HorizontalBarChartData, OpacityValues } from './types';

export const calculateLabelWidth = (label: string, font = '12px Arial') => {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  if (!context) return 0;
  context.font = font;
  return context.measureText(label).width + 10;
};

export const calculateMaxLabelWidth = (labels: string[], font = '12px Arial') =>
  Math.max(...labels.map((label) => calculateLabelWidth(label, font)));

export const getColor = (
  type: BarColorType,
  color: string,
  opacityValues: OpacityValues,
): string => {
  const defaultFactors: Record<BarColorType, number> = {
    bar: opacityValues.bar ?? 0.08,
    diagonal: opacityValues.diagonal ?? 0.12,
    shadow: opacityValues.shadow ?? 0.4,
    stroke: opacityValues.border ?? 0.24,
  };

  const specificFactorMap: Record<
    string,
    Partial<Record<BarColorType, number>>
  > = {
    '#FF6914': { shadow: 0.3 },
    '#FEC75F': { diagonal: 0.32, shadow: 0.6 },
    '#DF53DE': { shadow: 0.5 },
    '#93D410': { diagonal: 0.2, shadow: 0.5 },
  };

  const calculatedFactor =
    specificFactorMap[color]?.[type] ?? defaultFactors[type];

  const hex = color.slice(1);
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  return `rgba(${r}, ${g}, ${b}, ${calculatedFactor})`;
};

export const getParentPassedOpacityValues = (
  chartData: HorizontalBarChartData,
): OpacityValues => ({
  bar: chartData.barBgColorOpacity,
  diagonal: chartData.barDiagonalColorOpacity,
  shadow: chartData.barShadowColorOpacity,
  border: chartData.barBorderColorOpacity,
});
