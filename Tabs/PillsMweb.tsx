import React from 'react';
import { TabsBase } from './TabsBase';
import {
  ContainerProps,
  HighlighterProps,
  TabChangeHandler,
  TabProps,
} from './types';

export interface PillsMwebProps {
  tabs: string[];
  onChange: TabChangeHandler;
  dataTestId?: string;
  className?: string;
  highlighterClassName?: string;
  tabClassName?: (selected: boolean) => string;
  defaultActiveTab?: number;
  activeTab?: number;
  size?: 'sm' | 'lg';
}

const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, children, dataTestId }: ContainerProps, ref) => (
    <div
      ref={ref}
      className={`${className} flex items-center space-x-2`}
      data-testid={dataTestId}
    >
      {children}{' '}
    </div>
  ),
);
function Highlighter({ left, width, className, size }: HighlighterProps) {
  return (
    <div
      className={`${className} bg-fill-info-dark absolute -z-10 !m-0  ${size === 'lg' ? 'h-10 rounded-[2.5rem]' : 'h-8 rounded-2xl'} shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1)_,_0px_1px_2px_0px_rgba(0,0,0,0.06)] `}
      style={{ width, left }}
    />
  );
}
function Tab({ active, onClick, onKeyDown, value, className, size }: TabProps) {
  return (
    <div
      onClick={onClick}
      onKeyDown={onKeyDown}
      className={`${className ? className(active) : ''} ${active ? 'text-text-on-fill border-transparent' : 'text-text-text hover:border-border-dark hover:bg-fill-fill-dark'}  label-medium border-border-border-light flex items-center text-nowrap  border px-4 font-medium !outline-none
        ${size === 'lg' ? 'h-10 rounded-[2.5rem]' : 'h-8 rounded-2xl'}
      `}
      role="button"
      tabIndex={0}
    >
      {value as string}
    </div>
  );
}

export const PillsMweb = React.forwardRef<HTMLDivElement, PillsMwebProps>(
  (
    {
      tabs,
      onChange,
      className = '',
      highlighterClassName = '',
      defaultActiveTab = 0,
      tabClassName = undefined,
      activeTab,
      dataTestId = 'pills-mweb-test-id',
      size = 'lg',
    },
    ref,
  ) => (
    <TabsBase
      tabs={tabs}
      ref={ref}
      onChange={onChange}
      Container={Container}
      Highlighter={Highlighter}
      Tab={Tab}
      className={`${className} bg-fill-fill z-10 py-1`}
      highlighterClassName={highlighterClassName}
      tabClassName={tabClassName}
      defaultActiveTab={defaultActiveTab}
      activeTab={activeTab}
      dataTestId={dataTestId}
      size={size}
    />
  ),
);
