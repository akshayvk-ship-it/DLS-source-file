function TooltipDownArrow({
  fillPathStyle,
  ...props
}: React.SVGAttributes<HTMLOrSVGElement> & { fillPathStyle?: string }) {
  return (
    <svg
      width="18"
      height="7"
      viewBox="0 0 18 7"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M4.75736 4.75736L0 0H18L13.2426 4.75736C10.8995 7.1005 7.10051 7.10051 4.75736 4.75736Z"
        fill="#F15701"
        className="fill-fill-action"
        style={{
          fill: fillPathStyle,
        }}
      />
    </svg>
  );
}

export default TooltipDownArrow;
