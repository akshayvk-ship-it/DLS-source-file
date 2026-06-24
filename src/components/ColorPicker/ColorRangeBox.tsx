import React, { useImperativeHandle, useRef } from 'react';
import { HSV, hsvToRgb, rgbToHex } from './colorUtils';

export interface ColorRangeBoxProps {
  hsv: HSV;
  onChange: (hsv: HSV) => void;
  colorRangeBoxClass?: string;
}

export const ColorRangeBox = React.forwardRef<
  HTMLDivElement,
  ColorRangeBoxProps
>(({ hsv, onChange, colorRangeBoxClass }, ref) => {
  const boxRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => boxRef.current as HTMLDivElement);

  const handlePointer = (e: PointerEvent | React.PointerEvent) => {
    if (!boxRef.current) return;

    const rect = boxRef.current.getBoundingClientRect();

    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const y = Math.max(0, Math.min(e.clientY - rect.top, rect.height));

    const s = (x / rect.width) * 100;
    const v = (1 - y / rect.height) * 100;

    onChange({ ...hsv, s, v });
  };

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!boxRef.current) return;

    boxRef.current.setPointerCapture(e.pointerId);
    handlePointer(e);

    const handleMove = (event: PointerEvent) => handlePointer(event);
    const handleUp = () => {
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', handleUp);
    };
    window.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerup', handleUp);
  };

  const baseColor = rgbToHex(hsvToRgb({ h: hsv.h, s: 100, v: 100 }));
  const thumbLeft = `${hsv.s}%`;
  const thumbTop = `${100 - hsv.v}%`;

  return (
    <div
      ref={boxRef}
      className={`border-border-border-light relative h-[165px] touch-none select-none overflow-hidden rounded-2xl border ${colorRangeBoxClass}`}
      onPointerDown={onPointerDown}
      aria-label="Color saturation and brightness selector"
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `linear-gradient(to right, #ffffff, ${baseColor})`,
        }}
      />

      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `linear-gradient(to top, #000000, transparent)`,
        }}
      />

      <div
        className="pointer-events-none absolute"
        style={{
          left: thumbLeft,
          top: thumbTop,
          transform: 'translate(-50%, -50%)',
        }}
      >
        <div className="bg-fill-fill h-4 w-4 rounded-full shadow-[0px_2px_4px_0px_#0000003D,_0px_2px_4px_0px_#00000040]" />
      </div>
    </div>
  );
});
