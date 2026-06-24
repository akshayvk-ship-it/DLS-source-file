import { render, screen } from '@testing-library/react';
import { HeatMapChart } from '../HeatMapChart';
import { HeatMapLegendProps } from '../HeatMapChart/HeatMapLegend';
import { HealthHeatMapChartData } from '../HeatMapChart/types';

describe('HeatMap Chart', () => {
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

  const binData = [
    {
      label: 'Sun',
      bins: [
        {
          count: 194.3713815882802,
          label: '12 AM',
        },
        {
          count: 110.96758241183124,
          label: '2 AM',
        },
        {
          count: 260.06357367150486,
          label: '4 AM',
        },
        {
          count: 280.9758269635495,
          label: '6 AM',
        },
        {
          count: 106.24485542066395,
          label: '8 AM',
        },
        {
          count: 264.72368314280175,
          label: '10 AM',
        },
        {
          count: 139.6381496451795,
          label: '12 PM',
        },
      ],
    },
    {
      label: 'Mon',
      bins: [
        {
          count: 0.03894627839327,
          label: '12 AM',
        },
        {
          count: 43.576154712354764,
          label: '2 AM',
        },
        {
          count: 58.28486732207239,
          label: '4 AM',
        },
        {
          count: 187.0171299611684,
          label: '6 AM',
        },
        {
          count: 13.819112302735448,
          label: '8 AM',
        },
        {
          count: 117.99892736016773,
          label: '10 AM',
        },
        {
          count: 72.25715974345803,
          label: '12 PM',
        },
      ],
    },
  ];

  const mockMargins = { top: 25, right: 20, bottom: 40, left: 50 };

  it('renders heatmap correctly with default props', () => {
    render(
      <HeatMapChart
        heatMapChartData={binData}
        colorRange="#124321"
        margins={mockMargins}
        height={400}
        width={600}
      />,
    );
    expect(screen.getByTestId('heat-map-chart')).toMatchSnapshot();
  });

  it('renders heatmap legend with custom labels', () => {
    const mockLegendProps: HeatMapLegendProps = {
      monthInfo: {
        direction: 'up',
        percentValue: '12.55',
        value: '325,758.89',
      },
      todayInfo: {
        direction: 'up',
        percentValue: '13.75',
        value: '6,758.89',
      },
      primaryColor: '#43214b',
      weekInfo: {
        direction: 'down',
        percentValue: '10.73',
        value: '16,758.89',
      },
    };

    render(
      <HeatMapChart
        heatMapChartData={binData}
        colorRange="#124321"
        margins={mockMargins}
        height={400}
        width={600}
        heatMapLegends={mockLegendProps}
      />,
    );

    const legend = screen.getByTestId('heat-map-legend');
    expect(legend).toBeInTheDocument();
    expect(legend).toMatchSnapshot();
  });

  const healthBinData: HealthHeatMapChartData[] = [
    {
      label: 'Sun',
      bins: [
        { count: 10, label: '12 AM', status: 'Success' },
        { count: 20, label: '2 AM', status: 'Warning' },
        { count: 30, label: '4 AM', status: 'Danger' },
        { count: 0, label: '6 AM', status: 'Empty' },
      ],
    },
    {
      label: 'Mon',
      bins: [
        { count: 15, label: '12 AM', status: 'Success' },
        { count: 25, label: '2 AM', status: 'Warning' },
        { count: 35, label: '4 AM', status: 'Danger' },
        { count: 5, label: '6 AM', status: 'Empty' },
      ],
    },
  ];

  const colorMapping = {
    Success: '#17B26A',
    Warning: '#FFC533',
    Danger: '#A8063C',
    Empty: '#FAFBFB',
  };

  it('renders health heatmap correctly with default props', () => {
    render(
      <HeatMapChart
        heatMapChartData={healthBinData}
        margins={mockMargins}
        isHealth
        colorMapping={colorMapping}
        height={400}
        width={600}
      />,
    );

    expect(screen.getByTestId('heat-map-chart')).toMatchSnapshot();
  });
});
