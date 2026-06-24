// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from 'react';
import { render } from '@testing-library/react';
import { DateRange } from '../DateRange';

afterEach(() => {
  jest.restoreAllMocks();
});

test('DateRange Snapshot Test', () => {
  jest.useFakeTimers().setSystemTime(new Date('2024-09-04'));
  const { baseElement } = render(
    <DateRange type="Days" minYear={2000} maxYear={2024} disableFuture />,
  );

  expect(baseElement).toMatchSnapshot();
});
