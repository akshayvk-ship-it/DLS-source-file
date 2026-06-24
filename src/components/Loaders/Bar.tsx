import React from 'react';
import './index.css';

export interface BarProps {
  isFinished: boolean;
  maxWidth?: `max-w-${string}`;
  height?: `h-${string}`;
  barColor?: `bg-${string}`;
  containerColor?: `bg-${string}`;
  time?: { minTime: `${number}s`; maxTime: `${number}s` };
  progressValue: number;
}

export function Bar({
  maxWidth = 'max-w-64',
  height = 'h-2',
  barColor = 'bg-icon-action',
  containerColor = 'bg-surface-base',
  time = { minTime: '1s', maxTime: '10s' },
  isFinished,
  progressValue,
}: BarProps) {
  const style = {
    '--animation-duration': isFinished ? time?.minTime : time?.maxTime,
    maxWidth: `${progressValue}%`,
  } as React.CSSProperties;

  return (
    <div
      className={`${maxWidth} w-full ${containerColor} rounded-md ${height} overflow-hidden`}
    >
      <div
        className={`${barColor} ${isFinished ? 'w-full' : ''} loading h-full rounded-md `}
        style={style}
      />
    </div>
  );
}
