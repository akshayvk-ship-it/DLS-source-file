import { memo, useId } from 'react';

interface SpotProps {
  x: number;
  y: number;
  color?: string;
}

function Spot({ x, y, color = '#F15701' }: SpotProps) {
  const filterId = `spot-filter-${useId()}`;

  return (
    <svg
      x={x - 14.5} // Center horizontally (29 width / 2)
      y={y - 14} // Center vertically (28 height / 2)
      width="29"
      height="28"
      viewBox="0 0 29 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="relative z-50"
      pointerEvents="none"
    >
      <g opacity="0.1" filter={`url(#${filterId})`}>
        <circle cx="14.8057" cy="14" r="11" fill={color} />
      </g>
      <circle opacity="0.04" cx="14.8057" cy="14" r="10" fill={color} />
      <circle opacity="0.14" cx="14.8057" cy="14" r="7" fill={color} />
      <circle opacity="0.8" cx="15" cy="14" r="3" fill={color} />

      <defs>
        <filter
          id={filterId}
          x="0.805664"
          y="0"
          width="28"
          height="28"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feGaussianBlur stdDeviation="1.5" result="effect1_foregroundBlur" />
        </filter>
      </defs>
    </svg>
  );
}

export default memo(Spot);
