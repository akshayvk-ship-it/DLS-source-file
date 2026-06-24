import React from 'react';
import getColors from './helper';

export interface ListCellProps {
  rounded?: boolean;
  highEmphasis?: boolean;
  outlined?: boolean;
  prefixElement?: JSX.Element | undefined;
  customContent?: JSX.Element;
  suffixElement?: JSX.Element;
  active: boolean;
  onClick: (
    event:
      | React.MouseEvent<HTMLDivElement>
      | React.KeyboardEvent<HTMLDivElement>,
    content: string,
  ) => void;
  title: string;
  textClassName?: string;
  wrapperClassName?: string;
  suffixElementClassName?: string;
  showTick?: boolean;
  prefixElementClassName?: string;
}

export const ListCell = React.forwardRef<HTMLDivElement, ListCellProps>(
  (
    {
      rounded = false,
      highEmphasis = false,
      outlined = false,
      prefixElement,
      customContent,
      suffixElement,
      active,
      onClick,
      title,
      textClassName = '',
      wrapperClassName = '',
      prefixElementClassName = '',
      suffixElementClassName = '',
      showTick = false,
    },
    ref,
  ) => {
    function handleClick(
      event:
        | React.MouseEvent<HTMLDivElement>
        | React.KeyboardEvent<HTMLDivElement>,
      content: string,
    ) {
      onClick(event, content);
    }

    const onKeyDown = (
      e: React.KeyboardEvent<HTMLDivElement>,
      content: string,
    ) => {
      if (e.key === 'Enter') {
        handleClick(e, content);
      }
    };

    const baseClass =
      'label-regular flex cursor-default select-none px-4 py-2 ';

    return (
      <div
        ref={ref}
        className={` ${wrapperClassName} ${customContent ? ` h-auto w-auto` : ' h-10 '} text-text-text ${rounded ? ' rounded-lg' : ''} ${getColors(highEmphasis, outlined, active)} ${baseClass} `}
        onClick={(e) => handleClick(e, title)}
        role="button"
        onKeyDown={(e) => onKeyDown(e, title)}
        tabIndex={0}
      >
        {prefixElement && (
          <div className={` ${prefixElementClassName}`}>{prefixElement}</div>
        )}
        <div className={`${textClassName} ${prefixElement ? `ml-4` : ``}`}>
          {customContent || title}
        </div>
        {suffixElement && (
          <div
            className={` ${suffixElementClassName} ml-4 ${showTick && active ? `mr-2` : ``}`}
          >
            {suffixElement}
          </div>
        )}
        {showTick && active ? (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={` ${customContent ? `ml-2 ` : ``} ml-auto`}
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M17.1253 7.55237C17.5158 7.94289 17.5158 8.57606 17.1253 8.96658L10.2443 15.8475C9.85487 16.237 9.22379 16.2382 8.83284 15.8502L5.75637 12.7973C5.36435 12.4082 5.36192 11.7751 5.75095 11.3831C6.13997 10.991 6.77313 10.9886 7.16515 11.3776L9.53453 13.7289L15.7111 7.55236C16.1016 7.16184 16.7348 7.16184 17.1253 7.55237Z"
              className={`${highEmphasis ? ` fill-icon-on-fill-action-pressed` : ` fill-icon-pressed`}`}
            />
          </svg>
        ) : undefined}
      </div>
    );
  },
);
