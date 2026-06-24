// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { render } from '@testing-library/react';
import { Toast } from '../Toast';

test('Toast snapshot', async () => {
  const data = {
    title: 'Title Text',
    description: 'Lorem ipsum is used where in the case of dummy text',
    showToast: true,
    setShowToast: () => {},
  };

  const { baseElement } = render(<Toast type="Default" {...data} />);

  expect(baseElement).toMatchSnapshot();
});
