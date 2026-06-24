// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from 'react';
import { render, screen } from '@testing-library/react';
import user from '@testing-library/user-event';
import { Accordion } from '../Accordion';

test('Accordion Snapshot test', () => {
  const { baseElement } = render(
    <Accordion header="Accordion header" description="Lorem" />,
  );

  expect(baseElement).toMatchSnapshot();
});

test('Accordion open', async () => {
  const data = {
    onClick: jest.fn(),
  };

  const { baseElement } = render(
    <Accordion
      header="Click Here"
      description="test"
      clickHandler={data.onClick}
    />,
  );

  await user.click(screen.getByTestId('defaultAccordionTestId'));
  expect(baseElement).toMatchSnapshot();
});
