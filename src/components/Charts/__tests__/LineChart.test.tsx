import { render, screen } from '@testing-library/react';
import { LineChart } from '../LineChart';

describe('LineChart', () => {
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

  const dataBar = [
    { label: 'x1', value: 10 },
    { label: 'x2', value: 100 },
    { label: 'x3', value: 90 },
    { label: 'x4', value: 0 },
    { label: 'x5', value: 40 },
    { label: 'x6', value: 60 },
    { label: 'x7', value: 90 },
  ];

  const dataBar2 = [
    { label: 'x1', value: 86 },
    { label: 'x2', value: 97 },
    { label: 'x3', value: 10 },
    { label: 'x4', value: 120 },
    { label: 'x5', value: 90 },
    { label: 'x6', value: 0 },
    { label: 'x7', value: 100 },
  ];

  const dataBar3 = [
    { label: 'x1', value: 26 },
    { label: 'x2', value: 67 },
    { label: 'x3', value: 50 },
    { label: 'x4', value: 20 },
    { label: 'x5', value: 140 },
    { label: 'x6', value: 0 },
    { label: 'x7', value: 180 },
  ];

  const mockMargins = { top: 20, right: 20, bottom: 20, left: 20 };

  it('Render Line Chart', () => {
    render(
      <LineChart
        lineChartType={{
          series: false,
          lineChartData: dataBar,
          lineStrokeColor: '#9355FA',
        }}
        margins={mockMargins}
        height={400}
        width={600}
      />,
    );
    expect(screen.getByTestId('line-chart-test-id')).toMatchSnapshot();
  });

  it('Render Line Chart with Series', () => {
    render(
      <LineChart
        lineChartType={{
          series: true,
          lineChartSeries: [dataBar, dataBar2, dataBar3],
          lineStrokeColor: ['#9355FA', '#fa2a23', '#54f29a'],
        }}
        margins={mockMargins}
        height={400}
        width={600}
      />,
    );

    expect(screen.getByTestId('line-chart-test-id')).toMatchSnapshot();
  });
});
