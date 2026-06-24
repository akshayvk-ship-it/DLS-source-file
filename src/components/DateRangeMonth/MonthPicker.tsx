import dayjs from 'dayjs';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import ArrowDown from '../../icons/ArrowDown';
import { ChevronUpIcon } from '../Icons';
import { arrayOfMonths } from '../DatePicker/constant';

export interface MonthPickerProps {
  minYear: number;
  maxYear: number;
  minDate?: Date;
  maxDate?: Date;
  setStartMonth: React.Dispatch<React.SetStateAction<string>>;
  setStartYear: React.Dispatch<React.SetStateAction<number>>;
  setEndMonth: React.Dispatch<React.SetStateAction<string>>;
  setEndYear: React.Dispatch<React.SetStateAction<number>>;
  startDate: { month: string; year: number | null };
  endDate: { month: string; year: number | null };
  disableFuture: boolean;
  defaultMonth?: string;
  defaultYear?: number;
  wrapperClassName?: string;
  currentInput: 'start' | 'end';
  selectedPreset?: string;
  parsedStartDate?: dayjs.Dayjs | string;
  isCleared: boolean;
  setIsCleared: React.Dispatch<React.SetStateAction<boolean>>;
  dateSetValue?: string;
  resetDateSetValue?: () => void;
  setShowError?: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentInput: React.Dispatch<React.SetStateAction<'start' | 'end'>>;
  clearFilter: () => void;
  isSingleDateSelect?: boolean;
}

export const MonthPicker = React.forwardRef<HTMLDivElement, MonthPickerProps>(
  (
    {
      defaultMonth = arrayOfMonths[dayjs().month()]?.abbreviation,
      defaultYear = dayjs().year(),
      minYear,
      maxYear,
      minDate,
      maxDate,
      disableFuture = false,
      wrapperClassName = '',
      setStartMonth,
      setStartYear,
      setEndMonth,
      setEndYear,
      startDate,
      endDate,
      currentInput,
      selectedPreset,
      parsedStartDate,
      isCleared,
      setIsCleared,
      dateSetValue,
      resetDateSetValue = () => {},
      setShowError,
      setCurrentInput,
      clearFilter,
      isSingleDateSelect = false,
    },
    ref,
  ) => {
    const minFirstDate = dayjs().year(minYear).month(0).startOf('month');
    const minLastDate = dayjs().year(maxYear).month(11).endOf('month');

    // Use initialYear in your code
    const [year, setYear] = useState<number>(
      selectedPreset === 'Last 1 year' ? defaultYear - 1 : defaultYear,
    );

    const [showYear, setShowYear] = useState(false);
    const [selectedMonthIndex, setSelectedMonthIndex] = useState<
      number | null
    >();

    const [startIndex, setStartIndex] = useState<number>(-1);
    const [endIndex, setEndIndex] = useState<number>(-1);

    useEffect(() => {
      if (selectedPreset !== 'Custom') {
        setYear(
          selectedPreset === 'Last 1 year' ? defaultYear - 1 : defaultYear,
        );
      }
    }, [defaultYear, selectedPreset]);

    const monthName = arrayOfMonths[selectedMonthIndex!];

    const inputRef = useRef<HTMLButtonElement>(null);
    const yearInputRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (
        parsedStartDate !== 'Start month' &&
        startDate?.month &&
        startDate?.year &&
        (dateSetValue || (startIndex !== -1 && endIndex !== -1))
      ) {
        const currentStartIndex = arrayOfMonths.findIndex(
          (month) => month.fullName === startDate?.month,
        );
        const currentEndIndex = arrayOfMonths.findIndex(
          (month) => month.fullName === endDate?.month,
        );
        setStartIndex(currentStartIndex);
        setEndIndex(currentEndIndex);
        setSelectedMonthIndex(currentStartIndex);
        if (currentInput === 'start') {
          setSelectedMonthIndex(currentStartIndex);
          setYear(startDate?.year);
        }
        if (selectedPreset === 'Custom') {
          if (currentInput === 'end' && endDate?.month && endDate?.year) {
            setSelectedMonthIndex(currentEndIndex);
            if (dateSetValue) {
              setYear(endDate?.year ?? Number(startDate?.year));
            }
          }
        }
      } else if (isCleared) {
        setStartIndex(-1);
        setEndIndex(-1);
        setSelectedMonthIndex(null);
        setStartYear(defaultYear);
        setEndYear(defaultYear);
        setYear(defaultYear);
        setShowYear(false);
      }
    }, [
      startDate,
      endDate,
      selectedPreset,
      setStartIndex,
      setEndIndex,
      startIndex,
      endIndex,
      parsedStartDate,
      isCleared,
      defaultYear,
      setStartYear,
      currentInput,
      setEndYear,
      dateSetValue,
    ]);

    useEffect(() => {
      if (inputRef.current && showYear && yearInputRef.current) {
        yearInputRef.current.scrollTop = inputRef.current.offsetTop;
      }
    }, [showYear]);

    const yearArray: number[] = [];

    for (let i = minYear; i <= maxYear; i += 1) {
      yearArray.push(i);
    }

    const showYearStatus = (isShowYear: boolean) => {
      setShowYear(isShowYear);
    };

    const handleClose = () => {
      setShowYear(false);
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

    const getStartEndMonthIndexes = useCallback(() => {
      if (startIndex === -1) {
        return [];
      }
      if (selectedPreset === 'Custom') {
        if (startDate.year === endDate?.year) {
          return Array.from(
            { length: endIndex - startIndex },
            (_, i) => startIndex + 1 + i,
          );
        }
        if (
          selectedMonthIndex !== undefined &&
          selectedMonthIndex !== null &&
          selectedMonthIndex > -1
        ) {
          return (currentInput === 'end' && !endDate?.month) ||
            currentInput === 'start'
            ? Array.from(
                { length: 12 - selectedMonthIndex },
                (_, i) => selectedMonthIndex + i,
              )
            : Array.from({ length: selectedMonthIndex + 1 }, (_, i) => i);
        }
      } else {
        if (isSingleDateSelect) return [];

        const noOfMonths = Number(selectedPreset?.split(' ')[1]);

        if (startDate.year === endDate.year) {
          return selectedPreset === 'Last 1 year'
            ? Array.from({ length: 12 - startIndex }, (_, i) => startIndex + i)
            : Array.from(
                {
                  length: selectedPreset === 'Last 1 month' ? 1 : noOfMonths,
                },
                (_, i) => startIndex + i,
              );
        }

        const monthsLength =
          startIndex + noOfMonths > 11 ? 12 - startIndex : noOfMonths;

        return Array.from(
          {
            length:
              currentInput === 'start'
                ? monthsLength
                : noOfMonths - monthsLength,
          },
          (_, i) => (currentInput === 'start' ? startIndex + i : endIndex - i),
        );
      }
      return [];
    }, [
      currentInput,
      endDate,
      endIndex,
      isSingleDateSelect,
      selectedMonthIndex,
      selectedPreset,
      startDate.year,
      startIndex,
    ]);

    const isActive =
      'bg-fill-action-light border-border-action-focused border [&_span]:label-medium [&_span]:font-semibold !text-text-action-hover !rounded-lg';

    const isDefault =
      'text-text-text hover:bg-fill-action-light hover:text-fill-action';
    const isCurrent = '!text-fill-action';

    const inRangeAfterContent =
      "relative px-4 py-2 after:content-[''] after:absolute after:top-1/2 after:-translate-y-1/2 after:-right-4 after:w-4 after:h-12 after:bg-fill-action-light";

    const lastMonthIndex = getStartEndMonthIndexes().splice(-1, 1)[0];

    const isNotEndIndex = (index: number) =>
      (startDate?.year === endDate?.year && index) !== endIndex;

    const secondLastEndIndexAtEnd = (index: number) =>
      endIndex - 1 === index &&
      (startDate?.year === endDate?.year || currentInput === 'end');
    const secondLastEndIndex = (index: number) =>
      endIndex - 1 !== index ||
      (endIndex - 1 === index &&
        startDate?.year !== endDate?.year &&
        currentInput === 'start');

    useEffect(() => {
      if (currentInput === 'end' && endDate?.year) {
        setYear(endDate?.year);
      } else if (currentInput === 'start' && startDate?.year) {
        setYear(startDate?.year);
      }
    }, [currentInput, endDate?.year, startDate?.year]);

    const handleYearClick = (yearItem: number) => {
      if (isYearDisabled(yearItem)) return;
      setYear(yearItem);
      setIsCleared(false);

      if (currentInput === 'start') {
        if (isSingleDateSelect) {
          const currentMonth = dayjs(parsedStartDate).month();
          const selectedYear = dayjs(parsedStartDate).year();

          const selectedYearIndex =
            selectedYear === yearItem ? currentMonth : -1;
          const selectedMonthName =
            selectedYear === yearItem && arrayOfMonths[currentMonth]
              ? arrayOfMonths[currentMonth].fullName
              : '';

          setStartYear(yearItem);
          setEndYear(yearItem);
          setStartIndex(selectedYearIndex);
          setEndIndex(selectedYearIndex);
          setStartMonth(selectedMonthName);
          setEndMonth(selectedMonthName);
          setSelectedMonthIndex(selectedYearIndex);
          return;
        }

        if (
          parsedStartDate !== 'Start month' &&
          startDate?.month &&
          getStartEndMonthIndexes().length > 0
        ) {
          setStartIndex(-1);
          setSelectedMonthIndex(undefined);
          setStartMonth('');
        }
        setStartYear(yearItem);
        if (!endDate?.month) {
          setEndYear(yearItem);
        }
      } else {
        if (endDate?.month) {
          setEndIndex(-1);
          setSelectedMonthIndex(undefined);
          setEndMonth('');
        }
        setEndYear(yearItem);
      }
      setShowYear(false);
      resetDateSetValue();
      if (selectedPreset !== 'Custom') {
        clearFilter();
      }
    };

    const handleMonthClick = (monthFullName: string, index: number) => {
      setIsCleared(false);

      if (isMonthDisabled(index)) return;

      setSelectedMonthIndex(index);

      if (
        Number(startDate?.year) > Number(endDate?.year) &&
        !isSingleDateSelect
      ) {
        setShowError?.(true);
        return;
      }
      setShowError?.(false);
      if (currentInput === 'start') {
        if (
          Number(startDate?.year) === Number(endDate?.year) &&
          endIndex !== -1 &&
          index > endIndex &&
          !isSingleDateSelect
        ) {
          setShowError?.(true);
          return;
        }
        setShowError?.(false);
        setStartIndex(index);
        setStartMonth(monthFullName);

        if (isSingleDateSelect) {
          setEndMonth(monthFullName);
          setEndIndex(index);
        }
      } else if (currentInput === 'end' && startDate?.month) {
        if (
          Number(startDate?.year) === Number(endDate?.year) &&
          startIndex !== -1 &&
          index < startIndex
        ) {
          setShowError?.(true);
          return;
        }
        setShowError?.(false);
        setEndIndex(index);
        setEndMonth(monthFullName);
      } else {
        setCurrentInput('start');
      }
    };

    return (
      <div
        ref={ref}
        className={`bg-fill-fill m-4 flex flex-1 justify-between ${wrapperClassName} ${isSingleDateSelect ? 'min-w-[19rem]' : ''}`}
      >
        <div className="border-border-border-light flex w-full flex-col border-r px-4 pt-4">
          <div className="flex w-full justify-center gap-2">
            <div className="hover:bg-fill-action-light h-8 w-[4.75rem] rounded-lg">
              <button
                type="button"
                className="flex h-full w-full items-center justify-between p-2"
                onClick={() => {
                  showYearStatus(!showYear);
                }}
              >
                <p
                  className={`paragraph-small pr-2 ${showYear ? 'text-text-action' : 'text-text-text'} font-normal`}
                >
                  {year}
                </p>
                {showYear ? (
                  <ChevronUpIcon
                    width={24}
                    height={24}
                    className="[&>path]:fill-icon-action min-w-6"
                  />
                ) : (
                  <ArrowDown className="min-w-6" width={24} height={24} />
                )}
              </button>
            </div>
          </div>
          <div
            className="flex w-full flex-1 flex-col"
            role="button"
            onKeyDown={keyDown}
            tabIndex={0}
            onClick={handleClose}
          >
            {showYear ? (
              <div
                className="scroll-hidden relative flex max-h-[18.25rem] flex-1 flex-wrap overflow-y-auto p-2"
                ref={yearInputRef}
              >
                {yearArray.map((yearItem) => (
                  <button
                    ref={year === yearItem ? inputRef : null}
                    className={`mx-px mb-4 h-9 basis-[24%] rounded-lg ${
                      year === yearItem ? isActive : isDefault
                    } ${defaultYear === yearItem ? isCurrent : ''}
                      ${isYearDisabled(yearItem) ? '!text-text-disabled !bg-fill-fill cursor-not-allowed' : ''}
                      `}
                    type="button"
                    key={yearItem}
                    onClick={() => handleYearClick(yearItem)}
                  >
                    <span className="paragraph-small font-medium">
                      {yearItem}
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="mt-4 flex min-h-[17.25rem] flex-1 flex-wrap justify-between px-2 pt-2">
                {arrayOfMonths.map((monthItem, index) => {
                  const highlightIndexes =
                    (!endDate?.month || !startDate?.month) &&
                    selectedPreset === 'Custom'
                      ? [selectedMonthIndex]
                      : getStartEndMonthIndexes();

                  const highlightedRange =
                    highlightIndexes?.includes(index) &&
                    index !== selectedMonthIndex &&
                    isNotEndIndex(index) &&
                    !isMonthDisabled(index);

                  return (
                    <button
                      className={`h-12 basis-[30%] rounded-lg ${
                        ((currentInput === 'start' ||
                          startDate?.year === endDate?.year) &&
                          startIndex === index) ||
                        ((currentInput === 'end' ||
                          startDate?.year === endDate?.year) &&
                          endIndex === index)
                          ? isActive
                          : isDefault
                      } ${
                        defaultMonth === monthItem.abbreviation &&
                        defaultMonth !== monthName?.abbreviation &&
                        year === defaultYear
                          ? isCurrent
                          : ''
                      }
                    ${
                      highlightedRange
                        ? `bg-fill-action-light !text-text-action-pressed rounded-none 
                        ${
                          secondLastEndIndexAtEnd(index) && '!rounded-r-lg'
                        } ${startIndex + 1 === index && '!rounded-l-lg'}
                           ${
                             (index + 1) % 3 !== 0 &&
                             index !== Number(selectedMonthIndex) - 1 &&
                             index !== lastMonthIndex &&
                             secondLastEndIndex(index) &&
                             index !== endIndex &&
                             inRangeAfterContent
                           }`
                        : ''
                    }
                    ${isMonthDisabled(index) ? '!bg-fill-fill !text-text-disabled cursor-not-allowed' : ''}                
                    `}
                      type="button"
                      key={monthItem.fullName}
                      onClick={() =>
                        handleMonthClick(monthItem.fullName, index)
                      }
                    >
                      <span className="paragraph-small font-medium">
                        {monthItem.abbreviation}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  },
);
