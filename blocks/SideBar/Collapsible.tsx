import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

interface CollapsibleContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  toggle: () => void;
  disabled?: boolean;
}

const CollapsibleContext = createContext<CollapsibleContextValue>({
  open: false,
  setOpen: () => {},
  toggle: () => {},
  disabled: false,
});

function useCollapsible() {
  const context = useContext(CollapsibleContext);
  if (!context) {
    throw new Error('Collapsible components must be used within a Collapsible');
  }
  return context;
}

// Main Collapsible Component
interface CollapsibleProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
}

export const Collapsible = forwardRef<HTMLDivElement, CollapsibleProps>(
  (
    {
      defaultOpen = false,
      open: controlledOpen,
      onOpenChange,
      disabled = false,
      children,
      ...props
    },
    ref,
  ) => {
    const [internalOpen, setInternalOpen] = useState(defaultOpen);
    const isControlled = controlledOpen !== undefined;
    const open = isControlled ? controlledOpen : internalOpen;

    const handleSetOpen = useCallback(
      (newOpen: boolean) => {
        if (disabled) return;
        if (!isControlled) setInternalOpen(newOpen);
        onOpenChange?.(newOpen);
      },
      [disabled, isControlled, onOpenChange],
    );

    const handleToggle = useCallback(
      () => handleSetOpen(!open),
      [open, handleSetOpen],
    );

    const contextValue = useMemo<CollapsibleContextValue>(
      () => ({
        open,
        setOpen: handleSetOpen,
        toggle: handleToggle,
        disabled,
      }),
      [open, handleSetOpen, handleToggle, disabled],
    );

    return (
      <CollapsibleContext.Provider value={contextValue}>
        <div
          ref={ref}
          data-state={open ? 'open' : 'closed'}
          data-disabled={disabled || undefined}
          {...props}
        >
          {children}
        </div>
      </CollapsibleContext.Provider>
    );
  },
);

interface CollapsibleTriggerProps extends React.HTMLAttributes<HTMLDivElement> {
  disabled?: boolean;
}

export const CollapsibleTrigger = forwardRef<
  HTMLDivElement,
  CollapsibleTriggerProps
>(({ onClick, children, disabled, ...props }, ref) => {
  const { toggle, open } = useCollapsible();

  const handleClick: React.MouseEventHandler<HTMLDivElement> = (event) => {
    onClick?.(event);
    if (!event.defaultPrevented && !disabled) {
      toggle();
    }
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (event) => {
    if (disabled) return;

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault(); // prevent page scroll on Space
      toggle();
    }
  };

  return (
    <div
      ref={ref}
      role="button"
      tabIndex={0}
      data-state={open ? 'open' : 'closed'}
      aria-disabled={disabled}
      aria-expanded={open}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className="w-full"
      {...props}
    >
      {children}
    </div>
  );
});

interface CollapsibleContentProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export const CollapsibleContent = forwardRef<
  HTMLDivElement,
  CollapsibleContentProps
>(({ children, style, ...props }, ref) => {
  const { open } = useCollapsible();
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | undefined>(
    open ? undefined : 0,
  );
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    if (open) {
      setIsAnimating(true);
      setHeight(el.scrollHeight);
      const timer = setTimeout(() => {
        setHeight(undefined);
        setIsAnimating(false);
      }, 200);
      // eslint-disable-next-line consistent-return
      return () => clearTimeout(timer);
    }

    setIsAnimating(true);
    setHeight(el.scrollHeight);
    setHeight(0);

    const timer = setTimeout(() => {
      setIsAnimating(false);
    }, 200);
    // eslint-disable-next-line consistent-return
    return () => clearTimeout(timer);
  }, [open]);

  const contentStyle: React.CSSProperties = {
    height: height !== undefined ? `${height}px` : undefined,
    overflow: 'hidden',
    transition: isAnimating ? 'height 200ms ease-out' : undefined,
    ...style,
  };

  return (
    <div
      ref={ref || contentRef}
      data-state={open ? 'open' : 'closed'}
      style={contentStyle}
      {...props}
    >
      <div>{children}</div>
    </div>
  );
});
