import { forwardRef } from 'react';
import {
  SideBarProvider,
  SideBar,
  SideBarInset,
  SideBarHeader,
  SideBarContent,
  SideBarGroup,
  SideBarDefaultMenu,
  SideBarFooter,
  SideBarAccountSection,
  SideBarGroupContent,
  SideBarHeaderContent,
  SideBarSecondaryContent,
} from '../../SideBar/SideBar';
import { Type2LayoutProps } from '../utils/types';

const Type2 = forwardRef<HTMLDivElement, Type2LayoutProps>(
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
      activeRoute={activeRoute}
      defaultOpen={defaultSidebarOpen}
      gradient={gradient}
      ref={ref}
    >
      <SideBar collapsible="icon">
        <SideBarHeader>
          <SideBarHeaderContent
            className={sideBarHeaderClassName}
            logo={logo}
          />
        </SideBarHeader>
        <SideBarContent
          className={`layout-scroll ${sidebarAccount ? '!pb-0' : ''}`}
        >
          {/* Nav Primary */}
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
        <main className="bg-fill-fill layout-scroll flex min-w-0 flex-1 flex-col overflow-auto">
          {children}
        </main>
      </SideBarInset>
    </SideBarProvider>
  ),
);

export default Type2;
