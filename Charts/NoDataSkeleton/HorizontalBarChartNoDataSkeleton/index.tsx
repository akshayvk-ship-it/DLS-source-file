import DataNotAvailable, { DataNotAvailableProps } from '../DataNotAvailable';

/* eslint-disable import/prefer-default-export */
interface HorizontalBarChartNoDataSkeletonProps extends DataNotAvailableProps {
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

function HorizontalBarChartNoDataSkeleton({
  height,
  width,
  showYAxisLabel,
  margins,
  showXAxisLabel = true,
  ...dataNotAvailableProps
}: Readonly<HorizontalBarChartNoDataSkeletonProps>) {
  const chartWidth = width - margins.left - margins.right;
  const chartHeight = height - margins.top - margins.bottom;

  const spaceYAxisLabelAvailable = showYAxisLabel ? 22 : 0;
  const updatedChartWidth = chartWidth - spaceYAxisLabelAvailable - 40;
  const spaceXAxisLabelAvailable = showXAxisLabel ? 34 : 0;
  const updatedChartHeight = chartHeight - spaceXAxisLabelAvailable - 28;

  const barCount = 7;
  const barHeight = Math.floor((updatedChartHeight / barCount) * 0.6);

  const barWidths = [
    Math.floor(updatedChartWidth * 0.85),
    Math.floor(updatedChartWidth * 0.65),
    Math.floor(updatedChartWidth * 0.9),
    Math.floor(updatedChartWidth * 0.45),
    Math.floor(updatedChartWidth * 0.75),
    Math.floor(updatedChartWidth * 0.55),
    Math.floor(updatedChartWidth * 0.5),
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
              marginLeft: `${spaceYAxisLabelAvailable}px`,
            }}
          >
            {Array.from({ length: barCount }, (_, i) => (
              <div key={i} className="flex h-8 items-center justify-end">
                <div className="bg-new-fill-light h-3 w-[30px]" />
              </div>
            ))}
          </div>

          <div
            className="flex flex-col justify-between"
            style={{
              paddingRight: 4,
              height: updatedChartHeight,
              marginLeft: `${40 + spaceYAxisLabelAvailable}px`,
            }}
          >
            {Array.from({ length: barCount }, (_, i) => (
              <div
                key={i}
                className="flex items-center"
                style={{ height: barHeight }}
              >
                <div
                  className="bg-new-fill-light"
                  style={{
                    borderRadius: '0 4px 4px 0',
                    width: `${barWidths[i]}px`,
                    height: `${barHeight + 6}px`,
                  }}
                />
              </div>
            ))}
          </div>

          <div
            className="absolute"
            style={{
              top: updatedChartHeight + 8,
              width: updatedChartWidth,
              marginLeft: `${40 + spaceYAxisLabelAvailable}px`,
            }}
          >
            <div
              className="bg-new-fill-light h-3 "
              style={{ width: `${updatedChartWidth}px` }}
            />
          </div>

          {showXAxisLabel && (
            <div
              className="absolute flex justify-center"
              style={{
                top: updatedChartHeight + 30,
                width: updatedChartWidth,
                marginLeft: `${40 + spaceYAxisLabelAvailable}px`,
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

export { HorizontalBarChartNoDataSkeleton };
