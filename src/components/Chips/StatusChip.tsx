import React from 'react';
import { InfoChipProps } from './InfoChip';
import { getColors, getText } from './constants';

export type StatusType = keyof typeof getText;

export interface StatusProps extends Omit<InfoChipProps, 'text'> {
  statusType: StatusType;
  prefixClassName?: string;
  text?: string;
}

type StatusPropPreview = Omit<
  StatusProps,
  | 'suffixElement'
  | 'closeClickHandler'
  | 'clickHandler'
  | 'showCloseIcon'
  | 'closeClassName'
  | 'isClickable'
  | 'selected'
>;

function PrefixDotElement({
  prefixClassName,
  statusType,
}: Pick<StatusProps, 'prefixClassName' | 'statusType'>) {
  return (
    <div
      className={`${prefixClassName} mr-1 ${getColors[statusType].prefixColor} h-1 w-1 rounded-full`}
    />
  );
}

export const StatusChip = React.forwardRef<HTMLDivElement, StatusPropPreview>(
  (
    {
      text,
      statusType = 'Success',
      prefixClassName = '',
      textClassName = '',
      prefixElement,
      wrapperClassName = '',
      dataTestId = 'defaultStatusChipTestId',
    },
    ref,
  ) => (
    <div
      data-testid={dataTestId}
      ref={ref}
      className={`flex h-6 flex-row items-center rounded-2xl border px-2  ${getColors[statusType].borderColor} ${getColors[statusType].fillColor} ${wrapperClassName}`}
    >
      {prefixElement ? (
        <div className={`${prefixClassName}`}>{prefixElement} </div>
      ) : (
        <PrefixDotElement
          prefixClassName={prefixClassName}
          statusType={statusType}
        />
      )}
      <div
        className={`label-small cursor-default font-medium ${getColors[statusType].textColor} ${textClassName}`}
      >
        {!text ? getText[statusType] : text}
      </div>
    </div>
  ),
);
