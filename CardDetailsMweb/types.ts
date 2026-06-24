import { InputProps } from '../Input';

export interface CardDetailValues {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
}

export interface CardDetailFields {
  cardNumber: string;
  month: string;
  year: string;
  cvv: string;
}

export type CardInputProps = Omit<InputProps, 'value' | 'onChange' | 'type'>;
