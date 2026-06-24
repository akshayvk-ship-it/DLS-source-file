import { ComponentProps, forwardRef } from 'react';
import { DropdownMenuComponent } from '../utils/types';

const DropdownMenu = forwardRef<
  HTMLDivElement,
  Readonly<ComponentProps<'div'>>
>(({ children, className, ...props }, ref) => (
  <div
    className={`bg-fill-fill border-border-border-light border ${className || ''}`}
    ref={ref}
    {...props}
  >
    <div className="px-4 ">{children}</div>
  </div>
)) as DropdownMenuComponent;

DropdownMenu.Group = forwardRef<
  HTMLUListElement,
  Readonly<ComponentProps<'ul'>>
>(({ children, className, ...props }, ref) => (
  <ul ref={ref} {...props} className={`${className}`}>
    {children}
  </ul>
));

DropdownMenu.Item = forwardRef<HTMLLIElement, Readonly<ComponentProps<'li'>>>(
  ({ children, className, ...props }, ref) => (
    <div className={`pb-[10px] ${className}`}>
      <li
        className="hover:bg-fill-hover flex cursor-pointer items-center justify-start gap-3 rounded-lg p-2"
        ref={ref}
        {...props}
      >
        {children}
      </li>
    </div>
  ),
);

DropdownMenu.Text = forwardRef<
  HTMLParagraphElement,
  Readonly<ComponentProps<'p'>>
>(({ children, className, ...props }, ref) => (
  <p
    className={`label-medium text-text-text ${className}`}
    ref={ref}
    {...props}
  >
    {children}
  </p>
));

export default DropdownMenu;
