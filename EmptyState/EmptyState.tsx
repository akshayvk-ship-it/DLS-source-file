import React from 'react';
import { Button, ButtonProps as BtnProps } from '../Button';
import { EmptyMI } from '../Icons/MicroIllustrationsComponents';

export interface EmptyStateProps {
  title: string;
  subtext?: string;
  layout: 'Wide' | 'Narrow';
  showImage?: boolean;
  imageElement?: JSX.Element;
  showCTA: boolean;
  primaryBtnProps?: Omit<BtnProps, 'size' | 'hierarchy' | 'type'>;
  secondaryBtnProps?: Omit<BtnProps, 'size' | 'hierarchy' | 'type'>;
  titleClassName?: string;
  subtextClassName?: string;
  wrapperClassName?: string;
}

export const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  (
    {
      title,
      subtext,
      imageElement,
      showCTA = true,
      primaryBtnProps,
      secondaryBtnProps,
      showImage = true,
      layout = 'Wide',
      wrapperClassName = '',
      subtextClassName = '',
      titleClassName = '',
    },
    ref,
  ) => {
    const secondaryBtnClassName = ` ${layout === 'Wide' ? 'mr-6' : 'mb-6'}`;

    return (
      <div
        ref={ref}
        className={`bg-fill-fill flex flex-col justify-between px-4 py-10   ${wrapperClassName} `}
      >
        <div className="flex h-full flex-col items-center justify-center ">
          {showImage && (imageElement ?? <EmptyMI />)}
          <div className={`${showImage ? 'mt-6' : ''} w-full`}>
            <div
              className={`text-text-text text-center font-semibold ${layout === 'Wide' ? 'heading-1' : 'heading-3'} ${titleClassName}`}
            >
              {title}
            </div>
            {subtext && (
              <div
                className={`text-text-light mt-2  text-center ${layout === 'Wide' ? 'paragraph-large ' : 'paragraph-medium'} ${subtextClassName}`}
              >
                {subtext}
              </div>
            )}
          </div>
        </div>
        {showCTA && (primaryBtnProps || secondaryBtnProps) ? (
          <div
            className={` mt-10 flex justify-center ${layout === 'Narrow' ? 'flex-col' : ''} `}
          >
            {secondaryBtnProps ? (
              <Button
                {...secondaryBtnProps}
                className={` ${primaryBtnProps ? secondaryBtnClassName : ''} ${secondaryBtnProps.className ?? ''}`}
                hierarchy="Secondary"
                size="lg"
                type="button"
              />
            ) : undefined}
            {primaryBtnProps ? (
              <Button
                {...primaryBtnProps}
                hierarchy="Primary"
                size="lg"
                type="button"
              />
            ) : undefined}
          </div>
        ) : undefined}
      </div>
    );
  },
);
