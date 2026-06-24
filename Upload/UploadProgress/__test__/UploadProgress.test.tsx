import { fireEvent, render, screen } from '@testing-library/react';

import { UploadProgress } from '..';

test('Upload Progress Snapshot', () => {
  const { baseElement } = render(
    <UploadProgress
      deleteIconHandler={jest.fn}
      fileName="Bank statement summary.csv"
      fileSize="320KB"
      fileType="csv"
      isFinished={false}
      percentageValue={25}
      status="default"
    />,
  );

  expect(baseElement).toMatchSnapshot();
});

test('Upload Progress CheckBox Handler', () => {
  render(
    <UploadProgress
      deleteIconHandler={jest.fn}
      fileName="Bank statement summary.csv"
      fileSize="320KB"
      fileType="csv"
      isFinished={false}
      percentageValue={25}
      status="selection"
      checkboxOnChange={jest.fn}
    />,
  );

  const checkbox = screen.getByTestId('progress-checkbox');

  fireEvent.change(checkbox, {
    target: {
      checked: true,
    },
  });

  expect(checkbox).toBeChecked();
});
