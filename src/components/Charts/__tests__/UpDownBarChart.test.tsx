import { render, screen } from '@testing-library/react';
import { UpDownBarChart } from '../UpDownBarChart';

describe('UpDownBarChart', () => {
  const mockBarChartData = [
    { label: 'x1', successRate: 70, failureRate: 30 },
    { label: 'x2', successRate: 20, failureRate: 80 },
    { label: 'x3', successRate: 90, failureRate: 10 },
    { label: 'x4', successRate: 40, failureRate: 60 },
    { label: 'x5', successRate: 60, failureRate: 40 },
  ];

  const mockMargins = { top: 20, right: 20, bottom: 20, left: 20 };

  it('renders correctly with default props', () => {
    render(
      <UpDownBarChart
        barChartData={mockBarChartData}
        margins={mockMargins}
        height={400}
        width={600}
      />,
    );
    expect(screen.getByTestId('UpDownBarChart-testId')).toMatchSnapshot();
  });
});
