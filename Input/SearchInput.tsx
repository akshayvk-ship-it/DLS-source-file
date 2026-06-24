import { forwardRef, useEffect, useMemo, useRef, useState } from 'react';
import { InputWithBase, InputWithBaseProps } from './InputWithBase';

import { Label, LabelToolTipProps } from './Label';
import './index.css';

interface PlaceholderTextAnimation {
  placeholderStartingText: string;
  placeholderTexts: string[];
  textClassName?: string;
  wrapperClassName?: string;
}

export interface SearchBoxProps
  extends Omit<InputWithBaseProps, 'type'>,
    LabelToolTipProps {
  label: string | React.ReactNode;
  labelClassName?: string;
  placeholderTextAnimation?: PlaceholderTextAnimation;
  prefixTabIndex?: number;
  prefixElement?: JSX.Element;
  suffixTabIndex?: number;
  suffixElement?: JSX.Element;
  wrapperClassName?: string;
  onSuffixClick?: (
    e:
      | React.MouseEvent<HTMLButtonElement>
      | React.KeyboardEvent<HTMLButtonElement>,
  ) => void;
  boxSize?: 'xs' | 'sm' | 'lg';
  type?: string;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchBoxProps>(
  (
    {
      disabled = false,
      error = false,
      label,
      name,
      value,
      placeholder,
      onBlur,
      onFocus,
      onChange,
      inputClassName = '',
      inputWrapperClassName = '',
      labelClassName = '',
      placementToolTip,
      alwaysShowToolTip,
      contentToolTip,
      renderCustomContentToolTip,
      titleToolTip,
      showLabelInfoIcon,
      classNameToolTip,
      tabIndex,
      prefixTabIndex = -1,
      prefixElement = <div />,
      suffixTabIndex = 0,
      suffixElement = <div />,
      onSuffixClick = () => {},
      wrapperClassName = '',
      boxSize = 'lg',
      placeholderTextAnimation,
      type = 'text',
      ...searchBoxProps
    },
    ref,
  ) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const refCurrent = (ref || inputRef) as React.RefObject<HTMLInputElement>;
    const showSuffix = value && value.length > 0;

    const getSize = {
      xs: '!h-8 !py-1.5 !px-2',
      sm: '!py-2 !h-10',
      lg: '!h-12',
    };

    const [currentActive, setCurrentActive] = useState(0);
    const [activeElements, setActiveElements] = useState(
      placeholderTextAnimation &&
        placeholderTextAnimation.placeholderTexts.length > 1
        ? [
            placeholderTextAnimation.placeholderTexts[0],
            placeholderTextAnimation.placeholderTexts[1],
          ]
        : [],
    );
    const [activePlaceholderText, setActivePlaceholderText] = useState(1);
    const [position, setPosition] = useState(1);

    const memoizedLength = useMemo(
      () => placeholderTextAnimation?.placeholderTexts.length,
      [placeholderTextAnimation?.placeholderTexts],
    );

    useEffect(() => {
      let intervalTimerId: NodeJS.Timeout;
      let timerId: NodeJS.Timeout;

      if (
        placeholderTextAnimation &&
        placeholderTextAnimation.placeholderTexts.length > 1
      ) {
        intervalTimerId = setInterval(() => {
          setCurrentActive((prevActive) => (prevActive === 0 ? 1 : 0));

          if (timerId) clearTimeout(timerId);
          timerId = setTimeout(() => {
            setPosition((prevPosition) => {
              setCurrentActive((currentActiveAtTime) => {
                const newPosition = prevPosition === 1 ? 0 : 1;
                const wouldBeSynchronized = newPosition === currentActiveAtTime;

                if (wouldBeSynchronized) {
                  const oppositeValue = currentActiveAtTime === 0 ? 1 : 0;
                  return oppositeValue;
                }

                return currentActiveAtTime;
              });
              return prevPosition === 1 ? 0 : 1;
            });
          }, 300);
        }, 1800);
      }

      return () => {
        clearInterval(intervalTimerId);
        clearTimeout(timerId);
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [memoizedLength]);

    useEffect(() => {
      if (
        placeholderTextAnimation &&
        placeholderTextAnimation.placeholderTexts.length > 1
      ) {
        setActivePlaceholderText((prevActivePlaceholder) =>
          prevActivePlaceholder ===
          placeholderTextAnimation.placeholderTexts.length - 1
            ? 0
            : prevActivePlaceholder + 1,
        );
        setActiveElements((prevActiveElements) => {
          if (currentActive === 0) {
            return [
              prevActiveElements[0],
              placeholderTextAnimation.placeholderTexts[activePlaceholderText],
            ];
          }
          return [
            placeholderTextAnimation.placeholderTexts[activePlaceholderText],
            prevActiveElements[1],
          ];
        });
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
      position,
      placeholderTextAnimation?.placeholderTexts,
      placeholderTextAnimation,
    ]);

    const renderPlaceholders = (
      <div
        className={`${placeholderTextAnimation?.wrapperClassName || ''} absolute bottom-0 left-0 right-0 top-0 flex after:absolute after:bottom-0 after:left-0 after:right-0 after:top-0`}
      >
        <span
          className={`${placeholderTextAnimation?.textClassName || ''} text-text-light label-large`}
        >
          {placeholderTextAnimation?.placeholderStartingText || ''}
        </span>
        &nbsp;
        <div className="relative flex h-full flex-1 flex-col overflow-hidden">
          <span
            className={`${placeholderTextAnimation?.textClassName || ''} text-text-light label-large absolute top-0 ${currentActive === 1 ? '-translate-y-full  transition-transform duration-200 ease-in' : ''}
              ${currentActive === 0 ? 'translate-y-0  transition-transform duration-200 ease-in' : ''}
              ${position === 0 && currentActive === 1 ? 'translate-y-full !transition-none' : ''}
              `}
          >
            {activeElements[0]}
          </span>
          <span
            className={`${placeholderTextAnimation?.textClassName || ''} text-text-light label-large absolute top-0 ${currentActive === 0 ? '-translate-y-full  transition-transform duration-200 ease-in' : ''}
              ${currentActive === 1 ? 'translate-y-0  transition-transform duration-200 ease-in' : ''}
              ${position === 1 && currentActive === 0 ? 'translate-y-full !transition-none' : ''}
              `}
          >
            {activeElements[1]}
          </span>
        </div>
      </div>
    );

    return (
      <div
        className={`flex flex-col shadow-[0px_1px_2px_0px_rgba(27,32,41,0.06)] ${wrapperClassName || ''}`}
      >
        {label && (
          <Label
            htmlFor={name}
            title={label}
            className={labelClassName}
            showLabelInfoIcon={showLabelInfoIcon}
            placementToolTip={placementToolTip}
            alwaysShowToolTip={alwaysShowToolTip}
            contentToolTip={contentToolTip}
            renderCustomContentToolTip={renderCustomContentToolTip}
            titleToolTip={titleToolTip}
            classNameToolTip={classNameToolTip}
          />
        )}
        <InputWithBase
          ref={refCurrent}
          disabled={disabled}
          error={error}
          name={name}
          type={type}
          value={value}
          placeholder={!placeholderTextAnimation ? placeholder : ''}
          onChange={onChange}
          onBlur={onBlur}
          onFocus={onFocus}
          inputWrapperClassName={`${inputWrapperClassName} ${getSize[boxSize]}`}
          inputClassName={`${inputClassName} placeholder:!text-text-light placeholder:!animate-scroll search-icon-remover`}
          tabIndex={tabIndex || 0}
          suffixClassName="cursor-pointer"
          autoComplete={searchBoxProps.autoComplete}
          prefixElement={
            <div tabIndex={prefixTabIndex} className="flex">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={`${boxSize === 'xs' ? 'h-5 w-5' : ''}`}
              >
                <g clipPath="url(#clip0_1421_18480)">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M15.96 10.2C15.96 13.3812 13.3812 15.96 10.2 15.96C7.01884 15.96 4.44 13.3812 4.44 10.2C4.44 7.01884 7.01884 4.44 10.2 4.44C13.3812 4.44 15.96 7.01884 15.96 10.2ZM14.7567 15.7749C13.5155 16.7906 11.9289 17.4 10.2 17.4C6.22355 17.4 3 14.1764 3 10.2C3 6.22355 6.22355 3 10.2 3C14.1765 3 17.4 6.22355 17.4 10.2C17.4 11.9289 16.7906 13.5155 15.7749 14.7567L20.7891 19.7709C21.0703 20.0521 21.0703 20.5079 20.7891 20.7891C20.5079 21.0703 20.0521 21.0703 19.7709 20.7891L14.7567 15.7749Z"
                    fill="#3B475B"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_1421_18480">
                    <rect width="24" height="24" fill="white" />
                  </clipPath>
                </defs>
              </svg>
              {prefixElement}
            </div>
          }
          animatedPlaceholderElement={renderPlaceholders}
          suffixElement={
            <button
              type="button"
              className="flex justify-center"
              onClick={onSuffixClick}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  onSuffixClick?.(e);
                }

                e.stopPropagation();
              }}
              tabIndex={value?.length ? 0 : -1}
            >
              {showSuffix && value?.length ? (
                <div tabIndex={suffixTabIndex} className="flex">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className={`${boxSize === 'xs' ? 'h-5 w-5' : ''}`}
                  >
                    <path
                      d="M15 9L9 15M9 9L15 15M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"
                      stroke="#1B2029"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  {suffixElement}
                </div>
              ) : (
                <div>{suffixElement}</div>
              )}
            </button>
          }
          {...searchBoxProps}
        />
      </div>
    );
  },
);
