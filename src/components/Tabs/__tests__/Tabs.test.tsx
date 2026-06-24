// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from 'react';
import { render, screen } from '@testing-library/react';
import user from '@testing-library/user-event';
import { Tabs } from '..';

test('Tabs snapshot', async () => {
  const data = {
    tabs: ['Tab 1', 'Tab 2', 'Tab 3'],
    onChange: () => {},
  };

  const { baseElement } = render(<Tabs {...data} />);

  expect(baseElement).toMatchSnapshot();
});

test('Tabs onChange', async () => {
  const data = {
    tabs: ['Tab 1', 'Tab 2', 'Tab 3'],
    onChange: jest.fn(),
  };

  const { baseElement } = render(<Tabs {...data} />);
  const tab = screen.getByText(data.tabs[1]!);

  await user.click(tab);

  expect(data.onChange).toHaveBeenCalledWith(data.tabs[1]!, 1);
  expect(baseElement).toMatchSnapshot();
});
