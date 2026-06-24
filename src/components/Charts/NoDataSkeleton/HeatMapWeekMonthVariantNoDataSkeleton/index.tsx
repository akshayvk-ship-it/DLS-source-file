import { useMemo } from 'react';
import { useScrollbarWidth } from '../../../hooks/useScrollbarWidth';
import { ChartMargins } from '../../ChartsSkeletonLoader/types';
import DataNotAvailable, { DataNotAvailableProps } from '../DataNotAvailable';

interface HeatMapWeekMonthSkeletonProps extends DataNotAvailableProps {
  width: number;
  height: number;
  margins: ChartMargins;
}

function HeatMapWeekMonthVariantNoDataSkeleton({
  width = 1313,
  height = 316,
  margins,
  ...dataNotAvailableProps
}: Readonly<HeatMapWeekMonthSkeletonProps>): React.ReactElement {
  const scrollbarWidth = useScrollbarWidth();

  const availableWidth = width - margins.left - margins.right;
  const availableHeight = height - margins.top - margins.bottom;

  const totalColumns = 24;
  const weekLabelWidth = 101;
  const minBinWidth = 22;
  const contentHeight = 340;
  const weekLabelHeight = 68;
  const binHeight = 8;

  const heatmapDimensions = useMemo(() => {
    const hasVerticalOverflow = contentHeight > availableHeight;

    const effectiveWidth =
      hasVerticalOverflow && scrollbarWidth > 0
        ? availableWidth - scrollbarWidth
        : availableWidth;

    const heatmapAreaWidth = effectiveWidth - weekLabelWidth;
    const calculatedBinWidth = Math.floor(heatmapAreaWidth / totalColumns);
    const binWidth = Math.max(calculatedBinWidth, minBinWidth);
    const heatmapWidth = binWidth * totalColumns;

    return {
      binWidth,
      heatmapWidth,
    };
  }, [availableWidth, availableHeight, scrollbarWidth, contentHeight]);

  const { heatmapWidth, binWidth } = heatmapDimensions;

  return (
    <DataNotAvailable width={width} height={height} {...dataNotAvailableProps}>
      <div
        className="overflow-auto  bg-white"
        style={{
          width: availableWidth,
          height: availableHeight,
        }}
      >
        <div className="flex flex-col gap-4">
          <div className="flex gap-4">
            <div
              className="flex w-full flex-col gap-1 pt-8"
              style={{ width: `${weekLabelWidth}px` }}
            >
              {Array.from({ length: 4 }, (_, i) => (
                <div
                  className="relative flex w-full overflow-hidden"
                  style={{
                    height: `${weekLabelHeight}px`,
                  }}
                  key={`skeleton-${i}`}
                >
                  <div className="flex w-full flex-col items-end justify-center gap-[2px] pr-2">
                    <div
                      className="bg-new-fill-light relative block h-5 overflow-hidden rounded leading-none"
                      style={{
                        width: '60%',
                      }}
                    />

                    <div
                      className="bg-new-fill-light relative block h-[18px] overflow-hidden rounded leading-none"
                      style={{ width: '100%' }}
                    />
                  </div>
                  <div
                    className="bg-new-fill-light w-[1px]"
                    style={{ height: `${weekLabelHeight}px` }}
                  />
                </div>
              ))}
            </div>
            <div
              className="flex flex-col gap-2"
              style={{
                width: `${heatmapWidth}px`,
              }}
            >
              <div
                className="relative flex gap-1 overflow-hidden"
                style={{ height: '24px' }}
              >
                {Array.from({ length: 24 }, (_, i) => (
                  <div
                    key={`skeleton-${i}`}
                    style={{
                      width: `${binWidth}px`,
                    }}
                    className="bg-new-fill-light relative h-[24px] overflow-hidden rounded"
                  />
                ))}
              </div>
              <div
                className="relative overflow-hidden"
                style={{
                  width: `${heatmapWidth}px`,
                  height: `${4 * weekLabelHeight + 12}px`,
                }}
              >
                <div className="absolute left-0 top-0 flex h-full w-full flex-col gap-1">
                  {Array.from({ length: 4 }, (__, i) => (
                    <div
                      className="flex flex-col gap-[2px]"
                      style={{ height: `${weekLabelHeight}px` }}
                      key={`week-${i}`}
                    >
                      {Array.from({ length: 7 }, (___, k) => (
                        <div
                          key={`skeleton-row-${k}`}
                          className="flex gap-1"
                          style={{ height: `${binHeight}px` }}
                        >
                          {Array.from({ length: 24 }, (____, j) => (
                            <div
                              key={`skeleton-bin-${j}`}
                              className="bg-new-fill-light block rounded-none leading-none"
                              style={{
                                height: `${binHeight}px`,
                                width: `${binWidth}px`,
                              }}
                            />
                          ))}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DataNotAvailable>
  );
}

export default HeatMapWeekMonthVariantNoDataSkeleton;
