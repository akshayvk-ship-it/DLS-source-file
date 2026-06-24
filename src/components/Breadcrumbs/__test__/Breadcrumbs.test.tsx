import { render } from '@testing-library/react';

import { Breadcrumbs } from '../Breadcrumbs';

test('BreadCrumbs Snapshot Test', () => {
  const { baseElement } = render(
    <Breadcrumbs
      breadcrumbsItems={[
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
      ]}
    />,
  );

  expect(baseElement).toMatchSnapshot();
});
