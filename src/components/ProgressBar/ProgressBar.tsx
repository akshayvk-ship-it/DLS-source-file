import React, { useEffect, useState } from 'react';
import './index.css';

export type GradientColor = {
  fromColor: `from-${string}`;
  toColor: `to-${string}`;
};

export interface SingleBarColor {
  type: 'single';
  color: `bg-${string}`;
}

export interface DualBarColor {
  type: 'dual';
  color: GradientColor;
}

export interface TimeLimitProp {
  minTime: `${number}s`;
  maxTime: `${number}s`;
}

export type ProgressBarSize = 'small' | 'large';

export interface ProgressBarProps {
  isFinished: boolean;
  progressValue: number;
  size: ProgressBarSize;
  barColorConfig: SingleBarColor | DualBarColor;
  time: TimeLimitProp;
  containerColor?: `bg-${string}`;
  percentageClassName?: string;
  className?: string;
  showPercentage?: boolean;
  showDotEffect?: boolean;
  dataTestId?: string;
}

export const ProgressBar = React.forwardRef<HTMLDivElement, ProgressBarProps>(
  (
    {
      isFinished,
      progressValue = 0,
      size = 'large',
      barColorConfig,
      time,
      containerColor = 'bg-fill-pressed-dark',
      percentageClassName = '',
      className = '',
      showPercentage = false,
      showDotEffect = false,
      dataTestId = 'defaultProgressBarTestId',
    },
    ref,
  ) => {
    const [isPaused, setIsPaused] = useState(false);
    const [currentPercentage, setCurrentPercentage] = useState(0);

    useEffect(() => {
      if (!isFinished) return;

      setCurrentPercentage(100);
      setIsPaused(false);
    }, [isFinished]);

    useEffect(() => {
      let currentValue = currentPercentage;
      const increment = Math.max(1, progressValue / 100);
      const interval = (parseFloat(time.maxTime || '5') * 1000) / 100;

      const intervalId = setInterval(() => {
        currentValue += increment;

        if (currentValue >= progressValue) {
          clearInterval(intervalId);
          currentValue = progressValue;
          setIsPaused(true);
        }

        setCurrentPercentage(Math.min(currentValue, 100));
      }, interval);

      return () => {
        if (intervalId) clearInterval(intervalId);
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [progressValue, time]);

    const getColors = () => {
      if (barColorConfig.type === 'single') return barColorConfig.color;

      const { fromColor, toColor } = barColorConfig.color;
      return `bg-gradient-to-r ${fromColor} from-30% ${toColor} to-100%`;
    };

    const getSizes =
      size === 'small' ? 'min-h-1 rounded-sm' : 'min-h-2 rounded';

    const progressBarStyle = {
      '--animation-duration': isFinished ? time?.minTime : time?.maxTime,
      maxWidth: `${currentPercentage}%`,
    } as React.CSSProperties;

    return (
      <div
        ref={ref}
        className={`flex w-full flex-row items-center gap-2 ${className}`}
        data-testid={dataTestId}
      >
        <div className={`w-full ${getSizes} ${containerColor} overflow-hidden`}>
          <div
            role="progressbar"
            className={`${getColors()} ${getSizes} ${isFinished ? 'w-full' : ''} loading relative h-full `}
            style={progressBarStyle}
          >
            {showDotEffect && !isFinished && isPaused && (
              <div
                className="dot bg-fill-action-light absolute h-full"
                data-testid="test-dot"
              />
            )}
          </div>
        </div>
        {showPercentage && (
          <div
            className={`${percentageClassName} label-small text-text-text flex h-4 w-[1.875rem] flex-row font-normal`}
          >
            {Math.floor(currentPercentage)}%
          </div>
        )}
      </div>
    );
  },
);
