import { render, screen } from '@testing-library/react';
import { PieChart } from '../PieChart';

describe('PieChart', () => {
  const mockPieChartData = [
    { label: 'x1', value: 50, key: 'key-1' },
    { label: 'x2', value: 20, key: 'key-2' },
    { label: 'x3', value: 70, key: 'key-3' },
    { label: 'x4', value: 40, key: 'key-4' },
    { label: 'x5', value: 60, key: 'key-5' },
  ];

  const mockColor = [
    '#5F6FFC',
    '#5F6FFC66',
    '#5F6FFC52',
    '#5F6FFC3D',
    '#5F6FFC29',
    '#5F6FFC14',
  ];

  const mockMargins = { top: 20, right: 20, bottom: 20, left: 20 };

  it('renders correctly with default props', () => {
    render(
      <PieChart
        pieChartData={mockPieChartData}
        margin={mockMargins}
        height={400}
        width={600}
        colorPalette={mockColor}
      />,
    );
    expect(screen.getByTestId('pie-chart-test-id')).toMatchSnapshot();
  });

  it('renders legend with correct data', () => {
    render(
      <PieChart
        pieChartData={mockPieChartData}
        margin={mockMargins}
        height={400}
        width={600}
        colorPalette={mockColor}
        legendProps={{
          legendsInfo: 'Sample Legend Info',
        }}
      />,
    );

    const legend = screen.getByText('Sample Legend Info');
    expect(legend).toBeInTheDocument();
  });
});
