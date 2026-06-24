import { render } from '@testing-library/react';
import { BubbleChart, BubbleChartData } from '../BubbleChart';

describe('BubbleChart Snapshot', () => {
  const sampleData: BubbleChartData[] = [
    { xValue: 'Jan', yValue: 10, zValue: 5 },
    { xValue: 'Feb', yValue: 30, zValue: 25 },
    { xValue: 'Mar', yValue: 50, zValue: 45 },
    { xValue: 'Apr', yValue: 70, zValue: 65 },
    { xValue: 'May', yValue: 90, zValue: 85 },
  ];

  const colors = [
    '#00B5EF1F',
    '#00B5EF3D',
    '#00B5EF52',
    '#00B5EF61',
    '#00B5EF7A',
  ];

  it('matches snapshot', () => {
    const { container } = render(
      <BubbleChart
        bubbleChartData={sampleData}
        width={500}
        height={300}
        margin={{ top: 20, right: 20, bottom: 40, left: 40 }}
        colors={colors}
      />,
    );

    expect(container).toMatchSnapshot();
  });
});
