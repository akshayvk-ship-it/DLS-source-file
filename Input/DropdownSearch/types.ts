import { InputHTMLAttributes } from 'react';
import { Position } from '../../ToolTip/ToolTipBase';

export interface DropdownSearchProps
  extends InputHTMLAttributes<HTMLInputElement> {
  value: string;
  fitLabelToContent?: boolean;
  enableAutoComplete?: boolean;
  tooltipPlacement?: Position;
  options: SearchOption[];
  wrapperClassName?: string;
  defaultOption?: SearchOption;
  dropdownLabelClassName?: string;
  constantPlaceholder: string;
  inputRef?: React.RefObject<HTMLInputElement>;
  wrapperRef?: React.RefObject<HTMLDivElement>;
  name: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e?: React.FocusEvent<HTMLInputElement>) => void;
  onFocus?: () => void;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  inputClassName?: string;
  onOptionChange: (selected: string) => void;
  inputWrapperClassName?: string;
}

export interface SearchOption {
  value: string;
  label: string;
  placeholder?: string;
  regex?: RegExp;
  errorMessage?: string;
}
