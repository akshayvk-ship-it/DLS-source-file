import { forwardRef, ReactNode } from 'react';

export interface PanelProps {
  className?: string;
  children: ReactNode;
}

export const Panel = forwardRef<HTMLDivElement, PanelProps>(
  ({ className = '', children }, ref) => (
    <div className={`${className}`} ref={ref}>
      {children}
    </div>
  ),
);
