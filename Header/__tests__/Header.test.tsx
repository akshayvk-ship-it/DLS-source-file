import { render } from '@testing-library/react';
import { Header } from '../Header';
import { Button } from '../../Button';

test('Header  Snapshot Test', () => {
  const { baseElement } = render(
    <Header
      containerClassName="pt-4  px-6  w-full  justify-between"
      leftPanelContent={<div>Logo</div>}
      leftPanelClassName="flex w-64 justify-between pb-4"
      rightPanelClassName="flex items-center [&>*]:ml-6 pb-4"
      rightPanelContent={
        <Button label="Button" hierarchy="Primary" size="md" type="button" />
      }
      tabsType="tabs"
      tabsContent={{
        onChange: () => {},
        tabClassName: () => '',
        tabs: ['Placeholder 1', 'Placeholder 2', 'Placeholder 3'],
      }}
    />,
  );

  expect(baseElement).toMatchSnapshot();
});
