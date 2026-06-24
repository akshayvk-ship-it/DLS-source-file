import { forwardRef } from 'react';
import { Type5LayoutProps } from '../utils/types';
import {
  SideBarProvider,
  SideBar,
  SideBarInset,
  SideBarHeader,
  SideBarContent,
  SideBarGroup,
  SideBarDefaultMenu,
  SideBarHeaderContent,
  SideBarGroupContent,
  SideBarFooter,
  SideBarAccountSection,
  SideBarSecondaryContent,
} from '../../SideBar/SideBar';

const Type5 = forwardRef<HTMLDivElement, Type5LayoutProps>(
  (
    {
      children,
      gradient,
      navMain,
      sidebarAccount,
      navSecondary,
      sidebarAccountMenu,
      logo,
      onMenuButtonClick,
      defaultSidebarOpen,
      activeRoute,
      sideBarHeaderClassName = '',
      sidebarAccountMenuClassName = '',
    },
    ref,
  ) => (
    <SideBarProvider
      defaultOpen={defaultSidebarOpen}
      gradient={gradient}
      activeRoute={activeRoute}
      ref={ref}
    >
      <SideBar collapsible="icon" className="border-r-0">
        <SideBarHeader>
          <SideBarHeaderContent
            className={sideBarHeaderClassName}
            logo={logo}
          />
        </SideBarHeader>
        <SideBarContent
          className={`layout-scroll ${sidebarAccount ? '!pb-0' : ''}`}
        >
          <SideBarGroup>
            <SideBarDefaultMenu
              navItems={navMain}
              onMenuButtonClick={onMenuButtonClick}
            />
          </SideBarGroup>
        </SideBarContent>
        <SideBarSecondaryContent>
          {navSecondary && (
            <SideBarGroup className="mt-auto">
              <SideBarGroupContent>
                <SideBarDefaultMenu
                  navItems={navSecondary}
                  onMenuButtonClick={onMenuButtonClick}
                />
              </SideBarGroupContent>
            </SideBarGroup>
          )}
        </SideBarSecondaryContent>
        <SideBarFooter>
          <SideBarAccountSection
            userImage={sidebarAccount.userImage}
            userName={sidebarAccount.name}
            userEmail={sidebarAccount.email}
            dropdownOptions={sidebarAccountMenu}
            onDropdownMenuClick={onMenuButtonClick}
            sidebarAccountMenuClassName={sidebarAccountMenuClassName}
          />
        </SideBarFooter>
      </SideBar>
      <SideBarInset>
        <main className="rounded-l-4xl bg-fill-fill layout-scroll flex min-w-0 flex-1 flex-col overflow-auto">
          {children}
        </main>
      </SideBarInset>
    </SideBarProvider>
  ),
);

export default Type5;
