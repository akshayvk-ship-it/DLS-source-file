// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from 'react';
import { render } from '@testing-library/react';
import { Pagination } from '..';

test('Pagination Snapshot Test', () => {
  const { baseElement } = render(
    <Pagination
      currentPage={1}
      totalPages={10}
      totalItems={100}
      itemsPerPageOptions={[5, 10, 20, 50, 100]}
      onPageChange={() => {
        //
      }}
    />,
  );

  expect(baseElement).toMatchSnapshot();
});
