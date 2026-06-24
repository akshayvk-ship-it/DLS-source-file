// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from 'react';
import InfoIcon from '../../../icons/infoIcon';
import { ToolTip, ToolTipProps } from '../../ToolTip';
import MandatoryAsterisk from '../MandatoryAsterisk';

export interface LabelToolTipProps extends Partial<ToolTipProps> {
  showLabelInfoIcon?: boolean;
}

export interface LabelInputProps {
  title: string | React.ReactNode;
  htmlFor: string;
  isMandatory?: boolean;
  asteriskPlacement?: 'left' | 'right';
  className?: string;
}

export function Label({
  className = '',
  htmlFor,
  title,
  isMandatory = false,
  asteriskPlacement = 'right',
  placementToolTip,
  toolTipType,
  alwaysShowToolTip,
  contentToolTip,
  renderCustomContentToolTip,
  titleToolTip,
  iconToolTip,
  showLabelInfoIcon = false,
  classNameToolTip,
}: LabelToolTipProps & LabelInputProps) {
  return (
    <label
      className={`${className} label-medium text-text-dark mb-2 flex items-center text-left font-medium ${showLabelInfoIcon ? 'flex items-center' : ''}`}
      htmlFor={htmlFor}
    >
      {isMandatory ? (
        <>
          {asteriskPlacement === 'left' && (
            <MandatoryAsterisk className="-top-[0.25em]" size={5} />
          )}
          {title}
          {asteriskPlacement === 'right' && (
            <MandatoryAsterisk className="-top-[0.25em]" size={5} />
          )}
        </>
      ) : (
        title
      )}
      {showLabelInfoIcon ? (
        <ToolTip
          iconToolTip={iconToolTip || <InfoIcon />}
          placementToolTip={placementToolTip ?? 'top-center'}
          titleToolTip={titleToolTip}
          contentToolTip={contentToolTip}
          alwaysShowToolTip={alwaysShowToolTip}
          renderCustomContentToolTip={renderCustomContentToolTip}
          classNameToolTip={`${classNameToolTip}`}
          className=" ml-2"
          toolTipType={toolTipType}
        />
      ) : (
        ''
      )}
    </label>
  );
}
