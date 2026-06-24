import { render, screen } from '@testing-library/react';
import {
  ScatterPlotChart,
  ScatterPlotData,
} from '../ScatterPlotChart/ScatterPlotChart';

describe('ScatterPlotChart', () => {
  const mockBarChartData: ScatterPlotData[] = [
    { amount: 50, timeSpent: 10, value: 100 },
    { amount: 30, timeSpent: 20, value: 200 },
    { amount: 70, timeSpent: 15, value: 150 },
    { amount: 90, timeSpent: 25, value: 300 },
    { amount: 60, timeSpent: 30, value: 250 },
    { amount: 80, timeSpent: 35, value: 350 },
    { amount: 40, timeSpent: 5, value: 50 },
    { amount: 20, timeSpent: 8, value: 80 },
    { amount: 10, timeSpent: 12, value: 120 },
    { amount: 100, timeSpent: 40, value: 400 },
  ];

  it('renders correctly with default props', () => {
    render(
      <ScatterPlotChart
        chartData={mockBarChartData}
        width={600}
        height={400}
        xLabel="X Axis"
        yLabel="Y Axis"
        xAxisNumTicks={5}
        yAxisNumTicks={5}
        scatterRadius={4}
        scatterColor="#F15701"
        wrapperClassName="scatter-plot-chart"
        dataTestId="scatter-plot-chart-testId"
      />,
    );
    expect(screen.getByTestId('scatter-plot-chart-testId')).toMatchSnapshot();
  });
});
