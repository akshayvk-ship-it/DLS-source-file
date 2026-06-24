/**
 * Props for controlling the maximum selectable date range.
 *
 * @remarks
 * When `maxRangeDays` is set, the range selection will be capped and `onMaxRangeExceeded`
 * will be fired if the user attempts to select beyond the allowed range.
 *
 * @example
 * // Limit selection to 30 days and show a toast when exceeded
 * <DateRangeFilter
 *   maxRangeDays={30}
 *   onMaxRangeExceeded={(startDate, selectedEnd, maxAllowedEnd, trigger) => {
 *     toast.error(`Range capped at 30 days. Max allowed end: ${maxAllowedEnd.toDateString()}`);
 *   }}
 * />
 *
 * @example
 * // No limit enforced — user can select any range freely
 * <DateRangeFilter />
 */
export interface MaxRangeProps {
  /**
   * Maximum number of days allowed between the start and end date.
   * If not provided, no range limit is enforced.
   *
   * @defaultValue `undefined` — no range limit is enforced, the user can select any range.
   */
  maxRangeDays?: number;

  /**
   * Callback fired when the selected date range exceeds `maxRangeDays`.
   *
   * @param startDate - The currently selected start date.
   * @param selectedEnd - The end date the user attempted to select.
   * @param maxAllowedEnd - The maximum allowed end date derived from `startDate + maxRangeDays`.
   * @param trigger - Whether the limit was exceeded by changing the `'start'` or `'end'` date.
   *
   * @remarks
   * - This is not fired if `maxRangeDays` is not set.
   * - When `trigger` is `'start'`, the new start date pushed the existing end date beyond
   *   the allowed range.
   * - When `trigger` is `'end'`, the user directly selected an end date beyond the limit.
   *
   * @example
   * onMaxRangeExceeded={(startDate, selectedEnd, maxAllowedEnd, trigger) => {
   *   console.warn(
   *     `Range exceeded via ${trigger}. ` +
   *     `Attempted: ${selectedEnd.toDateString()}, ` +
   *     `Capped at: ${maxAllowedEnd.toDateString()}`
   *   );
   * }}
   */
  onMaxRangeExceeded?: (
    startDate: Date,
    selectedEnd: Date,
    maxAllowedEnd: Date,
    trigger: 'start' | 'end',
  ) => void;
}
