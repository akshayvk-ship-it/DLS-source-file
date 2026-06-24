// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import { TextInput } from '../TextInput';

test('Text Input Snapshot Test', () => {
  const { baseElement } = render(<TextInput />);

  expect(baseElement).toMatchSnapshot();
});

test('Text Input Change Value', () => {
  render(<TextInput name="user-input" helperText="This is helper Text" />);

  fireEvent.change(screen.getByTestId('user-input'), {
    target: {
      value: 'Test@123',
    },
  });

  expect(screen.getByTestId('user-input')).toHaveValue('Test@123');
});

test('Text Input Error', async () => {
  render(
    <TextInput name="user-input" showErrorHelperText="This is Error Text" />,
  );

  fireEvent.change(screen.getByTestId('user-input'), {
    target: {
      value: 'Test@123',
    },
  });

  await waitFor(() => {
    expect(screen.getByText('This is Error Text')).toBeInTheDocument();
  });
});

test('Text Input Disabled', async () => {
  render(<TextInput name="user-input" disabled />);

  await waitFor(() => {
    expect(screen.getByTestId('user-input')).toBeDisabled();
  });
});
