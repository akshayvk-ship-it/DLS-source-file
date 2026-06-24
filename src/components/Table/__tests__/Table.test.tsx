import { render } from '@testing-library/react';

import { AnyObject, ColumnType, Table } from '../Table';
import { Button } from '../../Button';

global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

const rowsData = [
  {
    key: 'this is key',
    date: '25 Jul 2021, 03:03 PM',
    amount: '99999',
    mode: 'IMPS',
    status: 'success',
    utr: '123451231231231...',
    remitterName: 'Test',
  },
];

const columns: ColumnType<AnyObject>[] = [
  {
    key: 'date',
    title: 'Date',
    sortable: false,
    render: {
      isRender: true,
      renderElement: (value) => <span>{value as string}</span>,
    },
    width: '200px',
  },
  {
    key: 'amount',
    title: 'Amount',
    render: {
      isRender: true,
      renderElement: (value) => <span>₹{value as string}</span>,
    },
    width: '150px',
    sortable: true,
    align: 'right',
  },
  {
    key: 'mode',
    title: 'Mode',
    sortable: false,
    render: {
      isRender: true,
      renderElement: (value) => (
        <span className=" rounded-2xl border border-solid border-[#5E6879] bg-[#FAFBFB] px-2">
          {value as string}
        </span>
      ),
    },
    width: '80px',
  },
  {
    key: 'status',
    title: 'Status',
    align: 'center',
    sortable: false,
    render: {
      isRender: false,
    },
    width: '150px',
  },
  {
    key: 'utr',
    title: 'UTR',
    sortable: false,
    render: {
      isRender: false,
    },
    width: '100px',
  },
  {
    key: 'remitterName',
    title: 'Remitter Name',
    sortable: false,
    render: {
      isRender: false,
    },
    width: '150px',
  },
  {
    key: 'actionButtons',
    title: '',
    sortable: false,
    render: {
      isRender: true,
      renderElement: () => (
        <div className="flex">
          <Button
            hierarchy="Text Button"
            size="md"
            type="button"
            label="Action Button"
            className="underline"
          />
        </div>
      ),
    },
    width: 'auto',
  },
];

test('Table Snapshot', () => {
  const { baseElement } = render(
    <Table columns={columns} rowsData={rowsData} />,
  );

  expect(baseElement).toMatchSnapshot();
});

test('Table With Pagination', () => {
  const paginationData = {
    currentPage: 0,
    totalItems: rowsData.length,
    itemsPerPage: 5,
    itemsPerPageOptions: [
      {
        label: '5',
        value: '5',
      },
      {
        label: '10',
        value: '10',
      },
      {
        label: '20',
        value: '20',
      },
      {
        label: '50',
        value: '50',
      },
      {
        label: '100',
        value: '100',
      },
    ],
    onPageChange: jest.fn,
  };
  const { baseElement } = render(
    <Table
      columns={columns}
      rowsData={rowsData}
      paginationData={paginationData}
    />,
  );

  expect(baseElement).toMatchSnapshot();
});
