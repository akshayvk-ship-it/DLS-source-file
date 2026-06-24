// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from 'react';
import { render } from '@testing-library/react';
import { ErrorPage } from '../ErrorPage';

test('Back Button Snapshot Test', () => {
  const { baseElement } = render(
    <ErrorPage
      errorType={{ errorCode: 404, errorCase: 'mispelled url' }}
      actionElements={{
        primary: { label: 'Go back', onClick: jest.fn() },
        secondary: { label: 'Notify me', onClick: jest.fn() },
      }}
    />,
  );

  expect(baseElement).toMatchSnapshot();
});
