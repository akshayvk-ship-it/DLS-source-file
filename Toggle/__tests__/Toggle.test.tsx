import { render, fireEvent, screen } from '@testing-library/react';
import { Toggle } from '../Toggle';

describe('Toggle', () => {
  test('renders correctly', () => {
    const { baseElement } = render(
      <Toggle
        label="Test Toggle"
        onChange={jest.fn()}
        checked={false}
        name="toggle-input"
      />,
    );
    expect(baseElement).toMatchSnapshot();
  });

  test('calls onChange when clicked', () => {
    const onChange = jest.fn();
    render(
      <Toggle
        label="Test Toggle"
        onChange={onChange}
        checked={false}
        name="toggle-input"
      />,
    );
    const toggle = screen.getByRole('checkbox');
    fireEvent.click(toggle);
    expect(onChange).toHaveBeenCalledWith(true);
  });

  test('displays correct text when checked', () => {
    render(
      <Toggle
        label="Test Toggle"
        text
        checked
        onChange={jest.fn()}
        name="toggle-input"
      />,
    );
    expect(screen.getByText('On')).toBeInTheDocument();
  });

  test('displays correct text when not checked', () => {
    render(
      <Toggle
        label="Test Toggle"
        text
        checked={false}
        onChange={jest.fn()}
        name="toggle-input"
      />,
    );
    expect(screen.getByText('Off')).toBeInTheDocument();
  });

  test('is disabled when disabled prop is true', () => {
    render(
      <Toggle
        label="Test Toggle"
        disabled
        onChange={jest.fn()}
        checked
        name="toggle-input"
      />,
    );
    const toggle = screen.getByRole('checkbox');
    expect(toggle).toBeDisabled();
  });
});
