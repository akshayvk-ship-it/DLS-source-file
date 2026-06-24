// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from 'react';
import { render } from '@testing-library/react';
import { EmptyState } from '../EmptyState';

test('CTA Snapshot Test', () => {
  const { baseElement } = render(
    <EmptyState
      title="Customize your Title here"
      layout="Wide"
      showCTA
      primaryBtnProps={{
        label: 'Go back',
        onClick: jest.fn(),
      }}
      secondaryBtnProps={{
        label: 'Notify me',
        onClick: jest.fn(),
      }}
    />,
  );

  expect(baseElement).toMatchSnapshot();
});
