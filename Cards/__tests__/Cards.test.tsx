import { render } from '@testing-library/react';
import { CardsComponent, CardsProps } from '../CardsComponent';

describe('CardsComponent', () => {
  const defaultProps: CardsProps = {
    cardLayout: 'vertical',
    title: 'Test Title',
    subTitle: 'Test Subtitle',
    description: 'This is a sample card description.',
    image: 'https://via.placeholder.com/150',
    showButtons: true,
    button1: {
      label: 'Cancel',
      onClick: jest.fn(),
    },
    button2: {
      label: 'Submit',
      onClick: jest.fn(),
    },
  };

  it('renders correctly and matches snapshot', () => {
    const { container } = render(<CardsComponent {...defaultProps} />);
    expect(container).toMatchSnapshot();
  });
});
