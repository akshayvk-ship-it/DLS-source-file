// For backward compatibility
// TODO: Remove this file in next major release

import { useMemo } from 'react';
import {
  ConnectedScatterPlotProps,
  SeriesConnectedScatterPlotData,
  ConnectedScatterPlotData,
} from './types';

const useBackwardCompatibility = (props: ConnectedScatterPlotProps) => {
  const {
    chartData,
    scatterColor,
    isSeries = false,
    margins,
    xAxisTickFormatter,
  } = props;

  const useChartData: SeriesConnectedScatterPlotData[] = useMemo(() => {
    if (!isSeries) {
      return [
        {
          id: 'scatter-plot-connected-1',
          data: Array.isArray(chartData)
            ? (chartData as ConnectedScatterPlotData[])
            : [],
          scatterDotColorOpacity: 100,
          scatterDotColor: scatterColor ?? '#F15701',
          scatterConnectionLineColor: scatterColor ?? '#F15701',
          scatterDotVariant: 'filled',
        },
      ];
    }

    return Array.isArray(chartData)
      ? (chartData as SeriesConnectedScatterPlotData[])
      : [];
  }, [chartData, scatterColor, isSeries]);

  const useMargins = useMemo(() => {
    if (margins) {
      return margins;
    }

    return {
      top: 60,
      right: 10,
      bottom: 60,
      left: 40,
    };
  }, [margins]);

  const useXAxisTickFormatter = useMemo(() => {
    if (xAxisTickFormatter) {
      return (value: number) => xAxisTickFormatter(value.toString());
    }

    return undefined;
  }, [xAxisTickFormatter]);

  return {
    chartData: useChartData,
    margins: useMargins,
    xAxisTickFormatter: useXAxisTickFormatter,
  };
};

export default useBackwardCompatibility;
