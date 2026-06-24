import React, { forwardRef, useRef } from 'react';
import { InputWithBase, InputWithBaseProps } from './InputWithBase';
import { Label, LabelToolTipProps } from './Label';

export interface InputProps
  extends InputWithBaseProps,
    Partial<LabelToolTipProps> {
  label: string | React.ReactNode;
  labelClassName?: string;
  helperText?: string;
  asteriskPlacement?: 'left' | 'right';
  isMandatory?: boolean;
  showErrorHelperText?: string;
  wrapperClassName?: string;
}

export const TextInput = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      disabled = false,
      error = false,
      label,
      name,
      value,
      placeholder,
      type,
      onBlur,
      onFocus,
      onChange,
      inputClassName,
      inputWrapperClassName,
      labelClassName = '',
      helperText = '',
      asteriskPlacement,
      isMandatory = false,
      showErrorHelperText = '',
      prefixElement,
      suffixElement,
      placementToolTip,
      alwaysShowToolTip,
      contentToolTip,
      renderCustomContentToolTip,
      titleToolTip,
      showLabelInfoIcon,
      classNameToolTip,
      tabIndex,
      wrapperClassName = '',
      iconToolTip,
      ...inputProps
    },
    ref,
  ) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const refCurrent = (ref || inputRef) as React.RefObject<HTMLInputElement>;

    return (
      <div className={`flex w-full flex-col  ${wrapperClassName || ''}`}>
        {label && (
          <Label
            htmlFor={name}
            title={label}
            isMandatory={isMandatory}
            className={labelClassName}
            showLabelInfoIcon={showLabelInfoIcon}
            placementToolTip={placementToolTip}
            alwaysShowToolTip={alwaysShowToolTip}
            contentToolTip={contentToolTip}
            renderCustomContentToolTip={renderCustomContentToolTip}
            titleToolTip={titleToolTip}
            classNameToolTip={classNameToolTip}
            iconToolTip={iconToolTip}
            asteriskPlacement={asteriskPlacement}
          />
        )}
        <InputWithBase
          ref={refCurrent}
          disabled={disabled}
          error={error}
          name={name}
          isMandatory={!label && isMandatory}
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          onBlur={onBlur}
          onFocus={onFocus}
          inputClassName={inputClassName}
          inputWrapperClassName={inputWrapperClassName}
          prefixElement={prefixElement}
          suffixElement={suffixElement}
          tabIndex={tabIndex || 0}
          {...inputProps}
        />
        {(helperText || showErrorHelperText) && (
          <div
            className={`paragraph-extra-small mt-1
              ${showErrorHelperText ? 'text-text-error' : 'text-text-light'}
            `}
          >
            {showErrorHelperText || helperText}
          </div>
        )}
      </div>
    );
  },
);
