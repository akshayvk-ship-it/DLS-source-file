import { DividerProps } from './Divider';

export interface InlineStyle {
  [x: string]: string;
}

export interface MenuDropdownClasses {
  iconClassName?: string;
  titleClassName?: string;
  notificationClassName?: string;
  arrowsClassName?: string;
  leftClassName?: string;
  rightClassName?: string;
}

export interface NestedMenu {
  keyName: string;
  title: string;
  menuIcon?: JSX.Element;
  isExpandable: boolean;
  showIcon?: boolean;
  nestedData?: NestedMenu[];
  menuDropdownClassName?: string;
  customInlineStyle?: InlineStyle;
  menuDropDownClasses?: MenuDropdownClasses;
  activeElementValue: string;
  isActiveElement?: boolean;
}

export interface SideMenu extends NestedMenu {
  headerTitle?: string;
}

export interface DividerType extends DividerProps {
  showDivider?: boolean;
}
