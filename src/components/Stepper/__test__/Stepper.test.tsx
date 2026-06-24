// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from 'react';
import { render } from '@testing-library/react';
import { Stepper } from '../Stepper';

test('initial state', async () => {
  const { baseElement } = render(
    <Stepper currStep={0} direction="horizontal" steps={[{}, {}, {}]} />,
  );
  expect(baseElement).toMatchSnapshot();
});

test('failed state', async () => {
  const { baseElement } = render(
    <Stepper
      currStep={1}
      direction="horizontal"
      steps={[{}, {}, {}]}
      failed={1}
    />,
  );
  expect(baseElement).toMatchSnapshot();
});

test('finished state', async () => {
  const { baseElement } = render(
    <Stepper currStep={3} direction="horizontal" steps={[{}, {}, {}]} />,
  );
  expect(baseElement).toMatchSnapshot();
});

test('labelled steps', async () => {
  const { baseElement } = render(
    <Stepper
      currStep={3}
      direction="horizontal"
      steps={[
        { title: 'Step 1', subtext: 'sub 1', index: 1 },
        { title: 'Step 2', subtext: 'sub 2', index: 2 },
        { title: 'Step 3', subtext: 'sub 3', index: 3 },
      ]}
    />,
  );
  expect(baseElement).toMatchSnapshot();
});
