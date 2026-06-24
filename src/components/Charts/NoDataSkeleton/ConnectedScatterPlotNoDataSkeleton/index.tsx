/* eslint-disable react/no-array-index-key */
/* eslint-disable import/prefer-default-export */
import DataNotAvailable, { DataNotAvailableProps } from '../DataNotAvailable';

interface ConnectedScatterPlotNoDataSkeletonProps
  extends DataNotAvailableProps {
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

const createLinePath = (points: Array<{ x: number; y: number }>) => {
  if (points.length === 0) return '';
  let path = `M ${points[0]?.x.toFixed(2)} ${points[0]?.y.toFixed(2)}`;
  for (let i = 1; i < points.length; i += 1) {
    path += ` L ${points[i]?.x.toFixed(2)} ${points[i]?.y.toFixed(2)}`;
  }
  return path;
};

function ConnectedScatterPlotNoDataSkeleton({
  height,
  width,
  showYAxisLabel,
  margins,
  showXAxisLabel = true,
  ...dataNotAvailableProps
}: Readonly<ConnectedScatterPlotNoDataSkeletonProps>) {
  const chartWidth = width - margins.left - margins.right;
  const chartHeight = height - margins.top - margins.bottom;

  const spaceYAxisLabelAvailable = showYAxisLabel ? 26 : 0;
  const updatedChartWidth = chartWidth - spaceYAxisLabelAvailable - 50;
  const spaceXAxisLabelAvailable = showYAxisLabel ? 34 : 0;
  const updatedChartHeight = chartHeight - spaceXAxisLabelAvailable - 28;

  const customYValues = [22, 54, 23, 76, 56, 48];
  const maxYValue = Math.max(...customYValues);

  const pointCount = customYValues.length;
  const stepX = (updatedChartWidth - 10) / (pointCount - 1);

  const skeletonPoints = customYValues.map((yVal, idx) => ({
    x: idx * stepX,
    y: updatedChartHeight - 10 - (yVal / maxYValue) * (updatedChartHeight - 10),
  }));

  const linePath = createLinePath(skeletonPoints);

  const yTickCount = 7;
  const yLabelHeight = 12;

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
              className="absolute top-1/2"
              style={{
                transform: 'translate(-30px,-50%) rotate(-90deg)',
              }}
            >
              <div className="bg-new-fill-light h-4 w-20" />
            </div>
          )}
          <div
            className="absolute flex flex-col justify-between py-1"
            style={{
              height: updatedChartHeight,
              marginLeft: `${spaceYAxisLabelAvailable}px`,
            }}
            aria-hidden="true"
          >
            {Array.from({ length: yTickCount }).map((_, i) => (
              <div
                key={i}
                className="bg-new-fill-light  w-10"
                style={{
                  height: `${yLabelHeight}px`,
                }}
              />
            ))}
          </div>

          <svg
            width={updatedChartWidth}
            height={updatedChartHeight}
            style={{
              position: 'absolute',
              marginLeft: `${50 + spaceYAxisLabelAvailable}px`,
            }}
          >
            <path d={linePath} fill="none" stroke="#EFEFF1" strokeWidth={3} />

            {skeletonPoints.map((point, i) => (
              <circle key={i} cx={point.x} cy={point.y} r={6} fill="#EFEFF1" />
            ))}
          </svg>

          <div
            className="absolute"
            style={{
              top: updatedChartHeight + 8,
              width: updatedChartWidth,
              marginLeft: `${50 + spaceYAxisLabelAvailable}px`,
            }}
          >
            <div
              className=" bg-new-fill-light h-3"
              style={{ width: `${updatedChartWidth}px` }}
            />
          </div>

          {showXAxisLabel && (
            <div
              className="absolute flex justify-center"
              style={{
                top: updatedChartHeight + 30,
                width: updatedChartWidth,
                marginLeft: `${50 + spaceYAxisLabelAvailable}px`,
              }}
            >
              <div className="bg-new-fill-light h-3 w-20" />
            </div>
          )}
        </div>
      </div>
    </DataNotAvailable>
  );
}

export { ConnectedScatterPlotNoDataSkeleton };
