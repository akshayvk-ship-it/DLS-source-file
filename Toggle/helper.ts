export type SizeType = 'small' | 'large';

export const colorStyles = {
  disabled: {
    border: 'border-border-disabled before:bg-fill-action-disabled',
    label: 'text-text-disabled',
    focusBefore: '',
    withLabel: 'text-fill-action-disabled',
  },
  checked: {
    border:
      'border-border-action before:bg-icon-action active:before:shadow-[0px_0px_1px_2px_rgb(249,179,140)]',
    label: 'text-text-text',
    focusBefore: '!shadow-border-brand-focus-ring',
    withLabel: 'text-text-action',
  },
  default: {
    border:
      'border-text-light hover:border-border-dark before:bg-text-light hover:before:bg-icon-icon active:before:shadow-[0px_0px_0px_3px_rgb(59,71,91,0.2)] [&:hover>p]:text-icon-icon ',
    focusBefore: '!shadow-fill-hover',
    label: 'text-text-text',
    withLabel: 'text-text-light hover:text-fill-dark',
  },
};

export const getColorStyles = (checked: boolean, disabled: boolean) => {
  if (disabled) return colorStyles.disabled;
  return checked ? colorStyles.checked : colorStyles.default;
};

export const getSizeStyles = (size: SizeType, checked: boolean) => {
  const baseStyles =
    size === 'small'
      ? 'p-0.5 w-8 h-4 before:w-2.5 before:h-2.5'
      : 'p-0.5 w-10 h-5 before:w-3.5 before:h-3.5';

  const translateSize =
    size === 'small' ? 'before:translate-x-4' : 'before:translate-x-5';

  const checkedStyles = checked ? translateSize : 'before:translate-x-0';

  return `${baseStyles} ${checkedStyles}`;
};
