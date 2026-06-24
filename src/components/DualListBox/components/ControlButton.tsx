/* eslint-disable import/prefer-default-export */
import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ControlButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: ReactNode;
}

export function ControlButton({
  icon,
  onClick,
  disabled,
  'aria-label': ariaLabel,
}: Readonly<ControlButtonProps>) {
  return (
    <button
      type="button"
      className="bg-fill-fill-dark active:bg-fill-action-lighter-pressed hover:bg-fill-action-light disabled:bg-fill-fill-dark group/dual-list-box-control flex size-10 items-center justify-center rounded-lg disabled:cursor-not-allowed"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
    >
      {icon}
    </button>
  );
}
