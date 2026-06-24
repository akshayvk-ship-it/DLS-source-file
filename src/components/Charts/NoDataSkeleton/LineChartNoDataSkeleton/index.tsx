import DataNotAvailable, { DataNotAvailableProps } from '../DataNotAvailable';

/* eslint-disable import/prefer-default-export */
interface LineChartNoDataSkeletonProps extends DataNotAvailableProps {
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

function LineChartNoDataSkeleton({
  height,
  width,
  showYAxisLabel,
  margins,
  showXAxisLabel = true,
  ...dataNotAvailableProps
}: Readonly<LineChartNoDataSkeletonProps>) {
  const chartWidth = width - margins.left - margins.right;
  const chartHeight = height - margins.top - margins.bottom;

  const yTickCount = 7;
  const xTickCount = 8;

  const generateSkeletonPoints = () => {
    const points = [];
    const stepX = chartWidth / (xTickCount - 1);

    for (let i = 0; i < xTickCount; i += 1) {
      const x = i * stepX;
      const randomHeight = 0.3 + Math.random() * 0.4;
      const y = chartHeight * (1 - randomHeight);
      points.push({ x, y });
    }
    return points;
  };

  const skeletonPoints = generateSkeletonPoints();

  const createLinePath = (points: Array<{ x: number; y: number }>) => {
    if (points.length === 0) return '';

    let path = `M ${points[0]?.x} ${points[0]?.y}`;
    for (let i = 1; i < points.length; i += 1) {
      path += ` L ${points[i]?.x} ${points[i]?.y}`;
    }
    return path;
  };

  const createAreaPath = (points: Array<{ x: number; y: number }>) => {
    if (points.length === 0) return '';

    let path = `M ${points[0]?.x} ${chartHeight}`;
    path += ` L ${points[0]?.x} ${points[0]?.y}`;

    for (let i = 1; i < points.length; i += 1) {
      path += ` L ${points[i]?.x} ${points[i]?.y}`;
    }

    path += ` L ${points[points.length - 1]?.x} ${chartHeight}`;
    path += ' Z';
    return path;
  };

  const linePath = createLinePath(skeletonPoints);
  const areaPath = createAreaPath(skeletonPoints);

  const spaceYAxisAvailable = showYAxisLabel ? 22 : 0;
  const updatedChartWidth = chartWidth - spaceYAxisAvailable - 40;
  const spaceXAxisLabelAvailable = showXAxisLabel ? 34 : 0;
  const updatedChartHeight = chartHeight - spaceXAxisLabelAvailable - 28;

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
          {showYAxisLabel && (
            <div
              className="absolute top-1/2 -translate-y-1/2"
              style={{
                transform: 'translate(-23px,-50%) rotate(-90deg)',
              }}
            >
              <div className="bg-new-fill-light h-3 w-[60px]" />
            </div>
          )}

          <div
            className={`absolute ${showYAxisLabel ? 'ml-[22px]' : ''}  flex flex-col justify-between py-1`}
            style={{ height: `${updatedChartHeight}px` }}
          >
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
            style={{
              marginLeft: `${40 + spaceYAxisAvailable}px`,
            }}
          >
            <defs>
              <pattern
                id="grid"
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
            </defs>

            <rect
              width={updatedChartWidth}
              height={updatedChartHeight}
              fill="url(#grid)"
              opacity="0.3"
            />

            <foreignObject
              x="0"
              y="0"
              width={updatedChartWidth}
              height={updatedChartHeight}
            >
              <div
                style={{ width: '100%', height: '100%', position: 'relative' }}
              >
                <svg
                  width={updatedChartWidth}
                  height={updatedChartHeight}
                  style={{ position: 'absolute', top: 0, left: 0 }}
                >
                  <path d={areaPath} fill="#F7F7F8" opacity="0.3" />
                </svg>
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    clipPath: `path('${areaPath}')`,
                  }}
                >
                  <div className="bg-new-fill-light h-full w-full" />
                </div>
              </div>
            </foreignObject>

            <path d={linePath} fill="none" stroke="#d1d5db" strokeWidth="2" />

            {skeletonPoints.map((point, i) => (
              <foreignObject
                // eslint-disable-next-line react/no-array-index-key
                key={i}
                x={point.x - 4}
                y={point.y - 4}
                width="8"
                height="8"
              >
                {/* <Skeleton circle width={8} height={8} /> */}
                <div className="bg-new-fill-light rounded-99 h-2 w-2" />
              </foreignObject>
            ))}
          </svg>
          <div
            className="absolute"
            style={{
              top: updatedChartHeight + 8,
              width: updatedChartWidth,
              marginLeft: `${40 + spaceYAxisAvailable}px`,
            }}
          >
            {/* <Skeleton width={updatedChartWidth} height={12} /> */}
            <div
              className="bg-new-fill-light h-3"
              style={{
                width: `${updatedChartWidth}px`,
              }}
            />
          </div>

          {showXAxisLabel && (
            <div
              className="absolute flex justify-center"
              style={{
                top: updatedChartHeight + 30,
                width: updatedChartWidth,
                marginLeft: `${40 + spaceYAxisAvailable}px`,
              }}
            >
              {/* <Skeleton width={80} height={12} /> */}
              <div className="bg-new-fill-light h-3 w-20" />
            </div>
          )}
        </div>
      </div>
    </DataNotAvailable>
  );
}

export { LineChartNoDataSkeleton };
