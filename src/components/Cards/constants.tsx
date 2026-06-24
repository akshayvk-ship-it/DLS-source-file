export const CARD_MIN_WIDTH_CONFIG = {
  vertical: {
    sm: 'min-w-[11.25rem]',
    md: 'min-w-[14.375rem]',
    lg: 'min-w-[17.5rem]',
  },
  horizontal: {
    sm: 'min-w-[16.375rem]',
    md: 'min-w-[21.25rem]',
    lg: 'min-w-[25rem]',
  },
} as const;

export const CARD_OUTER_PADDING_CONFIG = {
  sm: 'p-2',
  md: 'p-4',
  lg: 'p-6',
} as const;

export const BUTTON_SIZES = {
  md: '!px-[1.25rem] !py-[0.625rem] !rounded-md',
  sm: '!px-[0.875rem] !py-[0.438rem]',
} as const;

export const BUTTON_HEIGHT = {
  lg: 'h-10',
  md: 'h-8',
  sm: 'h-8',
} as const;

export const SHADOW_CLASS =
  'shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(27,32,41,0.06)]';

export const ICON_SIZE = {
  sm: 'h-8 w-8',
  md: 'h-10 w-10',
  lg: 'h-12 w-12',
} as const;

export const TITLE_DESC_SPACE = {
  sm: 'pb-2',
  md: 'pb-4',
  lg: 'pb-4',
} as const;

export const DESC_BUTTON_SPACE = {
  sm: 'pt-4',
  md: 'pt-6',
  lg: 'pt-6',
} as const;

export const CARD_TYPOGRAPHY = {
  lg: {
    title: 'heading-3-semibold text-text-dark',
    subTitle: 'label-large text-text-light',
    description: 'label-large text-text-text',
  },
  md: {
    title: 'heading-5-semibold text-text-dark',
    subTitle: 'label-medium text-text-light',
    description: 'label-medium text-text-text',
  },
  sm: {
    title: 'heading-6-semibold text-text-dark',
    subTitle: 'label-small text-text-light',
    description: 'label-small text-text-text',
  },
} as const;

export const ICON_SIZE_PX = {
  sm: 32,
  md: 40,
  lg: 48,
} as const;
