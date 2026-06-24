interface Props {
  size?: number;
  className?: string;
}
export default function SpinLoader({ size = 24, className = '' }: Props) {
  const length = size / 4;
  const thickness = 1.5;
  const lineCount = 8;
  const middleCircleRadius = size / 6;

  return (
    <svg
      height={size}
      width={size}
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      className={`${className}`}
    >
      {Array(lineCount)
        .fill(null)
        .map((_, index) => (
          <rect
            width={length}
            height={thickness}
            key={`loaderLine${index * 1}`}
            y={size / 2 - thickness / 2}
            x={size / 2 + thickness / 2 + middleCircleRadius}
            className="origin-center"
            transform={`rotate(${(360 * index) / lineCount})`}
            rx={1.5}
          >
            <animate
              attributeName="width"
              values={`${length};${length};${length / 2};${length};${length}`}
              begin={`${200 * index}ms`}
              dur={`${200 * lineCount}ms`}
              repeatCount="indefinite"
            />
          </rect>
        ))}
    </svg>
  );
}
