import { forwardRef } from 'react';

import { RadioButtonBase } from '../SelectionControls/RadioButton/Base';
import { CheckboxBase } from '../SelectionControls/Checkbox/Base';

export interface SelectionListProps {
  placement: 'left' | 'right';
  inputKey?: string;
  title: string;
  overline?: string;
  supportingLineText?: string;
  prefixElement?: JSX.Element;
  rounded?: boolean;
  outlined?: boolean;
  isChecked: boolean;
  type: 'checkbox' | 'radio';
  wrapperClassName?: string;
  titleClassName?: string;
  overlineClassName?: string;
  supportingLineTextClassName?: string;
  prefixElementClassName?: string;
  selectionControlClassName?: string;
  dataTestId?: string;
  onSelect: () => void;
  inputName?: string;
}

export const SelectionList = forwardRef<HTMLLabelElement, SelectionListProps>(
  (
    {
      title,
      overline = '',
      supportingLineText = '',
      prefixElement,
      rounded = false,
      outlined = false,
      type,
      placement,
      isChecked,
      titleClassName = '',
      overlineClassName = '',
      supportingLineTextClassName = '',
      prefixElementClassName = '',
      wrapperClassName = '',
      selectionControlClassName = '',
      dataTestId = 'defaultSelectionListTestId',
      onSelect,
      inputKey = 'selectionListItem',
      inputName = 'selectionListItem',
    }: SelectionListProps,
    ref,
  ) => {
    const element = () =>
      type === 'checkbox' ? (
        <CheckboxBase
          id={inputKey}
          name={inputName}
          onChange={onSelect}
          size="sm"
          checked={isChecked}
          className={`my-1 ${selectionControlClassName}`}
        />
      ) : (
        <RadioButtonBase
          id={inputKey}
          name={inputName}
          onChange={onSelect}
          size="sm"
          checked={isChecked}
          className={`my-1 ${selectionControlClassName}`}
        />
      );

    return (
      <label
        ref={ref}
        data-testid={dataTestId}
        htmlFor={inputKey}
        className={`bg-fill-fill hover:bg-fill-hover-light active:bg-fill-fill flex min-h-10 flex-row border px-4
          ${rounded ? 'rounded-lg' : ''} ${outlined ? 'border-border-border-light' : 'border-transparent'} 
          ${wrapperClassName}`}
      >
        {placement === 'left' && (
          <div
            className={`mr-4 flex flex-row ${overline || supportingLineText ? 'items-start py-2  ' : 'items-center'} `}
          >
            {element()}
          </div>
        )}
        <div
          className={`flex flex-1 flex-row  ${overline || supportingLineText ? 'items-start py-2 ' : 'items-center'} `}
        >
          {prefixElement && (
            <div className={`my-0.5 mr-2 ${prefixElementClassName}`}>
              {prefixElement}
            </div>
          )}
          <div className="flex flex-col items-start">
            {overline && (
              <div
                className={`label-extra-small text-text-text font-medium ${overlineClassName} `}
              >
                {overline}
              </div>
            )}
            <div className={`text-text-text label-medium ${titleClassName}`}>
              {title}
            </div>
            {supportingLineText && (
              <div
                className={`label-small text-text-light ${supportingLineTextClassName}`}
              >
                {supportingLineText}
              </div>
            )}
          </div>
        </div>
        {placement === 'right' && (
          <div
            className={`ml-4 flex flex-row ${overline || supportingLineText ? 'items-start py-2 ' : 'items-center'}`}
          >
            {element()}
          </div>
        )}
      </label>
    );
  },
);
