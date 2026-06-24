import React, { ButtonHTMLAttributes, ReactNode, forwardRef } from 'react';
import BeatLoader from '../Loaders/BeatLoader';
import SpinLoader from '../Loaders/SpinLoader';
import { BtnHierarchies, BtnSizes, getColors, getSizes } from './helper';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  destructive?: boolean;
  hierarchy: BtnHierarchies;
  labelClassName?: string;
  size: BtnSizes;
  loading?: boolean;
  reversed?: boolean;
  label?: string;
  icon?: ReactNode;
  type: Exclude<ButtonHTMLAttributes<HTMLButtonElement>['type'], undefined>;
  dataTestId?: string;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      destructive = false,
      size,
      hierarchy,
      reversed = false,
      label = '',
      labelClassName = '',
      icon,
      loading = false,
      className = '',
      type,
      dataTestId = 'defaultButtonTestId',
      ...btnProps
    }: ButtonProps,
    ref,
  ) => {
    const colors = getColors(!!destructive, hierarchy);
    const sizes = getSizes(size, hierarchy, !!icon);

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (loading) {
        e.preventDefault();
        return;
      }
      if (btnProps.onClick) btnProps.onClick(e);
    };
    const renderLoader = (hasLabel: boolean) =>
      hasLabel ? (
        <BeatLoader size={sizes.loader.large} className={colors.loader} />
      ) : (
        <SpinLoader size={sizes.loader.small} className={colors.loader} />
      );

    return (
      <button
        className={`${className} ${colors.class} ${sizes.class} ${reversed ? 'flex-row-reverse space-x-reverse' : ''}  flex items-center justify-center ${label && icon ? 'space-x-1' : ''} rounded-lg font-semibold  !outline-none focus-visible:shadow-[0px_0px_0px_4px] disabled:cursor-not-allowed `}
        // eslint-disable-next-line react/button-has-type
        type={type}
        ref={ref}
        {...btnProps}
        onClick={handleClick}
        data-testid={dataTestId}
      >
        {loading ? (
          renderLoader(!!label)
        ) : (
          <>
            {icon ? <div className={`${sizes.icon} `}>{icon}</div> : ''}
            {label && (
              <span
                className={`${labelClassName} text-nowrap ${icon ? 'px-1' : ''}`}
              >
                {label}
              </span>
            )}
          </>
        )}
      </button>
    );
  },
);
