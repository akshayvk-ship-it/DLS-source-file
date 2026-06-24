/* eslint-disable react/no-array-index-key */
import DataNotAvailable, { DataNotAvailableProps } from '../DataNotAvailable';

/* eslint-disable import/prefer-default-export */
interface DoughnutChartNoDataSkeletonProps extends DataNotAvailableProps {
  width: number;
  height: number;
  margins: ChartMargins;
  showText?: boolean;
  showSubText?: boolean;
  showLegend?: boolean;
}

interface ChartMargins {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

function polarToCartesian(
  centerX: number,
  centerY: number,
  radius: number,
  angleInDegrees: number,
) {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
}

function describeArc(
  x: number,
  y: number,
  radiusOuter: number,
  radiusInner: number,
  startAngle: number,
  endAngle: number,
) {
  const startOuter = polarToCartesian(x, y, radiusOuter, startAngle);
  const endOuter = polarToCartesian(x, y, radiusOuter, endAngle);
  const startInner = polarToCartesian(x, y, radiusInner, endAngle);
  const endInner = polarToCartesian(x, y, radiusInner, startAngle);

  const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;

  return [
    'M',
    startOuter.x,
    startOuter.y,
    'A',
    radiusOuter,
    radiusOuter,
    0,
    largeArcFlag,
    1,
    endOuter.x,
    endOuter.y,
    'L',
    startInner.x,
    startInner.y,
    'A',
    radiusInner,
    radiusInner,
    0,
    largeArcFlag,
    0,
    endInner.x,
    endInner.y,
    'Z',
  ].join(' ');
}

function DoughnutChartNoDataSkeleton({
  height,
  width,
  margins,
  showText = true,
  showSubText = true,
  showLegend = true,
  ...dataNotAvailableProps
}: Readonly<DoughnutChartNoDataSkeletonProps>) {
  const innerWidth = width - margins.left - margins.right;
  const innerHeight = height - margins.top - margins.bottom;
  const radius = Math.min(innerWidth, innerHeight) / 2;
  const centerX = innerWidth / 2;
  const centerY = innerHeight / 2;
  const innerRadius = radius * 0.6;

  const sliceValues = [30, 10, 15, 20, 7, 8, 10];
  const sliceCount = sliceValues.length;
  const padAngleDeg = 5;
  const totalValue = sliceValues.reduce((sum, v) => sum + v, 0);

  let startAngle = 0;
  const slicePaths = sliceValues.map((value) => {
    const arcAngle = (value / totalValue) * (360 - sliceCount * padAngleDeg);
    const endAngle = startAngle + arcAngle;
    const d = describeArc(
      centerX,
      centerY,
      radius,
      innerRadius,
      startAngle,
      endAngle,
    );
    startAngle = endAngle + padAngleDeg;
    return d;
  });

  const legendRows = 3;
  const itemsPerRow = 2;
  const legendItemWidth = 64;
  const legendItemHeight = 17;
  const legendIconSize = 17;
  const legendRowGap = 22;
  const legendItemGap = 36;
  const legendBlockHeight =
    legendRows * (legendItemHeight * 2 + 8) + (legendRows - 1) * legendRowGap;
  const legendBlockTop = margins.top + (innerHeight - legendBlockHeight) / 2;

  return (
    <DataNotAvailable width={width} height={height} {...dataNotAvailableProps}>
      <div style={{ width, height, position: 'relative', background: '#fff' }}>
        <svg
          width={innerWidth}
          height={innerHeight}
          style={{
            position: 'absolute',
            top: margins.top,
            left: margins.left,
            pointerEvents: 'none',
          }}
        >
          {slicePaths.map((d, i) => (
            <path key={i} d={d} fill="#f3f4f6" />
          ))}
          <circle cx={centerX} cy={centerY} r={innerRadius} fill="#fff" />
        </svg>

        {showText && (
          <div
            style={{
              position: 'absolute',
              top: margins.top + innerHeight / 2 - 24,
              left: margins.left + innerWidth / 2 - 46,
              width: 92,
              height: 48,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 2,
            }}
          >
            <div
              className="bg-new-fill-light w-18 h-[18px]"
              style={{ marginBottom: 6 }}
            />
            {showSubText && <div className="bg-new-fill-light w-18 h-[18px]" />}
          </div>
        )}

        {showLegend && (
          <div
            style={{
              position: 'absolute',
              top: legendBlockTop,
              left: margins.left + innerWidth + 48,
              display: 'flex',
              flexDirection: 'column',
              gap: legendRowGap,
            }}
          >
            {Array.from({ length: legendRows }).map((_, rowIdx) => (
              <div
                key={rowIdx}
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  gap: legendItemGap,
                }}
              >
                {Array.from({ length: itemsPerRow }).map((__, colIdx) => (
                  <div
                    key={colIdx}
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'flex-start',
                      minWidth: 100,
                    }}
                  >
                    <div
                      style={{
                        width: `${legendIconSize}px`,
                        height: `${legendIconSize}px`,
                      }}
                      className="bg-new-fill-light rounded-full"
                    />
                    <div style={{ marginLeft: 12 }}>
                      <div
                        className="bg-new-fill-light"
                        style={{
                          marginBottom: 8,
                          width: `${legendItemWidth}px `,
                          height: `${legendItemHeight}px`,
                        }}
                      />
                      <div
                        style={{
                          width: `${legendItemWidth}px`,
                          height: `${legendItemHeight}px`,
                        }}
                        className="bg-new-fill-light"
                      />
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </DataNotAvailable>
  );
}

export { DoughnutChartNoDataSkeleton };
