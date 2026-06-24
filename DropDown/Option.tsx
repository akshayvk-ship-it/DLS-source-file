import React from 'react';
import { Checkbox } from '../SelectionControls/Checkbox/Checkbox';
import { IOption } from './helper';

interface Props {
  option: IOption;
  selected?: boolean;
  isNewInteractionStyle?: boolean;
  hasCheckbox?: boolean;
  onClick: () => void;
}

function Option({
  option,
  selected = false,
  isNewInteractionStyle = false,
  hasCheckbox = false,
  onClick,
}: Props) {
  const id = React.useId();
  const commonStyle =
    'flex w-full items-center space-x-4 rounded-lg p-2 cursor-pointer ';

  if (hasCheckbox)
    return (
      <Checkbox
        id={id}
        className="flex-shrink-0"
        checked={selected || false}
        size="lg"
        onChange={onClick}
        text={option.label}
        labelClassName={`${commonStyle} ${isNewInteractionStyle ? 'hover:bg-fill-hover active:bg-fill-pressed' : 'hover:bg-fill-hover-light active:bg-fill-pressed-dark'} text-text-text [&_span]:label-large  [&_span]:font-normal`}
      />
    );

  const keyDownHandler = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onClick();
    }
  };

  const getOptionClasses = () => {
    if (selected) {
      return `text-text-dark font-medium ${isNewInteractionStyle ? '!bg-fill-pressed-dark' : '!bg-fill-action-light'}`;
    }

    if (isNewInteractionStyle) {
      return 'hover:!bg-fill-hover active:!bg-fill-pressed text-text-text font-normal';
    }
    return 'hover:!bg-fill-hover-light active:!bg-fill-pressed-dark text-text-text font-normal';
  };

  return (
    <span
      className={`${commonStyle} ${getOptionClasses()} label-large flex items-center justify-between`}
      onClick={onClick}
      onKeyDown={keyDownHandler}
      role="option"
      tabIndex={0}
      aria-selected={selected}
    >
      {option.label}
      {option.icon}
    </span>
  );
}

export default Option;
