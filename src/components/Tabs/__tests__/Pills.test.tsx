// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from 'react';
import { render, screen } from '@testing-library/react';
import user from '@testing-library/user-event';
import { Pills } from '..';

test('Pills snapshot', async () => {
  const data = {
    tabs: ['Tab 1', 'Tab 2', 'Tab 3'],
    onChange: () => {},
  };

  const { baseElement } = render(<Pills {...data} />);

  expect(baseElement).toMatchSnapshot();
});

test('Pills onChange', async () => {
  const data = {
    tabs: ['Tab 1', 'Tab 2', 'Tab 3'],
    onChange: jest.fn(),
  };

  const { baseElement } = render(<Pills {...data} />);
  const tab = screen.getByText(data.tabs[1]!);

  await user.click(tab);

  expect(data.onChange).toHaveBeenCalledWith(data.tabs[1]!, 1);
  expect(baseElement).toMatchSnapshot();
});
