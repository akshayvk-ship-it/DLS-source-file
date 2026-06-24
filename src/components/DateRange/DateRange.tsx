// eslint-disable-next-line import/no-extraneous-dependencies
import dayjs from 'dayjs';
import React, { useCallback, useEffect, useState } from 'react';
import { Button } from '../Button';
import { ChevronLeftIcon, ChevronRightIcon, ResetIcon } from '../Icons';
import { Date } from './Date';
import { MaxRangeProps } from './types';

export interface DateRangeProps extends MaxRangeProps {
  type: 'Days' | 'Months' | 'Year';
  defaultMonth?: string;
  defaultYear?: number;
  internalStartDate?: Date;
  internalEndDate?: Date;
  minYear: number;
  maxYear: number;
  minDate?: Date;
  maxDate?: Date;
  btnLabel?: string;
  disableFuture: boolean;
  resetIcon?: JSX.Element;
  handleDateSet?: (startDate: Date, endDate: Date) => void;
  isSingleDateSelect?: boolean;
  wrapperClassName?: string;
  disableSameDateSelection?: boolean;
}

export const arrayOfMonths = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

function ArrowDown() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9.99998 12.4998L5.83331 8.33313H14.1666L9.99998 12.4998Z"
        fill="#F15701"
        className="fill-icon-action"
      />
    </svg>
  );
}

function ArrowLeft(checkStart: boolean) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={` ${checkStart ? 'fill-icon-disabled' : 'fill-icon-icon'} `}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.06694 4.55806C6.31102 4.80214 6.31102 5.19786 6.06694 5.44194L1.50888 10L6.06694 14.5581C6.31102 14.8021 6.31102 15.1979 6.06694 15.4419C5.82286 15.686 5.42714 15.686 5.18306 15.4419L0.183058 10.4419C-0.0610189 10.1979 -0.0610189 9.80214 0.183058 9.55806L5.18306 4.55806C5.42714 4.31398 5.82286 4.31398 6.06694 4.55806Z"
      />
    </svg>
  );
}

function ArrowRight(checkEnd: boolean) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`  ${checkEnd ? 'fill-icon-disabled' : 'fill-icon-icon'}`}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M19.8169 9.55806C20.061 9.80214 20.061 10.1979 19.8169 10.4419L14.8169 15.4419C14.5729 15.686 14.1771 15.686 13.9331 15.4419C13.689 15.1979 13.689 14.8021 13.9331 14.5581L18.4911 10L13.9331 5.44194C13.689 5.19786 13.689 4.80214 13.9331 4.55806C14.1771 4.31398 14.5729 4.31398 14.8169 4.55806L19.8169 9.55806Z"
      />
    </svg>
  );
}

export const DateRange = React.forwardRef<HTMLDivElement, DateRangeProps>(
  (
    {
      type = 'Days',
      defaultMonth = arrayOfMonths[dayjs().month()],
      defaultYear = dayjs().year(),
      minYear = 2000,
      maxYear = 2030,
      btnLabel,
      disableFuture = false,
      minDate,
      maxDate,
      resetIcon,
      handleDateSet,
      internalStartDate,
      internalEndDate,
      isSingleDateSelect = false,
      wrapperClassName = '',
      disableSameDateSelection = false,
      maxRangeDays,
      onMaxRangeExceeded,
    },
    ref,
  ) => {
    const currentYear = dayjs().year();
    const currentMonth = dayjs().month();

    const minFirstDate =
      minDate ?? dayjs().year(minYear).month(0).startOf('month');
    const minLastDate =
      maxDate ?? dayjs().year(maxYear).month(11).endOf('month');

    const [showMonths, setShowMonths] = useState(false);
    const [yearEndPoint, setYearEndPoint] = useState(
      disableFuture ? currentYear : maxYear,
    );

    const [year, setYear] = useState(defaultYear);
    const [showYear, setShowYear] = useState(false);
    const [startDate, setStartDate] = useState<dayjs.Dayjs | null>(null);
    const [endDate, setEndDate] = useState<dayjs.Dayjs | null>(null);
    const [monthIndex, setSelectedMonthIndex] = useState<number | null>(
      dayjs().month(),
    );
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const monthName = arrayOfMonths[monthIndex!];

    const getYearEndPointFor = useCallback(
      (targetYear: number) => {
        // Calculate the end of the 25-year block that includes targetYear
        const blockEnd =
          Math.ceil((targetYear - minYear + 1) / 25) * 25 + minYear - 1;

        return Math.min(blockEnd, disableFuture ? currentYear : maxYear);
      },
      [minYear, disableFuture, currentYear, maxYear],
    );

    useEffect(() => {
      setStartDate(internalStartDate ? dayjs(internalStartDate) : null);
      setEndDate(internalEndDate ? dayjs(internalEndDate) : null);

      if (!internalStartDate && !internalEndDate) {
        setYearEndPoint(getYearEndPointFor(currentYear));
        setYear(currentYear);
      } else if (internalStartDate) {
        setSelectedMonthIndex(dayjs(internalStartDate).month());
        setYear(dayjs(internalStartDate).year());
      }
    }, [internalStartDate, internalEndDate, getYearEndPointFor, currentYear]);

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
        dates.push({ current: false, date: lastDate.date(i) });
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

    const yearStartPoint = () => {
      if (yearEndPoint - 25 + 1 < minYear) {
        return minYear;
      }
      return yearEndPoint - 25 + 1;
    };

    for (let i = yearStartPoint(); i <= yearStartPoint() + 25 - 1; i += 1) {
      yearArray.push(i);
    }

    const goToSelected = (value: dayjs.Dayjs) => {
      setSelectedMonthIndex(value.month());
      setYear(value.year());
    };

    const handleReset = () => {
      setStartDate(internalStartDate ? dayjs(internalStartDate) : null);
      setEndDate(internalEndDate ? dayjs(internalEndDate) : null);
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

    const isYearDisabled = (yearItem: number) => {
      const yearDisplayed = dayjs().year(yearItem);
      return (
        yearDisplayed.isBefore(minFirstDate, 'year') ||
        yearDisplayed.isAfter(minLastDate, 'year') ||
        (disableFuture && yearDisplayed.isAfter(dayjs()))
      );
    };

    const isMonthDisabled = (yearItem: number, monIndex: number) => {
      const monthStart = dayjs()
        .year(yearItem)
        .month(monIndex)
        .startOf('month');
      const monthEnd = dayjs().year(yearItem).month(monIndex).endOf('month');

      if (
        monthEnd.isBefore(minFirstDate, 'day') ||
        monthStart.isAfter(minLastDate, 'day')
      ) {
        return true;
      }

      if (disableFuture && monthStart.isAfter(dayjs(), 'month')) {
        return true;
      }

      return false;
    };

    const startDateString = `${startDate ? ` ${arrayOfMonths[startDate.month()]} ${startDate.date()}, ${startDate.year()}` : ''}`;

    const endDateString = `${endDate ? `${arrayOfMonths[endDate.month()]} ${endDate.date()}, ${endDate.year()}` : ''}`;

    const currentMonthStart = dayjs()
      .year(year)
      .month(monthIndex!)
      .startOf('month');

    const currentMonthEnd = dayjs()
      .year(year)
      .month(monthIndex!)
      .endOf('month');

    const effectiveMinDate = minDate
      ? dayjs(minDate).startOf('month')
      : dayjs().year(minYear).month(0).startOf('month');

    const effectiveMaxDate = maxDate
      ? dayjs(maxDate).endOf('month')
      : dayjs().year(maxYear).month(11).endOf('month');

    const checkYearStart = year === effectiveMinDate.year();
    const checkMonthStart = minDate
      ? currentMonthStart.month() === effectiveMinDate.month() &&
        year === effectiveMinDate.year()
      : year === minYear && monthName === 'Jan';

    const checkMonthEnd = maxDate
      ? currentMonthEnd.month() === effectiveMaxDate.month() &&
        year === effectiveMaxDate.year()
      : disableFuture &&
        monthName === arrayOfMonths[currentMonth] &&
        year === currentYear;

    const checkYearEnd =
      (disableFuture && year === currentYear) ||
      year === effectiveMaxDate.year();

    const isActive =
      'bg-fill-action !text-text-on-fill hover:!bg-fill-action border-none';

    const isDefault = 'text-text-text hover:bg-border-brand-focus-ring';
    const isCurrent = 'border-border-action-focused border ';

    return (
      <div
        ref={ref}
        className={`bg-fill-fill flex w-[21.25rem] flex-col items-center justify-end p-4 ${wrapperClassName}`}
      >
        {!isSingleDateSelect ? (
          <div className="mb-2 flex w-full flex-col justify-between px-2">
            <div className="flex w-full justify-between">
              {startDate && (
                <button
                  type="button"
                  onClick={() => goToSelected(startDate)}
                  className="label-extra-small text-text-action underline"
                >
                  Start date
                </button>
              )}
              {endDate && (
                <button
                  type="button"
                  onClick={() => goToSelected(endDate)}
                  className="label-extra-small text-text-action underline"
                >
                  End date
                </button>
              )}
            </div>
            <div
              className={` flex w-full justify-between ${startDate ? '' : 'pt-4'}  `}
            >
              <div
                className={`paragraph-medium flex w-28  ${!startDate ? 'text-text-light' : 'text-text-text'}`}
              >
                {!startDate ? 'Start date' : startDateString}
              </div>
              <div className="text-text-light paragraph-medium flex">-</div>
              <div
                className={`paragraph-medium flex w-28 justify-end ${!endDate ? 'text-text-light' : 'text-text-text'} `}
              >
                {!endDate ? 'End date' : endDateString}
              </div>
            </div>
          </div>
        ) : null}
        {showMonths || showYear || type === 'Months' || type === 'Year' ? (
          <div
            className={`${!isSingleDateSelect ? 'border-border-border-light border-y' : ''} mb-6 flex h-[23.375rem] w-full flex-col`}
            role="button"
            onKeyDown={
              type === 'Months' || type === 'Year' ? keyDown : undefined
            }
            tabIndex={0}
            onClick={
              type === 'Months' || type === 'Year'
                ? () => handleClose()
                : undefined
            }
          >
            {showMonths || type === 'Months' ? (
              <div className="flex w-full flex-col ">
                <div className="label-large text-text-text w-full py-4 pl-2 font-medium">
                  Select a month
                </div>
                <div className="flex w-full flex-wrap ">
                  {arrayOfMonths.map((monthItem, index) => {
                    const disabled = isMonthDisabled(year, index);
                    return (
                      <button
                        key={monthItem}
                        type="button"
                        onClick={() => {
                          setSelectedMonthIndex(index);
                          setShowMonths(!showMonths);
                        }}
                        className={`label-medium mb-10  ${(index + 1) % 4 === 0 ? 'mr-0' : 'mr-[2.375rem]'} flex  h-10 w-12 items-center justify-center rounded-lg ${disabled ? 'text-text-disabled pointer-events-none' : isDefault} 
                      ${monthName === monthItem ? isActive : ''}  ${defaultMonth === monthItem ? isCurrent : ''}  `}
                      >
                        {monthItem}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center py-4">
                  <ChevronLeftIcon
                    className={` h-5 w-5 ${minYear === yearStartPoint() ? '[&>path]:fill-icon-disabled pointer-events-none' : ''}   `}
                    onClick={() => {
                      setYearEndPoint(yearEndPoint - 25);
                    }}
                  />
                  <ChevronRightIcon
                    className={` h-5 w-5 ${maxYear <= yearStartPoint() + 25 - 1 || (disableFuture && currentYear <= yearStartPoint() + 25 - 1) ? '[&>path]:fill-icon-disabled pointer-events-none' : ''} `}
                    onClick={() => {
                      setYearEndPoint(yearEndPoint + 25);
                    }}
                  />
                  <div className="label-large text-text-text font-medium">
                    {yearStartPoint()}-{yearStartPoint() + 25 - 1}
                  </div>
                </div>
                <div className="flex w-full flex-wrap">
                  {yearArray.map((yearItem, index) => (
                    <button
                      type="button"
                      key={yearItem}
                      onClick={() => {
                        if (isYearDisabled(yearItem)) return;

                        setYear(yearItem);
                        setShowYear(!showYear);
                      }}
                      className={` label-medium  ${(index + 1) % 5 === 0 ? '' : 'mr-4'}  ${index >= 20 ? '' : 'mb-4'} flex h-11 w-12 items-center justify-center rounded-lg ${year === yearItem ? isActive : isDefault} ${defaultYear === yearItem ? isCurrent : ''}
                          ${isYearDisabled(yearItem) ? '!text-text-disabled !bg-fill-fill cursor-not-allowed' : ''}
                        `}
                    >
                      {yearItem}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div
            className={`${!isSingleDateSelect ? 'border-border-border-light border-y' : ''} mb-6 flex h-[23.375rem] w-full flex-col`}
          >
            <div
              className={`flex flex-1 justify-between px-2 ${!isSingleDateSelect ? 'py-4' : 'mb-4 h-10 max-h-10'}`}
            >
              <div
                className={`flex w-28 items-center justify-between ${!isSingleDateSelect ? 'py-2' : 'h-10'}`}
              >
                <button
                  type="button"
                  className={` ${checkMonthStart ? 'pointer-events-none' : ''}`}
                  onClick={() => {
                    setSelectedMonthIndex((monthIndex! - 1 + 12) % 12);
                  }}
                >
                  {ArrowLeft(checkMonthStart)}
                </button>
                <div className="flex w-[3.75rem] items-center justify-evenly">
                  <div className="text-text-text label-medium flex w-10 pl-2 font-medium">
                    {monthName}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setShowMonths(!showMonths);
                    }}
                  >
                    <ArrowDown />
                  </button>
                </div>
                <button
                  type="button"
                  className={` ${checkMonthEnd ? 'pointer-events-none' : ''}`}
                  onClick={() => {
                    setSelectedMonthIndex((monthIndex! + 1 + 12) % 12);
                  }}
                >
                  {ArrowRight(checkMonthEnd)}
                </button>
              </div>
              <div
                className={`flex w-28 items-center justify-between  ${!isSingleDateSelect ? 'py-2' : 'h-10'}`}
              >
                <button
                  type="button"
                  className={` ${checkYearStart ? 'pointer-events-none' : ''}`}
                  onClick={() => {
                    setYear(year - 1);
                  }}
                >
                  {ArrowLeft(checkYearStart)}
                </button>

                <div className="flex w-[4.25rem] items-center justify-evenly">
                  <div className="text-text-text label-medium flex w-12 pl-2 text-left font-medium">
                    {year}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setShowYear(!showYear);
                      setYearEndPoint(getYearEndPointFor(year));
                    }}
                  >
                    <ArrowDown />
                  </button>
                </div>

                <button
                  type="button"
                  className={` ${checkYearEnd ? 'pointer-events-none' : ''}`}
                  onClick={() => {
                    setYear(year + 1);
                  }}
                >
                  {ArrowRight(checkYearEnd)}
                </button>
              </div>
            </div>

            <div>
              <div className="flex w-full  ">
                {days.map((day) => (
                  <div
                    key={day}
                    className="paragraph-extra-small text-text-light flex w-full items-center justify-center px-2 py-1 font-medium"
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
                        minFirstDate={dayjs(minFirstDate)}
                        minLastDate={dayjs(minLastDate)}
                        number={date}
                        state={current ? 'default' : 'disabled'}
                        today={today!}
                        startDate={startDate}
                        endDate={endDate}
                        setStartDate={setStartDate}
                        setEndDate={setEndDate}
                        key={date.toString()}
                        disableFuture={disableFuture}
                        isSingleDateSelect={isSingleDateSelect}
                        setSelectedMonthIndex={setSelectedMonthIndex}
                        disableSameDateSelection={disableSameDateSelection}
                        maxRangeDays={maxRangeDays}
                        onMaxRangeExceeded={onMaxRangeExceeded}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="flex w-full items-center ">
          <Button
            size="md"
            label={btnLabel ?? 'Set date'}
            hierarchy="Primary"
            type="button"
            disabled={isSingleDateSelect ? !startDate : !startDate || !endDate}
            className="mr-4 flex flex-1"
            onClick={() => {
              if (isSingleDateSelect && startDate) {
                handleDateSet?.(startDate.toDate(), startDate.toDate());
                return;
              }
              if (startDate && endDate) {
                handleDateSet?.(startDate.toDate(), endDate.toDate());
              }
            }}
          />
          <Button
            size="md"
            hierarchy="Secondary"
            type="button"
            icon={resetIcon ?? <ResetIcon className="h-5 w-5" />}
            className=" flex w-11"
            onClick={() => handleReset()}
          />
        </div>
      </div>
    );
  },
);
