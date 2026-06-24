// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from 'react';
import { render, screen } from '@testing-library/react';
import user from '@testing-library/user-event';
import { InfoChip } from '../InfoChip';

test('Info Chip Snapshot test', () => {
  const { baseElement } = render(<InfoChip text="Label" />);

  expect(baseElement).toMatchSnapshot();
});

test('Chip click', async () => {
  const data = {
    onClick: jest.fn(),
  };

  const { baseElement } = render(
    <InfoChip
      text="Click Here"
      clickHandler={data.onClick}
      closeClickHandler={data.onClick}
      prefixElement={<div />}
      suffixElement={<div />}
      textClassName=""
      wrapperClassName=""
      closeClassName=""
    />,
  );
  const button = screen.getByTestId('defaultInfoChipTestId');

  await user.click(button);

  expect(data.onClick).toHaveBeenCalled();
  expect(baseElement).toMatchSnapshot();
});
