/* eslint-disable react/no-array-index-key */
import React, { useEffect, useState, useRef, forwardRef } from 'react';
import './index.css';
import {
  determineDirection,
  difference,
  formatNumberWithCommas,
  parseStringValue,
} from './helper';

export interface TickerProps {
  endValue: number | string;
  startValue?: number;
  duration?: number;
  prefix?: string;
  wrapperClassName?: string;
}

export const Ticker = forwardRef<HTMLSpanElement, TickerProps>(
  ({
    startValue = 0,
    endValue,
    duration = 1000,
    prefix = '',
    wrapperClassName = '',
  }: TickerProps) => {
    const [hasMounted, setHasMounted] = useState(false);
    const [isReadyToAnimate, setIsReadyToAnimate] = useState(false);

    const timeoutRef = useRef<number>();
    const elementRef = useRef<HTMLSpanElement>(null);
    const heightRef = useRef<number>(0);

    const { numericValue: parsedEndValue, staticSuffix: parsedSuffix } =
      parseStringValue(endValue);
    const finalEndValue =
      typeof endValue === 'string' && Number.isNaN(Number(endValue))
        ? parsedEndValue
        : endValue;

    const formattedStartValue = formatNumberWithCommas(startValue);
    const formattedEndValue = formatNumberWithCommas(finalEndValue);

    const startValueArray = Array.from(String(formattedStartValue), String);
    const endValueArray = Array.from(String(formattedEndValue), String);

    const isEndValueZero =
      (typeof finalEndValue === 'number' && finalEndValue === 0) ||
      (typeof finalEndValue === 'string' && finalEndValue === '0');

    // Skip animation when end value is zero
    const diff = !isEndValueZero
      ? difference(startValueArray, endValueArray, {
          prefix: prefix || undefined,
          suffix: parsedSuffix || undefined,
        })
      : null;

    const tickerTextClass = 'display-x-small text-text-dark font-semibold';

    useEffect(() => {
      let timer: number;
      if (hasMounted) {
        setIsReadyToAnimate(true);
      } else {
        timer = requestAnimationFrame(() => {
          const el = elementRef.current;
          if (el) {
            heightRef.current = el.offsetHeight;
          }
          setHasMounted(true);
        });
      }

      return () => {
        if (timer) clearTimeout(timer);
      };
    }, [endValue, hasMounted]);

    useEffect(() => {
      if (isReadyToAnimate) {
        timeoutRef.current = window.setTimeout(() => {
          setIsReadyToAnimate(false);
        }, duration);
      }

      return () => {
        if (timeoutRef.current) {
          window.clearTimeout(timeoutRef.current);
        }
      };
    }, [isReadyToAnimate, duration]);

    if (!diff || (Array.isArray(diff) && diff.length === 0)) {
      return (
        <span
          className={`mx-auto leading-none ${tickerTextClass} ${wrapperClassName}`}
        >
          {prefix}
          {formattedEndValue}
          {parsedSuffix}
        </span>
      );
    }

    return (
      <div
        className={`relative mx-auto flex justify-end overflow-hidden ${tickerTextClass} ${wrapperClassName}`}
        style={
          {
            height: `${heightRef.current}px`,
            '--duration': `${duration}ms`,
          } as React.CSSProperties & { '--duration': string }
        }
      >
        {diff?.map((array, i) => {
          if (!array?.length) {
            return null;
          }

          const isPrefix = i === 0 && prefix && array.includes(prefix);
          const isSuffix =
            i === diff.length - 1 &&
            parsedSuffix &&
            array.includes(parsedSuffix);

          const isAffix = isPrefix || isSuffix;

          const direction = determineDirection(
            array[0] ?? '',
            array[array.length - 1] ?? '',
          );

          const animateTypeCss =
            direction === 'dec'
              ? 'ticker-decrease bottom-0 translate-y-0 flex-col'
              : 'flex-col';

          const isStaticValue = array.includes(',') || array.includes('.');

          return (
            <span
              key={i}
              className={`flex flex-col items-center leading-none ${
                isAffix ? 'ticker-affix' : ''
              }
              ${!isStaticValue ? 'min-w-[1ch]' : ''}  
              `}
            >
              {isReadyToAnimate ? (
                <span
                  className={`relative flex items-center ${
                    direction === 'inc'
                      ? 'ticker-increase top-full -translate-y-full flex-col-reverse'
                      : animateTypeCss
                  }`}
                >
                  {array.map((item, index) => (
                    <span key={`${item}-${i}-${index}`}>{item}</span>
                  ))}
                </span>
              ) : (
                <span className="leading-none">{array[array.length - 1]}</span>
              )}
            </span>
          );
        })}
        <span
          ref={elementRef}
          className="pointer-events-none absolute leading-none opacity-0"
          style={{ visibility: 'hidden' }}
        >
          {prefix}
          {formattedEndValue}
          {parsedSuffix}
        </span>
      </div>
    );
  },
);
