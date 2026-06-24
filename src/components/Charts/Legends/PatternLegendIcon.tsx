type PatternLegendIconProps = {
  color?: string;
  opacity?: number;
  size?: number;
  className?: string;
  borderColor?: string;
};

function PatternLegendIcon({
  color = '#01B9F1',
  opacity = 1,
  size = 20,
  className = '',
  borderColor,
}: Readonly<PatternLegendIconProps>) {
  return (
    <svg
      width={size}
      className={className}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ opacity }}
    >
      <g filter="url(#filter0_d)">
        <rect x="2" y="1" width="16" height="16" rx="4" fill="white" />
        <rect
          x="2.5"
          y="1.5"
          width="15"
          height="15"
          rx="3.5"
          stroke={borderColor ?? color}
          strokeOpacity="0.44"
          strokeDasharray="0.5 0.5"
        />
        <g clipPath="url(#clip0)">
          {[9.46969, 14.2929, 19.1162, 23.9394, 28.7627].map((y, i) => (
            <line
              key={y}
              x1="-0.353553"
              y1={y}
              x2="101.47"
              y2={-92.3537 + i * 4.8233}
              stroke={color}
              strokeOpacity="0.32"
              strokeDasharray="1 1"
            />
          ))}
        </g>
      </g>
      <defs>
        <filter
          id="filter0_d"
          x="0"
          y="0"
          width="20"
          height="20"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="1" />
          <feGaussianBlur stdDeviation="1" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.105882 0 0 0 0 0.12549 0 0 0 0 0.160784 0 0 0 0.05 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow"
            result="shape"
          />
        </filter>
        <clipPath id="clip0">
          <rect
            width="14"
            height="14"
            fill="white"
            transform="translate(3 2)"
          />
        </clipPath>
      </defs>
    </svg>
  );
}

export default PatternLegendIcon;
