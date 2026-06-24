import React, { ChangeEvent, useEffect, useState } from 'react';
import { DestinationInput } from './DestinationInput';
import RoundSwapButton from './RoundSwapButton';

type DestinationState = 'Default' | 'Error' | 'Entered';

export interface DestinationProps {
  state: DestinationState;
  showSwitchButton?: boolean;
  helperText?: string;
  errorTextClassName?: string;
  locationValue: string;
  destinationValue: string;
  locationPlaceHolder?: string;
  destinationPlaceHolder?: string;
  fromOnChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  fromOnFocus?: (e?: ChangeEvent<HTMLInputElement>) => void;
  toOnFocus?: (e?: ChangeEvent<HTMLInputElement>) => void;
  toOnChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  switchButtonOnClick?: () => void;
  wrapperClassName?: string;
  inputWrapperClassName?: string;
  inputClassName?: string;
  firstFieldFocus?: boolean;
  secondFieldFocus?: boolean;
  prefixLocationElement?: JSX.Element;
  prefixDestinationElement?: JSX.Element;
  dataTestId?: string;
}

function PrefixLocationElement(state: DestinationState) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx="8"
        cy="8"
        r="2"
        stroke={state === 'Entered' ? 'fill-icon-action' : '#3B475B'}
        className={state === 'Entered' ? 'fill-icon-action' : ''}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.5 2V2.6898C11.0465 2.92656 13.0734 4.95355 13.3102 7.5H14C14.2761 7.5 14.5 7.72386 14.5 8C14.5 8.27614 14.2761 8.5 14 8.5H13.3102C13.0734 11.0465 11.0465 13.0734 8.5 13.3102V14C8.5 14.2761 8.27614 14.5 8 14.5C7.72386 14.5 7.5 14.2761 7.5 14V13.3102C4.95355 13.0734 2.92656 11.0465 2.6898 8.5H2C1.72386 8.5 1.5 8.27614 1.5 8C1.5 7.72386 1.72386 7.5 2 7.5H2.6898C2.92656 4.95355 4.95355 2.92656 7.5 2.6898V2C7.5 1.72386 7.72386 1.5 8 1.5C8.27614 1.5 8.5 1.72386 8.5 2ZM8 12.3333C10.3932 12.3333 12.3333 10.3932 12.3333 8C12.3333 5.60677 10.3932 3.66667 8 3.66667C5.60677 3.66667 3.66667 5.60677 3.66667 8C3.66667 10.3932 5.60677 12.3333 8 12.3333Z"
        fill="#3B475B"
      />
    </svg>
  );
}

function PrefixDestinationElement(state: DestinationState) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8.00008 14.6666C10.6667 11.9999 13.3334 9.6121 13.3334 6.66659C13.3334 3.72107 10.9456 1.33325 8.00008 1.33325C5.05456 1.33325 2.66675 3.72107 2.66675 6.66659C2.66675 9.6121 5.33341 11.9999 8.00008 14.6666Z"
        stroke="#3B475B"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.1668 6.66667C10.1668 7.86328 9.19678 8.83333 8.00016 8.83333C6.80355 8.83333 5.8335 7.86328 5.8335 6.66667C5.8335 5.47005 6.80355 4.5 8.00016 4.5C9.19678 4.5 10.1668 5.47005 10.1668 6.66667Z"
        stroke={state === 'Entered' ? 'fill-icon-action' : '#3B475B'}
        className={state === 'Entered' ? 'fill-icon-action' : ''}
      />
    </svg>
  );
}

export const Destination = React.forwardRef<HTMLDivElement, DestinationProps>(
  (
    {
      state,
      helperText,
      locationValue,
      destinationValue,
      locationPlaceHolder = 'From',
      destinationPlaceHolder = 'To',
      fromOnChange,
      toOnChange,
      fromOnFocus,
      toOnFocus,
      showSwitchButton = false,
      switchButtonOnClick = () => {},
      wrapperClassName = '',
      inputWrapperClassName = '',
      inputClassName = '',
      firstFieldFocus = false,
      secondFieldFocus = false,
      prefixLocationElement,
      prefixDestinationElement,
      errorTextClassName = '',
      dataTestId = 'defaultDestinationTestId',
    },
    ref,
  ) => {
    const [location, setLocation] = useState(locationValue);
    const [destination, setDestination] = useState(destinationValue);
    const [internalState, setInternalState] = useState<DestinationState>(state);
    const [firstFieldFoc, setFirstFieldFocus] =
      useState<boolean>(firstFieldFocus);
    const [secondFieldFoc, setSecondFieldFocus] =
      useState<boolean>(secondFieldFocus);
    const [showSwitchButtonState, setShowSwitchButtonState] =
      useState<boolean>(showSwitchButton);

    useEffect(() => {
      setShowSwitchButtonState(showSwitchButton);
    }, [showSwitchButton]);

    useEffect(() => {
      if ((location !== '' && destination !== '') || state === 'Entered') {
        setInternalState('Entered');
      }

      if (location === '' || destination === '') {
        setInternalState('Default');
      }

      if (state === 'Error') {
        setInternalState('Error');
      }
    }, [location, destination, state]);

    const locationOnChange = (e: ChangeEvent<HTMLInputElement>) => {
      setLocation(e.target.value);
      fromOnChange!(e);
    };

    const destinationOnChange = (e: ChangeEvent<HTMLInputElement>) => {
      setDestination(e.target.value);
      toOnChange!(e);
    };

    return (
      <div
        ref={ref}
        className={`relative ${wrapperClassName}`}
        data-testid={dataTestId}
      >
        <span
          className={`border-border-border absolute left-[1.031rem] top-[2.625rem] z-10 h-[3.75rem] w-0 border-l border-dashed ${internalState === 'Entered' ? 'border-icon-action' : ''}`}
        />
        {showSwitchButtonState &&
        (internalState === 'Default' || internalState === 'Entered') ? (
          <RoundSwapButton switchButtonOnClick={switchButtonOnClick} />
        ) : undefined}

        <div>
          <DestinationInput
            inputId="from"
            inputName="from"
            inputWrapperClassName={`mb-4 ${inputWrapperClassName}`}
            inputClassName={inputClassName}
            placeholder={locationPlaceHolder}
            prefixElement={
              prefixLocationElement || PrefixLocationElement(internalState)
            }
            showError={internalState === 'Error'}
            value={location}
            onChange={locationOnChange}
            makeFocus={firstFieldFoc}
            onFocus={(e) => {
              if (fromOnFocus) fromOnFocus(e);
              if (showSwitchButton) {
                setShowSwitchButtonState(false);
                setFirstFieldFocus(true);
                setSecondFieldFocus(false);
              }
            }}
          />
        </div>

        <div>
          <DestinationInput
            inputId="to"
            inputName="to"
            placeholder={destinationPlaceHolder}
            inputClassName={inputClassName}
            inputWrapperClassName={inputWrapperClassName}
            prefixElement={
              prefixDestinationElement ||
              PrefixDestinationElement(internalState)
            }
            showError={internalState === 'Error'}
            value={destination}
            errorText={internalState === 'Error' ? helperText : undefined}
            errorTextClassName={errorTextClassName}
            onChange={destinationOnChange}
            makeFocus={secondFieldFoc}
            onFocus={(e) => {
              if (toOnFocus) toOnFocus(e);
              if (showSwitchButton) {
                setShowSwitchButtonState(false);
                setFirstFieldFocus(false);
                setSecondFieldFocus(true);
              }
            }}
          />
        </div>
      </div>
    );
  },
);
