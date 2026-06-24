import React from 'react';
import {
  DropDirection,
  OptionContainerProps,
  containerStyle,
  getDropDirection,
} from '../helper';
import SingleOptionContainer from './SingleOptionContainer';
import MultiOptionContainer from './MultiOptionContainer';

interface Props extends OptionContainerProps {
  isMulti?: boolean;
  open?: boolean;
  isNewInteractionStyle?: boolean;
  maxHeight: number;
  dropDirection: DropDirection;
  inputRef: React.RefObject<HTMLInputElement | HTMLElement>;
  optionsClassName?: string;
  helperText?: string;
}

function OptionContainer({
  isMulti = false,
  open = false,
  maxHeight,
  dropDirection,
  inputRef,
  optionsClassName = '',
  helperText,
  isNewInteractionStyle = false,
  ...props
}: Props) {
  if (!open) return <> </>;

  if (props.options.length === 0) {
    return (
      <div className={`${containerStyle} text-text-light text-center `}>
        No options
      </div>
    );
  }
  return (
    <div
      className={`${helperText ? 'mt-1' : 'mt-2'} ${containerStyle} ${optionsClassName} ${getDropDirection(dropDirection, maxHeight, inputRef)}`}
      style={{ maxHeight }}
      role="listbox"
    >
      {isMulti ? (
        <MultiOptionContainer
          {...props}
          isNewInteractionStyle={isNewInteractionStyle}
        />
      ) : (
        <SingleOptionContainer
          {...props}
          isNewInteractionStyle={isNewInteractionStyle}
        />
      )}
    </div>
  );
}

export default OptionContainer;
