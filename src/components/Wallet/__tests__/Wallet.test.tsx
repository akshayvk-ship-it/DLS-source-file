import { render } from '@testing-library/react';
import { Wallet } from '../Wallet';

test('snapshot', async () => {
  const data = {
    props: {
      btnLabel: 'Add Funds',
      balance: 999999.0,
      onBtnClick: () => {},
      onClick: () => {},
      wallet: {
        label: 'Wallet 1',
        value: '060fc35a-1dbd-488a-ab49-fac36a33fdef',
      },
    },
  };

  const { baseElement } = render(<Wallet {...data.props} />);

  expect(baseElement).toMatchSnapshot();
});
