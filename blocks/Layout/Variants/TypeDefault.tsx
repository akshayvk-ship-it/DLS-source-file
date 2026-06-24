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
import { DefaultLayoutProps } from '../utils/types';

const TypeDefault = forwardRef<HTMLDivElement, DefaultLayoutProps>(
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
      isDefaultVariant
      defaultOpen={defaultSidebarOpen}
      gradient={gradient}
      activeRoute={activeRoute}
      ref={ref}
    >
      <SideBar collapsible="icon">
        <SideBarHeader className="border-border-border-light border-b">
          <SideBarHeaderContent
            className={sideBarHeaderClassName}
            logo={logo}
          />
        </SideBarHeader>
        <SideBarContent>
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
        <main className="bg-fill-fill flex min-w-0 flex-1 flex-col overflow-auto">
          {children}
        </main>
      </SideBarInset>
    </SideBarProvider>
  ),
);

export default TypeDefault;
