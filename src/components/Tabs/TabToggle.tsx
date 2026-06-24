import React from 'react';
import { TabsBase } from './TabsBase';

import {
  HighlighterProps,
  TabProps,
  ContainerProps,
  TabChangeHandler,
} from './types';

export interface TabToggleProps {
  tabs: string[];
  onChange: TabChangeHandler;
  className?: string;
  highlighterClassName?: string;
  tabClassName?: (selected: boolean) => string;
  defaultActiveTab?: number;
  highlighterShadowColor?: string;
  isDisabled?: boolean;
}

const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, children, dataTestId }: ContainerProps, ref) => (
    <div
      ref={ref}
      className={`${className} bg-new-fill-light relative z-10 flex h-9 items-center rounded-3xl p-0.5`}
      data-testid={dataTestId}
    >
      {children}
    </div>
  ),
);

function Highlighter({
  left,
  width,
  className,
  highlighterShadowColor,
  disabled,
}: Readonly<HighlighterProps>) {
  return (
    <div
      className={`${className} ${disabled ? 'bg-new-fill-darker !shadow-none' : 'bg-fill-action'} absolute bottom-0.5 top-0.5 -z-10 !m-0 rounded-3xl transition-[width_left_colors]`}
      style={{
        width,
        left,
        boxShadow: `0px 4px 4px 0px ${highlighterShadowColor}`,
      }}
    />
  );
}

function Tab({
  active,
  onClick,
  onKeyDown,
  value,
  className,
  isDisabled,
}: Readonly<TabProps>) {
  return (
    <button
      onClick={!isDisabled ? onClick : undefined}
      onKeyDown={onKeyDown}
      className={`${className ? className(active) : ''} ${active ? 'text-text-on-fill' : 'text-text-disabled '} ${isDisabled ? '!text-text-disabled cursor-not-allowed' : ''} label-medium flex h-full items-center text-nowrap px-6 font-semibold !outline-none transition-colors`}
      type="button"
    >
      {value as string}
    </button>
  );
}

export const TabToggle = React.forwardRef<HTMLDivElement, TabToggleProps>(
  (
    {
      tabs,
      onChange,
      className,
      highlighterClassName,
      tabClassName,
      defaultActiveTab = 0,
      highlighterShadowColor = 'rgba(241,87,1,0.2)',
      isDisabled = false,
    }: TabToggleProps,
    ref,
  ) => (
    <TabsBase
      tabs={tabs}
      ref={ref}
      onChange={onChange}
      Container={Container}
      Highlighter={Highlighter}
      Tab={Tab}
      className={`${className} overflow-visible`}
      highlighterClassName={highlighterClassName}
      tabClassName={tabClassName}
      defaultActiveTab={defaultActiveTab}
      activeTab={defaultActiveTab}
      highlighterShadowColor={highlighterShadowColor}
      isDisabled={isDisabled}
      showStatusTabs={false}
    />
  ),
);
