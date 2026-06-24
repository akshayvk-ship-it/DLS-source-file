import React from 'react';
import { StatusTabsProps, TabsBase } from './TabsBase';
import { HighlighterProps, TabProps, ContainerProps } from './types';
import { statusBgColor } from './utils';

export type PillsProps = StatusTabsProps & {
  className?: string;
  highlighterClassName?: string;
  tabClassName?: (selected: boolean) => string;
  defaultActiveTab?: number;
  activeTab?: number;
};

const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, children, dataTestId }: ContainerProps, ref) => (
    <div
      ref={ref}
      className={`${className} border-border-disabled bg-fill-fill-dark z-10 flex h-12 items-center space-x-2 rounded-xl border px-[0.188rem]`}
      data-testid={dataTestId}
    >
      {children}{' '}
    </div>
  ),
);
function Highlighter({ left, width, className }: HighlighterProps) {
  return (
    <div
      className={`${className} bg-fill-fill absolute -z-10 !m-0 h-10 rounded-lg shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1)_,_0px_1px_2px_0px_rgba(0,0,0,0.06)] transition-[width_left]`}
      style={{ width, left }}
    />
  );
}
function Tab({ active, onClick, onKeyDown, value, className }: TabProps) {
  return (
    <div
      onClick={onClick}
      onKeyDown={onKeyDown}
      className={`${className ? className(active) : ''} ${active ? 'text-text-dark ' : 'text-text-light hover:bg-fill-hover focus:bg-fill-hover'} label-medium  flex h-10 items-center text-nowrap rounded-lg px-6  font-semibold !outline-none `}
      role="button"
      tabIndex={0}
    >
      {typeof value === 'string' ? (
        value
      ) : (
        <span className="flex w-full items-center gap-1">
          <span>{value.label}</span>
          <span
            className={`flex h-[1.125rem] items-center gap-1 rounded-2xl p-1 ${active ? statusBgColor(value.status) : ''}`}
          >
            <span
              className={`h-[7px] w-[7px] rounded-full ${value.status === 'live' ? 'bg-fill-success' : 'bg-fill-error'}`}
            />
            {active ? (
              <span
                className={`paragraph-extra-small font-medium ${value.status === 'live' ? 'text-text-success' : 'text-text-error'}`}
              >
                {value.statusText}
              </span>
            ) : (
              ''
            )}
          </span>
        </span>
      )}
    </div>
  );
}
export const Pills = React.forwardRef<HTMLDivElement, PillsProps>(
  (
    {
      tabs,
      onChange,
      className = '',
      highlighterClassName = '',
      tabClassName = undefined,
      defaultActiveTab = 0,
      activeTab,
      showStatusTabs,
    }: PillsProps,
    ref,
  ) => {
    if (showStatusTabs) {
      return (
        <TabsBase
          tabs={tabs}
          ref={ref}
          onChange={onChange}
          Container={Container}
          Highlighter={Highlighter}
          Tab={Tab}
          className={className}
          highlighterClassName={highlighterClassName}
          tabClassName={tabClassName}
          defaultActiveTab={defaultActiveTab}
          activeTab={activeTab}
          showStatusTabs={showStatusTabs}
        />
      );
    }

    return (
      <TabsBase
        tabs={tabs}
        ref={ref}
        onChange={onChange}
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
    );
  },
);
