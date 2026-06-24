import { render } from '@testing-library/react';
import { FunnelChart } from '../FunnelChart';
import { FunnelChartProps } from '../FunnelChart/types';

describe('FunnelChart Snapshot Test', () => {
  const mockProps: FunnelChartProps = {
    width: 500,
    height: 300,
    chartData: [
      { index: 0, value: 100, label: 'Today' },
      { index: 1, value: 76, label: 'This week' },
      { index: 2, value: 55, label: 'This month' },
      { index: 3, value: 32, label: '6 months' },
      { index: 4, value: 25, label: '1 year' },
    ],
    margins: { top: 10, right: 10, bottom: 10, left: 10 },
    colorPalette: ['#FF6B6B', '#FFA07A'],
    hasLayers: true,
    chartType: 'Curved',
  };

  it('renders FunnelChart correctly', () => {
    const { container } = render(<FunnelChart {...mockProps} />);
    expect(container).toMatchSnapshot();
  });
});
