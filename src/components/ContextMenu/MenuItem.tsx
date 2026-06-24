import { MenuItemProps } from './types';

// eslint-disable-next-line import/prefer-default-export
export function MenuItem({
  children,
  onClick,
  menuItemClassName = '',
  onMouseEnter,
  onMouseLeave,
}: Readonly<MenuItemProps>) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick?.(e);
    }
  };

  return (
    <div
      role="menuitem"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      className={`${menuItemClassName} hover:bg-fill-hover active:bg-fill-pressed-dark flex cursor-pointer items-center gap-4 px-2 py-2.5`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </div>
  );
}
