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
  SideBarHeaderContent,
  SideBarSecondaryContent,
} from '../../SideBar/SideBar';
import HeaderContainer from '../Header';
import { Type1LayoutProps } from '../utils/types';

const Type1 = forwardRef<HTMLDivElement, Type1LayoutProps>(
  (
    {
      children,
      gradient,
      navMain,
      navSecondary,
      header,
      logo,
      onMenuButtonClick,
      defaultSidebarOpen,
      activeRoute,
      sideBarHeaderClassName = '',
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
        <SideBarContent className="layout-scroll">
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
      </SideBar>

      <SideBarInset>
        {header && <HeaderContainer>{header}</HeaderContainer>}
        <main className="bg-fill-fill layout-scroll flex min-w-0 flex-1 flex-col overflow-auto">
          {children}
        </main>
      </SideBarInset>
    </SideBarProvider>
  ),
);

export default Type1;
