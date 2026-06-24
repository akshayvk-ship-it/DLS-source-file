import { render } from '@testing-library/react';
import { Ticker } from '../Ticker';

test('Toast snapshot', async () => {
  const data = {
    startValue: 0,
    endValue: 3000,
    duration: 1000,
    wrapperClassName: '',
    prefix: '$',
    suffix: '',
  };

  const { baseElement } = render(<Ticker {...data} />);

  expect(baseElement).toMatchSnapshot();
});
