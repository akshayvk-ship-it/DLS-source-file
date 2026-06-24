import { render } from '@testing-library/react';
import { Sidebar } from '../Sidebar';
import { SideMenu } from '../types';

const menu: SideMenu[] = [
  {
    headerTitle: 'Sub Header',
    title: 'Placeholder',
    isExpandable: true,
    showIcon: true,
    menuIcon: <div>icon</div>,
    activeElementValue: '',
    keyName: 'placeholderHeader',
    nestedData: [
      {
        title: 'Sub cell',
        isExpandable: true,
        menuIcon: <div>icon</div>,
        showIcon: true,
        activeElementValue: '',
        keyName: 'SubCellHeader',
        nestedData: [
          {
            title: 'Sub cell',
            menuIcon: <div>icon</div>,
            showIcon: true,
            isExpandable: false,
            activeElementValue: 'SubCellNested',
            keyName: 'SubCellNested',
          },
          {
            title: 'Sub cell 2',
            menuIcon: <div>icon</div>,
            showIcon: true,
            isExpandable: false,
            activeElementValue: 'SubCellNested2',
            keyName: 'SubCellNested2',
          },
        ],
      },
      {
        title: 'Sub cell',
        menuIcon: <div>icon</div>,
        isExpandable: false,
        activeElementValue: 'SubCellHeader2',
        keyName: 'SubCellHeader2',
      },
    ],
  },
];

test('Render Sidebar test', () => {
  const { baseElement } = render(
    <Sidebar
      activeValueToMatch="SubCellHeader2"
      menu={menu}
      menuClickHandler={jest.fn}
      sidebarDrawer={{
        position: 'fixed',
      }}
      notificationList={{
        placeholderHeader: 99,
        Placeholder2: 1,
      }}
    />,
  );

  expect(baseElement).toMatchSnapshot();
});
