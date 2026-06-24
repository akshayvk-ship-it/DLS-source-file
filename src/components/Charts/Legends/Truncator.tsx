import { useEffect, useRef, useState } from 'react';
import { ToolTipBase } from '../../ToolTip';

interface TruncatorProps {
  text: string;
  maxTruncateWidth?: number;
  spanClassName?: string;
}

export default function Truncator({
  text,
  maxTruncateWidth = 80,
  spanClassName = '',
}: TruncatorProps) {
  const textRef = useRef<HTMLSpanElement>(null);
  const [showToolTip, setShowToolTip] = useState(false);
  const [shouldTruncate, setShouldTruncate] = useState(false);

  useEffect(() => {
    const element = textRef.current;
    if (!element) return;

    const textWidth = element.getBoundingClientRect().width;
    setShouldTruncate(textWidth > maxTruncateWidth);
  }, [maxTruncateWidth]);

  return (
    <div className="text-text-text relative">
      {showToolTip && shouldTruncate ? (
        <ToolTipBase
          placementToolTip="top-center"
          classNameToolTip="w-max"
          toolTipType="contextual"
          contentToolTip={text}
        />
      ) : null}
      <div className="truncate" style={{ maxWidth: `${maxTruncateWidth}px` }}>
        <span
          ref={textRef}
          onMouseEnter={() => setShowToolTip(true)}
          onMouseLeave={() => setShowToolTip(false)}
          className={`label-small ${spanClassName}`}
        >
          {text}
        </span>
      </div>
    </div>
  );
}
