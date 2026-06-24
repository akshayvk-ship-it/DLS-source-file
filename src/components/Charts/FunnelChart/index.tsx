import { forwardRef } from 'react';
import { scaleLinear } from '@visx/scale';
import { Area, Line } from '@visx/shape';
import { curveLinear, curveMonotoneY } from '@visx/curve';
import { LinearGradient } from '@visx/gradient';
import { Text } from '@visx/text';
import { FunnelChartProps, FunnelChartData } from './types';
import { ChartSkeleton } from '../ChartsSkeletonLoader';
import { useAllZeroEffect } from '../NoDataSkeleton/hook/useAllZeroEffect';
import { FunnelChartNoDataSkeleton } from '../NoDataSkeleton/FunnelChartNoDataSkeleton';
import { useDevicePixelRatio } from '../../hooks/useDevicePixelRatio';

const x = (d: FunnelChartData) => d.index;
const y = (d: FunnelChartData) => d.value;

// eslint-disable-next-line import/prefer-default-export
export const FunnelChart = forwardRef<HTMLDivElement, FunnelChartProps>(
  (
    {
      width,
      height,
      chartData,
      margins,
      colorPalette,
      hasLayers,
      chartType,
      dataTestId = 'funnel-chart-test-id',
      wrapperClassName = '',
      isLoading = false,
      skeletonProps = {},
      noDataSkeletonProps = {},
    },
    ref,
  ) => {
    function interpolatePoints(
      current: FunnelChartData,
      next: FunnelChartData | undefined,
    ) {
      if (!next) return [current];
      return [current, next];
    }

    function interpolateData(data: FunnelChartData[]) {
      const interpolated = data.flatMap((d, i) => {
        const next = data[i + 1];
        return interpolatePoints(d, next);
      });

      const lastPoint = chartData[chartData.length - 1];
      if (lastPoint) {
        const finalValue =
          chartType === 'Stepped' ? lastPoint.value * 0.1 : lastPoint.value;

        interpolated.push({
          index: lastPoint.index + 1,
          value: finalValue,
          label: lastPoint.label,
        });
      }
      return interpolated;
    }

    const data = interpolateData(chartData);
    const numSegments = Math.max(...chartData.map(x));
    const maxValue = Math.max(...chartData.map(y));

    const xScale = scaleLinear({
      range: [0, width - (margins.left + margins.right)],
      domain: [0, numSegments + 0.5],
    });

    const yScale = scaleLinear({
      range: [height / 2 - (margins.top + margins.bottom), 0],
      domain: [maxValue, 0],
    });

    const calculatePadForValue = (d: FunnelChartData, baseSize: number) => {
      const ratio = d.value / maxValue;

      if (chartType === 'Stepped' && d.index >= numSegments) {
        return baseSize * ratio * 0.2;
      }

      return baseSize * ratio;
    };

    const areas = [
      { key: 0, baseSize: -15, opacity: 1 },
      { key: 1, baseSize: 0, opacity: 0.8 },
      { key: 2, baseSize: 15, opacity: 0.5 },
    ];

    const curveType = chartType === 'Curved' ? curveMonotoneY : curveLinear;

    const allZero = useAllZeroEffect<FunnelChartData>({
      chartData,
      valueKey: 'value',
    });

    const devicePixelRatio = useDevicePixelRatio();

    if (isLoading) {
      return (
        <ChartSkeleton
          height={height}
          width={width}
          margins={margins}
          animate
          type="horizontalFunnel"
          {...skeletonProps}
        />
      );
    }

    if (allZero || chartData.length === 0) {
      return (
        <FunnelChartNoDataSkeleton
          height={height}
          margins={margins}
          width={width}
          {...noDataSkeletonProps}
        />
      );
    }

    return (
      <div className={wrapperClassName} data-testid={dataTestId} ref={ref}>
        <svg width={width} height={height}>
          <LinearGradient
            id="funnel-gradient"
            from={colorPalette[0]}
            to={colorPalette[1]}
            vertical={false}
          />

          {(hasLayers
            ? areas
            : [{ key: 'single', baseSize: -5, opacity: 1 }]
          ).map((area) => (
            <Area
              key={`area-${area.key}`}
              data={data}
              curve={curveType}
              x={(d) => xScale(d.index)}
              y0={(d) => {
                const pad = calculatePadForValue(d, area.baseSize);
                return height / 2 - yScale(d.value) - pad;
              }}
              y1={(d) => {
                const pad = calculatePadForValue(d, area.baseSize);
                return height / 2 + yScale(d.value) + pad;
              }}
              fill="url(#funnel-gradient)"
              fillOpacity={area.opacity}
              stroke="transparent"
            />
          ))}

          {chartData.map((d) => (
            <Text
              key={`label-${d.index}`}
              x={xScale(d.index) + 5}
              y={margins.top - 15}
              textAnchor="start"
              fill="#3B475B"
              className="label-small fill-text-text"
            >
              {d.label}
            </Text>
          ))}

          {chartData.map((d) => (
            <Text
              key={`value-${d.index}`}
              x={xScale(d.index) + 5}
              y={margins.top + 8}
              textAnchor="start"
              fill="#3B475B"
              className="heading-3 fill-text-text font-semibold"
            >
              {`${d.value.toLocaleString()}`}
            </Text>
          ))}

          {chartData.map((d) => (
            <Text
              key={`percentage-${d.index}`}
              x={xScale(d.index) + 5}
              y={height - 15}
              textAnchor="start"
              dominantBaseline="hanging"
              fill="#3B475B"
              className="heading-4 fill-text-text font-semibold"
            >
              {`${Math.round((d.value / maxValue) * 100)}%`}
            </Text>
          ))}

          {chartData.map((d) => (
            <Line
              key={`line-${d.index}`}
              from={{ x: xScale(d.index), y: 0 }}
              to={{ x: xScale(d.index), y: height }}
              stroke="#D0D3D8"
              strokeWidth={1 / devicePixelRatio}
              strokeDasharray="4"
            />
          ))}
        </svg>
      </div>
    );
  },
);
