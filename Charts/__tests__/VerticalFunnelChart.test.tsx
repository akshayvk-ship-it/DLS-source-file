import { render } from '@testing-library/react';
import {
  VerticalFunnelChart,
  VerticalFunnelChartProps,
} from '../FunnelChart/VerticalFunnelChart';

const data = [
  {
    index: 0,
    label: 'Label1',
    value: 80000,
    subLabel: 'Sub Label',
  },
  {
    index: 1,
    label: 'Label2',
    value: 87000,
    subLabel: 'Sub Label',
  },
  {
    index: 2,
    label: 'Label3',
    value: 85000,
    subLabel: 'Sub Label',
  },
  {
    index: 3,
    label: 'Label4',
    value: 85000,
    subLabel: 'Sub Label',
  },
  {
    index: 4,
    label: 'Label5',
    value: 93000,
    subLabel: 'Sub Label',
  },
  {
    index: 5,
    label: 'Label6',
    value: 83000,
    subLabel: 'Sub Label',
  },
];

describe('FunnelChart Snapshot Test', () => {
  const mockProps: VerticalFunnelChartProps = {
    chartData: data,
    baseColor: '#F15701',
    legendVariant: 'Type1Variant',
    changePercentValueFormatter: (value) => value.toLocaleString(),
    valueFormatter: (value) => value.toLocaleString(),
    height: 650,
    width: 650,
    margins: {
      top: 25,
      right: 15,
      bottom: 40,
      left: 25,
    },
  };

  it('renders FunnelChart correctly', () => {
    const { container } = render(<VerticalFunnelChart {...mockProps} />);
    expect(container).toMatchSnapshot();
  });
});
