interface Props {
  size?: number;
  className?: string;
}

export default function BeatLoader({ size = 8, className = '' }: Props) {
  const radius = size / 2;
  return (
    <div className={`${className} flex space-x-2 px-4 py-2`}>
      {Array(3)
        .fill(null)
        .map((_, index) => (
          <svg
            height={size}
            width={size}
            xmlns="http://www.w3.org/2000/svg"
            key={`loaderCircle${index * 1}`}
            fill="currentColor"
          >
            <circle r={radius} cx={radius} cy={radius}>
              <animate
                attributeName="r"
                values={`${radius};${radius / 2};${radius}`}
                begin={`${index * 150}ms`}
                dur="900ms"
                repeatCount="indefinite"
              />
            </circle>
          </svg>
        ))}
    </div>
  );
}
