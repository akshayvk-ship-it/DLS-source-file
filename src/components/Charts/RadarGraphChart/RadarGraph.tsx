import { Group } from '@visx/group';
import { scaleLinear } from '@visx/scale';
import { Line, Polygon } from '@visx/shape';
import { forwardRef } from 'react';

export type RadarGraphSetupData = {
  color: string;
  data: RadarGraphData[];
};

export type RadarGraphData = {
  label: string;
  value: number;
};

export interface RadarGraphProps {
  width: number;
  height: number;
  setupData: RadarGraphSetupData[];
  chartData?: RadarGraphSetupData[];
  shadowColor?: string;
  margin?: number;
  wrapperClassName?: string;
  dataTestId?: string;
}

export const RadarGraph = forwardRef<HTMLDivElement, RadarGraphProps>(
  (
    {
      setupData,
      width,
      height,
      wrapperClassName,
      margin = 60,
      shadowColor = '#F15701',
      dataTestId = 'radar-graph-testId',
      chartData,
    },
    ref,
  ) => {
    const dataForChart = chartData || setupData;
    const data = dataForChart[0]?.data ?? []; // base axis labels from first dataset
    const maxDataValue = Math.max(
      ...dataForChart.map((d) => Math.max(...d.data.map((item) => item.value))),
    );
    const numRings = data.length;

    const radius = Math.min(width, height) / 2 - margin;
    const centerX = width / 2;
    const centerY = height / 2;
    const angleStep = (2 * Math.PI) / data.length;

    const ringValues = Array.from({ length: numRings ?? 0 }, (_, i) =>
      Math.floor(
        (((Math.round(maxDataValue / 10) + 1) * 10) / (numRings ?? 1)) *
          (i + 1),
      ),
    );

    const valueScale = scaleLinear({
      domain: [0, ringValues[ringValues.length - 1] || 100],
      range: [0, radius],
    });

    function polarToCartesian(angle: number, r: number) {
      return {
        x: Math.cos(angle) * r,
        y: Math.sin(angle) * r,
      };
    }

    return (
      <div className={`${wrapperClassName}`} ref={ref} data-testid={dataTestId}>
        <svg width={width} height={height}>
          <defs>
            {dataForChart.map((dataset, i) => (
              <radialGradient
                key={dataset.color}
                id={`radarGradient-${i}`}
                cx="50%"
                cy="50%"
                r="100%"
              >
                <stop offset="30%" stopColor="white" stopOpacity={0.1} />
                <stop offset="100%" stopColor={dataset.color} stopOpacity={1} />
              </radialGradient>
            ))}
            <filter
              id="radar-outer-shadow"
              x="-50%"
              y="-50%"
              width="200%"
              height="200%"
            >
              <feDropShadow
                dx="0"
                dy="0"
                stdDeviation="10"
                floodColor={shadowColor}
                floodOpacity="15"
              />
            </filter>
          </defs>

          <Group top={centerY} left={centerX}>
            {/* Outer ring with shadow */}
            {(() => {
              const outerVal = ringValues[ringValues.length - 1];
              const r = valueScale(outerVal ?? 0);
              const ringPoints = data.map((_, i) => {
                const angle = i * angleStep - Math.PI / 2;
                return polarToCartesian(angle, r);
              });

              return (
                <Polygon
                  points={ringPoints.map(({ x, y }) => [x, y])}
                  className="stroke-border-border fill-none"
                  strokeWidth={1}
                  filter="url(#radar-outer-shadow)"
                />
              );
            })()}

            {(() => {
              const outerRadius = valueScale(
                ringValues[ringValues.length - 1] ?? 0,
              );
              const outerRingPoints = data.map((_, i) => {
                const angle = i * angleStep - Math.PI / 2;
                return polarToCartesian(angle, outerRadius);
              });

              return (
                <Polygon
                  points={outerRingPoints.map(({ x, y }) => [x, y])}
                  className="fill-fill-fill"
                />
              );
            })()}

            {/* Axes and labels */}
            {data.map((d, i) => {
              const angle = i * angleStep - Math.PI / 2;
              const lineEnd = polarToCartesian(angle, radius);
              const isVertical = Math.abs(Math.cos(angle)) < 0.5;
              const labelOffset = isVertical ? 25 : 40;
              const labelPos = polarToCartesian(angle, radius + labelOffset);

              return (
                <g key={d.label}>
                  <Line
                    from={{ x: 0, y: 0 }}
                    to={lineEnd}
                    className="stroke-border-border"
                  />
                  <text
                    x={labelPos.x}
                    y={labelPos.y}
                    className="paragraph-small fill-text-text font-medium"
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill="#3B475B"
                  >
                    {d.label.split(' ').map((word, lineIdx) => (
                      <tspan
                        // eslint-disable-next-line react/no-array-index-key
                        key={`${d.label}-${lineIdx}`}
                        x={labelPos.x}
                        dy={lineIdx === 0 ? '0' : '1.2em'}
                      >
                        {word}
                      </tspan>
                    ))}
                  </text>
                </g>
              );
            })}

            {/* Scale rings */}
            {ringValues.map((val, index) => {
              const r = valueScale(val);
              const ringPoints = data.map((_, i) => {
                const angle = i * angleStep - Math.PI / 2;
                return polarToCartesian(angle, r);
              });

              return (
                <g key={val}>
                  {index !== ringValues.length - 1 && (
                    <Polygon
                      points={ringPoints.map(({ x, y }) => [x, y])}
                      className="stroke-border-border fill-none"
                      strokeWidth={1}
                    />
                  )}
                  <text
                    x={14}
                    y={-r}
                    className="paragraph-extra-small fill-text-light z-50 font-medium"
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    {val}
                  </text>
                </g>
              );
            })}

            {/* Radar polygons */}
            {dataForChart.map((dataset, i) => {
              const radarPoints = dataset.data.map((d, idx) => {
                const angle = idx * angleStep - Math.PI / 2;
                const r = valueScale(d.value);
                return polarToCartesian(angle, r);
              });

              return (
                <Polygon
                  key={dataset.color}
                  points={radarPoints.map(({ x, y }) => [x, y])}
                  fill={`url(#radarGradient-${i})`}
                  stroke={dataset.color}
                  strokeWidth={2}
                />
              );
            })}
          </Group>
        </svg>
      </div>
    );
  },
);
