import { render, screen } from '@testing-library/react';
import { ColorMappingGanttChart, GanttChartData } from '../GanttChart/types';
import { GanttChart } from '../GanttChart';

afterEach(() => {
  jest.restoreAllMocks();
});

describe('GanttChart', () => {
  beforeAll(() => {
    window.innerWidth = 1024;
    window.innerHeight = 768;
    Object.defineProperty(HTMLElement.prototype, 'getBoundingClientRect', {
      configurable: true,
      value: () => ({
        width: 100,
        height: 20,
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
      }),
    });
  });

  const mockData: GanttChartData[] = [
    {
      label: 'Research',
      startDate: new Date('2025-04-02'),
      endDate: new Date('2025-04-16'),
      textValue: 'sample text',
      progress: 70,
    },
    {
      label: 'Define',
      startDate: new Date('2025-04-09'),
      endDate: new Date('2025-04-23'),
      textValue: 'sample text',
      progress: 30,
    },
    {
      label: 'Architecture',
      startDate: new Date('2025-04-23'),
      endDate: new Date('2025-05-01'),
      textValue: 'sample text',
      progress: 80,
    },
    {
      label: 'Planning',
      startDate: new Date('2025-04-25'),
      endDate: new Date('2025-05-06'),
      textValue: 'sample text',
      progress: 20,
    },
    {
      label: 'Design',
      startDate: new Date('2025-04-30'),
      endDate: new Date('2025-05-09'),
      textValue: 'sample text',
      progress: 10,
    },
    {
      label: 'Development',
      startDate: new Date('2025-05-12'),
      endDate: new Date('2025-06-14'),
      textValue: 'sample text',
      progress: 35,
    },
    {
      label: 'Testing',
      startDate: new Date('2025-05-10'),
      endDate: new Date('2025-05-25'),
      textValue: 'sample text',
      progress: 45,
    },
    {
      label: 'Testing',
      startDate: new Date('2025-06-01'),
      endDate: new Date('2025-06-14'),
      textValue: 'sample text',
      progress: 67,
    },
    {
      label: 'QA',
      startDate: new Date('2025-05-23'),
      endDate: new Date('2025-06-20'),
      textValue: 'sample text',
      progress: 99,
    },
    {
      label: 'Documentation',
      startDate: new Date('2025-06-01'),
      endDate: new Date('2025-06-12'),
      textValue: 'sample text',
      progress: 100,
    },
    {
      label: 'Documentation',
      startDate: new Date('2025-06-13'),
      endDate: new Date('2025-06-28'),
      textValue: 'sample text',
      progress: 78,
    },
  ];

  it('renders correctly with default props', async () => {
    jest.useFakeTimers().setSystemTime(new Date(Date.UTC(2025, 5, 11)));

    render(
      <GanttChart
        minProgress={0}
        maxProgress={100}
        width={800}
        height={400}
        ganttChartData={mockData}
        chartColor={ColorMappingGanttChart.ORANGE}
        margins={{ top: 60, right: 20, bottom: 20, left: 20 }}
      />,
    );
    expect(screen.getByTestId('GanttChart-testId')).toMatchSnapshot();
  });
});
