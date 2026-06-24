// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from 'react';
import { render, screen } from '@testing-library/react';
import { StatusChip } from '../StatusChip';

test('Info Chip Snapshot test', () => {
  const { baseElement } = render(
    <StatusChip text="Success" statusType="Success" />,
  );

  expect(baseElement).toMatchSnapshot();
});

test('Displays Correct Label Text', () => {
  render(<StatusChip text="Success" statusType="Success" />);
  expect(screen.getByTestId('defaultStatusChipTestId')).toBeInTheDocument();
});

test('Same Success class name for the Status Chip', () => {
  render(<StatusChip text="Success" statusType="Success" />);
  expect(screen.getByTestId('defaultStatusChipTestId')).toHaveClass(
    'border-border-success-light bg-fill-success-light',
  );
});

test('Same Warning class name for the Status Chip', () => {
  render(<StatusChip text="Processing" statusType="Warning" />);
  expect(screen.getByTestId('defaultStatusChipTestId')).toHaveClass(
    'border-border-caution-light bg-fill-caution-light',
  );
});

test('Same Danger class name for the Status Chip', () => {
  render(<StatusChip text="Failed" statusType="Danger" />);
  expect(screen.getByTestId('defaultStatusChipTestId')).toHaveClass(
    'border-border-error-light bg-fill-error-light',
  );
});
