import { forwardRef } from 'react';
import { Container } from './Container';
import { Pills, Tabs } from '../Tabs';
import { Panel } from './Panel';

export interface HeaderTabsList {
  tabs: string[];
  onChange: () => void;
  tabClassName: (selected: boolean) => string;
  highlighterClassName?: string;
  className?: string;
}

export interface HeaderProps {
  containerClassName?: string;
  leftPanelContent?: JSX.Element;
  leftPanelClassName?: string;
  rightPanelContent?: JSX.Element;
  rightPanelClassName?: string;
  tabsContent?: HeaderTabsList;
  tabsType?: 'pills' | 'tabs';
  tabsWrapperClassName?: string;
  customMenu?: JSX.Element;
  menuAlign?: 'left' | 'right' | 'center';
}

export const Header = forwardRef<HTMLDivElement, HeaderProps>(
  (
    {
      containerClassName = '',
      rightPanelContent,
      rightPanelClassName = '',
      leftPanelClassName = '',
      leftPanelContent,
      tabsContent,
      tabsType,
      tabsWrapperClassName = '',
      customMenu,
      menuAlign = 'center',
    },
    ref,
  ) => {
    const menuDirectionClassName = {
      left: 'justify-start',
      right: 'justify-end',
      center: 'justify-center',
    };

    const showTabs = !customMenu && tabsContent && tabsType;

    let renderCurrentTabs = null;

    if (showTabs) {
      const tabsProps = {
        onChange: tabsContent?.onChange,
        tabs: tabsContent?.tabs,
        className: tabsContent?.className,
        highlighterClassName: tabsContent?.highlighterClassName,
        tabClassName: tabsContent?.tabClassName,
      };

      if (tabsType === 'tabs') {
        renderCurrentTabs = <Tabs {...tabsProps} />;
      } else if (tabsType === 'pills') {
        renderCurrentTabs = <Pills {...tabsProps} />;
      }
    }

    return (
      <Container
        containerClassName={`${containerClassName} bg-fill-fill flex  border-b border-solid border-border-border-light w-full`}
        ref={ref}
      >
        {leftPanelContent && (
          <Panel className={`${leftPanelClassName}`}>{leftPanelContent}</Panel>
        )}
        <Panel
          className={`${tabsWrapperClassName} flex flex-1 ${menuDirectionClassName[menuAlign]}`}
        >
          {customMenu}
          {renderCurrentTabs}
        </Panel>
        {rightPanelContent && (
          <Panel className={`${rightPanelClassName}`}>
            {rightPanelContent}
          </Panel>
        )}
      </Container>
    );
  },
);
