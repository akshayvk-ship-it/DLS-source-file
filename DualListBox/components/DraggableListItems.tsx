import { DragEvent } from 'react';
import { DualListBoxListItem } from './DualListBoxListItem';
import { DropPlaceholder } from './DropPlaceholder';
import { DualListBoxOption, DragContainer } from '../types';

export interface DropPlaceholderState {
  container: DragContainer | null;
  index: number;
  position: 'before' | 'after';
}

export interface DraggableListItemsProps {
  listItems: DualListBoxOption[];
  container: DragContainer;
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
}

export function DraggableListItems({
  listItems,
  container,
  dropPlaceholder,
  draggedItemOptions,
  shouldHidePlaceholder,
  onDragStart,
  onDragOver,
  onDragEnd,
  onItemClick,
}: Readonly<DraggableListItemsProps>) {
  const canShowDropIndicator =
    dropPlaceholder.container === container && draggedItemOptions.length > 0;

  return listItems.map((option, index) => {
    const isDropTarget =
      canShowDropIndicator && dropPlaceholder.index === index;

    const showBefore =
      isDropTarget &&
      dropPlaceholder.position === 'before' &&
      !shouldHidePlaceholder(container, index, 'before');

    const showAfter =
      isDropTarget &&
      dropPlaceholder.position === 'after' &&
      !shouldHidePlaceholder(container, index, 'after');

    return option.isVisible ? (
      <div key={option.uniqueId} className="w-full">
        {showBefore && (
          <DropPlaceholder options={draggedItemOptions} className="mb-2" />
        )}
        <DualListBoxListItem
          option={option}
          isSelected={option.isSelected}
          onDragStart={(e) => {
            e.stopPropagation();
            onDragStart(e, index, container);
          }}
          onDragOver={(e) => {
            e.stopPropagation();
            e.preventDefault();
            onDragOver(e, index, container);
          }}
          onDragEnd={(e) => {
            e.stopPropagation();
            onDragEnd();
          }}
          onClick={() => onItemClick(index)}
          draggable
        />
        {showAfter && (
          <DropPlaceholder options={draggedItemOptions} className="mt-2" />
        )}
      </div>
    ) : null;
  });
}
