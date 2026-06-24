// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from 'react';
import { render } from '@testing-library/react';
import { RadioButton } from '../RadioButton/RadioButton';

test('Checkbox snapshot test', async () => {
  const { baseElement } = render(
    <RadioButton
      size="lg"
      id="test-radio"
      text="Sample Text"
      supportText="Sample support text"
      onBlur={() => {}}
      onChange={() => {}}
      onFocus={() => {}}
    />,
  );

  expect(baseElement).toMatchSnapshot();
});
