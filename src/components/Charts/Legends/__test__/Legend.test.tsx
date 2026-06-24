import { render, screen } from '@testing-library/react';
import { Legends } from '..';

const legendData = [
  { label: 'X2', value: 'Sample text long long long 2' },
  { label: 'X4', value: 'Sample text 4' },
  { label: 'X5', value: 'Sample text 5' },
  { label: 'X6', value: 'Sample text 6' },
];

it('render horizontal axis legend', () => {
  render(
    <Legends
      showToolTip
      horizontalAxisLegends={{
        xAxisLegends: legendData,
        maxTruncateWidth: 40,
      }}
    />,
  );

  expect(screen.getAllByTestId('legend-testId')).toMatchSnapshot();
});
