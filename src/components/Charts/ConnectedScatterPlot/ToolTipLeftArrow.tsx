import { ToolTipLeftArrowProps } from './types';

function ToolTipLeftArrow({ className = '', ...props }: ToolTipLeftArrowProps) {
  return (
    <svg
      width="7"
      height="14"
      viewBox="0 0 7 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path
        d="M1.88826 10.2998L7 14L7 0L1.88827 3.70017C-0.62942 5.52261 -0.629423 8.47738 1.88826 10.2998Z"
        fill="#323C4D"
      />
    </svg>
  );
}

export default ToolTipLeftArrow;
