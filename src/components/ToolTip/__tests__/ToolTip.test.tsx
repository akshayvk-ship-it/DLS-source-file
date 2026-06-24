// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from 'react';
import { render, screen } from '@testing-library/react';

import { ToolTip } from '../ToolTip';

test('ToolTip Snapshot Test', () => {
  const { baseElement } = render(
    <ToolTip
      placementToolTip="top-left"
      iconToolTip={<div>This is sample</div>}
    />,
  );

  expect(baseElement).toMatchSnapshot();
});

test('ToolTip Always Available', () => {
  render(
    <ToolTip
      placementToolTip="top-left"
      iconToolTip={<div>This is sample</div>}
      titleToolTip="Thi is title"
    />,
  );

  expect(screen.getByTestId('tooltip-ui-library')).toHaveTextContent(
    'This is sample',
  );
});
