import { forwardRef } from 'react';
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
  SideBarAccountSection,
  SideBarFooter,
  SideBarSecondaryContent,
} from '../../SideBar/SideBar';
import { Type6LayoutProps } from '../utils/types';

const Type6 = forwardRef<HTMLDivElement, Type6LayoutProps>(
  (
    {
      children,
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
      activeRoute={activeRoute}
      defaultOpen={defaultSidebarOpen}
      ref={ref}
    >
      <SideBar collapsible="icon" variant="floating">
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
            sidebarAccountMenuClassName={`bottom-[-12px] ${sidebarAccountMenuClassName}`}
          />
        </SideBarFooter>
      </SideBar>
      <SideBarInset className="!m-4 !ml-2">
        <main className="!rounded-4xl border-border-border-light bg-fill-fill flex h-full min-w-0 flex-1 flex-col overflow-hidden border">
          <div className="layout-scroll layout-content-scroll h-full min-w-0 overflow-auto">
            {children}
          </div>
        </main>
      </SideBarInset>
    </SideBarProvider>
  ),
);

export default Type6;
