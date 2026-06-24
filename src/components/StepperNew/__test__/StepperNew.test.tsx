// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from 'react';
import { render } from '@testing-library/react';
import { StepperNew } from '../StepperNew';

test('initial state', async () => {
  const { baseElement } = render(
    <StepperNew currentStep={0} steps={[{}, {}, {}]} />,
  );
  expect(baseElement).toMatchSnapshot();
});

test('failed state', async () => {
  const { baseElement } = render(
    <StepperNew currentStep={1} steps={[{}, {}, {}]} failed={1} />,
  );
  expect(baseElement).toMatchSnapshot();
});

test('finished state', async () => {
  const { baseElement } = render(
    <StepperNew currentStep={3} steps={[{}, {}, {}]} />,
  );
  expect(baseElement).toMatchSnapshot();
});

test('labelled steps', async () => {
  const { baseElement } = render(
    <StepperNew
      currentStep={3}
      steps={[
        { title: 'Step 1', subtext: 'sub 1' },
        { title: 'Step 2', subtext: 'sub 2' },
        { title: 'Step 3', subtext: 'sub 3' },
      ]}
    />,
  );
  expect(baseElement).toMatchSnapshot();
});
