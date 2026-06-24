import {
  ForwardRefExoticComponent,
  RefAttributes,
  ComponentProps,
} from 'react';
import { SidebarAccount, NavItem } from '../../SideBar/types';

type DropdownMenuComponent = ForwardRefExoticComponent<
  ComponentProps<'div'> & RefAttributes<HTMLDivElement>
> & {
  Group: ForwardRefExoticComponent<
    ComponentProps<'ul'> & RefAttributes<HTMLUListElement>
  >;
  Item: ForwardRefExoticComponent<
    ComponentProps<'li'> & RefAttributes<HTMLLIElement>
  >;
  Text: ForwardRefExoticComponent<
    ComponentProps<'p'> & RefAttributes<HTMLParagraphElement>
  >;
};

type LayoutVariants =
  | 'default'
  | 'type1'
  | 'type2'
  | 'type3'
  | 'type4'
  | 'type5'
  | 'type6';

type SidebarAccountMenu = (Omit<NavItem, 'isActive' | 'badge' | 'items'> & {
  onClick?: (event: React.MouseEvent) => void;
})[];

interface BaseLayoutProps {
  children: React.ReactNode;
  navMain: NavItem[];
  navSecondary?: NavItem[];
  activeRoute?: string;
  sideBarHeaderClassName?: string;
  logo: {
    expanded: React.ComponentType<React.SVGAttributes<SVGElement>>;
    collapsed: React.ComponentType<React.SVGAttributes<SVGElement>>;
    expandedClassName?: string;
    collapsedClassName?: string;
  };
  onMenuButtonClick: (url: string) => void;
  gradient?: boolean;
  defaultSidebarOpen?: boolean;
}

interface TitlebarLayoutProps extends BaseLayoutProps {
  variant: 'default' | 'type1';
  header: React.ReactNode;
  sidebarAccount?: never;
  sidebarAccountMenu?: never;
}

interface AccountLayoutProps extends BaseLayoutProps {
  variant: 'type2' | 'type3' | 'type4' | 'type5' | 'type6';
  sidebarAccount: SidebarAccount;
  sidebarAccountMenu: SidebarAccountMenu;
  sidebarAccountMenuClassName?: string;
  header?: never;
}

type LayoutProps = TitlebarLayoutProps | AccountLayoutProps;

type LayoutWithHeaderProps = Omit<
  TitlebarLayoutProps,
  'variant' | 'sidebarAccount' | 'sidebarAccountMenu'
>;

type LayoutWithAccountProps = Omit<AccountLayoutProps, 'variant' | 'header'>;

type DefaultLayoutProps = LayoutWithHeaderProps;
type Type1LayoutProps = LayoutWithHeaderProps;
type Type2LayoutProps = LayoutWithAccountProps;
type Type3LayoutProps = LayoutWithAccountProps;
type Type4LayoutProps = LayoutWithAccountProps;
type Type5LayoutProps = LayoutWithAccountProps;
type Type6LayoutProps = LayoutWithAccountProps;

type SidebarRoutes = NavItem[];

export type {
  DefaultLayoutProps,
  DropdownMenuComponent,
  LayoutProps,
  LayoutVariants,
  LayoutWithAccountProps,
  LayoutWithHeaderProps,
  NavItem,
  SidebarRoutes,
  SidebarAccount,
  SidebarAccountMenu,
  Type1LayoutProps,
  Type2LayoutProps,
  Type3LayoutProps,
  Type4LayoutProps,
  Type5LayoutProps,
  Type6LayoutProps,
};
