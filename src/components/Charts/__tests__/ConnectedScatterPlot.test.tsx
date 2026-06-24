import { render, screen } from '@testing-library/react';
import {
  ConnectedScatterPlotData,
  SeriesConnectedScatterPlotData,
} from '../ConnectedScatterPlot/types';
import { ConnectedScatterPlot } from '../ConnectedScatterPlot';

describe('Connected Scatter Plot Chart', () => {
  beforeEach(() => {
    global.ResizeObserver = jest.fn().mockImplementation(() => ({
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect: jest.fn(),
    }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockChartData: SeriesConnectedScatterPlotData[] = [
    {
      id: 'series-1',
      data: [
        { xValue: 0, yValue: 12000 },
        { xValue: 10, yValue: 15000 },
        { xValue: 20, yValue: 28000 },
        { xValue: 30, yValue: 31000 },
        { xValue: 40, yValue: 21000 },
        { xValue: 50, yValue: 25000 },
        { xValue: 60, yValue: 20000 },
      ],
      scatterDotColorOpacity: 72,
      scatterDotColor: '#F15701',
      scatterDotVariant: 'filled',
      scatterConnectionLineColor: '#F15701',
    },
    {
      id: 'series-2',
      data: [
        { xValue: 0, yValue: 30000 },
        { xValue: 10, yValue: 35000 },
        { xValue: 20, yValue: 18000 },
        { xValue: 30, yValue: 10000 },
        { xValue: 40, yValue: 30000 },
        { xValue: 50, yValue: 11000 },
        { xValue: 60, yValue: 33000 },
      ],
      scatterDotColorOpacity: 60,
      scatterDotColor: '#0A74DA',
      scatterDotVariant: 'outlined',
      scatterConnectionLineColor: '#0A74DA',
    },
  ];

  const mockChartData2: ConnectedScatterPlotData[] = [
    { xValue: 0, yValue: 12000 },
    { xValue: 10, yValue: 15000 },
    { xValue: 20, yValue: 28000 },
    { xValue: 30, yValue: 31000 },
    { xValue: 40, yValue: 21000 },
    { xValue: 50, yValue: 25000 },
    { xValue: 60, yValue: 20000 },
  ];

  it('renders correctly with default props', () => {
    render(
      <ConnectedScatterPlot
        margins={{ top: 60, right: 10, bottom: 60, left: 40 }}
        chartData={mockChartData}
        height={500}
        width={800}
        showToolTip
        xLabel="Time Spent (minutes)"
        yLabel="Amount Spent (INR)"
        yAxisNumTicks={5}
        xAxisNumTicks={6}
      />,
    );
    expect(
      screen.getByTestId('ConnectedScatterPlotChart-testId'),
    ).toMatchSnapshot();
  });

  it('renders single with default props', () => {
    render(
      <ConnectedScatterPlot
        margins={{ top: 60, right: 10, bottom: 60, left: 40 }}
        chartData={mockChartData2}
        height={500}
        width={800}
        showToolTip
        yAxisNumTicks={5}
        xAxisNumTicks={6}
        xLabel="Time Spent (minutes)"
        yLabel="Amount Spent (INR)"
      />,
    );
    expect(
      screen.getByTestId('ConnectedScatterPlotChart-testId'),
    ).toMatchSnapshot();
  });
});
