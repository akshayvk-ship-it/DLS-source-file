// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { render } from '@testing-library/react';
import { DateRangeFilter } from '../DateRangeFilter';

const dateRangePresets = [
  'Today',
  'Yesterday',
  'Last 7 days',
  'Last 30 days',
  'Last Month',
  'This Month',
  'Custom',
];

test('Date Range Filter Snapshot test', () => {
  const { baseElement } = render(
    <DateRangeFilter
      label="Test Label"
      presets={dateRangePresets}
      state="Default"
      dataTestId="defaultDateRangeFilterTestId"
      disableFuture
      minYear={1900}
      maxYear={2025}
      size="large"
      type="Days"
      customDateSet={jest.fn}
    />,
  );

  expect(baseElement).toMatchSnapshot();
});
