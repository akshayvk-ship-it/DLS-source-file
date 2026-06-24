/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { useEffect, useRef } from 'react';
import animateBillDeskPaint from './createBillDeskLogo';

interface LogoProps {
  width?: number;
  height?: number;
  className?: string;
}

export interface BillDeskLoaderProps extends LogoProps {
  withContainer?: boolean;
}

function BillDeskGreyLogo({
  width,
  height,
  className = '',
}: Readonly<LogoProps>) {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    const cleanup = animateBillDeskPaint(svgRef.current);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return cleanup;
  }, []);
  return (
    <svg
      ref={svgRef}
      className={className}
      width={width}
      height={height}
      viewBox="0 0 42 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      shapeRendering="geometricPrecision"
    >
      <g opacity="0.3">
        <mask
          id="mask1_2508_17289"
          maskUnits="userSpaceOnUse"
          x="7"
          y="6"
          width="6"
          height="24"
        >
          <path
            d="M12.3403 9.58936V27.0238L7.35168 29.9254V12.4744L12.3403 9.58936Z"
            fill="#F15701"
          />
        </mask>
        <g mask="url(#mask1_2508_17289)">
          <path
            d="M12.3403 9.58936V27.0238L7.35168 29.9254V12.4744L12.3403 9.58936Z"
            fill="#F15701"
            stroke="#F15701"
            strokeWidth="0.3"
          />
        </g>
        <mask
          id="mask5_2508_17289"
          maskUnits="userSpaceOnUse"
          x="7"
          y="24"
          width="14"
          height="14"
        >
          <path
            d="M12.3403 27.0238L19.9956 31.4795V37.2745L7.35168 29.9254L12.3403 27.0238Z"
            fill="#F15701"
          />
        </mask>
        <g mask="url(#mask5_2508_17289)">
          <path
            d="M12.3403 27.0238L19.9956 31.4795V37.2745L7.35168 29.9254L12.3403 27.0238Z"
            fill="#F15701"
            stroke="#F15701"
            strokeWidth="0.3"
          />
        </g>
        <mask
          id="mask9_2508_17289"
          maskUnits="userSpaceOnUse"
          x="19"
          y="24"
          width="14"
          height="14"
        >
          <path
            d="M19.9956 31.4795L27.6509 27.0238L32.6395 29.9254L19.9956 37.2745V31.4795Z"
            fill="#F15701"
          />
        </mask>
        <g mask="url(#mask9_2508_17289)">
          <path
            d="M19.9956 31.4795L27.6509 27.0238L32.6395 29.9254L19.9956 37.2745V31.4795Z"
            fill="#F15701"
            stroke="#F15701"
            strokeWidth="0.3"
          />
        </g>
        <mask
          id="mask8_2508_17289"
          maskUnits="userSpaceOnUse"
          x="27"
          y="15"
          width="6"
          height="15"
        >
          <path
            d="M27.6509 27.0238V18.1206L32.6395 15.219V29.9254L27.6509 27.0238Z"
            fill="#F15701"
          />
        </mask>
        <g mask="url(#mask8_2508_17289)">
          <path
            d="M27.6509 27.0238V18.1206L32.6395 15.219V29.9254L27.6509 27.0238Z"
            fill="#F15701"
            stroke="#F15701"
            strokeWidth="0.3"
          />
        </g>

        <mask
          id="mask7_2508_17289"
          maskUnits="userSpaceOnUse"
          x="19"
          y="7"
          width="14"
          height="15"
        >
          <path
            d="M27.6509 18.1205L19.9956 13.6648V7.86157L32.6395 15.2189L27.6509 18.1205Z"
            fill="#F15701"
          />
        </mask>
        <g mask="url(#mask7_2508_17289)">
          <path
            d="M27.6509 18.1205L19.9956 13.6648V7.86157L32.6395 15.2189L27.6509 18.1205Z"
            fill="#F15701"
            stroke="#F15701"
            strokeWidth="0.3"
          />
        </g>

        <mask
          id="mask6_2508_17289"
          maskUnits="userSpaceOnUse"
          x="14"
          y="7"
          width="6"
          height="10"
        >
          <path
            d="M14.7034 10.945L19.9956 7.86157V13.6648L14.7034 16.74V10.945Z"
            fill="#F15701"
          />
        </mask>
        <g mask="url(#mask6_2508_17289)">
          <path
            d="M14.7034 10.945L19.9956 7.86157V13.6648L14.7034 16.74V10.945Z"
            fill="#F15701"
            stroke="#F15701"
            strokeWidth="0.3"
          />
        </g>
        <mask
          id="mask2_2508_17289"
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="19"
          height="17"
        >
          <path
            d="M18.8141 5.80321L12.3403 9.58935L7.35168 12.4744L4.98864 13.8467L0 10.9451L18.8141 0V5.80321Z"
            fill="#F15701"
          />
        </mask>
        <g mask="url(#mask2_2508_17289)">
          <path
            d="M18.8141 5.80321L12.3403 9.58935L7.35168 12.4744L4.98864 13.8467L0 10.9451L18.8141 0V5.80321Z"
            fill="#F15701"
            stroke="#F15701"
            strokeWidth="0.3"
          />
        </g>

        <mask
          id="mask0_2508_17289"
          maskUnits="userSpaceOnUse"
          x="0"
          y="10"
          width="6"
          height="25"
        >
          <path
            d="M0 34.2075V10.9451L4.98864 13.8467V31.3059L0 34.2075Z"
            fill="#F15701"
          />
        </mask>
        <g mask="url(#mask0_2508_17289)">
          <path
            d="M0 34.2075V10.9451L4.98864 13.8467V31.3059L0 34.2075Z"
            fill="#F15701"
            stroke="#F15701"
            strokeWidth="0.3"
          />
        </g>
        <mask
          id="mask10_2508_17289"
          maskUnits="userSpaceOnUse"
          x="0"
          y="28"
          width="19"
          height="18"
        >
          <path
            d="M18.8141 45.1526L0 34.2075L4.98864 31.3059L18.8141 39.3411V45.1526Z"
            fill="#F15701"
          />
        </mask>
        <g mask="url(#mask10_2508_17289)">
          <path
            d="M18.8141 45.1526L0 34.2075L4.98864 31.3059L18.8141 39.3411V45.1526Z"
            fill="#F15701"
            stroke="#F15701"
            strokeWidth="0.3"
          />
        </g>
        <mask
          id="mask4_2508_17289"
          maskUnits="userSpaceOnUse"
          x="21"
          y="28"
          width="19"
          height="18"
        >
          <path
            d="M21.1777 39.3412L35.0031 31.2977L40 34.1993L21.1777 45.1527V39.3412Z"
            fill="#4F4F4F"
          />
        </mask>
        <g mask="url(#mask4_2508_17289)">
          <path
            d="M21.1777 39.3412L35.0031 31.2977L40 34.1993L21.1777 45.1527V39.3412Z"
            fill="#4F4F4F"
            stroke="#4F4F4F"
            strokeWidth="0.3"
          />
        </g>
        <mask
          id="mask3_2508_17289"
          maskUnits="userSpaceOnUse"
          x="34"
          y="10"
          width="6"
          height="25"
        >
          <path
            d="M35.0032 13.8385V31.2977L40 34.1993V10.9369L35.0032 13.8385Z"
            fill="#4F4F4F"
          />
        </mask>
        <g mask="url(#mask3_2508_17289)">
          <path
            d="M35.0032 13.8385V31.2977L40 34.1993V10.9369L35.0032 13.8385Z"
            fill="#4F4F4F"
            stroke="#4F4F4F"
            strokeWidth="0.3"
          />
        </g>

        <mask
          id="mask11_2508_17289"
          maskUnits="userSpaceOnUse"
          x="21"
          y="0"
          width="19"
          height="17"
        >
          <path
            d="M21.1777 5.80321V0L40 10.9368L35.0031 13.8384L21.1777 5.80321Z"
            fill="#4F4F4F"
          />
        </mask>
        <g mask="url(#mask11_2508_17289)">
          <path
            d="M21.1777 5.80321V0L40 10.9368L35.0031 13.8384L21.1777 5.80321Z"
            fill="#4F4F4F"
            stroke="#4F4F4F"
            strokeWidth="0.3"
          />
        </g>
      </g>
    </svg>
  );
}

export function BillDeskLoader({
  withContainer = true,
}: {
  withContainer?: boolean;
}) {
  return withContainer ? (
    <div className="bg-fill-fill flex h-20 w-20 items-center justify-center rounded-[0.875rem] shadow-sm">
      <BillDeskGreyLogo width={36} height={41} />
    </div>
  ) : (
    <BillDeskGreyLogo width={36} height={41} />
  );
}
