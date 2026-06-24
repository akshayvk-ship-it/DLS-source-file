// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, { useRef, useState } from 'react';
import DownArrow from '../../icons/DownArrow';
import OptionContainer from '../DropDown/OptionContainer/OptionContainer';
import { IOption } from '../DropDown/helper';
import { useOutsideClick } from '../hooks/useOutsideClick';

interface Props {
  itemsPerPage: number;
  onChange: (value: number) => void;
  options: IOption[];
  dropdownClassName?: string;
  optionDropdownClassName?: string;
  textDropdownClassName?: string;
}

function PageItems(props: Props) {
  const {
    itemsPerPage,
    onChange,
    options,
    dropdownClassName = '',
    optionDropdownClassName = '',
    textDropdownClassName = '',
  } = props;
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const btnDivRef = useRef<HTMLDivElement>(null);

  useOutsideClick(btnDivRef, () => setIsOpen(false));

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      toggleDropdown();
    }
  };

  return (
    <div
      ref={btnDivRef}
      role="button"
      onClick={toggleDropdown}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      className={`${dropdownClassName} border-border-border relative mr-4 w-32 rounded-lg border px-3 py-2.5`}
    >
      <div
        className={`${textDropdownClassName} label-medium text-text-dark flex items-center px-1 font-semibold`}
        ref={ref}
      >
        <span className="mr-1">Show:</span>
        <div className="flex flex-1 justify-between">
          {itemsPerPage}
          <DownArrow
            className={`text-icon-icon ${isOpen ? 'rotate-180' : ''} duration-200`}
          />
        </div>
      </div>
      <OptionContainer
        dropDirection="up"
        onChange={(selectedNumber) => onChange(+selectedNumber)}
        inputRef={ref}
        maxHeight={400}
        open={isOpen}
        options={options}
        selected={itemsPerPage.toString()}
        optionsClassName={`${optionDropdownClassName} w-full [&>span]:!justify-center [&>span]:text-text-dark !mb-6 !border-border-border-light  !border-y py-2 left-0`}
      />
    </div>
  );
}

export default PageItems;
