import React, {
  ComponentProps,
  forwardRef,
  useCallback,
  useMemo,
  useState,
  useRef,
  useEffect,
} from 'react';
import { HighlightBehavior, NavItem, SidebarContextProps } from './types';
import { ChevronRightIcon } from '../../Icons';
import DropdownMenu from '../Layout/Dropdown';
import { SidebarAccountMenu } from '../Layout/utils/types';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from './Collapsible';

const SideBarContext = React.createContext<SidebarContextProps | null>(null);
const COLLAPSE_BREAKPOINT = 768;

function useSidebar() {
  const context = React.useContext(SideBarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider.');
  }

  return context;
}

const SideBarProvider = forwardRef<
  HTMLDivElement,
  ComponentProps<'div'> & {
    activeRoute?: string;
    defaultOpen?: boolean;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    sidebarWidth?: string;
    sidebarWidthIcon?: string;
    gradient?: boolean;
    isDefaultVariant?: boolean;
  }
>(
  (
    {
      activeRoute = '/',
      defaultOpen = true,
      open: openProp,
      onOpenChange: setOpenProp,
      className = '',
      style,
      children,
      sidebarWidth = '19rem',
      sidebarWidthIcon = '4.5rem',
      gradient = false,
      isDefaultVariant = false,
      ...props
    },
    ref,
  ) => {
    const [activeUrl, setActiveUrl] = useState(activeRoute);

    useEffect(() => {
      setActiveUrl(activeRoute);
    }, [activeRoute]);

    const [isOpen, setIsOpen] = useState(defaultOpen);

    useEffect(() => {
      if (openProp === undefined) {
        setIsOpen(defaultOpen);
      }
    }, [defaultOpen, openProp]);

    const open = openProp ?? isOpen;
    const userInteractedRef = useRef(false);

    const setOpen = useCallback(
      (value: boolean | ((value: boolean) => boolean)) => {
        userInteractedRef.current = true;
        const openState = typeof value === 'function' ? value(open) : value;
        if (setOpenProp) setOpenProp(openState);
        else setIsOpen(openState);
      },
      [setOpenProp, open],
    );

    const toggleSidebar = useCallback(
      () => setOpen((isSidebarOpen) => !isSidebarOpen),
      [setOpen],
    );

    const setSidebarState = useCallback(
      (state: 'expanded' | 'collapsed') => setOpen(state === 'expanded'),
      [setOpen],
    );

    useEffect(() => {
      const handleResize = () => {
        const isMobile = window.innerWidth < COLLAPSE_BREAKPOINT;

        // Only auto-change if user hasn't manually toggled since last layout change
        if (!userInteractedRef.current) {
          setSidebarState(isMobile ? 'collapsed' : 'expanded');
        }

        // Reset interaction when entering desktop mode again
        if (!isMobile) userInteractedRef.current = false;
      };

      handleResize();
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, [setSidebarState]);

    const state = open ? 'expanded' : 'collapsed';

    const contextValue = useMemo<SidebarContextProps>(
      () => ({
        activeUrl,
        setActiveUrl,
        state,
        open,
        setOpen,
        toggleSidebar,
        isDefaultVariant,
      }),
      [
        activeUrl,
        state,
        open,
        setActiveUrl,
        setOpen,
        toggleSidebar,
        isDefaultVariant,
      ],
    );

    return (
      <SideBarContext.Provider value={contextValue}>
        <div
          style={
            {
              '--sidebar-width': sidebarWidth,
              '--sidebar-width-icon': sidebarWidthIcon,
              ...style,
            } as React.CSSProperties
          }
          className={`${
            isDefaultVariant ? 'bg-fill-fill' : 'bg-layout-brand'
          } has-[[data-variant=floating]]:bg-layout-brand-light group/sidebar-wrapper relative flex h-screen min-h-svh w-full overflow-hidden ${
            gradient
              ? 'from-layout-filter-white-1 to-layout-filter-white-2 bg-gradient-to-b'
              : ''
          } ${className}`}
          ref={ref}
          {...props}
        >
          {children}
        </div>
      </SideBarContext.Provider>
    );
  },
);

const SideBar = forwardRef<
  HTMLDivElement,
  ComponentProps<'div'> & {
    variant?: 'sidebar' | 'floating' | 'inset';
    collapsible?: 'offcanvas' | 'icon';
  }
>(
  (
    {
      variant = 'sidebar',
      collapsible = 'offcanvas',
      className = '',
      children,
      ...props
    },
    ref,
  ) => {
    const { state, setOpen, isDefaultVariant } = useSidebar();
    const hoverOpenRef = useRef(false);
    const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const handleMouseEnter = useCallback(() => {
      if (collapsible === 'icon' && state === 'collapsed') {
        hoverTimeoutRef.current = setTimeout(() => {
          hoverOpenRef.current = true;
          setOpen(true);
        }, 150);
      }
    }, [collapsible, state, setOpen]);

    const handleMouseLeave = useCallback(() => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
        hoverTimeoutRef.current = null;
      }

      if (hoverOpenRef.current) {
        hoverOpenRef.current = false;
        setOpen(false);
      }
    }, [setOpen]);

    const handlePointerDown = useCallback(
      (
        event:
          | React.MouseEvent<HTMLDivElement>
          | React.TouchEvent<HTMLDivElement>,
      ) => {
        const target = (event.target as Element) || null;
        if (target) {
          hoverOpenRef.current = false;
          if (hoverTimeoutRef.current) {
            clearTimeout(hoverTimeoutRef.current);
            hoverTimeoutRef.current = null;
          }
        }
      },
      [],
    );

    // Cleanup timeout on unmount
    React.useEffect(
      () => () => {
        if (hoverTimeoutRef.current) {
          clearTimeout(hoverTimeoutRef.current);
        }
      },
      [],
    );

    return (
      <div
        ref={ref}
        className={`${isDefaultVariant ? 'text-text-text border-border-border-light border-r' : 'text-icon-on-fill'} group peer block`}
        data-state={state}
        data-collapsible={state === 'collapsed' ? collapsible : ''}
        data-variant={variant}
        data-side="left"
      >
        <div
          className={`relative w-[--sidebar-width] transition-[width] duration-200 ease-linear group-data-[collapsible=offcanvas]:w-0 ${
            variant === 'floating' || variant === 'inset'
              ? 'group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4))]'
              : 'group-data-[collapsible=icon]:w-[--sidebar-width-icon]'
          }`}
        />
        <div
          className={`fixed inset-y-0 left-0 z-10 flex h-svh w-[--sidebar-width] transition-[left,right,width] duration-200 ease-linear group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)] ${
            variant === 'floating' || variant === 'inset'
              ? 'group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4)_+2px)] group-data-[variant=floating]:!py-4 group-data-[variant=floating]:!pl-4 group-data-[variant=floating]:!pr-2'
              : 'group-data-[collapsible=icon]:w-[--sidebar-width-icon]'
          } ${className}`}
          {...props}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div
            data-sidebar="sidebar"
            className="group-data-[variant=floating]:bg-layout-brand group-data-[variant=floating]:!rounded-4xl flex h-full w-full flex-col group-data-[variant=floating]:shadow"
            onMouseDownCapture={handlePointerDown}
            onTouchStartCapture={handlePointerDown}
          >
            {children}
          </div>
        </div>
      </div>
    );
  },
);

const SideBarTrigger = forwardRef<
  HTMLButtonElement,
  ComponentProps<'button'> & {
    sidebarExpandIcon?: JSX.Element;
  }
>(({ className = '', onClick, sidebarExpandIcon, ...props }, ref) => {
  const { toggleSidebar, isDefaultVariant } = useSidebar();

  const icon = (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={isDefaultVariant ? 'fill-icon-icon' : 'fill-icon-on-fill'}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.7679 2.25H16.2321C17.0449 2.24999 17.7006 2.24999 18.2315 2.29336C18.7781 2.33803 19.2582 2.43239 19.7025 2.65873C20.4081 3.01825 20.9817 3.59193 21.3413 4.29754C21.5676 4.74175 21.662 5.2219 21.7066 5.76853C21.75 6.29944 21.75 6.95505 21.75 7.76788V16.2321C21.75 17.045 21.75 17.7006 21.7066 18.2315C21.662 18.7781 21.5676 19.2582 21.3413 19.7025C20.9817 20.4081 20.4081 20.9817 19.7025 21.3413C19.2582 21.5676 18.7781 21.662 18.2315 21.7066C17.7006 21.75 17.045 21.75 16.2321 21.75H7.76788C6.95505 21.75 6.29944 21.75 5.76853 21.7066C5.2219 21.662 4.74175 21.5676 4.29754 21.3413C3.59193 20.9817 3.01825 20.4081 2.65873 19.7025C2.43239 19.2582 2.33803 18.7781 2.29336 18.2315C2.24999 17.7006 2.24999 17.0449 2.25 16.2321V7.7679C2.24999 6.95506 2.24999 6.29944 2.29336 5.76853C2.33803 5.2219 2.43239 4.74175 2.65873 4.29754C3.01825 3.59193 3.59193 3.01825 4.29754 2.65873C4.74175 2.43239 5.2219 2.33803 5.76853 2.29336C6.29944 2.24999 6.95506 2.24999 7.7679 2.25ZM9.75 20.25H16.2C17.0525 20.25 17.6467 20.2494 18.1093 20.2116C18.5632 20.1745 18.824 20.1054 19.0215 20.0048C19.4448 19.789 19.789 19.4448 20.0048 19.0215C20.1054 18.824 20.1745 18.5632 20.2116 18.1093C20.2494 17.6467 20.25 17.0525 20.25 16.2V7.8C20.25 6.94755 20.2494 6.35331 20.2116 5.89068C20.1745 5.4368 20.1054 5.17604 20.0048 4.97852C19.789 4.55516 19.4448 4.21095 19.0215 3.99524C18.824 3.8946 18.5632 3.82547 18.1093 3.78838C17.6467 3.75058 17.0525 3.75 16.2 3.75H9.75L9.75 20.25ZM8.25 3.75L8.25 20.25H7.8C6.94755 20.25 6.35331 20.2494 5.89068 20.2116C5.4368 20.1745 5.17604 20.1054 4.97852 20.0048C4.55516 19.789 4.21095 19.4448 3.99524 19.0215C3.8946 18.824 3.82547 18.5632 3.78838 18.1093C3.75058 17.6467 3.75 17.0525 3.75 16.2V7.8C3.75 6.94755 3.75058 6.35331 3.78838 5.89068C3.82547 5.4368 3.8946 5.17604 3.99524 4.97852C4.21095 4.55516 4.55516 4.21095 4.97852 3.99524C5.17604 3.8946 5.4368 3.82547 5.89068 3.78838C6.35331 3.75058 6.94755 3.75 7.8 3.75H8.25ZM11.75 7C11.75 6.58579 12.0858 6.25 12.5 6.25H17.5C17.9142 6.25 18.25 6.58579 18.25 7C18.25 7.41421 17.9142 7.75 17.5 7.75H12.5C12.0858 7.75 11.75 7.41421 11.75 7ZM11.75 11C11.75 10.5858 12.0858 10.25 12.5 10.25H17.5C17.9142 10.25 18.25 10.5858 18.25 11C18.25 11.4142 17.9142 11.75 17.5 11.75H12.5C12.0858 11.75 11.75 11.4142 11.75 11ZM11.75 15C11.75 14.5858 12.0858 14.25 12.5 14.25H17.5C17.9142 14.25 18.25 14.5858 18.25 15C18.25 15.4142 17.9142 15.75 17.5 15.75H12.5C12.0858 15.75 11.75 15.4142 11.75 15Z"
      />
    </svg>
  );

  return (
    <button
      ref={ref}
      type="button"
      data-sidebar="trigger"
      className={`${className}`}
      onClick={(event) => {
        onClick?.(event);
        toggleSidebar();
      }}
      data-testid="collapsible-sidebar-button"
      {...props}
    >
      {sidebarExpandIcon ?? icon}
    </button>
  );
});

const SideBarInset = forwardRef<HTMLDivElement, ComponentProps<'main'>>(
  ({ className = '', ...props }, ref) => (
    <main
      ref={ref}
      className={`md:peer-data-[variant=floating]:!rounded-4xl relative 
      flex w-full min-w-0 flex-1 flex-col
       md:peer-data-[variant=inset]:m-2 md:peer-data-[state=collapsed]:peer-data-[variant=inset]:ml-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl
      md:peer-data-[variant=inset]:shadow ${className}
    `}
      {...props}
    />
  ),
);

const SideBarHeader = forwardRef<HTMLDivElement, ComponentProps<'div'>>(
  ({ className = '', ...props }, ref) => (
    <div
      ref={ref}
      data-sidebar="header"
      className={`group-data[variant=floating]:p-4 h-18 flex flex-col justify-center gap-2 pl-6 pr-4 group-data-[collapsible=icon]:pl-4  ${className}`}
      {...props}
    />
  ),
);

const SideBarFooter = forwardRef<HTMLDivElement, ComponentProps<'div'>>(
  ({ className = '', ...props }, ref) => (
    <div
      ref={ref}
      data-sidebar="footer"
      className={`flex flex-col items-center gap-2 ${className}`}
      {...props}
    />
  ),
);

const SideBarContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'>
>(({ className = '', ...props }, ref) => (
  <div
    ref={ref}
    data-sidebar="content"
    className={`flex min-h-0 flex-1 flex-col gap-2 overflow-auto p-4 group-data-[collapsible=icon]:overflow-hidden group-data-[variant=floating]:p-3 ${className}`}
    {...props}
  />
));

const SideBarSecondaryContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'>
>(({ className = '', ...props }, ref) => (
  <div
    ref={ref}
    data-sidebar="secondary-content"
    className={`layout-scroll flex min-h-0 flex-col gap-2 overflow-auto px-4 pt-9 ${className}`}
    {...props}
  />
));

const SideBarGroup = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'>
>(({ className = '', ...props }, ref) => (
  <div
    ref={ref}
    data-sidebar="group"
    className={`relative flex w-full min-w-0 flex-col ${className}`}
    {...props}
  />
));

const SideBarGroupContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'>
>(({ className = '', ...props }, ref) => (
  <div
    ref={ref}
    data-sidebar="group-content"
    className={`w-full ${className}`}
    {...props}
  />
));

const SideBarMenu = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<'ul'>
>(({ className = '', ...props }, ref) => (
  <ul
    ref={ref}
    data-sidebar="menu"
    className={`flex w-full min-w-0 flex-col ${className}`}
    {...props}
  />
));

const SideBarMenuItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<'li'>
>(({ className = '', ...props }, ref) => (
  <li
    ref={ref}
    data-sidebar="menu-item"
    className={`group/menu-item relative mb-2 ${className}`}
    {...props}
  />
));

const sideBarMenuButtonClassNames =
  'group/sidebar-button label-medium peer/menu-button flex w-full items-center gap-3 overflow-hidden rounded-md p-2 text-left outline-none ring-border-brand-focus-ring transition-[width,height,padding] disabled:pointer-events-none disabled:opacity-50 group-has-[[data-sidebar=menu-action]]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 group-data-[collapsible=icon]:!size-10 [&>svg]:shrink-0 h-10';

const SideBarMenuButton = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<'button'> & {
    asChild?: boolean;
    isActive?: boolean;
    hasCollapsible?: boolean;
  }
>(({ isActive = false, className = '', hasCollapsible, ...props }, ref) => {
  const { isDefaultVariant } = useSidebar();

  const hoverClassName = isDefaultVariant
    ? 'hover:bg-fill-action-light hover:text-text-action'
    : 'hover:bg-sidebar-button-active';

  const activeClassNamesWithoutCollapsible = `${isDefaultVariant ? 'data-[active=true]:text-text-action data-[active=true]:bg-fill-action-light' : 'data-[active=true]:bg-sidebar-button-active'} data-[active=true]:font-medium`;

  const activeClassNamesWithCollapsible = isDefaultVariant
    ? 'group-data-[collapsible=icon]:data-[active=true]:bg-fill-action-light group-data-[state=closed]/collapsible:data-[active=true]:bg-fill-action-light'
    : 'group-data-[collapsible=icon]:data-[active=true]:bg-sidebar-button-active group-data-[state=closed]/collapsible:data-[active=true]:bg-sidebar-button-active';

  const activeClassNames = hasCollapsible
    ? activeClassNamesWithCollapsible
    : activeClassNamesWithoutCollapsible;

  return (
    <button
      ref={ref}
      type="button"
      data-sidebar="menu-button"
      data-active={isActive}
      className={`${sideBarMenuButtonClassNames} ${activeClassNames} ${hoverClassName} ${className}`}
      {...props}
    />
  );
});

const SideBarMenuSub = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<'ul'>
>(({ className = '', ...props }, ref) => (
  <ul
    ref={ref}
    data-sidebar="menu-sub"
    className={`ml-8 flex min-w-0 translate-x-px flex-col gap-1 py-0.5 group-data-[collapsible=icon]:hidden ${className}`}
    {...props}
  />
));

const SideBarMenuSubItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<'li'>
>(({ ...props }, ref) => <li ref={ref} {...props} />);

const SideBarMenuSubButton = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<'button'> & {
    isActive?: boolean;
  }
>(({ isActive, className = '', ...props }, ref) => {
  const { isDefaultVariant } = useSidebar();

  return (
    <button
      ref={ref}
      type="button"
      data-sidebar="menu-sub-button"
      data-active={isActive}
      className={`
        '${isDefaultVariant ? 'text-text-text hover:bg-fill-action-light hover:text-text-action data-[active=true]:bg-fill-action-light data-[active=true]:text-text-action' : 'text-text-lighter hover:bg-sidebar-button-active data-[active=true]:bg-sidebar-button-active [&>span]:opacity-80 [&>span]:data-[active=true]:opacity-100'} label-medium ring-border-brand-focus-ring flex h-9 min-w-0 -translate-x-px items-center gap-2 overflow-hidden truncate rounded-md px-3 outline-none focus-visible:ring-2 data-[active=true]:font-medium group-data-[collapsible=icon]:hidden ${className}`}
      {...props}
    />
  );
});

function MenuIcon({
  className,
  isActive,
}: {
  className: string;
  isActive: boolean;
}) {
  const { isDefaultVariant } = useSidebar();

  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      data-active={isActive}
      className={`rounded-full ${isDefaultVariant ? 'fill-icon-icon hover:bg-fill-action-light hover:fill-icon-action data-[active=true]:bg-fill-action-light data-[active=true]:fill-icon-action' : 'fill-icon-on-fill data-[active=true]:bg-sidebar-account-bg hover:bg-sidebar-account-bg'} ${className}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12.001 16.1567C12.7373 16.1567 13.3339 16.7535 13.334 17.4897C13.334 18.2261 12.7374 18.8237 12.001 18.8237C11.2646 18.8237 10.668 18.2261 10.668 17.4897C10.6681 16.7535 11.2647 16.1567 12.001 16.1567ZM12.001 10.6665C12.7373 10.6665 13.3339 11.2632 13.334 11.9995C13.334 12.7359 12.7374 13.3335 12.001 13.3335C11.2646 13.3335 10.668 12.7359 10.668 11.9995C10.6681 11.2632 11.2647 10.6665 12.001 10.6665ZM12.001 5.17627C12.7373 5.17627 13.3339 5.77301 13.334 6.50928C13.334 7.24566 12.7374 7.84326 12.001 7.84326C11.2646 7.84326 10.668 7.24566 10.668 6.50928C10.6681 5.77301 11.2647 5.17627 12.001 5.17627Z" />
    </svg>
  );
}

function DefaultIcon() {
  const { isDefaultVariant } = useSidebar();

  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      data-default={isDefaultVariant}
      xmlns="http://www.w3.org/2000/svg"
      className="data-[default=true]:stroke-icon-icon stroke-icon-on-fill"
    >
      <path
        d="M12.001 3.69922C14.4666 3.69922 16.4688 5.70414 16.4688 8.18164C16.4687 10.6591 14.4665 12.6641 12.001 12.6641C9.53546 12.664 7.53324 10.6591 7.5332 8.18164C7.5332 5.70418 9.53544 3.69928 12.001 3.69922Z"
        strokeWidth="1.5"
      />
      <path
        d="M3.77025 21.0251L3.77004 19.4417C3.76976 17.2218 5.57725 15.4263 7.79712 15.4413L16.2589 15.4986C18.4572 15.5135 20.2316 17.2996 20.2318 19.498L20.232 21.0514"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

const SideBarAccountSectionDropdown = React.forwardRef<
  HTMLDivElement,
  Readonly<
    ComponentProps<'div'> & {
      options: SidebarAccountMenu;
      onMenuButtonClick: (url: string) => void;
    }
  >
>(({ options, onMenuButtonClick, className }, ref) => (
  <DropdownMenu
    className={`absolute bottom-0 right-[-180px] z-50 w-[170px] !rounded-2xl shadow-sm ${className}`}
    ref={ref}
  >
    <DropdownMenu.Group>
      {options.map((option, index) => (
        <DropdownMenu.Item
          className={` ${index === 0 ? 'pt-[10px]' : ''}`}
          key={option.title}
          onClick={(e) => {
            // TODO: onMenuButtonClick needs to be removed as its deprecated could be replaced by onClick in option
            onMenuButtonClick(option.url || '');
            option.onClick?.(e);
          }}
        >
          <option.icon className={`h-6 w-6 ${option.iconClassName}`} />
          <DropdownMenu.Text className={option.textClassName}>
            {option.title}
          </DropdownMenu.Text>
        </DropdownMenu.Item>
      ))}
    </DropdownMenu.Group>
  </DropdownMenu>
));

function SideBarAccountSection({
  className = '',
  userImage,
  userName,
  userEmail,
  dropdownOptions,
  onDropdownMenuClick,
  sidebarAccountMenuClassName = '',
  ...props
}: {
  userImage?: JSX.Element;
  userName: string;
  userEmail: string;
  dropdownOptions?: SidebarAccountMenu;
  onDropdownMenuClick?: (url: string) => void;
  sidebarAccountMenuClassName?: string;
} & React.ComponentProps<'div'>) {
  const [showAccountSectionDropdown, setShowAccountSectionDropdown] =
    useState(false);
  const accountSectionRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showAccountSectionDropdown) return;

    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      const clickedOnAccountSection =
        !!accountSectionRef.current?.contains(target);
      const clickedOnDropdown = !!dropdownRef.current?.contains(target);

      if (!clickedOnAccountSection && !clickedOnDropdown) {
        setShowAccountSectionDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
  }, [showAccountSectionDropdown]);

  const { isDefaultVariant } = useSidebar();

  return (
    <div
      ref={accountSectionRef}
      data-sidebar="account-section"
      data-default={isDefaultVariant}
      className={`${className} relative w-full`}
      {...props}
    >
      <SideBarMenu>
        <SideBarMenuItem>
          <div className="!h-18 flex gap-2 rounded-xl p-4 group-data-[variant=floating]:p-3.5">
            <div
              className={`border-border-border-light flex size-10 shrink-0 items-center justify-center rounded-full group-data-[variant=floating]:size-[2.375rem] ${!userImage ? 'data-[default=true]:bg-fill-fill-dark bg-sidebar-account-bg' : ''}`}
            >
              {userImage ?? <DefaultIcon />}
            </div>
            <div className="grid h-full flex-1 items-start text-left leading-tight group-data-[collapsible=icon]:hidden">
              <span className="label-medium truncate font-medium">
                {userName}
              </span>
              <span className="label-small truncate">{userEmail}</span>
            </div>
            <div className="flex items-start group-data-[collapsible=icon]:hidden">
              <button
                type="button"
                onClick={() => setShowAccountSectionDropdown((prev) => !prev)}
              >
                <MenuIcon
                  className="ml-auto"
                  isActive={showAccountSectionDropdown}
                />
              </button>
            </div>
          </div>
        </SideBarMenuItem>
      </SideBarMenu>
      {showAccountSectionDropdown && dropdownOptions && (
        <SideBarAccountSectionDropdown
          ref={dropdownRef}
          options={dropdownOptions}
          onMenuButtonClick={(url) => {
            onDropdownMenuClick?.(url);
            setShowAccountSectionDropdown(false);
          }}
          className={`${sidebarAccountMenuClassName} mb-2`}
        />
      )}
    </div>
  );
}

const SideBarDefaultMenu = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'> & {
    navItems: NavItem[];
    onMenuButtonClick: (url: string) => void;
  }
>(({ className = '', navItems, onMenuButtonClick, ...props }, ref) => {
  const defaultNavItemHighlightBehavior: HighlightBehavior = 'hover-and-active';
  const { isDefaultVariant, activeUrl, setActiveUrl, state, setOpen } =
    useSidebar();

  const getFirstUrlPath = useMemo(() => {
    if (activeUrl === '/') return '/';

    const segments = activeUrl.split('/');
    if (segments.length > 1) {
      return `/${segments[1]}`;
    }

    throw new Error('Invalid URL path');
  }, [activeUrl]);

  const getSecondUrlPath = useMemo(() => {
    const segments = activeUrl.split('/');

    if (segments.length > 2) {
      return `/${segments[2]}`;
    }
    if (segments.length > 1) {
      return `/${segments[1]}`;
    }
    return '';
  }, [activeUrl]);

  return (
    <div ref={ref} data-sidebar="default-menu" className={className} {...props}>
      <SideBarMenu>
        {navItems.map((item) => {
          const isItemHoverAndActive =
            item.highlightBehavior === defaultNavItemHighlightBehavior ||
            !item.highlightBehavior;
          const isItemActive =
            (isItemHoverAndActive && item.url === getFirstUrlPath) ||
            item.items?.some((subItem) => subItem.url === getFirstUrlPath);

          const subTotal =
            item.items?.reduce(
              (sum, sub) => sum + (sub.notification ?? 0),
              0,
            ) ?? 0;
          return item.items && item.items.length > 0 ? (
            <Collapsible
              key={item.title}
              defaultOpen={item.url === getFirstUrlPath}
              className="group/collapsible"
            >
              <SideBarMenuItem>
                <CollapsibleTrigger>
                  <SideBarMenuButton hasCollapsible isActive={isItemActive}>
                    {item.icon && (
                      <item.icon
                        className={`${
                          isItemActive &&
                          state === 'collapsed' &&
                          isDefaultVariant
                            ? item.iconActiveClassName
                            : item.iconClassName
                        } ${item.iconHoverClassName ?? ''}`}
                      />
                    )}

                    <span className="flex-1 truncate">{item.title}</span>

                    {subTotal > 0 && (
                      <div className="bg-icon-action text-icon-on-fill label-medium ml-auto flex h-6 min-w-6 items-center justify-center rounded-lg px-[4.5px] py-[3px] group-data-[state=open]/collapsible:hidden">
                        {subTotal <= 99 ? subTotal : `99+`}
                      </div>
                    )}
                    <ChevronRightIcon
                      className={`${isDefaultVariant ? '[&_path]:fill-icon-icon group-hover/sidebar-button:[&_path]:fill-fill-action' : '[&_path]:fill-icon-on-fill'} ml-auto opacity-[.64] transition-transform duration-200 group-data-[collapsible=icon]:hidden group-data-[state=open]/collapsible:rotate-90 group-data-[state=open]/collapsible:opacity-100`}
                    />
                  </SideBarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SideBarMenuSub>
                    {item.items?.map((subItem) => {
                      const isSubItemHoverAndActive =
                        subItem.highlightBehavior ===
                          defaultNavItemHighlightBehavior ||
                        !subItem.highlightBehavior;
                      const isSubItemActive =
                        isSubItemHoverAndActive &&
                        subItem.url === getSecondUrlPath;

                      return (
                        <SideBarMenuSubItem key={subItem.title}>
                          <SideBarMenuSubButton
                            isActive={isSubItemActive}
                            className="w-full"
                            onClick={() => {
                              const actualUrl = item.url
                                ? item.url + subItem.url
                                : subItem.url;
                              if (isSubItemHoverAndActive) {
                                setActiveUrl(actualUrl);
                              }
                              onMenuButtonClick(actualUrl);
                              // Close sidebar automatically on mobile
                              if (window.innerWidth < COLLAPSE_BREAKPOINT) {
                                setOpen(false);
                              }
                            }}
                          >
                            <span className="opacity-80">{subItem.title}</span>
                            {subItem.notification !== undefined &&
                              subItem.notification > 0 && (
                                <div className="bg-icon-action text-icon-on-fill label-medium !mr-8 ml-auto flex h-6 min-w-6 items-center justify-center rounded-lg px-[4.5px] py-[3px]">
                                  {subItem.notification <= 99
                                    ? subItem.notification
                                    : `99+`}
                                </div>
                              )}
                          </SideBarMenuSubButton>
                        </SideBarMenuSubItem>
                      );
                    })}
                  </SideBarMenuSub>
                </CollapsibleContent>
              </SideBarMenuItem>
            </Collapsible>
          ) : (
            <SideBarMenuItem key={item.title}>
              <SideBarMenuButton
                isActive={isItemActive}
                onClick={() => {
                  if (isItemHoverAndActive) {
                    setActiveUrl(item.url || '');
                  }
                  onMenuButtonClick(item.url || '');
                  // Auto-close sidebar on mobile
                  if (window.innerWidth < COLLAPSE_BREAKPOINT) {
                    setOpen(false);
                  }
                }}
              >
                <item.icon
                  className={`${isItemActive && isDefaultVariant ? item.iconActiveClassName : item.iconClassName} ${item.iconHoverClassName ?? ''} `}
                />
                <span className="flex-1 truncate">{item.title}</span>
                {item.notification !== undefined && item.notification > 0 && (
                  <div
                    className={`bg-icon-action text-icon-on-fill label-medium  ${item.notification > 9 ? '!mr-[2.125rem]' : '!mr-[2.375rem]'} ml-auto  flex h-6 min-w-6 items-center justify-center rounded-lg px-[4.5px] py-[3px]`}
                  >
                    {item.notification <= 99 ? item.notification : `99+`}
                  </div>
                )}
              </SideBarMenuButton>
            </SideBarMenuItem>
          );
        })}
      </SideBarMenu>
    </div>
  );
});

const SideBarHeaderContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<'div'> & {
    logo: {
      expanded: React.ComponentType<React.SVGAttributes<SVGElement>>;
      collapsed: React.ComponentType<React.SVGAttributes<SVGElement>>;
      expandedClassName?: string;
      collapsedClassName?: string;
    };
  }
>(
  (
    {
      className = '',
      logo: {
        expanded: ExpandedLogo,
        collapsed: CollapsedLogo,
        expandedClassName,
        collapsedClassName,
      },
      ...props
    },
    ref,
  ) => {
    const { state } = useSidebar();
    const isCollapsed = state === 'collapsed';
    return (
      <div
        className={`flex items-center justify-between ${className}`}
        ref={ref}
        {...props}
      >
        {isCollapsed ? (
          <CollapsedLogo
            className={`group-data-[variant=floating]:size-8 ${collapsedClassName}`}
          />
        ) : (
          <ExpandedLogo className={`${expandedClassName}`} />
        )}
        {!isCollapsed && <SideBarTrigger />}
      </div>
    );
  },
);

export {
  SideBarProvider,
  SideBar,
  SideBarTrigger,
  SideBarInset,
  SideBarHeader,
  SideBarFooter,
  SideBarContent,
  SideBarSecondaryContent,
  SideBarGroup,
  SideBarGroupContent,
  SideBarMenu,
  SideBarMenuItem,
  SideBarMenuButton,
  SideBarMenuSub,
  SideBarMenuSubItem,
  SideBarMenuSubButton,
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
  SideBarAccountSection,
  SideBarDefaultMenu,
  SideBarHeaderContent,
  SideBarAccountSectionDropdown,
  useSidebar,
};
