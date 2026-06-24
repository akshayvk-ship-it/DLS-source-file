// eslint-disable-next-line @typescript-eslint/no-unused-vars

export type BtnHierarchies =
  | 'Primary'
  | 'Secondary'
  | 'Text Button'
  | 'Tertiary Button';

export type BtnSizes = 'lg' | 'md' | 'sm';

export function getColors(destructive: boolean, hierarchy: BtnHierarchies) {
  const shadow =
    '[&:not(:focus)]:shadow-[0px_1px_2px_0px] [&:not(:focus)]:!shadow-[rgba(27,32,41,0.05)]';

  const colors = {
    destructive: {
      Primary: `bg-fill-error hover:bg-fill-error-pressed !shadow-fill-error-medium active:bg-fill-error-pressed disabled:bg-fill-action-disabled text-fill-fill active:text-text-error-on-fill-pressed disabled:text-text-disabled ${shadow}`,
      Secondary: `bg-fill-action-lighter hover:bg-fill-error-light-pressed !shadow-fill-error-medium  active:bg-fill-error-light-pressed disabled:bg-fill-hover-light text-text-error active:text-text-error-pressed disabled:text-text-disabled border-fill-error disabled:border-fill-action-disabled border ${shadow}`,
      'Tertiary Button':
        '!shadow-fill-error-medium text-text-error  active:text-text-error-pressed disabled:text-text-disabled',
      'Text Button':
        'hover:bg-fill-error-light-pressed !shadow-fill-error-medium active:bg-fill-error-light-pressed  disabled:bg-fill-action-disabled text-text-error  active:text-text-error-pressed disabled:text-text-disabled bg-transparent',
    },
    nonDestructive: {
      Primary: `bg-fill-action hover:bg-fill-action-pressed !shadow-border-brand-focus-ring active:bg-fill-action-pressed disabled:bg-fill-action-disabled text-fill-fill active:text-text-on-fill-action-pressed disabled:text-text-disabled ${shadow}`,
      Secondary: `bg-fill-fill hover:bg-fill-hover-light !shadow-fill-hover active:bg-fill-hover-light disabled:bg-fill-disabled text-text-dark active:text-text-dark-pressed disabled:text-text-disabled border border-text-disabled disabled:border-border-disabled ${shadow}`,
      'Tertiary Button':
        '!shadow-border-brand-focus-ring text-fill-action active:text-text-on-fill-action-pressed disabled:text-text-disabled',
      'Text Button':
        'bg-transparent hover:bg-fill-hover-light !shadow-fill-hover active:bg-fill-hover-light text-text-dark active:text-text-dark-pressed disabled:text-text-disabled',
    },
  };

  const loaderColors = {
    destructive: {
      Primary: '',
      Secondary: '',
      'Tertiary Button': '',
      'Text Button': '',
    },
    nonDestructive: {
      Primary: '',
      Secondary: 'text-icon-icon',
      'Tertiary Button': '',
      'Text Button': 'text-icon-icon',
    },
  };

  return {
    class: colors[destructive ? 'destructive' : 'nonDestructive'][hierarchy],
    loader:
      loaderColors[destructive ? 'destructive' : 'nonDestructive'][hierarchy],
  };
}

export function getSizes(
  size: BtnSizes,
  hierarchy: BtnHierarchies,
  hasIcon?: boolean,
) {
  const fontSizes = {
    lg: `label-large`,
    md: `label-medium`,
    sm: `label-small`,
  };
  const padSizes = {
    lg: `h-12 ${hasIcon ? 'px-4' : 'px-6'}`,
    md: `h-10 ${hasIcon ? 'px-3' : 'px-5'}`,
    sm: `h-8 ${hasIcon ? 'px-2' : 'px-4'}`,
  };

  const loaderSize = {
    lg: { large: 8, small: 24 },
    md: { large: 4, small: 20 },
    sm: { large: 4, small: 16 },
  };
  const iconSize = {
    lg: 'max-h-[1.5rem] max-w-[1.5rem]',
    md: 'max-h-[1.25rem] max-w-[1.25rem]',
    sm: 'max-h-[1.125rem] max-w-[1.125rem]',
  };

  return {
    icon: iconSize[size],
    loader: loaderSize[size],
    class: `${fontSizes[size]} ${hierarchy === 'Tertiary Button' ? '' : padSizes[size]}`,
  };
}
