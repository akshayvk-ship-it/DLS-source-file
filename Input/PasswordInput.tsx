import React, { forwardRef, useRef, useState } from 'react';
import { InputWithBase, InputWithBaseProps } from './InputWithBase';

import EyeIcon from '../../icons/eyeIcon';
import EyeHideIcon from '../../icons/eyeHideIcon';
import PasswordStrengthChecker from './PasswordStrengthChecker';
import { Label, LabelToolTipProps } from './Label';

export interface PasswordInputProps
  extends Omit<InputWithBaseProps, 'type'>,
    LabelToolTipProps {
  label: string | React.ReactNode;
  labelClassName?: string;
  helperText?: string;
  showErrorHelperText?: string;
  isShowTextActive?: boolean;
  customStrengthChecker?: JSX.Element;
  showPasswordStrength?: boolean;
  suffixTabIndex?: number;
  wrapperClassName?: string;
  suffixIconsWrapperClassName?: string;
  suffixIconProps?: React.SVGAttributes<HTMLOrSVGElement>;
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  (
    {
      disabled = false,
      error = false,
      label,
      name,
      value,
      placeholder,
      onBlur,
      onFocus,
      onChange,
      inputClassName = '',
      inputWrapperClassName = '',
      labelClassName = '',
      helperText = '',
      showErrorHelperText = '',
      isShowTextActive,
      customStrengthChecker,
      showPasswordStrength = false,
      placementToolTip,
      alwaysShowToolTip,
      contentToolTip,
      renderCustomContentToolTip,
      titleToolTip,
      showLabelInfoIcon,
      classNameToolTip,
      tabIndex,
      suffixTabIndex = 0,
      wrapperClassName = '',
      suffixIconsWrapperClassName = '',
      suffixIconProps = {},
      ...passwordInputProps
    },
    ref,
  ) => {
    const [showInputText, setShowInputText] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const refCurrent = (ref || inputRef) as React.RefObject<HTMLInputElement>;

    const eyeIconHandler = () => {
      setShowInputText(!showInputText);
    };

    const onKeyDownHandler = (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'Enter') {
        setShowInputText(!showInputText);
      }

      e.stopPropagation();
    };

    const renderSuffixIcon = (
      <div
        onClick={eyeIconHandler}
        onKeyDown={onKeyDownHandler}
        tabIndex={suffixTabIndex}
        role="button"
        className={`${suffixIconsWrapperClassName}`}
      >
        {showInputText || isShowTextActive ? (
          <EyeIcon {...suffixIconProps} />
        ) : (
          <EyeHideIcon {...suffixIconProps} />
        )}
      </div>
    );

    return (
      <div className={`flex w-full flex-col ${wrapperClassName || ''}`}>
        {label && (
          <Label
            htmlFor={name}
            title={label}
            className={labelClassName}
            showLabelInfoIcon={showLabelInfoIcon}
            placementToolTip={placementToolTip}
            alwaysShowToolTip={alwaysShowToolTip}
            contentToolTip={contentToolTip}
            renderCustomContentToolTip={renderCustomContentToolTip}
            titleToolTip={titleToolTip}
            classNameToolTip={classNameToolTip}
          />
        )}
        <InputWithBase
          ref={refCurrent}
          disabled={disabled}
          error={error}
          name={name}
          type={showInputText || isShowTextActive ? 'text' : 'password'}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          onBlur={onBlur}
          onFocus={onFocus}
          inputClassName={inputClassName}
          inputWrapperClassName={inputWrapperClassName}
          suffixElement={renderSuffixIcon}
          tabIndex={tabIndex || 0}
          suffixClassName="cursor-pointer"
          {...passwordInputProps}
        />
        {showPasswordStrength ? (
          <div className="mt-2">
            {customStrengthChecker || (
              <PasswordStrengthChecker value={value || ''} />
            )}
          </div>
        ) : (
          ''
        )}

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
