import { useMemo, useState } from 'react';
import { LinearLegendData } from './LinearLegend';

export default function useLinearLegend<T>(
  legendData: LinearLegendData[] | null,
  chartLabels: T[],
) {
  const legendLabels = useMemo(
    () => (legendData ? legendData.map((legend) => legend.label) : []),
    [legendData],
  );

  const legendLabelToChartLabelMapping = useMemo(() => {
    const map: Map<string, T> = new Map();
    if (!legendLabels) return map;
    legendLabels.forEach((legend, chartIndex) => {
      map.set(legend, chartLabels[chartIndex]!);
    });
    return map;
  }, [chartLabels, legendLabels]);

  const [selectedLegendLabels, setSelectedLegendLabels] = useState<string[]>(
    () =>
      legendData
        ? legendData
            .filter((legend) => legend.checked)
            .map((legend) => legend.label)
        : [],
  );

  const handleLegendSelection = (selectedLabels: string[]) => {
    setSelectedLegendLabels(selectedLabels);
  };

  const selectedChartLabels = useMemo(
    () =>
      Array.from(selectedLegendLabels).map(
        (label) => legendLabelToChartLabelMapping.get(label)!,
      ),
    [legendLabelToChartLabelMapping, selectedLegendLabels],
  );

  return {
    selectedChartLabels,
    handleLegendSelection,
  };
}
