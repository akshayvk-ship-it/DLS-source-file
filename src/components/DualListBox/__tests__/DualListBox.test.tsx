import { render } from '@testing-library/react';
import { DualListBox } from '../DualListBox';

test('render dual list box snapshot', async () => {
  const options = [
    { uniqueId: 'list-1', label: 'List 1', isSelected: false, isVisible: true },
    { uniqueId: 'list-2', label: 'List 2', isSelected: false, isVisible: true },
    { uniqueId: 'list-3', label: 'List 3', isSelected: false, isVisible: true },
    { uniqueId: 'list-4', label: 'List 4', isSelected: false, isVisible: true },
    { uniqueId: 'list-5', label: 'List 5', isSelected: false, isVisible: true },
  ];

  const { baseElement } = render(
    <DualListBox options={options} title="Dual List Box" />,
  );

  expect(baseElement).toMatchSnapshot();
});
