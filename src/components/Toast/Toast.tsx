import { forwardRef } from 'react';
import Close from '../../icons/Close';
import defaultIcon from '../../icons/defaultIcon';
import errorIcon from '../../icons/errorIcon';
import infoIcon from '../../icons/infoIcon';
import successIcon from '../../icons/successIcon';
import warningIcon from '../../icons/warningIcon';
import { Button } from '../Button';

type StatusTypes = 'Default' | 'Info' | 'Error' | 'Success' | 'Warning';
interface BtnProps {
  label: string;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

/**
 * Toast component for displaying status messages, notifications, or alerts.
 * Implements WCAG accessibility guidelines with ARIA live regions and roles.
 */
export interface ToastProps {
  type: StatusTypes;
  className?: string;
  title: string;
  titleClassName?: string;
  subTitle?: string;
  subTitleClassName?: string;
  timerText?: string;
  timerClassName?: string;
  dataTestId?: string;
  inline?: boolean;
  hasIcon?: boolean;
  showTextBtn?: boolean;
  textBtn?: BtnProps;
  onDismiss?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  hasCloseIcon?: boolean;
  isOpen?: boolean;
  closeIconProps?: React.SVGAttributes<HTMLOrSVGElement>;
  inlineRightWrapperClassName?: string;
}

export const Toast = forwardRef<HTMLDivElement, ToastProps>(
  (
    {
      className = '',
      type = 'Default',
      title,
      subTitle = '',
      titleClassName = '',
      subTitleClassName = '',
      timerText = '',
      timerClassName = '',
      dataTestId = 'testToast',
      inline = false,
      hasIcon = false,
      showTextBtn = false,
      textBtn,
      onDismiss = () => {},
      hasCloseIcon = false,
      isOpen = true,
      closeIconProps = {},
      inlineRightWrapperClassName = '',
    }: ToastProps,
    ref,
  ) => {
    const getTypeClassName = () => {
      const typeClassName = {
        Default: 'bg-fill-fill-dark border border-border-border-light',
        Info: 'bg-fill-info-light border border-border-info-light',
        Success: 'bg-fill-success-light border border-border-success-light',
        Warning: 'bg-fill-caution-light border border-border-caution-light',
        Error: 'bg-fill-error-light border border-border-error-light',
      };
      return typeClassName[type] || typeClassName.Default;
    };

    const icon: Record<StatusTypes, JSX.Element> = {
      Default: defaultIcon(),
      Error: errorIcon(),
      Info: infoIcon(),
      Success: successIcon(),
      Warning: warningIcon(),
    };

    if (!isOpen) return null;

    const renderButton = (
      <Button type="button" size="sm" hierarchy="Secondary" {...textBtn} />
    );

    return (
      <div
        data-testid={dataTestId}
        ref={ref}
        role={type === 'Error' || type === 'Warning' ? 'alert' : 'status'}
        aria-live={
          type === 'Error' || type === 'Warning' ? 'assertive' : 'polite'
        }
        aria-atomic="true"
        className={`h-full w-full ${getTypeClassName()} flex ${inline ? 'items-start' : ''} rounded-lg p-4 shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(27,32,41,0.06)] ${className}`}
      >
        {hasIcon && (
          <div
            className="mr-4 flex h-6 w-5 flex-shrink-0 items-center justify-center rounded-full"
            aria-hidden="true"
          >
            {icon[type]}
          </div>
        )}
        <div
          className={`flex flex-1 ${inline ? 'flex-row items-start justify-between space-x-6' : 'flex-col space-y-6'}`}
        >
          <div className={`flex flex-col ${inline ? '' : 'space-y-2'}`}>
            <div
              className={`flex ${inline ? 'flex-row items-center space-x-1' : 'flex-col items-start'}`}
            >
              {inline ? (
                <h6
                  className={`heading-6-semibold ${titleClassName} text-text-dark`}
                >
                  {title}
                </h6>
              ) : (
                <h5
                  className={`heading-5-semibold ${titleClassName} text-text-dark`}
                >
                  {title}
                </h5>
              )}
              {subTitle && (
                <p
                  className={`text-text-text paragraph-small flex-1 ${subTitleClassName}`}
                >
                  {subTitle}
                </p>
              )}
            </div>
            {timerText && (
              <p
                className={`paragraph-extra-small text-text-text ${timerClassName}`}
              >
                {timerText}
              </p>
            )}
          </div>
          {showTextBtn && !inline && <div className="flex">{renderButton}</div>}
        </div>
        <div className={`${inline ? inlineRightWrapperClassName : ''} flex`}>
          {showTextBtn && inline && (
            <div className="ml-6 flex">{renderButton}</div>
          )}
          {hasCloseIcon && (
            <button
              type="button"
              aria-label="Close notification"
              onClick={onDismiss}
              className="ml-4 flex cursor-pointer items-center justify-center rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              <Close
                {...closeIconProps}
                className={`${closeIconProps?.className || ''} text-icon-icon`}
              />
            </button>
          )}
        </div>
      </div>
    );
  },
);
