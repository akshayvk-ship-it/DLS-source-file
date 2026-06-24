import { render, screen } from '@testing-library/react';
import {
  StackedBarChart,
  StackedBarChartData,
} from '../BarChart/StackedBarChart';

const mockStackedBarChartData = [
  { label: 'A', Q1: 10, Q2: 15, Q3: 12 },
  { label: 'B', Q1: 12, Q2: 8, Q3: 18 },
  { label: 'C', Q1: 5, Q2: 16, Q3: 10 },
];

const mockMargins = { top: 20, right: 20, bottom: 20, left: 20 };
const mockColorPalette = ['#1f77b4', '#ff7f0e', '#2ca02c'];

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

describe('StackedBarChart', () => {
  it('renders correctly with all props provided (snapshot)', () => {
    const { asFragment } = render(
      <StackedBarChart
        stackedBarChartData={
          mockStackedBarChartData as unknown as StackedBarChartData[]
        }
        margins={mockMargins}
        height={400}
        width={600}
        colorPalette={mockColorPalette}
        shadowFloodColor="rgba(251,203,176,0.5)"
      />,
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders the chart container', () => {
    render(
      <StackedBarChart
        stackedBarChartData={
          mockStackedBarChartData as unknown as StackedBarChartData[]
        }
        margins={mockMargins}
        height={400}
        width={600}
        colorPalette={mockColorPalette}
        shadowFloodColor="rgba(251,203,176,0.5)"
        dataTestId="stacked-bar-chart-test-id"
      />,
    );
    const chartContainer = screen.getByTestId('stacked-bar-chart-test-id');
    expect(chartContainer).toBeInTheDocument();
  });
});
