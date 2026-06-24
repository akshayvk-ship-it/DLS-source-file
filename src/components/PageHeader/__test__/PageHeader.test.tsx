import { render } from '@testing-library/react';
import { PageHeader } from '..';

test('snapshot', async () => {
  const data = {
    props: {
      title: 'Page Title Placeholder',
      subtitle: 'Page Subtitle Placeholder',
      breadCrumbsProps: {
        breadcrumbsItems: [
          {
            key: 'settings',
            element: (classNameProp: string) => (
              <a className={classNameProp} href="/settings">
                Settings
              </a>
            ),
          },
          {
            key: 'security',
            element: (classNameProp: string) => (
              <a className={classNameProp} href="/security">
                Security
              </a>
            ),
          },
          {
            key: '2FA',
            element: (classNameProp: string) => (
              <a className={classNameProp} href="/2FA">
                2FA
              </a>
            ),
          },
        ],
        homeButtonClickHandler: () => {},
        maxItems: 3,
      },
      primaryBtnProps: { label: 'Primary', onClick: () => {} },
      secondaryBtnProps: { label: 'Secondary', onClick: () => {} },
    },
  };

  const { baseElement } = render(<PageHeader {...data.props} />);

  expect(baseElement).toMatchSnapshot();
});
