import React, {
  forwardRef,
  InputHTMLAttributes,
  useRef,
  useState,
} from 'react';
import MandatoryAsterisk from './MandatoryAsterisk';

export interface InputWithBaseProps
  extends InputHTMLAttributes<HTMLInputElement> {
  disabled?: boolean;
  error?: boolean;
  placeholder?: string;
  value: string;
  name: string;
  isMandatory?: boolean;
  type: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e?: React.FocusEvent<HTMLInputElement>) => void;
  onFocus?: () => void;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  inputClassName?: string;
  inputWrapperClassName?: string;
  suffixElement?: JSX.Element;
  prefixElement?: JSX.Element;
  suffixClassName?: string;
  prefixClassName?: string;
  animatedPlaceholderElement?: JSX.Element;
  autoComplete?: string;
}

export const InputWithBase = forwardRef<HTMLInputElement, InputWithBaseProps>(
  (
    {
      disabled = false,
      error = false,
      placeholder = '',
      value,
      name,
      type,
      isMandatory = false,
      onChange,
      onFocus,
      readOnly,
      onBlur,
      onClick,
      inputClassName = '',
      inputWrapperClassName = '',
      prefixElement,
      suffixElement,
      suffixClassName = '',
      prefixClassName = '',
      animatedPlaceholderElement,
      autoComplete,
      ...rest
    },
    ref,
  ) => {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const [isFocused, setIsFocused] = useState(false);
    const hasValue = value != null && String(value).length > 0;
    const showMandatoryOverlay = isMandatory && !hasValue && placeholder;

    const nativePlaceholder = showMandatoryOverlay ? '' : placeholder;

    /** This method will run when click of input element wrapper div */
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

        return;
      }

      const currentElement = (
        (ref || inputRef) as React.RefObject<HTMLInputElement>
      ).current;

      if (currentElement && (isTabNotPressed || e.type === 'click')) {
        currentElement.focus();
      }
    };
    /** *** */

    /** Input Element Focus Handler */

    const inputFocusHandler = () => {
      if (readOnly) {
        setIsFocused(false);
      } else {
        setIsFocused(true);
      }

      onFocus?.();
    };
    /** *** */

    /** Input Element Blur Handler */
    const inputBlurHandler = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      onBlur?.(e);
    };
    /** *** */

    const getIconColor = () =>
      disabled ? 'text-icon-disabled' : 'text-icon-icon';

    const renderInput = (
      <input
        type={type}
        className={`${inputClassName} paragraph-medium text-text-text placeholder-text-light w-full align-top focus:outline-none ${disabled ? '!text-text-disabled !placeholder-text-disabled bg-fill-disabled !cursor-not-allowed' : ''}`}
        ref={ref || inputRef}
        placeholder={nativePlaceholder}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        onFocus={inputFocusHandler}
        onBlur={inputBlurHandler}
        id={name}
        data-testid={name}
        autoComplete={autoComplete}
        {...rest}
      />
    );

    const renderPlaceholder = (
      <div className="relative flex-1">
        {renderInput}
        {animatedPlaceholderElement &&
          (value?.length <= 0 ? animatedPlaceholderElement : '')}
        {showMandatoryOverlay && (
          <span
            className={`text-text-light paragraph-medium pointer-events-none absolute inset-0 flex items-center px-0 py-3 ${hasValue ? 'opacity-0' : 'opacity-100'}`}
          >
            <span className="inline-flex items-start">
              {placeholder}
              <MandatoryAsterisk size={5} className="!top-[0.2em]" />
            </span>
          </span>
        )}
      </div>
    );

    return (
      <div
        className={`${inputWrapperClassName} border-border-border ${!readOnly ? 'focus-within:border-border-action-focused focus-within:shadow-border-brand-focus-ring focus-within:shadow-[0px_0px_0px_4px] ' : '!caret-transparent'} relative h-12 rounded-lg border border-solid px-4 py-3 
            ${isFocused && !disabled && !error ? '!border-border-action-focused shadow-border-brand-focus-ring shadow-[0px_0px_0px_4px]' : ''}
            ${disabled ? 'bg-fill-disabled !border-border-disabled  !cursor-not-allowed !shadow-[0px_1px_2px_0px] !shadow-[rgba(27,32,41,0.051)]' : ''}
            ${error ? '!border-border-error-light !shadow-surface-error-base-light shadow-[0px_0px_0px_4px] ' : ''}
            flex items-center hover:cursor-text
          `}
        ref={wrapperRef}
        onClick={focusOnInputHandler}
        tabIndex={-1}
        onKeyDown={focusOnInputHandler}
        role="textbox"
        aria-label={placeholder}
      >
        {prefixElement && (
          <div className={`mr-2 ${getIconColor()} ${prefixClassName}`}>
            {prefixElement}
          </div>
        )}
        {animatedPlaceholderElement || (isMandatory && placeholder)
          ? renderPlaceholder
          : renderInput}
        {suffixElement && (
          <div className={`ml-2 ${getIconColor()} ${suffixClassName}`}>
            {suffixElement}
          </div>
        )}
      </div>
    );
  },
);
