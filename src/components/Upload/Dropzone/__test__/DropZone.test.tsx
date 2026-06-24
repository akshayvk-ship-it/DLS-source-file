// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from 'react';
import { render } from '@testing-library/react';
import { DropZone } from '../index';
import '@testing-library/jest-dom';

test('DropZone Snapshot', () => {
  const { baseElement } = render(<DropZone setFilesHandler={jest.fn} />);

  expect(baseElement).toMatchSnapshot();
});
