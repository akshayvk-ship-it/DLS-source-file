import { useMemo } from 'react';

interface ZeroEffectProps<T> {
  chartData: T[];
  valueKey: keyof T;
}

// eslint-disable-next-line import/prefer-default-export
export function useAllZeroEffect<T>({
  chartData,
  valueKey,
}: ZeroEffectProps<T>): boolean {
  const allZero = useMemo(() => {
    if (!Array.isArray(chartData)) return false;

    return chartData.every((data) => data[valueKey] === 0);
  }, [chartData, valueKey]);

  return allZero;
}
