import { render, screen } from '@testing-library/react';
import { RadarGraph, RadarGraphData } from '../RadarGraphChart/RadarGraph';

describe('RadarGraphChart', () => {
  const data1: RadarGraphData[] = [
    { label: 'Sales', value: 80 },
    { label: 'Marketing', value: 90 },
    { label: 'Information Technology', value: 60 },
    { label: 'Development', value: 70 },
    { label: 'Customer Support', value: 80 },
    { label: 'Administration', value: 85 },
  ];

  const data2: RadarGraphData[] = [
    { label: 'Sales', value: 70 },
    { label: 'Marketing', value: 60 },
    { label: 'Information Technology', value: 80 },
    { label: 'Development', value: 90 },
    { label: 'Customer Support', value: 60 },
    { label: 'Administration', value: 75 },
  ];

  const data3: RadarGraphData[] = [
    { label: 'Sales', value: 60 },
    { label: 'Marketing', value: 70 },
    { label: 'Information Technology', value: 90 },
    { label: 'Development', value: 80 },
    { label: 'Customer Support', value: 90 },
    { label: 'Administration', value: 65 },
  ];

  const setupMultipleData = [
    {
      scale: [20, 40, 60, 80, 100],
      color: 'rgba(255, 0, 0, 1)',
      data: data1,
    },
    {
      scale: [20, 40, 60, 80, 100],
      color: 'rgba(0, 255, 0, 1)',
      data: data2,
    },
    {
      scale: [20, 40, 60, 80, 100],
      color: 'rgba(0, 0, 255, 1)',
      data: data3,
    },
  ];

  it('renders correctly with default props', () => {
    render(
      <RadarGraph
        height={600}
        width={600}
        setupData={setupMultipleData}
        shadowColor="#F15701"
      />,
    );
    expect(screen.getByTestId('radar-graph-testId')).toMatchSnapshot();
  });
});
