/* eslint-disable @typescript-eslint/no-explicit-any */

export interface TypeKey {
  key: string;
  [x: string]: unknown;
}

/**
 * Props passed to every filter component rendered inside the table.
 *
 * When you create a custom filter component, it will automatically receive
 * these props from the table — you don't need to pass them manually.
 *
 * @template TFilterValue - The type of value your filter produces.
 *
 * @example String search filter
 * ```tsx
 * const SearchFilter = ({
 *   onClose,
 *   onFilterChange,
 *   currentColumnData,
 *   currentFilterValue,
 * }: FilterElementProps<string>) => {
 *   const [value, setValue] = useState(currentFilterValue ?? '');
 *
 *   return (
 *     <div>
 *       <input
 *         value={value}
 *         onChange={(e) => setValue(e.target.value)}
 *       />
 *       <button onClick={() => { onFilterChange(currentColumnData.key, value); onClose(); }}>
 *         Apply
 *       </button>
 *       <button onClick={() => { onFilterChange(currentColumnData.key, null); onClose(); }}>
 *         Reset
 *       </button>
 *     </div>
 *   );
 * };
 * ```
 *
 * @example Multi-select checkbox filter
 * ```tsx
 * const CheckboxFilter = ({
 *   onClose,
 *   onFilterChange,
 *   currentColumnData,
 *   currentFilterValue,
 *   rowValues,
 * }: FilterElementProps<string[]>) => {
 *   const uniqueOptions = [...new Set(rowValues)] as string[];
 *   const [checked, setChecked] = useState(currentFilterValue ?? uniqueOptions);
 *
 *   return (
 *     <div>
 *       {uniqueOptions.map((option) => (
 *         <label key={option}>
 *           <input
 *             type="checkbox"
 *             checked={checked.includes(option)}
 *             onChange={() =>
 *               setChecked((prev) =>
 *                 prev.includes(option)
 *                   ? prev.filter((v) => v !== option)
 *                   : [...prev, option]
 *               )
 *             }
 *           />
 *           {option}
 *         </label>
 *       ))}
 *       <button onClick={() => { onFilterChange(currentColumnData.key, checked); onClose(); }}>
 *         Apply
 *       </button>
 *     </div>
 *   );
 * };
 * ```
 */
export interface FilterElementProps<TFilterValue = unknown> {
  /**
   * Closes the filter dropdown.
   *
   * Always call this after applying or resetting the filter
   * to dismiss the dropdown.
   *
   * @example
   * ```tsx
   * <button onClick={onClose}>Cancel</button>
   * ```
   */
  onClose: () => void;

  /**
   * The configuration object of the column this filter belongs to.
   *
   * Useful for accessing the column `key` when calling `onFilterChange`.
   *
   * @example
   * ```tsx
   * onFilterChange(currentColumnData.key, value);
   * ```
   */
  currentColumnData: TypeKey;

  /**
   * Callback to apply or reset the filter value for this column.
   *
   * Pass `null` to clear/reset the filter.
   *
   * @param columnKey - The key of the column being filtered (use `currentColumnData.key`)
   * @param filterValue - The new filter value, or `null` to reset
   *
   * @example Apply a filter
   * ```tsx
   * onFilterChange(currentColumnData.key, 'John');
   * ```
   *
   * @example Reset a filter
   * ```tsx
   * onFilterChange(currentColumnData.key, null);
   * ```
   */
  onFilterChange: (columnKey: string, filterValue: TFilterValue | null) => void;

  /**
   * The currently active filter value for this column, if any.
   *
   * Use this to initialize your filter component's state so it
   * reflects the current active filter when reopened.
   *
   * @example
   * ```tsx
   * const [value, setValue] = useState(currentFilterValue ?? '');
   * ```
   */
  currentFilterValue?: TFilterValue;

  /**
   * All unique values from this column across every row in the table.
   *
   * Useful for dynamically building filter options (e.g. checkboxes, dropdowns)
   * based on the actual data instead of hardcoding values.
   *
   * @example Dynamically build checkbox options
   * ```tsx
   * const options = [...new Set(rowValues)] as string[];
   *
   * return (
   *   <div>
   *     {options.map((option) => (
   *       <label key={option}>
   *         <input type="checkbox" value={option} />
   *         {option}
   *       </label>
   *     ))}
   *   </div>
   * );
   * ```
   */
  rowValues?: unknown[];
}

/**
 * Configuration for adding a filter to a table column.
 *
 * Attach this to a column definition to enable filtering for that column.
 * You provide the filter UI component, the filter logic, and optionally
 * the dropdown position and default value.
 *
 * @template TData - The type of each row in the table.
 * @template TFilterValue - The type of value the filter produces.
 *
 * @example String search filter
 * ```tsx
 * const columns = [
 *   {
 *     key: 'name',
 *     title: 'Name',
 *     filter: {
 *       component: SearchFilter,
 *       filterFn: (rowValue, filterValue) =>
 *         String(rowValue).toLowerCase().includes(String(filterValue).toLowerCase()),
 *       position: 'right',
 *       defaultValue: '',
 *     },
 *   },
 * ];
 * ```
 *
 * @example Multi-select filter
 * ```tsx
 * const columns = [
 *   {
 *     key: 'status',
 *     title: 'Status',
 *     filter: {
 *       component: CheckboxFilter,
 *       filterFn: (rowValue, filterValue: string[]) =>
 *         filterValue.length === 0 || filterValue.includes(String(rowValue)),
 *       position: 'left',
 *       defaultValue: [],
 *     },
 *   },
 * ];
 * ```
 *
 * @example Number range filter with extra props
 * ```tsx
 * const columns = [
 *   {
 *     key: 'age',
 *     title: 'Age',
 *     filter: {
 *       component: RangeFilter,
 *       filterFn: (rowValue, filterValue: { min: number; max: number }) =>
 *         Number(rowValue) >= filterValue.min && Number(rowValue) <= filterValue.max,
 *       defaultValue: { min: 0, max: 100 },
 *       componentProps: {
 *         step: 1,
 *         unit: 'years',
 *       },
 *     },
 *   },
 * ];
 * ```
 */
export interface FilterConfig<TData = unknown, TFilterValue = any> {
  /**
   * The React component to render inside the filter dropdown.
   *
   * Must accept {@link FilterElementProps} — the table will automatically
   * pass `onClose`, `onFilterChange`, `currentColumnData`, `currentFilterValue`,
   * and `rowValues` to it.
   *
   * @example
   * ```tsx
   * component: SearchFilter
   * component: CheckboxFilter
   * component: DateRangeFilter
   * ```
   */
  component: React.ComponentType<FilterElementProps<TFilterValue>>;

  /**
   * The function that determines whether a row should be visible
   * based on the current filter value.
   *
   * Return `true` to keep the row, `false` to hide it.
   *
   * @param rowValue - The value of this column's cell for the current row
   * @param filterValue - The current value from the filter component
   * @param row - The full row object (useful for cross-column filtering)
   * @returns `true` if the row should be shown, `false` if it should be hidden
   *
   * @example String match
   * ```ts
   * filterFn: (rowValue, filterValue) =>
   *   String(rowValue).toLowerCase().includes(String(filterValue).toLowerCase())
   * ```
   *
   * @example Multi-select
   * ```ts
   * filterFn: (rowValue, filterValue: string[]) =>
   *   filterValue.length === 0 || filterValue.includes(String(rowValue))
   * ```
   *
   * @example Number range
   * ```ts
   * filterFn: (rowValue, filterValue: { min: number; max: number }) =>
   *   Number(rowValue) >= filterValue.min && Number(rowValue) <= filterValue.max
   * ```
   *
   * @example Cross-column filtering
   * ```ts
   * filterFn: (rowValue, filterValue, row) =>
   *   row.firstName.includes(filterValue) || row.lastName.includes(filterValue)
   * ```
   */
  filterFn: (rowValue: any, filterValue: TFilterValue, row: TData) => boolean;

  /**
   * Position of the filter dropdown relative to the filter icon.
   *
   * @default 'right'
   *
   * @example
   * ```ts
   * position: 'left'   // dropdown opens to the left
   * position: 'center' // dropdown opens centered
   * position: 'right'  // dropdown opens to the right (default)
   * ```
   */
  position?: 'left' | 'right' | 'center';

  /**
   * The initial filter value when the filter is first applied.
   *
   * This value is used to pre-populate the filter component
   * before the user has interacted with it.
   *
   * @example
   * ```ts
   * defaultValue: ''             // string filter
   * defaultValue: []             // multi-select filter
   * defaultValue: { min: 0, max: 100 } // range filter
   * ```
   */
  defaultValue?: TFilterValue;

  /**
   * Additional props to pass to the filter component beyond the base {@link FilterElementProps}.
   *
   * Use this to pass static configuration options that are specific to
   * your filter component (e.g. `placeholder`, `step`, `unit`).
   *
   * These props are type-safe — TypeScript will only allow props that
   * exist on your component but are not already part of {@link FilterElementProps}.
   *
   * @example
   * ```ts
   * componentProps: {
   *   placeholder: 'Search by name...',
   * }
   * ```
   *
   * @example
   * ```ts
   * componentProps: {
   *   step: 1,
   *   unit: 'years',
   * }
   * ```
   */
  componentProps?: Omit<
    React.ComponentPropsWithoutRef<
      React.ComponentType<FilterElementProps<TFilterValue>>
    >,
    keyof FilterElementProps<TFilterValue>
  >;
}
