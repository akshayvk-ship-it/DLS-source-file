import React from 'react';
import dayjs from 'dayjs';
import { Button } from '../Button';
import { generateTime } from './helper';

export interface TimePickerProps {
  onTimeChange?: (selectedTime: string) => void;
  wrapperClassName?: string;
  currentSelectedTime?: string;
  timeBtnClassName?: string;
  disableFutureTime?: boolean;
  isFocused?: boolean;
  disableEndDateTime?: string;
  disableStartDateTime?: string;
  timeOptions?: string[];
}

export const TimePicker = React.forwardRef<HTMLDivElement, TimePickerProps>(
  (
    {
      onTimeChange,
      wrapperClassName = '',
      currentSelectedTime = '',
      timeBtnClassName,
      disableFutureTime = false,
      isFocused = false,
      disableEndDateTime,
      disableStartDateTime,
      timeOptions = undefined,
    },
    ref,
  ) => {
    const timeOptionsList: string[] = timeOptions || generateTime();

    const isActive = '!bg-fill-action !text-text-on-fill';
    const isDefault = 'text-text-text hover:text-fill-action';

    const isTimeDisabled = (time: string) => {
      if (!disableFutureTime) return false;

      const now = dayjs();
      const timeToCheck = dayjs(time, 'HH:mm');

      return timeToCheck.isAfter(now);
    };

    const disableSameDayTimeEndDate = (time: string) => {
      if (!disableEndDateTime) return false;

      const timeToCheck = dayjs(time, 'HH:mm');
      const disableTime = dayjs(disableEndDateTime, 'HH:mm');
      return timeToCheck.isBefore(disableTime);
    };

    const disableSameDayTimeStartDate = (time: string) => {
      if (!disableStartDateTime) return false;

      const timeToCheck = dayjs(time, 'HH:mm');
      const disableTime = dayjs(disableStartDateTime, 'HH:mm');
      return timeToCheck.isAfter(disableTime);
    };

    return (
      <div
        ref={ref}
        className={`${isFocused ? 'bg-fill-action-light border-border-action-focused' : 'bg-fill-fill-dark border-border-border-light'}  hover:bg-fill-action-light hover:border-border-action-focused scroll-hidden max-w-22 w-full overflow-y-auto rounded-lg border px-2 pb-3 pt-1 ${wrapperClassName}`}
      >
        <div className="flex flex-col gap-1.5">
          {timeOptionsList.map((time) => {
            const disabled =
              isTimeDisabled(time) ||
              disableSameDayTimeEndDate(time) ||
              disableSameDayTimeStartDate(time);
            return (
              <Button
                className={`${timeBtnClassName} !paragraph-small w-18 flex h-6 cursor-pointer items-center justify-center !rounded !font-normal ${currentSelectedTime === time ? isActive : isDefault}`}
                key={time}
                hierarchy="Tertiary Button"
                size="md"
                label={time}
                type="button"
                onKeyDown={() => onTimeChange?.(time)}
                onClick={() => onTimeChange?.(time)}
                disabled={disabled}
              />
            );
          })}
        </div>
      </div>
    );
  },
);
