function TickIcon(props: React.SVGAttributes<HTMLOrSVGElement>) {
  return (
    <svg
      width="13"
      height="10"
      viewBox="0 0 13 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M2 5.5L5 8.5L11 2.5"
        stroke="#EBEDEF"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default TickIcon;
