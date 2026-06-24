import { useCallback, useEffect, useRef, useState } from 'react';
import { AnyObject, ColumnType, Table, TableProps } from './Table';
import { Pagination } from '../Pagination';
import { sortCompare } from './helper';

export interface TableFixedColumns<T = unknown>
  extends Omit<TableProps<T>, 'pinData'> {
  tableWrapperClassName?: string;
  reorderedColumns?: boolean;
}

export function TableWithFixedColumns<
  RecordType extends AnyObject = AnyObject,
>({
  columns,
  rowsData,
  paginationData,
  paginationWrapperClassName = '',
  tableWrapperClassName = '',
  reorderedColumns = false,
  ...rest
}: TableFixedColumns<RecordType>) {
  const pinnedTableRef = useRef<HTMLDivElement | null>(null);
  const nonPinnedTableRef = useRef<HTMLDivElement | null>(null);
  const [horizontalScroll, setHorizontalScroll] = useState<number>(0);

  const [activeRowHover, setActiveRowHover] = useState<number>(-1);
  const initialState = {
    sortField: '',
    order: '',
  };
  const [activeSortField, setActiveSortField] = useState<{
    sortField: string;
    order: string;
  }>(initialState);

  const [pinnedColumns, setPinnedColumns] = useState<
    Array<ColumnType<RecordType>>
  >([]);
  const [nonPinnedColumns, setNonPinnedColumns] = useState<
    Array<ColumnType<RecordType>>
  >(columns || []);

  const [pinnedColumnList, setPinnedColumnList] = useState<string[]>([]);

  const [tableRowsData, setTableRowsData] =
    useState<Array<RecordType>>(rowsData);

  useEffect(() => {
    if (!reorderedColumns) return;
    const currentPinnedKeys = new Set(pinnedColumnList);

    const newPinned = columns.filter((col) => currentPinnedKeys.has(col.key));

    const newNonPinned = columns.filter(
      (col) => !currentPinnedKeys.has(col.key),
    );

    setPinnedColumns(newPinned);
    setNonPinnedColumns(newNonPinned);

    const updatedPinnedKeys = newPinned.map((c) => c.key);
    setPinnedColumnList(updatedPinnedKeys);

    const reAddPinned = columns.filter(
      (col) =>
        !newPinned.some((p) => p.key === col.key) &&
        pinnedColumnList.includes(col.key),
    );
    if (reAddPinned.length > 0) {
      setPinnedColumns((prev) => [...prev, ...reAddPinned]);
      setPinnedColumnList((prev) => [
        ...prev,
        ...reAddPinned.map((c) => c.key),
      ]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [columns]);

  useEffect(() => {
    const scrollSyncing = (event: Event) => {
      if (!(pinnedTableRef && pinnedTableRef.current)) return;
      if (!(nonPinnedTableRef && nonPinnedTableRef.current)) return;

      if (event.target === nonPinnedTableRef.current) {
        pinnedTableRef.current.removeEventListener('scroll', scrollSyncing);
        pinnedTableRef.current.scrollTop =
          nonPinnedTableRef.current.scrollTop || 0;
        pinnedTableRef.current.addEventListener('scroll', scrollSyncing);
      } else if (event.target === pinnedTableRef.current) {
        nonPinnedTableRef.current.removeEventListener('scroll', scrollSyncing);
        nonPinnedTableRef.current.scrollTop =
          pinnedTableRef.current.scrollTop || 0;
        nonPinnedTableRef.current.addEventListener('scroll', scrollSyncing);
      }
    };

    const pinnedTableElement = pinnedTableRef && pinnedTableRef.current;
    const nonPinnedTableElement =
      nonPinnedTableRef && nonPinnedTableRef.current;

    if (pinnedTableElement) {
      pinnedTableElement.addEventListener('scroll', scrollSyncing);
      nonPinnedTableElement?.addEventListener('scroll', scrollSyncing);
    }

    if (nonPinnedTableRef.current) {
      if (
        nonPinnedTableRef.current.scrollWidth >
        nonPinnedTableRef.current.clientWidth
      ) {
        setHorizontalScroll(
          nonPinnedTableRef.current.offsetHeight -
            nonPinnedTableRef.current.clientHeight,
        );
      }
    }

    return () => {
      if (pinnedTableElement) {
        pinnedTableElement.removeEventListener('scroll', scrollSyncing);
      }
      if (nonPinnedTableElement)
        nonPinnedTableElement.removeEventListener('scroll', scrollSyncing);
    };
  }, [pinnedColumnList.length]);

  useEffect(() => {
    setTableRowsData(rowsData);
  }, [rowsData]);

  const pinningHandler = (indexOrKey: number | string, pinned: boolean) => {
    let column;
    if (typeof indexOrKey === 'string') {
      column = nonPinnedColumns.find((c) => c.key === indexOrKey);
    } else {
      column = nonPinnedColumns[indexOrKey];
    }
    if (!column) return;
    if (!pinned && pinnedColumns.length < 3) {
      const pinnedKey = column;
      setPinnedColumns((prevPinned) => [...prevPinned, pinnedKey]);
      setPinnedColumnList((prev) => [...prev, pinnedKey.key]);

      const filteredList = nonPinnedColumns.filter(
        (item) => item.key !== pinnedKey.key,
      );

      setNonPinnedColumns(filteredList);
    }

    if (pinned && pinnedColumns.length) {
      const pinnedItem = column;
      const filteredPinnedColumns = pinnedColumnList.filter(
        (item) => item !== pinnedItem.key,
      );

      const filterOutPinned = columns.filter(
        (item) => !filteredPinnedColumns.includes(item.key),
      );
      setNonPinnedColumns(filterOutPinned);

      const listPinnedColumn = pinnedColumns.filter(
        (item) => item.key !== pinnedItem.key,
      );

      setPinnedColumns(listPinnedColumn);

      setPinnedColumnList(filteredPinnedColumns);
    }
  };

  const pinningHandlerForReorderedColumns = (
    columnKey: string | number, // ← only string, no union
    pinned: boolean,
  ) => {
    if (!pinned && typeof columnKey === 'string') {
      if (pinnedColumns.length >= 3) return;
      if (pinnedColumnList.includes(columnKey)) return;

      setPinnedColumns((prev) => {
        const col = columns.find((c) => c.key === columnKey);
        return col ? [...prev, col] : prev;
      });

      setPinnedColumnList((prev) => [...prev, columnKey]);
      setNonPinnedColumns((prev) =>
        prev.filter((item) => item.key !== columnKey),
      );
    } else {
      const columnToUnpin = pinnedColumns.find((c) => c.key === columnKey);
      if (!columnToUnpin) return;

      setPinnedColumns((prev) => prev.filter((c) => c.key !== columnKey));
      setPinnedColumnList((prev) => prev.filter((k) => k !== columnKey));

      const newNonPinned = columns.filter(
        (col) => !pinnedColumnList.includes(col.key) || col.key === columnKey,
      );

      setNonPinnedColumns(newNonPinned);
    }
  };

  const rowMouseEnter = (index: number) => {
    setActiveRowHover(index);
  };

  const rowMouseLeave = () => {
    setActiveRowHover(-1);
  };

  const rowClassNameHandler = (index: number) => {
    if (index === activeRowHover) {
      return 'bg-fill-hover';
    }
    return '';
  };

  const handleSorting = useCallback(
    (key: string, sortOrder: string) => {
      let sorted = Array.from(rowsData).sort((a, b) =>
        sortCompare(
          a[key] as string | number | boolean | string[],
          b[key] as string | number | boolean | string[],
          sortOrder,
        ),
      );

      sorted = sortOrder === 'reset' ? rowsData : sorted;
      setTableRowsData(sorted);
    },
    [rowsData],
  );

  const getActiveSortField = (sortKey: string, sortOrder: string) => {
    setActiveSortField({ sortField: sortKey, order: sortOrder });
  };

  const pinData = {
    pinnedItemsLength: pinnedColumns.length,
    pinnedColumnsKey: pinnedColumnList,
    getActiveSortField,
    pinningHandler: reorderedColumns
      ? pinningHandlerForReorderedColumns
      : pinningHandler,
    isReorderedMode: reorderedColumns,
  };

  const sortInfoData = {
    sortField: activeSortField.sortField,
    order: activeSortField.order,
  };

  const tablePinData = {
    ...pinData,
    isPinnedTable: false,
    shouldResetSortField: pinnedColumnList.includes(activeSortField.sortField),
    sortInfoData,
  };

  const pinnedTablePinData = {
    ...pinData,
    isPinnedTable: true,
    shouldResetSortField: !pinnedColumnList.includes(activeSortField.sortField),
    sortInfoData,
  };

  const tableComponent = (
    <div className="overflow-auto" ref={nonPinnedTableRef}>
      <Table
        {...rest}
        rowsData={tableRowsData}
        columns={nonPinnedColumns}
        rowSelection={pinnedColumns.length ? undefined : rest.rowSelection}
        pinData={tablePinData}
        rowClassNameIndex={
          activeRowHover >= 0 ? rowClassNameHandler : undefined
        }
        rowMouseEnter={rowMouseEnter}
        rowMouseLeave={rowMouseLeave}
        customSorting={handleSorting}
        rootClassName={`${rest.rootClassName || ''} min-w-fit !border-0 ${pinnedColumns.length ? '!rounded-l-none' : ''}`}
        tableHeadClassName={`${rest.tableHeadClassName || ''} !rounded-l-none`}
        paginationData={undefined}
        paginationWrapperClassName={undefined}
        columnHeaderClassName="h-12"
      />
    </div>
  );

  const pinnedTable = (
    <Table
      {...rest}
      tableCustomInlineStyles={{
        paddingBottom: horizontalScroll ? `${horizontalScroll}px` : undefined,
      }}
      rowsData={tableRowsData}
      columns={pinnedColumns}
      pinData={pinnedTablePinData}
      tableRef={pinnedTableRef}
      rowClassNameIndex={activeRowHover >= 0 ? rowClassNameHandler : undefined}
      rowMouseEnter={rowMouseEnter}
      rowMouseLeave={rowMouseLeave}
      customSorting={handleSorting}
      rootClassName={`${rest.rootClassName || ''} min-w-fit !border-0 !border-r z-20 !rounded-r-none shadow-[1px_0px_1px_0px_rgba(235,237,239,1),0px_0px_0px_0px_rgba(0,0,0,0.1)] scroll-hidden`}
      tableHeadClassName={`${rest.tableHeadClassName || ''} !rounded-r-none`}
      paginationData={undefined}
      paginationWrapperClassName={undefined}
      columnHeaderClassName="h-12"
    />
  );

  const renderTables = (
    <div
      className={`${tableWrapperClassName} ${paginationData ? 'rounded-b-none border-0 border-b' : ''} border-border-border-light flex w-full rounded-lg border border-solid`}
    >
      {pinnedColumns.length ? pinnedTable : null}
      {tableComponent}
    </div>
  );

  if (paginationData && Object.keys(paginationData).length) {
    return (
      <div
        className={`${paginationWrapperClassName} border-border-border-light rounded-lg border border-solid`}
      >
        {renderTables}
        <Pagination
          {...paginationData}
          wrapperClass={`${paginationData.wrapperClass}  `}
        />
      </div>
    );
  }

  return renderTables;
}
