import { forwardRef, useEffect, useRef, useState } from 'react';
import { DropdownSearchProps, SearchOption } from './types';
import { ChevronDownIcon } from '../../Icons/General/ChevronDownIcon';
import { CloseOutlineIcon } from '../../Icons';

// eslint-disable-next-line import/prefer-default-export
export const DropdownSearch = forwardRef<HTMLInputElement, DropdownSearchProps>(
  (
    {
      wrapperClassName,
      constantPlaceholder = 'Search by',
      name,
      enableAutoComplete = false,
      fitLabelToContent = false,
      value,
      options: dropdownOptions,
      defaultOption,
      onOptionChange,
      onChange,
      onBlur,
      onFocus,
      onClick,
      dropdownLabelClassName = '',
      inputClassName,
      inputWrapperClassName = '',
      ...rest
    }: DropdownSearchProps,
    ref,
  ) => {
    const internalInputRef = useRef<HTMLInputElement>(null);
    const inputRef = rest.inputRef || internalInputRef;
    const internalWrapperRef = useRef<HTMLDivElement>(null);
    const inputWrapperRef = useRef<HTMLDivElement>(null);

    const wrapperRef = rest.wrapperRef || internalWrapperRef;
    const labelTextRef = useRef<HTMLSpanElement>(null);

    const [shouldTruncate, setShouldTruncate] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const [selectedOption, setSelectedOption] = useState<SearchOption | null>(
      defaultOption ?? dropdownOptions[0] ?? null,
    );
    const [isInvalid, setIsInvalid] = useState(false);
    const [validationMessage, setValidationMessage] = useState<string | null>(
      null,
    );
    const baseShadow =
      'shadow-[0_1px_3px_rgba(0,0,0,0.10),0_1px_2px_rgba(27,32,41,0.06)]';
    const MAX_LABEL_WIDTH = 120;
    const ICON_WIDTH = 16;
    const GAP = 4;
    const PADDING_RIGHT = 16;
    const TOTAL_EXTRA_SPACE = ICON_WIDTH + GAP + PADDING_RIGHT;

    const [labelWidth, setLabelWidth] = useState<number>(MAX_LABEL_WIDTH);
    const [isFocused, setIsFocused] = useState(false);

    const labelRef = useRef<HTMLDivElement>(null);

    const handleDropdownClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      setIsOpen((prev) => !prev);
      inputRef.current?.focus();
    };

    const measureLabelWidth = (text: string) => {
      const span = document.createElement('span');
      span.className =
        'label-large font-medium text-text-text whitespace-nowrap';
      span.style.position = 'absolute';
      span.style.visibility = 'hidden';
      span.textContent = text;

      document.body.appendChild(span);
      const { width } = span.getBoundingClientRect();
      document.body.removeChild(span);

      return width;
    };

    const handleOptionClick = (option: SearchOption) => {
      if (fitLabelToContent && wrapperRef.current) {
        const fieldWidth = wrapperRef.current.getBoundingClientRect().width;

        const textWidth = measureLabelWidth(option.label) + TOTAL_EXTRA_SPACE;

        setShouldTruncate(textWidth > fieldWidth);
        setLabelWidth(Math.min(textWidth, fieldWidth));
      } else {
        setShouldTruncate(true);
      }
      setSelectedOption(option);
      onOptionChange?.(option.value);
      setIsOpen(false);

      requestAnimationFrame(() => {
        inputRef.current?.focus();
      });
    };

    const showErrorUI =
      isFocused && Boolean(value) && isInvalid && Boolean(validationMessage);

    const getStateClasses = () => {
      if (showErrorUI) {
        return `
      border-border-error
      ring-4 ring-[rgba(215,7,76,0.25)] ring-offset-0
    `;
      }

      return `
    border-border-border
    focus-within:border-border-action-focused
    focus-within:ring-4 focus-within:ring-border-brand-focus-ring focus-within:ring-offset-0
  `;
    };
    const handleClearClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();

      onChange?.({
        target: { value: '' },
      } as React.ChangeEvent<HTMLInputElement>);
      setIsInvalid(false);
      setValidationMessage(null);
      inputRef.current?.focus();
    };

    const handleValidatedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setIsOpen(false);
      onChange?.(e);

      const regex = selectedOption?.regex;
      const errorMessage = selectedOption?.errorMessage;

      if (!regex) {
        setIsInvalid(false);
        setValidationMessage(null);
        return;
      }

      if (!regex.test(newValue)) {
        setIsInvalid(true);
        setValidationMessage(errorMessage ?? 'Invalid input');
      } else {
        setIsInvalid(false);
        setValidationMessage(null);
      }
    };

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          wrapperRef.current &&
          !wrapperRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
          setIsFocused(false);
        }
      };

      document.addEventListener('click', handleClickOutside);

      return () => {
        document.removeEventListener('click', handleClickOutside);
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
      setIsInvalid(false);
      setValidationMessage(null);

      if (!fitLabelToContent) {
        setShouldTruncate(true);
      }
    }, [selectedOption, fitLabelToContent]);

    useEffect(() => {
      if (!wrapperRef.current || !dropdownOptions.length) return () => {};

      const wrapper = wrapperRef.current;

      const span = document.createElement('span');
      span.className = 'label-large font-medium whitespace-nowrap';
      span.style.position = 'absolute';
      span.style.visibility = 'hidden';
      document.body.appendChild(span);

      const calculateWidth = () => {
        const fieldWidth = wrapper.getBoundingClientRect().width;
        let finalWidth: number;

        if (fitLabelToContent && labelTextRef.current) {
          const selectedLabelWidth =
            labelTextRef.current.scrollWidth + TOTAL_EXTRA_SPACE;

          finalWidth = Math.min(selectedLabelWidth, fieldWidth);
        } else {
          const maxAllowedLabelWidth = fieldWidth * 0.3;

          const longestTextWidth = Math.max(
            ...dropdownOptions.map((opt) => {
              span.textContent = opt.label;
              return span.getBoundingClientRect().width;
            }),
          );

          const totalRequiredWidth = longestTextWidth + TOTAL_EXTRA_SPACE;

          finalWidth = Math.min(totalRequiredWidth, maxAllowedLabelWidth);
        }

        setLabelWidth(finalWidth);
      };

      calculateWidth();

      const resizeObserver = new ResizeObserver(calculateWidth);
      resizeObserver.observe(wrapper);

      return () => {
        resizeObserver.disconnect();
        document.body.removeChild(span);
      };
    }, [
      selectedOption,
      dropdownOptions,
      fitLabelToContent,
      TOTAL_EXTRA_SPACE,
      wrapperRef,
    ]);

    const handleInputFocus = () => {
      setIsOpen(false);
      setIsFocused(true);

      if (value && selectedOption?.regex) {
        if (!selectedOption.regex.test(value)) {
          setIsInvalid(true);
          setValidationMessage(selectedOption.errorMessage ?? 'Invalid input');
        }
      }
      onFocus?.();
    };

    const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      onBlur?.(e);
    };

    const handleInputClick = (e: React.MouseEvent<HTMLInputElement>) => {
      setIsOpen(false);
      onFocus?.();
      onClick?.(e);
    };

    const handleWrapperMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
      if (inputRef.current?.contains(e.target as Node)) {
        return;
      }

      e.preventDefault();
      inputRef.current?.focus();
    };

    const getPlaceholder = () => {
      if (selectedOption?.placeholder) {
        return selectedOption.placeholder;
      }
      return `${constantPlaceholder} ${selectedOption?.label}`;
    };

    const showClearIcon = Boolean(value && value.length > 0);

    const errorTooltip = (
      <div
        role="tooltip"
        style={{
          maxWidth: `${wrapperRef.current?.getBoundingClientRect().width}px`,
        }}
        className="
      bg-fill-error
      text-text-on-fill
      label-small               
      absolute        
      bottom-full
      left-1/2
      z-50                   
      mb-4           
      w-max
      -translate-x-1/2
      whitespace-normal
      break-words
      rounded-md
      p-2        
      font-medium
    "
      >
        {validationMessage}

        <span
          className="
        bg-fill-error
        absolute
        bottom-[-5px]               
        left-1/2
        h-3
        w-3
        -translate-x-1/2
        rotate-45
      "
        />
      </div>
    );

    const renderInput = (
      <div
        className={`relative min-w-0 flex-1 ${inputWrapperClassName}`}
        ref={inputWrapperRef}
      >
        <input
          type="text"
          className={`${inputClassName} paragraph-medium text-text-text placeholder-text-light placeholder:label-large w-full min-w-0 pr-10 align-top focus:outline-none`}
          ref={ref || inputRef}
          placeholder={getPlaceholder()}
          name={name}
          autoComplete={enableAutoComplete ? 'on' : 'off'}
          value={value}
          onBlur={handleInputBlur}
          onFocus={handleInputFocus}
          onClick={handleInputClick}
          onChange={handleValidatedChange}
          id={name}
          {...rest}
        />
        {showClearIcon && (
          <button
            type="button"
            onClick={handleClearClick}
            className="text-text-light hover:text-text-text absolute right-0 top-1/2 -translate-y-1/2"
          >
            <CloseOutlineIcon className="!h-7 !w-7" />
          </button>
        )}
      </div>
    );

    const renderDropdownMenu = (
      <ul
        className="
      border-border-border-light
      bg-fill-fill
      absolute
      left-0
      z-50
      mt-2
      max-h-56
      w-max
      min-w-[13.375rem]
      max-w-full
      overflow-y-auto
      rounded-lg
      border
      p-2
      shadow-[0_1px_3px_rgba(0,0,0,0.10),_0_1px_2px_rgba(27,32,41,0.06)]
    "
      >
        {dropdownOptions.map((option) => {
          const isSelected = option.value === selectedOption?.value;
          return (
            <div
              key={option.value}
              onClick={() => handleOptionClick(option)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleOptionClick(option);
                }
              }}
              tabIndex={-1}
              role="button"
              className={`
            active:bg-fill-pressed-dark
            hover:bg-fill-hover-light
            text-text-text
            label-medium
            cursor-pointer
          whitespace-nowrap
          rounded-lg
          px-4
          py-2
          ${isSelected ? 'bg-fill-pressed-dark' : ''}
              `}
            >
              {option.label}
            </div>
          );
        })}
      </ul>
    );

    const renderDropdownLabel = (
      <div
        ref={labelRef}
        onClick={handleDropdownClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleDropdownClick(e as unknown as React.MouseEvent);
          }
        }}
        role="button"
        onMouseDown={(e) => e.preventDefault()}
        tabIndex={0}
        style={{
          width: `${labelWidth}px`,
          minWidth: fitLabelToContent ? 'auto' : '7.5rem',
        }}
        className={`
          border-border-border-light 
          flex
          h-full
          shrink-0
          items-center
          gap-1
          border-r
          pr-4
          focus-within:outline-none
        ${dropdownLabelClassName}`}
      >
        <span
          ref={labelTextRef}
          className={`
            label-large
            text-text-text
            min-w-0
            flex-auto
            ${shouldTruncate ? 'overflow-hidden text-ellipsis' : ''}
            whitespace-nowrap
            font-medium
          `}
          title={shouldTruncate ? selectedOption?.label : undefined}
        >
          {selectedOption?.label ?? 'label'}
        </span>

        <ChevronDownIcon
          className={`*:fill-icon-icon duration-20 !h-4 !w-4 shrink-0
    transition-transform
    ease-in-out ${isOpen ? 'rotate-180' : 'rotate-0'}`}
        />
      </div>
    );

    const dropdownSearchComponent = (
      <>
        <div
          className={`
        bg-fill-fill ${getStateClasses()} ${baseShadow}  flex h-12 w-full
        min-w-[25.25rem] gap-4 rounded-lg border
        px-4
        py-3
      `}
          onMouseDown={handleWrapperMouseDown}
          role="textbox"
          aria-label={constantPlaceholder}
          tabIndex={-1}
        >
          {renderDropdownLabel}
          {renderInput}
        </div>
        {isOpen && renderDropdownMenu}
      </>
    );

    return (
      <div className={`relative w-full ${wrapperClassName}`} ref={wrapperRef}>
        {dropdownSearchComponent}
        {showErrorUI && errorTooltip}
      </div>
    );
  },
);
