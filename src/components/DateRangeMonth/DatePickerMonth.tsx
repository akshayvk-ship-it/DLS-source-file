import React, { useEffect, useMemo, useState } from 'react';

import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { DateTimePickerProps } from '../DatePicker/DateTimePicker';
import { CalendarIcon } from '../Icons';
import { Button } from '../Button';
import { MonthPicker } from './MonthPicker';
import { ToolTip } from '../ToolTip';
import { DoublePanelMonthPicker } from './DoublePanelMonthPicker';

dayjs.extend(customParseFormat);

export interface DatePickerMonthProps
  extends Omit<
    DateTimePickerProps,
    | 'currentSelected'
    | 'handleCurrentSelection'
    | 'startingDate'
    | 'endingDate'
    | 'minDate'
    | 'maxDate'
    | 'isSingleDateSelect'
  > {
  selectedPreset: string;
  presets: Array<string>;
  minYear: number;
  maxYear: number;
  minDate?: Date;
  maxDate?: Date;
  dateSetValue?: string;
  wrapperClassName?: string;
  onPresetSelect?: (preset: string) => void;
  disableFuture: boolean;
  dataTestId?: string;
  datePickerWrapperClassName?: string;
  customPresetPosition?: 'start' | 'end';
  handleConfirmDate?: (
    startDate: dayjs.Dayjs | null,
    endDate: dayjs.Dayjs | null,
  ) => void;
  clearFilter?: () => void;
  resetDateSetValue?: () => void;
  isSingleDateSelect?: boolean;
  hidePresetOptions?: boolean;
  isDoublePanel?: boolean;
}

export const DatePickerMonth = React.forwardRef<
  HTMLDivElement,
  DatePickerMonthProps
>(
  (
    {
      selectedPreset,
      presets,
      wrapperClassName = '',
      onPresetSelect = () => {},
      minYear,
      maxYear,
      minDate,
      maxDate,
      dateSetValue,
      disableFuture,
      dataTestId = '',
      datePickerWrapperClassName = '',
      customPresetPosition = 'start',
      handleConfirmDate,
      clearFilter = () => {},
      resetDateSetValue = () => {},
      isSingleDateSelect = false,
      hidePresetOptions = false,
      isDoublePanel = false,
      defaultYear = dayjs().year(),
    },
    ref,
  ) => {
    const customAddedPresets = useMemo(
      () =>
        customPresetPosition === 'start'
          ? ['Custom', ...presets]
          : [...presets, 'Custom'],
      [customPresetPosition, presets],
    );

    const [currentSelection, setCurrentSelection] = useState<'start' | 'end'>(
      'start',
    );
    const [parsedStartDate, setParsedStartDate] = useState<
      dayjs.Dayjs | string
    >('Start month');
    const [parsedEndDate, setParsedEndDate] = useState<dayjs.Dayjs | string>(
      'End month',
    );

    const currentYear = dayjs().year();

    const [startMonth, setStartMonth] = useState<string>('');
    const [startYear, setStartYear] = useState<number>(currentYear);
    const [endMonth, setEndMonth] = useState<string>('');
    const [endYear, setEndYear] = useState<number>(currentYear);
    const [startIndex, setStartIndex] = useState<number>(-1);

    const parsedStart = useMemo(
      () => dayjs(`${startMonth} ${startYear}`, 'MMMM YYYY', true),
      [startMonth, startYear],
    );
    const parsedEnd = useMemo(
      () => dayjs(`${endMonth} ${endYear}`, 'MMMM YYYY', true),
      [endMonth, endYear],
    );

    const [isCleared, setIsCleared] = useState<boolean>(false);
    const [showErrorTooltip, setShowErrorTooltip] = useState<boolean>(false);
    const [isConfirmDisabledClicked, setIsConfirmDisabledClicked] =
      useState<boolean>(false);

    const initialYear =
      selectedPreset === 'Last 1 year' ? defaultYear - 1 : defaultYear;

    const [leftYear, setLeftYear] = useState<number>(initialYear);
    const [rightYear, setRightYear] = useState<number>(initialYear + 1);

    const getFormattedDate = (date: string) => dayjs(date).format('MMMM YYYY');

    useEffect(() => {
      setRightYear((prevRight) => {
        if (leftYear === prevRight) {
          return leftYear + 1;
        }
        return prevRight;
      });
    }, [leftYear]);

    useEffect(() => {
      setLeftYear((prevLeft) => {
        if (rightYear === prevLeft) {
          return rightYear - 1;
        }
        return prevLeft;
      });
    }, [rightYear]);

    useEffect(() => {
      const handleDateValueChange = (dateValue: string) => {
        if (!dateValue) {
          setParsedStartDate('Start month');
          setParsedEndDate('End month');
          return;
        }

        const [start = '', end = ''] = dateValue.split(' - ');

        if (isSingleDateSelect) {
          const currentStartMonth = dayjs(start).month();
          const currentEndMonth = dayjs(end).month();

          if (currentStartMonth !== currentEndMonth) return;
        }

        setParsedStartDate(getFormattedDate(start));
        setParsedEndDate(getFormattedDate(end));

        const startMonthYearSplit = getFormattedDate(start)?.split(' ');

        if (startMonthYearSplit) {
          setStartMonth(String(startMonthYearSplit?.[0]));
          setStartYear(Number(startMonthYearSplit?.[1]));
        }

        const endMonthYearSplit = getFormattedDate(end)?.split(' ');

        if (endMonthYearSplit) {
          setEndMonth(String(endMonthYearSplit?.[0]));
          setEndYear(Number(endMonthYearSplit?.[1]));
        }
      };
      if (dateSetValue) {
        handleDateValueChange(dateSetValue);
      }
    }, [dateSetValue, isSingleDateSelect]);

    useEffect(() => {
      if (currentSelection === 'start') {
        if (!startMonth || !parsedStart.isValid()) {
          setParsedStartDate('Start month');
          if (!endMonth) {
            setParsedEndDate('End month');
          }
          return;
        }
        const parseStartDate = parsedStart.format('MMMM YYYY');

        if (parsedStartDate === parseStartDate) return;

        setParsedStartDate(parseStartDate);
        setIsConfirmDisabledClicked(false);
        if (parsedEndDate === 'End month' && !isSingleDateSelect) {
          if (!endMonth) {
            // Fresh flow: no end selected yet → auto-advance
            setCurrentSelection('end');
          } else if (parsedEnd.isValid()) {
            // Reopen flow: endMonth restored from dateSetValue → update display directly
            setParsedEndDate(parsedEnd.format('MMMM YYYY'));
          }
        }
        if (showErrorTooltip) {
          setShowErrorTooltip(false);
        }
      } else {
        if (isSingleDateSelect) return;
        if (!endMonth || !parsedEnd.isValid()) {
          setParsedEndDate('End month');
          if (!startMonth) {
            setParsedStartDate('Start month');
          }
          return;
        }

        const parseEndDate = parsedEnd.format('MMMM YYYY');
        if (parsedEndDate === parseEndDate) return;

        setParsedEndDate(parseEndDate);
      }
    }, [
      startMonth,
      parsedStart,
      parsedStartDate,
      currentSelection,
      parsedEndDate,
      endMonth,
      parsedEnd,
      showErrorTooltip,
      isSingleDateSelect,
    ]);

    useEffect(() => {
      if (startMonth && endMonth) {
        setShowErrorTooltip(startYear > endYear);
      }
    }, [endMonth, endYear, startMonth, startYear]);

    const handleCustomDate = (
      startDate: dayjs.Dayjs | null,
      endDate: dayjs.Dayjs | null,
    ) => {
      handleConfirmDate?.(startDate || null, endDate || null);
    };
    const handleClearClick = () => {
      setStartMonth('');
      setEndMonth('');
      clearFilter();
      setLeftYear(defaultYear);
      setRightYear(defaultYear + 1);
      setParsedStartDate('Start month');
      setParsedEndDate('End month');
      setCurrentSelection('start');
      setIsCleared(true);
      setIsConfirmDisabledClicked(false);
      setShowErrorTooltip(false);
      setStartIndex(-1);
    };

    const onPresetSelection = (preset: string) => {
      if (preset === 'Custom') {
        if (
          parsedStartDate !== 'Start month' &&
          parsedEndDate !== 'End month'
        ) {
          handleClearClick();
        }
      } else {
        setIsCleared(false);
        onPresetSelect(preset);
      }
    };

    function listContainerGenerator() {
      const listContainers = customAddedPresets.map((preset, index) => (
        <button
          key={preset}
          tabIndex={index}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              onPresetSelection(preset);
            }
          }}
          type="button"
          onClick={() => {
            // Clear existing date selection when custom is selected
            onPresetSelection(preset);
          }}
          className={`${selectedPreset === preset ? 'bg-fill-action-light font-medium' : 'hover:bg-fill-action-lighter-pressed'}  active:text-text-dark-pressed flex h-10 w-full cursor-pointer select-none items-center rounded-lg px-4`}
        >
          <div className="label-medium text-text-text truncate">{preset}</div>
        </button>
      ));

      return listContainers;
    }

    const handleInputSelection = (inputType: 'end' | 'start') => {
      setCurrentSelection(inputType);
      setIsCleared(false);
    };

    const handleConfirmDisabled = () => {
      setIsConfirmDisabledClicked(true);
    };

    const isConfirmClickWithNoStartDate =
      parsedStartDate === 'Start month' && isConfirmDisabledClicked;

    const isConfirmClickWithNoEndDate =
      parsedStartDate !== 'Start month' &&
      parsedEndDate === 'End month' &&
      isConfirmDisabledClicked;

    const disableConfirmButton = !endMonth || !startMonth || showErrorTooltip;

    return (
      <div
        data-testid={dataTestId}
        ref={ref}
        className={`bg-fill-fill border-border-border-light rounded-2xl border shadow-[0px_0px_4px_0px_rgba(0,15,74,0.07)] ${wrapperClassName} divide-border-border-light ${isDoublePanel ? 'min-w-fit' : 'w-[31rem]'}  max-w-fit divide-y divide-dashed ${isSingleDateSelect ? 'overflow-hidden' : ''}`}
      >
        {selectedPreset && (
          <div>
            {!isSingleDateSelect ? (
              <div className="flex items-center p-4">
                <p
                  className={`paragraph-medium text-text-text ${isDoublePanel ? 'mr-6' : 'mr-4'}  font-medium`}
                >
                  Period:
                </p>
                {showErrorTooltip || isConfirmClickWithNoStartDate ? (
                  <ToolTip
                    iconToolTip={
                      <button
                        className={`${showErrorTooltip ? '!border-border-error !ring-border-error-focus-ring ring-4' : ''} ${currentSelection === 'start' ? 'bg-fill-fill border-border-action-focused shadow-border-brand-focus-ring border shadow-[0px_0px_0px_4px]' : ''} bg-fill-fill-dark border-fill-fill-dark mr-4 flex  ${isDoublePanel ? 'min-w-[17.75rem]' : 'min-w-[10.8rem]'} flex-col items-start gap-1 rounded-xl border p-2`}
                        type="button"
                        onClick={() => handleInputSelection('start')}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            handleInputSelection('start');
                          }
                        }}
                        tabIndex={0}
                      >
                        <div className="flex flex-row items-center justify-center gap-2">
                          <CalendarIcon className="h-4 w-4" />
                          <div
                            className={`${isDoublePanel ? 'paragraph-small' : 'paragraph-medium'} text-text-text font-medium`}
                          >
                            {parsedStartDate.toString()}
                          </div>
                        </div>
                      </button>
                    }
                    placementToolTip="top-center"
                    titleToolTip={`${showErrorTooltip ? 'Start month cannot be after End month' : 'Please select a start month'}`}
                    toolTipType="contextual"
                    classNameToolTip={`${showErrorTooltip ? '!bg-fill-error [&_span]:bg-fill-error [&_span]:border-none' : ''}`}
                    alwaysShowToolTip
                  />
                ) : (
                  <button
                    className={`${currentSelection === 'start' ? '!bg-fill-fill !border-border-action-focused shadow-border-brand-focus-ring border shadow-[0px_0px_0px_4px]' : ''} bg-fill-fill-dark border-fill-fill-dark mr-4 flex w-full ${isDoublePanel ? 'min-w-[17.75rem]' : 'min-w-[10.8rem]'} flex-col items-start gap-1 rounded-xl border p-2
                      `}
                    type="button"
                    onClick={() => handleInputSelection('start')}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleInputSelection('start');
                      }
                    }}
                    tabIndex={0}
                  >
                    <div className="flex flex-row items-center justify-center gap-2">
                      <CalendarIcon className="h-4 w-4" />
                      <div
                        className={`${isDoublePanel ? 'paragraph-small' : 'paragraph-medium'} text-text-text font-medium`}
                      >
                        {parsedStartDate.toString()}
                      </div>
                    </div>
                  </button>
                )}

                {isConfirmClickWithNoEndDate ? (
                  <ToolTip
                    iconToolTip={
                      <button
                        className={`${currentSelection === 'end' ? '!bg-fill-fill !border-border-action-focused shadow-border-brand-focus-ring border shadow-[0px_0px_0px_4px]' : ''} bg-fill-fill-dark border-fill-fill-dark flex ${isDoublePanel ? 'min-w-[17.75rem]' : 'min-w-[10.8rem]'} flex-col items-end gap-1 rounded-xl border p-2
                      `}
                        type="button"
                        onClick={() => {
                          handleInputSelection('end');
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            handleInputSelection('end');
                          }
                        }}
                        tabIndex={0}
                      >
                        <div className="flex flex-row-reverse items-center gap-2">
                          <CalendarIcon className="h-4 w-4" />
                          <div
                            className={`${isDoublePanel ? 'paragraph-small' : 'paragraph-medium'} text-text-text font-medium`}
                          >
                            {parsedEndDate.toString()}
                          </div>
                        </div>
                      </button>
                    }
                    placementToolTip="right-center"
                    titleToolTip="Please select an end month"
                    toolTipType="contextual"
                    alwaysShowToolTip
                  />
                ) : (
                  <button
                    className={`${currentSelection === 'end' ? '!bg-fill-fill !border-border-action-focused shadow-border-brand-focus-ring border shadow-[0px_0px_0px_4px]' : ''} bg-fill-fill-dark border-fill-fill-dark flex w-full ${isDoublePanel ? 'min-w-[17.75rem]' : 'min-w-[10.8rem]'} flex-col items-end gap-1 rounded-xl border p-2
                      `}
                    type="button"
                    onClick={() => {
                      handleInputSelection('end');
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleInputSelection('end');
                      }
                    }}
                    tabIndex={0}
                  >
                    <div className="flex flex-row-reverse items-center gap-2">
                      <CalendarIcon className="h-4 w-4" />
                      <div
                        className={`${isDoublePanel ? 'paragraph-small' : 'paragraph-medium'} text-text-text font-medium`}
                      >
                        {parsedEndDate.toString()}
                      </div>
                    </div>
                  </button>
                )}
              </div>
            ) : null}
            <div
              className={`border-border-border-light flex border-y ${isSingleDateSelect ? 'border-t-0' : ''} ${hidePresetOptions ? 'border-l-0' : ''}`}
            >
              {isDoublePanel ? (
                [0, 1].map((id) => (
                  <DoublePanelMonthPicker
                    key={id}
                    id={id}
                    currentInput={currentSelection}
                    minYear={minYear}
                    maxYear={maxYear}
                    minDate={minDate}
                    maxDate={maxDate}
                    setStartMonth={setStartMonth}
                    setStartYear={setStartYear}
                    setEndMonth={setEndMonth}
                    setEndYear={setEndYear}
                    disableFuture={disableFuture}
                    wrapperClassName={`${datePickerWrapperClassName} !m-0 !max-w-fit`}
                    startDate={{ month: startMonth, year: startYear }}
                    endDate={{ month: endMonth, year: endYear }}
                    selectedPreset={selectedPreset}
                    parsedStartDate={parsedStartDate}
                    isCleared={isCleared}
                    setIsCleared={setIsCleared}
                    resetDateSetValue={resetDateSetValue}
                    setShowError={setShowErrorTooltip}
                    showError={showErrorTooltip}
                    setCurrentInput={setCurrentSelection}
                    clearFilter={clearFilter}
                    dateSetValue={dateSetValue}
                    startIndex={startIndex}
                    setStartIndex={setStartIndex}
                    baseYear={id === 0 ? leftYear : rightYear}
                    setBaseYear={id === 0 ? setLeftYear : setRightYear}
                  />
                ))
              ) : (
                <MonthPicker
                  currentInput={currentSelection}
                  minYear={minYear}
                  maxYear={maxYear}
                  minDate={minDate}
                  maxDate={maxDate}
                  setStartMonth={setStartMonth}
                  setStartYear={setStartYear}
                  setEndMonth={setEndMonth}
                  setEndYear={setEndYear}
                  disableFuture={disableFuture}
                  wrapperClassName={`${datePickerWrapperClassName} !m-0 !max-w-fit`}
                  startDate={{ month: startMonth, year: startYear }}
                  endDate={{ month: endMonth, year: endYear }}
                  selectedPreset={selectedPreset}
                  parsedStartDate={parsedStartDate}
                  isCleared={isCleared}
                  setIsCleared={setIsCleared}
                  resetDateSetValue={resetDateSetValue}
                  setShowError={setShowErrorTooltip}
                  setCurrentInput={setCurrentSelection}
                  clearFilter={clearFilter}
                  dateSetValue={dateSetValue}
                  isSingleDateSelect={isSingleDateSelect}
                />
              )}

              {!hidePresetOptions && (
                <div className="px-4 pt-4">{listContainerGenerator()}</div>
              )}
            </div>
            <div className="flex justify-end p-4">
              <Button
                size="lg"
                hierarchy="Secondary"
                type="button"
                label="Clear"
                className="!border-border-border label-small mr-4 h-8 w-[3.75rem] font-semibold"
                onClick={handleClearClick}
              />
              <div
                role="button"
                tabIndex={0}
                onClick={handleConfirmDisabled}
                onKeyDown={handleConfirmDisabled}
              >
                <Button
                  size="lg"
                  hierarchy="Primary"
                  type="button"
                  label="Confirm"
                  className={`${disableConfirmButton ? 'pointer-events-none' : ''} label-small h-8 w-[4.75rem] font-semibold`}
                  disabled={disableConfirmButton}
                  onClick={() => {
                    handleCustomDate(parsedStart, parsedEnd);
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  },
);
