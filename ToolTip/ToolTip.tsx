// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { forwardRef, useEffect, useRef, useState } from 'react';
import { ToolTipBase, ToolTipBaseProps } from './ToolTipBase';

export interface ToolTipProps extends ToolTipBaseProps {
  iconToolTip: JSX.Element;
  alwaysShowToolTip?: boolean;
  className?: string;
  tooltipDelayOnHover?: number;
  classNameToolTip?: string;
  suffixIcon?: JSX.Element;
}

export const ToolTip = forwardRef<HTMLDivElement, ToolTipProps>(
  (
    {
      iconToolTip,
      contentToolTip,
      titleToolTip,
      alwaysShowToolTip = false,
      placementToolTip,
      toolTipType,
      renderCustomContentToolTip,
      className = '',
      tooltipDelayOnHover = 0,
      classNameToolTip = '',
      suffixIcon,
    },
    ref,
  ) => {
    const [showToolTip, setShowToolTip] = useState(false);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const handleMouseEnter = () => {
      if (alwaysShowToolTip) return;

      if (!tooltipDelayOnHover) {
        setShowToolTip(true);
      } else {
        timerRef.current = setTimeout(
          () => setShowToolTip(true),
          tooltipDelayOnHover,
        );
      }
    };

    const clearTimer = () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };

    const handleMouseLeave = () => {
      if (alwaysShowToolTip) return;
      clearTimer();
      setShowToolTip(false);
    };

    useEffect(() => {
      if (alwaysShowToolTip) {
        setShowToolTip(true);
      } else {
        setShowToolTip(false);
      }
    }, [alwaysShowToolTip]);

    useEffect(
      () => () => {
        clearTimer();
      },
      [],
    );

    return (
      <div
        className={`${className} relative`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        ref={ref}
        data-testid="tooltip-ui-library"
      >
        <div className="cursor-pointer">{iconToolTip}</div>
        {showToolTip ? (
          <ToolTipBase
            contentToolTip={contentToolTip}
            titleToolTip={titleToolTip}
            placementToolTip={placementToolTip}
            classNameToolTip={classNameToolTip}
            renderCustomContentToolTip={renderCustomContentToolTip}
            toolTipType={toolTipType}
            suffixIcon={suffixIcon}
          />
        ) : (
          ''
        )}
      </div>
    );
  },
);
