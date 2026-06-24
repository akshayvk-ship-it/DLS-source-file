import { render, screen } from '@testing-library/react';
import {HorizontalBarChart} from '../BarChart/HorizontalBarChart/HorizontalBarChart';

const mockHorizontalBarChartData = [
  { label: 'A', value: 10 },
  { label: 'B', value: 20 },
  { label: 'C', value: 15 },
];

const mockMargins = { top: 20, right: 20, bottom: 20, left: 20 };

const originalCreateElement = document.createElement.bind(document);

const mockMeasureText = jest.fn().mockReturnValue({ width: 10 });

const mockGetContext = jest.fn().mockReturnValue({
  font: '',
  measureText: mockMeasureText,
});

const mockCanvas = {
  getContext: mockGetContext,
  setAttribute: jest.fn(),
  style: {},
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  focus: jest.fn(),
  blur: jest.fn(),
  toDataURL: jest.fn(),
} as unknown as HTMLCanvasElement;

global.document.createElement = jest.fn((tagName) => {
  if (tagName === 'canvas') {
    return mockCanvas;
  }
  return originalCreateElement.call(document, tagName);
});

describe('HorizontalBarChart', () => {
  it('renders the chart container with the correct data-testid', () => {
    render(
      <HorizontalBarChart
        barChartData={mockHorizontalBarChartData}
        margins={mockMargins}
        height={400}
        width={600}
        dataTestId="horizontal-bar-chart-test-id"
      />,
    );
    const chartContainer = screen.getByTestId('horizontal-bar-chart-test-id');
    expect(chartContainer).toBeInTheDocument();
  });

  it('renders a bar for each data item', () => {
    render(
      <HorizontalBarChart
        barChartData={mockHorizontalBarChartData}
        margins={mockMargins}
        height={400}
        width={600}
      />,
    );
    expect(screen.getByText('A')).toBeInTheDocument();
    expect(screen.getByText('B')).toBeInTheDocument();
    expect(screen.getByText('C')).toBeInTheDocument();
  });

  it('renders correctly with all props provided (snapshot)', () => {
    const { asFragment } = render(
      <HorizontalBarChart
        barChartData={mockHorizontalBarChartData}
        margins={mockMargins}
        height={400}
        width={600}
      />,
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
