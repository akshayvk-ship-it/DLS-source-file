import React, { useState, useEffect } from 'react';
import {
  HSV,
  hsvToRgb,
  rgbToHex,
  hexToRgb,
  rgbToHsv,
  RGB,
  ColorFormat,
} from './colorUtils';
import { ColorRangeBox } from './ColorRangeBox';
import { HueSlider } from './HueSlider';
import { ColorFields } from './ColorFields';

export interface ColorPickerProps {
  showRangeBox?: boolean;
  showHueSlider?: boolean;
  showFields?: boolean;
  defaultFormat?: ColorFormat;
  value?: string;
  onChange?: (color: string | RGB) => void;
  wrapperClassName?: string;
  colorRangeBoxClass?: string;
  dataTestId?: string;
}

const defaultHSV: HSV = { h: 0, s: 100, v: 100 };

export const ColorPicker = React.forwardRef<HTMLDivElement, ColorPickerProps>(
  (props, ref) => {
    const {
      showRangeBox = true,
      showHueSlider = true,
      showFields = true,
      defaultFormat = 'hex',
      value,
      onChange,
      wrapperClassName = '',
      colorRangeBoxClass,
      dataTestId = 'color-picker-test-id',
    } = props;

    const initialHSV =
      value && hexToRgb(value) ? rgbToHsv(hexToRgb(value)!) : defaultHSV;
    const [hsv, setHSV] = useState<HSV>(initialHSV);
    const [mode, setMode] = useState<ColorFormat>(defaultFormat);

    useEffect(() => {
      if (onChange) {
        if (mode === 'rgb') {
          onChange(hsvToRgb(hsv));
        } else {
          onChange(rgbToHex(hsvToRgb(hsv)));
        }
      }
    }, [hsv, mode, onChange]);

    return (
      <div
        className={`bg-fill-fill flex flex-col gap-4 p-4 shadow ${wrapperClassName} `}
        ref={ref}
        data-testid={dataTestId}
      >
        {showRangeBox && (
          <ColorRangeBox
            hsv={hsv}
            onChange={setHSV}
            colorRangeBoxClass={colorRangeBoxClass}
          />
        )}
        {showHueSlider && (
          <HueSlider hue={hsv.h} onChange={(h) => setHSV({ ...hsv, h })} />
        )}
        {showFields && (
          <ColorFields
            hsv={hsv}
            onChange={setHSV}
            mode={mode}
            setMode={setMode}
          />
        )}
      </div>
    );
  },
);

ColorPicker.displayName = 'ColorPickerCard';
