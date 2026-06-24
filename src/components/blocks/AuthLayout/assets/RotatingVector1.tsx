/* eslint-disable import/prefer-default-export */
import { SVGProps } from 'react';

export function RotatingVector1(props: Readonly<SVGProps<SVGSVGElement>>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={700}
      height={700}
      viewBox="435 69.5 700 700"
      {...props}
    >
      <path
        fill="#F15701"
        className="fill-micro-illustration-accent"
        d="M781.987 194.732c54.133 10.261 83.112 62.626 123.654 99.925 43.815 40.311 121.295 64.122 119.322 123.618-1.975 59.554-83.707 75.005-127.257 115.686-40.655 37.976-61.217 100.09-115.719 111.284-62.098 12.753-129.785-7.61-175.556-51.463-46.525-44.575-60.268-111.093-61.343-175.507-1.098-65.734 7.56-136.338 55.383-181.465 46.955-44.308 118.078-54.103 181.516-42.078z"
        fontFamily="none"
        fontSize="none"
        fontWeight="none"
      />
    </svg>
  );
}
