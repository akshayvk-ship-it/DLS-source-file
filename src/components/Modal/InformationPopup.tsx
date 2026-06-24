import { useEffect, useState, useId, forwardRef } from 'react';
import { Button } from '../Button';
import { InformationPopupProps } from './types';

// eslint-disable-next-line import/prefer-default-export
export const InformationPopup = forwardRef<
  HTMLDivElement,
  Omit<InformationPopupProps, 'ref'>
>(
  (
    {
      title,
      subTitle,
      icon,
      onPrimaryButtonClick,
      primaryButtonLabel,
      primaryBtnProps,
      hasOverlay,
      onModalClose,
      timerDuration = 5,
      headerAlignment,
      secondaryBtnProps,
      secondaryButtonLabel,
      onSecondaryButtonClick,
      children,
      dataTestId,
      modalWrapperClassName = '',
      footerWrapperClassName = '',
      isMobile,
      wrapperVisibilityClass,
      scrollStyle,
    },
    ref,
  ) => {
    const [countdown, setCountdown] = useState(timerDuration);

    const uniqueId = useId();
    const titleId = `${uniqueId}-info-title`;
    const subtitleId = `${uniqueId}-info-subtitle`;

    const hasPrimaryButton = !!primaryButtonLabel;
    const hasSecondaryButton = !!secondaryButtonLabel;

    const showTimer = !hasPrimaryButton && !hasSecondaryButton;

    useEffect(() => {
      if (showTimer && onModalClose) {
        if (countdown > 0) {
          const timer = setTimeout(() => {
            setCountdown((prev) => prev - 1);
          }, 1000);
          return () => clearTimeout(timer);
        }
        onModalClose();
      }
      return undefined;
    }, [showTimer, countdown, onModalClose]);

    return (
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={subTitle ? subtitleId : undefined}
        className={`${modalWrapperClassName} 
  ${hasOverlay ? '' : 'border-border-border-light border'}  ${scrollStyle === 'default' ? 'overflow-auto' : 'flex flex-col overflow-hidden'} bg-fill-fill relative max-h-full flex-col rounded-2xl p-6 shadow-md sm:min-w-[20rem] sm:max-w-[26.25rem] ${isMobile ? 'transition duration-300 ease-in-out' : ''} focus:outline-none max-sm:!w-full max-sm:!rounded-b-none ${wrapperVisibilityClass}`}
        data-testid={dataTestId}
      >
        {icon && (
          <div
            className={`${scrollStyle === 'default' ? '' : 'shrink-0'} flex h-12 w-full items-center ${headerAlignment === 'left' ? 'justify-start' : 'justify-center'}`}
          >
            {icon}
          </div>
        )}
        <div
          className={`mt-4 ${scrollStyle === 'default' ? '' : 'shrink-0'} ${headerAlignment === 'left' ? 'text-left' : 'text-center'}`}
        >
          <h4 id={titleId} className="text-text-dark font-semibold">
            {title}
          </h4>
          {subTitle ? (
            <p id={subtitleId} className="paragraph-small text-text-text mt-2">
              {subTitle}
            </p>
          ) : null}
        </div>
        <div
          className={`mt-4 ${scrollStyle === 'default' ? '' : 'min-h-0 flex-1 overflow-auto'}`}
        >
          {children}
        </div>
        {showTimer ? (
          <div
            className={`paragraph-small text-text-dark-pressed ${scrollStyle === 'default' ? '' : 'shrink-0'} mt-6 flex justify-center font-medium`}
          >
            Timer {countdown} secs
          </div>
        ) : (
          <div
            className={`${footerWrapperClassName} mt-6 flex ${scrollStyle === 'default' ? '' : 'shrink-0'} gap-4 max-sm:w-full max-sm:flex-col `}
          >
            {secondaryButtonLabel && (
              <Button
                label={secondaryButtonLabel}
                onClick={onSecondaryButtonClick}
                size="md"
                type="button"
                hierarchy="Secondary"
                {...secondaryBtnProps}
                className={`${secondaryBtnProps?.className} max-sm:order-2 max-sm:!w-full`}
              />
            )}
            {primaryButtonLabel && (
              <Button
                label={primaryButtonLabel}
                onClick={onPrimaryButtonClick}
                size="md"
                type="button"
                hierarchy="Primary"
                {...primaryBtnProps}
                className={`${primaryBtnProps?.className} max-sm:order-1 max-sm:!w-full`}
              />
            )}
          </div>
        )}
      </div>
    );
  },
);
