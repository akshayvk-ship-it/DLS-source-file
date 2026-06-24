import {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { TextInput } from '../Input';
import { InfoWithBorderIcon } from '../Icons';
import { CardDetailFields, CardDetailValues, CardInputProps } from './types';
import { CardDetailsContext, useCardDetails } from './context';
import { formatCardNumber, getExpiryDate } from './helper';

interface CardNumberInputProps extends CardInputProps {
  cardIcon?: React.ReactElement;
  className?: string;
  cardNumberFormatter?: (value: string) => string;
}

export function CardNumber({
  cardIcon,
  className = '',
  labelClassName = '',
  inputWrapperClassName = '',
  inputClassName = '',
  cardNumberFormatter = (value) => formatCardNumber(value),
  ...props
}: CardNumberInputProps) {
  const { cardDetails, maskedCardNumber, onCardDetailsChange } =
    useCardDetails();

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (maskedCardNumber) return;
    const inputValue = e.target.value;
    onCardDetailsChange('cardNumber', cardNumberFormatter(inputValue));
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    if (maskedCardNumber) return;

    e.preventDefault();
    const pastedCardNumber = e.clipboardData
      .getData('text/plain')
      .replace(/\D/g, '')
      .slice(0, 16);
    onCardDetailsChange('cardNumber', cardNumberFormatter(pastedCardNumber));
  };

  return (
    <div className={`relative  w-full ${className}`}>
      <TextInput
        wrapperClassName={className}
        labelClassName={`!label-small ${labelClassName}`}
        inputWrapperClassName={`bg-fill-fill ${inputWrapperClassName}`}
        inputClassName={`label-medium ${inputClassName}`}
        placeholder="0000 0000 0000 0000"
        autoComplete="off"
        suffixElement={cardIcon}
        maxLength={19}
        inputMode="numeric"
        value={maskedCardNumber || cardDetails.cardNumber}
        readOnly={!!maskedCardNumber}
        onChange={handleCardNumberChange}
        onPaste={handlePaste}
        type="text"
        {...props}
      />
    </div>
  );
}

interface ExpiryDateInputProps extends CardInputProps {
  className?: string;
}

function ExpiryDate({
  className = '',
  labelClassName = '',
  inputWrapperClassName = '',
  inputClassName = '',
  ...props
}: ExpiryDateInputProps) {
  const { cardDetails, onCardDetailsChange } = useCardDetails();

  const containerRef = useRef<HTMLInputElement>(null);
  const [inputTop, setInputTop] = useState(0);

  useEffect(() => {
    if (containerRef.current) {
      const inputElement = containerRef.current.querySelector('input');
      if (inputElement) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const inputRect = inputElement.getBoundingClientRect();
        setInputTop(inputRect.top - containerRect.top);
      }
    }
  }, [cardDetails.expiryDate]);

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    const spacing = ' '.repeat(9);

    if (input.length === 1 && parseInt(input, 10) > 1) {
      onCardDetailsChange('expiryDate', `0${input}${spacing}`);
      return;
    }

    if (input.length === 2 && parseInt(input, 10) > 12) {
      onCardDetailsChange('expiryDate', `1`);
      return;
    }

    const expiryDate = input
      .replace(/[^0-9X]/g, '')
      .replace(/(.{2})/g, `$1${spacing}`)
      .trim();

    onCardDetailsChange('expiryDate', expiryDate.slice(0, 13));
  };

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      <TextInput
        placeholder="MM  /   YY"
        labelClassName={`!label-small ${labelClassName}`}
        inputClassName={`label-medium ${inputClassName}`}
        inputWrapperClassName={`bg-fill-fill ${inputWrapperClassName}`}
        autoComplete="off"
        value={cardDetails.expiryDate}
        onChange={handleExpiryChange}
        type="text"
        {...props}
      />
      {cardDetails.expiryDate.length > 0 && (
        <p
          className="label-medium text-text-light pointer-events-none absolute left-[50px]"
          style={{ top: `${inputTop}px` }}
        >
          /
        </p>
      )}

      {cardDetails.expiryDate.length > 0 &&
        cardDetails.expiryDate.length < 2 && (
          <p
            className="label-medium text-text-light pointer-events-none absolute left-[67px]"
            style={{ top: `${inputTop}px` }}
          >
            YY
          </p>
        )}
    </div>
  );
}

interface CVVInputProps extends CardInputProps {
  className?: string;
}

function CVV({
  className = '',
  labelClassName = '',
  inputWrapperClassName = '',
  inputClassName = '',
  classNameToolTip = '',
  ...props
}: CVVInputProps) {
  const { cardDetails, onCardDetailsChange } = useCardDetails();

  const handleCVVChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onCardDetailsChange('cvv', e.target.value.replace(/[^0-9X]/g, ''));
  };
  return (
    <TextInput
      wrapperClassName={`w-full ${className}`}
      placeholder="000"
      labelClassName={`!label-small ${labelClassName}`}
      inputClassName={`label-medium ${inputClassName}`}
      inputWrapperClassName={`bg-fill-fill ${inputWrapperClassName}`}
      classNameToolTip={`w-max ${classNameToolTip}`}
      showLabelInfoIcon
      contentToolTip="3-digit number on the back of your card."
      iconToolTip={<InfoWithBorderIcon width={14} height={14} />}
      maxLength={3}
      value={cardDetails.cvv}
      onChange={handleCVVChange}
      type="text"
      {...props}
    />
  );
}

type BaseCardDetailsMwebProps = {
  className?: string;
  maskedCardNumber?: string;
  onCardDetailsChange?: (details: CardDetailFields) => void;
  dataTestId?: string;
};

export type CardDetailsMwebProps = BaseCardDetailsMwebProps &
  (
    | {
        variant: 'default';
        cardNumberInputProps?: CardNumberInputProps;
        expiryDateInputProps?: ExpiryDateInputProps;
        cvvInputProps?: CVVInputProps;
      }
    | {
        variant: 'card-number-only';
        cardNumberInputProps?: CardNumberInputProps;
      }
    | {
        variant: 'expiry-and-cvv';
        expiryDateInputProps?: ExpiryDateInputProps;
        cvvInputProps?: CVVInputProps;
      }
    | {
        variant: 'card-number-and-expiry';
        cardNumberInputProps?: CardNumberInputProps;
        expiryDateInputProps?: ExpiryDateInputProps;
      }
    | {
        variant: 'card-number-and-cvv';
        cardNumberInputProps?: CardNumberInputProps;
        cvvInputProps?: CVVInputProps;
      }
  );

export const CardDetailsMweb = forwardRef<HTMLDivElement, CardDetailsMwebProps>(
  (
    {
      className,
      onCardDetailsChange,
      maskedCardNumber,
      variant = 'default',
      dataTestId = 'card-details-mweb-id',
      ...props
    },
    ref,
  ) => {
    const [cardDetails, setCardDetails] = useState<CardDetailValues>({
      cardNumber: '',
      expiryDate: '',
      cvv: '',
    });

    const handleCardDetailsChange = useCallback(
      (name: keyof CardDetailValues, value: string) => {
        if (!name) return;
        const updatedData = {
          ...cardDetails,
          [name]: value,
        };
        setCardDetails(updatedData);

        const { month, year } = getExpiryDate(updatedData.expiryDate);
        onCardDetailsChange?.({
          cardNumber: updatedData.cardNumber,
          month,
          year,
          cvv: updatedData.cvv,
        });
      },
      [cardDetails, onCardDetailsChange],
    );

    const contextValue = useMemo(
      () => ({
        cardDetails,
        maskedCardNumber,
        onCardDetailsChange: handleCardDetailsChange,
      }),
      [cardDetails, handleCardDetailsChange, maskedCardNumber],
    );

    const renderVariants = () => {
      switch (variant) {
        case 'card-number-only': {
          const { cardNumberInputProps } = props as Extract<
            CardDetailsMwebProps,
            { variant: 'card-number-only' }
          >;

          return (
            <CardNumber
              label="Card Number"
              name="card-details-mweb-card-number"
              className="col-span-2"
              {...cardNumberInputProps}
            />
          );
        }

        case 'expiry-and-cvv': {
          const { expiryDateInputProps, cvvInputProps } = props as Extract<
            CardDetailsMwebProps,
            { variant: 'expiry-and-cvv' }
          >;

          return (
            <div className="flex h-full w-full items-start gap-6">
              <ExpiryDate
                label="Expiry Date"
                name="card-details-mweb-expiry-date"
                {...expiryDateInputProps}
              />
              <CVV
                label="CVV"
                name="card-details-mweb-cvv"
                {...cvvInputProps}
              />
            </div>
          );
        }

        case 'card-number-and-expiry': {
          const { cardNumberInputProps, expiryDateInputProps } =
            props as Extract<
              CardDetailsMwebProps,
              { variant: 'card-number-and-expiry' }
            >;

          return (
            <div className="grid h-full w-full grid-cols-3 items-start gap-4">
              <CardNumber
                label="Card Number"
                name="card-details-mweb-card-number"
                className="col-span-2"
                {...cardNumberInputProps}
              />
              <ExpiryDate
                label="Expiry Date"
                name="card-details-mweb-expiry-date"
                className="col-span-1"
                {...expiryDateInputProps}
              />
            </div>
          );
        }

        case 'card-number-and-cvv': {
          const { cardNumberInputProps, cvvInputProps } = props as Extract<
            CardDetailsMwebProps,
            { variant: 'card-number-and-cvv' }
          >;
          return (
            <div className="grid h-full w-full grid-cols-3 items-start gap-4">
              <CardNumber
                label="Card Number"
                name="card-details-mweb-card-number"
                className="col-span-2"
                {...cardNumberInputProps}
              />
              <CVV
                label="CVV"
                name="card-details-mweb-cvv"
                className="col-span-1"
                {...cvvInputProps}
              />
            </div>
          );
        }
        case 'default':
        default: {
          const { cardNumberInputProps, expiryDateInputProps, cvvInputProps } =
            props as Extract<CardDetailsMwebProps, { variant: 'default' }>;

          return (
            <div className="grid h-full w-full grid-cols-2 items-start gap-6">
              <CardNumber
                label="Card Number"
                name="card-details-mweb-card-number"
                className="col-span-2"
                {...cardNumberInputProps}
              />
              <ExpiryDate
                label="Expiry Date"
                name="card-details-mweb-expiry-date"
                className="col-span-1"
                {...expiryDateInputProps}
              />
              <CVV
                label="CVV"
                name="card-details-mweb-cvv"
                className="col-span-1"
                {...cvvInputProps}
              />
            </div>
          );
        }
      }
    };

    return (
      <CardDetailsContext.Provider value={contextValue}>
        <div
          ref={ref}
          className={`w-full min-w-[360px] ${className}`}
          data-testid={dataTestId}
        >
          {renderVariants()}
        </div>
      </CardDetailsContext.Provider>
    );
  },
);
