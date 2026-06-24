// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import { PasswordInput } from '../PasswordInput';

test('Password Input Snapshot Test', () => {
  const { baseElement } = render(<PasswordInput />);

  expect(baseElement).toMatchSnapshot();
});

test('Password Change Input Value', () => {
  render(<PasswordInput name="user-password" />);

  fireEvent.change(screen.getByTestId('user-password'), {
    target: {
      value: 'Test@123',
    },
  });

  expect(screen.getByTestId('user-password')).toHaveValue('Test@123');
});

test('Show Password Strength', async () => {
  render(<PasswordInput name="user-password" showPasswordStrength />);

  fireEvent.change(screen.getByTestId('user-password'), {
    target: {
      value: 'Test@123',
    },
  });

  await waitFor(() => {
    expect(screen.getByText('Password must contain:')).toBeInTheDocument();
  });
});
