/* eslint-disable import/prefer-default-export */
import { SVGProps } from 'react';

export function RotatingVector3(props: Readonly<SVGProps<SVGSVGElement>>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={700}
      height={700}
      viewBox="445 69.5 700 700"
      {...props}
    >
      <path
        fill="#F15701"
        className="fill-micro-illustration-accent"
        d="M753.083 102.16c51.081-10.889 99.331 32.411 137.713 67.833 34.531 31.869 37.957 83.785 66.784 120.895 41.408 53.306 152.496 76.716 137.914 142.621-15.156 68.507-144.404 29.581-188.15 84.437-47.134 59.106 17.412 185.163-51.548 216.14-64.223 28.85-105.702-90.599-171.363-116.006-57.044-22.071-141.266 28.902-178.723-19.452-38.22-49.339 23.371-119.631 22.638-182.038-.596-50.832-53.183-103.777-26.502-147.048 27.56-44.695 103.014-18.794 146.713-47.907 44.946-29.945 51.703-108.214 104.524-119.475z"
        fontFamily="none"
        fontSize="none"
        fontWeight="none"
      />
    </svg>
  );
}
