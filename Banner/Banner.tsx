/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useId } from 'react';
import Close from '../../icons/Close';
import { Button, ButtonProps } from '../Button';
import { BannerTypes, BtnProps, getColors, renderIcon } from './helper';

export interface BannerProps {
  type: BannerTypes;
  title: string;
  titleClassName?: string;
  subtitle?: string;
  subtitleClassName?: string;
  timerText?: string;
  timerClassName?: string;
  secondaryBtn?: BtnProps;
  textBtn?: BtnProps;
  isOpen?: boolean;
  emphasis?: boolean;
  hasIcon?: boolean;
  onDismiss?: () => void;
  dataTestId?: string;
  className?: string;
  hasCloseBtn?: boolean;
}

export const Banner = React.forwardRef<HTMLDivElement, BannerProps>(
  (
    {
      type,
      emphasis = false,
      className = '',
      title,
      titleClassName = '',
      subtitle = '',
      subtitleClassName = '',
      timerText = '',
      timerClassName = '',
      onDismiss = undefined,
      hasIcon = false,
      isOpen = false,
      secondaryBtn,
      textBtn,
      dataTestId = 'testBanner',
      hasCloseBtn = false,
    }: BannerProps,
    ref,
  ) => {
    const animationDelay = 500;
    const [phase, setPhase] = useState<
      'open' | 'closing' | 'close' | 'opening'
    >('close');
    const titleId = useId();
    const subtitleId = useId();
    const textBtnProps: ButtonProps = {
      ...textBtn,
      hierarchy: 'Text Button',
      type: 'button',
      size: 'md',
      className: '!text-inherit !bg-transparent',
    };
    const secondaryBtnProps: ButtonProps = {
      ...secondaryBtn,
      hierarchy: 'Secondary',
      type: 'button',
      size: 'md',
    };

    const handleClose = () => {
      if (onDismiss) onDismiss();
      setPhase('closing');
      setTimeout(() => setPhase('close'), animationDelay);
    };

    const renderCloseBtn = (testId?: string) => {
      if (!onDismiss) return <> </>;
      let iconColor = '';
      if (emphasis) {
        if (type === 'Warning') {
          iconColor = 'text-icon-icon';
        }
      } else {
        iconColor = 'text-icon-icon';
      }
      return (
        <button
          type="button"
          onClick={handleClose}
          aria-label="Close banner"
          data-testid={`${dataTestId}${testId ?? ''}`}
          className="rounded focus:outline-none focus-visible:shadow-[0px_0px_0px_4px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          <Close className={`${iconColor}`} />
        </button>
      );
    };

    useEffect(() => {
      if (isOpen) {
        setPhase('opening');
        setTimeout(() => setPhase('open'), animationDelay);
      } else {
        handleClose();
      }
    }, [isOpen]);

    const getSubTitleAndTimerTextColor = (timer: boolean) => {
      if (emphasis) {
        if (type === 'Warning') {
          if (timer) return 'text-text-text';
          return 'text-text-dark';
        }

        return 'text-text-on-fill';
      }

      return 'text-text-text';
    };

    if (phase === 'close') return <> </>;

    return (
      <div
        className={`${className} ${emphasis ? 'p-4' : 'rounded-md px-4 py-2'} ${getColors(type, !!emphasis)} ${phase === 'open' ? 'translate-y-0 opacity-100' : '-translate-y-20 opacity-0'} flex w-full flex-row flex-nowrap justify-between border transition-[opacity_translate]`}
        style={{ transitionDuration: `${animationDelay}ms` }}
        ref={ref}
        data-testid={dataTestId}
        role={type === 'Error' || type === 'Warning' ? 'alert' : 'status'}
        aria-live={
          type === 'Error' || type === 'Warning' ? 'assertive' : 'polite'
        }
        aria-atomic="true"
        aria-labelledby={`${titleId} ${titleId}-mobile`}
        aria-describedby={subtitle ? subtitleId : undefined}
      >
        <div className="flex w-full items-start space-x-4">
          {hasIcon && renderIcon(type, emphasis)}
          <div className="flex flex-col space-y-2">
            <div className="flex flex-col">
              <h5
                id={titleId}
                className={`${titleClassName} heading-5-semibold hidden sm:block`}
              >
                {title}
              </h5>
              <h6
                id={`${titleId}-mobile`}
                className={`${titleClassName} heading-6-semibold block sm:hidden`}
              >
                {title}
              </h6>
              {subtitle && (
                <p
                  id={subtitleId}
                  className={`label-small paragraph-small ${getSubTitleAndTimerTextColor(false)} ${subtitleClassName}`}
                >
                  {subtitle}
                </p>
              )}
            </div>
            {timerText && (
              <p
                className={`paragraph-extra-small ${getSubTitleAndTimerTextColor(true)} ${timerClassName}`}
              >
                {timerText}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center justify-between space-x-6">
          <div className="flex space-x-1">
            {textBtn && (
              <Button
                {...textBtnProps}
                size="sm"
                dataTestId={`${dataTestId}textBtn`}
              />
            )}
            {secondaryBtn && (
              <Button
                {...secondaryBtnProps}
                size="sm"
                dataTestId={`${dataTestId}secBtn`}
              />
            )}
          </div>
          {hasCloseBtn && (
            <div className="block">{renderCloseBtn('closeBtn')}</div>
          )}
        </div>
      </div>
    );
  },
);
