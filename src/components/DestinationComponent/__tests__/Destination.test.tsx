// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from 'react';
import { render, screen } from '@testing-library/react';
import { Destination } from '../Destination';

test('Destination Snapshot test', () => {
  const { baseElement } = render(
    <Destination destinationValue="" locationValue="" state="Default" />,
  );

  expect(baseElement).toMatchSnapshot();
});

test('Displays Correct Value', () => {
  render(
    <Destination destinationValue="To" locationValue="From" state="Entered" />,
  );
  expect(screen.getByTestId('defaultDestinationTestId')).toBeInTheDocument();
});
