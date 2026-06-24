import { render, screen } from '@testing-library/react';
import {
  SuccessAndFailureChartData,
  SuccessFailureIndicatorChart,
} from '../SuccessFailureIndicatorChart';

describe('SuccessFailureIndicatorChart', () => {
  const timeData: SuccessAndFailureChartData[] = [
    {
      key: 'key 1',
      timestamp: '2025-04-01T02:00:00Z',
      uptime: 99.8,
      toolTipInfoText1: 'Info 1',
      toolTipInfoText2: 'Info 1',
    },
    {
      key: 'key 2',
      timestamp: '2025-04-02T00:00:00Z',
      uptime: 29.9,
      toolTipInfoText1: 'Info 2',
      toolTipInfoText2: 'Info 2',
    },
    {
      key: 'key 3',
      timestamp: '2025-04-03T04:00:00Z',
      uptime: 98.7,
      toolTipInfoText1: 'Info 3',
      toolTipInfoText2: 'Info 3',
    },
    {
      key: 'key 4',
      timestamp: '2025-04-04T00:00:00Z',
      uptime: 99.5,
      toolTipInfoText1: 'Info 4',
      toolTipInfoText2: 'Info 4',
    },

    {
      key: 'key 5',
      timestamp: '2025-04-04T00:00:00Z',
      uptime: 9.5,
      toolTipInfoText1: 'Info 5',
      toolTipInfoText2: 'Info 5',
    },

    {
      key: 'key 6',
      timestamp: '2025-04-04T00:00:00Z',
      uptime: 9.5,
      toolTipInfoText1: 'Info 6',
      toolTipInfoText2: 'Info 6',
    },

    {
      key: 'key 7',
      timestamp: '2025-04-01T02:00:00Z',
      uptime: 99.8,
      toolTipInfoText1: 'Info 7',
      toolTipInfoText2: 'Info 7',
    },
    {
      key: 'key 8',
      timestamp: '2025-04-02T00:00:00Z',
      uptime: 29.9,
      toolTipInfoText1: 'Info 8',
      toolTipInfoText2: 'Info 8',
    },
    {
      key: 'key 9',
      timestamp: '2025-04-03T04:00:00Z',
      uptime: 98.7,
      toolTipInfoText1: 'Info 9',
      toolTipInfoText2: 'Info 9',
    },
    {
      key: 'key 10',
      timestamp: '2025-04-04T00:00:00Z',
      uptime: 99.5,
      toolTipInfoText1: 'Info 10',
      toolTipInfoText2: 'Info 10',
    },
  ];

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

  it('renders correctly with default props', () => {
    render(
      <SuccessFailureIndicatorChart
        height={56}
        chartData={timeData}
        margins={{
          top: 10,
          bottom: 10,
          left: 10,
          right: 10,
        }}
        threshold={{
          failure: 15,
          medium: 30,
        }}
        barColors={{
          failure: '#E5392D',
          medium: '#F2C81E',
          success: '#30D379',
        }}
        barClickHandler={() => null}
      />,
    );
    expect(
      screen.getByTestId('success-failure-indicator-chart'),
    ).toMatchSnapshot();
  });
});
