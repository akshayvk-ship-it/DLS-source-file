import { forwardRef } from 'react';

export interface BoxProps {
  className?: string;
  children: React.ReactNode;
}

export const Box = forwardRef<HTMLDivElement, BoxProps>(
  ({ className = '', children }, ref) => (
    <div className={`${className} flex-1 overflow-y-auto`} ref={ref}>
      {children}
    </div>
  ),
);
