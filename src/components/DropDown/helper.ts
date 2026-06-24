// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from 'react';

export type SelectedOption = string[] | string;
export type DropDirection = 'up' | 'down' | 'auto';

export interface IOption {
  value: string;
  label: string;
  icon?: JSX.Element;
}
export interface OptionContainerProps {
  options: IOption[];
  selected: SelectedOption;
  onChange: (value: SelectedOption, selectAll?: boolean) => void;
  isNewInteractionStyle?: boolean;
}

export const containerStyle =
  'bg-fill-fill border-border-border-light absolute flex w-full flex-col overflow-x-hidden overflow-y-auto rounded-lg border-[0.0625rem] px-2 shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(27,32,41,0.06)]';

export function getDropDirection(
  dropDirection: DropDirection,
  maxHeight: number,
  ref: React.RefObject<HTMLInputElement | HTMLElement>,
) {
  let direction = dropDirection;

  if (direction === 'auto') {
    const bottomOffset =
      window.innerHeight - (ref.current?.getBoundingClientRect().top ?? 0);

    direction = bottomOffset > maxHeight ? 'down' : 'up';
  }

  return direction === 'up' ? 'bottom-full' : 'top-full';
}
