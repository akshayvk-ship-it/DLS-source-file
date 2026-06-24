import { HTMLAttributes } from 'react';
import DragHandle from '../icons/Handle';
import { DualListBoxOption } from '../types';

export interface ListItemProps extends HTMLAttributes<HTMLButtonElement> {
  option: DualListBoxOption;
  isSelected?: boolean;
}

export function DualListBoxListItem({
  option,
  isSelected = false,
  onClick,
  draggable,
  onDragEnd,
  onDragStart,
  onDragOver,
}: Readonly<ListItemProps>) {
  return (
    <button
      type="button"
      onClick={onClick}
      draggable={draggable}
      onDragEnd={onDragEnd}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      className={`bg-fill-fill text-text-text hover:bg-fill-hover-light group/dual-list-box-item flex w-full items-center rounded-lg py-2 ${isSelected ? '!bg-fill-action-light !text-text-action' : ''}`}
    >
      <DragHandle isSelected={isSelected} />
      <p className="label-medium">{option.label}</p>
    </button>
  );
}
