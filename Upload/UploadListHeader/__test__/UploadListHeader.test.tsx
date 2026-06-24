import { render } from '@testing-library/react';

import '@testing-library/jest-dom';
import { UploadListHeader } from '..';

test('Upload List Header Snapshot', () => {
  const { baseElement } = render(
    <UploadListHeader closeClickHandler={jest.fn} showExpandedVersion />,
  );

  expect(baseElement).toMatchSnapshot();
});

test('Upload List Header NonExpanded Snapshot', () => {
  const { baseElement } = render(
    <UploadListHeader
      closeClickHandler={jest.fn}
      showExpandedVersion={false}
      showUploadIcon
    />,
  );

  expect(baseElement).toMatchSnapshot();
});
