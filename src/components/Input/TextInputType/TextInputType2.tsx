import React, {
  forwardRef,
  useRef,
  useState,
  isValidElement,
  cloneElement,
  useCallback,
  useEffect,
} from 'react';
import { TextInputTypesBaseProps } from './types';

// eslint-disable-next-line import/prefer-default-export
export const TextInputType2 = forwardRef<
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
      isAutoCompleteEnabled = false,
      onBlur,
      prefixElement,
      helperText = '',
      errorHelperText = '',
      onFocus,
      suffixElement,
      onClick,
      inputWrapperClassName = '',
      autoComplete,
      ...rest
    },
    ref,
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const [labelLeft, setLabelLeft] = useState(0);
    const suffixRef = useRef<HTMLDivElement>(null);

    const [hasInteracted, setHasInteracted] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const effectiveWrapperRef = rest.wrapperRef || wrapperRef;
    const isFloating = disabled ? Boolean(value) : isFocused || Boolean(value);
    const isDefault = !error && !disabled;
    const calculateLabelLeft = useCallback(() => {
      if (!effectiveWrapperRef.current || !inputRef.current) return;

      const wrapperRect = effectiveWrapperRef.current.getBoundingClientRect();
      const inputRect = inputRef.current.getBoundingClientRect();

      const left =
        inputRect.left - wrapperRect.left + inputRef.current.clientLeft;

      setLabelLeft(left);
    }, [effectiveWrapperRef, inputRef]);

    useEffect(() => {
      calculateLabelLeft();

      const resizeObserver = new ResizeObserver(() => {
        calculateLabelLeft();
      });

      if (effectiveWrapperRef.current)
        resizeObserver.observe(effectiveWrapperRef.current);

      if (inputRef.current) resizeObserver.observe(inputRef.current);

      return () => resizeObserver.disconnect();
    }, [prefixElement, calculateLabelLeft, effectiveWrapperRef]);

    const focusOnInputHandler = (
      e: React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>,
    ) => {
      if (e.type === 'click') onClick?.(e as React.MouseEvent<HTMLDivElement>);

      const isTabNotPressed =
        e.type === 'keydown' &&
        (e as React.KeyboardEvent<HTMLDivElement>).key !== 'Tab';

      if (
        (typeof ref === 'function' || !ref) &&
        !(inputRef && inputRef.current)
      ) {
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
      if (readOnly || (disabled && value === '')) {
        setIsFocused(false);
      } else {
        setIsFocused(true);
      }

      onFocus?.();
    };

    const inputBlurHandler = (e: React.FocusEvent<HTMLInputElement>) => {
      if (disabled) return;
      if (wrapperRef.current?.contains(e.relatedTarget as Node)) {
        return;
      }

      setIsFocused(false);
      onBlur?.();
    };

    function withPreventBlur(icon: React.ReactNode) {
      if (!isValidElement<React.HTMLAttributes<HTMLElement>>(icon)) {
        return icon;
      }

      const existingStyle = icon.props.style;
      const existingOnClick = icon.props.onClick;

      if (disabled) {
        return cloneElement(icon, {
          tabIndex: -1,
          'aria-disabled': true,
          onClick: undefined,
          onMouseDown: undefined,
          onKeyDown: undefined,
          style: {
            ...existingStyle,
            pointerEvents: 'none',
          },
        });
      }

      return cloneElement(icon, {
        onClick: (e: React.MouseEvent<HTMLElement>) => {
          existingOnClick?.(e);
          inputRef.current?.focus();
          setHasInteracted(true);
        },
      });
    }

    const getLabelColor = () => {
      if (isFocused && isDefault) return 'text-text-action';

      if (disabled) {
        if (isFloating) return 'text-text-light';

        return 'text-text-disabled';
      }

      return 'text-text-text';
    };

    const inputBorder = () => {
      if (isFilled && disabled) {
        return 'border-border-border-light';
      }
      if (error) {
        return 'border-border-error';
      }

      if (isFocused && !disabled) {
        return 'border-border-action';
      }

      return 'border-border-border';
    };

    const getBackgroundColor = () => {
      if (!isFilled) {
        return 'bg-fill-fill';
      }
      if (error) {
        return 'bg-fill-error-light';
      }
      if (isFocused && !disabled) {
        return 'bg-fill-action-lighter';
      }
      if (disabled) {
        return '!bg-fill-disabled';
      }
      return 'bg-fill-fill-dark';
    };

    const placeholderTextColor = disabled
      ? 'placeholder:!text-text-disabled'
      : 'placeholder:text-text-light';

    const getTransitionClasses = () => {
      if (disabled) {
        return 'transition-none placeholder:opacity-100';
      }
      let classes =
        'placeholder:transition-all placeholder:duration-200 placeholder:ease-[cubic-bezier(0.05,0,0.1,1)]';

      if (label) {
        if (isFocused || value) {
          classes += ' placeholder:opacity-0 placeholder:-translate-y-1.6';
        } else {
          classes += ' placeholder:opacity-100 placeholder:translate-y-0';
        }
      } else if (isFocused || value) {
        classes += ' placeholder:opacity-0';
      } else {
        classes += ' placeholder:opacity-100';
      }

      return classes;
    };

    const handleWrapperMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
      if (inputRef.current?.contains(e.target as Node)) return;
      if (suffixRef.current?.contains(e.target as Node)) return;

      inputRef.current?.focus();
      setHasInteracted(true);
    };

    const getLabelTransitionClasses = () => {
      if (disabled) {
        return 'transition-none';
      }

      if (hasInteracted) {
        return 'transition-all duration-200 ease-out';
      }

      return 'transition-none';
    };

    const renderInput = (
      <input
        ref={inputRef}
        placeholder={placeholder}
        className={`${inputClassName} ${getBackgroundColor()} ${placeholderTextColor} ${label && !isFloating ? 'pt-6' : ''} ${isFocused ? 'caret-text-text' : 'caret-transparent'} label-large  ${disabled ? 'text-text-light cursor-not-allowed' : 'text-text-dark'}  placeholder:label-large  w-full align-top focus:outline-none ${getTransitionClasses()}`}
        name={name}
        value={value}
        readOnly={readOnly || disabled}
        autoComplete={isAutoCompleteEnabled ? 'on' : 'off'}
        type="text"
        onChange={onChange}
        onFocus={inputFocusHandler}
        onBlur={inputBlurHandler}
        id={name}
        data-testid={name}
        {...rest}
      />
    );
    return (
      <div className={`${wrapperClassName} flex flex-col gap-1`}>
        <div
          className={`${inputWrapperClassName} ${inputBorder()} ${getBackgroundColor()} relative flex h-14 w-full items-center gap-4 rounded-lg border px-4 py-1.5 ${disabled ? 'cursor-not-allowed' : ''}`}
          onMouseDown={disabled ? undefined : handleWrapperMouseDown}
          tabIndex={-1}
          ref={wrapperRef}
          onKeyDown={focusOnInputHandler}
          role="textbox"
          aria-label={placeholder}
        >
          {prefixElement && <div className="min-w-6">{prefixElement}</div>}
          {label && (
            <label
              htmlFor={name}
              style={{ left: isFloating ? 16 : labelLeft }}
              className={`
              ${labelClassName}
              label-small pointer-events-none absolute font-medium 
              ${getLabelTransitionClasses()}
 ${isFloating ? ' bg-fill-fill top-[-2px] -translate-y-1/2 px-1' : 'top-[18px] -translate-y-1/2'}
              ${getLabelColor()}
            `}
            >
              {label}
            </label>
          )}

          {renderInput}
          {suffixElement && (
            <div className="min-w-6">{withPreventBlur(suffixElement)}</div>
          )}
        </div>
        {(helperText || errorHelperText) && (
          <div
            className={`label-small px-4
            ${errorHelperText ? 'text-text-error' : 'text-text-light'}
          `}
          >
            {errorHelperText || helperText}
          </div>
        )}
      </div>
    );
  },
);
