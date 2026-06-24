import React, { useState, useEffect } from 'react';
import {
  HSV,
  RGB,
  hsvToRgb,
  rgbToHex,
  rgbToHsv,
  hexToRgb,
  ColorFormat,
} from './colorUtils';

export interface ColorFieldProps {
  hsv: HSV;
  onChange: (hsv: HSV) => void;
  mode: ColorFormat;
  colorFieldClass?: string;
  setMode: (mode: ColorFormat) => void;
}

interface RGBFieldDataProps {
  key: keyof RGB;
  label: 'R' | 'G' | 'B';
}

function ColorModeSelectionIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.07358 11.2539C6.22954 11.098 6.44103 11.0104 6.66156 11.0104C6.88209 11.0104 7.09358 11.098 7.24954 11.2539L9.9882 13.9926L12.7269 11.2539C12.8036 11.1745 12.8953 11.1111 12.9968 11.0675C13.0983 11.0239 13.2074 11.001 13.3178 11C13.4283 10.9991 13.5378 11.0201 13.64 11.0619C13.7422 11.1037 13.835 11.1655 13.9131 11.2436C13.9912 11.3217 14.053 11.4145 14.0948 11.5167C14.1366 11.6189 14.1576 11.7285 14.1567 11.8389C14.1557 11.9493 14.1328 12.0584 14.0892 12.1599C14.0456 12.2614 13.9823 12.3531 13.9028 12.4299L10.5762 15.7565C10.4202 15.9124 10.2087 16 9.9882 16C9.76767 16 9.55617 15.9124 9.40022 15.7565L6.07358 12.4299C5.91766 12.2739 5.83008 12.0624 5.83008 11.8419C5.83008 11.6214 5.91766 11.4099 6.07358 11.2539Z"
        fill="#9CA3AF"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M13.9132 8.74586C13.7573 8.90177 13.5458 8.98936 13.3252 8.98936C13.1047 8.98936 12.8932 8.90177 12.7373 8.74586L9.9986 6.0072L7.25994 8.74586C7.18322 8.82529 7.09145 8.88865 6.98999 8.93224C6.88852 8.97582 6.77939 8.99876 6.66896 8.99972C6.55854 9.00068 6.44902 8.97964 6.34682 8.93782C6.24461 8.89601 6.15175 8.83425 6.07367 8.75617C5.99558 8.67808 5.93383 8.58523 5.89201 8.48302C5.85019 8.38081 5.82915 8.2713 5.83011 8.16087C5.83107 8.05044 5.85401 7.94131 5.8976 7.83985C5.94118 7.73838 6.00454 7.64661 6.08397 7.56989L9.41061 4.24325C9.56657 4.08734 9.77807 3.99976 9.9986 3.99976C10.2191 3.99976 10.4306 4.08734 10.5866 4.24325L13.9132 7.56989C14.0691 7.72585 14.1567 7.93735 14.1567 8.15788C14.1567 8.3784 14.0691 8.5899 13.9132 8.74586Z"
        fill="#9CA3AF"
      />
    </svg>
  );
}

export const ColorFields = React.forwardRef<HTMLDivElement, ColorFieldProps>(
  ({ hsv, onChange, mode, setMode, colorFieldClass = '' }, ref) => {
    const rgb = hsvToRgb(hsv);
    const hex = rgbToHex(rgb);

    const [hexInput, setHexInput] = useState(hex);
    const [rgbInput, setRgbInput] = useState(rgb);

    useEffect(() => {
      setHexInput(hex);
      setRgbInput(rgb);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hsv]);

    function handleHexChange(val: string) {
      const isValid = /^#?[0-9a-fA-F]{0,6}$/.test(val);
      if (!isValid) return;

      setHexInput(val);
      const newRgb = hexToRgb(val);

      if (newRgb) {
        onChange(rgbToHsv(newRgb));
      }
    }

    const handleRgbChange = (channel: keyof RGB, value: string) => {
      const num = Math.max(0, Math.min(255, Number(value.replace(/\D/g, ''))));
      const newRgb = { ...rgbInput, [channel]: num };
      setRgbInput(newRgb);
      onChange(rgbToHsv(newRgb));
    };

    const changeMode = () => {
      if (mode === 'hex') {
        setMode('rgb');
      } else {
        setMode('hex');
      }
    };

    const rgbChannels: RGBFieldDataProps[] = [
      { key: 'r', label: 'R' },
      { key: 'g', label: 'G' },
      { key: 'b', label: 'B' },
    ];

    return (
      <div className={`flex items-center gap-2 ${colorFieldClass}`} ref={ref}>
        <button
          onClick={changeMode}
          type="button"
          className="border-border-border flex h-12 min-w-[6.5rem] items-center justify-between overflow-hidden rounded-lg border px-4"
        >
          <div className="label-large text-text-light mr-2 py-3 font-normal">
            {mode === 'hex' ? 'HEX' : 'RGB'}
          </div>
          <ColorModeSelectionIcon />
        </button>
        {mode === 'hex' ? (
          <div className="relative w-full  shadow-[0px_1px_2px_0px_rgba(27,32,41,0.05)]">
            <span className="text-text-light label-large pointer-events-none absolute top-1/2 ml-4 -translate-y-1/2">
              #
            </span>
            <input
              type="text"
              className="border-border-border label-large text-text-text h-12 w-full rounded-lg border pl-[1.938rem] focus:outline-none"
              value={hexInput.replace(/^#/, '')}
              onChange={(e) => handleHexChange(`#${e.target.value}`)}
              maxLength={6}
            />
          </div>
        ) : (
          <div className="border-border-border flex h-12 w-full justify-between overflow-hidden rounded-lg border shadow-[0px_1px_2px_0px_rgba(27,32,41,0.05)]">
            {rgbChannels.map(({ key, label }) => (
              <div
                key={key}
                className={`flex h-full w-full items-center px-4 ${
                  key === 'g'
                    ? 'border-border-border-light border-l border-r'
                    : ''
                }`}
              >
                <span className="label-large text-text-lighter">{label}</span>
                <input
                  type="number"
                  className="input-no-spinner label-large text-text-text h-full w-full pl-1 text-center font-normal focus:outline-none"
                  value={rgbInput[key]}
                  min={0}
                  max={255}
                  onChange={(e) => handleRgbChange(key, e.target.value)}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    );
  },
);
