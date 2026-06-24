import { forwardRef, useEffect, useRef, useState } from 'react';
import { ColumnOption, TableColumnFilterProps } from './types';
import { SearchInput } from '../Input';
import { SelectionList } from '../SelectionList';
import { Button } from '../Button/Button';
import { ResetIcon } from '../Icons/General';
import ReorderIcon from './ReorderIcon';
import { SearchMI } from '../Icons';

// eslint-disable-next-line import/prefer-default-export
export const TableColumnFilter = forwardRef<
  HTMLInputElement,
  TableColumnFilterProps
>(
  (
    {
      value,
      options,
      wrapperClassName = '',
      optionListWrapperClassName = '',
      searchAutoComplete = false,
      minimumSelectedOptions = 1,
      searchPlaceholder = 'Search by column name',
      name,
      onChange,
      onBlur,
      onClose,
      onReset,
      onFocus,
      onClick,
      inputClassName = '',
      onColumnOptionsChange,
      inputWrapperClassName = '',
      dropdownIcon,
      dropdownWrapperClassName = '',
      dropdownIconClassName = '',
      ...rest
    }: TableColumnFilterProps,
    ref,
  ) => {
    const [open, setOpen] = useState(false);
    const [localOptions, setLocalOptions] = useState<ColumnOption[]>(() =>
      options.map((opt) => ({ ...opt, isSelected: !!opt.isSelected })),
    );
    const [draggedId, setDraggedId] = useState<string | null>(null);
    const [isFocused, setIsFocused] = useState(false);
    const [searchValue, setSearchValue] = useState<string>('');
    const localWrapperRef = useRef<HTMLDivElement>(null);
    const localInputRef = useRef<HTMLInputElement>(null);
    const effectiveInputRef = rest.searchInputRef ?? localInputRef;
    const effectiveWrapperRef = rest.wrapperRef ?? localWrapperRef;
    const triggerRef = useRef<HTMLDivElement>(null);

    const handleIconClick = () => {
      setSearchValue('');
      onClose?.();
      setOpen((prev) => !prev);
      triggerRef.current?.focus();
    };

    const handleIconFocus = () => {
      setIsFocused(true);
    };

    const handleIconBlur = () => {
      setIsFocused(false);
    };

    const handleSearchInputChange = (
      e: React.ChangeEvent<HTMLInputElement>,
    ) => {
      setSearchValue(e.target.value);
    };

    const handleCancelSearch = () => {
      setSearchValue('');
    };

    useEffect(() => {
      setLocalOptions(() => options.map((opt) => ({ ...opt })));
    }, [options]);

    useEffect(() => {
      function handleOutsideClick(e: MouseEvent) {
        const wrapper = effectiveWrapperRef.current;
        const trigger = triggerRef.current;

        if (!wrapper) return;

        const clickedOutside = !wrapper.contains(e.target as Node);

        if (clickedOutside) {
          setOpen(false);
          setIsFocused(false);
          trigger?.blur();
        }
      }

      document.addEventListener('mousedown', handleOutsideClick);

      return () => {
        document.removeEventListener('mousedown', handleOutsideClick);
      };
    }, [effectiveWrapperRef]);

    const toggleOption = (optionValue: string) => {
      setLocalOptions((prevOptions) => {
        const clicked = prevOptions.find((o) => o.value === optionValue);
        if (!clicked) return prevOptions;

        const isCurrentlySelected = clicked.isSelected === true;
        const selectedCount = prevOptions.filter((o) => o.isSelected).length;

        if (isCurrentlySelected && selectedCount <= minimumSelectedOptions) {
          return prevOptions;
        }

        const updatedOptions = prevOptions.map((opt) =>
          opt.value === optionValue
            ? { ...opt, isSelected: !opt.isSelected }
            : opt,
        );

        onColumnOptionsChange(updatedOptions);

        return updatedOptions;
      });
    };

    const resetToDefaultOptions = () => {
      const resetSelection = localOptions.map((currentOpt) => {
        const matchingProp = options.find((o) => o.value === currentOpt.value);
        return {
          ...currentOpt,
          isSelected: matchingProp
            ? !!matchingProp.isSelected
            : currentOpt.isSelected,
        };
      });

      setLocalOptions(resetSelection);
      onColumnOptionsChange(resetSelection);
      onReset?.();
    };

    const getIconBorderStyle = () => {
      if (open || isFocused) {
        return 'ring-4 ring-border-brand-focus-ring border-border-action-focused';
      }
      return 'border-border-border';
    };

    const normalizeSearchString = (str: string) =>
      str.toLowerCase().trim().replaceAll(/\s+/g, ' ');

    const normalizedSearch = normalizeSearchString(searchValue);

    const filteredOptions =
      normalizedSearch.length === 0
        ? localOptions
        : localOptions.filter((option) => {
            const normalizedLabel = normalizeSearchString(option.label);
            return normalizedLabel.includes(normalizedSearch);
          });

    const reorderList = (
      list: ColumnOption[],
      startId: string,
      endId: string,
    ) => {
      const oldIndex = list.findIndex((i) => i.value === startId);
      const newIndex = list.findIndex((i) => i.value === endId);

      if (oldIndex === -1 || newIndex === -1) return list;

      const updated = [...list];
      const [removed] = updated.splice(oldIndex, 1);
      updated.splice(newIndex, 0, removed as ColumnOption);

      return updated;
    };

    const handleDragStart = (id: string) => {
      setDraggedId(id);
    };

    const handleDragOver = (e: React.DragEvent, overId: string) => {
      e.preventDefault();

      if (!draggedId || draggedId === overId) return;

      setLocalOptions((prev) => reorderList(prev, draggedId, overId));
    };

    const handleDragEnd = () => {
      setDraggedId(null);
      onColumnOptionsChange(localOptions);
    };

    const isSearching = searchValue.trim().length > 0;
    const isNoDataState = filteredOptions.length === 0;
    return (
      <div
        ref={effectiveWrapperRef}
        className={`relative inline-block ${wrapperClassName}`}
      >
        <div
          onClick={handleIconClick}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setOpen((prev) => !prev);
            }
          }}
          onFocus={handleIconFocus}
          onBlur={handleIconBlur}
          ref={triggerRef}
          className={`${dropdownIconClassName} ${getIconBorderStyle()} bg-fill-fill focus:ring-border-brand-focus-ring focus:border-border-action-focused inline-flex h-12 w-14 cursor-pointer rounded-lg border px-4 py-3 focus:ring-4`}
        >
          {dropdownIcon}
        </div>
        {open && (
          <div
            ref={ref}
            className={`${dropdownWrapperClassName} bg-fill-fill border-border-border-light absolute right-0 top-full z-50 mt-2 flex min-w-[23rem] flex-col gap-6 rounded-xl border py-6 shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_rgba(27,32,41,0.06)]`}
          >
            <SearchInput
              wrapperClassName={`!mx-4 !focus:none !rounded-lg !flex-shrink-0 ${inputWrapperClassName}`}
              label=""
              inputClassName={inputClassName}
              value={searchValue}
              placeholder={searchPlaceholder}
              boxSize="sm"
              onSuffixClick={handleCancelSearch}
              name={name}
              autoComplete={searchAutoComplete ? 'on' : 'off'}
              ref={effectiveInputRef}
              onChange={handleSearchInputChange}
            />
            <div
              className={`flex ${isNoDataState ? 'h-[24.5rem]' : ' max-h-[12.5rem] min-h-0'} flex-1 flex-col overflow-y-auto ${optionListWrapperClassName}`}
            >
              {isNoDataState ? (
                <div className="bg-fill-fill flex h-full flex-1 items-center justify-center px-6 py-10">
                  <div className="flex flex-col items-center gap-6 ">
                    <SearchMI className="h-30 w-30 p-[15px]" />
                    <div className="flex h-14 flex-col items-center justify-center gap-2">
                      <div className="heading-4-semibold text-text-text">
                        No matching columns
                      </div>
                      <div className="paragraph-small text-text-light font-normal">
                        Modify your search to find a column
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                filteredOptions.map((option) => (
                  <div
                    key={option.value}
                    draggable={!isSearching}
                    onDragStart={
                      isSearching
                        ? undefined
                        : () => handleDragStart(option.value)
                    }
                    onDragOver={
                      isSearching
                        ? undefined
                        : (e) => handleDragOver(e, option.value)
                    }
                    onDragEnd={isSearching ? undefined : handleDragEnd}
                    className={`relative cursor-grab active:cursor-grabbing ${
                      draggedId === option.value ? 'opacity-50' : ''
                    }`}
                  >
                    <SelectionList
                      placement="left"
                      rounded
                      wrapperClassName="!cursor-pointer !relative pr-1"
                      title={option.label}
                      isChecked={option.isSelected === true}
                      type="checkbox"
                      onSelect={() => toggleOption(option.value)}
                      key={option.value}
                      inputKey={`column-${option.value}`}
                      inputName="table-columns"
                    />
                    {!isSearching && (
                      <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
                        <ReorderIcon className="h-2 w-[13px]" />
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
            <div className="flex justify-end gap-4 px-4">
              <Button
                hierarchy="Text Button"
                className="!px-3 !py-[0.438rem]"
                label="Reset Columns"
                labelClassName="!px-0"
                size="sm"
                type="button"
                onClick={resetToDefaultOptions}
                icon={
                  <ResetIcon
                    height={18}
                    width={18}
                    className="*:fill-icon-icon"
                  />
                }
              />
              <Button
                hierarchy="Secondary"
                className="!px-[0.875rem] !py-[0.438rem]"
                label="Close"
                onClick={handleIconClick}
                size="sm"
                type="button"
              />
            </div>
          </div>
        )}
      </div>
    );
  },
);
