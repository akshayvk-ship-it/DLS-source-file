import React, { useEffect, useRef, useState } from 'react';
import dayjs from 'dayjs';
import { DateRangeProps } from '../DateRange/DateRange';
import { CalendarIcon, ChevronDownIcon, CloseIcon } from '../Icons';
import { DatePickerMonth } from './DatePickerMonth';

type State = 'Default' | 'DateSet';

export interface DateRangeMonthProps
  extends Omit<
    DateRangeProps,
    | 'handleDateSet'
    | 'wrapperClassName'
    | 'type'
    | 'internalStartDate'
    | 'internalEndDate'
    | 'btnLabel'
    | 'resetIcon'
  > {
  label: string;
  size: 'small' | 'large';
  presets: Array<string>;
  minDate?: Date;
  maxDate?: Date;
  state: State;
  dateSetValue?: string;
  onPresetSelect?: (value: string) => void;
  customDateSet: (startDate: Date | null, endDate: Date | null) => void;
  dateSetWrapperClassName?: string;
  dateSetContentClassName?: string;
  dataTestId?: string;
  dateRangeWrapperClassName?: string;
  wrapperClassName?: string;
  resetDateSetValue?: () => void;
  disableSameDateSelection?: boolean;
  hidePresetOptions?: boolean;
  isDoublePanel?: boolean;
}

export const DateRangeMonth = React.forwardRef<
  HTMLDivElement,
  DateRangeMonthProps
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
      customDateSet,
      dateSetWrapperClassName = '',
      dateSetContentClassName = '',
      dataTestId = 'defaultDateRangeFilterTestId',
      disableFuture,
      maxYear,
      minYear,
      defaultMonth,
      defaultYear,
      dateRangeWrapperClassName = '',
      wrapperClassName = '',
      resetDateSetValue,
      disableSameDateSelection = false,
      isSingleDateSelect = false,
      hidePresetOptions = false,
      isDoublePanel = false,
    },
    ref,
  ) => {
    const [isDateFilterOpen, setIsDateFilterOpen] = useState<boolean>(false);
    const [currentState, setCurrentState] = useState<State>(state);
    const [selectedPreset, setSelectedPreset] = useState({
      prev: '',
      preset: 'Custom',
    });

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

    const clearFilter = () => {
      setSelectedPreset({
        prev: selectedPreset.preset,
        preset: 'Custom',
      });
      setCurrentState('Default');
      resetDateSetValue?.();
    };

    const presetsClickHandler = (preset: string) => {
      if (preset === 'Custom') {
        setSelectedPreset((prev) => ({
          prev: prev.prev,
          preset,
        }));
        resetDateSetValue?.();
        setCurrentState('Default');
      } else {
        setSelectedPreset((prev) => ({
          prev: prev.preset,
          preset,
        }));
        handlePresetSelect(preset);
      }
    };

    const handleDateSetHandler = (
      startDate: dayjs.Dayjs | null,
      endDate: dayjs.Dayjs | null,
    ) => {
      if (startDate?.isValid() && endDate?.isValid()) {
        customDateSet(startDate?.toDate(), endDate?.toDate());
        setCurrentState('DateSet');
      }
      setIsDateFilterOpen(false);
    };

    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      function handleClickOutside(event: MouseEvent) {
        if (
          wrapperRef.current &&
          !wrapperRef.current.contains(event.target as Node)
        ) {
          setIsDateFilterOpen(false);
        }
      }
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, []);

    useEffect(() => {
      const handler = () => setAlignment(getAlignment());
      handler();
      window.addEventListener('resize', handler);
      return () => window.removeEventListener('resize', handler);
    }, []);

    return (
      <div
        data-testid={dataTestId}
        ref={ref}
        className={`${wrapperClassName} relative`}
      >
        <div ref={wrapperRef} className={`${dateSetWrapperClassName} relative`}>
          <button
            ref={buttonRef}
            className={`${dateSetContentClassName} bg-fill-fill hover:bg-fill-hover-light active:!bg-fill-hover-light flex ${size === 'small' ? 'h-10' : 'h-12'}  w-max cursor-pointer items-center rounded-lg border pl-4 
              
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
            <CalendarIcon
              className={`${size === 'small' ? 'h-5 w-5' : 'h-6 w-6'}`}
            />
            <div
              className={`${size === 'small' ? 'label-medium' : 'label-large'}  date-range-label text-text-dark flex h-full select-none items-center px-4 py-3 font-semibold`}
            >
              {currentState === 'DateSet' && dateSetValue
                ? dateSetValue
                : label || 'Filter by month & year'}
            </div>
            {currentState === 'DateSet' && dateSetValue ? (
              <CloseIcon
                className="mr-4"
                width={16}
                height={16}
                onClick={() => {
                  clearFilter();
                }}
              />
            ) : null}
            <div
              className={`${size === 'small' ? 'w-10 px-2' : 'px-[0.438rem]'} border-border-border flex h-full items-center border-l `}
            >
              <ChevronDownIcon
                className={`${size === 'small' ? 'h-5 w-5' : 'h-6 w-6'}`}
              />
            </div>
          </button>
          {isDateFilterOpen && (
            <div
              className={`absolute top-full
      ${alignment === 'left' ? 'left-0' : ''}
      ${alignment === 'center' ? 'left-1/2 -translate-x-1/2' : ''}
      ${alignment === 'right' ? 'right-0' : ''} z-[50] mt-2 flex`}
            >
              <DatePickerMonth
                maxYear={maxYear}
                minYear={minYear}
                minDate={minDate}
                maxDate={maxDate}
                type="Months"
                handleConfirmDate={handleDateSetHandler}
                disableFuture={disableFuture}
                defaultMonth={defaultMonth}
                defaultYear={defaultYear}
                wrapperClassName={`${dateRangeWrapperClassName} min-w-[21.25rem]`}
                disableSameDateSelection={disableSameDateSelection}
                selectedPreset={selectedPreset.preset}
                presets={presets}
                onPresetSelect={presetsClickHandler}
                dateSetValue={dateSetValue}
                clearFilter={clearFilter}
                resetDateSetValue={resetDateSetValue}
                isSingleDateSelect={isSingleDateSelect}
                hidePresetOptions={hidePresetOptions}
                isDoublePanel={isDoublePanel}
              />
            </div>
          )}
        </div>
      </div>
    );
  },
);
