import { forwardRef } from 'react';

export interface DrawerProps {
  containerClassName?: string;
  children: React.ReactNode;
  onMouseEnter?: (e: React.MouseEvent<HTMLDivElement>) => void;
  onMouseLeave?: (e: React.MouseEvent<HTMLDivElement>) => void;
  anchor?: 'left' | 'right' | 'top' | 'bottom';
  position?: 'fixed' | 'absolute';
  testId?: string;
  isSidebarActive?: boolean;
  showAnimations?: boolean;
  hideDefaultTranslate?: boolean;
}

export const Drawer = forwardRef<HTMLDivElement, DrawerProps>(
  (
    {
      containerClassName = '',
      children,
      onMouseEnter = undefined,
      onMouseLeave = undefined,
      anchor = 'left',
      position = 'fixed',
      testId = 'drawer-id',
      isSidebarActive = false,
      showAnimations = true,
      hideDefaultTranslate = false,
    },
    ref,
  ) => {
    const animations = {
      left: isSidebarActive ? 'translate-x-0' : '-translate-x-full',
      right: isSidebarActive ? '-translate-x-0' : 'translate-x-full',
      top: isSidebarActive ? 'translate-y-0' : '-translate-y-full',
      bottom: isSidebarActive ? '-translate-y-0' : 'translate-y-full',
    };

    const anchorClassNames = {
      left: 'top-0 left-0 h-full ',
      right: 'top-0 right-0 h-full ',
      top: 'top-0 w-full',
      bottom: 'bottom-0 w-full',
    };

    return (
      <div
        className={`${containerClassName} box-border ${!hideDefaultTranslate ? animations[anchor] : ''} ${showAnimations && !hideDefaultTranslate ? ` transition-transform duration-300 ease-in` : ''} ${position} ${anchorClassNames[anchor]}`}
        ref={ref}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        data-testid={testId}
      >
        {children}
      </div>
    );
  },
);
