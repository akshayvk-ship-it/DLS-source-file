import React from 'react';

export interface CurrencyOption {
  code: string;
  symbol: string;
  label: string;
  flag?: string;
}

export const DEFAULT_CURRENCIES: CurrencyOption[] = [
  { code: 'INR', symbol: '₹', label: 'Indian Rupee', flag: '🇮🇳' },
  { code: 'USD', symbol: '$', label: 'US Dollar', flag: '🇺🇸' },
  { code: 'EUR', symbol: '€', label: 'Euro', flag: '🇪🇺' },
  { code: 'GBP', symbol: '£', label: 'British Pound', flag: '🇬🇧' },
  { code: 'AED', symbol: 'د.إ', label: 'UAE Dirham', flag: '🇦🇪' },
  { code: 'SGD', symbol: 'S$', label: 'Singapore Dollar', flag: '🇸🇬' },
  { code: 'JPY', symbol: '¥', label: 'Japanese Yen', flag: '🇯🇵' },
  { code: 'CAD', symbol: 'C$', label: 'Canadian Dollar', flag: '🇨🇦' },
];

export interface CurrencyInputProps {
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCurrencyChange?: (currency: CurrencyOption) => void;
  currencies?: CurrencyOption[];
  defaultCurrency?: CurrencyOption;
  label?: string | React.ReactNode;
  labelClassName?: string;
  placeholder?: string;
  helperText?: string;
  showErrorHelperText?: string;
  error?: boolean;
  disabled?: boolean;
  isMandatory?: boolean;
  wrapperClassName?: string;
  inputClassName?: string;
  inputWrapperClassName?: string;
  suggestions?: string[];
  onSuggestionAccept?: (value: string) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onFocus?: () => void;
}
