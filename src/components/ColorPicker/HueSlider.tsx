import React from 'react';
import './index.css';

export interface HueSliderProps {
  hue: number;
  onChange: (hue: number) => void;
}

export const HueSlider = React.forwardRef<HTMLDivElement, HueSliderProps>(
  ({ hue, onChange }, ref) => (
    <div ref={ref}>
      <input
        type="range"
        min={0}
        max={360}
        value={hue}
        onChange={(e) => onChange(Number(e.target.value))}
        className="slider-input-hue w-full appearance-none rounded-3xl"
      />
    </div>
  ),
);
