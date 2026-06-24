import { forwardRef, ReactNode } from 'react';

/**
 * Avatar component to display user images or initials.
 * Accessibility: Hidden from screen readers unless an \`alt\` prop is provided.
 */
export interface AvatarProp {
  className?: string;
  size: 'lg' | 'md' | 'sm';
  shape?: 'circle' | 'square';
  /** Alternative text for screen readers. If omitted, avatar is hidden from assistive tech. */
  alt?: string;
  src?: string;
  children?: ReactNode;
  backgroundColor?: string;
  showBorder?: boolean;
  testId?: string;
  imgClassName?: string;
}

export const Avatar = forwardRef<HTMLDivElement, AvatarProp>(
  (
    {
      className = '',
      size = 'lg',
      alt = '',
      src = '',
      shape = 'circle',
      children = '',
      backgroundColor = '',
      showBorder = false,
      testId = 'avatarTestId',
      imgClassName = '',
    },
    ref,
  ) => {
    const sizeClassNames = {
      lg: 'h-10 w-10',
      md: 'h-8 w-8',
      sm: 'h-6 w-6',
    };

    return (
      <div
        className={`${className} ${backgroundColor} ${sizeClassNames[size]} ${showBorder ? 'border-border-border-light border border-solid ' : ''} ${shape === 'circle' ? 'rounded-full' : ''} flex items-center justify-center`}
        ref={ref}
        data-testid={testId}
        aria-hidden={!alt ? true : undefined}
      >
        {src ? <img src={src} alt={alt} className={imgClassName} /> : children}
      </div>
    );
  },
);
