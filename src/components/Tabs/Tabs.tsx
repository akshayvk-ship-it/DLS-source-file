import React from 'react';
import { TabsBase } from './TabsBase';
import {
  HighlighterProps,
  TabProps,
  ContainerProps,
  TabChangeHandler,
} from './types';

export interface TabsProps {
  tabs: string[];
  onChange: TabChangeHandler;
  className?: string;
  highlighterClassName?: string;
  tabClassName?: (selected: boolean) => string;
  defaultActiveTab?: number;
  activeTab?: number;
}

const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, children, dataTestId }: ContainerProps, ref) => {
    const bottomLine =
      'after:content-[""] after:w-full after:bottom-0 after:absolute after:bg-border-disabled after:h-[0.0625rem] ';

    return (
      <div
        ref={ref}
        className={`${className} ${bottomLine} space-x-4 `}
        data-testid={dataTestId}
      >
        {children}{' '}
      </div>
    );
  },
);
function Highlighter({ left, width, className }: HighlighterProps) {
  return (
    <div
      className={` ${className} bg-border-action absolute bottom-0 z-10 !m-0 h-[0.125rem] transition-[width_left] ease-out`}
      style={{ width, left }}
    />
  );
}
function Tab({ active, onClick, onKeyDown, value, className }: TabProps) {
  return (
    <div
      onClick={onClick}
      onKeyDown={onKeyDown}
      className={` ${className ? className(active) : ''} ${active ? 'text-text-action' : 'text-text-light'} focus:text-text-action label-medium hover:text-text-action-hover text-nowrap px-2 pb-4 pt-1 font-semibold !outline-none`}
      role="button"
      tabIndex={0}
    >
      {value as string}
    </div>
  );
}
export const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
  (
    {
      tabs,
      onChange,
      className = '',
      highlighterClassName = '',
      tabClassName,
      defaultActiveTab = 0,
      activeTab,
    }: TabsProps,
    ref,
  ) => (
    <TabsBase
      tabs={tabs}
      onChange={onChange}
      ref={ref}
      Container={Container}
      Highlighter={Highlighter}
      Tab={Tab}
      className={className}
      highlighterClassName={highlighterClassName}
      tabClassName={tabClassName}
      defaultActiveTab={defaultActiveTab}
      activeTab={activeTab}
      showStatusTabs={false}
    />
  ),
);
