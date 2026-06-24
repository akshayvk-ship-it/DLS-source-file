import { forwardRef } from 'react';

import BackSvg from '../../icons/BackSVG';

export interface BackToButtonProps {
  title: string;
  onClick: () => void;
  className?: string;
  backIcon?: JSX.Element;
  titleClassName?: string;
}

export const BackToButton = forwardRef<HTMLButtonElement, BackToButtonProps>(
  ({ onClick, title, backIcon, className = '', titleClassName = '' }, ref) => (
    <button
      type="button"
      className={`${className} flex h-6 items-center`}
      onClick={onClick}
      ref={ref}
    >
      {backIcon || <BackSvg />}
      <span
        className={`${titleClassName} text-text-action label-small ml-2 font-semibold`}
      >
        {title}
      </span>
    </button>
  ),
);
