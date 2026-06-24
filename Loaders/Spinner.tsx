import './index.css';

export interface SpinnerProps {
  stopColor?: string;
  className?: string;
}

export function Spinner({
  className = '',
  stopColor = '#3B475B',
}: SpinnerProps) {
  return (
    <svg
      className={`animate-spin ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
      height="56"
      width="56"
      viewBox="0 0 56 56"
      xmlnsXlink="http://www.w3.org/1999/xlink"
    >
      <defs>
        <linearGradient id="Gradient1" gradientTransform="rotate(90)">
          <stop offset="30%" stopColor={stopColor} stopOpacity="0.1" />
          <stop offset="90%" stopColor={stopColor} stopOpacity="0.6" />
        </linearGradient>
        <linearGradient id="Gradient2" gradientTransform="rotate(90)">
          <stop offset="0%" stopColor={stopColor} />
          <stop offset="70%" stopColor={stopColor} stopOpacity="0.6" />
        </linearGradient>
        <pattern
          id="Pattern"
          x="0"
          y="0"
          width="56"
          height="56"
          patternUnits="userSpaceOnUse"
        >
          <g transform="rotate(0, 28, 28)">
            <rect
              shapeRendering="crispEdges"
              x="28"
              y="0"
              width="28"
              height="56"
              fill="url(#Gradient1)"
            />
            <rect
              shapeRendering="crispEdges"
              x="0"
              y="0"
              width="28"
              height="56"
              fill="url(#Gradient2)"
            />
            <circle cx="28" cy="4" r="4" fill={stopColor} />
          </g>
        </pattern>
      </defs>
      <path
        id="circle"
        style={{ stroke: 'url(#Pattern)' }}
        fill="transparent"
        strokeWidth="8"
        d="M 28 4 A 24 24 0 1 1 27.999 4 Z"
      />
    </svg>
  );
}
