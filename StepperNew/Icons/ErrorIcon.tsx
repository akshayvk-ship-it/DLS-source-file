function ErrorIcon(props: React.SVGAttributes<HTMLOrSVGElement>) {
  return (
    <svg
      width="4"
      height="14"
      viewBox="0 0 4 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M1.99365 2V7M1.99365 12H2.00615"
        stroke="#EBEDEF"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default ErrorIcon;
