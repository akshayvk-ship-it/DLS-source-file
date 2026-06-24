import { ReactNode, useEffect, useRef, useState } from 'react';
import { AnyObject, ColumnType, Table, TableProps } from './Table';
import {
  TableFixedColumns,
  TableWithFixedColumns,
} from './TableWithFixedColumns';
import { Pagination } from '../Pagination';
import { ColumnOption, TableColumnFilter } from '../TableColumnFilter';
import { SettingsIcon } from '../Icons';

export interface Props<RecordType extends AnyObject>
  extends TableProps<RecordType>,
    TableFixedColumns<RecordType> {
  filterHeaderChildren: ReactNode;
  filterHeaderWrapperClassName?: string;
  useFixedColumns?: boolean;
}

export function TableWithFilterHeader<RecordType extends AnyObject>({
  useFixedColumns = false,
  filterHeaderChildren,
  filterHeaderWrapperClassName = '',
  paginationData,
  paginationWrapperClassName,
  ...rest
}: Readonly<Props<RecordType>>) {
  const [managedColumns, setManagedColumns] = useState(() =>
    rest.columns.map((col) => ({ ...col })),
  );
  const [columnOptions, setColumnOptions] = useState<ColumnOption[]>(() =>
    rest.columns.map((col) => ({
      label:
        col.dropdownLabel ??
        (typeof col.title === 'string' ? col.title : col.key),
      value: col.key,
      isSelected: col.omit !== true,
    })),
  );

  const [columnSearchVal, setColumnSearchVal] = useState<string>('');

  const tableContainerRef = useRef<HTMLInputElement>(null);
  const [tableHeight, setTableHeight] = useState<number | undefined>(undefined);

  useEffect(() => {
    const updateHeight = () => {
      if (tableContainerRef.current) {
        const { height } = tableContainerRef.current.getBoundingClientRect();
        setTableHeight(height);
      }
    };
    updateHeight();
    window.addEventListener('resize', updateHeight);

    const resizeObserver = new ResizeObserver(updateHeight);
    if (tableContainerRef.current) {
      resizeObserver.observe(tableContainerRef.current);
    }

    return () => {
      window.removeEventListener('resize', updateHeight);
      resizeObserver.disconnect();
    };
  }, [paginationData, managedColumns]);

  const handleColumnOptionsChange = (allOptions: ColumnOption[]) => {
    setColumnOptions(allOptions);

    const newManagedColumns = allOptions.map((opt) => {
      const original = rest.columns.find((c) => c.key === opt.value);
      if (!original) {
        return {
          key: opt.value,
          title: opt.label,
          render: { isRender: false },
          width: 'auto',
          omit: !opt.isSelected,
        } as ColumnType<RecordType>;
      }
      return {
        ...original,
        omit: !opt.isSelected,
      };
    });

    setManagedColumns(newManagedColumns);
  };

  const handleResetColumns = () => {
    const resetOptions = columnOptions.map((opt) => {
      const original = rest.columns.find((col) => col.key === opt.value);
      return {
        ...opt,
        isSelected: original ? original.omit !== true : opt.isSelected,
      };
    });

    setColumnOptions(resetOptions);

    const resetManaged = resetOptions.map((opt) => {
      const original = rest.columns.find((col) => col.key === opt.value);
      if (!original) {
        return {
          key: opt.value,
          title: opt.label,
          render: { isRender: false },
          width: 'auto',
          omit: !opt.isSelected,
        } as ColumnType<RecordType>;
      }

      return {
        ...original,
        omit: !opt.isSelected,
      };
    });

    setManagedColumns(resetManaged);
  };

  const columnFilterDropdown = (
    <TableColumnFilter
      dropdownIcon={
        <SettingsIcon
          height={24}
          width={24}
          className="*:fill-icon-icon-icon"
        />
      }
      ref={tableContainerRef}
      name="columnSearch"
      style={{ height: tableHeight ? `${tableHeight}px` : undefined }}
      onColumnOptionsChange={handleColumnOptionsChange}
      onReset={handleResetColumns}
      onChange={(e) => {
        setColumnSearchVal(e.target.value);
      }}
      options={columnOptions}
      value={columnSearchVal}
    />
  );

  const hasPagination =
    paginationData && Object.keys(paginationData).length > 0;
  const filterHeader = filterHeaderChildren ? (
    <div
      className={`${filterHeaderWrapperClassName}
      bg-fill-fill
      h-22
      border-border-border-light
      flex items-center
      justify-between rounded-t-xl border-l
      border-r
      border-t px-6 pb-4
      pt-6
    `}
      style={{ maxWidth: 'calc(100vw - 50px)' }}
    >
      {filterHeaderChildren}
      {columnFilterDropdown}
    </div>
  ) : null;

  const tableElement = useFixedColumns ? (
    <TableWithFixedColumns<RecordType>
      {...rest}
      tableWrapperClassName={`${rest.tableWrapperClassName ?? ''} rounded-t-none`}
      columns={managedColumns}
      reorderedColumns
      enableRowScrollStyles
      paginationData={undefined}
      paginationWrapperClassName={undefined}
    />
  ) : (
    <Table<RecordType>
      {...rest}
      columns={managedColumns}
      enableRowScrollStyles
      paginationData={undefined}
      paginationWrapperClassName={undefined}
      rootClassName={`${rest.rootClassName ?? ''} rounded-t-none ${hasPagination ? 'rounded-b-none' : ''}`}
    />
  );

  if (useFixedColumns) {
    return (
      <>
        {filterHeader}

        {tableElement}

        {hasPagination && (
          <div className="border-border-border-light border-t">
            <Pagination {...paginationData} />
          </div>
        )}
      </>
    );
  }

  const tableSection = (
    <>
      {filterHeader}
      {tableElement}
    </>
  );

  if (hasPagination) {
    return (
      <>
        {tableSection}
        <div
          className={`${paginationWrapperClassName ?? ''} border-border-border-light rounded-b-lg border !border-t-0`}
        >
          <Pagination {...paginationData} />
        </div>
      </>
    );
  }

  return tableSection;
}
