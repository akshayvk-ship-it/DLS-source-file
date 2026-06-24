import { forwardRef, ReactNode } from 'react';

export interface ContainerProps {
  containerClassName?: string;
  children: ReactNode;
}

export const Container = forwardRef<HTMLDivElement, ContainerProps>(
  ({ containerClassName = '', children }, ref) => (
    <div ref={ref} className={`${containerClassName}`}>
      {children}
    </div>
  ),
);
