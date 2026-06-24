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
  SideBarAccountSection,
  SideBarFooter,
  SideBarGroupContent,
  SideBarSecondaryContent,
} from '../../SideBar/SideBar';
import { Type3LayoutProps } from '../utils/types';

const Type3 = forwardRef<HTMLDivElement, Type3LayoutProps>(
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
      <SideBar collapsible="icon" variant="inset">
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

      <SideBarInset className="peer-data-[variant=inset]:!m-4 peer-data-[variant=inset]:!rounded-none">
        <main className="border-border-border-light bg-fill-fill layout-scroll flex min-w-0 flex-1 flex-col overflow-auto border">
          {children}
        </main>
      </SideBarInset>
    </SideBarProvider>
  ),
);

export default Type3;
