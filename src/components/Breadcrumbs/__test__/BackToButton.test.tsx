import { render } from '@testing-library/react';

import { BackToButton } from '../BackToButton';

test('Back Button Snapshot Test', () => {
  const { baseElement } = render(
    <BackToButton title="Back to Settings" onClick={jest.fn()} />,
  );

  expect(baseElement).toMatchSnapshot();
});
