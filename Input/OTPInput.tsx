import React, { forwardRef, useEffect, useRef, useState } from 'react';
import { InputWithBase, InputWithBaseProps } from './InputWithBase';
import { Label, LabelToolTipProps } from './Label';

type InputBaseProps = Omit<InputWithBaseProps, 'onChange'>;

export interface OTPInputProps extends LabelToolTipProps, InputBaseProps {
  /** The primary label displayed above the OTP input fields. */
  label: string | React.ReactNode;
  /** Additional CSS classes for the label element. */
  labelClassName?: string;
  /** Informational helper text displayed below the OTP inputs. */
  helperText?: string;
  /** Error helper text displayed below the OTP inputs. Takes precedence over `helperText`. */
  showErrorHelperText?: string;
  /** The number of individual OTP input boxes to render. @default 6 */
  otpInputSize?: number;
  /** Callback fired when the complete or partial OTP value changes. */
  onChangeOTP: (value: string) => void;
  /**
   * Callback to provide a reset state function to the parent component.
   * Useful for clearing the input externally.
   */
  resetOTP?: (
    setOTPInput: (value: React.SetStateAction<string[]>) => void,
  ) => void;
  /** Unique name attribute prefix for the individual OTP input fields. */
  name: string;
  /** The current combined value of the OTP inputs. */
  value: string;
  /** Additional CSS classes applied to the outermost wrapper `div`. */
  wrapperClassName?: string;
  /** Additional CSS classes applied to the container holding the individual OTP inputs. */
  otpInputClassName?: string;
  /** When true, uses CSS `gap` for spacing between inputs instead of `margin-right`. */
  useGapSpacing?: boolean;
}

/**
 * `OTPInput` renders a sequence of single-character input fields for collecting
 * One-Time Passwords (OTPs) or similar pin codes.
 *
 * Features include automatic focus advancement, keyboard navigation (Arrow keys,
 * Backspace, Delete), and clipboard paste support (pasting a full code automatically
 * distributes it across the inputs).
 *
 * @example
 * <OTPInput
 *   name="otp-code"
 *   label="Enter Verification Code"
 *   value={otpValue}
 *   onChangeOTP={setOtpValue}
 *   otpInputSize={6}
 * />
 */
export const OTPInput = forwardRef<HTMLDivElement, OTPInputProps>(
  (
    {
      disabled = false,
      error = false,
      label,
      name,
      value = '',
      placeholder,
      type,
      onBlur,
      onFocus,
      onChangeOTP,
      resetOTP,
      inputClassName,
      inputWrapperClassName,
      labelClassName = '',
      helperText = '',
      showErrorHelperText = '',
      otpInputSize = 6,
      placementToolTip,
      alwaysShowToolTip,
      contentToolTip,
      renderCustomContentToolTip,
      titleToolTip,
      showLabelInfoIcon,
      classNameToolTip,
      wrapperClassName = '',
      otpInputClassName = '',
      useGapSpacing = false,
      ...otpInputRest
    },
    ref,
  ) => {
    const inputRef = useRef<HTMLInputElement[]>([]);
    const [otpInput, setOTPInput] = useState<string[]>([...value.split('')]);

    const otpList = useRef(Array.from(Array(otpInputSize), (_, i) => i + 1));

    /** This will pass the input value to OnChange function passing from parent */
    const updateInputChangeProp = (inputValue: string[]) => {
      const convertStr = inputValue.join('');
      onChangeOTP(convertStr);
    };
    /** */

    useEffect(() => {
      if (resetOTP) {
        resetOTP(setOTPInput);
      }
    }, [resetOTP]);

    const focusInput = (targetIndex: number) => {
      const targetInput = inputRef.current[targetIndex] as HTMLInputElement;
      targetInput?.focus();
    };

    const selectInput = (targetIndex: number) => {
      const targetInput = inputRef.current[targetIndex] as HTMLInputElement;
      targetInput?.select();
    };

    useEffect(() => {
      if (inputRef.current && inputRef.current.length) {
        focusInput(0);
      }
    }, [inputRef]);

    /* isValidNumber return input value in string. If the input value is valid Integer */
    const isValidNumber = (inputValue: number) => {
      if (Number.isInteger(inputValue)) {
        return inputValue.toString();
      }

      return '';
    };
    /* ** */

    /* onChange handler. this will trigger any change occur in input */
    const inputOnChangeHandler = (
      e: React.ChangeEvent<HTMLInputElement>,
      currentInput: number,
    ) => {
      const targetValue = e.target.value;

      const newOtpInput = [...otpInput];
      if (targetValue.length > 1) {
        return;
      }

      if (isValidNumber(+targetValue)) {
        newOtpInput[currentInput] = targetValue;
        setOTPInput(newOtpInput);
        if (inputRef.current && inputRef.current.length) {
          if (newOtpInput[currentInput]) {
            if (currentInput + 1 < otpInputSize) {
              inputRef.current[currentInput + 1]?.focus();
              inputRef.current[currentInput + 1]?.select();
            }
          } else if (currentInput - 1 >= 0) {
            inputRef.current[currentInput - 1]?.focus();
            inputRef.current[currentInput - 1]?.select();
          }
        }
      }

      updateInputChangeProp(newOtpInput);
    };
    /* ** */

    /* OnClickHandler. This will trigger on Input Click */
    const handleClick = (currentIndex: number) => {
      selectInput(currentIndex);
    };
    /* ** */

    /** On key down handler  */
    const onKeyDownHandler = (
      e: React.KeyboardEvent<HTMLInputElement>,
      i: number,
    ) => {
      const copyOTP = [...otpInput];
      if (e.key === 'Backspace') {
        e.preventDefault();
        copyOTP[i] = '';
        setOTPInput([...copyOTP]);
        updateInputChangeProp(copyOTP);
        if (i - 1 >= 0) {
          focusInput(i - 1);
          selectInput(i - 1);
        }
      } else if (e.key === 'Delete') {
        e.preventDefault();
        copyOTP[i] = '';
        setOTPInput([...copyOTP]);
        updateInputChangeProp(copyOTP);
        if (i - 1 >= 0) {
          focusInput(i - 1);
          selectInput(i - 1);
        }
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        if (i - 1 >= 0) {
          focusInput(i - 1);
          selectInput(i - 1);
        }
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        if (i + 1 < otpInputSize) {
          focusInput(i + 1);
          selectInput(i + 1);
        }
      } else if (e.key === ' ' || e.key === 'Spacebar' || e.key === 'Space') {
        e.preventDefault();
      }
    };
    /* ** */

    /* On Input Paste Handler This will trim the text and paste in otp input */
    const onPasteHandler = (e: React.ClipboardEvent<HTMLInputElement>) => {
      const clipText = e.clipboardData.getData('text');
      if (
        clipText.length &&
        isValidNumber(+clipText) &&
        inputRef.current.length
      ) {
        const sliceClipText = clipText.slice(0, otpInputSize);
        const updateValue = sliceClipText.split('');
        inputRef.current[sliceClipText.length - 1]?.focus();
        updateInputChangeProp(updateValue);
        setOTPInput(updateValue);
      }
    };
    /* ** */

    /** This will render OTP Inputs */
    const renderOTPInputs = otpList.current.map(
      (otpValue: number, index: number) => (
        <InputWithBase
          key={otpValue}
          ref={(propsRef) => {
            if (propsRef) {
              inputRef.current[index] = propsRef;
            }
            return propsRef;
          }}
          disabled={disabled}
          error={error}
          name={`${name}-${index}`}
          type={type}
          value={otpInput[index] || ''}
          placeholder={placeholder}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            inputOnChangeHandler(e, index);
          }}
          onBlur={onBlur}
          onFocus={onFocus}
          onClick={() => handleClick(index)}
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) =>
            onKeyDownHandler(e, index)
          }
          onPaste={onPasteHandler}
          inputClassName={`text-center ${inputClassName as string} ${type === 'password' ? '!text-xs' : ''}`}
          inputWrapperClassName={`${inputWrapperClassName as string} last:mr-0 w-11 max-sm:px-0`}
          pattern="[0-9]*"
          inputMode="decimal"
          {...otpInputRest}
        />
      ),
    );
    /* ** */

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
        <div
          className={`${useGapSpacing ? 'gap-2 sm:gap-6' : '[&>div]:mr-6'} flex justify-between ${otpInputClassName || ''}`}
          ref={ref}
        >
          {renderOTPInputs}
        </div>
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
