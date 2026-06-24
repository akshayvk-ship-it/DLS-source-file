import { render, screen } from '@testing-library/react';
import { GeoMap } from '../index';

describe('GeoMap', () => {
  const data = [
    {
      stateName: 'Maharashtra',
      value: 300,
    },
    {
      stateName: 'Kerala',
      value: 200,
      tooltipText: 'Tooltip text for Kerala',
    },
    {
      stateName: 'Tamil Nadu',
      value: 150,
      tooltipText: 'Main Text for Andhra Pradesh',
    },
    {
      stateName: 'Punjab',
      value: 180,
      tooltipText: 'Main Text for Punjab',
    },
  ];

  const citiesData = [
    {
      city: 'Mumbai',
      state: 'Maharashtra',
      value: 100000,
      tooltipText: 'Top City',
    },
    {
      city: 'Pune',
      state: 'Maharashtra',
      value: 80000,
      tooltipText: 'Second City',
    },
    {
      city: 'Nagpur',
      state: 'Maharashtra',
      value: 60000,
      tooltipText: 'Third City',
    },
    {
      city: 'Rupnagar',
      state: 'Punjab',
      value: 55000,
      tooltipText: 'Fourth City',
    },
    {
      city: 'Amritsar',
      state: 'Punjab',
      value: 50000,
      tooltipText: 'Fifth City',
    },
    {
      city: 'Ernakulam',
      state: 'Kerala',
      value: 70000,
    },
    {
      city: 'Thiruvananthapuram',
      state: 'Kerala',
      value: 70000,
    },
  ];

  const threshold = [
    {
      color: '#F7A171',
      minValue: 200,
      maxValue: 300,
    },
    {
      color: '#FBC9AE',
      minValue: 150,
      maxValue: 199,
    },
    {
      color: '#FEF2EB',
      minValue: 0,
      maxValue: 149,
    },
  ];

  beforeEach(() => {
    global.ResizeObserver = jest.fn().mockImplementation(() => ({
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect: jest.fn(),
    }));
  });

  it('renders GeoMap Component', () => {
    render(
      <GeoMap
        height={400}
        width={600}
        mapStateData={data}
        statesThreshold={threshold}
        citiesData={citiesData}
        miniMapStateLabel="Top State Transaction"
        miniMapLabel="Top Transaction"
      />,
    );
    expect(screen.getByTestId('geo-map-test-id')).toMatchSnapshot();
  });
});
