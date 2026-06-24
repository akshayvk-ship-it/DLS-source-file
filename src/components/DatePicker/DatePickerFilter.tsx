import React, { useEffect, useRef, useState } from 'react';

import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { RadioButton } from '../SelectionControls/RadioButton/RadioButton';
import { DateTimePickerProps, DateTimePicker } from './DateTimePicker';
import { CalendarIcon, TimerIcon } from '../Icons';
import { getLatestValidTimeFromOptions } from './helper';

dayjs.extend(customParseFormat);

export interface DatePickerFilterProps
  extends Omit<
    DateTimePickerProps,
    | 'currentSelected'
    | 'handleCurrentSelection'
    | 'startingDate'
    | 'endingDate'
    | 'isSingleDateSelect'
  > {
  selectedPreset: string;
  presets: Array<string>;
  minYear: number;
  maxYear: number;
  minDate?: dayjs.Dayjs;
  maxDate?: dayjs.Dayjs;
  wrapperClassName?: string;
  onPresetSelect?: (preset: string) => void;
  startingDate?: string;
  endingDate?: string;
  startTime?: string;
  endTime?: string;
  formattedStartTime?: string;
  formattedEndTime?: string;
  dateSetValue?: string;
  customDate?: (startDate?: dayjs.Dayjs, endDate?: dayjs.Dayjs) => void;
  customTime: (time: string, currentSelection: string) => void;
  defaultTime?: (currentSelection: string) => void;
  currentSelected?: string;
  standardTimeValue?: string;
  disableFuture: boolean;
  dataTestId?: string;
  timePickerWrapperClassName?: string;
  datePickerWrapperClassName?: string;
  hideTimePicker?: boolean;
  customDateFormat?: string;
  selectionTypeFlow?: 'dateTime' | 'date';
  disableFutureTime?: boolean;
  customPresetPosition?: 'start' | 'end';
  disableSameDateSelection?: boolean;
  dateContainerClassName?: string;
}

export const DatePickerFilter = React.forwardRef<
  HTMLDivElement,
  DatePickerFilterProps
>(
  (
    {
      selectedPreset,
      presets,
      wrapperClassName = '',
      onPresetSelect = () => {},
      startingDate = '',
      endingDate = '',
      startTime = '',
      endTime = '',
      minYear,
      maxYear,
      minDate,
      maxDate,
      formattedStartTime = '',
      formattedEndTime = '',
      dateSetValue = '',
      customDate = () => {},
      customTime,
      defaultTime,
      disableFutureTime = false,
      currentSelected,
      standardTimeValue = '',
      disableFuture,
      dataTestId = '',
      timePickerWrapperClassName = '',
      datePickerWrapperClassName = '',
      hideTimePicker = false,
      customDateFormat,
      selectionTypeFlow = 'dateTime',
      customPresetPosition = 'start',
      disableSameDateSelection = false,
      dateContainerClassName = 'bg-[linear-gradient(91.74deg,rgba(241,87,1,0.06)_1.74%,rgba(241,87,1,0)_93.28%)]',
      timePickerOptionsGapInMinutes,
    },
    ref,
  ) => {
    const customAddedPresets =
      customPresetPosition === 'start'
        ? ['Custom', ...presets]
        : [...presets, 'Custom'];

    const [currentSelection, setCurrentSelection] = useState<string>(
      currentSelected || 'start',
    );
    const [parsedStartDate, setParsedStartDate] = useState<
      dayjs.Dayjs | string
    >('');
    const [parsedEndDate, setParsedEndDate] = useState<dayjs.Dayjs | string>(
      '',
    );

    const today = dayjs();

    useEffect(() => {
      if (!startingDate) {
        setParsedStartDate('Start date');
        return;
      }

      const parsed = dayjs(startingDate, 'DD MMM YYYY', true);

      if (!parsed.isValid()) {
        setParsedStartDate('Start date');
        return;
      }

      const parseStartDate = parsed.format(customDateFormat || 'DD MMM YYYY');
      setParsedStartDate(parseStartDate);
    }, [startingDate, customDateFormat]);

    useEffect(() => {
      if (!endingDate) {
        setParsedEndDate('End date');
        return;
      }

      const parsed = dayjs(endingDate, 'DD MMM YYYY', true);

      if (!parsed.isValid()) {
        setParsedEndDate('End date');
        return;
      }

      const parseEndDate = parsed.format(customDateFormat || 'DD MMM YYYY');

      setParsedEndDate(parseEndDate);
    }, [endingDate, customDateFormat]);

    const parseDate = (date: string | dayjs.Dayjs | undefined) => {
      if (!date) return undefined;

      if (dayjs.isDayjs(date)) return date.isValid() ? date : undefined;

      if (customDateFormat) {
        const parsed = dayjs(date, customDateFormat);
        if (parsed.isValid()) return parsed;
      }

      const fallback = dayjs(date, 'DD MMM YYYY');
      return fallback.isValid() ? fallback : undefined;
    };

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
        if (startDate && !startTime && defaultTime) {
          defaultTime('start');
        }
        if (endDate && !endTime && defaultTime) {
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
        parseDate(startDate)?.isSame(parseDate(endDate)) &&
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

      if (
        disableFuture &&
        disableFutureTime &&
        currentSelection === 'start' &&
        startDate?.isSame(today, 'day') &&
        startTime &&
        dayjs(startTime, 'HH:mm').isAfter(today)
      ) {
        customTime(getLatestValidTimeFromOptions(), 'start');
      }

      if (
        disableFuture &&
        disableFutureTime &&
        currentSelection === 'end' &&
        endDate?.isSame(today, 'day') &&
        endTime &&
        dayjs(endTime, 'HH:mm').isAfter(today)
      ) {
        customTime(getLatestValidTimeFromOptions(), 'end');
      }
      customDate?.(startDate, endDate);
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

    const startDateDayjs =
      typeof parsedStartDate === 'string' && parsedStartDate !== 'Start date'
        ? dayjs(parsedStartDate, customDateFormat || 'DD MMM YYYY', true)
        : null;

    const endDateDayjs =
      typeof parsedEndDate === 'string' && parsedEndDate !== 'End date'
        ? dayjs(parsedEndDate, customDateFormat || 'DD MMM YYYY', true)
        : null;

    const shouldDisableFutureTime =
      disableFuture &&
      disableFutureTime &&
      currentSelection === 'end' &&
      endDateDayjs?.isSame(today, 'day');

    const shouldDisableFutureTimeStart =
      disableFuture &&
      disableFutureTime &&
      currentSelection === 'start' &&
      startDateDayjs?.isSame(today, 'day');

    const [resetKey, setResetKey] = useState(0);
    const validStartdate = startingDate ? parseDate(startingDate) : undefined;

    const validEnddate = endingDate ? parseDate(endingDate) : undefined;
    const prevStartRef = useRef(validStartdate);
    const prevEndRef = useRef(validEnddate);

    const disableEndDateTime =
      currentSelection === 'end' && validEnddate?.isSame(validStartdate)
        ? startTime
        : '';
    const disableStartDateTime =
      currentSelection === 'start' && validEnddate?.isSame(validStartdate)
        ? endTime
        : '';

    useEffect(() => {
      const hadRange = prevStartRef.current && prevEndRef.current;
      const nowSingle =
        (validStartdate && !validEnddate) || (!validStartdate && validEnddate);

      if (hadRange && nowSingle) {
        setResetKey((k) => k + 1);
      }

      prevStartRef.current = validStartdate;
      prevEndRef.current = validEnddate;
    }, [validStartdate, validEnddate]);

    return (
      <div
        data-testid={dataTestId}
        ref={ref}
        className={`border-border-border-light rounded-2xl border shadow-[0px_0px_4px_0px_rgba(0,15,74,0.07)] ${wrapperClassName} divide-border-border-light divide-y divide-dashed ${hideTimePicker ? 'max-w-[21.75rem]' : 'max-w-[26.5rem]'}`}
      >
        {customAddedPresets.map((preset) => (
          <div key={preset}>
            <RadioButton
              id={preset}
              size="lg"
              value={preset}
              text={preset}
              name="preset"
              checked={selectedPreset === preset}
              labelClassName={`flex-row-reverse justify-between px-4 py-[1.125rem] ${selectedPreset === preset ? '!text-text-action' : ''}`}
              onChange={() => onPresetSelect?.(preset)}
            />
            {preset === selectedPreset && preset !== 'Custom' && (
              <div
                className={`${dateContainerClassName} border-border-brand-focus-ring mb-4 ml-4 mr-4 flex min-w-[18.75rem] flex-col items-start rounded-2xl border p-4`}
              >
                <div
                  className={`${!hideTimePicker ? 'mb-1' : ''} flex flex-row items-center justify-center gap-3`}
                >
                  <CalendarIcon className="[&>*:first-child]:fill-icon-action h-4 w-4" />
                  <div className="paragraph-large text-text-text font-medium">
                    {dateSetValue}
                  </div>
                </div>
                {!hideTimePicker && (
                  <div className="flex flex-row items-center justify-center gap-3">
                    <TimerIcon className="[&>*:first-child]:fill-icon-action h-4 w-4" />
                    <div className="paragraph-extra-small text-text-text font-normal">
                      {standardTimeValue}
                    </div>
                  </div>
                )}
              </div>
            )}
            {preset === selectedPreset && selectedPreset === 'Custom' && (
              <div>
                <div className="flex items-center pt-2">
                  <div
                    className={`${currentSelection === 'start' ? '!bg-fill-fill !border-border-action-focused shadow-border-brand-focus-ring border shadow-[0px_0px_0px_4px]' : ''} bg-fill-fill-dark border-fill-fill-dark mb-2 ml-4 mr-2 flex w-full min-w-[8.75rem] flex-col items-start gap-1 rounded-xl border p-2
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
                      <div className="paragraph-medium text-text-text font-medium">
                        {parsedStartDate.toString()}
                      </div>
                    </div>

                    {!hideTimePicker && (
                      <div className="flex flex-row items-center justify-center gap-2">
                        <TimerIcon className="h-4 w-4" />
                        <div className="paragraph-extra-small text-text-text font-normal">
                          {formattedStartTime || 'Start time'}
                        </div>
                      </div>
                    )}
                  </div>
                  <div
                    className={`${currentSelection === 'end' ? '!bg-fill-fill !border-border-action-focused shadow-border-brand-focus-ring border shadow-[0px_0px_0px_4px]' : ''} bg-fill-fill-dark border-fill-fill-dark mb-2 ml-2 mr-4 flex w-full min-w-[8.75rem] flex-col items-end gap-1 rounded-xl border p-2
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
                          {formattedEndTime || 'End time'}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <DateTimePicker
                  type="Days"
                  key={resetKey}
                  minYear={minYear}
                  maxYear={maxYear}
                  minDate={minDate}
                  maxDate={maxDate}
                  startingDate={validStartdate}
                  endingDate={validEnddate}
                  disableFuture={disableFuture}
                  currentSelected={currentSelection}
                  currentSelectedTime={
                    currentSelection === 'start' ? startTime : endTime
                  }
                  handleDate={handleCustomDate}
                  handleTime={handleCustomTime}
                  wrapperClassName={`${datePickerWrapperClassName} pt-0 ${hideTimePicker ? 'max-w-80' : ''} mb-6 mx-4 mt-2`}
                  timePickerClassName={timePickerWrapperClassName}
                  disableFutureTime={
                    shouldDisableFutureTime || shouldDisableFutureTimeStart
                  }
                  hideTimePicker={hideTimePicker}
                  disableSameDateSelection={disableSameDateSelection}
                  disableEndDateTime={disableEndDateTime}
                  disableStartDateTime={disableStartDateTime}
                  timePickerOptionsGapInMinutes={timePickerOptionsGapInMinutes}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    );
  },
);
