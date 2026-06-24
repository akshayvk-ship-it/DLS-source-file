import React from 'react';

export type TabsMWebSize = 'sm' | 'lg';

export interface HighlighterProps {
  width: string;
  left: string;
  className?: string;
  highlighterShadowColor?: string;
  disabled?: boolean;
  size?: TabsMWebSize;
}

export interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  dataTestId?: string;
  isDisabled?: boolean;
}

export interface TabProps {
  value: string | StatusTabs;
  active: boolean;
  index: number;
  isDisabled?: boolean;
  className?: (selected: boolean) => string;
  onClick: (e: React.MouseEvent<HTMLElement>) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLElement>) => void;
  size?: TabsMWebSize;
}

export type StatusTabs = {
  label: string;
  status: Status;
  statusText: string;
};

export type Status = 'live' | 'offline';

export type TabChangeHandler = (value: string, index: number) => void;

export type TabChangeHandlerStatusTabs = (
  value: StatusTabs,
  index: number,
) => void;
