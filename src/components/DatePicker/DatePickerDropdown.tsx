import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import dayjs from 'dayjs';
import { CalendarIcon, CloseIcon, TimerIcon } from '../Icons';
import { DateTimePicker } from './DateTimePicker';
import { Button } from '../Button';
import { ToolTip } from '../ToolTip';

type State = 'Default' | 'DateSet';

export interface DatePickerDropdownProps {
  label: string;
  size: 'small' | 'large';
  presets: Array<string>;
  minDate?: Date;
  maxDate?: Date;
  state: State;
  dateSetValue?: string;
  onPresetSelect: (value: string) => void;
  currentSelected?: string;
  customDateFormat?: string;
  startingDate?: string;
  endingDate?: string;
  hideTimePicker?: boolean;
  formattedStartTime?: string;
  formattedEndTime?: string;
  startTime?: string;
  endTime?: string;
  customTime: (time: string, currentSelection: string) => void;
  defaultTime?: (currentSelection: string) => void;
  customDate?: (startDate?: Date, endDate?: Date) => void;
  timePickerWrapperClassName?: string;
  datePickerWrapperClassName?: string;
  selectionTypeFlow?: 'dateTime' | 'date';
  dateSetWrapperClassName?: string;
  dateSetContentClassName?: string;
  minYear: number;
  maxYear: number;
  disableFuture: boolean;
  type: 'Days' | 'Months' | 'Year';
  dataTestId?: string;
  wrapperClassName?: string;
  setDateSetValue?: React.Dispatch<React.SetStateAction<string | undefined>>;
  disableSameDateSelection?: boolean;
  customPresetPosition?: 'start' | 'end';
  onClearDate: () => void;
  maxRange?: number;
  /**
   * Used for the generation of time options with an interval of that gap.
   * @default undefined - in that case, the gap will be 30 in timepicker.
   * It's advised to give the gap in multiple of 60 so that at every hour they get consistent minute options.
   */
  timePickerOptionsGapInMinutes?: number;
}

export const DatePickerDropdown = React.forwardRef<
  HTMLDivElement,
  DatePickerDropdownProps
>(
  (
    {
      label,
      size,
      minDate,
      maxDate,
      presets,
      state,
      dateSetValue,
      onPresetSelect,
      timePickerOptionsGapInMinutes,
      dateSetWrapperClassName = '',
      dateSetContentClassName = '',
      dataTestId = 'defaultDatePickerDropdownTestId',
      disableFuture,
      maxYear,
      minYear,
      type = 'Days',
      currentSelected,
      customDateFormat,
      startingDate,
      endingDate,
      hideTimePicker,
      formattedStartTime = 'Start time',
      formattedEndTime = 'End time',
      startTime,
      endTime,
      customTime,
      defaultTime = () => {},
      customDate,
      timePickerWrapperClassName,
      datePickerWrapperClassName,
      selectionTypeFlow,
      wrapperClassName = '',
      setDateSetValue,
      disableSameDateSelection = false,
      customPresetPosition = 'start',
      onClearDate,
      maxRange = 0,
    },
    ref,
  ) => {
    const [isDateFilterOpen, setIsDateFilterOpen] = useState<boolean>(false);
    const [currentState, setCurrentState] = useState<State>(state);
    const [selectedPreset, setSelectedPreset] = useState({
      prev: '',
      preset: 'Custom',
    });

    const [currentSelection, setCurrentSelection] = useState<string>(
      currentSelected || 'start',
    );
    const [parsedStartDate, setParsedStartDate] = useState<
      dayjs.Dayjs | string
    >('');
    const [parsedEndDate, setParsedEndDate] = useState<dayjs.Dayjs | string>(
      '',
    );
    const [isCleared, setIsCleared] = useState<boolean>(false);
    const [isConfirmDisabledClicked, setIsConfirmDisabledClicked] =
      useState<boolean>(false);

    useEffect(() => {
      if (!startingDate) {
        setParsedStartDate(
          currentSelection === 'start' ? 'Set start date' : 'Start date',
        );
        return;
      }

      const parsed = dayjs(startingDate, 'DD MMM YYYY', true);

      if (!parsed.isValid()) {
        setParsedStartDate('Start date');
        return;
      }

      const parseStartDate = parsed.format(customDateFormat || 'DD MMM YYYY');
      setParsedStartDate(parseStartDate);
      setIsConfirmDisabledClicked(false);
      setIsCleared(false);
    }, [
      startingDate,
      customDateFormat,
      currentSelection,
      selectedPreset.preset,
    ]);

    useEffect(() => {
      if (!endingDate) {
        setParsedEndDate(
          currentSelection === 'end' ? 'Set end date' : 'End date',
        );
        return;
      }

      const parsed = dayjs(endingDate, 'DD MMM YYYY', true);

      if (!parsed.isValid()) {
        setParsedEndDate('End date');
        return;
      }
      const parseEndDate = parsed.format(customDateFormat || 'DD MMM YYYY');
      setParsedEndDate(parseEndDate);
      setIsConfirmDisabledClicked(false);
      setIsCleared(false);
    }, [endingDate, customDateFormat, currentSelection, selectedPreset.preset]);

    const handleCustomDate = (
      startDate?: dayjs.Dayjs,
      endDate?: dayjs.Dayjs,
    ) => {
      if (selectionTypeFlow === 'date') {
        //  Selection of date first and later time selection
        if (startDate && !endDate) {
          setCurrentSelection('end');
        } else if (endDate && !startDate) {
          setCurrentSelection('start');
        }
        if (startDate && defaultTime) {
          defaultTime('start');
        }
        if (endDate && defaultTime) {
          defaultTime('end');
        }
      } else if (hideTimePicker) {
        if (startDate) {
          setCurrentSelection('end');
        } else if (endDate && !startDate) {
          setCurrentSelection('start');
        }
      } else {
        // eslint-disable-next-line no-lonely-if
        if (startDate && startTime) {
          setCurrentSelection('end');
        } else if ((endDate && endTime && !startTime) || !endTime) {
          setCurrentSelection('start');
        }
      }

      if (
        !hideTimePicker &&
        startDate?.isSame(endDate) &&
        startTime &&
        endTime
      ) {
        if (currentSelection === 'start' && endTime < startTime) {
          customTime(startTime, 'end');
        }

        if (currentSelection === 'end' && startTime > endTime) {
          customTime(endTime, 'start');
        }
      }

      customDate?.(startDate?.toDate(), endDate?.toDate());
    };

    const handleCustomTime = (time: string) => {
      const selectedTime = time;
      if (currentSelection === 'start') {
        if (startingDate && selectionTypeFlow === 'dateTime') {
          setCurrentSelection('end');
        }

        customTime(selectedTime, currentSelection);
      }
      if (currentSelection === 'end') {
        if (
          ((endingDate && !startingDate) || !startTime) &&
          selectionTypeFlow === 'dateTime'
        ) {
          setCurrentSelection('start');
        }

        customTime(selectedTime, currentSelection);
      }
    };

    const buttonRef = useRef<HTMLButtonElement>(null);

    function getAlignment() {
      if (!buttonRef.current) return 'left';

      const rect = buttonRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const screenWidth = window.innerWidth;

      if (centerX < screenWidth * 0.33) return 'left';
      if (centerX > screenWidth * 0.66) return 'right';
      return 'center';
    }
    const [alignment, setAlignment] = useState<'left' | 'center' | 'right'>(
      getAlignment(),
    );

    function handleDateFilterOpen() {
      setIsDateFilterOpen(!isDateFilterOpen);
    }

    function handlePresetSelect(value: string) {
      onPresetSelect?.(value);
    }

    const clearFilter = useCallback(() => {
      setSelectedPreset({
        prev: selectedPreset.preset,
        preset: 'Custom',
      });
      onClearDate();
      setCurrentState('Default');
      setDateSetValue?.('');
      setParsedStartDate('Start date');
      setParsedEndDate('End date');
      setIsCleared(true);
      setIsConfirmDisabledClicked(false);
      setCurrentSelection('start');
    }, [onClearDate, selectedPreset.preset, setDateSetValue]);

    const presetsClickHandler = (preset: string) => {
      if (preset === 'Custom') {
        setSelectedPreset((prev) => ({
          prev: prev.prev,
          preset,
        }));
        setDateSetValue?.('');
        setCurrentState('Default');
        setCurrentSelection('start');
      } else {
        setSelectedPreset((prev) => ({
          prev: prev.preset,
          preset,
        }));
        setCurrentSelection('end');
        handlePresetSelect(preset);
      }
    };

    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      function handleClickOutside(event: MouseEvent) {
        if (
          wrapperRef.current &&
          !wrapperRef.current.contains(event.target as Node)
        ) {
          setIsDateFilterOpen(false);
          if (!dateSetValue) clearFilter();
        }
      }
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [clearFilter, dateSetValue]);

    useEffect(() => {
      const handler = () => setAlignment(getAlignment());

      handler();

      window.addEventListener('resize', handler);
      return () => window.removeEventListener('resize', handler);
    }, []);

    const customAddedPresets = useMemo(
      () =>
        customPresetPosition === 'start'
          ? ['Custom', ...presets]
          : [...presets, 'Custom'],
      [customPresetPosition, presets],
    );

    const handleConfirmDisabled = () => {
      setIsConfirmDisabledClicked(true);
    };

    const handleConfirmClick = () => {
      if (
        parsedStartDate !== 'Start date' &&
        parsedEndDate !== 'End date' &&
        formattedStartTime &&
        formattedEndTime
      ) {
        const formattedStartDate = dayjs(startingDate).isValid()
          ? dayjs(startingDate).format('DD.MM.YYYY')
          : 'Start date';
        const formattedEndDate = dayjs(endingDate).isValid()
          ? dayjs(endingDate).format('DD.MM.YYYY')
          : 'End date';

        setDateSetValue?.(
          `${formattedStartDate}, ${formattedStartTime} - ${formattedEndDate}, ${formattedEndTime}`,
        );
        setCurrentState('DateSet');
        setIsDateFilterOpen(false);
      }
    };

    const isConfirmClickWithNoStartDate =
      (parsedStartDate === 'Start date' || !formattedStartTime) &&
      isConfirmDisabledClicked;

    const isConfirmClickWithNoEndDate =
      parsedStartDate !== 'Start date' &&
      formattedStartTime &&
      (parsedEndDate === 'End date' || !formattedEndTime) &&
      isConfirmDisabledClicked;

    const disableConfirmButton =
      parsedStartDate === 'Start date' ||
      !formattedStartTime ||
      parsedEndDate === 'End date' ||
      !formattedEndTime;
    function listContainerGenerator() {
      const listContainers = customAddedPresets?.map((preset, index) => (
        <button
          key={preset}
          tabIndex={index}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              presetsClickHandler(preset);
            }
          }}
          type="button"
          onClick={() => {
            // Clear existing date selection when custom is selected
            if (
              preset === 'Custom' &&
              parsedStartDate !== 'Start date' &&
              parsedEndDate !== 'End date'
            ) {
              clearFilter();
            }
            presetsClickHandler(preset);
          }}
          className={`${selectedPreset.preset === preset ? 'bg-fill-action-light' : 'hover:bg-fill-action-lighter-pressed'}  active:text-text-dark-pressed flex h-10 w-full cursor-pointer select-none items-center rounded-lg px-4`}
        >
          <div className="label-medium text-text-text truncate">{preset}</div>
        </button>
      ));

      return listContainers;
    }

    const validStartDate = startingDate
      ? dayjs(startingDate, customDateFormat || 'DD MMM YYYY')
      : undefined;

    const validEndDate = endingDate
      ? dayjs(endingDate, customDateFormat || 'DD MMM YYYY')
      : undefined;

    const disableEndDateTime =
      currentSelection === 'end' &&
      validEndDate?.toString() === validStartDate?.toString()
        ? startTime
        : '';

    const disableStartDateTime =
      currentSelection === 'start' &&
      validEndDate?.toString() === validStartDate?.toString()
        ? endTime
        : '';

    return (
      <div
        data-testid={dataTestId}
        ref={ref}
        className={`${wrapperClassName} relative`}
      >
        <div ref={wrapperRef} className={`${dateSetWrapperClassName} relative`}>
          <button
            ref={buttonRef}
            className={`${dateSetContentClassName} bg-fill-fill hover:bg-fill-hover-light active:!bg-fill-hover-light flex ${size === 'small' ? 'h-10' : 'h-12'}  w-max cursor-pointer items-center rounded-lg border pl-2
              
                ${isDateFilterOpen ? 'border-border-action-focused shadow-border-brand-focus-ring shadow-[0px_0px_0px_4px] ' : 'border-border-border'}
              `}
            onClick={handleDateFilterOpen}
            type="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleDateFilterOpen();
              }
            }}
          >
            {!dateSetValue && <CalendarIcon width={16} height={16} />}
            <div
              className={`paragraph-small text-text-text date-range-label flex h-full select-none items-center font-medium ${dateSetValue ? '' : 'p-2'}`}
            >
              {currentState === 'DateSet' && dateSetValue ? (
                <p className="paragraph-small border-border-border-light flex h-full items-center rounded-lg border-r font-medium">
                  <CalendarIcon width={16} height={16} />
                  <span className="text-text-text border-border-border-light paragraph-small inline-flex h-full items-center justify-center rounded-lg border-r px-2 font-medium">
                    {dateSetValue.split('-')[0]}
                  </span>{' '}
                  <span className="text-text-light px-2">to</span>
                  <span className="paragraph-small text-text-text border-border-border-light inline-flex h-full items-center justify-center rounded-lg border-l px-2 font-medium">
                    {dateSetValue.split('-')[1]}
                  </span>
                </p>
              ) : (
                label || 'Filter by date & time'
              )}
            </div>
            <div className="flex h-full items-center">
              {currentState === 'DateSet' ? (
                <CloseIcon
                  className={`${size === 'small' ? 'h-5 w-5' : 'h-6 w-6'} mx-2`}
                  onClick={(e) => {
                    e.stopPropagation();
                    clearFilter();
                  }}
                />
              ) : null}
            </div>
          </button>
          {isDateFilterOpen && (
            <div
              className={`absolute top-full
      ${alignment === 'left' ? 'left-0' : ''}
      ${alignment === 'center' ? 'left-1/2 -translate-x-1/2' : ''}
      ${alignment === 'right' ? 'right-0' : ''} z-[50] mt-2 flex`}
            >
              <div className="border-border-border-light bg-fill-fill rounded-2xl border">
                <div className="flex items-center gap-4 py-4">
                  <p className="paragraph-medium text-text-text ml-4 font-medium">
                    Period:
                  </p>
                  {isConfirmClickWithNoStartDate ? (
                    <ToolTip
                      iconToolTip={
                        <div
                          className={`${currentSelection === 'start' ? '!bg-fill-fill !border-border-action-focused shadow-border-brand-focus-ring border shadow-[0px_0px_0px_4px]' : ''} bg-fill-fill-dark border-fill-fill-dark flex w-full min-w-full max-w-[14.75rem] flex-1 flex-col items-start gap-1 rounded-xl border p-2
                                    `}
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
                                {formattedStartTime}
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
                      className={`${currentSelection === 'start' ? '!bg-fill-fill !border-border-action-focused shadow-border-brand-focus-ring border shadow-[0px_0px_0px_4px]' : ''} bg-fill-fill-dark border-fill-fill-dark flex w-full min-w-[8.75rem]  flex-col items-start gap-1 rounded-xl border p-2
                                    `}
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
                          className={`${parsedStartDate === 'Set start date' ? 'text-text-action' : 'text-text-text'} paragraph-medium  font-medium`}
                        >
                          {parsedStartDate.toString()}
                        </div>
                      </div>
                      {!hideTimePicker && (
                        <div className="flex flex-row items-center justify-center gap-2">
                          <TimerIcon className="h-4 w-4" />
                          <div
                            className={`${formattedStartTime === 'Set start time' ? 'text-text-action' : 'text-text-text'} paragraph-extra-small font-normal`}
                          >
                            {formattedStartTime}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  {isConfirmClickWithNoEndDate ? (
                    <ToolTip
                      iconToolTip={
                        <div
                          className={`${currentSelection === 'end' ? '!bg-fill-fill !border-border-action-focused shadow-border-brand-focus-ring border shadow-[0px_0px_0px_4px]' : ''} bg-fill-fill-dark border-fill-fill-dark flex w-full min-w-[8.75rem] max-w-[14.75rem] flex-col items-end gap-1 rounded-xl border p-2
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
                            <div className="paragraph-medium text-text-text font-medium">
                              {parsedEndDate.toString()}
                            </div>
                          </div>

                          {!hideTimePicker && (
                            <div className="flex flex-row-reverse items-center gap-2">
                              <TimerIcon className="h-4 w-4" />
                              <div className="paragraph-extra-small text-text-text font-normal">
                                {formattedEndTime}
                              </div>
                            </div>
                          )}
                        </div>
                      }
                      className="w-full"
                      placementToolTip="right-center"
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
                      className={`${currentSelection === 'end' ? '!bg-fill-fill !border-border-action-focused shadow-border-brand-focus-ring border shadow-[0px_0px_0px_4px]' : ''} bg-fill-fill-dark border-fill-fill-dark mr-4 flex w-full min-w-[8.75rem] flex-col items-end gap-1 rounded-xl border p-2
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
                          className={`${parsedEndDate === 'Set end date' ? 'text-text-action' : 'text-text-text'} paragraph-medium font-medium`}
                        >
                          {parsedEndDate.toString()}
                        </div>
                      </div>

                      {!hideTimePicker && (
                        <div className="flex flex-row-reverse items-center gap-2">
                          <TimerIcon className="h-4 w-4" />
                          <div
                            className={`${formattedEndTime === 'Set end time' ? 'text-text-action' : 'text-text-text'} paragraph-extra-small font-normal`}
                          >
                            {formattedEndTime}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div className="border-border-border-light flex border-y">
                  <DateTimePicker
                    type={type}
                    minYear={minYear}
                    maxYear={maxYear}
                    minDate={minDate ? dayjs(minDate) : undefined}
                    maxDate={maxDate ? dayjs(maxDate) : undefined}
                    startingDate={validStartDate}
                    endingDate={validEndDate}
                    disableFuture={disableFuture}
                    currentSelected={currentSelection}
                    currentSelectedTime={
                      currentSelection === 'start' ? startTime : endTime
                    }
                    handleDate={handleCustomDate}
                    handleTime={handleCustomTime}
                    wrapperClassName={`${datePickerWrapperClassName} pt-0 ${hideTimePicker ? 'max-w-80' : ''} min-w-[23.25rem]`}
                    timePickerClassName={timePickerWrapperClassName}
                    hideTimePicker={hideTimePicker}
                    disableSameDateSelection={disableSameDateSelection}
                    isCleared={isCleared}
                    selectedPreset={selectedPreset.preset}
                    maxRange={maxRange}
                    clearFilter={clearFilter}
                    isTimePickerFocused={
                      formattedStartTime === 'Set start time' ||
                      formattedEndTime === 'Set end time'
                    }
                    disableEndDateTime={disableEndDateTime}
                    disableStartDateTime={disableStartDateTime}
                    timePickerOptionsGapInMinutes={
                      timePickerOptionsGapInMinutes
                    }
                  />
                  <div className="border-border-border-light w-40 border-l p-4">
                    {listContainerGenerator()}
                  </div>
                </div>
                <div className="flex justify-end p-4">
                  <Button
                    size="lg"
                    hierarchy="Secondary"
                    type="button"
                    label="Clear"
                    className="!border-border-border label-small mr-4 h-8 w-[3.75rem]"
                    onClick={clearFilter}
                  />
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={handleConfirmDisabled}
                    onKeyDown={handleConfirmDisabled}
                    className={disableConfirmButton ? 'cursor-not-allowed' : ''}
                  >
                    <Button
                      size="lg"
                      hierarchy="Primary"
                      type="button"
                      label="Confirm"
                      className={`${disableConfirmButton ? 'pointer-events-none' : ''} label-small h-8 w-[4.75rem]`}
                      disabled={disableConfirmButton}
                      onClick={handleConfirmClick}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  },
);
