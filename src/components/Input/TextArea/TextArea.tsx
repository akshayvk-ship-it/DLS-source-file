import { forwardRef, useRef, useState } from 'react';
import { TextAreaProps } from './types';
import { Label } from '../Label';
import { InfoWithBorderIcon } from '../../Icons';

/**
 * `TextArea` is a flexible and customizable textarea component that provides a clean interface for
 * multi-line text input with various configuration options.
 *
 * Features:
 * - Customizable labels with optional tooltips and info icons
 * - Character limit enforcement with visual counter
 * - Error and disabled states with visual feedback
 * - Helper text for additional context or error messages
 * - Resizable vertically and read-only modes
 * - Custom styling through CSS classes
 * - Suffix elements for additional UI components
 * - Auto-complete configuration
 *
 * @component
 * @example
 * // Simple usage without character limit, tooltip icon, or helper text
 * <TextArea
 *   name="simple-textarea"
 *   value={value}
 *   onValueChange={handleChange}
 *   placeholder="Enter your text here..."
 *   label="Simple Text Area"
 * />
 *
 * @example
 * // TextArea with helper text
 * <TextArea
 *   name="helper-textarea"
 *   value={value}
 *   onValueChange={handleChange}
 *   placeholder="Enter description..."
 *   label="Description"
 *   helperText="Please provide a detailed description of your request"
 * />
 *
 * @example
 * // TextArea in error state
 * <TextArea
 *   name="error-textarea"
 *   value={value}
 *   onValueChange={handleChange}
 *   placeholder="Enter email..."
 *   label="Email Address"
 *   error={true}
 *   errorHelperText="Please enter a valid email address"
 * />
 *
 * @example
 * // Disabled TextArea
 * <TextArea
 *   name="disabled-textarea"
 *   value={disabledValue}
 *   onValueChange={handleChange}
 *   placeholder="This textarea is disabled"
 *   label="Disabled Field"
 *   disabled={true}
 *   helperText="This field is currently disabled"
 * />
 *
 * @example
 * // TextArea without tooltip icon
 * <TextArea
 *   name="no-tooltip-textarea"
 *   value={value}
 *   onValueChange={handleChange}
 *   placeholder="Enter your feedback..."
 *   label="Feedback"
 *   showLabelInfoIcon={false}
 *   helperText="Share your thoughts with us"
 * />
 *
 * @example
 * // Complete configuration with all features
 * <TextArea
 *   name="complete-textarea"
 *   value={value}
 *   onValueChange={handleChange}
 *   placeholder="Enter detailed information..."
 *   label="Detailed Information"
 *   helperText="Please provide as much detail as possible"
 *   maxCharacterLimit={500}
 *   isResizable={false}
 *   showLabelInfoIcon={true}
 *   contentToolTip="This field accepts up to 500 characters"
 *   titleToolTip="Information Guidelines"
 *   iconToolTip={<InfoIcon />}
 *   toolTipType="contextual"
 *   classNameToolTip="custom-tooltip-class"
 *   wrapperClassName="custom-wrapper"
 *   textAreaClassName="custom-textarea"
 *   suffixElement={<CharacterCount />}
 *   isAutoCompleteEnabled={true}
 * />
 */
// eslint-disable-next-line import/prefer-default-export
export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    {
      disabled = false,
      error = false,
      placeholder = '',
      label,
      labelClassName = '',
      value,
      name,
      showLabelInfoIcon = true,
      contentToolTip,
      isResizable = true,
      iconToolTip,
      classNameToolTip = '',
      titleToolTip,
      readOnly = false,
      helperText,
      errorHelperText,
      maxCharacterLimit,
      toolTipType,
      alwaysShowTooltip = false,
      type,
      onValueChange,
      isAutoCompleteEnabled = false,
      onFocus,
      onBlur,
      onTextAreaClick,
      wrapperClassName = '',
      textAreaClassName = '',
      textAreaWrapperClassName = '',
      suffixElement,
      autoComplete,
      dataTestId = 'textAreaTestId',
      wrapperElementRef,
      textAreaWrapperElementRef,
      ...rest
    },
    ref,
  ) => {
    const textAreaWrapperRef = useRef<HTMLDivElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const effectiveTextAreaWrapperRef =
      textAreaWrapperElementRef || textAreaWrapperRef;
    const effectiveWrapperRef = wrapperElementRef || wrapperRef;
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const [isFocused, setIsFocused] = useState(false);
    const [isError, setIsError] = useState(false);
    const [internalValue, setInternalValue] = useState<string>(value);

    const focusOnInputHandler = (
      e: React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>,
    ) => {
      if (e.type === 'click')
        onTextAreaClick?.(e as React.MouseEvent<HTMLDivElement>);

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
          if (item.nodeName.toLowerCase() === 'textarea') {
            inputElement = item;
          }
        });

        if (inputElement && (isTabNotPressed || e.type === 'click')) {
          (inputElement as unknown as HTMLTextAreaElement).focus();
          setIsFocused(true);
        }

        return;
      }

      const currentElement = (
        (ref || inputRef) as React.RefObject<HTMLTextAreaElement>
      ).current;

      if (currentElement && (isTabNotPressed || e.type === 'click')) {
        currentElement.focus();
        setIsFocused(true);
      }
    };

    /** TextArea Element Focus Handler */

    const inputFocusHandler = () => {
      if (readOnly) {
        setIsFocused(false);
      } else {
        setIsFocused(true);
      }

      onFocus?.();
    };
    /** *** */

    /** TextArea Element Blur Handler */
    const inputBlurHandler = (e: React.FocusEvent<HTMLTextAreaElement>) => {
      setIsFocused(false);
      onBlur?.(e);
    };

    const onTextValueChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const isMaxlengthExceeded =
        maxCharacterLimit !== undefined &&
        maxCharacterLimit > 0 &&
        e.target.value.length > maxCharacterLimit;

      if (isMaxlengthExceeded) {
        setIsError(true);
      } else {
        setIsError(false);
      }
      onValueChange(e, isMaxlengthExceeded);
      setInternalValue(e.target.value);
    };
    const getTextAreaBorder = () => {
      if (isError || error) {
        return '!border-border-error-light !shadow-surface-error-base-light shadow-[0px_0px_0px_4px]';
      }
      if (isFocused && !disabled) {
        return '!border-border-action-focused shadow-border-brand-focus-ring shadow-[0px_0px_0px_4px]';
      }
      if (disabled) {
        return '!border-border-disabled';
      }
      return '!border-border-border';
    };

    const rendertextArea = (
      <div
        ref={effectiveTextAreaWrapperRef}
        className={`${textAreaWrapperClassName} relative min-h-[5.375rem] w-full overflow-hidden rounded-lg border focus:outline-none ${getTextAreaBorder()} ${disabled ? 'bg-fill-disabled !border-border-disabled  !cursor-not-allowed' : ''}`}
        onClick={focusOnInputHandler}
        tabIndex={-1}
        onKeyDown={focusOnInputHandler}
        role="textbox"
        aria-label={placeholder}
      >
        <textarea
          {...rest}
          className={`${textAreaClassName} ${isResizable && !disabled ? 'resize-y' : 'resize-none'} label-large text-text-text placeholder-text-light placeholder-label-large min-h-[5.375rem] w-full  ${suffixElement ? 'pl-4 pr-12' : 'px-4'} py-3 align-top focus:outline-none ${disabled ? '!text-text-disabled !placeholder-text-disabled bg-fill-disabled !cursor-not-allowed' : 'caret-text-dark caret-font-semibold'} `}
          ref={inputRef}
          placeholder={placeholder}
          onFocus={inputFocusHandler}
          onBlur={inputBlurHandler}
          disabled={disabled}
          autoComplete={isAutoCompleteEnabled ? 'on' : 'off'}
          value={internalValue}
          name={name}
          readOnly={readOnly}
          onChange={onTextValueChange}
        />
        {suffixElement && (
          <div className="absolute bottom-3 right-4">{suffixElement}</div>
        )}
      </div>
    );

    const renderLabelAndCharacterCount = (
      <div className="flex items-center justify-between">
        {label && (
          <Label
            title={label}
            htmlFor={name}
            className={`${labelClassName} text-text-dark !mb-0`}
            placementToolTip="top-center"
            showLabelInfoIcon={showLabelInfoIcon}
            contentToolTip={contentToolTip}
            titleToolTip={titleToolTip}
            iconToolTip={
              iconToolTip || (
                <InfoWithBorderIcon
                  className="*:fill-icon-icon"
                  height={16}
                  width={16}
                />
              )
            }
            toolTipType={toolTipType}
            classNameToolTip={classNameToolTip}
            alwaysShowToolTip={alwaysShowTooltip}
          />
        )}
        {Boolean(maxCharacterLimit && maxCharacterLimit > 0) && (
          <span className="label-medium text-text-light">
            {internalValue?.length ?? 0}/{maxCharacterLimit}
          </span>
        )}
      </div>
    );

    const showErrorHelperText = (isError || error) && errorHelperText;
    const renderHelperText = (helperText || errorHelperText) && (
      <div
        className={`label-small
              ${showErrorHelperText ? 'text-text-error' : 'text-text-light'}
            `}
      >
        {showErrorHelperText ? errorHelperText : helperText}
      </div>
    );

    return (
      <div
        ref={effectiveWrapperRef}
        className={`flex flex-col justify-center gap-2 ${wrapperClassName}`}
        data-testid={dataTestId}
      >
        {renderLabelAndCharacterCount}
        <div className="flex flex-col gap-1">
          {rendertextArea}
          {renderHelperText}
        </div>
      </div>
    );
  },
);
