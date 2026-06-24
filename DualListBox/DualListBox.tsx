import { forwardRef, ReactNode, useRef, useState, DragEvent } from 'react';
import { DualListBoxOption, DragContainer } from './types';
import { ListColumnHeader } from './components/ListColumnHeader';
import { DropPlaceholderState } from './components/DraggableListItems';
import { DualListBoxContainer } from './components/DualListBoxContainer';
import { ControlButtonGroup } from './components/ControlButtonGroup';

export interface DualListBoxProps {
  options: DualListBoxOption[];
  defaultSelectedOptions?: DualListBoxOption[];
  title: string;
  icon?: ReactNode;
  overlineText?: string;
  showSearchInput?: boolean;
  subText?: string;
  listHeaderLeftText?: string;
  listHeaderRightText?: string;
  leftSearchInputPlaceholder?: string;
  rightSearchInputPlaceholder?: string;
  leftListBoxClassName?: string;
  rightListBoxClassName?: string;
  onChange?: (
    selectedOptions: DualListBoxOption[],
    availableOptions: DualListBoxOption[],
  ) => void;
  className?: string;
  dataTestId?: string;
  dragPreviewClassName?: string;
  disableCustomDragPreview?: boolean;
}

/*
  Filters a list of options based on a search term.
  Sets isVisible to true if the option label contains the search term,
  or if the search term is empty.
*/
const applyFilter = (list: DualListBoxOption[], searchTerm: string) => {
  const normalizedSearch = searchTerm.trim().toLowerCase();
  return list.map((option) => ({
    ...option,
    isVisible:
      !normalizedSearch ||
      option.label.toLowerCase().includes(normalizedSearch),
  }));
};

export const DualListBox = forwardRef<HTMLDivElement, DualListBoxProps>(
  (
    {
      options,
      defaultSelectedOptions = [],
      className = '',
      title,
      icon,
      overlineText,
      showSearchInput = false,
      subText,
      listHeaderLeftText = 'Available',
      listHeaderRightText = 'Selected',
      leftSearchInputPlaceholder = 'Search available list',
      rightSearchInputPlaceholder = 'Search selected list',
      leftListBoxClassName = '',
      rightListBoxClassName = '',
      onChange,
      dataTestId = 'dual-list-box-test-id',
      dragPreviewClassName = '',
      disableCustomDragPreview = false,
    },
    ref,
  ) => {
    const [availableOptions, setAvailableOptions] =
      useState<DualListBoxOption[]>(options);
    const [selectedOptions, setSelectedOptions] = useState<DualListBoxOption[]>(
      defaultSelectedOptions,
    );
    const [availableFilter, setAvailableFilter] = useState('');
    const [selectedFilter, setSelectedFilter] = useState('');
    const dragItem = useRef<number | null>(null);
    const dragOverItem = useRef<number | null>(null);
    const dragSourceContainer = useRef<DragContainer | null>(null);
    const dragTargetContainer = useRef<DragContainer | null>(null);
    const draggedItemOptions = useRef<DualListBoxOption[] | null>(null);
    const dragPosition = useRef<'before' | 'after'>('after');
    const dragPreviewRef = useRef<HTMLDivElement>(null);
    const [dragPreviewItems, setDragPreviewItems] = useState<
      DualListBoxOption[]
    >([]);
    const [dropPlaceholder, setDropPlaceholder] =
      useState<DropPlaceholderState>({
        container: null,
        index: -1,
        position: 'after',
      });

    /*
      Returns the options array, setter function, and filter value
      for the specified container type (available or selected).
    */
    const getContainerData = (container: DragContainer) => {
      const isAvailable = container === 'available';
      return {
        options: isAvailable ? availableOptions : selectedOptions,
        setOptions: isAvailable ? setAvailableOptions : setSelectedOptions,
        filter: isAvailable ? availableFilter : selectedFilter,
        setFilter: isAvailable ? setAvailableFilter : setSelectedFilter,
      };
    };

    const availableItemsCount = availableOptions.filter(
      (option) => option.isSelected && option.isVisible,
    ).length;

    const availableVisibleCount = availableOptions.filter(
      (option) => option.isVisible,
    ).length;

    const selectedItemsCount = selectedOptions.filter(
      (option) => option.isSelected && option.isVisible,
    ).length;

    const selectedVisibleCount = selectedOptions.filter(
      (option) => option.isVisible,
    ).length;

    /*
      Handles search input changes for either container.
      Updates the filter value and applies filtering to show/hide options.
    */
    const onSearchChange = (value: string, container: DragContainer) => {
      const { setFilter, setOptions } = getContainerData(container);
      setFilter(value);
      setOptions((prev) => applyFilter(prev, value));
    };

    const handleSearchClear = (container: DragContainer) => {
      const { setFilter } = getContainerData(container);
      setFilter('');
      onSearchChange('', container);
    };

    const handleSearchChange = (
      e: React.ChangeEvent<HTMLInputElement>,
      container: DragContainer,
    ) => {
      onSearchChange(e.target.value, container);
    };

    /*
      Moves selected items from one container to the other.
      If insertAt is provided, inserts at that position; otherwise appends to end.
      Triggers onChange callback with the updated options.
    */
    const moveSelectedOption = (
      sourceContainer: DragContainer,
      insertAt?: number,
    ) => {
      const sourceOptions =
        sourceContainer === 'available' ? availableOptions : selectedOptions;
      const destinationOptions =
        sourceContainer === 'available' ? selectedOptions : availableOptions;

      const selectedSourceOptions = sourceOptions
        .filter((option) => option.isSelected && option.isVisible)
        .map((option) => ({ ...option, isSelected: false }));

      const remainingSourceOptions = sourceOptions.filter(
        (option) => !(option.isSelected && option.isVisible),
      );

      let finalDestinationOptions: DualListBoxOption[];
      if (insertAt === undefined) {
        finalDestinationOptions = [
          ...destinationOptions,
          ...selectedSourceOptions,
        ];
      } else {
        finalDestinationOptions = [...destinationOptions];
        finalDestinationOptions.splice(insertAt, 0, ...selectedSourceOptions);
      }

      if (sourceContainer === 'available') {
        const newAvailableOptions = applyFilter(
          [...remainingSourceOptions],
          availableFilter,
        );
        const newSelectedOptions = applyFilter(
          finalDestinationOptions,
          selectedFilter,
        );

        setAvailableOptions(newAvailableOptions);
        setSelectedOptions(newSelectedOptions);

        onChange?.(newSelectedOptions, newAvailableOptions);
      } else {
        const newSelectedOptions = applyFilter(
          [...remainingSourceOptions],
          selectedFilter,
        );
        const newAvailableOptions = applyFilter(
          finalDestinationOptions,
          availableFilter,
        );

        setSelectedOptions(newSelectedOptions);
        setAvailableOptions(newAvailableOptions);

        onChange?.(newSelectedOptions, newAvailableOptions);
      }
    };

    /*
      Moves all visible items from one container to the other.
      Hidden items (filtered out) remain in their original container.
    */
    const moveAll = (sourceContainer: DragContainer) => {
      if (sourceContainer === 'available') {
        const newSelectedOptions = applyFilter(
          [
            ...availableOptions.filter((option) => option.isVisible),
            ...selectedOptions,
          ],
          selectedFilter,
        );
        const newAvailableOptions = applyFilter(
          availableOptions.filter((option) => !option.isVisible),
          availableFilter,
        );

        setSelectedOptions(newSelectedOptions);
        setAvailableOptions(newAvailableOptions);
        onChange?.(newSelectedOptions, newAvailableOptions);
      } else {
        const newAvailableOptions = applyFilter(
          [
            ...selectedOptions.filter((option) => option.isVisible),
            ...availableOptions,
          ],
          availableFilter,
        );
        const newSelectedOptions = applyFilter(
          selectedOptions.filter((option) => !option.isVisible),
          selectedFilter,
        );

        setAvailableOptions(newAvailableOptions);
        setSelectedOptions(newSelectedOptions);
        onChange?.(newSelectedOptions, newAvailableOptions);
      }
    };

    /*
      Toggles the selection state of an item when clicked.
      Deselects all items in the opposite container to ensure
      only one container has selected items at a time.
    */
    const handleOptionSelected = (index: number, container: DragContainer) => {
      if (container === 'selected') {
        if (!selectedOptions) return;

        if (availableOptions.some((option) => option.isSelected)) {
          const newAvailableOptions = availableOptions.map((option) =>
            option.isSelected ? { ...option, isSelected: false } : option,
          );
          setAvailableOptions(newAvailableOptions);
        }

        const newSelectedOptions = selectedOptions.map((option, idx) =>
          idx === index
            ? { ...option, isSelected: !option.isSelected }
            : option,
        );

        setSelectedOptions(newSelectedOptions);
      } else {
        if (!availableOptions) return;

        if (selectedOptions.some((option) => option.isSelected)) {
          const newSelectedOptions = selectedOptions.map((option) =>
            option.isSelected ? { ...option, isSelected: false } : option,
          );
          setSelectedOptions(newSelectedOptions);
        }

        const newAvailable = availableOptions.map((option, idx) =>
          idx === index
            ? { ...option, isSelected: !option.isSelected }
            : option,
        );

        setAvailableOptions(newAvailable);
      }
    };

    /* 
      Handles the logic for reordering items within the same container.
    
      Moves ALL selected items to the target position, maintaining their relative order.
      
      It calculates the insert index based on the position (before/after the hovered item) and adjusts for the removal of selected items before the insert point.
      
    */
    const handleDragSameContainer = (
      hoverIndex: number,
      sourceItems: DualListBoxOption[],
    ) => {
      if (hoverIndex >= sourceItems.length || hoverIndex < 0) {
        dragItem.current = null;
        dragOverItem.current = null;
        return;
      }

      // Get all selected items (maintaining their relative order)
      const selectedItems = sourceItems.filter(
        (item) => item.isSelected && item.isVisible,
      );

      if (selectedItems.length === 0) return;

      // Get remaining items (non-selected)
      const remainingItems = sourceItems.filter(
        (item) => !(item.isSelected && item.isVisible),
      );

      // Calculate insert index based on position (before/after the hovered item)
      let insertIndex =
        dragPosition.current === 'before' ? hoverIndex : hoverIndex + 1;

      // Count how many selected items are before the insert point
      const selectedBeforeInsert = sourceItems
        .slice(0, insertIndex)
        .filter((item) => item.isSelected && item.isVisible).length;

      // Adjust insert index for the removed selected items
      insertIndex -= selectedBeforeInsert;

      // Deselect all items before inserting
      const deselectedItems = selectedItems.map((item) => ({
        ...item,
        isSelected: false,
      }));

      // Build the reordered list
      const reorderedItems = [...remainingItems];
      reorderedItems.splice(insertIndex, 0, ...deselectedItems);

      if (dragSourceContainer.current === 'available') {
        setAvailableOptions(reorderedItems);
      } else {
        setSelectedOptions(reorderedItems);
      }
    };

    /* 
      Handles the logic for moving an item between containers.
      
      It calculates the insert index based on the position (before/after the hovered item) and moves the dragged item to the other container at the calculated position.
    */
    const handleDragAcrossContainer = (hoverIndex: number) => {
      if (!dragSourceContainer.current) return;

      const insertIndex =
        dragPosition.current === 'before' ? hoverIndex : hoverIndex + 1;

      moveSelectedOption(dragSourceContainer.current, insertIndex);
    };

    /*
      Resets all drag-related state to initial values.
      Called after a drag operation completes or is cancelled.
    */
    const resetDragState = () => {
      dragItem.current = null;
      dragOverItem.current = null;
      dragSourceContainer.current = null;
      dragTargetContainer.current = null;
      draggedItemOptions.current = null;
      dragPosition.current = 'after';
      setDropPlaceholder({ container: null, index: -1, position: 'after' });
    };

    /*
      Called when a drag operation ends (item is dropped).
      Determines whether the drop is within the same container or across containers,
      and delegates to the appropriate handler.
    */
    const handleDragEnd = () => {
      if (dragItem.current === null || dragOverItem.current === null) {
        return;
      }

      const hoverIndex = dragOverItem.current;

      const sourceItems =
        dragSourceContainer.current === 'available'
          ? availableOptions
          : selectedOptions;

      if (
        dragSourceContainer.current &&
        dragTargetContainer.current &&
        dragSourceContainer.current !== dragTargetContainer.current
      ) {
        handleDragAcrossContainer(hoverIndex);
      } else {
        handleDragSameContainer(hoverIndex, sourceItems);
      }

      resetDragState();
    };

    /*
      Checks if dropping at the current position would result in no change.
      
      For cross-container drags, always show the placeholder.
      For same-container drags, hide placeholder when:
      - Hovering over any selected item (can't drop onto self)
      - The drop position would leave items in their original spots (contiguous selections only)
    */
    const isSameDropPosition = (
      container: DragContainer,
      hoverIndex: number,
      position: 'before' | 'after',
    ) => {
      const isDragAcrossContainer = dragSourceContainer.current !== container;
      if (isDragAcrossContainer) return false;

      const listItems =
        container === 'available' ? availableOptions : selectedOptions;

      const hovered = listItems[hoverIndex];

      // hovering over a selected item - hide placeholder
      if (hovered?.isSelected && hovered.isVisible) return true;

      // Collect selected item indexes
      const selectedItemIndexes = listItems
        .map((item, index) => (item.isSelected && item.isVisible ? index : -1))
        .filter((index) => index !== -1);

      if (selectedItemIndexes.length === 0) return false;

      const first = selectedItemIndexes[0] ?? 0;
      const last = selectedItemIndexes[selectedItemIndexes.length - 1] ?? 0;

      // If not contiguous selection, any move causes change - never hide placeholder
      if (last - first + 1 !== selectedItemIndexes.length) return false;

      // Calculate intended insert location
      let insertIndex = position === 'before' ? hoverIndex : hoverIndex + 1;

      // Adjust insert offset by skipped selected items
      insertIndex -= selectedItemIndexes.filter(
        (index) => index < insertIndex,
      ).length;

      return insertIndex === first;
    };

    /*
      Called when a drag operation starts on an item.
      
      Stores the dragged item's index and source container.
      
      Marks the clicked item as selected and collects all selected items
      to display in the placeholder preview during drag.
      
      Uses the drag preview ref to set a custom drag image.
    */
    const handleItemDragStart = (
      e: DragEvent,
      index: number,
      container: DragContainer,
    ) => {
      dragItem.current = index;
      dragSourceContainer.current = container;

      const { options: listItems, setOptions } = getContainerData(container);

      const updatedOptions = listItems.map((opt, idx) =>
        idx === index ? { ...opt, isSelected: true } : opt,
      );

      setOptions(updatedOptions);

      const selectedItems = updatedOptions.filter(
        (option) => option.isSelected && option.isVisible,
      );

      draggedItemOptions.current = selectedItems;

      if (disableCustomDragPreview) return;

      setDragPreviewItems(selectedItems);

      if (dragPreviewRef.current && selectedItems.length > 0) {
        e.dataTransfer.setDragImage(dragPreviewRef.current, 0, 0);
      }
    };

    /*
      Called when dragging over a list item.
      Calculates if the cursor is in the top or bottom half of the item
      to determine the drop position (before or after).
    */
    const handleItemDragOver = (
      e: DragEvent,
      index: number,
      container: DragContainer,
    ) => {
      dragTargetContainer.current = container;
      dragOverItem.current = index;

      const rect = e.currentTarget.getBoundingClientRect();
      const midpoint = rect.top + rect.height / 2;
      const position = e.clientY < midpoint ? 'before' : 'after';

      dragPosition.current = position;
      setDropPlaceholder({ container, index, position });
    };

    /*
      Invoked when an item is dragged over a container.

      When the user drags an item into an empty container,
      the drop indicator index is set as -1 .

      When the user drags an item over empty space in a non-empty container
      (not directly over an item), the drop indicator index is set to the
      last visible item's index in that container.
    */
    const handleContainerDragOver = (
      container: DragContainer,
      lastItemIndex: number,
    ) => {
      dragTargetContainer.current = container;
      dragOverItem.current = lastItemIndex;
      dragPosition.current = 'after';
      setDropPlaceholder({
        container,
        index: lastItemIndex,
        position: 'after',
      });
    };

    const hasAvailableSelected = availableOptions.some(
      (option) => option.isSelected,
    );
    const hasSelectedSelected = selectedOptions.some(
      (option) => option.isSelected,
    );

    const renderHeader = (
      <div className="flex w-full gap-2 pb-2">
        {icon ? (
          <div className="bg-fill-disabled flex size-8 items-center justify-center rounded-lg">
            {icon}
          </div>
        ) : null}
        <div className="w-full">
          {overlineText ? (
            <p className="label-small text-text-text">{overlineText}</p>
          ) : null}
          <h3 className="heading-3-semibold text-text-text w-full">{title}</h3>
          {subText ? (
            <p className="text-text-light label-medium">{subText}</p>
          ) : null}
        </div>
      </div>
    );

    const renderSubHeader = (
      <div className="gap-22 flex">
        <ListColumnHeader
          headerText={listHeaderLeftText}
          showSearchInput={showSearchInput}
          searchName="dual-list-box-available-search"
          placeholder={leftSearchInputPlaceholder}
          filterValue={availableFilter}
          onClear={() => handleSearchClear('available')}
          onSearchChange={(e) => handleSearchChange(e, 'available')}
          selectedCount={availableItemsCount}
          visibleCount={availableVisibleCount}
        />
        <ListColumnHeader
          headerText={listHeaderRightText}
          showSearchInput={showSearchInput}
          searchName="dual-list-box-selected-search"
          placeholder={rightSearchInputPlaceholder}
          filterValue={selectedFilter}
          onClear={() => handleSearchClear('selected')}
          onSearchChange={(e) => handleSearchChange(e, 'selected')}
          selectedCount={selectedItemsCount}
          visibleCount={selectedVisibleCount}
        />
      </div>
    );

    /*
      Hidden drag preview element that shows all selected items.
      Positioned off-screen but rendered in DOM so it can be used with setDragImage.
    */
    const renderDragPreview = (
      <div
        ref={dragPreviewRef}
        className="pointer-events-none fixed -left-[9999px] -top-[9999px] flex flex-col gap-2"
        aria-hidden="true"
      >
        {dragPreviewItems.map((item) => (
          <div
            key={`drag-preview-${item.uniqueId}`}
            className={`bg-fill-action-light text-text-action flex w-[300px] items-center rounded-lg py-2 ${dragPreviewClassName}`}
          >
            <span className="label-medium px-4">{item.label}</span>
          </div>
        ))}
      </div>
    );

    return (
      <div
        ref={ref}
        className={`w-full ${className}`}
        data-testid={dataTestId}
        onDragOver={(e) => {
          e.preventDefault();
        }}
        onDrop={(e) => {
          e.preventDefault();
        }}
      >
        {renderDragPreview}
        <div className="pb-2">
          {renderHeader}
          {renderSubHeader}
        </div>
        <div className="flex items-center gap-4">
          <DualListBoxContainer
            container="available"
            listItems={availableOptions}
            className={leftListBoxClassName}
            dropPlaceholder={dropPlaceholder}
            draggedItemOptions={draggedItemOptions.current ?? []}
            shouldHidePlaceholder={isSameDropPosition}
            onDragStart={handleItemDragStart}
            onDragOver={handleItemDragOver}
            onDragEnd={handleDragEnd}
            onItemClick={(index) => handleOptionSelected(index, 'available')}
            onContainerDragOver={handleContainerDragOver}
          />
          <ControlButtonGroup
            onMoveRight={() => moveSelectedOption('available')}
            onMoveAllRight={() => moveAll('available')}
            onMoveAllLeft={() => moveAll('selected')}
            onMoveLeft={() => moveSelectedOption('selected')}
            disableMoveRight={!hasAvailableSelected}
            disableMoveAllRight={availableOptions.length === 0}
            disableMoveAllLeft={selectedOptions.length === 0}
            disableMoveLeft={!hasSelectedSelected}
          />
          <DualListBoxContainer
            container="selected"
            listItems={selectedOptions}
            className={rightListBoxClassName}
            dropPlaceholder={dropPlaceholder}
            draggedItemOptions={draggedItemOptions.current ?? []}
            shouldHidePlaceholder={isSameDropPosition}
            onDragStart={handleItemDragStart}
            onDragOver={handleItemDragOver}
            onDragEnd={handleDragEnd}
            onItemClick={(index) => handleOptionSelected(index, 'selected')}
            onContainerDragOver={handleContainerDragOver}
          />
        </div>
      </div>
    );
  },
);
