export type State = 'active' | 'default' | 'disabled';
export type SelectionType = 'default' | 'checkbox' | 'radio';
export type ComponentSize = 'sm' | 'lg';

export interface BaseListItem {
  id: string;
  text: string;
  subText?: string;
  state?: State;
  onClick?: (item: ListItem) => void;
  prefixIcon?: JSX.Element;
  isLogo?: boolean;
  chipText?: string;
}

export type ListItem = BaseListItem;

export interface ListItemProps {
  item: ListItem;
  showChip?: boolean;
  showSubText?: boolean;
  showIcon?: boolean;
  isSelected: boolean;
  isDisabled: boolean;
  selectionType: SelectionType;
  componentSize: ComponentSize;
  onSelectionChange: (item: ListItem) => void;
  onItemClick: (item: ListItem) => void;
  dataTestId: string;
  isFirst: boolean;
  isLast: boolean;
  itemClassName?: string;
  textClassName?: string;
  subTextClassName?: string;
  groupName?: string;
}

interface BaseListGroupProps {
  items: ListItem[];
  isMobileWindow?: boolean;
  showIcon?: boolean;
  showChip?: boolean;
  showSubText?: boolean;
  wrapperClassName?: string;
  itemClassName?: string;
  textClassName?: string;
  subTextClassName?: string;
  dataTestId?: string;
  selectionType: SelectionType;
}

interface DefaultWithNoSelectionProps extends BaseListGroupProps {
  selectionType: 'default';
  hasSelection: false;
  selectedItems?: never;
  onSelectionChange?: never;
}

interface DefaultWithSelectionProps extends BaseListGroupProps {
  selectionType: 'default';
  hasSelection: true;
  selectedItems?: [string] | [];
  onSelectionChange?: (selectedItems: string[], changedItem: ListItem) => void;
}

interface CheckboxSelectionProps extends BaseListGroupProps {
  selectionType: 'checkbox';
  hasSelection?: true;
  selectedItems?: string[];
  onSelectionChange?: (selectedItems: string[], changedItem: ListItem) => void;
}

interface RadioSelectionProps extends BaseListGroupProps {
  selectionType: 'radio';
  hasSelection?: true;
  selectedItems?: [string] | [];
  onSelectionChange?: (selectedItems: string[], changedItem: ListItem) => void;
}

export type ListGroupProps =
  | DefaultWithNoSelectionProps
  | DefaultWithSelectionProps
  | CheckboxSelectionProps
  | RadioSelectionProps;
