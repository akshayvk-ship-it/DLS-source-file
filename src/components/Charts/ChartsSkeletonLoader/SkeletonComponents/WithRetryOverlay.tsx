import React, { useState } from 'react';
import { RetryOverlay } from './RetryOverlay';

export interface BaseSkeletonProps {
  width: number;
  height: number;
  margins: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  animate?: boolean;
  retryClick?: () => void;
  showRetryAfter?: number;
  autoRetryInterval?: number;
  autoRetryAttempts?: number;
  errorIcon?: React.ReactElement;
  autoRetryHeadingText?: string;
  manualRetryHeadingText?: string;
  manualRetrySubText?: string;
  retryMode?: 'auto' | 'manual' | 'disabled';
}

export function withRetryOverlay<T extends BaseSkeletonProps>(
  SkeletonComponent: React.ComponentType<T>,
) {
  const RetryWrappedComponent = React.forwardRef<HTMLDivElement, T>(
    (props, ref) => {
      const {
        showRetryAfter,
        autoRetryInterval,
        autoRetryAttempts,
        retryMode,
        retryClick,
        errorIcon,
        autoRetryHeadingText,
        manualRetryHeadingText,
        manualRetrySubText,
        ...skeletonProps
      } = props;

      const [retryIsAutoPhase, setRetryIsAutoPhase] = useState<boolean>(true);

      return (
        <div
          className="relative"
          ref={ref}
          style={{ width: props.width, height: props.height }}
        >
          <SkeletonComponent
            {...(skeletonProps as unknown as T)}
            retryIsAutoPhase={retryIsAutoPhase}
          />
          {retryMode !== 'disabled' && (
            <RetryOverlay
              autoRetryAttempts={autoRetryAttempts}
              showRetryAfter={showRetryAfter}
              autoRetryInterval={autoRetryInterval}
              retryMode={retryMode}
              onRetry={retryClick}
              onAutoRetryChange={setRetryIsAutoPhase}
              errorIcon={errorIcon}
              autoRetryHeadingText={autoRetryHeadingText}
              manualRetryHeadingText={manualRetryHeadingText}
              manualRetrySubText={manualRetrySubText}
            />
          )}
        </div>
      );
    },
  );

  RetryWrappedComponent.displayName = `withRetryOverlay(${SkeletonComponent.displayName || SkeletonComponent.name})`;

  return RetryWrappedComponent;
}
