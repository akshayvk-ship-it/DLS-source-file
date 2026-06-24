import {
  useState,
  useEffect,
  forwardRef,
  useRef,
  useCallback,
  useMemo,
} from 'react';

import './PriceSlider.css';

export interface Range {
  min: number;
  max: number;
}

export interface PriceSliderProps {
  minValue: number;
  maxValue: number;
  changeMinMax?: (min: number, max: number) => void;
  showMaxValueWithPlus?: boolean;
  colorGradientType?: 'linear' | 'radial';
  minLabel?: string;
  alignThumbsWithInputs?: boolean;
  maxLabel?: string;
  wrapperClassName?: string;
  dataTestId?: string;
  showInfo?: boolean;
  thumbBorderColor?: string;
  initialRange?: Range;
  step?: number;
  currency?: string;
  color: string[];
  allowDecimals?: boolean;
}

export const PriceSlider = forwardRef<HTMLDivElement, PriceSliderProps>(
  (
    {
      minValue,
      maxValue,
      changeMinMax,
      showMaxValueWithPlus = true,
      colorGradientType = 'radial',
      minLabel = 'MIN',
      alignThumbsWithInputs = false,
      maxLabel = 'MAX',
      showInfo,
      initialRange,
      step,
      color,
      currency = '₹',
      wrapperClassName = '',
      dataTestId = 'price-slider-test-id',
      thumbBorderColor,
      allowDecimals,
    },
    ref,
  ) => {
    const effectiveMinValue = allowDecimals ? minValue : Math.round(minValue);
    const effectiveMaxValue = allowDecimals ? maxValue : Math.round(maxValue);
    const [minVal, setMinVal] = useState(effectiveMinValue);
    const [maxVal, setMaxVal] = useState(effectiveMaxValue);
    const [isMaxFocused, setIsMaxFocused] = useState(false);

    const formatCurrency = useCallback(
      (value: number): string => currency + value.toLocaleString('en-IN'),
      [currency],
    );

    const [minInput, setMinInput] = useState(formatCurrency(minVal));
    const [maxInput, setMaxInput] = useState(formatCurrency(maxVal));

    const trackRef = useRef<HTMLDivElement>(null);

    const minGap = step ? (effectiveMaxValue - effectiveMinValue) / step : 1;

    useEffect(() => {
      if (!initialRange) {
        setMinVal(effectiveMinValue);
        setMaxVal(effectiveMaxValue);
        return;
      }

      const newMin =
        initialRange.min < effectiveMinValue
          ? effectiveMinValue
          : initialRange.min;
      const newMax =
        initialRange.max > effectiveMaxValue
          ? effectiveMaxValue
          : initialRange.max;

      setMinVal(newMin);
      setMaxVal(newMax);

      changeMinMax?.(newMin, newMax);
    }, [initialRange, changeMinMax, effectiveMinValue, effectiveMaxValue]);

    const parseValue = (input: string, fallback: number) => {
      let raw = input.replace(/[^0-9.]/g, '');

      if (!raw) return fallback;

      // Ensure only first dot remains
      const firstDot = raw.indexOf('.');
      if (firstDot !== -1) {
        raw =
          raw.slice(0, firstDot + 1) +
          raw.slice(firstDot + 1).replace(/\./g, '');
      }

      if (allowDecimals) {
        const num = Number.parseFloat(raw);
        if (Number.isNaN(num)) return fallback;
        // Limit to 2 decimal places
        return Number(num.toFixed(2));
      }

      const int = parseInt(raw, 10);
      return Number.isNaN(int) ? fallback : int;
    };

    const setSliderTrack = useCallback(() => {
      const trackElement = trackRef?.current;

      if (trackElement) {
        const minPercent =
          ((minVal - effectiveMinValue) /
            (effectiveMaxValue - effectiveMinValue)) *
          100;
        const maxPercent =
          ((maxVal - effectiveMinValue) /
            (effectiveMaxValue - effectiveMinValue)) *
          100;

        trackElement.style.left = `${minPercent}%`;
        trackElement.style.right = `${100 - maxPercent}%`;
      }
    }, [minVal, maxVal, effectiveMinValue, effectiveMaxValue]);

    const slideMin = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value, 10);

        if (!(value >= effectiveMinValue && maxVal - value >= minGap)) return;

        setMinVal(value);
        changeMinMax?.(value, maxVal);
      },
      [effectiveMinValue, maxVal, minGap, changeMinMax],
    );

    const slideMax = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value, 10);

        if (!(value <= effectiveMaxValue && value - minVal >= minGap)) return;

        setMaxVal(value);
        changeMinMax?.(minVal, value);
      },
      [effectiveMaxValue, minVal, minGap, changeMinMax],
    );

    const handleTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
      const track = e.currentTarget;
      const rect = track.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickPercent = (clickX / rect.width) * 100;

      const clickedValue =
        effectiveMinValue +
        ((effectiveMaxValue - effectiveMinValue) * clickPercent) / 100;
      let adjustedValue = Math.round(clickedValue / minGap) * minGap;

      adjustedValue = Math.max(
        effectiveMinValue,
        Math.min(effectiveMaxValue, adjustedValue),
      );

      const minDiff = Math.abs(adjustedValue - minVal);
      const maxDiff = Math.abs(adjustedValue - maxVal);

      if (minDiff < maxDiff && adjustedValue <= maxVal - minGap) {
        setMinVal(adjustedValue);
        changeMinMax?.(adjustedValue, maxVal);
      } else if (adjustedValue >= minVal + minGap) {
        setMaxVal(adjustedValue);
        changeMinMax?.(minVal, adjustedValue);
      }
    };

    const checkIfInvalidInput = (value: string) => {
      const splitText = value.split(currency);
      const regex = allowDecimals ? /^\d*\.?\d{0,2}$/ : /^\d+$/;
      if (
        (!regex.test(
          splitText?.[1]?.replace(/,/g, '').replace('+', '') || '',
        ) &&
          value !== currency &&
          value &&
          !splitText?.[0]?.length) ||
        (splitText?.[0]?.length && !regex.test(splitText?.[0] || ''))
      ) {
        return true;
      }

      return false;
    };

    const unFormatCurrency = (value: string) =>
      Number(
        value.replace(/,/g, '').replace(currency, '').replace('+', '').trim(),
      );

    const handleMinInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (checkIfInvalidInput(e.target.value)) {
        return;
      }

      const numericValue = unFormatCurrency(e.target.value);

      if (numericValue > effectiveMaxValue) {
        return;
      }

      setMinInput(e.target.value);
    };

    const handleMaxInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (checkIfInvalidInput(e.target.value)) {
        return;
      }

      const numericValue = unFormatCurrency(e.target.value);

      if (numericValue < minVal) {
        setMaxInput(minVal.toString());
      }

      setMaxInput(e.target.value);
    };

    const handleMinInputSubmit = () => {
      if (step) return;

      const value = parseValue(minInput, minVal);
      const clamped = Math.min(
        Math.max(value, effectiveMinValue),
        maxVal - minGap,
      );

      setMinInput(formatCurrency(clamped));
      setMinVal(clamped);
      formatCurrency(clamped);
      changeMinMax?.(clamped, maxVal);
    };

    const handleMaxInputSubmit = () => {
      if (step) return;

      const value = parseValue(maxInput, maxVal);
      const clamped = Math.max(
        Math.min(value, effectiveMaxValue),
        minVal + minGap,
      );

      setMaxInput(formatCurrency(clamped));
      setMaxVal(clamped);
      formatCurrency(clamped);
      changeMinMax?.(minVal, clamped);
    };

    const handleMinInputKeyDown = (
      e: React.KeyboardEvent<HTMLInputElement>,
    ) => {
      if (step) return;
      if (e.key === 'Enter') {
        handleMinInputSubmit();
      }
    };

    const handleMinInputBlur = () => {
      if (step) return;
      handleMinInputSubmit();
    };

    const handleMaxInputKeyDown = (
      e: React.KeyboardEvent<HTMLInputElement>,
    ) => {
      if (step) return;
      if (e.key === 'Enter') {
        handleMaxInputSubmit();
      }
    };

    const handleMaxInputBlur = () => {
      if (step) return;
      handleMaxInputSubmit();
    };

    const maxInputValue = useMemo(() => {
      if (isMaxFocused) {
        return maxInput;
      }
      if (maxVal === effectiveMaxValue) {
        return `${maxInput}${showMaxValueWithPlus ? '+' : ''}`;
      }
      return maxInput;
    }, [
      isMaxFocused,
      maxInput,
      maxVal,
      effectiveMaxValue,
      showMaxValueWithPlus,
    ]);

    useEffect(() => {
      setMinInput(formatCurrency(minVal));
    }, [minVal, formatCurrency]);

    useEffect(() => {
      setMaxInput(formatCurrency(maxVal));
    }, [maxVal, formatCurrency]);

    useEffect(() => {
      setSliderTrack();
    }, [setSliderTrack]);

    const generateStepMarks = () => {
      if (!step || step <= 0) return null;

      const range = effectiveMaxValue - effectiveMinValue;
      const stepSize = range / step;
      const marks = [];

      for (let i = 0; i <= step; i += 1) {
        const value = effectiveMinValue + i * stepSize;
        const position = ((value - effectiveMinValue) / range) * 100;

        marks.push(
          <div
            key={`tick-${i}`}
            className="bg-new-fill-darker absolute top-4 h-2 w-[1px] -translate-y-2/4 transform"
            style={{ left: `${position}%` }}
          />,
        );
      }

      return marks;
    };

    const renderRangeInput = (
      value: number,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    ) => (
      <input
        className="slider-input"
        style={
          {
            '--thumb-border-color': thumbBorderColor ?? color[0],
          } as React.CSSProperties
        }
        type="range"
        min={effectiveMinValue}
        max={effectiveMaxValue}
        value={value}
        onChange={onChange}
        step={step ?? 1}
      />
    );

    return (
      <div
        className={`${wrapperClassName} p-4`}
        data-testid={dataTestId}
        ref={ref}
      >
        <div
          className={`${alignThumbsWithInputs ? 'mx-3 w-[calc(100%-24px)]' : 'w-full'} bg-new-fill-dark relative my-4 min-h-2 overflow-visible rounded`}
          onClick={handleTrackClick}
          aria-hidden="true"
        >
          <div
            ref={trackRef}
            className="absolute left-0 right-0 h-full rounded"
            style={{
              background:
                colorGradientType === 'linear'
                  ? `linear-gradient(to right, ${color[0]}, ${color[1]})`
                  : `linear-gradient(to right, ${color[0]}, ${color[1]}, ${color[0]})`,
            }}
          />
          {step && <div>{generateStepMarks()}</div>}
          {renderRangeInput(minVal, slideMin)}
          {renderRangeInput(maxVal, slideMax)}
        </div>

        <div className="flex justify-between">
          <div className="flex flex-col">
            {showInfo && (
              <p className="label-extra-small text-text-light mb-0.5 cursor-default">
                {minLabel}
              </p>
            )}
            <input
              type="text"
              aria-label="Minimum Price"
              value={minInput}
              onKeyDown={handleMinInputKeyDown}
              onChange={handleMinInputChange}
              onBlur={handleMinInputBlur}
              className={`${step ? 'cursor-default' : ''} label-medium text-text-text border-border-border-light w-2/3 rounded-lg border py-2.5 pl-3`}
              min={effectiveMinValue}
              max={maxVal - minGap}
              readOnly={!!step}
            />
          </div>
          <div className="flex flex-col text-right">
            {showInfo && (
              <p className="label-extra-small text-text-light mb-0.5 cursor-default">
                {maxLabel}
              </p>
            )}
            <input
              type="text"
              aria-label="Maximum Price"
              value={maxInputValue}
              onChange={handleMaxInputChange}
              onKeyDown={handleMaxInputKeyDown}
              onFocus={() => setIsMaxFocused(true)}
              onBlur={() => {
                setIsMaxFocused(false);
                handleMaxInputBlur();
              }}
              className={` ${step ? 'cursor-default' : ''} label-medium text-text-text border-border-border-light ml-auto w-2/3 rounded-lg border py-2.5 pr-3 text-right`}
              min={minVal + minGap}
              max={effectiveMaxValue}
              readOnly={!!step}
            />
          </div>
        </div>
      </div>
    );
  },
);
