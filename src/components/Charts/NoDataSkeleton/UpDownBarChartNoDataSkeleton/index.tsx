/* eslint-disable react/no-array-index-key */
import DataNotAvailable, { DataNotAvailableProps } from '../DataNotAvailable';

/* eslint-disable import/prefer-default-export */
interface UpDownBarChartNoDataSkeletonProps extends DataNotAvailableProps {
  width: number;
  height: number;
  margins: ChartMargins;
}

interface ChartMargins {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

function UpDownBarChartNoDataSkeleton({
  height,
  width,
  margins,
  ...dataNotAvailableProps
}: Readonly<UpDownBarChartNoDataSkeletonProps>) {
  const barCount = 35;
  const chartWidth = width - margins.left - margins.right;
  const chartHeight = height - margins.top - margins.bottom;

  const baselineY = chartHeight / 2;
  const barSpacing = 12;
  const barWidth = chartWidth / barCount - barSpacing;

  const successHeights = Array(barCount)
    .fill(0)
    .map(() => Math.random() * (chartHeight / 3) + chartHeight / 8);
  const failureHeights = Array(barCount)
    .fill(0)
    .map(() => Math.random() * (chartHeight / 4) + chartHeight / 10);

  return (
    <DataNotAvailable width={width} height={height} {...dataNotAvailableProps}>
      <div style={{ width, height, position: 'relative' }}>
        <div
          style={{
            position: 'absolute',
            left: margins.left,
            top: margins.top - 24,
          }}
        >
          <div className="bg-new-fill-light h-4 w-10 " />
        </div>

        <div
          style={{
            position: 'absolute',
            left: margins.left,
            top: margins.top + chartHeight + 8,
          }}
        >
          <div className="bg-new-fill-light h-4 w-10 " />
        </div>

        <div
          style={{
            position: 'absolute',
            left: margins.left + chartWidth - 160,
            top: margins.top - 24,
          }}
        >
          <div className="bg-new-fill-light h-5 w-[130px] " />
        </div>

        <div
          style={{
            position: 'absolute',
            left: margins.left + chartWidth - 160,
            top: margins.top + chartHeight + 8,
          }}
        >
          <div className="bg-new-fill-light h-5 w-[130px] " />
        </div>

        <svg width={width} height={height}>
          <g transform={`translate(${margins.left}, ${margins.top})`}>
            {Array(barCount)
              .fill(0)
              .map((_, index) => {
                const successHeight = successHeights[index] || 0;
                const failureHeight = failureHeights[index] || 0;
                const x = index * (chartWidth / barCount) + barSpacing / 2;
                const ySuccess = baselineY - successHeight;
                const yFailure = baselineY;
                const borderRadius = barWidth / 2;

                return (
                  <g key={`skeleton-bar-${index}`}>
                    {successHeight > 0 && (
                      <path
                        d={`
                              M ${x} ${ySuccess + borderRadius}
                              A ${borderRadius} ${borderRadius} 0 0 1 ${x + borderRadius} ${ySuccess}
                              L ${x + barWidth - borderRadius} ${ySuccess}
                              A ${borderRadius} ${borderRadius} 0 0 1 ${x + barWidth} ${ySuccess + borderRadius}
                              L ${x + barWidth} ${ySuccess + successHeight}
                              L ${x} ${ySuccess + successHeight}
                              Z
                            `}
                        fill="#e5e7eb"
                      />
                    )}
                    {failureHeight > 0 && (
                      <path
                        d={`
                              M ${x} ${yFailure}
                              L ${x} ${yFailure + failureHeight - borderRadius}
                              A ${borderRadius} ${borderRadius} 0 0 0 ${x + borderRadius} ${yFailure + failureHeight}
                              L ${x + barWidth - borderRadius} ${yFailure + failureHeight}
                              A ${borderRadius} ${borderRadius} 0 0 0 ${x + barWidth} ${yFailure + failureHeight - borderRadius}
                              L ${x + barWidth} ${yFailure}
                              Z
                            `}
                        fill="#F7F7F8"
                      />
                    )}
                  </g>
                );
              })}
          </g>
        </svg>

        <div
          style={{ position: 'absolute', top: margins.top, left: margins.left }}
        >
          {Array(barCount)
            .fill(0)
            .map((_, index) => {
              const successHeight = successHeights[index] || 0;
              const failureHeight = failureHeights[index] || 0;
              const x = index * (chartWidth / barCount) + barSpacing / 2;
              const ySuccess = baselineY - successHeight;
              const yFailure = baselineY;

              return (
                <div key={`skeleton-overlay-${index}`}>
                  {successHeight > 0 && (
                    <div
                      style={{
                        position: 'absolute',
                        left: x,
                        top: ySuccess,
                        width: barWidth,
                        height: successHeight,
                        clipPath: `polygon(
                              ${(barWidth / 2 / barWidth) * 100}% 0%, 
                              ${100 - (barWidth / 2 / barWidth) * 100}% 0%, 
                              100% ${(barWidth / 2 / successHeight) * 100}%, 
                              100% 100%, 
                              0% 100%, 
                              0% ${(barWidth / 2 / successHeight) * 100}%
                            )`,
                      }}
                    >
                      <div className="h-full w-full bg-[#e5e7eb] " />
                    </div>
                  )}

                  {failureHeight > 0 && (
                    <div
                      style={{
                        position: 'absolute',
                        left: x,
                        top: yFailure,
                        width: barWidth,
                        height: failureHeight,
                        clipPath: `polygon(
                              0% 0%, 
                              100% 0%, 
                              100% ${100 - (barWidth / 2 / failureHeight) * 100}%, 
                              ${100 - (barWidth / 2 / barWidth) * 100}% 100%, 
                              ${(barWidth / 2 / barWidth) * 100}% 100%, 
                              0% ${100 - (barWidth / 2 / failureHeight) * 100}%
                            )`,
                      }}
                    >
                      <div className="h-full w-full bg-[#F1F1F2] " />
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      </div>
    </DataNotAvailable>
  );
}

export { UpDownBarChartNoDataSkeleton };
