import { render, screen } from '@testing-library/react';
import {
  GroupedBarChart,
  GroupedBarChartData,
} from '../BarChart/GroupedBarChart';

const mockBarChartData = [
  { label: 'A', Q1: 10, Q2: 15, Q3: 12 },
  { label: 'B', Q1: 12, Q2: 8, Q3: 18 },
  { label: 'C', Q1: 5, Q2: 16, Q3: 10 },
];

const mockMargins = { top: 20, right: 20, bottom: 20, left: 20 };

describe('GroupedBarChart', () => {
  it('renders correctly with default props', () => {
    const { asFragment } = render(
      <GroupedBarChart
        barChartData={mockBarChartData as unknown as GroupedBarChartData[]}
        margins={mockMargins}
        height={400}
        width={600}
      />,
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders the chart container with the correct data-testid', () => {
    render(
      <GroupedBarChart
        barChartData={mockBarChartData as unknown as GroupedBarChartData[]}
        margins={mockMargins}
        height={400}
        width={600}
        dataTestId="grouped-bar-chart-testid"
      />,
    );
    const chartContainer = screen.getByTestId('grouped-bar-chart-testid');
    expect(chartContainer).toBeInTheDocument();
  });
});
