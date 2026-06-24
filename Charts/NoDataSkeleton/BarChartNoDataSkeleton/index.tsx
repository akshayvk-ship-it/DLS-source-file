import DataNotAvailable, { DataNotAvailableProps } from '../DataNotAvailable';

/* eslint-disable import/prefer-default-export */
interface BarChartNoDataSkeletonProps extends DataNotAvailableProps {
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

function BarChartNoDataSkeleton({
  width,
  height,
  showYAxisLabel,
  margins,
  showXAxisLabel = true,
  ...dataNotAvailableProps
}: Readonly<BarChartNoDataSkeletonProps>) {
  const chartWidth = width - margins.left - margins.right;
  const chartHeight = height - margins.top - margins.bottom;

  const spaceYAxisAvailable = showYAxisLabel ? 22 : 0;
  const updatedChartWidth = chartWidth - spaceYAxisAvailable - 40;
  const spaceXAxisLabelAvailable = showXAxisLabel ? 34 : 0;
  const updatedChartHeight = chartHeight - spaceXAxisLabelAvailable - 28;

  const barCount = 7;
  const barWidth = Math.floor((updatedChartWidth / barCount) * 0.6);

  const barHeights = [
    Math.floor(updatedChartHeight * 0.85),
    Math.floor(updatedChartHeight * 0.65),
    Math.floor(updatedChartHeight * 0.9),
    Math.floor(updatedChartHeight * 0.45),
    Math.floor(updatedChartHeight * 0.75),
    Math.floor(updatedChartHeight * 0.25),
    Math.floor(updatedChartHeight * 0.55),
  ];

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
            className="absolute flex flex-col justify-between py-1"
            style={{
              height: `${updatedChartHeight}px`,
              marginLeft: `${spaceYAxisAvailable}px`,
            }}
          >
            {Array.from({ length: 5 }, (_, i) => (
              <div key={i} className="flex items-center justify-end">
                <div className="bg-new-fill-light h-3 w-[30px]" />
              </div>
            ))}
          </div>

          <div
            className="flex items-end justify-between"
            style={{
              paddingBottom: 2,
              height: updatedChartHeight,
              marginLeft: `${40 + spaceXAxisLabelAvailable}px`,
            }}
          >
            {Array.from({ length: barCount }, (_, i) => (
              <div key={i} className="flex flex-col items-center">
                <div
                  style={{
                    width: barWidth,
                    height: barHeights[i],
                  }}
                  className="bg-new-fill-light"
                />
              </div>
            ))}
          </div>
          <div
            className="absolute"
            style={{
              top: updatedChartHeight + 8,
              width: updatedChartWidth,
              marginLeft: `${40 + spaceXAxisLabelAvailable}px`,
            }}
          >
            <div
              style={{ width: updatedChartWidth }}
              className="bg-new-fill-light h-3"
            />
          </div>

          {showXAxisLabel && (
            <div
              className="absolute flex justify-center"
              style={{
                top: updatedChartHeight + 30,
                width: updatedChartWidth,
                marginLeft: `${40 + spaceXAxisLabelAvailable}px`,
              }}
            >
              <div className="bg-new-fill-light h-3 w-[100px]" />
            </div>
          )}
        </div>
      </div>
    </DataNotAvailable>
  );
}

export { BarChartNoDataSkeleton };
