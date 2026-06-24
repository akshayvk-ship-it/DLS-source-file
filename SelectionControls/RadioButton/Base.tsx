import React, { InputHTMLAttributes } from 'react';
import { commonStyle, Size, getSizes } from '../helper';

export interface RadioButtonBaseProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'children' | 'size'> {
  size: Size;
  onChange: Exclude<
    React.InputHTMLAttributes<HTMLInputElement>['onChange'],
    undefined
  >;
  dataTestId?: string;
}

export const RadioButtonBase = React.forwardRef<
  HTMLInputElement,
  RadioButtonBaseProps
>(({ size, dataTestId = '', ...props }: RadioButtonBaseProps, ref) => (
  <input
    {...props}
    type="radio"
    className={`${props.className ?? ''} ${commonStyle} ${getSizes(size).width} relative rounded-full
          after:absolute disabled:cursor-not-allowed  ${size === 'sm' ? 'after:h-2 after:w-2' : 'after:h-2.5 after:w-2.5'} ${props.disabled && props.checked ? 'after:disabled:bg-fill-action-disabled' : ''} after:checked:bg-fill-action after:left-1/2  after:top-1/2 after:-translate-x-1/2
        after:-translate-y-1/2
        after:rounded-full
      `}
    ref={ref}
    data-testid={dataTestId}
  />
));
