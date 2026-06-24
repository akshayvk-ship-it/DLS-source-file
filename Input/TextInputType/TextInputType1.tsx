import { forwardRef, useRef, useState } from 'react';
import { TextInputTypesBaseProps } from './types';

// eslint-disable-next-line import/prefer-default-export
export const TextInputType1 = forwardRef<
  HTMLInputElement,
  TextInputTypesBaseProps
>(
  (
    {
      placeholder,
      value,
      wrapperClassName = '',
      name,
      isFilled = false,
      error = false,
      disabled = false,
      label,
      labelClassName = '',
      readOnly = false,
      onChange,
      inputClassName,
      onBlur,
      helperText = '',
      errorHelperText = '',
      onFocus,
      suffixElement,
      onClick,
      inputWrapperClassName = '',
      autoComplete,
      wrapperRef,
      isAutoCompleteEnabled = false,
      ...rest
    },
    ref,
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const [hasInteracted, setHasInteracted] = useState(false);
    const innerWrapperRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const isDefault = !error && !disabled;

    const effectiveWrapperRef = wrapperRef || innerWrapperRef;

    const focusOnInputHandler = (
      e: React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>,
    ) => {
      if (e.type === 'click') onClick?.(e as React.MouseEvent<HTMLDivElement>);

      const isTabNotPressed =
        e.type === 'keydown' &&
        (e as React.KeyboardEvent<HTMLDivElement>).key !== 'Tab';

      if ((typeof ref === 'function' || !ref) && !inputRef?.current) {
        const element = e.target as HTMLDivElement;
        let inputElement = null;

        element.childNodes.forEach((item) => {
          if (item.nodeName.toLowerCase() === 'input') {
            inputElement = item;
          }
        });

        if (inputElement && (isTabNotPressed || e.type === 'click'))
          (inputElement as unknown as HTMLInputElement).focus();
        if (!hasInteracted) setHasInteracted(true);

        return;
      }

      const currentElement = (
        (ref || inputRef) as React.RefObject<HTMLInputElement>
      ).current;

      if (currentElement && (isTabNotPressed || e.type === 'click')) {
        currentElement.focus();
      }
    };

    const inputFocusHandler = () => {
      if (!hasInteracted) setHasInteracted(true);
      if (readOnly) {
        setIsFocused(false);
      } else {
        setIsFocused(true);
      }

      onFocus?.();
    };

    const inputBlurHandler = (e: React.FocusEvent<HTMLInputElement>) => {
      if (effectiveWrapperRef.current?.contains(e.relatedTarget as Node)) {
        return;
      }

      setIsFocused(false);
      onBlur?.();
    };

    const getLabelColor = () => {
      if (isFocused && isDefault) return 'text-text-action';

      if (disabled) {
        return 'text-text-disabled';
      }

      return 'text-text-text';
    };

    const inputBorder = () => {
      if ((isFilled && disabled) || disabled) {
        return 'border-border-disabled';
      }
      if (error) {
        return 'border-border-error';
      }

      if (isFocused && !disabled) {
        return 'border-border-action';
      }

      return 'border-border-dark';
    };

    const getBackgroundColor = () => {
      if (!isFilled) {
        return 'bg-fill-fill';
      }
      if (disabled) {
        return 'bg-fill-disabled';
      }

      if (error) {
        return 'bg-fill-error-light-pressed';
      }
      if (isFocused && !disabled) {
        return 'bg-fill-action-light';
      }

      return 'bg-fill-fill-dark';
    };

    const placeholderTextColor = disabled
      ? 'placeholder:!text-text-disabled'
      : 'placeholder:text-text-light';

    const getTransitionClasses = () => {
      let classes =
        'placeholder:transition-opacity placeholder:duration-200 placeholder:ease-out';

      if (isFocused || value) {
        classes += ' placeholder:opacity-0';
      } else {
        classes += ' placeholder:opacity-100';
      }

      return classes;
    };

    const getHelperTextColor = () => {
      if (disabled) {
        return 'text-text-disabled';
      }
      if (errorHelperText) {
        return 'text-text-error';
      }

      return 'text-text-light';
    };

    const renderInput = (
      <input
        ref={inputRef}
        placeholder={placeholder}
        className={`${inputClassName} ${getBackgroundColor()} ${placeholderTextColor} ${isFocused ? 'caret-text-text' : 'caret-transparent'} label-large  ${disabled ? 'text-text-light cursor-not-allowed bg-transparent' : 'text-text-dark'}  placeholder:label-large  w-full ${label ? 'pb-1.5 pt-6' : 'pb-3 pt-4'} rounded-t-lg px-4 align-top focus:outline-none ${getTransitionClasses()}`}
        name={name}
        value={value}
        readOnly={readOnly}
        autoComplete={isAutoCompleteEnabled ? 'on' : 'off'}
        type="text"
        onChange={onChange}
        onFocus={inputFocusHandler}
        onBlur={inputBlurHandler}
        id={name}
        data-testid={name}
        disabled={disabled}
        tabIndex={0}
        {...rest}
      />
    );
    return (
      <div className={`${wrapperClassName} flex flex-col gap-1`}>
        <div
          className={`${inputWrapperClassName} ${inputBorder()} ${getBackgroundColor()} ${disabled ? '[&_svg>path]:fill-icon-disabled cursor-not-allowed' : ''}  ${isFocused ? 'border-b-2' : 'border-b'} relative flex h-14 w-full items-center rounded-t-lg `}
          onClick={focusOnInputHandler}
          tabIndex={-1}
          ref={effectiveWrapperRef}
          onKeyDown={focusOnInputHandler}
          role="textbox"
          aria-label={placeholder}
        >
          {label && (
            <label
              htmlFor={name}
              className={`
              ${labelClassName}
              label-small pointer-events-none absolute top-1.5 pl-4 font-medium
              ${getLabelColor()}
            `}
            >
              {label}
            </label>
          )}
          {renderInput}
          {suffixElement && <div className="mr-4 min-w-6">{suffixElement}</div>}
        </div>
        {(helperText || errorHelperText) && (
          <div
            className={`label-small px-4
            ${getHelperTextColor()}
          `}
          >
            {errorHelperText || helperText}
          </div>
        )}
      </div>
    );
  },
);
