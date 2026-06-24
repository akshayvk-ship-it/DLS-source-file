import { forwardRef, useState } from 'react';
import { getColorStyles, getSizeStyles, SizeType } from './helper';

export interface TogglesProps {
  checked: boolean;
  onChange: (value: boolean) => void;
  label?: string;
  text?: boolean;
  disabled?: boolean;
  size?: SizeType;
  className?: string;
  name: string;
  labelClassName?: string;
  dataTestId?: string;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  customToggleContent?: JSX.Element;
}

export const Toggle = forwardRef<HTMLInputElement, TogglesProps>(
  (
    {
      checked,
      onChange,
      label = '',
      text = false,
      size = 'large',
      disabled = false,
      className = '',
      name,
      labelClassName = '',
      dataTestId = 'toggle-checkbox',
      onFocus,
      onBlur,
      customToggleContent,
    },
    ref,
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const color = getColorStyles(checked, disabled);
    const sizeStyles = getSizeStyles(size, checked);
    const checkedText = checked ? 'On' : 'Off';

    const focusHandler = (e: React.FocusEvent<HTMLInputElement>) => {
      onFocus?.(e);
      setIsFocused(true);
    };

    const blurHandler = (e: React.FocusEvent<HTMLInputElement>) => {
      onBlur?.(e);
      setIsFocused(false);
    };

    return (
      <div className={`${className} relative flex h-2.5 items-center`}>
        <input
          ref={ref}
          type="checkbox"
          name={name}
          id={name}
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          onFocus={focusHandler}
          onBlur={blurHandler}
          className="absolute left-0 top-0 !h-0 !w-0 !max-w-0 !border-0 opacity-0"
          tabIndex={0}
          data-testid={dataTestId}
        />
        <label htmlFor={name} className="flex items-center">
          <div
            className={`
              relative bottom-0 top-0 cursor-pointer rounded-full border before:absolute before:bottom-1/2 before:z-10 before:flex-shrink-0 before:translate-y-1/2  before:rounded-full before:transition-all before:duration-300 before:ease-in-out active:transition-shadow active:before:scale-75 
              ${color.border}
              ${sizeStyles}              
              ${isFocused ? `!shadow-[0px_0px_0px_4px] ${color.focusBefore}` : ''}
              ${disabled ? '!cursor-default' : ''}
            `}
          >
            {customToggleContent}
            {!customToggleContent && text ? (
              <p
                className={`
                  label-extra-small absolute top-1/2 -translate-y-1/2 translate-x-0 font-semibold transition-all duration-200 ease-in-out
                  ${color.withLabel}
                  ${size === 'small' ? '!text-[0.5rem]' : ''}
                  ${checked ? `left-1` : ` right-1`}                  
                `}
              >
                {checkedText}
              </p>
            ) : (
              ''
            )}
          </div>
          <p
            className={`${labelClassName} label-medium ml-2 font-medium ${color.label}`}
          >
            {label}
          </p>
        </label>
      </div>
    );
  },
);
