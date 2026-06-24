/* eslint-disable react/no-array-index-key */
import { Group } from '@visx/group';
import DataNotAvailable, { DataNotAvailableProps } from '../DataNotAvailable';

/* eslint-disable import/prefer-default-export */
interface GaugeChartNoDataSkeletonProps extends DataNotAvailableProps {
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

function GaugeChartNoDataSkeleton({
  height,
  width,
  margins,
  showXAxisLabel,
  showYAxisLabel,
  ...dataNotAvailableProps
}: Readonly<GaugeChartNoDataSkeletonProps>) {
  const radius = 150;
  const segmentThickness = 40;
  const segmentCount = 20;
  const innerWidth = width - (margins.left + margins.right);
  const innerHeight = height - (margins.top + margins.bottom);
  const centerY = innerHeight / 2;
  const centerX = innerWidth / 2;

  const startAngle = Math.PI * 0.85;
  const endAngle = Math.PI * 2.15 + 0.07;
  const totalAngle = endAngle - startAngle;

  const count = segmentCount;
  const segmentRadius = radius;
  const segThickness = segmentThickness;

  const targetPercentage = 70;
  const filledSegments = Math.round((targetPercentage / 100) * count);

  const padAngle = 0.075;
  const segmentAngle = totalAngle / count - padAngle;

  const segments = Array.from({ length: count }, (_, i) => {
    const segmentStartAngle = startAngle + i * (segmentAngle + padAngle);
    const segmentEndAngle = segmentStartAngle + segmentAngle;
    const isFilled = i < filledSegments;

    return {
      startAngle: segmentStartAngle,
      endAngle: segmentEndAngle,
      isFilled,
    };
  });

  const tickCount = 71;
  const tickHeight = 13;
  const tickSegmentGap = 20;

  const ticks = Array.from({ length: tickCount }, (_, i) => {
    const angle = startAngle + i * (totalAngle / tickCount);

    const isLongTick = i % 7 === 0 || i === 0 || i === tickCount - 1;
    const tickInnerOffset =
      segmentRadius -
      segThickness -
      tickHeight -
      tickSegmentGap -
      (isLongTick ? tickHeight / 2 : 0);

    const innerPoint = {
      x: centerX + tickInnerOffset * Math.cos(angle),
      y: centerY + tickInnerOffset * Math.sin(angle),
    };
    const outerPoint = {
      x: centerX + (segmentRadius - segThickness - 20) * Math.cos(angle),
      y: centerY + (segmentRadius - segThickness - 20) * Math.sin(angle),
    };
    return { innerPoint, outerPoint };
  });

  return (
    <DataNotAvailable width={width} height={height} {...dataNotAvailableProps}>
      <div
        className="relative flex items-center justify-center"
        style={{ width, height }}
      >
        <svg width={width} height={height}>
          <Group top={margins.top} left={margins.left}>
            {ticks.map((tick, i) => (
              <line
                key={`tick-${i}`}
                x1={tick.innerPoint.x}
                y1={tick.innerPoint.y}
                x2={tick.outerPoint.x}
                y2={tick.outerPoint.y}
                stroke="#EFEFF1"
                strokeWidth={1}
              />
            ))}

            {segments.map((segment, i) => {
              const outerRadius = segmentRadius;
              const innerRadius = segmentRadius - segThickness;

              const largeArcFlag = segmentAngle > Math.PI ? 1 : 0;

              const outerStart = {
                x: centerX + outerRadius * Math.cos(segment.startAngle),
                y: centerY + outerRadius * Math.sin(segment.startAngle),
              };
              const outerEnd = {
                x: centerX + outerRadius * Math.cos(segment.endAngle),
                y: centerY + outerRadius * Math.sin(segment.endAngle),
              };
              const innerEnd = {
                x: centerX + innerRadius * Math.cos(segment.endAngle),
                y: centerY + innerRadius * Math.sin(segment.endAngle),
              };
              const innerStart = {
                x: centerX + innerRadius * Math.cos(segment.startAngle),
                y: centerY + innerRadius * Math.sin(segment.startAngle),
              };

              const pathData = `
                M ${outerStart.x},${outerStart.y}
                A ${outerRadius},${outerRadius} 0 ${largeArcFlag} 1 ${outerEnd.x},${outerEnd.y}
                L ${innerEnd.x},${innerEnd.y}
                A ${innerRadius},${innerRadius} 0 ${largeArcFlag} 0 ${innerStart.x},${innerStart.y}
                Z
              `;

              return (
                <path
                  key={i}
                  d={pathData}
                  fill="#F5F5F5"
                  stroke="#F5F5F5"
                  strokeWidth="6"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
              );
            })}
          </Group>
        </svg>

        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%) translateY(-15px)',
            textAlign: 'center',
          }}
        >
          <div className="bg-new-fill-light h-7 w-[100px]" />
        </div>

        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%) translateY(20px)',
            textAlign: 'center',
          }}
        >
          <div className="bg-new-fill-light h-3.5 w-[90px]" />
        </div>

        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%) translate(-70px, 70px)',
            textAlign: 'center',
          }}
        >
          <div className="bg-new-fill-light h-4 w-10" />
        </div>
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%) translate(-70px, 90px)',
            textAlign: 'center',
          }}
        >
          <div className="bg-new-fill-light h-3 w-[50px]" />
        </div>

        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%) translate(0px, 70px)',
            textAlign: 'center',
          }}
        >
          <div className="bg-new-fill-light h-4 w-[50px]" />
        </div>
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%) translate(0px, 90px)',
            textAlign: 'center',
          }}
        >
          <div className="bg-new-fill-light h-3 w-[60px]" />
        </div>

        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%) translate(70px, 70px)',
            textAlign: 'center',
          }}
        >
          <div className="bg-new-fill-light h-4 w-10" />
        </div>
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%) translate(70px, 90px)',
            textAlign: 'center',
          }}
        >
          <div className="bg-new-fill-light h-3 w-[55px]" />
        </div>
      </div>
    </DataNotAvailable>
  );
}

export { GaugeChartNoDataSkeleton };
