// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { fireEvent, render, screen } from '@testing-library/react';

import { SearchInput } from '../SearchInput';

test('Search Input Snapshot Test', () => {
  const { baseElement } = render(
    <SearchInput
      label="This is Label"
      value="Abc"
      onChange={jest.fn()}
      name="user-input"
      helperText="This is helper Text"
    />,
  );

  expect(baseElement).toMatchSnapshot();
});

test('Search Input Change Value', () => {
  render(
    <SearchInput
      label="This is Label"
      onChange={jest.fn()}
      name="user-input"
      helperText="This is helper Text"
    />,
  );

  fireEvent.change(screen.getByTestId('user-input'), {
    target: {
      value: 'Test@123',
    },
  });

  expect(screen.getByTestId('user-input')).toHaveValue('Test@123');
});

test('Search Input Text animation', () => {
  const { baseElement } = render(
    <SearchInput
      label="This is Label"
      onChange={jest.fn()}
      name="user-input"
      helperText="This is helper Text"
      placeholderTextAnimation={{
        placeholderStartingText: 'Search for',
        placeholderTexts: ['Category Name', 'Recharges', 'Electricty', 'Water'],
      }}
    />,
  );

  fireEvent.change(screen.getByTestId('user-input'), {
    target: {
      value: 'Test@123',
    },
  });

  expect(screen.getByTestId('user-input')).toHaveValue('Test@123');
  expect(baseElement).toMatchSnapshot();
});

test('Search Input by default type is text', () => {
  render(
    <SearchInput
      label="This is Label"
      onChange={jest.fn()}
      name="user-input"
      value=""
    />,
  );

  expect(screen.getByTestId('user-input')).toHaveAttribute('type', 'text');
});

test('Search Input type can be overridden', () => {
  render(
    <SearchInput
      label="This is Label"
      onChange={jest.fn()}
      name="user-input"
      type="search"
      value=""
    />,
  );

  expect(screen.getByTestId('user-input')).toHaveAttribute('type', 'search');
});
