import { useContext, createContext } from 'react';
import { CardDetailValues } from './types';

interface CardDetailsContextValue {
  cardDetails: CardDetailValues;
  onCardDetailsChange: (name: keyof CardDetailValues, value: string) => void;
  maskedCardNumber?: string;
}

export const CardDetailsContext = createContext<CardDetailsContextValue | null>(
  null,
);

export function useCardDetails() {
  const context = useContext(CardDetailsContext);
  if (!context) {
    throw new Error('useCardDetails must be used within a CardDetailsProvider');
  }
  return context;
}
