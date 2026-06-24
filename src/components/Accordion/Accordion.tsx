import React, { useState, useId } from 'react';

/**
 * Accordion component for displaying collapsible content panels.
 * Meets WCAG accessibility guidelines by providing appropriate ARIA roles,
 * states, and keyboard navigation support.
 */
export interface AccordionProps {
  header: string;
  description: string;
  prefixElement?: JSX.Element;
  prefixElementClassName?: string;
  headerClassName?: string;
  descriptionClassName?: string;
  wrapperClassName?: string;
  open?: boolean;
  clickHandler?: (
    event:
      | React.MouseEvent<HTMLDivElement>
      | React.KeyboardEvent<HTMLDivElement>,
  ) => void;
  dataTestId?: string;
  size?: 'lg' | 'sm';
  id?: string;
}

function DownIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.53033 11.5303C8.23744 11.8232 7.76256 11.8232 7.46967 11.5303L1.46967 5.53033C1.17678 5.23744 1.17678 4.76256 1.46967 4.46967C1.76256 4.17678 2.23744 4.17678 2.53033 4.46967L8 9.93934L13.4697 4.46967C13.7626 4.17678 14.2374 4.17678 14.5303 4.46967C14.8232 4.76256 14.8232 5.23744 14.5303 5.53033L8.53033 11.5303Z"
        fill="#3B475B"
      />
    </svg>
  );
}

function UpIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.46967 4.46967C7.76256 4.17678 8.23744 4.17678 8.53033 4.46967L14.5303 10.4697C14.8232 10.7626 14.8232 11.2374 14.5303 11.5303C14.2374 11.8232 13.7626 11.8232 13.4697 11.5303L8 6.06066L2.53033 11.5303C2.23744 11.8232 1.76256 11.8232 1.46967 11.5303C1.17678 11.2374 1.17678 10.7626 1.46967 10.4697L7.46967 4.46967Z"
        fill="#3B475B"
      />
    </svg>
  );
}
export const Accordion = React.forwardRef<HTMLDivElement, AccordionProps>(
  (
    {
      header,
      description,
      prefixElement,
      open,
      prefixElementClassName = '',
      headerClassName = '',
      descriptionClassName = '',
      wrapperClassName = '',
      clickHandler,
      dataTestId = 'defaultAccordionTestId',
      size = 'sm',
      id,
    },
    ref,
  ) => {
    const [isActive, setIsActive] = useState(open || false);
    const expanded = open ?? isActive;

    const generatedId = useId();
    const accordionId = id || generatedId;
    const headerId = `${accordionId}-header`;
    const panelId = `${accordionId}-panel`;

    const handleClick = (
      event:
        | React.MouseEvent<HTMLDivElement>
        | React.KeyboardEvent<HTMLDivElement>,
    ) => {
      if (open === undefined) {
        setIsActive(!isActive);
      } else {
        clickHandler!(event);
      }
    };
    const keyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleClick(e);
      }
    };

    const icon = (
      <span className="ml-2">{expanded ? UpIcon() : DownIcon()}</span>
    );

    return (
      <div
        ref={ref}
        data-testid={dataTestId}
        className={`border-border-border-light relative flex flex-col items-start justify-center border-b ${wrapperClassName}`}
      >
        <div
          id={headerId}
          onClick={handleClick}
          onKeyDown={keyDown}
          role="button"
          tabIndex={0}
          aria-expanded={expanded}
          aria-controls={panelId}
          className={`${expanded && description ? 'mb-4' : 'mb-[0.938rem]'} flex w-full cursor-pointer flex-row items-center justify-center`}
        >
          {prefixElement && (
            <div className={`mr-2 ${prefixElementClassName}`}>
              {prefixElement}
            </div>
          )}
          <div
            className={`text-text-dark ${size === 'sm' ? 'label-medium h-5' : 'label-large h-6'}  flex  w-full flex-row items-center justify-between font-medium ${headerClassName} `}
          >
            {header}
            {icon}
          </div>
        </div>
        {expanded && description ? (
          <div
            id={panelId}
            role="region"
            aria-labelledby={headerId}
            className={`text-text-text ${size === 'sm' ? 'label-small' : 'label-medium'}  mb-[0.938rem]  w-full ${descriptionClassName}  ${prefixElement ? 'pl-6 ' : ''}`}
          >
            {description}
          </div>
        ) : undefined}
      </div>
    );
  },
);
