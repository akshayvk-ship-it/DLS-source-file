import { InputHTMLAttributes, ReactNode } from 'react';

export type MouseDownProps = {
  onMouseDown?: React.MouseEventHandler<unknown>;
};

export interface TextInputTypesBaseProps
  extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  disabled?: boolean;
  wrapperClassName?: string;
  placeholder?: string;
  wrapperRef?: React.RefObject<HTMLDivElement>;
  isAutoCompleteEnabled?: boolean;
  isFilled?: boolean;
  value: string;
  label?: string;
  labelClassName?: string;
  readonly?: boolean;
  name: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e?: React.FocusEvent<HTMLInputElement>) => void;
  onFocus?: () => void;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  inputClassName?: string;
  inputWrapperClassName?: string;
  prefixElement?: ReactNode;
  suffixElement?: ReactNode;
  helperText?: string;
  errorHelperText?: string;
}
