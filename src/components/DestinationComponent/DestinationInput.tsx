import React, { useEffect, useState } from 'react';

export interface DestinationInputProps {
  placeholder: string;
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  errorTextClassName?: string;
  errorText?: string;
  showError: boolean;
  prefixElement?: JSX.Element;
  makeFocus: boolean;
  inputId: string;
  inputName: string;
  inputWrapperClassName?: string;
  inputClassName?: string;
}

export const DestinationInput = React.forwardRef<
  HTMLDivElement,
  DestinationInputProps
>(
  (
    {
      placeholder,
      value,
      onChange,
      onFocus,
      errorText,
      showError = false,
      prefixElement,
      makeFocus,
      inputId,
      inputName,
      inputWrapperClassName = '',
      inputClassName = '',
      errorTextClassName = '',
    },
    ref,
  ) => {
    const [text, setText] = useState(value);
    const inputRef = React.useRef<HTMLInputElement>(null);

    useEffect(() => {
      if (makeFocus) {
        inputRef.current?.focus();
      }
    }, [makeFocus]);

    function handleOnChange(e: React.ChangeEvent<HTMLInputElement>) {
      setText(e.target.value);
      onChange!(e);
    }

    const keyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'Enter') {
        inputRef.current?.focus();
      }
    };

    return (
      <div>
        <div
          ref={ref}
          className={`focus-within:border-border-action-focused focus-within:shadow-border-brand-focus-ring relative flex h-[64px] w-[328px] cursor-text items-center rounded-lg border focus-within:shadow-[0px_0px_0px_4px] ${showError ? 'border-border-error-light shadow-surface-error-base-light shadow-[0px_0px_0px_4px]' : 'border-border-border'} ${inputWrapperClassName}`}
          onClick={() => inputRef.current?.focus()}
          role="button"
          onKeyDown={keyDown}
          tabIndex={-3}
        >
          <div className="ml-2">{prefixElement}</div>

          <input
            id={inputId}
            name={inputName}
            ref={inputRef}
            placeholder=""
            value={text}
            onChange={handleOnChange}
            onFocus={onFocus}
            className={` label-large peer ml-4 mt-5 outline-none ${inputClassName}`}
          />
          {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
          <label
            htmlFor={inputId}
            className="text-text-light label-small peer-placeholder-shown:label-large peer-focus:label-small absolute left-[39px] top-2 transition-all peer-placeholder-shown:left-[39px] peer-placeholder-shown:top-5 peer-focus:left-[39px] peer-focus:top-2"
          >
            {placeholder}
          </label>
        </div>
        {errorText && (
          <div
            className={` label-small text-text-error mt-2 ${errorTextClassName}`}
          >
            {errorText}
          </div>
        )}
      </div>
    );
  },
);

export default DestinationInput;
