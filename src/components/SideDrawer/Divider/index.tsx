import { forwardRef } from 'react';

export interface DividerProps {
  className?: string;
  orientation?: 'horizontal' | 'vertical';
}

export const Divider = forwardRef<HTMLDivElement, DividerProps>(
  ({ className = '', orientation = 'horizontal' }, ref) => (
    <div
      ref={ref}
      className={`${className || ''} border-border-border-light w-full  border-solid ${orientation === 'horizontal' ? 'border-t' : 'border-l'}`}
    />
  ),
);
