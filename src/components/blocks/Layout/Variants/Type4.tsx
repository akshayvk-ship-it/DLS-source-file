import { forwardRef } from 'react';
import {
  SideBarProvider,
  SideBar,
  SideBarInset,
  SideBarHeader,
  SideBarContent,
  SideBarGroup,
  SideBarDefaultMenu,
  SideBarGroupContent,
  SideBarAccountSection,
  SideBarFooter,
  SideBarHeaderContent,
  SideBarSecondaryContent,
} from '../../SideBar/SideBar';
import { Type4LayoutProps } from '../utils/types';

const Type4 = forwardRef<HTMLDivElement, Type4LayoutProps>(
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
      className="relative h-screen overflow-hidden"
      defaultOpen={defaultSidebarOpen}
      gradient={gradient}
      activeRoute={activeRoute}
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

      <SideBarInset className="peer-data-[variant=inset]:!rounded-4xl peer-data-[variant=inset]:!m-4">
        <main className="rounded-4xl bg-fill-fill flex h-full min-w-0 flex-1 flex-col overflow-hidden">
          <div className="layout-scroll layout-content-scroll h-full min-w-0 overflow-auto">
            {children}
          </div>
        </main>
      </SideBarInset>
    </SideBarProvider>
  ),
);

export default Type4;
