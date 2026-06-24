// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from 'react';
import { render, screen } from '@testing-library/react';
import user from '@testing-library/user-event';
import { DropDown } from '..';

test('open state snapshot', async () => {
  const data = {
    chevron: 'dropDownTestId chevronIcon',
    props: {
      direction: 'horizontal' as const,
      onChange: () => {},
      options: [
        { label: 'Option A', value: 'Option A' },
        { label: 'Option B', value: 'Option B' },
        { label: 'Option C', value: 'Option C' },
        { label: 'Option D', value: 'Option D' },
        { label: 'Option E', value: 'Option E' },
        { label: 'Option F', value: 'Option F' },
      ],
    },
  };

  const { baseElement } = render(<DropDown {...data.props} />);

  await user.click(screen.getByTestId(data.chevron));

  expect(baseElement).toMatchSnapshot();
});

test('selectAll and deSelectAll', async () => {
  const data = {
    chevron: 'dropDownTestId chevronIcon',
    select: 'selectAllBtn',
    deselect: 'deSelectAllBtn',
    props: {
      direction: 'horizontal' as const,
      isMulti: true,
      onChange: jest.fn(),
      options: [
        { label: 'Option A', value: 'Option A' },
        { label: 'Option B', value: 'Option B' },
        { label: 'Option C', value: 'Option C' },
        { label: 'Option D', value: 'Option D' },
        { label: 'Option E', value: 'Option E' },
        { label: 'Option F', value: 'Option F' },
      ],
    },
  };

  const { baseElement } = render(<DropDown {...data.props} />);

  await user.click(screen.getByTestId(data.chevron));

  await user.click(screen.getByTestId(data.select));
  expect(data.props.onChange).toHaveBeenCalledWith(
    data.props.options.map((option) => option.value),
  );
  expect(baseElement).toMatchSnapshot();

  await user.click(screen.getByTestId(data.deselect));
  expect(data.props.onChange).toHaveBeenCalledWith([]);
});
