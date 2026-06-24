// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';

import { OTPInput } from '../OTPInput';

test('OTP Input Snapshot Test', () => {
  const { baseElement } = render(<OTPInput name="otpInputs" />);

  expect(baseElement).toMatchSnapshot();
});

test('OTP Input Change Value', () => {
  const { baseElement } = render(
    <OTPInput
      name="otpInputs"
      helperText="This is helper Text"
      onChangeOTP={jest.fn()}
    />,
  );

  fireEvent.change(screen.getByTestId(`otpInputs-1`), {
    target: {
      value: 7,
    },
  });

  fireEvent.change(screen.getByTestId(`otpInputs-1`), {
    target: {
      value: 2,
    },
  });

  fireEvent.change(screen.getByTestId(`otpInputs-2`), {
    target: {
      value: 5,
    },
  });

  fireEvent.change(screen.getByTestId(`otpInputs-3`), {
    target: {
      value: 8,
    },
  });

  fireEvent.change(screen.getByTestId(`otpInputs-4`), {
    target: {
      value: 6,
    },
  });

  fireEvent.change(screen.getByTestId(`otpInputs-5`), {
    target: {
      value: 2,
    },
  });

  expect(baseElement).toMatchSnapshot();
  expect(screen.getByTestId(`otpInputs-2`)).toHaveValue('5');
});
