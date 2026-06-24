import { render, screen } from '@testing-library/react';
import { TreeMapChart } from '../TreeMap/TreeMapChart';
import { ColorMapping } from '../TreeMap/types';

describe('TreeMapChart', () => {
  const mockData = [
    { label: 'Item A', value: 20 },
    { label: 'Item B', value: 15 },
    { label: 'Item C', value: 15 },
    { label: 'Item D', value: 10 },
    { label: 'Item E', value: 10 },
    { label: 'Item F', value: 8 },
    { label: 'Item G', value: 7 },
    { label: 'Item H', value: 3 },
    { label: 'Item I', value: 3 },
    { label: 'Item J', value: 3 },
    { label: 'Item K', value: 1 },
    { label: 'Item L', value: 1 },
    { label: 'Item M', value: 1 },
    { label: 'Item N', value: 1 },
    { label: 'Item O', value: 1 },
    { label: 'Item P', value: 1 },
    { label: 'Item Q', value: 1 },
  ];

  beforeEach(() => {
    global.ResizeObserver = jest.fn().mockImplementation(() => ({
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect: jest.fn(),
    }));
  });

  it('renders correctly with default props', () => {
    render(
      <TreeMapChart
        colorType={ColorMapping.ORANGE}
        nodePadding={1}
        mapData={mockData}
        height={1184}
        width={293}
      />,
    );
    expect(screen.getByTestId('tree-map-chart')).toMatchSnapshot();
  });
});
