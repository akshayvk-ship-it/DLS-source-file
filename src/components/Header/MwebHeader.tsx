import { forwardRef } from 'react';
import { SearchInput, type SearchBoxProps } from '../Input';
import { Container } from './Container';
import { Panel } from './Panel';

export interface HeaderProps {
  containerClassName?: string;
  leftPanelContent?: JSX.Element;
  leftPanelClassName?: string;
  title?: string;
  titleClassName?: string;
  searchBox?: boolean;

  searchBoxProps?: SearchBoxProps;

  rightPanelContent?: JSX.Element;
  rightPanelClassName?: string;
  leftButton?: {
    showLeftButton: boolean;
    buttonHandler: (e: React.MouseEvent<HTMLButtonElement>) => void;
    buttonClassName?: string;
    arrowIconProps?: React.SVGAttributes<HTMLOrSVGElement>;
  };
}

export const MwebHeader = forwardRef<HTMLDivElement, HeaderProps>(
  (props, ref) => {
    const {
      containerClassName = '',
      leftPanelContent,
      leftPanelClassName = '',
      title = '',
      titleClassName = '',
      searchBox = true,
      rightPanelContent,
      rightPanelClassName = '',
      searchBoxProps = {
        label: '',
        value: '',
        name: 'Search',
        placeholder: 'Search',
        onChange: () => {},
      },
      leftButton,
    } = props;

    const leftIcon = leftButton && leftButton.showLeftButton && (
      <button
        type="button"
        onClick={leftButton?.buttonHandler}
        className={`${leftButton?.buttonClassName}`}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          {...leftButton?.arrowIconProps}
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M7.28033 5.46967C7.57322 5.76256 7.57322 6.23744 7.28033 6.53033L1.81066 12L7.28033 17.4697C7.57322 17.7626 7.57322 18.2374 7.28033 18.5303C6.98744 18.8232 6.51256 18.8232 6.21967 18.5303L0.21967 12.5303C-0.0732231 12.2374 -0.0732231 11.7626 0.21967 11.4697L6.21967 5.46967C6.51256 5.17678 6.98744 5.17678 7.28033 5.46967Z"
            fill="#3B475B"
          />
        </svg>
      </button>
    );

    return (
      <Container
        containerClassName={`${containerClassName}  h-12  bg-fill-fill w-full flex items-center justify-between px-4 space-x-2`}
        ref={ref}
      >
        <div className="flex items-center space-x-1">
          {leftIcon}
          {leftPanelContent && (
            <Panel className={`${leftPanelClassName}`}>
              {leftPanelContent}
            </Panel>
          )}
          {title && (
            <span
              className={`${titleClassName} heading-5-semibold text-text-dark`}
            >
              {title}
            </span>
          )}
        </div>
        {(rightPanelContent || (searchBox && searchBoxProps)) && (
          <div className="flex w-full flex-1 items-center justify-end space-x-2">
            {searchBox && searchBoxProps && (
              <SearchInput
                {...searchBoxProps}
                placeholder="Search"
                boxSize="xs"
                wrapperClassName="flex-1"
              />
            )}
            {rightPanelContent && (
              <Panel className={`${rightPanelClassName}`}>
                {rightPanelContent}
              </Panel>
            )}
          </div>
        )}
      </Container>
    );
  },
);
