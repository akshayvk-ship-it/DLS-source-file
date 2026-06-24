import React from 'react';

export interface SelectionControlsLabelProps {
  children: React.ReactNode;
  text: string;
  htmlFor?: string;
  supportText?: string;
  disabled?: boolean;
  className?: string;
  textClassName?: string;
  supportTextClassName?: string;
}

export function Label({
  htmlFor,
  children,
  text,
  textClassName = '',
  supportTextClassName = '',
  supportText,
  disabled = false,
  className = '',
}: SelectionControlsLabelProps) {
  return (
    <label
      htmlFor={htmlFor}
      className={`${className} flex space-x-2 ${disabled ? 'text-text-disabled cursor-not-allowed' : 'text-text-dark'}`}
      tabIndex={-1}
    >
      <div className={`${!supportText ? 'flex items-center' : 'mt-1'}`}>
        {children}
      </div>
      <div className="flex flex-col justify-center">
        <span className={`${textClassName} label-medium font-medium`}>
          {text}
        </span>
        {supportText && (
          <p
            className={`${supportTextClassName} paragraph-small ${disabled ? 'text-text-disabled' : 'text-text-text'} font-normal`}
          >
            {supportText}
          </p>
        )}
      </div>
    </label>
  );
}
