export type Size = 'lg' | 'sm';

export function getSizes(size: Size) {
  const sizes = { sm: { width: 'w-4 h-4' }, lg: { width: 'w-5 h-5' } };
  return sizes[size];
}
const commonStyle =
  '!outline-none appearance-none border border-border-border checked:bg-fill-action-light  checked:!border-border-action  hover:border-border-action focus:shadow-[0px_0px_0px_4px] focus:!shadow-border-brand-focus-ring focus:border-border-action-focused disabled:!border-border-disabled disabled:bg-fill-disabled bg-50 bg-origin-border';

export { commonStyle };
