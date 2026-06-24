// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from 'react';
import { render, screen } from '@testing-library/react';
import user from '@testing-library/user-event';
import { Button } from '../Button';

test('button click', async () => {
  const data = {
    onClick: jest.fn(),
  };

  const { baseElement } = render(
    <Button
      hierarchy="Primary"
      size="lg"
      onClick={data.onClick}
      type="button"
    />,
  );
  const button = screen.getByTestId('defaultButtonTestId');

  await user.click(button);

  expect(data.onClick).toHaveBeenCalled();
  expect(baseElement).toMatchSnapshot();
});

test('loading state', async () => {
  const data = {
    onClick: jest.fn(),
  };

  const { baseElement } = render(
    <Button
      hierarchy="Primary"
      size="lg"
      onClick={data.onClick}
      loading
      type="button"
    />,
  );
  const button = screen.getByTestId('defaultButtonTestId');

  await user.click(button);

  expect(data.onClick).toHaveBeenCalledTimes(0);
  expect(baseElement).toMatchSnapshot();
});
