import { render } from '@testing-library/react';
import { MasterCardLogo } from '../../Icons';
import { CardDetailsMweb } from '../CardDetailsMweb';

describe('CardDetailsMweb', () => {
  it('renders correctly and matches snapshot', () => {
    const { baseElement } = render(
      <CardDetailsMweb
        className="grid grid-cols-2 items-center justify-center gap-6"
        variant="card-number-only"
        cardNumberInputProps={{
          label: 'Card Number',
          cardIcon: <MasterCardLogo />,
          name: 'cardNumber',
          className: 'col-span-2',
        }}
      />,
    );

    expect(baseElement).toMatchSnapshot();
  });
});
