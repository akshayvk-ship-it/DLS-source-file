import React, { useState, useEffect, useCallback, useRef } from 'react';
import RetryReloadIcon from '../RetryReloadIcon';
import RetryErrorIcon from '../RetryErrorIcon';

interface RetryOverlayProps {
  autoRetryAttempts?: number;
  showRetryAfter?: number;
  autoRetryInterval?: number;
  retryMode?: 'auto' | 'manual' | 'disabled';
  onRetry?: () => void;
  errorIcon?: React.ReactElement;
  autoRetryHeadingText?: string;
  manualRetryHeadingText?: string;
  manualRetrySubText?: string;
  onAutoRetryChange?: (isAutoPhase: boolean) => void;
}

// eslint-disable-next-line import/prefer-default-export, react/function-component-definition
export const RetryOverlay: React.FC<RetryOverlayProps> = ({
  autoRetryAttempts = 1,
  showRetryAfter = 3000,
  autoRetryInterval = 5000,
  retryMode = 'auto',
  onRetry,
  errorIcon = <RetryErrorIcon />,
  autoRetryHeadingText = 'Please wait while we retry it for you.',
  manualRetryHeadingText = 'Loading failed after multiple tries',
  manualRetrySubText = 'Please try again after sometime',
  onAutoRetryChange,
}) => {
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [showAutoRetry, setShowAutoRetry] = useState(true);
  const [retryAttemptsUsed, setRetryAttemptsUsed] = useState(0);

  const initialDelayTimer = useRef<NodeJS.Timeout | null>(null);
  const countdownTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    onAutoRetryChange?.(showAutoRetry);
  }, [countdown, showAutoRetry, overlayVisible, retryMode, onAutoRetryChange]);

  const handleManualRetry = useCallback(() => {
    onRetry?.();
    setOverlayVisible(false);
    setShowAutoRetry(true);
    setCountdown(0);
    setRetryAttemptsUsed(0);
    setTimeout(() => {
      setOverlayVisible(true);
      setShowAutoRetry(autoRetryAttempts > 0);
    }, showRetryAfter);
  }, [onRetry, showRetryAfter, autoRetryAttempts]);

  const clearTimers = useCallback(() => {
    if (initialDelayTimer.current) {
      clearTimeout(initialDelayTimer.current);
      initialDelayTimer.current = null;
    }
    if (countdownTimer.current) {
      clearInterval(countdownTimer.current);
      countdownTimer.current = null;
    }
  }, []);

  useEffect(() => {
    if (retryMode === 'disabled') return clearTimers;

    initialDelayTimer.current = setTimeout(() => {
      setOverlayVisible(true);
      setShowAutoRetry(autoRetryAttempts > 0);
    }, showRetryAfter);

    return clearTimers;
  }, [showRetryAfter, retryMode, clearTimers, autoRetryAttempts]);

  useEffect(() => {
    if (!overlayVisible || retryMode === 'disabled') return clearTimers;

    const shouldAutoRetry =
      showAutoRetry && retryAttemptsUsed < autoRetryAttempts;

    if (shouldAutoRetry) {
      const intervalSeconds = Math.floor(autoRetryInterval / 1000);
      setCountdown(intervalSeconds);

      countdownTimer.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            onRetry?.();
            setRetryAttemptsUsed((attempt) => {
              const newAttempt = attempt + 1;
              // Hide overlay temporarily after every retry
              setOverlayVisible(false);
              setTimeout(() => {
                setOverlayVisible(true);
                // If all retries exhausted, switch to manual UI
                if (newAttempt >= autoRetryAttempts) {
                  setShowAutoRetry(false);
                }
              }, showRetryAfter);

              return newAttempt;
            });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return clearTimers;
    }

    if (retryAttemptsUsed >= autoRetryAttempts) {
      setShowAutoRetry(false);
    }

    return clearTimers;
  }, [
    overlayVisible,
    showAutoRetry,
    autoRetryInterval,
    onRetry,
    clearTimers,
    retryMode,
    retryAttemptsUsed,
    autoRetryAttempts,
    showRetryAfter,
  ]);

  useEffect(() => clearTimers, [clearTimers]);

  if (!overlayVisible || retryMode === 'disabled') return null;

  const shouldShowAutoUI =
    showAutoRetry && retryAttemptsUsed < autoRetryAttempts;
  const shouldShowManualUI = !shouldShowAutoUI;

  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-fill-fill border-border-border-light flex max-w-md gap-4 rounded-2xl border p-4 shadow-lg">
        <div className="flex-shrink-0">{errorIcon}</div>

        <div className="flex min-w-0 flex-grow flex-col">
          <h5 className="heading-5 text-text-text font-semibold">
            {shouldShowAutoUI ? autoRetryHeadingText : manualRetryHeadingText}
          </h5>

          <p className="label-small text-text-light font-normal">
            {shouldShowAutoUI
              ? `Establishing retry in ${countdown}sec...`
              : manualRetrySubText}
          </p>
        </div>

        {shouldShowManualUI && (
          <div className="flex items-center">
            <button
              type="button"
              onClick={handleManualRetry}
              className="label-small text-text-error hover:text-text-error-hover flex items-center gap-1 font-semibold transition-colors duration-200"
            >
              Reload
              <RetryReloadIcon />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
