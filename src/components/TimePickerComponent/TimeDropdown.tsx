import { forwardRef, useEffect, useRef, useState } from 'react';
import {
  generateCustomMinutesList,
  generateHours,
  generateMinutes,
  generatePeriods,
} from './timeUtils';

export interface TimeDropdownProps {
  selectedValue?: string;
  onSelect: (value: string) => void;
  onCancel: () => void;
  handleOk: () => void;
  wrapperClassName?: string;
  is24Hour?: boolean;
  timePickerOptionsGapInMinutes?: number;
}

export const TimeDropdown = forwardRef<HTMLDivElement, TimeDropdownProps>(
  (
    {
      selectedValue,
      onSelect,
      onCancel,
      handleOk,
      wrapperClassName = '',
      is24Hour = false,
      timePickerOptionsGapInMinutes,
    },
    ref,
  ) => {
    const [time, period] = selectedValue?.split(' ') ?? [];
    const [hour, minute] = time?.split(':') ?? [];
    const [selectedHour, setSelectedHour] = useState(hour ?? '');
    const [selectedMinute, setSelectedMinute] = useState(minute ?? '');
    const [selectedPeriod, setSelectedPeriod] = useState(period ?? '');

    const hours = generateHours(is24Hour);
    const minutes = timePickerOptionsGapInMinutes
      ? generateCustomMinutesList(timePickerOptionsGapInMinutes)
      : generateMinutes();
    const periods = is24Hour ? [] : generatePeriods();

    const hourRefs = useRef<Record<string, HTMLButtonElement | null>>({});
    const minuteRefs = useRef<Record<string, HTMLButtonElement | null>>({});

    const isActive = '!bg-fill-action !text-text-on-fill !border-none';
    const isDefault =
      'text-text-text hover:text-fill-action hover:bg-fill-action-light';

    useEffect(() => {
      if (!selectedValue) return;

      if (is24Hour) {
        setSelectedHour(hour ?? '');
        setSelectedMinute(minute ?? '');
        setSelectedPeriod('');
        return;
      }

      setSelectedHour(hour ?? '');
      setSelectedMinute(minute ?? '');
      setSelectedPeriod(period ?? '');
    }, [selectedValue, is24Hour, hour, minute, period]);

    useEffect(() => {
      if (!selectedHour && !selectedMinute && !selectedPeriod) return;

      const hourTime = selectedHour || (is24Hour ? '00' : '12');
      const minuteTime = selectedMinute || '00';
      const periodTime = selectedPeriod || 'AM';

      if (is24Hour) {
        if (hourTime && minuteTime) {
          const finalTime = `${hourTime}:${minuteTime}`;
          onSelect(finalTime);
        }
        return;
      }

      if (hourTime && minuteTime && periodTime) {
        const finalTime = `${hourTime}:${minuteTime} ${periodTime}`;
        onSelect(finalTime);
      }
    }, [onSelect, selectedHour, selectedMinute, selectedPeriod, is24Hour]);

    useEffect(() => {
      if (selectedHour && hourRefs.current[selectedHour]) {
        hourRefs.current[selectedHour]?.scrollIntoView({ block: 'center' });
      }
      if (selectedMinute && minuteRefs.current[selectedMinute]) {
        minuteRefs.current[selectedMinute]?.scrollIntoView({ block: 'center' });
      }
    }, [selectedHour, selectedMinute]);

    const handleOkClick = () => {
      if (!selectedHour && !selectedMinute && !selectedPeriod) return;

      handleOk();
    };

    return (
      <div
        className={`${wrapperClassName} bg-fill-fill absolute z-50 mt-2 flex flex-col rounded-xl shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),_0px_1px_2px_0px_rgba(27,32,41,0.06)]`}
      >
        <div ref={ref} className="mt-2 flex h-[14.5rem] w-full">
          <div className="flex w-12 flex-col items-center overflow-y-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {hours.map((currentHour) => (
              <button
                ref={(el) => {
                  hourRefs.current[currentHour] = el;
                }}
                className={`paragraph-small my-0.5 min-h-6 w-8 rounded ${isDefault} ${selectedHour === currentHour ? isActive : ''}`}
                key={currentHour}
                type="button"
                onClick={() => setSelectedHour(currentHour)}
              >
                {currentHour}
              </button>
            ))}
          </div>
          <div
            className={`border-border-border-light flex w-12 flex-col items-center ${is24Hour ? 'border-l' : 'border-x'} overflow-y-auto  [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden`}
          >
            {minutes.map((currentMinute) => (
              <button
                ref={(el) => {
                  minuteRefs.current[currentMinute] = el;
                }}
                className={`paragraph-small my-0.5 min-h-6 w-8 rounded ${isDefault} ${selectedMinute === currentMinute ? isActive : ''}`}
                key={currentMinute}
                type="button"
                onClick={() => setSelectedMinute(currentMinute)}
              >
                {currentMinute}
              </button>
            ))}
          </div>
          {!is24Hour && (
            <div className="flex w-1/3 flex-col items-center">
              {periods.map((currentPeriod) => (
                <button
                  className={`paragraph-small my-0.5 min-h-6 w-8 rounded ${isDefault} ${selectedPeriod === currentPeriod ? isActive : ''}`}
                  key={currentPeriod}
                  type="button"
                  onClick={() => setSelectedPeriod(currentPeriod)}
                >
                  {currentPeriod}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="border-border-border-light flex h-12 items-center justify-between border-t px-4">
          <button
            type="button"
            onClick={onCancel}
            className="label-medium text-text-action font-semibold"
          >
            Clear
          </button>
          <button
            type="button"
            className="label-medium text-text-action font-semibold"
            onClick={handleOkClick}
          >
            Ok
          </button>
        </div>
      </div>
    );
  },
);

TimeDropdown.displayName = 'TimeDropdown';
