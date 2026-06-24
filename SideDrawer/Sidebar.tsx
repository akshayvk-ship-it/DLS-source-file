import { forwardRef, useState } from 'react';
import { SidebarHeader, SidebarHeaderProps } from './SidebarHeader';
import { SidebarBottom, SidebarBottomProps } from './SidebarBottom';
import { Box } from './Box';
import { MenuElements, NotificationsList } from './MenuElements';
import { Drawer, DrawerProps } from './Drawer';
import { DividerProps } from './Divider';
import { SideMenu } from './types';
import { SubHeader } from './SubHeader';

export interface SidebarProps {
  className?: string;
  menu: SideMenu[];
  menuBoxClassName?: string;
  sidebarHeader?: Omit<SidebarHeaderProps, 'isSidebarExpanded'> &
    Partial<SidebarHeaderProps>;
  sidebarBottom?: SidebarBottomProps;
  sidebarDrawer: Omit<
    DrawerProps,
    | 'children'
    | 'anchor'
    | 'containerClassName'
    | 'hideDefaultTranslate'
    | 'isSidebarActive'
  >;
  headerDivider?: DividerProps;
  bottomDivider?: DividerProps;
  hideHeaderDivider?: boolean;
  hideFooterDivider?: boolean;
  activeValueToMatch: string | number;
  menuClickHandler: (
    e:
      | React.MouseEvent<HTMLButtonElement>
      | React.KeyboardEvent<HTMLButtonElement>,
    dropdownKey: string,
  ) => void;
  notificationList?: NotificationsList;
  isSidebarActive?: boolean;
}

export const Sidebar = forwardRef<HTMLDivElement, SidebarProps>(
  (
    {
      className = '',
      menu,
      sidebarHeader,
      sidebarBottom,
      sidebarDrawer,
      menuBoxClassName = '',
      headerDivider,
      bottomDivider,
      hideFooterDivider = false,
      hideHeaderDivider = false,
      activeValueToMatch,
      menuClickHandler,
      notificationList,
      isSidebarActive = undefined,
    },
    ref,
  ) => {
    const [showSidebar, setShowSidebar] = useState(false);

    const handleSidebarExpand = () => {
      if (sidebarHeader?.handleSidebarExpand) {
        sidebarHeader.handleSidebarExpand();
      } else {
        setShowSidebar((prevState) => !prevState);
      }
    };

    const onMouseEnterHandler = (e: React.MouseEvent<HTMLDivElement>) => {
      sidebarDrawer?.onMouseEnter?.(e);
      if (isSidebarActive === undefined) {
        setShowSidebar(true);
      }
    };

    const onMouseLeaveHandler = (e: React.MouseEvent<HTMLDivElement>) => {
      sidebarDrawer?.onMouseLeave?.(e);
      if (isSidebarActive === undefined) {
        setShowSidebar(false);
      }
    };

    const sidebarHeaderDivider = {
      className: headerDivider?.className,
      orientation: headerDivider?.orientation,
      showDivider: hideHeaderDivider || true,
    };

    const sidebarFooterDivider = {
      className: bottomDivider?.className,
      orientation: bottomDivider?.orientation,
      showDivider: hideFooterDivider || true,
    };

    return (
      <Drawer
        containerClassName={`${className || ''} ${!(isSidebarActive ?? showSidebar) ? '!w-20' : ''} flex flex-col h-full w-[17.5rem]`}
        ref={ref}
        onMouseEnter={onMouseEnterHandler}
        onMouseLeave={onMouseLeaveHandler}
        position={sidebarDrawer?.position}
        hideDefaultTranslate
        anchor="left"
        testId={sidebarDrawer?.testId}
        showAnimations={sidebarDrawer?.showAnimations}
      >
        {sidebarHeader && (
          <SidebarHeader
            className={sidebarHeader.className || ''}
            handleSidebarExpand={handleSidebarExpand}
            isSidebarExpanded={isSidebarActive ?? showSidebar}
            logo={sidebarHeader.logo}
            sidebarExpandIcon={sidebarHeader.sidebarExpandIcon}
            showExpandButton={sidebarHeader.showExpandButton}
            collapsedStateLogo={sidebarHeader.collapsedStateLogo}
            customSidebarHeader={sidebarHeader.customSidebarHeader}
            divider={sidebarHeaderDivider}
          />
        )}
        <Box
          className={`${menuBoxClassName} ${!(isSidebarActive ?? showSidebar) ? 'mt-1' : ''}`}
        >
          {menu?.map((element) => (
            <div key={element.title}>
              {element.headerTitle && (
                <SubHeader
                  isSidebarVisible={isSidebarActive ?? showSidebar}
                  title={element.headerTitle}
                  key={element.title}
                  className={`${!(isSidebarActive ?? showSidebar) ? '!mt-0' : 'mt-2'}`}
                />
              )}
              <MenuElements
                menu={element.nestedData || []}
                activeValueToMatch={activeValueToMatch}
                activeCurrentValue={element.activeElementValue}
                isExpandable={element.isExpandable}
                title={element.title}
                customIcon={element.menuIcon}
                showIcon={element.showIcon}
                currentPaddingNested={1.5}
                customInlineStyle={element.customInlineStyle}
                isSidebarVisible={isSidebarActive ?? showSidebar}
                menuDropdownClassName={element.menuDropdownClassName}
                menuDropDownClasses={element.menuDropDownClasses}
                menuClickHandler={menuClickHandler}
                keyName={element.keyName}
                notificationList={notificationList}
                isActiveElement={element.isActiveElement}
              />
            </div>
          ))}
        </Box>
        {sidebarBottom && (
          <SidebarBottom
            customSidebarBottom={() =>
              sidebarBottom.customSidebarBottom(isSidebarActive ?? showSidebar)
            }
            className={sidebarBottom.className}
            divider={sidebarFooterDivider}
          />
        )}
      </Drawer>
    );
  },
);
