import { forwardRef } from 'react';
import { InlineStyle, MenuDropdownClasses } from '../types';

export interface MenuDropdownProps {
  dropdownKey: string;
  title: string;
  showIcon?: boolean;
  customIcon?: JSX.Element;
  showNotification?: number;
  active: boolean;
  isExpandable: boolean;
  menuClickHandler: (
    e:
      | React.MouseEvent<HTMLButtonElement>
      | React.KeyboardEvent<HTMLButtonElement>,
    dropdownKey: string,
  ) => void;
  isExpanded?: boolean;
  menuDropdownClassName?: string;
  customInlineStyle?: InlineStyle;
  isSidebarVisible: boolean;
  menuDropDownClasses?: MenuDropdownClasses;
}

export const MenuDropdown = forwardRef<HTMLButtonElement, MenuDropdownProps>(
  (
    {
      dropdownKey,
      title,
      customIcon,
      showIcon = false,
      showNotification,
      active,
      isExpandable,
      menuClickHandler,
      isExpanded = false,
      menuDropdownClassName = '',
      customInlineStyle = {},
      isSidebarVisible,
      menuDropDownClasses = {},
    },
    ref,
  ) => {
    const leftArrow = (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M23.7803 11.4697C24.0732 11.7626 24.0732 12.2374 23.7803 12.5303L17.7803 18.5303C17.4874 18.8232 17.0126 18.8232 16.7197 18.5303C16.4268 18.2374 16.4268 17.7626 16.7197 17.4697L22.1893 12L16.7197 6.53033C16.4268 6.23744 16.4268 5.76256 16.7197 5.46967C17.0126 5.17678 17.4874 5.17678 17.7803 5.46967L23.7803 11.4697Z"
          fill="#3B475B"
        />
      </svg>
    );

    const downArrow = (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clipPath="url(#clip0_5038_14060)">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M17.7803 15.5303C17.4874 15.8232 17.0126 15.8232 16.7197 15.5303L10.7197 9.53033C10.4268 9.23744 10.4268 8.76256 10.7197 8.46967C11.0126 8.17678 11.4874 8.17678 11.7803 8.46967L17.25 13.9393L22.7197 8.46967C23.0126 8.17678 23.4874 8.17678 23.7803 8.46967C24.0732 8.76256 24.0732 9.23744 23.7803 9.53033L17.7803 15.5303Z"
            fill="#3B475B"
          />
        </g>
        <defs>
          <clipPath id="clip0_5038_14060">
            <rect width="24" height="24" fill="white" />
          </clipPath>
        </defs>
      </svg>
    );

    const buttonClickHandler = (
      e:
        | React.MouseEvent<HTMLButtonElement>
        | React.KeyboardEvent<HTMLButtonElement>,
    ) => {
      menuClickHandler(e, dropdownKey);
    };

    return (
      <button
        className={`${menuDropdownClassName || ''}  hover:bg-fill-hover  flex w-full cursor-pointer items-center justify-between rounded-lg px-4 py-2 ${active ? 'bg-fill-pressed-dark' : ''} ${!isSidebarVisible ? '!w-fit !px-3' : ''} ${!showIcon && !isSidebarVisible ? 'hidden' : ''}`}
        onClick={buttonClickHandler}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            buttonClickHandler(e);
          }
        }}
        style={customInlineStyle}
        type="button"
        ref={ref}
      >
        <div className={`${menuDropDownClasses?.leftClassName || ''} flex`}>
          {showIcon && (
            <div
              className={`${menuDropDownClasses?.iconClassName || ''} pr-2 ${!isSidebarVisible ? '!pr-0' : ''}`}
            >
              {customIcon}
            </div>
          )}
          <div
            className={`${menuDropDownClasses?.titleClassName || ''} label-medium flex h-6 items-center ${!isSidebarVisible ? 'hidden' : ''} ${active ? 'text-text-dark font-medium' : 'text-text-text '}`}
          >
            {title}
          </div>
        </div>
        <div
          className={`${menuDropDownClasses?.rightClassName || ''} ml-2 flex ${!isSidebarVisible ? 'hidden' : ''}`}
        >
          {showNotification && (
            <div
              className={`${menuDropDownClasses?.notificationClassName || ''} bg-icon-action text-icon-on-fill label-medium flex h-6 w-6 items-center justify-center rounded-lg px-[4.5px] py-[3px] ${isExpandable ? 'mr-2' : ''}`}
            >
              {showNotification <= 99 ? showNotification : '99+'}
            </div>
          )}
          {isExpandable && (
            <div className={`${menuDropDownClasses?.arrowsClassName || ''}`}>
              {!isExpanded ? leftArrow : downArrow}
            </div>
          )}
        </div>
      </button>
    );
  },
);
