import { forwardRef } from 'react';
import Chevron from '../../icons/chevron';
import { ToolTip, ToolTipProps } from '../ToolTip';
import { InfoWithBorderIcon } from '../Icons';

export interface DropDownMwebBase {
  label: string;
  placeholder: string;
  onClick: () => void;
  description?: string;
  labelClassName?: string;
  isErrorState?: boolean;
  helperText?: string;
  disabled?: boolean;
  className?: string;
  showToolTip?: boolean;
  toolTipProps?: Omit<ToolTipProps, 'iconToolTip'>;
  dataTestId?: string;
}

export type DropDownMwebProps = DropDownMwebBase &
  (
    | {
        showDoubleLine?: false;
        value: string;
      }
    | {
        showDoubleLine: true;
        value: { label: string; subText: string };
      }
  );

const buttonStyles = {
  base: 'bg-fill-fill label-medium text-text-text border-border-border relative flex w-full items-center justify-between rounded-lg border border-solid px-4',
  disabled:
    '!text-text-disabled !bg-fill-disabled !cursor-not-allowed !border-border-disabled',

  error:
    '!border-border-error-light !shadow-surface-error-base-light shadow-[0px_0px_0px_4px]',
};

export const DropDownMweb = forwardRef<HTMLDivElement, DropDownMwebProps>(
  (
    {
      label,
      labelClassName,
      description,
      className,
      placeholder,
      helperText,
      isErrorState,
      disabled = false,
      value,
      showToolTip = true,
      toolTipProps,
      onClick,
      showDoubleLine = false,
      dataTestId = 'dropdown-mweb-test-id',
    }: DropDownMwebProps,
    ref,
  ) => {
    const renderText = () => {
      const disabledText = disabled ? '!text-text-disabled' : '';

      if (!showDoubleLine && value) {
        return (
          <p
            className={`label-medium text-text-text ${disabledText} font-normal`}
          >
            {value as string}
          </p>
        );
      }

      if (
        showDoubleLine &&
        typeof value === 'object' &&
        value?.label &&
        value?.subText
      ) {
        return (
          <div className="flex w-full flex-col items-start">
            <p className={`label-medium text-text-text ${disabledText} !m-0`}>
              {value.label}
            </p>
            <p className={`label-small text-text-light ${disabledText} !m-0`}>
              {value.subText}
            </p>
          </div>
        );
      }

      return (
        <p
          className={`label-medium text-text-light font-normal ${disabledText}`}
        >
          {placeholder}
        </p>
      );
    };

    return (
      <div
        ref={ref}
        className={`relative w-full flex-col items-start gap-2  ${className}`}
        data-testid={dataTestId}
      >
        <div className="mb-2 flex w-full flex-col">
          <div className="flex items-center gap-1">
            <span
              className={`label-small text-text-dark font-medium ${labelClassName}`}
            >
              {label}
            </span>
            {showToolTip && toolTipProps && (
              <ToolTip
                {...toolTipProps}
                iconToolTip={<InfoWithBorderIcon />}
                className="[&_svg]:size-3.5"
              />
            )}
          </div>
          {description && (
            <p className="label-small text-text-text mt-0.5 font-normal">
              {description}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={onClick}
          className={`${buttonStyles.base}
            ${disabled ? buttonStyles.disabled : ''}
            ${isErrorState ? buttonStyles.error : ''}
            ${showDoubleLine ? 'h-14 py-2' : 'h-12 py-3'}
            `}
          disabled={disabled}
        >
          {renderText()}

          <Chevron
            className={`${disabled ? '[&>path]:fill-icon-disabled cursor-not-allowed' : 'cursor-pointer'}`}
            data-testid={`${dataTestId}-chevron-icon`}
          />
        </button>
        {helperText && (
          <div
            className={`label-extra-small mt-1.5
              ${isErrorState ? 'text-text-error' : 'text-text-disabled'}
            `}
          >
            {helperText}
          </div>
        )}
      </div>
    );
  },
);
