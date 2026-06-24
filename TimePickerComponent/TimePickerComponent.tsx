import React, { useState, useRef, useEffect, useImperativeHandle } from 'react';
import { TimeDropdown } from './TimeDropdown';
import TimeClockIcon from './TimeClockIcon';
import { InfoWithBorderIcon } from '../Icons/General/InfoWithBorderIcon';
import { autoCompleteAMPM, timeRegex12, timeRegex24 } from './timeUtils';

export type TimePickerProps = {
  /**
   * Controlled time value. When provided the component is in controlled mode
   * and `onChange` must be used to keep the value in sync.
   * Expected format: `'HH:MM AM/PM'` (12-hour) or `'HH:MM'` (24-hour).
   */
  value?: string;
  /**
   * Callback fired whenever the selected time changes.
   * Receives the new time string in the active format.
   */
  onChange?: (value: string) => void;
  /**
   * Label rendered above the time input field.
   */
  label?: string;
  /**
   * When `true`, renders an info icon next to the label.
   * Requires `infoTooltip` to be set.
   * @default false
   */
  showInfoIcon?: boolean;
  /**
   * Tooltip text shown on hover of the info icon.
   * Only visible when `showInfoIcon` is `true`.
   */
  infoTooltip?: string;
  /**
   * Placeholder text shown when no time is selected.
   * @default 'Select time'
   */
  placeholder?: string;
  /**
   * When `true`, the input and clock button are non-interactive.
   * @default false
   */
  disabled?: boolean;
  /**
   * When `true`, the input renders with an error border and focus ring.
   * @default false
   */
  error?: boolean;
  /**
   * Error message displayed below the input when `error` is `true`.
   * @default ''
   */
  errorText?: string;
  /**
   * Additional CSS class applied to the outermost wrapper `div`.
   * @default ''
   */
  wrapperClassName?: string;
  /**
   * Additional CSS class forwarded to the `TimeDropdown` popup.
   * @default ''
   */
  dropdownClassName?: string;
  /**
   * When `true`, the component operates in 24-hour (`HH:MM`) format.
   * When `false`, 12-hour (`HH:MM AM/PM`) format is used.
   * @default false
   */
  is24Hour?: boolean;
  /**
   * Interval between consecutive time options shown in the dropdown, in minutes.
   * For example, `30` produces options at 12:00, 12:30, 1:00, …
   * @default 1
   */
  timePickerOptionsGapInMinutes?: number;
  /**
   * Initial time value used in **uncontrolled** mode (when `value` is not provided).
   *
   * The string is validated against the active format:
   * - 12-hour: `'HH:MM AM'` / `'HH:MM PM'` (e.g. `'09:30 AM'`)
   * - 24-hour: `'HH:MM'` (e.g. `'14:45'`)
   *
   * If the string does not match the expected format it is silently ignored
   * and the picker starts empty.
   *
   * This value is also restored when the user clicks **Clear** in the
   * dropdown — resetting any unsaved selection back to the default.
   *
   * Has no effect when `value` is provided (controlled mode).
   *
   * @default ''
   */
  defaultValue?: string;

  /**
   * When `true`, clicking **Clear** in the dropdown resets the picker to an
   * empty value (`''`) instead of restoring `defaultValue`.
   *
   * - `false` (default) — Clear restores `defaultValue` (or empty if none was set).
   * - `true` — Clear always empties the picker regardless of `defaultValue`.
   *
   * @default false
   */
  shouldEmptyValueOnClear?: boolean;
};

/**
 * `TimePickerComponent` is an accessible time input that supports both
 * **12-hour** (`HH:MM AM/PM`) and **24-hour** (`HH:MM`) formats.
 *
 * Users can either type a time directly into the input field or pick one from
 * the scrollable dropdown. The dropdown shows options at a configurable
 * interval (`timePickerOptionsGapInMinutes`).
 *
 * The component can be used in two modes:
 * - **Controlled** — pass `value` and `onChange` to manage state externally.
 * - **Uncontrolled** — omit `value`; optionally seed the initial time via
 *   `defaultValue`. The Cancel button in the dropdown resets the picker back
 *   to `defaultValue`.
 *
 * @example
 * // Controlled 12-hour picker
 * const [time, setTime] = useState('');
 * <TimePickerComponent
 *   label="Start time"
 *   value={time}
 *   onChange={setTime}
 *   placeholder="Select time"
 * />
 *
 * @example
 * // Uncontrolled 24-hour picker with a default value
 * <TimePickerComponent
 *   is24Hour
 *   defaultValue="09:00"
 *   label="Departure time"
 *   onChange={(val) => console.log(val)}
 * />
 *
 * @example
 * // Picker with error state
 * <TimePickerComponent
 *   label="Meeting time"
 *   value={time}
 *   onChange={setTime}
 *   error={!!validationError}
 *   errorText={validationError}
 * />
 */
export const TimePickerComponent = React.forwardRef<
  HTMLDivElement,
  TimePickerProps
>(
  (
    {
      value,
      onChange,
      label,
      showInfoIcon,
      infoTooltip,
      placeholder = 'Select time',
      disabled = false,
      error = false,
      errorText = '',
      wrapperClassName = '',
      dropdownClassName = '',
      is24Hour = false,
      timePickerOptionsGapInMinutes = 1,
      defaultValue = '',
      shouldEmptyValueOnClear = false,
    },
    ref,
  ) => {
    const defaultValue24HourAfterValidate = timeRegex24.test(
      defaultValue.trim(),
    )
      ? defaultValue
      : '';
    const defaultValue12HourAfterValidate = timeRegex12.test(
      defaultValue.trim(),
    )
      ? defaultValue
      : '';
    const defaultValueAfterValidate = is24Hour
      ? defaultValue24HourAfterValidate
      : defaultValue12HourAfterValidate;

    const [internalTime, setInternalTime] = useState(
      value || defaultValueAfterValidate,
    );
    const [isOpen, setIsOpen] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    const isControlled = value !== undefined;
    const displayTime = isControlled ? value : internalTime;

    useEffect(() => {
      if (isControlled && value !== internalTime) {
        setInternalTime(value);
      }
    }, [value, isControlled, internalTime]);

    const getIconClassName = () => {
      if (disabled) {
        return displayTime ? 'fill-icon-pressed' : 'fill-icon-disabled';
      }
      return 'fill-icon-icon';
    };

    const handleChange = (newTime: string) => {
      if (!isControlled) {
        setInternalTime(newTime);
        return;
      }

      if (value !== newTime) onChange?.(newTime);
    };

    const handleCancel = () => {
      setInternalTime(
        shouldEmptyValueOnClear ? '' : defaultValueAfterValidate || '',
      );
      onChange?.(
        shouldEmptyValueOnClear ? '' : defaultValueAfterValidate || '',
      );

      setIsOpen(false);
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const changeHandler24Hours = (inputValue: string) => {
      // Validate 24-hour format typing: HH:mm
      if (inputValue.length === 1) {
        if (!/^\d$/.test(inputValue) || Number(inputValue) > 2) return;
      }

      if (inputValue.length === 2) {
        if (!/^\d{2}$/.test(inputValue) || Number(inputValue) > 23) return;
      }

      if (inputValue.length === 3) {
        if (inputValue[2] !== ':') return;
      }

      if (inputValue.length === 4) {
        if (!/^\d$/.test(inputValue[3] || '') || Number(inputValue[3]) > 5)
          return;
      }

      if (inputValue.length === 5) {
        if (!/^\d$/.test(inputValue[4] || '')) return;
      }

      if (inputValue.length > 5) return;

      const processedValue = inputValue;
      if (!isControlled) setInternalTime(processedValue);

      if (timeRegex24.test(processedValue.trim())) {
        onChange?.(processedValue.trim());
      } else if (processedValue === '') {
        onChange?.('');
      }

      if (value !== undefined) {
        if (timeRegex24.test(processedValue.trim())) return;
        onChange?.(inputValue);
      }
    };

    const changeHandler12Hours = (inputValue: string) => {
      if (
        inputValue.length === 1 &&
        (!/^\d+$/.test(inputValue) ||
          (/^\d+$/.test(inputValue) && Number(inputValue) >= 2))
      ) {
        return;
      }

      const firstTwoChars = inputValue.slice(0, 2);
      if (
        firstTwoChars.length === 2 &&
        /^\d{2}$/.test(firstTwoChars) &&
        Number(firstTwoChars) > 12
      ) {
        return;
      }

      if (inputValue.length === 3 && inputValue[2] !== ':') {
        return;
      }

      if (
        inputValue.length === 4 &&
        (!/^\d+$/.test(inputValue[3] || '') ||
          (/^\d+$/.test(inputValue[3] || '') && Number(inputValue[3]) >= 6))
      ) {
        return;
      }

      if (
        inputValue.length === 5 &&
        (!/^\d+$/.test(inputValue[4] || '') ||
          (/^\d+$/.test(inputValue[4] || '') && Number(inputValue[4]) > 9))
      ) {
        return;
      }

      if (inputValue.length > 8) {
        return;
      }

      const processedValue = autoCompleteAMPM(
        inputValue.length === 5 ? `${inputValue} A` : inputValue,
      );

      if (!isControlled) {
        setInternalTime(processedValue);
      }

      if (timeRegex12.test(processedValue.trim())) {
        const formattedTime = processedValue.trim().replaceAll(/\s+/g, ' ');
        onChange?.(formattedTime);
      } else if (processedValue === '') {
        onChange?.('');
      }

      if (value !== undefined) {
        if (timeRegex12.test(processedValue.trim())) {
          return;
        }

        onChange?.(inputValue);
      }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;

      if (isOpen) {
        setIsOpen(false);
      }

      if (is24Hour) {
        changeHandler24Hours(inputValue);
        return;
      }

      // 12-hour behavior (existing)
      changeHandler12Hours(inputValue);
    };

    useEffect(() => {
      document.addEventListener('mousedown', handleClickOutside);

      return () =>
        document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useImperativeHandle(ref, () => wrapperRef.current as HTMLDivElement);

    const handleTimeDropdownOkClick = () => setIsOpen(false);

    const btnClickHandler = () => {
      if (disabled) return;

      setIsOpen(true);
    };

    return (
      <div ref={wrapperRef} className={`relative ${wrapperClassName}`}>
        {label && (
          <div className="mb-2 flex items-center">
            <p className="label-medium text-text-dark font-medium">{label}</p>
            {showInfoIcon && infoTooltip && (
              <span className="ml-1" title={infoTooltip}>
                <InfoWithBorderIcon width={16} height={16} />
              </span>
            )}
          </div>
        )}

        <button
          type="button"
          onClick={btnClickHandler}
          className={`border-border-border bg-fill-fill flex w-full items-center justify-between gap-2 rounded-lg border px-4 py-3 shadow-[0px_1px_2px_0px_rgba(27,32,41,0.05)]
            ${disabled ? '!bg-fill-disabled !border-border-disabled cursor-not-allowed' : 'cursor-pointer'}
            ${error ? 'border-border-error-light !shadow-border-error-focus-ring !shadow-[0px_0px_0px_4px]' : ''}
            ${isFocused || isOpen ? '!border-border-action-focused !shadow-border-brand-focus-ring !shadow-[0px_0px_0px_4px]' : ''}
          `}
        >
          <input
            type="text"
            value={displayTime}
            onChange={handleInputChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            disabled={disabled}
            className={`label-large w-full bg-transparent outline-none ${
              disabled
                ? 'text-text-disabled'
                : 'text-text-text placeholder:text-text-light'
            } ${disabled && displayTime ? 'text-text-light' : ''}`}
          />

          <div>
            <TimeClockIcon className={getIconClassName()} />
          </div>
        </button>

        {error && errorText && (
          <span className="label-small text-icon-error-pressed-dark mt-1">
            {errorText}
          </span>
        )}

        {isOpen && !disabled && (
          <TimeDropdown
            selectedValue={displayTime}
            onSelect={handleChange}
            handleOk={handleTimeDropdownOkClick}
            onCancel={handleCancel}
            wrapperClassName={dropdownClassName}
            is24Hour={is24Hour}
            timePickerOptionsGapInMinutes={timePickerOptionsGapInMinutes}
          />
        )}
      </div>
    );
  },
);

TimePickerComponent.displayName = 'TimePickerComponent';
