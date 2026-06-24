import { forwardRef, useCallback, useEffect, useState, useMemo } from 'react';
import { ListGroupProps, ListItem, ComponentSize } from './types';
import ListItemComponent from './ListItem';

// eslint-disable-next-line import/prefer-default-export
export const ListGroup = forwardRef<HTMLDivElement, ListGroupProps>(
  (props, ref) => {
    const {
      selectionType,
      showChip = false,
      showSubText = false,
      showIcon = false,
      items,
      selectedItems,
      onSelectionChange,
      isMobileWindow = false,
      wrapperClassName = '',
      itemClassName = '',
      textClassName = '',
      subTextClassName = '',
      hasSelection = true,
      dataTestId = 'listgroup',
    } = props;

    const componentSize: ComponentSize = isMobileWindow ? 'sm' : 'lg';

    const [internalSelectedItems, setInternalSelectedItems] = useState<
      string[]
    >(selectedItems || []);

    const effectiveSelectionType = useMemo(() => {
      if (hasSelection) {
        return selectionType;
      }
      if (selectionType === 'radio' || selectionType === 'checkbox') {
        return 'default';
      }
      return selectionType;
    }, [hasSelection, selectionType]);

    useEffect(() => {
      if (selectedItems) {
        setInternalSelectedItems(selectedItems);
      }
    }, [selectedItems]);

    const selectionConfig = useMemo(
      () => ({
        isSingleSelectMode:
          effectiveSelectionType === 'radio' ||
          effectiveSelectionType === 'default',
        isMultiSelectMode: effectiveSelectionType === 'checkbox',
        hasSelectionCapability:
          effectiveSelectionType !== 'default' || hasSelection,
      }),
      [effectiveSelectionType, hasSelection],
    );

    const { isSingleSelectMode, isMultiSelectMode, hasSelectionCapability } =
      selectionConfig;

    const isItemSelected = useCallback(
      (item: ListItem): boolean => internalSelectedItems.includes(item.id),
      [internalSelectedItems],
    );

    const isItemDisabled = useCallback(
      (item: ListItem): boolean => item.state === 'disabled',
      [],
    );

    const handleItemSelection = useCallback(
      (item: ListItem) => {
        if (isItemDisabled(item) || !hasSelectionCapability) {
          return;
        }

        const isSelected = isItemSelected(item);
        let newSelection: string[] = [];

        if (isSingleSelectMode) {
          newSelection = isSelected ? [] : [item.id];
        } else {
          newSelection = isSelected
            ? internalSelectedItems.filter((id) => id !== item.id)
            : [...internalSelectedItems, item.id];
        }

        setInternalSelectedItems(newSelection);
        onSelectionChange?.(newSelection, item);
      },
      [
        internalSelectedItems,
        isSingleSelectMode,
        hasSelectionCapability,
        onSelectionChange,
        isItemSelected,
        isItemDisabled,
      ],
    );

    const handleItemClick = useCallback(
      (item: ListItem) => {
        handleItemSelection(item);
        item.onClick?.(item);
      },
      [handleItemSelection],
    );

    const getContainerAriaRole = useCallback((): string => {
      if (isSingleSelectMode) return 'radiogroup';
      if (isMultiSelectMode) return 'group';
      return 'list';
    }, [isSingleSelectMode, isMultiSelectMode]);

    const groupName =
      effectiveSelectionType === 'radio'
        ? `${dataTestId}-radio-group`
        : undefined;

    return (
      <div
        className={`border-border-border-light rounded-lg border ${wrapperClassName}`}
        data-testid={dataTestId}
        role={getContainerAriaRole()}
        ref={ref}
      >
        {items.map((item, index) => {
          const isFirst = index === 0;
          const isLast = index === items.length - 1;

          return (
            <ListItemComponent
              key={item.id}
              showChip={showChip}
              showSubText={showSubText}
              showIcon={showIcon}
              item={item}
              isSelected={isItemSelected(item)}
              isDisabled={isItemDisabled(item)}
              selectionType={effectiveSelectionType}
              componentSize={componentSize}
              onSelectionChange={handleItemSelection}
              onItemClick={handleItemClick}
              dataTestId={dataTestId}
              isFirst={isFirst}
              isLast={isLast}
              itemClassName={itemClassName}
              textClassName={textClassName}
              subTextClassName={subTextClassName}
              groupName={groupName}
            />
          );
        })}
      </div>
    );
  },
);

ListGroup.displayName = 'ListGroup';
