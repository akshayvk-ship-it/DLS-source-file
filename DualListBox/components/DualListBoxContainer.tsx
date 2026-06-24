/* eslint-disable import/prefer-default-export */
import { DragEvent } from 'react';
import { DualListBoxOption, DragContainer } from '../types';
import { DropPlaceholder } from './DropPlaceholder';
import { DraggableListItems, DropPlaceholderState } from './DraggableListItems';

const containerClassName =
  'border-border-border bg-fill-fill flex h-[18.5rem] w-full flex-col gap-2 overflow-y-auto rounded-lg border p-2';

interface DualListBoxContainerProps {
  container: DragContainer;
  listItems: DualListBoxOption[];
  className?: string;
  dropPlaceholder: DropPlaceholderState;
  draggedItemOptions: DualListBoxOption[];
  shouldHidePlaceholder: (
    container: DragContainer,
    index: number,
    position: 'before' | 'after',
  ) => boolean;
  onDragStart: (e: DragEvent, index: number, container: DragContainer) => void;
  onDragOver: (e: DragEvent, index: number, container: DragContainer) => void;
  onDragEnd: () => void;
  onItemClick: (index: number) => void;
  onContainerDragOver: (
    container: DragContainer,
    lastItemIndex: number,
  ) => void;
}

export function DualListBoxContainer({
  container,
  listItems,
  className = '',
  dropPlaceholder,
  draggedItemOptions,
  shouldHidePlaceholder,
  onDragStart,
  onDragOver,
  onDragEnd,
  onItemClick,
  onContainerDragOver,
}: Readonly<DualListBoxContainerProps>) {
  // Used to show the drop placeholder when the user drags an item into an empty container.
  const showEmptyPlaceholder =
    dropPlaceholder.container === container &&
    dropPlaceholder.index === -1 &&
    draggedItemOptions.length > 0;

  /*
    Returns the index of the last visible item in the target container.

    This decides where to place the drop placeholder when
    users drag into empty space on a non-empty container or a empty container.

    When the user drags an item into an empty container,
    the last visible item index is -1.
  */
  const getLastTargetContainerItem = (): number => {
    for (let i = listItems.length - 1; i >= 0; i -= 1) {
      if (listItems[i]?.isVisible) return i;
    }
    return -1;
  };

  const handleContainerDragOver = (e: DragEvent) => {
    if (e.currentTarget !== e.target) return;
    e.stopPropagation();
    e.preventDefault();
    onContainerDragOver(container, getLastTargetContainerItem());
  };

  return (
    <div
      className={`${containerClassName} ${className}`}
      onDragOver={handleContainerDragOver}
    >
      {showEmptyPlaceholder && <DropPlaceholder options={draggedItemOptions} />}
      <DraggableListItems
        listItems={listItems}
        container={container}
        dropPlaceholder={dropPlaceholder}
        draggedItemOptions={draggedItemOptions}
        shouldHidePlaceholder={shouldHidePlaceholder}
        onDragStart={onDragStart}
        onDragOver={onDragOver}
        onDragEnd={onDragEnd}
        onItemClick={onItemClick}
      />
    </div>
  );
}
