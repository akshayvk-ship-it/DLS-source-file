// eslint-disable-next-line @typescript-eslint/no-unused-vars

import { render } from '@testing-library/react';
import { PriceSlider } from '../PriceSlider';

describe('PriceSlider - Snapshot Test', () => {
  it('matches snapshot with default props', () => {
    const { container } = render(
      <PriceSlider
        minValue={10000}
        maxValue={500000}
        step={5000}
        showInfo
        minLabel="Min Price"
        maxLabel="Max Price"
        currency="₹"
        color={['#780cde', '#652d9a']}
      />,
    );

    expect(container).toMatchSnapshot();
  });
});
