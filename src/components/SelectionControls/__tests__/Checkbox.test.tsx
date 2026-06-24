// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from 'react';
import { render } from '@testing-library/react';
import { Checkbox } from '../Checkbox/Checkbox';

test('Checkbox snapshot test', async () => {
  const { baseElement } = render(
    <Checkbox
      size="lg"
      id="test-check"
      text="Sample Text"
      supportText="Sample support text"
      onBlur={() => {}}
      onChange={() => {}}
      onFocus={() => {}}
      indeterminate
      checked
    />,
  );

  expect(baseElement).toMatchSnapshot();
});
