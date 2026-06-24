import React, { forwardRef, useEffect, useMemo, useRef, useState } from 'react';
import { CurrencyInputProps, CurrencyOption, DEFAULT_CURRENCIES } from './types';

const ChevronIcon = ({ open }: { open: boolean }) => (
  <svg
    width="10"
    height="10"
    viewBox="0 0 10 10"
    fill="none"
    className={`shrink-0 transition-transform duration-150 ${open ? 'rotate-180' : ''}`}
  >
    <path d="M2.5 3.75L5 6.25L7.5 3.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CheckIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="ml-auto shrink-0 text-text-action">
    <path d="M2 6L4.5 8.5L10 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CloseIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
    <path d="M9 3L3 9M3 3L9 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

/**
 * Compact pill-style variant — no label, h-10, ideal for tables, filter bars,
 * or inline amount entry. Currency selector on the left, symbol + input on the right.
 */
export const CurrencyInputCompact = forwardRef<HTMLInputElement, CurrencyInputProps>(
  (
    {
      name,
      value,
      onChange,
      onCurrencyChange,
      currencies = DEFAULT_CURRENCIES,
      defaultCurrency,
      placeholder = '0.00',
      error = false,
      disabled = false,
      wrapperClassName = '',
      inputClassName = '',
      inputWrapperClassName = '',
      suggestions = [],
      onSuggestionAccept,
      onBlur,
      onFocus,
    },
    ref,
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedCurrency, setSelectedCurrency] = useState<CurrencyOption>(
      defaultCurrency ?? currencies[0],
    );
    const inputRef = useRef<HTMLInputElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);

    const ghostText = useMemo(() => {
      if (!value || !suggestions.length || !isFocused) return '';
      const match = suggestions.find((s) => s.startsWith(value) && s.length > value.length);
      return match ? match.slice(value.length) : '';
    }, [value, suggestions, isFocused]);

    useEffect(() => {
      const handleOutside = (e: MouseEvent) => {
        if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
          setIsDropdownOpen(false);
        }
      };
      document.addEventListener('mousedown', handleOutside);
      return () => document.removeEventListener('mousedown', handleOutside);
    }, []);

    const acceptSuggestion = () => {
      const full = value + ghostText;
      onChange({ target: { value: full, name } } as React.ChangeEvent<HTMLInputElement>);
      onSuggestionAccept?.(full);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if ((e.key === 'Tab' || e.key === 'ArrowRight') && ghostText) {
        const atEnd = (e.target as HTMLInputElement).selectionStart === value.length;
        if (atEnd) {
          e.preventDefault();
          acceptSuggestion();
        }
      }
    };

    const handleCurrencySelect = (currency: CurrencyOption) => {
      setSelectedCurrency(currency);
      onCurrencyChange?.(currency);
      setIsDropdownOpen(false);
      requestAnimationFrame(() => {
        ((ref as React.RefObject<HTMLInputElement>)?.current ?? inputRef.current)?.focus();
      });
    };

    const handleClear = (e: React.MouseEvent) => {
      e.stopPropagation();
      onChange({ target: { value: '', name } } as React.ChangeEvent<HTMLInputElement>);
      inputRef.current?.focus();
    };

    const getBorderClass = () => {
      if (disabled) return 'border-border-disabled';
      if (error) return 'border-border-error shadow-[0px_0px_0px_3px] !shadow-surface-error-base-light';
      if (isFocused) return 'border-border-action-focused shadow-border-brand-focus-ring shadow-[0px_0px_0px_3px]';
      return 'border-border-border';
    };

    return (
      <div className={`relative inline-flex ${wrapperClassName}`} ref={wrapperRef}>
        <div
          className={`${inputWrapperClassName} flex h-10 items-stretch overflow-hidden rounded-full border ${getBorderClass()} ${
            disabled ? 'bg-fill-disabled' : 'bg-fill-fill'
          }`}
        >
          {/* Currency selector — LEFT side */}
          <div className="relative flex shrink-0 items-stretch">
            <button
              type="button"
              onClick={() => !disabled && setIsDropdownOpen((p) => !p)}
              onMouseDown={(e) => e.preventDefault()}
              disabled={disabled}
              className={`flex h-full items-center gap-1 pl-3 pr-2 transition-colors ${
                disabled
                  ? 'cursor-not-allowed text-text-disabled'
                  : 'cursor-pointer text-text-text hover:bg-fill-hover-light'
              } rounded-l-full`}
              aria-label="Select currency"
              aria-expanded={isDropdownOpen}
            >
              <span className="text-sm leading-none">{selectedCurrency.flag}</span>
              <span className="label-small font-semibold">{selectedCurrency.code}</span>
              <ChevronIcon open={isDropdownOpen} />
            </button>

            {isDropdownOpen && (
              <ul
                role="listbox"
                className="border-border-border-light bg-fill-fill absolute left-0 top-[calc(100%+6px)] z-50 max-h-52 w-52 overflow-y-auto rounded-xl border p-1 shadow-[0_4px_16px_rgba(27,32,41,0.12)]"
              >
                {currencies.map((currency) => (
                  <li
                    key={currency.code}
                    role="option"
                    aria-selected={currency.code === selectedCurrency.code}
                    onClick={() => handleCurrencySelect(currency)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleCurrencySelect(currency);
                      }
                    }}
                    tabIndex={0}
                    className={`hover:bg-fill-hover-light active:bg-fill-pressed-dark flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 focus:outline-none ${
                      currency.code === selectedCurrency.code ? 'bg-fill-action-lighter' : ''
                    }`}
                  >
                    <span className="text-base leading-none">{currency.flag}</span>
                    <div className="flex min-w-0 flex-col">
                      <span className="label-small text-text-dark font-semibold">{currency.code}</span>
                      <span className="paragraph-extra-small text-text-light truncate">{currency.label}</span>
                    </div>
                    {currency.code === selectedCurrency.code && <CheckIcon />}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Divider */}
          <div className="border-border-border-light my-2 border-l" />

          {/* Symbol */}
          <div
            className={`flex shrink-0 items-center pl-2.5 ${
              disabled ? 'text-text-disabled' : 'text-text-dark'
            }`}
          >
            <span className="paragraph-medium select-none font-semibold">{selectedCurrency.symbol}</span>
          </div>

          {/* Input + Ghost */}
          <div className="relative flex min-w-0 items-center">
            {ghostText && (
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 flex items-center overflow-hidden px-2"
              >
                <span className="paragraph-medium select-none whitespace-pre text-transparent">{value}</span>
                <span className="paragraph-medium select-none whitespace-pre text-text-light">{ghostText}</span>
              </div>
            )}
            <input
              ref={ref || inputRef}
              id={name}
              name={name}
              type="text"
              inputMode="decimal"
              value={value}
              placeholder={isFocused ? '' : placeholder}
              onChange={onChange}
              onFocus={() => { setIsFocused(true); onFocus?.(); }}
              onBlur={(e) => { setIsFocused(false); onBlur?.(e); }}
              onKeyDown={handleKeyDown}
              disabled={disabled}
              className={`${inputClassName} paragraph-medium w-28 bg-transparent px-2 caret-text-text placeholder:text-text-light focus:outline-none ${
                disabled ? '!text-text-disabled cursor-not-allowed' : 'text-text-dark'
              }`}
              data-testid={name}
              autoComplete="off"
            />
          </div>

          {/* Clear button */}
          {value && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              onMouseDown={(e) => e.preventDefault()}
              className="text-text-light hover:text-text-text flex shrink-0 items-center pr-3 transition-colors"
              aria-label="Clear value"
            >
              <CloseIcon />
            </button>
          )}

          {/* Right padding when no clear */}
          {(!value || disabled) && <div className="w-3" />}
        </div>
      </div>
    );
  },
);

CurrencyInputCompact.displayName = 'CurrencyInputCompact';
