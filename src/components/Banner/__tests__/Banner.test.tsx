// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { render, screen } from '@testing-library/react';
import user from '@testing-library/user-event';
import { Banner } from '../Banner';

test('clicks', async () => {
  const data = {
    props: {
      type: 'Info' as 'Info' | 'Error',
      title: 'Title Text',
      subtitle: 'Lorem ipsum is  used where in the case of dummy text',
      emphasis: true,
      hasIcon: true,
      dataTestId: '',
      isOpen: true,
      onDismiss: jest.fn(),
      textBtn: {
        label: 'View Updates',
        onClick: jest.fn(),
      },
      secondaryBtn: {
        label: 'Update Now',
        onClick: jest.fn(),
      },
      hasCloseBtn: true,
    },
    ids: {
      textBtn: 'textBtn',
      secBtn: 'secBtn',
      closeBtn: 'closeBtn',
    },
  } as const;

  const { baseElement } = render(<Banner {...data.props} />);
  expect(baseElement).toMatchSnapshot();

  await user.click(screen.getByTestId(data.ids.textBtn));
  await user.click(screen.getByTestId(data.ids.secBtn));
  await user.click(screen.getByTestId(data.ids.closeBtn));

  expect(data.props.textBtn.onClick).toHaveBeenCalled();
  expect(data.props.secondaryBtn.onClick).toHaveBeenCalled();
  expect(data.props.onDismiss).toHaveBeenCalled();
});

test('closed', async () => {
  const data = {
    props: {
      type: 'Info' as 'Info' | 'Error',
      title: 'Title Text',
      isOpen: true,
      dataTestId: '',
      onDismiss: () => {},
      hasCloseBtn: true,
    },
    ids: {
      closeBtn: 'closeBtn',
    },
  } as const;

  const { baseElement } = render(<Banner {...data.props} />);

  await user.click(screen.getByTestId(data.ids.closeBtn));

  expect(baseElement).toMatchSnapshot();
});
