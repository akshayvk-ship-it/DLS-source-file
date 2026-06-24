import { render, screen } from '@testing-library/react';
import { BarChart } from '../BarChart';
import { HorizontalAxisLegendProps } from '../Legends/HorizontalAxisLegend';
import { AxisLegends } from '../Legends';

describe('BarChart', () => {
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

  const mockBarChartData = [
    { label: 'x1', value: 10 },
    { label: 'x2', value: 100 },
    { label: 'x3', value: 90 },
    { label: 'x4', value: 0 },
    { label: 'x5', value: 40 },
    { label: 'x6', value: 60 },
    { label: 'x7', value: 90 },
  ];

  const mockMargins = { top: 25, right: 20, bottom: 40, left: 50 };

  it('renders correctly with default props', () => {
    render(
      <BarChart
        barChartData={mockBarChartData}
        margins={mockMargins}
        height={400}
        width={600}
      />,
    );
    expect(screen.getByTestId('bar-chart-test-id')).toMatchSnapshot();
  });

  it('renders legend with custom labels', () => {
    const axisLegends: AxisLegends = {
      xAxisValue: 'Sample Text',
      yAxisValue: 'Sample Text',
      xAxisLabel: 'X Axis:',
      yAxisLabel: 'Y Axis',
    };

    const horizontalAxisLegends: Omit<HorizontalAxisLegendProps, 'totalValue'> =
      {
        xAxisLegends: [
          { label: 'X1', value: 'Sample text 1' },
          { label: 'X2', value: 'Sample text 2' },
          { label: 'X3', value: 'Sample text 3' },
          { label: 'X4', value: 'Sample text 4' },
          { label: 'X5', value: 'Sample text 5' },
          { label: 'X6', value: 'Sample text 6' },
        ],
      };

    const mockLegendProps = {
      axisLegends,
      horizontalAxisLegends,
    };

    render(
      <BarChart
        barChartData={mockBarChartData}
        margins={mockMargins}
        height={400}
        width={600}
        legendsProps={mockLegendProps}
      />,
    );

    const legend = screen.getByTestId('legend-testId');
    expect(legend).toBeInTheDocument();
    expect(legend).toMatchSnapshot();
  });
});
