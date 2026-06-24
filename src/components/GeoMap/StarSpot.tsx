/* eslint-disable react-hooks/exhaustive-deps */
import { memo, useEffect, useId } from 'react';

interface StarSpotProps {
  x: number;
  y: number;
  showTooltip: () => void;
  hideTooltip: () => void;
  stateAnimationFinished: boolean;
}

function StarSpot({
  x,
  y,
  showTooltip,
  hideTooltip,
  stateAnimationFinished,
}: StarSpotProps) {
  const filterId = `star-spot-filter-${useId()}`;

  useEffect(() => {
    if (!stateAnimationFinished) return undefined;

    showTooltip();

    return () => {
      hideTooltip();
    };
  }, [stateAnimationFinished]);

  return (
    <svg
      width="80"
      height="80"
      x={x - 40}
      y={y - 36}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g opacity="0.1" filter={`url(#${filterId})`}>
        <circle cx="40" cy="40" r="20" fill="#000000" />
      </g>
      <circle opacity="0.04" cx="40" cy="40" r="20" fill="#000000" />
      <circle opacity="0.14" cx="40" cy="40" r="14" fill="#000000" />

      {/* New Star Design */}
      <g transform="translate(29, 30)">
        <g filter={`url(#${filterId}-filter0_ii)`}>
          <path
            d="M10.11 1.59249C10.4372 0.802503 11.5628 0.802504 11.89 1.59249L13.9351 6.53146C14.0735 6.86553 14.3893 7.09364 14.7517 7.12117L20.1096 7.52823C20.9666 7.59334 21.3144 8.65743 20.6596 9.21078L16.5657 12.6703C16.2888 12.9043 16.1682 13.2734 16.2538 13.6245L17.52 18.815C17.7225 19.6452 16.8118 20.3029 16.08 19.8549L11.5047 17.054C11.1952 16.8646 10.8048 16.8646 10.4953 17.054L5.91999 19.8549C5.18817 20.3029 4.27749 19.6452 4.48001 18.815L5.74618 13.6245C5.83182 13.2734 5.71117 12.9043 5.43427 12.6703L1.3404 9.21078C0.685585 8.65743 1.03344 7.59334 1.89042 7.52823L7.24827 7.12117C7.61067 7.09364 7.92655 6.86553 8.06488 6.53146L10.11 1.59249Z"
            fill={`url(#${filterId}-paint0_linear)`}
          />
        </g>
        <g filter={`url(#${filterId}-filter1_f)`}>
          <path
            d="M10.1993 2.48341C10.4937 1.77244 11.5064 1.77247 11.8008 2.48341L13.6417 6.92819C13.7662 7.22884 14.0509 7.43407 14.377 7.45885L19.1993 7.8253C19.9703 7.88422 20.2826 8.84144 19.6934 9.33937L19.2332 9.72832C17.3408 11.3278 15.2773 12.8605 12.8254 13.2181C12.2303 13.3049 11.6208 13.35 11.0001 13.35C10.3792 13.35 9.76957 13.3048 9.17438 13.218C6.72272 12.8604 4.65942 11.3279 2.76715 9.72853L2.30671 9.33937C1.71759 8.84132 2.03061 7.8839 2.80182 7.8253L7.62409 7.45885C7.95006 7.43392 8.23402 7.22871 8.35846 6.92819L10.1993 2.48341Z"
            fill={`url(#${filterId}-paint1_linear)`}
          />
        </g>
      </g>

      <defs>
        <filter
          id={filterId}
          x="0"
          y="0"
          width="80"
          height="80"
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
          <feGaussianBlur
            stdDeviation="3"
            result="effect1_foregroundBlur_16552_3020"
          />
        </filter>

        <filter
          id={`${filterId}-filter0_ii`}
          x="1"
          y="0"
          width="20"
          height="20"
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
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="-1" />
          <feGaussianBlur stdDeviation="0.55" />
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.827451 0 0 0 0 0.572549 0 0 0 0 0.0980392 0 0 0 1 0"
          />
          <feBlend
            mode="normal"
            in2="shape"
            result="effect1_innerShadow_25576_29738"
          />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset />
          <feGaussianBlur stdDeviation="0.35" />
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.827451 0 0 0 0 0.572549 0 0 0 0 0.0980392 0 0 0 1 0"
          />
          <feBlend
            mode="normal"
            in2="effect1_innerShadow_25576_29738"
            result="effect2_innerShadow_25576_29738"
          />
        </filter>

        <filter
          id={`${filterId}-filter1_f`}
          x="0.800488"
          y="0.750195"
          width="20.3995"
          height="13.7997"
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
          <feGaussianBlur
            stdDeviation="0.1"
            result="effect1_foregroundBlur_25576_29738"
          />
        </filter>

        <linearGradient
          id={`${filterId}-paint0_linear`}
          x1="11"
          y1="-2.51607"
          x2="11"
          y2="27.5828"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.134615" stopColor="#F9AA3B" />
          <stop offset="0.336538" stopColor="#F1D122" />
          <stop offset="0.543269" stopColor="#FDE24B" />
          <stop offset="0.697115" stopColor="#FF9602" />
        </linearGradient>

        <linearGradient
          id={`${filterId}-paint1_linear`}
          x1="11.0002"
          y1="1.9502"
          x2="11.0002"
          y2="13.35"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" />
          <stop offset="0.506022" stopColor="#FFFFF5" />
          <stop offset="1" stopColor="#FFFFE5" stopOpacity="0.64" />
        </linearGradient>
      </defs>
    </svg>
  );
}
export default memo(StarSpot);
