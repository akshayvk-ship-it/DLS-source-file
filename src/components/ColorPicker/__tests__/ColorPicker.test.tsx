import { render } from '@testing-library/react';
import { ColorPicker } from '../ColorPicker';

describe('ColorPickerCard', () => {
  test('Color Picker Snapshot', () => {
    const { container } = render(
      <ColorPicker value="#ffffff" onChange={jest.fn()} />,
    );
    expect(container).toMatchSnapshot();
  });
});
