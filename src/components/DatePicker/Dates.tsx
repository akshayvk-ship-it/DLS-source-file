import dayjs from 'dayjs';
import React, { useEffect } from 'react';
import { MaxRangeProps } from '../DateRange';

export interface DatePickerProps extends MaxRangeProps {
  minFirstDate: dayjs.Dayjs;
  minLastDate: dayjs.Dayjs;
  number: dayjs.Dayjs;
  state: 'default' | 'disabled';
  today: boolean;
  startDate: dayjs.Dayjs | null;
  endDate: dayjs.Dayjs | null;
  startingDate: dayjs.Dayjs | null | undefined;
  endingDate: dayjs.Dayjs | null | undefined;
  setStartDate: (date: dayjs.Dayjs) => void;
  setEndDate: (date: dayjs.Dayjs) => void;
  disableFuture: boolean;
  currentSelected: string;
  minDate?: dayjs.Dayjs;
  maxDate?: dayjs.Dayjs;
  hideTimePicker?: boolean;
  setSelectedMonthIndex: React.Dispatch<React.SetStateAction<number | null>>;
  disableSameDateSelection?: boolean;
  isCustomDropdownPicker?: boolean;
  maxRange?: number;
  selectedPreset?: string;
  clearFilter?: () => void;
  isSingleDateSelect?: boolean;
}

export const Date = React.forwardRef<HTMLDivElement, DatePickerProps>(
  (
    {
      number,
      state,
      today,
      startDate,
      endDate,
      setEndDate,
      setStartDate,
      startingDate,
      endingDate,
      disableFuture,
      currentSelected,
      hideTimePicker = false,
      setSelectedMonthIndex,
      minFirstDate,
      minLastDate,
      minDate,
      maxDate,
      disableSameDateSelection = false,
      isCustomDropdownPicker = false,
      maxRange,
      selectedPreset,
      clearFilter,
      maxRangeDays,
      onMaxRangeExceeded,
      isSingleDateSelect,
    },
    ref,
  ) => {
    const effectiveStartDate = startDate ?? startingDate ?? null;
    const effectiveEndDate = endDate ?? endingDate ?? null;

    const renderStartDate = effectiveStartDate;
    const renderEndDate = effectiveEndDate;

    const disabledClassName = `${renderStartDate?.isSame(number, 'day') || renderEndDate?.isSame(number, 'day') ? 'bg-icon-on-fill-action-pressed text-text-on-fill border-none' : 'text-text-lighter hover:bg-icon-inverse-pressed'}`;
    const activeClassName = `  ${renderStartDate?.isSame(number, 'day') || renderEndDate?.isSame(number, 'day') ? 'bg-fill-action text-text-on-fill border-none' : 'text-text-text hover:bg-border-brand-focus-ring hover:text-text-action'}`;

    const inRange = `z-10 before:absolute before:h-8 after:absolute ${hideTimePicker ? 'before:w-12 after:w-11' : 'before:w-[2.625rem] after:w-10'} after:h-8  before:-z-10 after:-z-10  `;

    const isInRange =
      number?.isAfter(renderStartDate) && number?.isBefore(renderEndDate)
        ? '  after:bg-icon-inverse-pressed before:bg-icon-inverse-pressed'
        : '';

    const isNextDayInRange =
      number?.isSame(renderStartDate?.add(1, 'day')) &&
      number?.isBefore(renderEndDate)
        ? 'before:rounded-tl-lg before:rounded-bl-lg after:rounded-tl-lg after:rounded-bl-lg'
        : '';

    const isDayBeforeEndRange =
      number?.isSame(renderEndDate?.subtract(1, 'day')) &&
      number?.isAfter(renderStartDate)
        ? 'before:rounded-tr-lg before:rounded-br-lg after:rounded-tr-lg after:rounded-br-lg'
        : '';

    const isDisabledDate =
      (minDate && number.isBefore(minDate, 'day')) ||
      (maxDate && number.isAfter(maxDate, 'day')) ||
      number?.isBefore(minFirstDate, 'year') ||
      number?.isAfter(minLastDate, 'year') ||
      (disableFuture && number?.isAfter(dayjs()));

    useEffect(() => {
      if (!maxRange) return;
      const range = Number(renderEndDate?.diff(renderStartDate, 'day'));
      if (renderStartDate && range > maxRange) {
        setEndDate(renderStartDate?.add(maxRange, 'day'));
      }
    }, [maxRange, renderEndDate, renderStartDate, setEndDate]);

    const handleDateChange = () => {
      if (isDisabledDate) return;

      if (isSingleDateSelect) {
        setStartDate(number);
        setEndDate(number);
        setSelectedMonthIndex(number.month());
        return;
      }

      if (selectedPreset && selectedPreset !== 'Custom' && clearFilter) {
        clearFilter();
        return;
      }

      if (currentSelected === 'start') {
        if (
          endDate &&
          disableSameDateSelection &&
          (number?.isSame(endDate) || number?.isAfter(renderEndDate))
        ) {
          return;
        }

        if (number?.isAfter(renderEndDate)) {
          setEndDate(number);
        }
        if (typeof maxRangeDays === 'number' && renderEndDate && number) {
          const maxAllowedEnd = number.add(maxRangeDays, 'day');

          if (renderEndDate.isAfter(maxAllowedEnd)) {
            onMaxRangeExceeded?.(
              number.toDate(),
              renderEndDate.toDate(),
              maxAllowedEnd.toDate(),
              'start',
            );
            setEndDate(maxAllowedEnd);
          }
        }

        setStartDate(number);
      } else if (currentSelected === 'end') {
        if (
          startDate &&
          disableSameDateSelection &&
          (number?.isSame(startDate) || number?.isBefore(renderStartDate))
        ) {
          return;
        }

        if (number?.isBefore(renderStartDate)) {
          setStartDate(number);
        }
        if (typeof maxRangeDays === 'number' && renderStartDate && number) {
          const maxAllowedEnd = renderStartDate.add(maxRangeDays, 'day');

          if (number.isAfter(maxAllowedEnd)) {
            setEndDate(maxAllowedEnd);

            onMaxRangeExceeded?.(
              renderStartDate.toDate(),
              number.toDate(),
              maxAllowedEnd.toDate(),
              'end',
            );
          } else {
            setEndDate(number);
          }
        } else {
          setEndDate(number);
        }
      }

      if (
        renderStartDate?.month() === number?.month() &&
        renderEndDate?.month() === number?.month()
      ) {
        return;
      }

      if (
        (startDate && number?.isAfter(startDate) && !renderEndDate) ||
        (startDate &&
          number?.isSame(startDate) &&
          !disableSameDateSelection &&
          !renderEndDate)
      ) {
        if (isCustomDropdownPicker) return;
        setEndDate(number);
      }

      setSelectedMonthIndex(number.month());
    };

    const keyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'Enter') {
        handleDateChange();
      }
    };

    return (
      <div
        ref={ref}
        className={`relative flex h-10 w-full items-center justify-center ${isSingleDateSelect ? '' : `${isInRange} ${inRange} ${isNextDayInRange} ${isDayBeforeEndRange}`}`}
      >
        <div
          role="button"
          onKeyDown={keyDown}
          tabIndex={0}
          onClick={handleDateChange}
          className={`flex h-8 w-8 items-center justify-center rounded-lg ${today ? '!text-text-action' : ''} ${today && (renderStartDate?.isSame(number, 'day') || renderEndDate?.isSame(number, 'day')) ? '!text-text-on-fill' : ''} ${state === 'disabled' ? disabledClassName : activeClassName} ${isDisabledDate ? '!text-text-disabled pointer-events-none' : ''}
            ${number?.isAfter(renderStartDate) && number?.isBefore(renderEndDate) && !number?.isSame(renderEndDate) ? '!text-fill-action' : ''}`}
        >
          <div className="paragraph-small flex items-center justify-center">
            {number?.date()}
          </div>
        </div>
      </div>
    );
  },
);
