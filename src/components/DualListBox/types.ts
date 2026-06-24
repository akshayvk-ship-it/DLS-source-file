export interface DualListBoxOption {
  uniqueId: string | number;
  label: string;
  isSelected: boolean;
  isVisible: boolean;
}

export type DragContainer = 'available' | 'selected';
