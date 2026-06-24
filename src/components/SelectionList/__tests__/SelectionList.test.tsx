// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from 'react';
import { render, screen } from '@testing-library/react';
import { SelectionList } from '../SelectionList';

test('Selection List Snapshot test', () => {
  const { baseElement } = render(
    <SelectionList
      title="List item"
      type="checkbox"
      placement="right"
      outlined={false}
      rounded
      isChecked={false}
      onSelect={() => {}}
    />,
  );

  expect(baseElement).toMatchSnapshot();
});

test('Displays Correct outlined list item', () => {
  render(
    <SelectionList
      title="List item"
      type="checkbox"
      placement="right"
      outlined
      rounded={false}
      isChecked={false}
      onSelect={() => {}}
    />,
  );
  expect(screen.getByTestId('defaultSelectionListTestId')).toHaveClass(
    'border-border-border-light',
  );
});
