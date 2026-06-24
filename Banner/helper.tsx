import React from 'react';
import errorIcon from '../../icons/errorIcon';
import errorIconEmphasis from '../../icons/errorIconEmphasis';
import infoIcon from '../../icons/infoIcon';
import infoIconEmphasis from '../../icons/infoIconEmphasis';
import successIconEmphasis from '../../icons/successIconEmphasis';
import warningIconEmphasis from '../../icons/warningIconEmphasis';

function successIcon() {
  return (
    <svg
      width="20"
      height="24"
      viewBox="0 0 20 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="10" cy="12" r="10" fill="#17B26A" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M13.6776 9.03591C13.9379 9.29626 13.9379 9.71837 13.6776 9.97872L9.09024 14.566C8.8306 14.8257 8.40988 14.8265 8.14924 14.5678L6.09826 12.5325C5.83692 12.2732 5.8353 11.851 6.09465 11.5897C6.354 11.3284 6.77611 11.3267 7.03745 11.5861L8.61704 13.1536L12.7347 9.03591C12.9951 8.77556 13.4172 8.77556 13.6776 9.03591Z"
        fill="#1B2029"
      />
    </svg>
  );
}

function warningIcon() {
  return (
    <svg
      width="20"
      height="24"
      viewBox="0 0 20 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="10" cy="12" r="10" fill="#FFC533" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10.0243 13.6722C9.638 13.6722 9.32483 13.9854 9.32483 14.3717C9.32483 14.758 9.638 15.0712 10.0243 15.0712C10.4107 15.0712 10.7238 14.758 10.7238 14.3717C10.7238 13.9854 10.4107 13.6722 10.0243 13.6722ZM9.33334 12.3947C9.3349 12.7629 9.63464 13.0601 10.0028 13.0585C10.371 13.0569 10.6682 12.7572 10.6667 12.389L10.6515 8.80587C10.6499 8.43769 10.3502 8.14048 9.98197 8.14204C9.61379 8.1436 9.31658 8.44334 9.31814 8.81153L9.33334 12.3947Z"
        fill="#3B475B"
      />
    </svg>
  );
}

export type BannerTypes = 'Info' | 'Error' | 'Success' | 'Warning';

export interface BtnProps {
  label: string;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export function getColors(type: BannerTypes, emphasis: boolean) {
  const colors = {
    Emphasis: {
      Error: 'bg-fill-error border-border-error',
      Info: 'bg-fill-info',
      Success: 'bg-fill-success border-border-success',
      Warning: 'bg-fill-caution border-border-caution',
    },
    noEmphasis: {
      Error: 'bg-fill-error-light border-border-error-light',
      Info: 'bg-fill-info-light border-border-info-light',
      Success: 'bg-fill-success-light border-border-success-light',
      Warning: 'bg-fill-caution-light border-border-caution-light',
    },
  };

  return `${colors[emphasis ? 'Emphasis' : 'noEmphasis'][type]} ${emphasis && type !== 'Warning' ? 'text-text-on-fill' : 'text-text-dark'}`;
}

type StatusTypes = 'Info' | 'Error' | 'Success' | 'Warning';

export function renderIcon(type: StatusTypes, emphasis?: boolean) {
  const icon: Record<StatusTypes, JSX.Element> = {
    Error: emphasis ? errorIconEmphasis() : errorIcon(),
    Info: emphasis ? infoIconEmphasis() : infoIcon(),
    Success: emphasis ? successIconEmphasis() : successIcon(),
    Warning: emphasis ? warningIconEmphasis() : warningIcon(),
  };

  return (
    <div
      className="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full"
      aria-hidden="true"
    >
      {icon[type]}
    </div>
  );
}
