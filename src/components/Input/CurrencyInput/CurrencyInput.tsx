import React, { forwardRef, useEffect, useMemo, useRef, useState } from 'react';
import { CurrencyInputProps, CurrencyOption, DEFAULT_CURRENCIES } from './types';

const ChevronIcon = ({ open }: { open: boolean }) => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 12 12"
    fill="none"
    className={`shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
  >
    <path
      d="M3 4.5L6 7.5L9 4.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="ml-auto shrink-0 text-text-action">
    <path d="M2.5 7L5.5 10L11.5 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const CurrencyInput = forwardRef<HTMLInputElement, CurrencyInputProps>(
  (
    {
      name,
      value,
      onChange,
      onCurrencyChange,
      currencies = DEFAULT_CURRENCIES,
      defaultCurrency,
      label,
      labelClassName = '',
      placeholder = '0.00',
      helperText = '',
      showErrorHelperText = '',
      error = false,
      disabled = false,
      isMandatory = false,
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
      const match = suggestions.find(
        (s) => s.startsWith(value) && s.length > value.length,
      );
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
      const fullValue = value + ghostText;
      onChange({ target: { value: fullValue, name } } as React.ChangeEvent<HTMLInputElement>);
      onSuggestionAccept?.(fullValue);
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

    const getBorderClass = () => {
      if (disabled) return 'border-border-disabled';
      if (error) return '!border-border-error-light !shadow-surface-error-base-light shadow-[0px_0px_0px_4px]';
      if (isFocused) return '!border-border-action-focused shadow-border-brand-focus-ring shadow-[0px_0px_0px_4px]';
      return 'border-border-border';
    };

    return (
      <div className={`flex w-full flex-col ${wrapperClassName}`}>
        {label && (
          <label
            htmlFor={name}
            className={`label-medium text-text-dark mb-2 flex items-center gap-0.5 font-medium ${labelClassName}`}
          >
            {label}
            {isMandatory && <span className="text-text-error">*</span>}
          </label>
        )}

        <div
          ref={wrapperRef}
          className={`${inputWrapperClassName} relative flex h-12 w-full items-stretch overflow-hidden rounded-lg border ${getBorderClass()} ${disabled ? 'bg-fill-disabled' : 'bg-fill-fill'}`}
        >
          {/* Symbol */}
          <div
            className={`flex shrink-0 items-center border-r border-border-border-light px-3 ${
              disabled ? 'text-text-disabled' : 'text-text-dark'
            }`}
          >
            <span className="label-large select-none font-semibold">{selectedCurrency.symbol}</span>
          </div>

          {/* Input + Ghost */}
          <div className="relative flex min-w-0 flex-1 items-center">
            {ghostText && (
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 flex items-center overflow-hidden px-3"
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
              className={`${inputClassName} paragraph-medium w-full bg-transparent px-3 caret-text-text placeholder:text-text-light focus:outline-none ${
                disabled ? '!text-text-disabled cursor-not-allowed' : 'text-text-dark'
              }`}
              data-testid={name}
              autoComplete="off"
            />
          </div>

          {/* Currency Selector */}
          <div className="relative flex shrink-0 items-stretch">
            <button
              type="button"
              onClick={() => !disabled && setIsDropdownOpen((p) => !p)}
              onMouseDown={(e) => e.preventDefault()}
              disabled={disabled}
              className={`flex h-full items-center gap-1.5 border-l border-border-border-light px-3 transition-colors ${
                disabled
                  ? 'cursor-not-allowed text-text-disabled'
                  : 'cursor-pointer text-text-text hover:bg-fill-hover-light'
              }`}
              aria-label="Select currency"
              aria-expanded={isDropdownOpen}
            >
              <span className="text-base leading-none">{selectedCurrency.flag}</span>
              <span className="label-small font-semibold">{selectedCurrency.code}</span>
              <ChevronIcon open={isDropdownOpen} />
            </button>

            {isDropdownOpen && (
              <ul
                role="listbox"
                className="border-border-border-light bg-fill-fill absolute right-0 top-[calc(100%+6px)] z-50 max-h-60 w-56 overflow-y-auto rounded-lg border p-1 shadow-[0_4px_16px_rgba(27,32,41,0.12)]"
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
                    className={`hover:bg-fill-hover-light active:bg-fill-pressed-dark flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 focus:outline-none ${
                      currency.code === selectedCurrency.code ? 'bg-fill-action-lighter' : ''
                    }`}
                  >
                    <span className="text-lg leading-none">{currency.flag}</span>
                    <div className="flex min-w-0 flex-col">
                      <span className="label-medium text-text-dark font-semibold">{currency.code}</span>
                      <span className="paragraph-extra-small text-text-light truncate">{currency.label}</span>
                    </div>
                    {currency.code === selectedCurrency.code && <CheckIcon />}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {(helperText || showErrorHelperText) && (
          <div
            className={`paragraph-extra-small mt-1 ${
              showErrorHelperText ? 'text-text-error' : 'text-text-light'
            }`}
          >
            {showErrorHelperText || helperText}
          </div>
        )}
      </div>
    );
  },
);

CurrencyInput.displayName = 'CurrencyInput';
