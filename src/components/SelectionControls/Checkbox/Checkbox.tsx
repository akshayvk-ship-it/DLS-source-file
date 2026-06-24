import React from 'react';
import {
  Label,
  SelectionControlsLabelProps as labelProps,
} from '../Label/Label';
import { CheckboxBase, CheckboxProps as checkboxProps } from './Base';

export interface CheckBoxProps
  extends Omit<labelProps, 'children' | 'text' | 'className' | 'htmlFor'>,
    checkboxProps {
  text?: string;
  id: string;
  labelClassName?: string;
  textClassName?: string;
  supportTextClassName?: string;
}
export const Checkbox = React.forwardRef<HTMLInputElement, CheckBoxProps>(
  (
    {
      text,
      supportText,
      textClassName = '',
      supportTextClassName = '',
      disabled,
      id,
      labelClassName = '',
      ...props
    }: CheckBoxProps,
    ref,
  ) => {
    const baseProps = { ...props, id, disabled, ref };

    if (!text) return <CheckboxBase {...baseProps} />;

    return (
      <Label
        text={text}
        supportText={supportText}
        disabled={disabled}
        htmlFor={id}
        className={labelClassName}
        textClassName={textClassName}
        supportTextClassName={supportTextClassName}
      >
        <CheckboxBase {...baseProps} />
      </Label>
    );
  },
);
