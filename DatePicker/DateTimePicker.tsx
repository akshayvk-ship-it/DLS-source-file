import dayjs from 'dayjs';
import React, { useState, useEffect, useRef } from 'react';
import { Date } from './Dates';
import { TimePicker } from './TimePicker';
import ArrowDown from '../../icons/ArrowDown';
import { ChevronUpIcon } from '../Icons';
import { arrayOfMonths } from './constant';
import { MaxRangeProps } from '../DateRange';
import { generateCustomTimeList } from './helper';

export interface DateTimePickerProps extends MaxRangeProps {
  type: 'Days' | 'Months' | 'Year';
  currentSelected: string;
  minYear: number;
  maxYear: number;
  minDate?: dayjs.Dayjs;
  maxDate?: dayjs.Dayjs;
  startingDate?: dayjs.Dayjs | null;
  endingDate?: dayjs.Dayjs | null;
  disableFuture: boolean;
  currentSelectedTime?: string;
  defaultMonth?: string;
  defaultYear?: number;
  handleDate?: (startDate?: dayjs.Dayjs, endDate?: dayjs.Dayjs) => void;
  handleTime?: (time: string) => void;
  wrapperClassName?: string;
  timePickerClassName?: string;
  hideTimePicker?: boolean;
  disableFutureTime?: boolean;
  disableSameDateSelection?: boolean;
  isCleared?: boolean;
  selectedPreset?: string;
  maxRange?: number;
  clearFilter?: () => void;
  isTimePickerFocused?: boolean;
  disableEndDateTime?: string;
  disableStartDateTime?: string;
  /**
   * Used for the generation of time options with an interval of that gap.
   * @default undefined - in that case, the gap will be 30 in timepicker.
   * It's advised to give the gap in multiple of 60 so that at every hour they get consistent minute options.
   */
  timePickerOptionsGapInMinutes?: number;
  isSingleDateSelect?: boolean;
}

export const DateTimePicker = React.forwardRef<
  HTMLDivElement,
  DateTimePickerProps
>(
  (
    {
      type = 'Days',
      currentSelected,
      defaultMonth = arrayOfMonths[dayjs().month()],
      defaultYear = dayjs().year(),
      minYear,
      maxYear,
      minDate,
      maxDate,
      startingDate,
      endingDate,
      disableFuture = false,
      disableFutureTime = false,
      currentSelectedTime = '',
      handleDate = () => {},
      handleTime = () => {},
      wrapperClassName = '',
      timePickerClassName = '',
      hideTimePicker = false,
      disableSameDateSelection = false,
      isCleared = false,
      selectedPreset = '',
      maxRange,
      clearFilter = () => {},
      isTimePickerFocused,
      disableEndDateTime,
      disableStartDateTime,
      maxRangeDays,
      onMaxRangeExceeded,
      timePickerOptionsGapInMinutes,
      isSingleDateSelect = false,
    },
    ref,
  ) => {
    const currentYear = dayjs().year();
    const currentMonth = dayjs().month();

    const minFirstDate = dayjs().year(minYear).month(0).startOf('month');
    const minLastDate = dayjs().year(maxYear).month(11).endOf('month');

    const [showMonths, setShowMonths] = useState(false);
    const [year, setYear] = useState(() => {
      if (startingDate?.year()) return startingDate.year();
      return defaultYear;
    });

    const [showYear, setShowYear] = useState(false);
    const [startDate, setStartDate] = useState<dayjs.Dayjs | null>(null);
    const [endDate, setEndDate] = useState<dayjs.Dayjs | null>(null);
    const [monthIndex, setSelectedMonthIndex] = useState<number | null>(() => {
      if (startingDate?.month()) return startingDate.month();
      return dayjs().month();
    });

    const days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

    const monthName = arrayOfMonths[monthIndex!];

    const inputRef = useRef<HTMLButtonElement>(null);
    const yearInputRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (inputRef.current && showYear && yearInputRef.current) {
        yearInputRef.current.scrollTop = inputRef.current.offsetTop;
      }
    }, [showYear]);

    useEffect(() => {
      if (!startingDate) {
        setStartDate(null);
      }

      if (!endingDate) {
        setEndDate(null);
      }
    }, [startingDate, endingDate]);

    useEffect(() => {
      if ((selectedPreset && selectedPreset !== 'Custom') || isCleared) {
        setStartDate(null);
        setEndDate(null);
      }
    }, [isCleared, selectedPreset]);

    const generateDate = (m = currentMonth, y = currentYear) => {
      const firstDate = dayjs().year(y).month(m).startOf('month');
      const lastDate = dayjs().year(y).month(m).endOf('month');

      const dates = [];

      for (let i = 0; i < firstDate.day(); i += 1) {
        dates.push({
          current: false,
          date: firstDate.day(i),
        });
      }

      for (let i = firstDate.date(); i <= lastDate.date(); i += 1) {
        dates.push({
          current: true,
          date: firstDate.date(i),
          today:
            firstDate.date(i).toDate().toDateString() ===
            dayjs().toDate().toDateString(),
        });
      }

      const remaining = 42 - dates.length;

      for (
        let i = lastDate.date() + 1;
        i <= lastDate.date() + remaining;
        i += 1
      ) {
        dates.push({
          currentMonth: false,
          date: lastDate.date(i).startOf('day'),
        });
      }
      return dates;
    };

    const generateDateGrid = (m = currentMonth, y = currentYear) => {
      const datesArray = generateDate(m, y);
      const rows = [];
      for (let i = 0; i < datesArray.length; i += 7) {
        rows.push(datesArray.slice(i, i + 7));
      }

      return rows;
    };

    const yearArray: number[] = [];

    for (let i = minYear; i <= maxYear; i += 1) {
      yearArray.push(i);
    }

    const showMonthsStatus = (isShowMonths: boolean) => {
      if (isShowMonths === true) {
        setShowMonths(true);
        setShowYear(false);
      } else {
        setShowMonths(false);
      }
    };

    const showYearStatus = (isShowYear: boolean) => {
      if (isShowYear === true) {
        setShowYear(true);
        setShowMonths(false);
      } else {
        setShowYear(false);
      }
    };

    useEffect(() => {
      handleDate?.(startDate || undefined, endDate || undefined);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [startDate, endDate]);

    const updateStartDate = (date: dayjs.Dayjs | null) => {
      setStartDate(date);
    };

    const updateEndDate = (date: dayjs.Dayjs | null) => {
      setEndDate(date);
    };

    const handleCustomTime = (time: string) => {
      handleTime?.(time);
    };

    const handleClose = () => {
      setShowYear(false);
      setShowMonths(false);
    };

    const keyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'Enter') {
        handleClose();
      }
    };
    const isMonthDisabled = (index: number) => {
      const currentMonthInYear = dayjs().year(year).month(index);
      return (
        (minDate && currentMonthInYear.isBefore(minDate, 'month')) ||
        (maxDate && currentMonthInYear.isAfter(maxDate, 'month')) ||
        currentMonthInYear.isBefore(minFirstDate, 'year') ||
        currentMonthInYear.isAfter(minLastDate, 'year') ||
        (disableFuture && currentMonthInYear.isAfter(dayjs()))
      );
    };

    const isYearDisabled = (yearItem: number) => {
      const yearDisplayed = dayjs().year(yearItem);
      return (
        (minDate && yearDisplayed.isBefore(minDate, 'year')) ||
        (maxDate && yearDisplayed.isAfter(maxDate, 'year')) ||
        yearDisplayed.isBefore(minFirstDate, 'year') ||
        yearDisplayed.isAfter(minLastDate, 'year') ||
        (disableFuture && yearDisplayed.isAfter(dayjs()))
      );
    };

    const isActive = 'bg-fill-action text-text-on-fill border-none';
    const isDefault =
      'text-text-text hover:bg-fill-action-light hover:text-fill-action';
    const isCurrent = '!text-fill-action';

    return (
      <div
        ref={ref}
        className={`bg-fill-fill m-4 flex max-h-[21rem] ${hideTimePicker ? 'max-w-[20rem]' : 'max-w-[22.5rem]'} flex-row justify-between gap-4 ${wrapperClassName}`}
      >
        <div className="flex w-full flex-col ">
          <div className="flex w-full gap-2">
            <div
              className={`${showMonths ? 'border-border-action-focused' : 'border-border-border-light'} h-10 w-2/3 min-w-[8.75rem] rounded-lg border`}
            >
              <button
                type="button"
                className="flex h-full w-full items-center justify-between py-2.5 pl-4 pr-2"
                onClick={() => showMonthsStatus(!showMonths)}
              >
                <p className="paragraph-small text-text-text pr-[1.438rem] font-normal">
                  {monthName?.fullName}
                </p>
                {showMonths ? <ChevronUpIcon /> : <ArrowDown />}
              </button>
            </div>
            <div
              className={`${showYear ? 'border-border-action-focused' : 'border-border-border-light'} h-10 w-24 rounded-lg border`}
            >
              <button
                type="button"
                className="flex h-full w-full items-center justify-between py-2.5 pl-4 pr-2"
                onClick={() => showYearStatus(!showYear)}
              >
                <p className="paragraph-small text-text-text pr-2 font-normal">
                  {year}
                </p>
                {showYear ? <ChevronUpIcon /> : <ArrowDown />}
              </button>
            </div>
          </div>
          {showMonths || showYear || type === 'Months' || type === 'Year' ? (
            <div
              className="flex w-full flex-1 flex-col"
              role="button"
              onKeyDown={
                type === 'Months' || type === 'Year' ? keyDown : undefined
              }
              tabIndex={0}
              onClick={
                type === 'Months' || type === 'Year' ? handleClose : undefined
              }
            >
              {showMonths || type === 'Months' ? (
                <div className="mt-4 flex min-h-[17.25rem] flex-1 flex-wrap justify-between p-2">
                  {arrayOfMonths.map((monthItem, index) => (
                    <button
                      className={`h-12 basis-[30%] rounded-lg ${
                        monthName?.abbreviation === monthItem.abbreviation
                          ? isActive
                          : isDefault
                      } ${
                        defaultMonth === monthItem.abbreviation &&
                        defaultMonth !== monthName?.abbreviation
                          ? isCurrent
                          : ''
                      }
                      ${isMonthDisabled(index) ? '!bg-fill-fill !text-text-disabled cursor-not-allowed' : ''}
                      `}
                      type="button"
                      key={monthItem.abbreviation}
                      onClick={() => {
                        if (isMonthDisabled(index)) return;
                        setSelectedMonthIndex(index);
                        showMonthsStatus(!showMonths);
                      }}
                    >
                      <span className="paragraph-small font-medium">
                        {monthItem.abbreviation}
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <div
                  className="scroll-hidden relative flex max-h-[18.25rem] flex-1 flex-wrap overflow-y-auto p-2"
                  ref={yearInputRef}
                >
                  {yearArray.map((yearItem) => (
                    <button
                      ref={year === yearItem ? inputRef : null}
                      className={`mx-px mb-4 h-9 basis-[24%] rounded-lg ${
                        year === yearItem ? isActive : isDefault
                      } ${
                        defaultYear === yearItem && defaultYear !== year
                          ? isCurrent
                          : ''
                      }
                      ${isYearDisabled(yearItem) ? '!text-text-disabled !bg-fill-fill cursor-not-allowed' : ''}
                      `}
                      type="button"
                      key={yearItem}
                      onClick={() => {
                        if (isYearDisabled(yearItem)) return;
                        setYear(yearItem);
                        showYearStatus(!showYear);
                      }}
                    >
                      <span className="paragraph-small font-medium">
                        {yearItem}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="flex w-full flex-col">
              <div className="mt-2 flex w-full">
                {days.map((day) => (
                  <div
                    key={day}
                    className="paragraph-small text-text-light flex w-full items-center justify-center px-2 py-1 font-normal"
                  >
                    {day}
                  </div>
                ))}
              </div>
              <div className="my-2">
                {generateDateGrid(monthIndex!, year).map((week, rowIndex) => (
                  <div
                    key={week[rowIndex]?.date.toString()}
                    className="flex items-center justify-center"
                  >
                    {week.map(({ date, current, today }) => (
                      <Date
                        number={date}
                        state={current ? 'default' : 'disabled'}
                        today={today!}
                        startDate={isCleared ? null : startDate}
                        endDate={isCleared ? null : endDate}
                        minDate={minDate}
                        maxDate={maxDate}
                        startingDate={startingDate}
                        endingDate={endingDate}
                        setStartDate={updateStartDate}
                        setEndDate={updateEndDate}
                        key={date.toString()}
                        disableFuture={disableFuture}
                        currentSelected={currentSelected}
                        setSelectedMonthIndex={setSelectedMonthIndex}
                        minFirstDate={minFirstDate}
                        minLastDate={minLastDate}
                        hideTimePicker={hideTimePicker}
                        disableSameDateSelection={disableSameDateSelection}
                        isCustomDropdownPicker={selectedPreset === 'Custom'}
                        maxRange={maxRange}
                        selectedPreset={selectedPreset}
                        clearFilter={clearFilter}
                        maxRangeDays={maxRangeDays}
                        onMaxRangeExceeded={onMaxRangeExceeded}
                        isSingleDateSelect={isSingleDateSelect}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        {!hideTimePicker && (
          <TimePicker
            onTimeChange={handleCustomTime}
            currentSelectedTime={currentSelectedTime}
            wrapperClassName={timePickerClassName}
            disableFutureTime={disableFutureTime}
            timeBtnClassName="w-full"
            isFocused={isTimePickerFocused}
            disableEndDateTime={disableEndDateTime}
            disableStartDateTime={disableStartDateTime}
            timeOptions={
              timePickerOptionsGapInMinutes
                ? generateCustomTimeList(timePickerOptionsGapInMinutes)
                : undefined
            }
          />
        )}
      </div>
    );
  },
);
