import React, { useEffect, useRef, useState } from 'react';
import dayjs from 'dayjs';

import { CloseIcon } from './DateRangeFilterComponents';
import { DateRange, DateRangeProps } from '../DateRange/DateRange';
import { CalendarIcon, ChevronDownIcon, TimerIcon } from '../Icons';
import { DateTimePicker } from '../DatePicker';
import { ToolTip } from '../ToolTip';
import { Button } from '../Button';

type State = 'Default' | 'DateSet';
export type DateTimeSetPayload = {
  startDate: Date;
  endDate: Date;
  startTime?: string;
  endTime?: string;
};

type SetDefaultTimes = { startingTime?: string; endingTime?: string };
export interface DateRangeFilterProps
  extends Omit<DateRangeProps, 'handleDateSet' | 'wrapperClassName'> {
  label: string;
  size: 'small' | 'large';
  hasClear?: boolean;
  presets: Array<string>;
  minDate?: Date;
  maxDate?: Date;
  state: State;
  dateTimeSetPayload?: DateTimeSetPayload;
  enableDefaultTime?: boolean;
  defaultTimes?: SetDefaultTimes;
  formattedStartTime?: string;
  formattedEndTime?: string;
  dateSetValue?: string;
  onPresetSelect?: (value: string) => void;
  customDateSet: (startDate: Date, endDate: Date) => void;
  onDateTimeConfirm?: (value: string) => void;
  onDateTimeSet?: (payload: DateTimeSetPayload) => void;
  dateSetWrapperClassName?: string;
  dateSetContentClassName?: string;
  dropDownClassName?: string;
  hideTimePicker?: boolean;
  dataTestId?: string;
  dateRangeWrapperClassName?: string;
  isSingleDateSelect?: boolean;
  wrapperClassName?: string;
  resetDateSetValue?: () => void;
  disableSameDateSelection?: boolean;
  withDateTimePicker?: boolean;
  /**
   * Used for the generation of time options with an interval of that gap.
   * @default undefined - in that case, the gap will be 30 in timepicker.
   * It's advised to give the gap in multiple of 60 so that at every hour they get consistent minute options.
   */
  timePickerOptionsGapInMinutes?: number;
}

const DEFAULT_START_TIME = '00:00';
const DEFAULT_END_TIME = '23:30';
export interface DateRangeType {
  startDate: Date | undefined;
  endDate: Date | undefined;
}
export const DateRangeFilter = React.forwardRef<
  HTMLDivElement,
  DateRangeFilterProps
>(
  (
    {
      label,
      size,
      hasClear,
      minDate,
      maxDate,
      presets,
      state,
      timePickerOptionsGapInMinutes,
      dateSetValue,
      dateTimeSetPayload,
      onPresetSelect,
      customDateSet,
      onDateTimeConfirm,
      defaultTimes,
      enableDefaultTime = false,
      onDateTimeSet,
      dateSetWrapperClassName = '',
      dateSetContentClassName = '',
      dropDownClassName = '',
      hideTimePicker = false,
      formattedStartTime = 'Set start time',
      formattedEndTime = 'Set end time',
      dataTestId = 'defaultDateRangeFilterTestId',
      disableFuture,
      maxYear,
      minYear,
      type = 'Days',
      btnLabel,
      defaultMonth,
      defaultYear,
      resetIcon,
      isSingleDateSelect = false,
      dateRangeWrapperClassName = '',
      wrapperClassName = '',
      resetDateSetValue,
      disableSameDateSelection = false,
      withDateTimePicker = false,
      maxRangeDays,
      onMaxRangeExceeded,
    },
    ref,
  ) => {
    const UNSET_START_TIME = 'Set start time';
    const UNSET_END_TIME = 'Set end time';
    const [internalDate, setInternalDate] = useState<DateRangeType | undefined>(
      undefined,
    );
    const [isDateCustomSelected, setIsDateCustomSelected] = useState(false);

    const [isDateFilterOpen, setDateFilterOpen] = useState<boolean>(false);
    const [currentState, setCurrentState] = useState<State>(state);
    const [showDateRange, setShowDateRange] = useState<boolean>(false);
    const [selectedPreset, setSelectedPreset] = useState({
      prev: '',
      preset: '',
    });
    const [currentSelection, setCurrentSelection] = useState<'start' | 'end'>(
      'start',
    );

    const [parsedStartDate, setParsedStartDate] =
      useState<string>('Start date');

    const [parsedEndDate, setParsedEndDate] = useState<string>('End date');

    const [startTime, setStartTime] = useState<string>(
      formattedStartTime ?? UNSET_START_TIME,
    );

    const [endTime, setEndTime] = useState<string>(
      formattedEndTime ?? UNSET_END_TIME,
    );

    const [isCleared, setIsCleared] = useState(false);
    const [isConfirmDisabledClicked, setIsConfirmDisabledClicked] =
      useState(false);

    const isStartActive = currentSelection === 'start';
    const isEndActive = currentSelection === 'end';

    useEffect(() => {
      if (!dateSetValue || state !== 'DateSet') return;

      let dateValue = dateSetValue;

      if (isSingleDateSelect) {
        if (dateSetValue.includes(' - ')) {
          const splitDates = dateSetValue.split(' - ');
          dateValue = `${splitDates[0]} - ${splitDates[0]}`;
        } else {
          dateValue = `${dateValue} - ${dateValue}`;
        }
      }

      if (dateTimeSetPayload?.startDate && dateTimeSetPayload?.endDate) {
        const {
          startDate,
          endDate,
          startTime: payloadStartTime,
          endTime: payloadEndTime,
        } = dateTimeSetPayload;

        setInternalDate({
          startDate,
          endDate,
        });

        if (!hideTimePicker) {
          setStartTime(payloadStartTime ?? UNSET_START_TIME);
          setEndTime(payloadEndTime ?? UNSET_END_TIME);
        }
        if (withDateTimePicker) setIsDateCustomSelected(true);
        return;
      }

      const splitDates = dateValue.split(' - ');

      if (splitDates.length !== 2) return;

      const startDate = dayjs(splitDates[0]);
      const endDate = dayjs(splitDates[1]);

      const isValidDates = !startDate.isValid() || !endDate.isValid();

      const isYear = startDate.year() >= minYear && endDate.year() <= maxYear;

      if (isValidDates || !isYear) return;

      setInternalDate({
        startDate: startDate.toDate(),
        endDate: endDate.toDate(),
      });
    }, [
      dateSetValue,
      isSingleDateSelect,
      maxYear,
      minYear,
      state,
      dateTimeSetPayload,
      withDateTimePicker,
      hideTimePicker,
    ]);

    function handleDateFilterOpen() {
      const nextOpen = !isDateFilterOpen;
      setDateFilterOpen(nextOpen);

      if (nextOpen) setIsConfirmDisabledClicked(false);
      if (
        nextOpen &&
        withDateTimePicker &&
        currentState === 'DateSet' &&
        internalDate?.startDate &&
        internalDate?.endDate
      ) {
        setSelectedPreset({ prev: 'Custom', preset: 'Custom' });
        setShowDateRange(true);
        setCurrentSelection('start');
      }
    }

    const applyDefaultTime = (selection: 'start' | 'end'): boolean => {
      if (!withDateTimePicker) return false;

      if (defaultTimes) {
        if (selection === 'start' && defaultTimes.startingTime) {
          setStartTime(defaultTimes.startingTime);
          return true;
        }
        if (selection === 'end' && defaultTimes.endingTime) {
          setEndTime(defaultTimes.endingTime);
          return true;
        }
      }

      if (!enableDefaultTime) return false;

      if (selection === 'start') {
        setStartTime(DEFAULT_START_TIME);
      } else {
        setEndTime(DEFAULT_END_TIME);
      }

      return true;
    };

    const handleDateTimeDateChange = (
      start?: dayjs.Dayjs,
      end?: dayjs.Dayjs,
    ) => {
      if (isStartActive && start) {
        const newStartDate = start.toDate();
        const newStartDayjs = dayjs(newStartDate);

        let updatedStart = newStartDate;
        let updatedEnd = end?.toDate() || internalDate?.endDate;

        if (updatedEnd && newStartDayjs.isAfter(dayjs(updatedEnd))) {
          updatedStart = newStartDate;
          updatedEnd = newStartDate;

          setParsedStartDate(newStartDayjs.format('DD MMM YYYY'));
          setParsedEndDate(newStartDayjs.format('DD MMM YYYY'));
        } else {
          updatedStart = newStartDate;
          setParsedStartDate(newStartDayjs.format('DD MMM YYYY'));
        }

        setInternalDate({
          startDate: updatedStart,
          endDate: updatedEnd,
        });

        if (
          !hideTimePicker &&
          startTime === UNSET_START_TIME &&
          showDateRange &&
          !isCleared
        ) {
          const didApply = applyDefaultTime('start');
          if (didApply) {
            setCurrentSelection('end');
          }
        }
        if (hideTimePicker) {
          setCurrentSelection('end');
        }

        setIsCleared(true);
        return;
      }

      if (isEndActive && end) {
        const newEndDate = end.toDate();
        const newEndDayjs = dayjs(newEndDate);

        let updatedStart = internalDate?.startDate;
        let updatedEnd = newEndDate;

        if (updatedStart && newEndDayjs.isBefore(dayjs(updatedStart))) {
          updatedStart = newEndDate;
          updatedEnd = newEndDate;

          setParsedStartDate(newEndDayjs.format('DD MMM YYYY'));
          setParsedEndDate(newEndDayjs.format('DD MMM YYYY'));
        } else {
          updatedEnd = newEndDate;
          setParsedEndDate(newEndDayjs.format('DD MMM YYYY'));
        }

        setInternalDate({
          startDate: updatedStart,
          endDate: updatedEnd,
        });

        if (
          !hideTimePicker &&
          endTime === UNSET_END_TIME &&
          showDateRange &&
          !isCleared
        ) {
          applyDefaultTime('end');
        }

        setIsCleared(false);

        if (hideTimePicker) {
          setCurrentSelection('start');
        }
      }
    };
    useEffect(() => {
      if (!internalDate?.startDate) {
        setParsedStartDate(
          currentSelection === 'start' ? 'Set start date' : 'Start date',
        );
        return;
      }

      const parsed = dayjs(internalDate.startDate);
      if (!parsed.isValid()) {
        setParsedStartDate('Start date');
        return;
      }

      setParsedStartDate(parsed.format('DD MMM YYYY'));
      setIsConfirmDisabledClicked(false);
      setIsCleared(false);
    }, [internalDate?.startDate, currentSelection]);

    useEffect(() => {
      if (!internalDate?.endDate) {
        setParsedEndDate(
          currentSelection === 'end' ? 'Set end date' : 'End date',
        );
        return;
      }

      const parsed = dayjs(internalDate.endDate);
      if (!parsed.isValid()) {
        setParsedEndDate('End date');
        return;
      }

      setParsedEndDate(parsed.format('DD MMM YYYY'));
      setIsConfirmDisabledClicked(false);
      setIsCleared(false);
    }, [internalDate?.endDate, currentSelection]);

    const handleDateTimeTimeChange = (time: string) => {
      if (currentSelection === 'start') {
        setStartTime(time);
        setCurrentSelection('end');
      } else {
        setEndTime(time);
        if (!internalDate?.startDate || startTime === UNSET_START_TIME) {
          setCurrentSelection('start');
        }
      }
    };

    const handleConfirm = () => {
      if (!internalDate?.startDate || !internalDate?.endDate) return;

      const startDateStr = dayjs(internalDate.startDate).format('DD MMM YYYY');
      const endDateStr = dayjs(internalDate.endDate).format('DD MMM YYYY');

      const value = hideTimePicker
        ? `${startDateStr} - ${endDateStr}`
        : `${startDateStr}, ${startTime || '00:00'} - ${endDateStr}, ${endTime || '23:59'}`;

      customDateSet(internalDate.startDate, internalDate.endDate);
      onDateTimeConfirm?.(value);
      onDateTimeSet?.({
        startDate: internalDate.startDate,
        endDate: internalDate.endDate,
        startTime: hideTimePicker
          ? undefined
          : (startTime ?? DEFAULT_START_TIME),
        endTime: hideTimePicker ? undefined : (endTime ?? DEFAULT_END_TIME),
      });
      setIsDateCustomSelected(true);
      setCurrentState('DateSet');
      setDateFilterOpen(false);
    };

    function handlePresetSelect(value: string) {
      if (value !== 'Custom' && withDateTimePicker && !hideTimePicker) {
        setStartTime(UNSET_START_TIME);
        setEndTime(UNSET_END_TIME);
      }

      let startTimeToSend: string | undefined;
      let endTimeToSend: string | undefined;

      if (!hideTimePicker && withDateTimePicker) {
        startTimeToSend = DEFAULT_START_TIME;
        endTimeToSend = DEFAULT_END_TIME;
      }

      onPresetSelect!(value);

      if (
        withDateTimePicker &&
        !hideTimePicker &&
        internalDate?.startDate &&
        internalDate?.endDate &&
        value === 'Custom'
      ) {
        onDateTimeSet?.({
          startDate: internalDate.startDate,
          endDate: internalDate.endDate,
          startTime: startTimeToSend,
          endTime: endTimeToSend,
        });
      }

      setDateFilterOpen(false);
      setCurrentState('DateSet');
    }

    function clearFilter(): void {
      setSelectedPreset({ prev: '', preset: '' });
      setInternalDate(undefined);
      setCurrentState('Default');

      setStartTime(UNSET_START_TIME);
      setEndTime(UNSET_END_TIME);
      setCurrentSelection('start');
      setIsCleared(true);
      setIsConfirmDisabledClicked(false);
      setShowDateRange(false);
      resetDateSetValue?.();
    }

    function clearTimePickerFilter(): void {
      setInternalDate(undefined);
      setCurrentState('Default');

      setStartTime(UNSET_START_TIME);
      setEndTime(UNSET_END_TIME);
      setCurrentSelection('start');
      setIsCleared(true);
      setIsConfirmDisabledClicked(false);
      resetDateSetValue?.();
    }

    const handleCancel = () => {
      if (withDateTimePicker) clearTimePickerFilter();
      else {
        clearFilter();
        setDateFilterOpen(false);
      }
    };

    const presetsClickHandler = (preset: string) => {
      setSelectedPreset((prev) => ({
        prev: prev.preset,
        preset,
      }));
      setInternalDate(undefined);
      if (preset === 'Custom') {
        if (withDateTimePicker) setIsCleared(false);
        setIsConfirmDisabledClicked(false);
        setShowDateRange(true);
        setCurrentSelection('start');
      } else {
        setInternalDate(undefined);
        setStartTime(UNSET_START_TIME);
        setEndTime(UNSET_END_TIME);
        setParsedStartDate('Start date');
        setParsedEndDate('End date');
        setIsCleared(true);

        setShowDateRange(false);
        handlePresetSelect(preset);
        setCurrentState('DateSet');
        setIsDateCustomSelected(false);
      }
    };

    function listContainerGenerator() {
      const customAddedPresets = [...presets, 'Custom'];
      const listContainers = customAddedPresets.map((preset, index) => (
        <div
          key={preset}
          tabIndex={index}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              presetsClickHandler(preset);
            }
          }}
          role="button"
          onClick={() => {
            presetsClickHandler(preset);
          }}
          className={`${selectedPreset.preset === preset ? 'bg-fill-pressed-dark' : 'hover:bg-fill-hover-light'}  active:text-text-dark-pressed flex h-10 cursor-pointer select-none items-center px-4`}
        >
          <div className="label-medium text-text-text truncate">{preset}</div>
        </div>
      ));

      return listContainers;
    }

    const handleDateSetHandler = (startDate: Date, endDate: Date) => {
      const finalEndDate = isSingleDateSelect ? startDate : endDate;
      setInternalDate({ startDate, endDate: finalEndDate });
      customDateSet(startDate, finalEndDate);
      setDateFilterOpen(false);
      setCurrentState('DateSet');
      setSelectedPreset((prev) => ({
        prev: prev.preset,
        preset: 'Custom',
      }));
      setIsDateCustomSelected(true);
    };

    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      function handleClickOutside(event: MouseEvent) {
        if (
          wrapperRef.current &&
          !wrapperRef.current.contains(event.target as Node)
        ) {
          setDateFilterOpen(false);
          if (withDateTimePicker && !isDateCustomSelected && showDateRange) {
            setInternalDate(undefined);
            setCurrentSelection('start');
            setIsCleared(true);

            if (!hideTimePicker) {
              setStartTime(UNSET_START_TIME);
              setEndTime(UNSET_END_TIME);
            }
          }

          if (withDateTimePicker && currentState !== 'DateSet') {
            setCurrentSelection('start');
          }

          if (selectedPreset.preset === 'Custom') {
            setSelectedPreset((prev) => ({
              prev: prev.prev,
              preset: prev.prev,
            }));

            if (!isDateCustomSelected) {
              setShowDateRange(false);
            }
          } else {
            setShowDateRange(false);
          }
          if (currentState !== 'DateSet') {
            setSelectedPreset({
              prev: '',
              preset: '',
            });
            if (withDateTimePicker && !hideTimePicker) {
              setStartTime(UNSET_START_TIME);
              setEndTime(UNSET_END_TIME);
            }
          }
        }
      }
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [
      currentState,
      isDateCustomSelected,
      selectedPreset.preset,
      hideTimePicker,
      withDateTimePicker,
      showDateRange,
    ]);

    const isConfirmClickWithNoStartDate =
      (parsedStartDate === 'Start date' || !startTime) &&
      isConfirmDisabledClicked;

    const isConfirmClickWithNoEndDate =
      parsedStartDate !== 'Start date' &&
      startTime &&
      (parsedEndDate === 'End date' || !endTime) &&
      isConfirmDisabledClicked;

    const disableConfirmButton =
      !internalDate?.startDate ||
      !internalDate?.endDate ||
      (!hideTimePicker &&
        withDateTimePicker &&
        (startTime === UNSET_START_TIME || endTime === UNSET_END_TIME));

    const highlightStartDate =
      isStartActive && parsedStartDate === 'Set start date';

    const highlightStartTime =
      isStartActive &&
      parsedStartDate !== 'Set start date' &&
      startTime === UNSET_START_TIME;

    const highlightEndDate = isEndActive && parsedEndDate === 'Set end date';

    const highlightEndTime =
      isEndActive &&
      parsedEndDate !== 'Set end date' &&
      endTime === UNSET_END_TIME;

    let labelContent: React.ReactNode;

    if (currentState === 'DateSet' && dateSetValue) {
      if (withDateTimePicker) {
        const [start, end] = dateSetValue.split('-');

        labelContent = (
          <div className="flex h-full items-center">
            <span className="border-border-border-light inline-flex h-full items-center rounded-lg border-r pr-2  font-medium">
              {start?.trim()}
            </span>

            <span className="text-text-light mx-2">to</span>

            <span className="border-border-border-light inline-flex h-full items-center rounded-lg border-l pl-2  font-medium">
              {end?.trim()}
            </span>
          </div>
        );
      } else {
        labelContent = dateSetValue;
      }
    } else {
      labelContent = label || 'Filter by date';
    }
    return (
      <div
        data-testid={dataTestId}
        ref={ref}
        className={`${wrapperClassName} relative`}
      >
        <div ref={wrapperRef} className={`${dateSetWrapperClassName} relative`}>
          <div
            className={`${dateSetContentClassName} bg-fill-fill hover:bg-fill-hover-light active:!bg-fill-hover-light flex ${size === 'small' ? 'h-10' : 'h-12'}  w-max cursor-pointer items-center rounded-lg border ${isDateFilterOpen ? '!shadow-border-default-focus-ring !shadow-[0px_0px_0px_4px]' : ''}
              
                ${currentState !== 'DateSet' ? 'border-border-border' : 'border-border-action-focused shadow-border-brand-focus-ring shadow-[0px_0px_0px_4px] '}
              `}
            onClick={handleDateFilterOpen}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleDateFilterOpen();
              }
            }}
          >
            <CalendarIcon
              className={`ml-4 ${size === 'small' ? 'h-5 w-5' : 'h-6 w-6'}`}
            />
            <div
              className={`px-4 ${size === 'small' ? 'label-medium' : 'label-large'}  date-range-label text-text-dark flex h-full select-none items-center font-semibold`}
            >
              {labelContent}
            </div>
            {currentState === 'DateSet' ? (
              <CloseIcon
                onClick={() => {
                  clearFilter();
                }}
              />
            ) : null}
            <div
              className={`border-border-border flex h-full items-center border-l px-2 `}
            >
              <ChevronDownIcon
                className={`${size === 'small' ? 'h-5 w-5' : 'h-6 w-6'}`}
              />
            </div>
          </div>
          {isDateFilterOpen && (
            <div
              className={`absolute left-0 top-full ${showDateRange ? 'border-border-border-light mt-1 rounded-lg border shadow-[0px_0px_3px_0px_rgba(0,0,0,0.1),0px_0px_2px_0px_rgba(27,32,41,0.06)]' : ''} bg-fill-fill z-[50] mt-1 flex ${withDateTimePicker ? 'overflow-visible' : 'overflow-hidden'}`}
            >
              <div
                className={`${dropDownClassName} bg-fill-fill border-border-border-light relative w-44 min-w-fit py-4  ${showDateRange ? 'border-r' : 'rounded-lg border shadow-[0px_0px_3px_0px_rgba(0,0,0,0.1),0px_0px_2px_0px_rgba(27,32,41,0.06)]'}`}
              >
                {hasClear && dateSetValue && (
                  <div
                    role="button"
                    onClick={clearFilter}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        clearFilter();
                      }
                    }}
                    className="text-text-action label-small mb-2 w-full select-none pl-4 font-semibold"
                  >
                    Clear
                  </div>
                )}
                <div>{listContainerGenerator()}</div>
              </div>
              {withDateTimePicker && showDateRange ? (
                <div className="flex flex-col">
                  {/* ---------- TOP: START / END BOXES ---------- */}
                  <div
                    className={`border-border-border-light flex items-center gap-4 border-b py-4 pl-4 ${
                      isConfirmClickWithNoEndDate ? 'pr-4' : ''
                    }`}
                  >
                    {isConfirmClickWithNoStartDate ? (
                      <ToolTip
                        iconToolTip={
                          <div
                            className={`${currentSelection === 'start' ? '!bg-fill-fill !border-border-action-focused shadow-border-brand-focus-ring  border shadow-[0px_0px_0px_4px]' : ''} bg-fill-fill-dark border-fill-fill-dark flex w-full min-w-full max-w-[14.75rem] flex-1 flex-col items-start gap-1 rounded-xl border p-2`}
                            role="button"
                            onClick={() => setCurrentSelection('start')}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                setCurrentSelection('start');
                              }
                            }}
                            tabIndex={0}
                          >
                            <div className="flex flex-row items-center justify-center gap-2">
                              <CalendarIcon className="h-4 w-4" />
                              <div className="text-text-text paragraph-medium font-medium">
                                {parsedStartDate.toString()}
                              </div>
                            </div>
                            {!hideTimePicker && (
                              <div className="flex flex-row items-center justify-center gap-2">
                                <TimerIcon className="h-4 w-4" />
                                <div className="paragraph-extra-small text-text-text font-normal">
                                  {startTime}
                                </div>
                              </div>
                            )}
                          </div>
                        }
                        className="w-full"
                        placementToolTip="top-center"
                        titleToolTip={
                          parsedStartDate === 'Start date'
                            ? 'Please select a start date'
                            : 'Please select a start time'
                        }
                        toolTipType="contextual"
                        alwaysShowToolTip
                      />
                    ) : (
                      <div
                        className={`${currentSelection === 'start' ? '!bg-fill-fill !border-border-action-focused shadow-border-brand-focus-ring border shadow-[0px_0px_0px_4px]' : ''} bg-fill-fill-dark border-fill-fill-dark flex w-full min-w-[8.75rem] max-w-[14.75rem] flex-col items-start gap-1 rounded-xl border p-2`}
                        role="button"
                        onClick={() => setCurrentSelection('start')}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            setCurrentSelection('start');
                          }
                        }}
                        tabIndex={0}
                      >
                        <div className="flex flex-row items-center justify-center gap-2">
                          <CalendarIcon className="h-4 w-4" />
                          <div
                            className={`${highlightStartDate ? 'text-text-action' : 'text-text-text'} paragraph-medium  font-medium`}
                          >
                            {parsedStartDate.toString()}
                          </div>
                        </div>
                        {!hideTimePicker && (
                          <div className="flex flex-row items-center justify-center gap-2">
                            <TimerIcon className="h-4 w-4" />
                            <div
                              className={`${highlightStartTime ? 'text-text-action' : 'text-text-text'} paragraph-extra-small font-normal`}
                            >
                              {startTime}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    {isConfirmClickWithNoEndDate ? (
                      <ToolTip
                        iconToolTip={
                          <div
                            className={`${currentSelection === 'end' ? '!bg-fill-fill !border-border-action-focused shadow-border-brand-focus-ring mr-4 border shadow-[0px_0px_0px_4px]' : ''} bg-fill-fill-dark border-fill-fill-dark box-border flex w-full min-w-[8.75rem] max-w-[14.75rem] flex-col items-end gap-1 rounded-xl border p-2`}
                            role="button"
                            onClick={() => setCurrentSelection('end')}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                setCurrentSelection('end');
                              }
                            }}
                            tabIndex={0}
                          >
                            <div className="flex flex-row-reverse items-center gap-2">
                              <CalendarIcon className="h-4 w-4" />
                              <div
                                className={`${highlightEndDate ? 'text-text-action' : 'text-text-text'} paragraph-medium font-medium`}
                              >
                                {parsedEndDate.toString()}
                              </div>
                            </div>

                            {!hideTimePicker && (
                              <div className="flex flex-row-reverse items-center gap-2">
                                <TimerIcon className="h-4 w-4" />
                                <div
                                  className={`${highlightEndTime ? 'text-text-action' : 'text-text-text'} paragraph-extra-small font-normal`}
                                >
                                  {endTime}
                                </div>
                              </div>
                            )}
                          </div>
                        }
                        className="w-full"
                        placementToolTip="top-center"
                        titleToolTip={
                          parsedEndDate === 'End date'
                            ? 'Please select a end date'
                            : 'Please select a end time'
                        }
                        toolTipType="contextual"
                        alwaysShowToolTip
                      />
                    ) : (
                      <div
                        className={`${currentSelection === 'end' ? '!bg-fill-fill !border-border-action-focused shadow-border-brand-focus-ring border shadow-[0px_0px_0px_4px]' : ''} bg-fill-fill-dark border-fill-fill-dark mr-4 flex w-full min-w-[8.75rem] max-w-[14.75rem] flex-col items-end gap-1 rounded-xl border p-2
                                                      `}
                        role="button"
                        onClick={() => setCurrentSelection('end')}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            setCurrentSelection('end');
                          }
                        }}
                        tabIndex={0}
                      >
                        <div className="flex flex-row-reverse items-center gap-2">
                          <CalendarIcon className="h-4 w-4" />
                          <div
                            className={`${highlightEndDate ? 'text-text-action' : 'text-text-text'} paragraph-medium font-medium`}
                          >
                            {parsedEndDate.toString()}
                          </div>
                        </div>

                        {!hideTimePicker && (
                          <div className="flex flex-row-reverse items-center gap-2">
                            <TimerIcon className="h-4 w-4" />
                            <div
                              className={`${highlightEndTime ? 'text-text-action' : 'text-text-text'} paragraph-extra-small font-normal`}
                            >
                              {endTime}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* ---------- MIDDLE: CALENDAR + TIME ---------- */}
                  <DateTimePicker
                    wrapperClassName="min-w-[25rem] !max-h-[23rem] !m-0 !p-4 border-b border-border-border-light"
                    type={type}
                    minYear={minYear}
                    maxYear={maxYear}
                    isCleared={isCleared}
                    minDate={minDate ? dayjs(minDate) : undefined}
                    maxDate={maxDate ? dayjs(maxDate) : undefined}
                    startingDate={
                      internalDate?.startDate
                        ? dayjs(internalDate.startDate)
                        : undefined
                    }
                    endingDate={
                      internalDate?.endDate
                        ? dayjs(internalDate.endDate)
                        : undefined
                    }
                    currentSelected={currentSelection}
                    currentSelectedTime={
                      currentSelection === 'start' ? startTime : endTime
                    }
                    handleDate={handleDateTimeDateChange}
                    handleTime={handleDateTimeTimeChange}
                    disableFuture={disableFuture}
                    disableSameDateSelection={disableSameDateSelection}
                    hideTimePicker={hideTimePicker}
                    maxRangeDays={maxRangeDays}
                    onMaxRangeExceeded={onMaxRangeExceeded}
                    timePickerOptionsGapInMinutes={
                      timePickerOptionsGapInMinutes
                    }
                  />

                  {/* ---------- BOTTOM: CONFIRM / CANCEL ---------- */}
                  <div className="flex justify-end p-4">
                    <Button
                      size="lg"
                      hierarchy="Secondary"
                      type="button"
                      label="Clear"
                      className="!border-border-border label-small mr-4 h-8 w-[3.75rem]"
                      onClick={handleCancel}
                    />

                    <div
                      role="button"
                      tabIndex={0}
                      onClick={() => setIsConfirmDisabledClicked(true)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          setIsConfirmDisabledClicked(true);
                        }
                      }}
                      className={
                        disableConfirmButton ? 'cursor-not-allowed' : ''
                      }
                    >
                      <Button
                        size="lg"
                        hierarchy="Primary"
                        label="Confirm"
                        type="button"
                        className={`${disableConfirmButton ? 'pointer-events-none' : ''} label-small h-8 w-[4.75rem]`}
                        onClick={handleConfirm}
                        disabled={disableConfirmButton}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                showDateRange && (
                  <DateRange
                    maxYear={maxYear}
                    minYear={minYear}
                    minDate={minDate}
                    maxDate={maxDate}
                    type={type}
                    internalStartDate={internalDate?.startDate}
                    internalEndDate={internalDate?.endDate}
                    btnLabel={btnLabel}
                    handleDateSet={handleDateSetHandler}
                    disableFuture={disableFuture}
                    defaultMonth={defaultMonth}
                    defaultYear={defaultYear}
                    resetIcon={resetIcon}
                    isSingleDateSelect={isSingleDateSelect}
                    wrapperClassName={`${dateRangeWrapperClassName} min-w-[21.25rem]`}
                    disableSameDateSelection={disableSameDateSelection}
                    maxRangeDays={maxRangeDays}
                    onMaxRangeExceeded={onMaxRangeExceeded}
                  />
                )
              )}
            </div>
          )}
        </div>
      </div>
    );
  },
);
