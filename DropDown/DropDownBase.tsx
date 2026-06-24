import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { InputWithBase } from '../Input/InputWithBase';
import { DropDirection, IOption, SelectedOption } from './helper';
import Chevron from '../../icons/chevron';
import OptionContainer from './OptionContainer/OptionContainer';

export interface DropDownBaseProps {
  options: IOption[];
  isErrorState?: boolean;
  helperText?: string;
  isNewInteractionStyle?: boolean;
  closeOnClickOutsideForMulti?: boolean;
  isMulti?: boolean;
  disabled?: boolean;
  searchDisabled?: boolean;
  className?: string;
  placeholder?: string;
  maxHeight?: number;
  dropDirection?: DropDirection;
  dataTestId?: string;
  onChange: (selected: SelectedOption) => void;
  defaultValue?: SelectedOption;
  optionsClassName?: string;
  selectedValue?: SelectedOption;
  autoComplete?: string;
  placeholderLabel?: string;
}

export const DropDownBase = forwardRef<HTMLDivElement, DropDownBaseProps>(
  (
    {
      options,
      placeholder = 'Select...',
      isMulti = false,
      disabled = false,
      searchDisabled = false,
      onChange,
      closeOnClickOutsideForMulti = false,
      isErrorState = false,
      helperText,
      isNewInteractionStyle = false,
      maxHeight = 320,
      dropDirection = 'auto',
      className = '',
      dataTestId = '',
      optionsClassName = '',
      defaultValue = isMulti ? [] : '',
      selectedValue,
      autoComplete,
      placeholderLabel = '0 items selected',
    },
    ref,
  ) => {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [selected, setSelected] = useState<SelectedOption>(defaultValue);
    const internalRef = useRef<HTMLDivElement>(null);

    const inputRef = useRef<HTMLInputElement>(null);
    const readOnly = isMulti || searchDisabled;

    useImperativeHandle(ref, () => internalRef.current as HTMLDivElement);

    useEffect(() => {
      if (selectedValue) {
        if (isMulti) {
          const isValuePresent = (selectedValue as string[]).every((elem) =>
            selected?.includes(elem),
          );
          if (
            !isValuePresent ||
            (isValuePresent && selectedValue?.length !== selected.length)
          ) {
            setSelected(selectedValue as string[]);
          }
        } else if (selectedValue !== selected && selectedValue) {
          setSelected(selectedValue);
        }
      }

      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedValue]);

    const handleClose = () => {
      setOpen(false);
    };

    useEffect(() => {
      if (!closeOnClickOutsideForMulti || !isMulti) return () => {};

      const handleDocumentClick = (event: MouseEvent) => {
        if (
          internalRef.current &&
          !internalRef.current.contains(event.target as Node)
        ) {
          handleClose();
        }
      };

      document.addEventListener('mousedown', handleDocumentClick);
      return () =>
        document.removeEventListener('mousedown', handleDocumentClick);
    }, [closeOnClickOutsideForMulti, internalRef, isMulti]);

    const handleOpen = () => {
      if (disabled) return;
      if (inputRef.current) inputRef.current.value = '';
      setSearch('');
      setOpen(true);
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (searchDisabled) return;

      if (!open) handleOpen();
      setSearch(e.target.value);
    };

    const filteredOptions = () =>
      options.filter((option) =>
        option.label.toLowerCase().includes(search.toLowerCase()),
      );

    const handleChange = (value: SelectedOption, selectAll?: boolean) => {
      const newValue = selectAll
        ? options.map((option) => option.value)
        : value;
      setSelected(newValue);
      onChange(newValue);
      if (!isMulti) handleClose();
    };

    const toggleOpen = () => {
      if (open) {
        handleClose();
      } else handleOpen();
    };

    const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
      if (e.currentTarget.contains(e.relatedTarget)) return;
      handleClose();
    };

    const renderInputValue = () => {
      if (isMulti) {
        return selected.length > 0
          ? `${selected.length} items selected`
          : placeholderLabel;
      }
      return options.filter((option) => option.value === selected)[0]?.label;
    };

    const renderPrefix = () => {
      if (isMulti) return undefined;
      return options.filter((option) => option.value === selected)[0]?.icon;
    };

    return (
      <div
        className={`relative w-full min-w-72 ${className}`}
        ref={internalRef}
        onBlur={isMulti && closeOnClickOutsideForMulti ? undefined : handleBlur}
      >
        <InputWithBase
          ref={inputRef}
          disabled={disabled}
          error={isErrorState}
          placeholder={open ? renderInputValue() : placeholder}
          inputClassName={` ${open ? 'placeholder:text-text-text' : 'placeholder:text-text-disabled caret-transparent'} ${searchDisabled ? '!cursor-default' : ''}`}
          tabIndex={readOnly ? -1 : 0}
          inputWrapperClassName={`${isMulti && '!cursor-pointer'} ${searchDisabled ? '!cursor-default' : ''}`}
          onClick={toggleOpen}
          onChange={handleSearch}
          prefixElement={renderPrefix()}
          suffixElement={
            <Chevron
              className={`${searchDisabled ? '!cursor-default' : ''} ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
              transform={`rotate(${open ? '180' : '0'})`}
              data-testid={`${dataTestId} chevronIcon`}
            />
          }
          value={open ? search : renderInputValue() || ''}
          readOnly={readOnly}
          type="text"
          name="dropdown-element"
          autoComplete={autoComplete}
        />
        {helperText && (
          <div
            className={`label-small mt-1
              ${isErrorState ? 'text-text-error' : 'text-text-light'}
            `}
          >
            {helperText}
          </div>
        )}

        <OptionContainer
          isMulti={isMulti}
          onChange={handleChange}
          isNewInteractionStyle={isNewInteractionStyle}
          options={filteredOptions()}
          selected={selected}
          helperText={helperText}
          open={open}
          maxHeight={maxHeight}
          dropDirection={dropDirection}
          inputRef={inputRef}
          optionsClassName={optionsClassName}
        />
      </div>
    );
  },
);
