import React from 'react';
import {
  Label,
  SelectionControlsLabelProps as labelProps,
} from '../Label/Label';
import { RadioButtonBase, RadioButtonBaseProps } from './Base';

export interface RadioButtonProps
  extends Omit<labelProps, 'children' | 'text' | 'className' | 'htmlFor'>,
    RadioButtonBaseProps {
  text?: string;
  id: string;
  labelClassName?: string;
}
export const RadioButton = React.forwardRef<HTMLInputElement, RadioButtonProps>(
  (
    {
      text = '',
      supportText,
      disabled,
      id,
      labelClassName = '',
      ...props
    }: RadioButtonProps,
    ref,
  ) => {
    const baseProps = { ...props, id, disabled, ref };

    if (!text) return <RadioButtonBase {...baseProps} />;

    return (
      <Label
        text={text}
        supportText={supportText}
        disabled={disabled}
        htmlFor={id}
        className={labelClassName}
      >
        <RadioButtonBase {...baseProps} />
      </Label>
    );
  },
);
