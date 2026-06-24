// eslint-disable-next-line import/no-extraneous-dependencies
import dayjs from 'dayjs';
import React from 'react';
import { MaxRangeProps } from './types';

export interface DateProps extends MaxRangeProps {
  minFirstDate: dayjs.Dayjs;
  minLastDate: dayjs.Dayjs;
  number: dayjs.Dayjs | null;
  state: 'default' | 'disabled';
  today: boolean;
  startDate: dayjs.Dayjs | null;
  endDate: dayjs.Dayjs | null;
  setStartDate: React.Dispatch<React.SetStateAction<dayjs.Dayjs | null>>;
  setEndDate: React.Dispatch<React.SetStateAction<dayjs.Dayjs | null>>;
  disableFuture: boolean;
  isSingleDateSelect?: boolean;
  setSelectedMonthIndex: React.Dispatch<React.SetStateAction<number | null>>;
  disableSameDateSelection?: boolean;
}

export const Date = React.forwardRef<HTMLDivElement, DateProps>(
  (
    {
      minFirstDate,
      minLastDate,
      number,
      today,
      state,
      startDate,
      endDate,
      setEndDate,
      setStartDate,
      disableFuture,
      isSingleDateSelect = false,
      setSelectedMonthIndex,
      disableSameDateSelection = false,
      maxRangeDays,
      onMaxRangeExceeded,
    },
    ref,
  ) => {
    const disabledClassName = `${startDate?.isSame(number, 'day') || endDate?.isSame(number, 'day') ? 'bg-icon-on-fill-action-pressed text-text-on-fill border-none' : 'text-text-disabled hover:bg-icon-inverse-pressed'}`;
    const activeClassName = `  ${startDate?.isSame(number, 'day') || endDate?.isSame(number, 'day') ? 'bg-fill-action text-text-on-fill border-none' : 'text-text-text hover:bg-border-brand-focus-ring'}`;

    const inRange =
      'z-10 before:absolute before:w-8 before:h-8 before:left-0 after:absolute after:w-8 after:h-8 after:right-0 before:-z-10 after:-z-10 before:top-[6px] ';

    const isInRange =
      number?.isAfter(startDate) && number?.isBefore(endDate)
        ? ' before:bg-icon-inverse-pressed after:bg-icon-inverse-pressed'
        : '';
    const isRangeBegin =
      number?.isSame(startDate) && number?.isBefore(endDate)
        ? 'after:bg-icon-inverse-pressed'
        : '';
    const isRangeEnd =
      number?.isSame(endDate) && number?.isAfter(startDate)
        ? 'before:bg-icon-inverse-pressed'
        : '';

    const handleDateChange = () => {
      if (
        number?.isBefore(minFirstDate, 'year') ||
        (disableFuture && number?.isAfter(dayjs())) ||
        number?.isAfter(minLastDate, 'year')
      )
        return;

      if (isSingleDateSelect) {
        setStartDate(number);
        setEndDate(number);
        setSelectedMonthIndex(number!.month());
        return;
      }

      if (!startDate || number?.isBefore(startDate)) {
        setStartDate(number);

        if (typeof maxRangeDays === 'number' && endDate && number) {
          const maxAllowedEnd = number.add(maxRangeDays, 'day');

          if (endDate.isAfter(maxAllowedEnd)) {
            onMaxRangeExceeded?.(
              number.toDate(),
              endDate.toDate(),
              maxAllowedEnd.toDate(),
              'start',
            );

            setEndDate(maxAllowedEnd);
          }
        }
      } else if (disableSameDateSelection && number?.isSame(startDate)) {
        return;
      } else if (typeof maxRangeDays === 'number' && startDate && number) {
        const maxAllowedEnd = startDate.add(maxRangeDays, 'day');

        if (number.isAfter(maxAllowedEnd)) {
          setEndDate(maxAllowedEnd);
          onMaxRangeExceeded?.(
            startDate.toDate(),
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

      if (
        startDate?.month() === number?.month() &&
        endDate?.month() === number?.month()
      ) {
        return;
      }
      setSelectedMonthIndex(number!.month());
    };

    const keyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'Enter') {
        handleDateChange();
      }
    };

    const isDisabled =
      number?.isBefore(minFirstDate, 'day') ||
      number?.isAfter(minLastDate, 'day') ||
      (disableFuture && number?.isAfter(dayjs(), 'day'));

    return (
      <div
        ref={ref}
        className={`relative flex h-11  w-full items-center justify-center p-1 ${isSingleDateSelect ? '' : `${isInRange} ${isRangeBegin} ${isRangeEnd} ${inRange}`}`}
      >
        <div
          role="button"
          onKeyDown={keyDown}
          tabIndex={0}
          onClick={handleDateChange}
          className={`flex h-full w-full items-center justify-center rounded-lg ${today ? 'border-border-action-focused border ' : ''}   ${state === 'disabled' ? disabledClassName : activeClassName} label-large  font-medium  ${isDisabled ? '!text-text-disabled pointer-events-none' : ''} `}
        >
          <div className={`flex items-center justify-center  `}>
            {number?.date()}
          </div>
        </div>
      </div>
    );
  },
);
