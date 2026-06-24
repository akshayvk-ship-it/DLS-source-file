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
    <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="ml-auto shrink-0 text-text-action">
    <path d="M2.5 7L5.5 10L11.5 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/**
 * Filled variant — no outer border, only a bottom border underline.
 * Background colour shifts on focus/error/disabled.
 * Same currency switcher + inline ghost autocomplete as the other variants.
 */
export const CurrencyInputFilled = forwardRef<HTMLInputElement, CurrencyInputProps>(
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
      placeholder = '',
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
    const [hasInteracted, setHasInteracted] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedCurrency, setSelectedCurrency] = useState<CurrencyOption>(
      defaultCurrency ?? currencies[0],
    );
    const inputRef = useRef<HTMLInputElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);

    const isFloating = isFocused || Boolean(value);

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

    const handleWrapperMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
      if (inputRef.current?.contains(e.target as Node)) return;
      e.preventDefault();
      inputRef.current?.focus();
      setHasInteracted(true);
    };

    const getBgClass = () => {
      if (disabled) return 'bg-fill-disabled';
      if (error) return 'bg-fill-error-light-pressed';
      if (isFocused) return 'bg-fill-action-light';
      return 'bg-fill-fill-dark';
    };

    const getBottomBorderClass = () => {
      if (disabled) return 'border-b border-border-disabled';
      if (error) return 'border-b-2 border-border-error';
      if (isFocused) return 'border-b-2 border-border-action-focused';
      return 'border-b border-border-border';
    };

    const getLabelColor = () => {
      if (disabled) return isFloating ? 'text-text-light' : 'text-text-disabled';
      if (error) return 'text-text-error';
      if (isFocused) return 'text-text-action';
      if (isFloating) return 'text-text-text';
      return 'text-text-light';
    };

    const labelTransition = hasInteracted ? 'transition-all duration-200 ease-[cubic-bezier(0.05,0,0.1,1)]' : 'transition-none';

    return (
      <div className={`flex w-full flex-col ${wrapperClassName}`}>
        <div
          ref={wrapperRef}
          className={`${inputWrapperClassName} ${getBgClass()} ${getBottomBorderClass()} relative flex h-14 w-full items-center rounded-t-lg ${disabled ? 'cursor-not-allowed' : ''}`}
          onMouseDown={disabled ? undefined : handleWrapperMouseDown}
          role="textbox"
          aria-label={label ? String(label) : placeholder}
        >
          {/* Symbol */}
          <div
            className={`flex shrink-0 items-end pb-2 pl-4 transition-all duration-200 ${
              isFloating ? 'opacity-100 h-full pt-5' : 'opacity-0 pointer-events-none h-full'
            } ${disabled ? 'text-text-disabled' : 'text-text-dark'}`}
          >
            <span className="label-large select-none font-semibold">{selectedCurrency.symbol}</span>
          </div>

          {/* Floating label + Input */}
          <div className="relative flex min-w-0 flex-1 flex-col pl-3 pr-1 pt-1.5 pb-1.5">
            {label && (
              <label
                htmlFor={name}
                className={`pointer-events-none absolute left-3 ${labelTransition} label-small font-medium ${getLabelColor()} ${
                  isFloating ? 'top-[6px] text-[11px]' : 'top-1/2 -translate-y-1/2 text-sm'
                } ${labelClassName}`}
              >
                {label}
                {isMandatory && <span className="text-text-error ml-0.5">*</span>}
              </label>
            )}

            <div className={`relative flex items-center ${label ? 'mt-4' : ''}`}>
              {ghostText && (
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 flex items-center overflow-hidden"
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
                placeholder={isFocused && !label ? placeholder : ''}
                onChange={onChange}
                readOnly={disabled}
                onFocus={() => {
                  if (!hasInteracted) setHasInteracted(true);
                  setIsFocused(true);
                  onFocus?.();
                }}
                onBlur={(e) => {
                  setIsFocused(false);
                  onBlur?.(e);
                }}
                onKeyDown={handleKeyDown}
                className={`${inputClassName} paragraph-medium w-full bg-transparent ${
                  isFocused ? 'caret-text-text' : 'caret-transparent'
                } focus:outline-none ${
                  disabled ? 'text-text-light cursor-not-allowed' : 'text-text-dark'
                }`}
                data-testid={name}
                autoComplete="off"
              />
            </div>
          </div>

          {/* Currency Selector */}
          <div className="relative flex shrink-0 h-full items-center">
            <div className="h-5 w-px bg-border-border-light mx-0" />
            <button
              type="button"
              onClick={() => !disabled && setIsDropdownOpen((p) => !p)}
              onMouseDown={(e) => e.preventDefault()}
              disabled={disabled}
              className={`flex h-full items-center gap-1.5 px-3 transition-colors rounded-tr-lg ${
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
            className={`paragraph-extra-small mt-1 px-1 ${
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

CurrencyInputFilled.displayName = 'CurrencyInputFilled';
