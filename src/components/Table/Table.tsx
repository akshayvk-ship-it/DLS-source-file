import React, {
  ChangeEvent,
  RefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { createPortal } from 'react-dom';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Pagination, PaginationProps } from '../Pagination';

import ArrowIcon from '../../icons/ArrowIcon';
import { CheckboxBase } from '../SelectionControls/Checkbox/Base';
import { FilterDefaultIcon, PinIcon, PinnedIcon } from '../Icons';
import { getFilterPosition, getSafeContainer, sortCompare } from './helper';
import SwitchButton from './SwitchButton';
import { FilterConfig, TypeKey } from './types';
import { useCloseOnOutsideClickWithTriggerMap } from '../hooks/useOutsideClick';
import { ToolTipBase } from '../ToolTip';
import TruncatedField from './TrucatedField';

type RenderType<T> =
  | {
      isRender: true;
      renderElement: (
        currentCellData: PropertyKey,
        key: string,
        index: number,
        rowData: T,
      ) => React.JSX.Element;
    }
  | { isRender: false };

export interface ColumnType<RecordType> extends TypeKey {
  key: string;
  title?: string;
  dropdownLabel?: string;
  sortable?: boolean;
  align?: 'left' | 'right' | 'center';
  className?: string;
  headerClassname?: string;
  sortIcons?: JSX.Element;
  render: RenderType<RecordType>;
  width: string;
  pinned?: boolean;
  expandable?: boolean;
  omit?: boolean;
  maxWidth?: string;
  columnWidth?: string;

  /**
   * Custom filter configuration for this column.
   *
   * Adds a filter icon to the column header that opens a dropdown
   * with your custom filter UI. When a filter is active, the table
   * automatically hides rows that don't match the filter criteria.
   *
   * @see {@link FilterConfig} for detailed configuration options
   *
   * @example Simple string search
   * ```tsx
   * {
   *   key: 'name',
   *   title: 'Name',
   *   filter: {
   *     component: SearchFilter,
   *     filterFn: (rowValue, filterValue) =>
   *       String(rowValue).toLowerCase().includes(String(filterValue).toLowerCase()),
   *   },
   * }
   * ```
   *
   */
  filter?: FilterConfig<Array<RecordType>>;
  isTruncated?: boolean;
}

export interface PinData {
  pinnedItemsLength: number;
  pinnedColumnsKey: string[];
  isPinnedTable: boolean;
  shouldResetSortField?: boolean;
  getActiveSortField?: (sortKey: string, order: string) => void;
  pinningHandler: (index: number | string, pinned: boolean) => void;
  sortInfoData: {
    sortField: string;
    order: string;
  };
  isReorderedMode?: boolean;
}

export type AnyObject = Record<PropertyKey, unknown>;

export interface TableProps<RecordType = unknown> {
  columnHeaderClassName?: string;
  columns: ColumnType<RecordType>[];
  rowsData: Array<RecordType>;
  isRowHover?: boolean;
  rowClickable?: {
    isRowClickable: boolean;
    rowClickHandler: (
      e: React.MouseEvent,
      row: RecordType | Record<string, string | number>,
    ) => void;
  };
  testIdKeyName?: string;
  stickyRow?: boolean;
  rootClassName?: string;
  rowClassName?: string;
  sortIcons?: (
    sortOrder: string,
    indicatorUpClassName: string,
    indicatorDownClassName: string,
  ) => JSX.Element;
  paginationData?: PaginationProps;
  paginationWrapperClassName?: string;
  customEmptyElement?: JSX.Element;
  tableRef?: RefObject<HTMLDivElement>;
  rowSelection?: {
    selectedRowKeys: Array<string>;
    uniqueKey: string;
    onChange: (i: Array<string | number | undefined>) => void;
  };
  enableRowScrollStyles?: boolean;
  checkboxSize?: 'sm' | 'lg';
  pinData?: PinData;
  rowMouseEnter?: (index: number) => void;
  rowMouseLeave?: (index: number) => void;
  rowClassNameIndex?: (index: number) => string;
  customSorting?: (key: string, sortOrder: string) => void;
  tableHeadClassName?: string;
  tableCustomInlineStyles?: React.CSSProperties;
  renderExpandedElement?: (rowData: RecordType) => JSX.Element;

  /**
   * The currently active filters applied to the table, keyed by column key.
   *
   * Each key corresponds to a column's `key` and the value is the current
   * filter value for that column. You can use this to control filters
   * externally or persist them (e.g. in URL params or local storage).
   *
   * Pass `undefined` to let the table manage filters internally.
   */
  filters?: Record<string, unknown>;

  /**
   * Callback fired whenever a filter value changes in the table.
   *
   * Receives the full updated filters object with all active filters,
   * not just the one that changed.
   */
  onFilterChange?: (filters: Record<string, unknown>) => void;

  /**
   * The DOM element to render filter dropdowns into.
   *
   * By default, filter dropdowns are rendered into `document.body` using
   * a React portal — this prevents them from being clipped by the table's
   * overflow or scroll container.
   *
   * - Pass an `HTMLElement` to render into a specific container
   * - Pass `null` to render into `document.body` (default behavior)
   * - Pass `false` to disable the portal entirely and render inline
   *
   * @default null — renders into document.body
   *
   * @example Default — portal into document.body
   * ```tsx
   * <Table ... />
   * ```
   *
   * @example Portal into a custom container (e.g. inside a modal)
   * ```tsx
   * <Table
   *   filterContainer={document.getElementById('my-modal')}
   *   ...
   * />
   * ```
   *
   * @example Disable portal — render inline inside the table
   * ```tsx
   * <Table
   *   filterContainer={false}
   *   ...
   * />
   * ```
   * @example With extra component props
   * ```tsx
   * {
   *   key: 'age',
   *   title: 'Age',
   *   filter: {
   *     component: RangeFilter,
   *     filterFn: (rowValue, filterValue: { min: number; max: number }) =>
   *       Number(rowValue) >= filterValue.min && Number(rowValue) <= filterValue.max,
   *     componentProps: {
   *       step: 1,
   *       unit: 'years',
   *     },
   *   },
   * }
   * ```
   */
  filterContainer?: HTMLElement | false;
}

export function Table<RecordType extends AnyObject = AnyObject>({
  columns,
  rowsData,
  isRowHover = false,
  rowClickable = {
    isRowClickable: false,
    rowClickHandler: () => {},
  },
  enableRowScrollStyles = false,
  testIdKeyName = '',
  stickyRow = false,
  rootClassName = '',
  rowClassName = '',
  columnHeaderClassName = '',
  sortIcons = undefined,
  paginationData = undefined,
  paginationWrapperClassName = '',
  customEmptyElement,
  tableRef = undefined,
  rowSelection = undefined,
  checkboxSize = 'sm',
  pinData = undefined,
  rowMouseEnter = undefined,
  rowMouseLeave = undefined,
  rowClassNameIndex = undefined,
  customSorting = undefined,
  tableHeadClassName = '',
  tableCustomInlineStyles = {},
  renderExpandedElement = undefined,
  filters = {},
  onFilterChange,
  filterContainer,
}: TableProps<RecordType>) {
  const [tableData, setTableData] = useState<Array<RecordType>>(rowsData);
  const [sortField, setSortField] = useState('reset');
  const [order, setOrder] = useState('reset');
  const internalTableRef = useRef<HTMLDivElement>(null);
  const effectiveRef = tableRef || internalTableRef;
  const [tableWidth, setTableWidth] = useState<number>(0);
  const bodyRef = useRef<HTMLDivElement>(null);
  const headRef = useRef<HTMLDivElement>(null);
  const [openFilter, setOpenFilter] = useState<string | null>(null); // stores field name

  const filterPopUpRef = useRef<HTMLDivElement | null>(null);
  const triggerRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const [toolTipContent, setToolTipContent] = useState<{
    content: string;
    x: number;
    y: number;
  } | null>(null);

  const [autoColumnWidths, setAutoColumnWidths] = useState<
    Record<string, number>
  >({});

  const filteredColumns = useMemo(
    () => columns.filter((col) => !col.omit),
    [columns],
  );

  useCloseOnOutsideClickWithTriggerMap({
    isOpen: openFilter,
    onClose: () => setOpenFilter(null),
    popupRef: filterPopUpRef,
    triggerMapRef: triggerRefs,
  });

  const columnRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  useEffect(() => {
    if (!enableRowScrollStyles) return () => {};
    let resizeObserver: ResizeObserver;
    if (effectiveRef?.current) {
      resizeObserver = new ResizeObserver(() => {
        setTableWidth(effectiveRef.current?.scrollWidth || 0);
      });
      resizeObserver.observe(effectiveRef.current);
    }
    return () => resizeObserver?.disconnect();
  }, [effectiveRef, enableRowScrollStyles]);

  useEffect(() => {
    if (!openFilter) return () => {};

    const handleScroll = () => setOpenFilter(null);

    window.addEventListener('scroll', handleScroll, true);

    return () => window.removeEventListener('scroll', handleScroll, true);
  }, [openFilter]);

  useEffect(() => {
    if (!enableRowScrollStyles) return () => {};
    if (!bodyRef.current) {
      return () => {};
    }

    const autoCols = filteredColumns.filter((c) => c.width === 'auto');
    if (autoCols.length === 0) {
      return () => {};
    }

    const observer = new ResizeObserver(() => {
      const newWidths: Record<string, number> = {};

      autoCols.forEach((col) => {
        let maxWidth = 0;

        const bodyCells = bodyRef.current!.querySelectorAll(
          `[data-col-key="${col.key}"]`,
        );
        bodyCells.forEach((cell) => {
          const width = (cell as HTMLElement).offsetWidth;
          if (width > maxWidth) maxWidth = width;
        });

        const headerCell = headRef.current?.querySelector(
          `[data-col-key="${col.key}"]`,
        ) as HTMLElement | null;
        if (headerCell) {
          const headerWidth = headerCell.offsetWidth;
          if (headerWidth > maxWidth) maxWidth = headerWidth;
        }
        newWidths[col.key] = maxWidth;
      });

      setAutoColumnWidths(newWidths);
    });
    observer.observe(bodyRef.current);
    if (headRef.current) observer.observe(headRef.current);

    return () => observer.disconnect();
  }, [filteredColumns, tableData, headRef, bodyRef, enableRowScrollStyles]);

  // Handle filter changes
  const handleFilterChange = useCallback(
    (columnKey: string, filterValue: unknown) => {
      if (!onFilterChange) return;

      if (
        filterValue == null ||
        (Array.isArray(filterValue) && filterValue.length === 0) ||
        (typeof filterValue === 'string' && filterValue.trim() === '')
      ) {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        const { [columnKey]: _, ...rest } = filters;
        onFilterChange(rest);
      } else {
        onFilterChange({
          ...filters,
          [columnKey]: filterValue,
        });
      }
    },
    [filters, onFilterChange],
  );

  const getColumnWidth = (width: string, key: string): string => {
    if (width === 'auto' && key && autoColumnWidths[key]) {
      return `${autoColumnWidths[key]}px`;
    }
    if (width.endsWith('%') && tableWidth) {
      const percent = parseFloat(width);
      return `${(tableWidth * percent) / 100}px`;
    }
    return width;
  };

  const alignmentClass = {
    right: 'text-right justify-end',
    left: 'text-left justify-start',
    center: 'text-center justify-center',
  };

  const sortIndicatorUpClass = (item: ColumnType<RecordType>): string => {
    if (item.key !== sortField) return 'sort-inactive';
    if (item.key === sortField || sortField === 'reset') {
      if (order === 'desc' || order === 'reset') return 'sort-inactive';
    }

    return 'sort-indicator';
  };

  const sortIndicatorDownClass = (item: ColumnType<RecordType>) => {
    if (item.key !== sortField) return 'sort-inactive';
    if (item.key === sortField || sortField === 'reset') {
      if (order === 'asc' || order === 'reset') return 'sort-inactive';
    }

    return 'sort-indicator';
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
      setTableData(sorted);
    },
    [rowsData],
  );

  const getSortOrder = (key: string): string => {
    if (key === sortField && order === 'asc') return 'desc';
    if (key === sortField && order === 'desc') return 'reset';
    return 'asc';
  };

  const handleSortingChange = (item: ColumnType<RecordType>) => {
    if (!item.sortable || tableData?.length < 1) return;
    const sortOrder = getSortOrder(item.key);
    setSortField(item.key);
    setOrder(sortOrder);
    if (pinData) {
      pinData?.getActiveSortField?.(item.key, sortOrder);
    }
    if (!customSorting) {
      handleSorting(item.key, sortOrder);
    } else {
      customSorting(item.key, sortOrder);
    }
  };

  useEffect(() => {
    if (sortField !== 'reset') {
      handleSorting(sortField, order);
    } else {
      setTableData(rowsData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order, sortField]);

  useEffect(() => {
    setTableData(rowsData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rowsData]);

  useEffect(() => {
    if (pinData?.shouldResetSortField) {
      setSortField('reset');
    } else if (pinData?.sortInfoData) {
      setSortField(pinData.sortInfoData.sortField);
      setOrder(pinData.sortInfoData.order);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pinData?.shouldResetSortField]);

  const [selectedRowsKey, setSelectedRowsKey] = useState<Array<RecordType>>([]);

  const handleRowSelectionChange = (
    event: ChangeEvent<HTMLInputElement>,
    item: RecordType,
  ) => {
    const selectedRows = selectedRowsKey;
    const itemIndex = selectedRows.indexOf(item);

    if (itemIndex < 0) {
      selectedRows.push(item);
    } else if (itemIndex > -1) {
      selectedRows.splice(itemIndex, 1);
    }
    setSelectedRowsKey([...selectedRows]);
    const selectedIds = selectedRows.map(
      (i) => i[rowSelection?.uniqueKey || ''],
    ) as Array<string | number>;
    rowSelection?.onChange(selectedIds);
  };

  const [expandedRowIndex, setExpandedRowIndex] = useState<number | null>(null);

  useEffect(() => {
    setExpandedRowIndex(null);
  }, [paginationData, sortField, order]);

  const handleRowSelectionAll = (event: ChangeEvent<HTMLInputElement>) => {
    let selectedRows: Array<RecordType> = [];
    if (event.target.checked) {
      selectedRows = tableData;
    } else {
      selectedRows = [];
    }
    setSelectedRowsKey([...selectedRows]);
    const selectedIds = selectedRows.map(
      (i) => i[rowSelection?.uniqueKey || ''],
    ) as Array<string | number>;
    rowSelection?.onChange(selectedIds);
  };

  useEffect(() => {
    setSelectedRowsKey(
      tableData.filter((item) =>
        rowSelection?.selectedRowKeys.includes(
          (item[rowSelection?.uniqueKey || ''] as string | number).toString(),
        ),
      ),
    );
  }, [rowSelection?.selectedRowKeys, tableData, rowSelection]);

  const renderPinComponent = (
    currentIndex: number,
    columnKey: string,
    columnAlignment?: string,
  ) => {
    const pinAlignment = columnAlignment === 'right' ? 'left-2' : 'right-2';

    if (pinData && pinData?.pinnedColumnsKey.includes(columnKey)) {
      return (
        <button
          type="button"
          onClick={(e) => {
            if (!tableData.length) return;
            if (pinData?.isReorderedMode) {
              pinData?.pinningHandler?.(columnKey, true);
            } else {
              pinData?.pinningHandler?.(currentIndex, true);
            }
            e.stopPropagation();
          }}
          className={`${pinAlignment} bg-fill-pressed-dark pin-button invisible absolute rounded-md p-0.5`}
        >
          <PinnedIcon className="h-5 w-5" />
        </button>
      );
    }

    return (
      <button
        type="button"
        onClick={(e) => {
          if (!tableData.length) return;
          if (pinData?.isReorderedMode) {
            pinData?.pinningHandler?.(columnKey, false);
          } else {
            pinData?.pinningHandler?.(currentIndex, false);
          }
          e.stopPropagation();
        }}
        className={`${pinAlignment} hover:bg-fill-hover pin-button invisible absolute hover:rounded-lg`}
      >
        <PinIcon className="h-5 w-5" />
      </button>
    );
  };

  const uniqueValuesCache = useRef<Record<string, unknown[]>>({});

  const getUniqueValues = useCallback(
    (key: string) => {
      if (uniqueValuesCache.current[key] !== undefined) {
        return uniqueValuesCache.current[key];
      }

      const col = columns.find((c) => c.key === key);
      if (!col?.filter) {
        uniqueValuesCache.current[key] = [];
        return [];
      }

      const vals = rowsData.map((r) => r[key]);
      const unique = [...new Set(vals)];
      uniqueValuesCache.current[key] = unique;
      return unique;
    },
    [rowsData, columns],
  );

  const [popupHeight, setPopupHeight] = useState(200);

  useEffect(() => {
    if (filterPopUpRef.current) {
      setPopupHeight(filterPopUpRef.current.offsetHeight);
    }
  }, [openFilter]);

  const renderFilterComponent = (column: ColumnType<RecordType>) => {
    if (!column.filter) return null;

    const isOpen = openFilter === column.key;

    const triggerEl = triggerRefs.current.get(column.key);
    const rect = triggerEl?.getBoundingClientRect();

    const dropdown = rect ? (
      <div
        className={`          
           bg-fill-fill fixed z-[9999] mt-2 w-fit rounded-lg shadow-[0px_1px_4px_0px_rgba(0,0,0,0.1),_0px_1px_3px_0px_rgba(27,32,41,0.06)]`}
        ref={filterPopUpRef}
        style={{
          ...getFilterPosition(column.filter.position, rect, popupHeight),
        }}
      >
        <column.filter.component
          onClose={() => setOpenFilter(null)}
          currentColumnData={column}
          onFilterChange={handleFilterChange}
          currentFilterValue={filters[column.key]}
          rowValues={getUniqueValues(column.key)}
          {...column.filter.componentProps}
        />
      </div>
    ) : null;

    const renderWithContainer = (content: React.ReactNode) => {
      if (filterContainer === false) return content;
      return createPortal(
        content,
        getSafeContainer(filterContainer) ?? document.body,
      );
    };

    return (
      <div
        className="relative ml-4"
        ref={(el) => {
          if (el) {
            triggerRefs.current.set(column.key, el);
          } else {
            triggerRefs.current.delete(column.key);
          }
        }}
      >
        <FilterDefaultIcon
          className="h-5 w-5 cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();

            setOpenFilter((current) =>
              current === column.key ? null : column.key,
            );
          }}
        />
        {isOpen && dropdown && renderWithContainer(dropdown)}
      </div>
    );
  };

  const setColumnRef = (key: string) => (el: HTMLDivElement | null) => {
    if (el) {
      columnRefs.current.set(key, el);
    } else {
      columnRefs.current.delete(key);
    }
  };

  const renderHead = (
    <div
      className={`${stickyRow ? 'sticky top-0 z-10' : ''} ${tableHeadClassName || ''} bg-fill-fill-dark border-border-border-light flex min-h-12 ${enableRowScrollStyles ? 'w-full min-w-max' : 'w-fit min-w-full'} items-center rounded-t-lg border-b ${pinData?.isPinnedTable ? 'pl-6' : 'px-6'}`}
    >
      {rowSelection && (
        <CheckboxBase
          id="table-row-checkbox-all"
          size={checkboxSize}
          checked={
            (selectedRowsKey.length === tableData.length &&
              tableData.length) as boolean
          }
          indeterminate={
            selectedRowsKey.length > 0 &&
            selectedRowsKey.length < tableData.length
          }
          onChange={handleRowSelectionAll}
          name="row"
          disabled={!tableData.length}
          checkboxWrapperClassName="mr-2"
        />
      )}
      {filteredColumns.map((column, index) => (
        <div
          data-col-key={column.key}
          key={column.title}
          className={`${column.headerClassname || ''} ${columnHeaderClassName || ''} relative flex items-center
            ${column.sortable && tableData.length && !column.filter ? 'cursor-pointer' : ''}
            ${index !== 0 && column.align === 'right' ? `pr-2` : `pl-2`}
            ${alignmentClass[column.align || 'left']}            
            [&:hover>.pin-button]:visible
          `}
          style={
            enableRowScrollStyles
              ? {
                  width: getColumnWidth(column.width, column.key),
                  flexGrow: 0,
                  flexShrink: 0,
                  maxWidth: column.maxWidth,
                }
              : {
                  minWidth: column.width,
                  maxWidth: column.maxWidth,
                  width: column.columnWidth,
                }
          }
          onClick={() => {
            if (column.filter) {
              return;
            }
            handleSortingChange(column);
          }}
          onKeyDown={(e) => {
            if (column.filter) {
              return;
            }
            if (e.key === 'Enter') {
              handleSortingChange(column);
            }
          }}
          tabIndex={column.sortable ? 0 : -1}
          role="columnheader"
          ref={setColumnRef(column.key)}
        >
          <span
            className={`text-text-dark label-small ${enableRowScrollStyles ? 'whitespace-nowrap' : ''} font-semibold`}
          >
            {column.title}
          </span>
          {column.filter ? renderFilterComponent(column) : null}
          {column.sortable && !column.filter ? (
            <div>
              {sortIcons ? (
                sortIcons(
                  order,
                  sortIndicatorUpClass(column),
                  sortIndicatorDownClass(column),
                )
              ) : (
                <ArrowIcon
                  className={`ml-2.5 ${order === 'asc' && sortField === column.key ? 'last:[&>path]:fill-icon-icon' : ''} ${order === 'desc' && sortField === column.key ? 'first:[&>path]:fill-icon-icon' : ''}`}
                />
              )}
            </div>
          ) : (
            ''
          )}
          {column.pinned
            ? renderPinComponent(index, column.key, column.align)
            : ''}
        </div>
      ))}
    </div>
  );

  const renderBody = tableData.map((rowItem, index) => {
    const isCurrentCellExpanded = expandedRowIndex === index;
    const handleColumnExpand = (e: React.MouseEvent | React.KeyboardEvent) => {
      e.stopPropagation();
      if (isCurrentCellExpanded) {
        setExpandedRowIndex(null);
      } else {
        setExpandedRowIndex(index);
      }
    };

    return (
      <div key={rowItem.key as string}>
        <div
          className={`${rowClassName} ${rowClassNameIndex?.(index) || ''} ${enableRowScrollStyles ? 'w-full min-w-max' : ''} ${pinData?.isPinnedTable ? 'pl-6' : 'px-6'} flex items-center ${isCurrentCellExpanded ? 'border-transparent' : 'border-border-border-light'} border-b py-3 transition-[border-color] duration-300  ${isRowHover || rowClickable?.isRowClickable ? 'hover:bg-fill-hover' : ''} ${rowClickable?.isRowClickable ? 'cursor-pointer' : ''}`}
          onClick={
            rowClickable?.isRowClickable
              ? (e) => rowClickable.rowClickHandler(e, rowItem)
              : undefined
          }
          tabIndex={rowClickable?.isRowClickable ? 0 : -1}
          role="row"
          onKeyDown={() => {}}
          onMouseEnter={
            rowMouseEnter ? () => rowMouseEnter?.(index) : undefined
          }
          onMouseLeave={
            rowMouseLeave ? () => rowMouseLeave?.(index) : undefined
          }
        >
          {rowSelection && (
            <CheckboxBase
              id={`table-row-checkbox-${index}`}
              size={checkboxSize}
              checked={selectedRowsKey.includes(rowItem)}
              onChange={(e) => handleRowSelectionChange(e, rowItem)}
              name="row"
              disabled={!tableData.length}
              checkboxWrapperClassName="mr-2"
            />
          )}
          {filteredColumns.map((column) => (
            <div
              data-col-key={column.key}
              key={column.key}
              className={`${column.className || ''} text-text-text label-medium flex h-12 items-center gap-4 overflow-hidden pl-2  
               ${alignmentClass[column.align || 'left']}         
            ${column.align === 'right' ? 'pr-2' : 'pl-2'}            
          `}
              style={
                enableRowScrollStyles
                  ? {
                      width: getColumnWidth(column.width, column.key),
                      flexGrow: 0,
                      flexShrink: 0,
                      maxWidth: column.maxWidth,
                    }
                  : {
                      minWidth: column.width,
                      maxWidth: column.maxWidth,
                      width: column.isTruncated
                        ? `${columnRefs.current?.get(column.key)?.offsetWidth?.toString()}px`
                        : column.columnWidth,
                    }
              }
              data-testid={`${
                stickyRow
                  ? `table-data-${index}-${column.key}`
                  : `table-data-${index}-${column.key}-${
                      testIdKeyName
                        ? (rowItem[testIdKeyName] as string | number)
                        : index
                    }`
              }`}
            >
              {column.render.isRender ? (
                column.render.renderElement(
                  rowItem[column.key] as PropertyKey,
                  column.key,
                  index,
                  rowItem,
                )
              ) : (
                <TruncatedField
                  currentCellData={rowItem[column.key] as string | number}
                  headerRefs={columnRefs}
                  columnKey={column.key}
                  isTruncated={!!column.isTruncated}
                  setToolTipContent={setToolTipContent}
                />
              )}

              {column.expandable && (
                <SwitchButton
                  isActive={isCurrentCellExpanded}
                  rowIndex={index}
                  handleColumnExpand={handleColumnExpand}
                />
              )}
            </div>
          ))}
        </div>
        {renderExpandedElement && (
          <div
            className={`${isCurrentCellExpanded ? 'border-border-action-focused h-14 border-b' : 'h-0 border-transparent'} w-full overflow-hidden transition-[height,border-color] duration-300 ease-in-out`}
          >
            {renderExpandedElement(rowItem)}
          </div>
        )}
      </div>
    );
  });

  const renderEmpty = customEmptyElement || (
    <div className="label-medium text-text-text flex items-center justify-center py-16">
      No records found
    </div>
  );

  const renderTable = (
    <div
      className={`${rootClassName} ${paginationData ? 'border-x-0' : 'rounded-b-lg border-t'} border-border-border-light flex flex-col overflow-y-auto ${enableRowScrollStyles ? 'overflow-x-hidden' : ''} rounded-t-lg border-x border-b`}
      ref={effectiveRef}
      style={
        enableRowScrollStyles
          ? {
              maxWidth: 'calc(100vw - 50px)',
              ...tableCustomInlineStyles,
            }
          : tableCustomInlineStyles
      }
    >
      {enableRowScrollStyles ? (
        <div className="w-full overflow-x-auto" ref={headRef}>
          {renderHead}
          <div
            className="w-fit min-w-full [&>*:last-child>div]:border-b-0
"
            ref={bodyRef}
          >
            {renderBody}
          </div>
        </div>
      ) : (
        <>
          {renderHead}
          <div className="w-fit min-w-full [&>*:last-child>div]:border-b-0">
            {renderBody}
          </div>
        </>
      )}
      {!tableData.length && renderEmpty}

      {/* Render ToolTip */}
      {toolTipContent && (
        <div
          className="fixed z-50"
          style={{
            left: `${toolTipContent.x}px`,
            top: `${toolTipContent.y}px`,
          }}
        >
          <ToolTipBase
            placementToolTip="top-center"
            toolTipType="contextual"
            contentToolTip={toolTipContent.content}
          />
        </div>
      )}
    </div>
  );

  if (paginationData && Object.keys(paginationData).length) {
    return (
      <div
        className={`${paginationWrapperClassName} border-border-border-light ${enableRowScrollStyles ? 'w-full' : ''} rounded-lg border`}
        style={
          enableRowScrollStyles
            ? {
                maxWidth: 'calc(100vw - 50px)',
              }
            : undefined
        }
      >
        {renderTable}
        <Pagination
          // {...paginationData}
          currentPage={paginationData.currentPage}
          disabledButtonClassName={paginationData.disabledButtonClassName}
          disabledTextClassName={paginationData.disabledTextClassName}
          dropdownClassName={paginationData.dropdownClassName}
          hidePagination={paginationData.hidePagination}
          itemsPerPage={paginationData.itemsPerPage}
          itemsPerPageOptions={paginationData.itemsPerPageOptions}
          nextClassName={paginationData.nextClassName}
          onPageChange={paginationData.onPageChange}
          onItemsPerPageChanged={paginationData.onItemsPerPageChanged}
          optionDropdownClassName={paginationData.optionDropdownClassName}
          previousClassName={paginationData.previousClassName}
          textDropdownClassName={paginationData.textDropdownClassName}
          totalItems={paginationData.totalItems}
          wrapperClass={`${paginationData.wrapperClass}  `}
        />
      </div>
    );
  }

  return renderTable;
}
