import { render } from '@testing-library/react';
import { GaugeChart } from '../GaugeChart';

describe('GaugeChart', () => {
  const mockProps = {
    width: 500,
    height: 450,
    successColor: ['#00763F', '#00DD76'] as [string, string],
    failureColor: '#F5F5F5',
    chartData: {
      mainInfo: {
        label: 'Success Rate',
        value: 85,
        unit: '%',
        color: '#00763F',
      },
      info1: { label: 'Failure', value: 4, unit: '%', color: '#D2205B' },
      info2: { label: 'Avg Time', value: 5, unit: 'Sec', color: '#EDA200' },
      info3: { label: 'Drop Off', value: 2, unit: '%', color: '#D2205B' },
    },
    margin: { top: 30, right: 30, bottom: 30, left: 30 },
  };

  it('renders correctly with all props provided', () => {
    const { asFragment } = render(<GaugeChart {...mockProps} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders correctly with default props', () => {
    const { asFragment } = render(
      <GaugeChart
        width={600}
        height={400}
        successColor={['#00763F', '#00DD76']}
        failureColor="#F5F5F5"
        chartData={{
          mainInfo: {
            label: 'Success Rate',
            value: 85,
            unit: '%',
            color: '#00763F',
          },
          info1: { label: 'Failure', value: 4, unit: '%', color: '#D2205B' },
          info2: {
            label: 'Avg Time',
            value: 5,
            unit: 'Sec',
            color: '#EDA200',
          },
          info3: { label: 'Drop Off', value: 2, unit: '%', color: '#D2205B' },
        }}
        margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
      />,
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
