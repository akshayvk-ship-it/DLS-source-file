import { render, screen } from '@testing-library/react';
import user from '@testing-library/user-event';
import { DropDownMweb, DropDownMwebProps } from '..';

test('open state snapshot', async () => {
  const data = {
    chevron: 'dropdown-mweb-test-id-chevron-icon',
    props: {
      label: 'Label',
      placeholder: 'Placeholder',
      onClick: () => {},
      isOpen: false,
      value: '4 items selected',
      variant: 'single-line' as const,
      isErrorState: false,
      disabled: false,
      showToolTip: false,
    },
  };

  const { baseElement } = render(<DropDownMweb {...data.props} />);

  await user.click(screen.getByTestId(data.chevron));

  expect(baseElement).toMatchSnapshot();
});

const defaultProps: DropDownMwebProps = {
  label: 'Test Label',
  value: '',
  placeholder: 'Test Placeholder',
  onClick: jest.fn(),
};

describe('DropDownMweb', () => {
  it('renders label and placeholder', () => {
    render(<DropDownMweb {...defaultProps} />);
    expect(screen.getByText('Test Label')).toBeInTheDocument();
    expect(screen.getByText('Test Placeholder')).toBeInTheDocument();
  });

  it('renders value (single-line)', () => {
    render(<DropDownMweb {...defaultProps} value="Selected Value" />);
    expect(screen.getByText('Selected Value')).toBeInTheDocument();
  });

  it('renders value (double-line)', () => {
    render(
      <DropDownMweb
        {...defaultProps}
        showDoubleLine
        value={{ label: 'Main', subText: 'Sub' }}
      />,
    );
    expect(screen.getByText('Main')).toBeInTheDocument();
    expect(screen.getByText('Sub')).toBeInTheDocument();
  });
});
