import dayjs from 'dayjs';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import ArrowDown from '../../icons/ArrowDown';
import { ChevronUpIcon } from '../Icons';
import { arrayOfMonths } from '../DatePicker/constant';
import { MonthPickerProps } from './MonthPicker';

export interface DoublePanelMonthPickerProps extends MonthPickerProps {
  id: number;
  startIndex: number;
  setStartIndex: React.Dispatch<React.SetStateAction<number>>;
  baseYear: number;
  setBaseYear: React.Dispatch<React.SetStateAction<number>>;
  showError: boolean;
}

export const DoublePanelMonthPicker = React.forwardRef<
  HTMLDivElement,
  DoublePanelMonthPickerProps
>(
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
      // resetDateSetValue = () => {},
      setShowError,
      showError,
      setCurrentInput,
      clearFilter,
      id,
      startIndex,
      setStartIndex,
      baseYear,
      setBaseYear,
    },
    ref,
  ) => {
    const minFirstDate = dayjs().year(minYear).month(0).startOf('month');
    const minLastDate = dayjs().year(maxYear).month(11).endOf('month');

    const [year, setYear] = useState<number>(baseYear);

    const [showYear, setShowYear] = useState(false);
    const [selectedMonthIndex, setSelectedMonthIndex] = useState<
      number | null
    >();
    const [selectedStartMonthIndex, setSelectedStartMonthIndex] = useState<
      number | null
    >();

    const [endIndex, setEndIndex] = useState<number>(-1);

    const monthName = arrayOfMonths[selectedMonthIndex!];

    const inputRef = useRef<HTMLButtonElement>(null);
    const yearInputRef = useRef<HTMLDivElement>(null);

    const panelYear =
      dateSetValue ||
      (startDate?.month &&
        endDate?.month &&
        Number(startDate?.year) !== Number(endDate?.year))
        ? year
        : baseYear;

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
        if (currentStartIndex !== -1) {
          setStartIndex(currentStartIndex);
          setSelectedMonthIndex(currentStartIndex);
          setSelectedStartMonthIndex(currentStartIndex);
        }
        if (currentEndIndex !== -1) setEndIndex(currentEndIndex);

        if (Number(startDate?.year) === Number(endDate?.year)) {
          setYear(
            id === 0 ? Number(startDate?.year) : Number(startDate?.year) + 1,
          );
          if (dateSetValue && id === 1) {
            setSelectedMonthIndex(null);
            setSelectedStartMonthIndex(null);
            setEndIndex(-1);
          }
        } else {
          if (dateSetValue || (startDate?.month && endDate?.month)) {
            setYear(id === 0 ? Number(startDate?.year) : Number(endDate?.year));
          }
          if (id === 0) setEndIndex(-1);
          if (id === 1) setSelectedStartMonthIndex(null);
        }

        if (selectedPreset === 'Custom') {
          if (currentInput === 'end' && endDate?.month && endDate?.year) {
            setSelectedMonthIndex(endIndex);
          }
        }
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
      defaultYear,
      setStartYear,
      currentInput,
      setEndYear,
      dateSetValue,
      id,
      baseYear,
    ]);

    useEffect(() => {
      if (startDate?.month) {
        if (showError) setEndIndex(-1);

        if (endDate?.month) {
          if (id === 0 && Number(startDate?.year) !== Number(endDate?.year)) {
            setYear(Number(startDate?.year));
            setSelectedStartMonthIndex(startIndex);
          }
        }
      }
    }, [id, startDate, endDate, showError, startIndex]);

    useEffect(() => {
      if (inputRef.current && showYear && yearInputRef.current) {
        yearInputRef.current.scrollTop = inputRef.current.offsetTop;
      }
    }, [showYear]);

    useEffect(() => {
      if (isCleared) {
        setStartIndex(-1);
        setEndIndex(-1);
        setSelectedMonthIndex(null);
        setSelectedStartMonthIndex(null);
        setStartMonth('');
        setEndMonth('');
        setStartYear(defaultYear);
        setEndYear(defaultYear + 1);
        setYear(baseYear);
        setShowYear(false);
      }
    }, [
      baseYear,
      defaultYear,
      isCleared,
      setEndMonth,
      setEndYear,
      setStartIndex,
      setStartMonth,
      setStartYear,
    ]);

    useEffect(() => {
      if (
        startDate?.month &&
        endDate?.month &&
        endIndex !== -1 &&
        startIndex > endIndex &&
        Number(startDate?.year) === Number(endDate?.year) &&
        selectedPreset === 'Custom'
      ) {
        setShowError?.(true);
        if (Number(startDate?.year) !== baseYear) setEndIndex(-1);
        if (id === 1) setSelectedStartMonthIndex(null);
      }
    }, [
      startDate,
      endDate,
      setShowError,
      startIndex,
      id,
      setStartIndex,
      endIndex,
      baseYear,
      selectedPreset,
    ]);

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
      if (Number(startDate.year) > Number(endDate.year)) {
        return [];
      }
      const getHighlightIndexesForDiffYears = () => {
        if (panelYear === Number(startDate.year)) {
          return Array.from(
            { length: 12 - startIndex },
            (_, i) => startIndex + i,
          );
        }
        if (panelYear === Number(endDate.year)) {
          return Array.from({ length: endIndex + 1 }, (_, i) => i);
        }
        if (
          panelYear > Number(startDate.year) &&
          panelYear < Number(endDate.year)
        ) {
          return Array.from({ length: 12 }, (_, i) => i);
        }
        return [];
      };
      const doublePanelMonthIndexes = (): number[][] => {
        if (startIndex !== -1 || endIndex !== -1) {
          if (selectedPreset === 'Custom') {
            if (Number(startDate.year) === Number(endDate.year)) {
              return [
                Array.from(
                  { length: endIndex - startIndex },
                  (_, i) => startIndex + i,
                ),
                Number(endDate.year) === panelYear
                  ? Array.from(
                      { length: endIndex - startIndex },
                      (_, i) => startIndex + i,
                    )
                  : [],
              ];
            }
            if (
              Number(startDate.year) === Number(endDate.year) - 1 ||
              Number(endDate.year) === panelYear
            ) {
              return [
                Array.from(
                  { length: 12 - startIndex },
                  (_, i) => startIndex + i,
                ),
                Array.from({ length: endIndex + 1 }, (_, i) => i),
              ];
            }
            if (Number(endDate.year) - Number(startDate.year) > 1) {
              return [
                getHighlightIndexesForDiffYears(),
                getHighlightIndexesForDiffYears(),
              ];
            }
          }
          if (
            selectedMonthIndex !== undefined &&
            selectedMonthIndex !== null &&
            selectedMonthIndex > -1
          ) {
            if (Number(endDate.year) === Number(startDate.year)) {
              const noOfMonths = Number(selectedPreset?.split(' ')[1]);

              return selectedPreset === 'Last 1 year'
                ? [
                    Array.from(
                      { length: 12 - selectedMonthIndex },
                      (_, i) => selectedMonthIndex + i,
                    ),
                    [],
                  ]
                : [
                    Array.from(
                      {
                        length:
                          selectedPreset === 'Last 1 month' ? 1 : noOfMonths,
                      },
                      (_, i) => selectedMonthIndex + i,
                    ),
                    [],
                  ];
            }

            if (Number(endDate.year) === Number(startDate.year) + 1) {
              const noOfMonths = Number(selectedPreset?.split(' ')[1]);
              const monthsLength =
                selectedMonthIndex + noOfMonths > 11
                  ? 12 - startIndex
                  : noOfMonths;

              return [
                Array.from(
                  { length: monthsLength },
                  (_, i) => selectedMonthIndex + i,
                ),
                startIndex + noOfMonths > 11
                  ? Array.from(
                      { length: noOfMonths - monthsLength },
                      (_, i) => i,
                    )
                  : [],
              ];
            }
          }
          return [[], []];
        }
        return [[], []];
      };

      return doublePanelMonthIndexes()[Number(id)];
    }, [
      endDate.year,
      endIndex,
      id,
      panelYear,
      selectedMonthIndex,
      selectedPreset,
      startDate.year,
      startIndex,
    ]);

    const isActive =
      'bg-fill-action-light border-border-action-focused border [&_span]:label-medium [&_span]:font-semibold text-text-action-hover !rounded-lg';

    const isDefault =
      'text-text-text hover:bg-fill-action-light hover:text-fill-action';
    const isCurrent = '!text-fill-action';

    const inRangeAfterContent =
      "relative px-4 py-2 after:content-[''] after:absolute after:top-1/2 after:-translate-y-1/2 after:-right-4 after:w-4 after:h-12 after:bg-fill-action-light";

    const isNotEndIndex = (index: number) =>
      (startDate?.year === endDate?.year && index) !== endIndex;

    const handleYearClick = (yearItem: number) => {
      if (isYearDisabled(yearItem)) return;
      setBaseYear(yearItem);

      setIsCleared(false);

      if (currentInput === 'start') {
        setStartYear(yearItem);
        if (!endDate?.month) {
          setEndYear(yearItem);
        }
      } else {
        setEndYear(yearItem);
      }
      setShowYear(false);
      // resetDateSetValue();
      if (selectedPreset !== 'Custom') {
        clearFilter();
        setSelectedMonthIndex(null);
      }
    };

    const handleMonthClick = (monthFullName: string, index: number) => {
      setIsCleared(false);

      if (isMonthDisabled(index)) return;

      if (
        Number(startDate?.year) < Number(endDate?.year) ||
        (startIndex < endIndex &&
          Number(startDate?.year) === Number(endDate?.year))
      ) {
        setShowError?.(false);
      }

      if (
        startIndex > endIndex &&
        endDate?.month &&
        Number(startDate?.year) === Number(endDate?.year)
      ) {
        setShowError?.(true);
        setSelectedStartMonthIndex(null);
        return;
      }
      if (
        (startDate?.month || endDate?.month) &&
        endIndex !== -1 &&
        Number(startDate?.year) > Number(endDate?.year)
      ) {
        setShowError?.(true);
        setSelectedStartMonthIndex(null);
        setSelectedMonthIndex(null);
        return;
      }

      if (currentInput === 'start') {
        if (
          Number(endDate?.year) === baseYear &&
          endIndex !== -1 &&
          index > endIndex
        ) {
          setShowError?.(true);
          setSelectedStartMonthIndex(null);
          return;
        }
        setStartIndex(index);
        setStartMonth(monthFullName);
        setSelectedStartMonthIndex(index);
        setStartYear(baseYear);
        if (Number(startDate?.year) < Number(endDate?.year)) {
          setEndYear(endDate?.year || baseYear);
        }
      } else if (currentInput === 'end' && startDate?.month) {
        if (
          Number(startDate?.year) === baseYear &&
          startIndex !== -1 &&
          startIndex > index
        ) {
          setShowError?.(true);
          setSelectedStartMonthIndex(null);
          return;
        }
        setEndYear(baseYear);
        setEndIndex(index);
        setEndMonth(monthFullName);
        if (Number(startDate?.year) === Number(endDate?.year)) {
          setSelectedStartMonthIndex(startIndex);
        }
        setSelectedMonthIndex(index);
      } else {
        setCurrentInput('start');
      }
    };

    const notPanelStartIndex = (index: number) =>
      Number(startDate?.year) === panelYear
        ? selectedStartMonthIndex !== index
        : true;
    const activeIndex = (index: number) =>
      selectedPreset === 'Custom' && !dateSetValue
        ? (selectedStartMonthIndex === index && startDate?.year === baseYear) ||
          (endIndex === index && endDate?.year === baseYear)
        : selectedStartMonthIndex === index || endIndex === index;
    return (
      <div
        ref={ref}
        className={`bg-fill-fill m-4 flex flex-1 justify-between ${wrapperClassName}`}
      >
        <div className="border-border-border-light flex w-full flex-col border-r px-4 pt-4">
          <div className="flex w-full justify-center gap-2">
            <div className="hover:bg-fill-action-light h-8 rounded-lg">
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
                  {panelYear}
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
                className="scroll-hidden relative flex max-h-[18.25rem] w-[15rem] flex-1 flex-wrap overflow-y-auto p-2"
                ref={yearInputRef}
              >
                {yearArray.map((yearItem) => (
                  <button
                    ref={panelYear === yearItem ? inputRef : null}
                    className={`mx-px mb-4 h-9 basis-[24%] rounded-lg ${
                      panelYear === yearItem ? isActive : isDefault
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
              <div className="mt-4 flex min-h-[17.25rem] w-[15rem] flex-1 flex-wrap justify-between px-2 pt-2">
                {arrayOfMonths.map((monthItem, index) => {
                  const highlightIndexes =
                    (!endDate?.month || !startDate?.month) &&
                    selectedPreset === 'Custom'
                      ? [selectedMonthIndex]
                      : getStartEndMonthIndexes();
                  const highlightedRange =
                    highlightIndexes?.includes(index) &&
                    index !== endIndex &&
                    notPanelStartIndex(index) &&
                    isNotEndIndex(index) &&
                    !isMonthDisabled(index);

                  return (
                    <button
                      className={`h-12 basis-[30%] rounded-lg ${
                        activeIndex(index) ? isActive : isDefault
                      } ${
                        defaultMonth === monthItem.abbreviation &&
                        defaultMonth !== monthName?.abbreviation &&
                        panelYear === defaultYear
                          ? isCurrent
                          : ''
                      }
                    ${
                      highlightedRange
                        ? `bg-fill-action-light !text-text-action-pressed rounded-none 
                        ${
                          index === endIndex - 1 && '!rounded-r-lg'
                        } ${startIndex + 1 === index && '!rounded-l-lg'}
                           ${
                             (index + 1) % 3 !== 0 &&
                             index !== endIndex - 1 &&
                             notPanelStartIndex(index) &&
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
