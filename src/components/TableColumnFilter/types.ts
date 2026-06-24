import { InputHTMLAttributes } from 'react';

export interface TableColumnFilterProps
  extends InputHTMLAttributes<HTMLInputElement> {
  value: string;
  options: ColumnOption[];
  searchPlaceholder?: string;
  wrapperClassName?: string;
  minimumSelectedOptions?: number;
  searchAutoComplete?: boolean;
  optionListWrapperClassName?: string;
  inputRef?: React.RefObject<HTMLInputElement>;
  wrapperRef?: React.RefObject<HTMLDivElement>;
  searchInputRef?: React.RefObject<HTMLInputElement>;
  onReset?: () => void;
  onClose?: () => void;
  name: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e?: React.FocusEvent<HTMLInputElement>) => void;
  onFocus?: () => void;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  inputClassName?: string;
  onColumnOptionsChange: (selected: ColumnOption[]) => void;
  inputWrapperClassName?: string;
  dropdownIcon: React.ReactNode;
  dropdownWrapperClassName?: string;
  dropdownIconClassName?: string;
}

export interface ColumnOption {
  value: string;
  label: string;
  isSelected?: boolean;
}
