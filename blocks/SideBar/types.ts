export type SidebarContextProps = {
  activeUrl: string;
  setActiveUrl: (url: string) => void;
  state: 'expanded' | 'collapsed';
  open: boolean;
  setOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  gradient?: boolean;
  isDefaultVariant?: boolean;
};
export type HighlightBehavior = 'hover-only' | 'hover-and-active';
export type NavItem = {
  title: string;
  url?: string;
  icon: React.ComponentType<React.SVGAttributes<HTMLOrSVGElement>>;
  iconClassName?: string;
  iconActiveClassName?: string;
  iconHoverClassName?: string;
  textClassName?: string;
  badge?: string;
  notification?: number;
  highlightBehavior?: HighlightBehavior;
  items?: {
    title: string;
    url: string;
    notification?: number;
    highlightBehavior?: HighlightBehavior;
  }[];
};

export type SidebarAccount = {
  name: string;
  email: string;
  // TODO: Deprecate avatar in major release as it is not used in the codebase.
  avatar?: string;
  userImage?: JSX.Element;
};
