import DataNotAvailable, { DataNotAvailableProps } from '../DataNotAvailable';

/* eslint-disable import/prefer-default-export */
interface HeatMapChartNoDataSkeletonProps extends DataNotAvailableProps {
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

function HeatMapChartNoDataSkeleton({
  height,
  width,
  margins,
  showXAxisLabel,
  showYAxisLabel,
  ...dataNotAvailableProps
}: Readonly<HeatMapChartNoDataSkeletonProps>) {
  const rowCount = 7;
  const colCount = 12;
  const heatMapGap = 4;
  const heatMapBinRadius = 6;
  const yLabelWidth = 80;
  const xMax = width - margins.left - margins.right - yLabelWidth;
  const yMax = height - margins.top - margins.bottom;

  const binWidth = xMax / colCount;
  const binHeight = yMax / rowCount;

  return (
    <DataNotAvailable width={width} height={height} {...dataNotAvailableProps}>
      <div
        style={{
          width,
          height,
          position: 'relative',
          background: '#fff',
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: margins.left,
            top: margins.top,
            width: yLabelWidth,
            height: yMax,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            paddingTop: binHeight / 2,
            paddingBottom: binHeight / 2,
          }}
        >
          {Array.from({ length: rowCount }, (_, i) => (
            <div key={`y-label-${i}`} className="h-3 w-[70px] bg-[#e5e7eb]" />
          ))}
        </div>

        <div
          style={{
            position: 'absolute',
            left: margins.left + yLabelWidth,
            top: margins.top - 20,
            width: xMax,
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <div className="bg-new-fill-light h-3" style={{ width: xMax }} />
        </div>

        <svg width={width} height={height}>
          <g
            transform={`translate(${margins.left + yLabelWidth}, ${margins.top})`}
          >
            {Array.from({ length: rowCount }, (_, row) =>
              // eslint-disable-next-line @typescript-eslint/no-shadow
              Array.from({ length: colCount }, (_, col) => {
                const x = col * binWidth + heatMapGap / 2;
                const y = row * binHeight + heatMapGap / 2;
                const rectWidth = binWidth - heatMapGap;
                const rectHeight = binHeight - heatMapGap;

                return (
                  <rect
                    key={`heatmap-cell-${row}-${col}`}
                    x={x}
                    y={y}
                    width={rectWidth}
                    height={rectHeight}
                    rx={heatMapBinRadius}
                    ry={heatMapBinRadius}
                    fill="#e5e7eb"
                  />
                );
              }),
            )}
          </g>
        </svg>
      </div>
    </DataNotAvailable>
  );
}

export { HeatMapChartNoDataSkeleton };
