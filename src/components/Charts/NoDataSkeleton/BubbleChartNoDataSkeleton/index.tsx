/* eslint-disable react/no-array-index-key */
import DataNotAvailable, { DataNotAvailableProps } from '../DataNotAvailable';

/* eslint-disable import/prefer-default-export */
interface BubbleChartNoDataSkeletonProps extends DataNotAvailableProps {
  width: number;
  height: number;
  showYAxisLabel?: boolean;
  margins: ChartMargins;
  showXAxisLabel?: boolean;
}

interface ChartMargins {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

function BubbleChartNoDataSkeleton({
  height,
  width,
  margins,
  showXAxisLabel,
  showYAxisLabel,
  ...dataNotAvailableProps
}: Readonly<BubbleChartNoDataSkeletonProps>) {
  const chartWidth = width - margins.left - margins.right;
  const chartHeight = height - margins.top - margins.bottom;

  const yTickCount = 7;
  const bubbleCount = 8;
  const bubblesPerColumn = [2, 3, 1, 4, 2, 3, 1, 2];

  const updatedChartWidth = chartWidth - 24;
  const updatedChartHeight = chartHeight - 28;

  const generateBubbleData = () => {
    const bubbles: { x: number; y: number; size: number | undefined }[] = [];
    const columnWidth = updatedChartWidth / bubbleCount;

    bubblesPerColumn.forEach((count, columnIndex) => {
      const columnX = columnIndex * columnWidth + columnWidth / 2;

      for (let i = 0; i < count; i += 1) {
        const yPosition = (updatedChartHeight / (count + 1)) * (i + 1);

        const sizes = [6, 12, 18, 24, 30];
        const randomSize = sizes[Math.floor(Math.random() * sizes.length)];

        bubbles.push({
          x: columnX,
          y: yPosition,
          size: randomSize,
        });
      }
    });

    return bubbles;
  };

  const bubbleData = generateBubbleData();

  return (
    <DataNotAvailable width={width} height={height} {...dataNotAvailableProps}>
      <div className="relative bg-white" style={{ width, height }}>
        <div
          className="absolute"
          style={{
            left: margins.left,
            top: margins.top,
            width: chartWidth,
            height: chartHeight,
          }}
        >
          <div className="absolute flex h-full flex-col justify-between py-1">
            {Array.from({ length: yTickCount }, (_, i) => (
              <div key={i} className="flex h-8 items-center justify-end">
                <div className="bg-new-fill-light h-3 w-[30px]" />
              </div>
            ))}
          </div>

          <svg
            width={updatedChartWidth}
            height={updatedChartHeight}
            className="ml-[40px]"
          >
            <defs>
              <pattern
                id="bubbleGrid"
                width="50"
                height={updatedChartHeight / 6}
                patternUnits="userSpaceOnUse"
              >
                <path
                  d={`M 50 0 L 0 0 0 ${updatedChartHeight / 6}`}
                  fill="none"
                  stroke="#f3f4f6"
                  strokeWidth="0.5"
                  strokeDasharray="4,4"
                />
              </pattern>

              <linearGradient
                id="shimmerGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor="#e5e7eb" />

                <stop offset="50%" stopColor="#f3f4f6" />

                <stop offset="100%" stopColor="#e5e7eb" />
              </linearGradient>
            </defs>

            <rect
              width={updatedChartWidth}
              height={updatedChartHeight}
              fill="url(#bubbleGrid)"
              opacity="0.3"
            />

            {bubbleData.map((bubble, index) => (
              <circle
                key={index}
                cx={bubble.x}
                cy={bubble.y}
                r={bubble.size}
                fill="url(#shimmerGradient)"
                opacity="0.8"
              />
            ))}
          </svg>
          <div
            className="absolute ml-10"
            style={{
              top: updatedChartHeight + 8,
              width: updatedChartWidth,
            }}
          >
            <div
              className="bg-new-fill-light h-3"
              style={{ width: `${updatedChartWidth - 15}px` }}
            />
          </div>
        </div>
      </div>
    </DataNotAvailable>
  );
}

export { BubbleChartNoDataSkeleton };
