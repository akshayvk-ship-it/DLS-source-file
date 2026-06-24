/* eslint-disable react/no-array-index-key */
import { forwardRef } from 'react';
import { scaleLinear, scaleOrdinal } from '@visx/scale';
import { Line } from '@visx/shape';
import { getStringWidth, Text } from '@visx/text';
import { Group } from '@visx/group';
import { FunnelChartProps, FunnelChartData, LegendVariant } from './types';
import { generateDescendingAlphaHexColors } from './utils';
import {
  ChartSkeleton,
  VerticalFunnelSkeletonProps,
} from '../ChartsSkeletonLoader';
import { useAllZeroEffect } from '../NoDataSkeleton/hook/useAllZeroEffect';
import { VerticalFunnelChartNoDataSkeleton } from '../NoDataSkeleton/VerticalFunnelChartNoDataSkeleton';
import { DataNotAvailableProps } from '../NoDataSkeleton/DataNotAvailable';
import { useDevicePixelRatio } from '../../hooks/useDevicePixelRatio';

const x = (d: FunnelChartData) => d.value;

export interface VerticalFunnelChartProps
  extends Omit<FunnelChartProps, 'hasLayers' | 'colorPalette'> {
  baseColor: string;
  valueFormatter?: (value: number) => string;
  changePercentValueFormatter?: (value: number) => string;
  legendVariant?: LegendVariant;
  isLoading?: boolean;
  skeletonProps?: Omit<
    VerticalFunnelSkeletonProps,
    'height' | 'width' | 'margins' | 'type'
  >;
  noDataSkeletonProps?: DataNotAvailableProps;
}

export const VerticalFunnelChart = forwardRef<
  HTMLDivElement,
  VerticalFunnelChartProps
>(
  (
    {
      width,
      height,
      chartData,
      margins,
      valueFormatter,
      changePercentValueFormatter,
      baseColor,
      isLoading = false,
      skeletonProps = {},
      noDataSkeletonProps = {},
      legendVariant = 'Type3Variant',
      dataTestId = 'vertical-funnel-chart-test-id',
      wrapperClassName = '',
    },
    ref,
  ) => {
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
          type="verticalFunnel"
          {...skeletonProps}
        />
      );
    }

    const sortedChartData = [...chartData].sort((a, b) => b.value - a.value);
    const MIN_WIDTH = 10;
    const maxValue = Math.max(...sortedChartData.map(x));
    const safeMaxValue = maxValue === 0 ? 1 : maxValue;
    const segmentCount = sortedChartData.length;
    const MARGIN_X = 120;
    const ICON_WIDTH = 14;

    const yScale = scaleLinear({
      range: [margins.top, height - margins.bottom],
      domain: [0, segmentCount],
    });

    const valueToHalfWidth = scaleLinear({
      domain: [0, safeMaxValue],
      range: [MIN_WIDTH, (width - margins.left - margins.right) / 2 - MARGIN_X],
    });

    if (allZero || chartData.length === 0) {
      return (
        <VerticalFunnelChartNoDataSkeleton
          height={height}
          margins={margins}
          width={width}
          {...noDataSkeletonProps}
        />
      );
    }

    const colorPalette = generateDescendingAlphaHexColors(
      baseColor,
      segmentCount,
    );

    const colorScale = scaleOrdinal<string>({
      domain: sortedChartData.map((d) => d.label),
      range: colorPalette,
    });

    let LINE_HEIGHT = 20;
    const segmentHeight =
      (height - margins.top - margins.bottom) / segmentCount;

    const downArrowIcon = (
      <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        y={-5}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          width="12"
          height="12"
          rx="6"
          fill="#D7074C"
          className="fill-icon-error"
        />
        <path
          d="M3.10662 6.2995L3.71813 5.68501L5.55563 7.5255L5.55563 2.80859L6.44455 2.80859L6.44455 7.5255L8.28503 5.68501L8.89355 6.2995L6.00009 9.19297L3.10662 6.2995Z"
          fill="white"
        />
      </svg>
    );

    const renderLegendTextByVariant = (d: FunnelChartData, i: number) => {
      const yTop = yScale(i);
      const yBottom = yScale(i + 1);
      const segmentCenterY = (yTop + yBottom) / 2;
      const topPercentValue = maxValue;

      let changePercentage;
      let changePercentValue;
      if (i !== 0) {
        changePercentValue =
          (sortedChartData[i - 1]?.value ?? d.value) - d.value;

        changePercentage = parseFloat(
          (topPercentValue === 0
            ? 0
            : (changePercentValue / topPercentValue) * 100
          ).toFixed(1),
        );
      }

      let lines: {
        text: string | number | undefined;
        className: string;
        fill: string;
      }[] = [];

      let textAnchor: 'start' | 'middle' | 'end' = 'end';
      let textX = width;

      switch (legendVariant) {
        case 'Type1Variant':
          textAnchor = 'middle';
          textX = width - (margins.right + margins.left + 10);
          lines = [
            {
              text: valueFormatter ? valueFormatter(d.value) : d.value,
              className: 'label-small fill-text-light',
              fill: '#848B98',
            },
            {
              text: `${Math.round((d.value / safeMaxValue) * 100)}%`,
              className: 'heading-3 fill-text-text font-semibold',
              fill: '#3B475B',
            },
          ];

          if (i !== 0 && changePercentValue && changePercentage !== 0) {
            const formattedValue = changePercentValueFormatter
              ? changePercentValueFormatter(changePercentValue)
              : changePercentValue;
            lines.push({
              text: `${changePercentage}${changePercentage ? '%' : ''} ${formattedValue}`,
              className: 'paragraph-small fill-text-light font-medium',
              fill: '#3B475B',
            });
          }

          lines.push({
            text: d.label,
            className: 'label-small fill-text-text',
            fill: '#3B475B',
          });
          break;

        case 'Type2Variant':
          textAnchor = 'start';
          textX = width - (margins.right + margins.left + 30);
          lines = [
            {
              text: d.label,
              className: 'label-small fill-text-text',
              fill: '#3B475B',
            },
          ];
          if (i !== 0 && changePercentage !== 0) {
            lines.push({
              text: changePercentValue,
              className: 'heading-3 font-semibold fill-text-text',
              fill: '#3B475B',
            });
          }
          lines.push({
            text: d.subLabel,
            className: 'label-small fill-text-text',
            fill: '#3B475B',
          });
          lines.push({
            text: `${Math.round((d.value / safeMaxValue) * 100)}%`,
            className: 'heading-3 fill-text-text font-semibold',
            fill: '#3B475B',
          });
          break;

        default:
          LINE_HEIGHT = 24;
          textAnchor = 'middle';
          textX = width - (margins.right + margins.left) - 5;
          lines = [
            {
              text: d.label,
              className: 'label-small fill-text-text',
              fill: '#3B475B',
            },
            {
              text: `${Math.round((d.value / safeMaxValue) * 100)}%`,
              className: 'heading-3 fill-text-text font-semibold',
              fill: '#3B475B',
            },
            {
              text: d.value.toLocaleString(),
              className: 'label-small fill-text-light',
              fill: '#848B98',
            },
          ];
          break;
      }

      const totalTextHeight = (lines.length - 1) * LINE_HEIGHT;
      const startY = segmentCenterY - totalTextHeight / 2;

      return lines.map((line, idx) => {
        const y = startY + idx * LINE_HEIGHT;

        if (legendVariant === 'Type1Variant' && idx === 2) {
          const isPercentChanged = () => {
            if (i === 0) {
              return undefined;
            }

            if ((sortedChartData[i - 1]?.value ?? d.value) > d.value) {
              return downArrowIcon;
            }

            return undefined;
          };

          const getPercentValue = (
            text: string | number | undefined,
          ): { percent: string; value: string } | null => {
            if (!text || !text.toString().includes('%')) return null;

            const [percent, value] = text.toString().split(' ');

            return {
              percent: percent || '',
              value: value || '',
            };
          };

          const textWidth = getStringWidth(line.text?.toString() || '') || 50;
          const iconPosition = textX - textWidth / 2 - ICON_WIDTH;
          const isDownIconVisible = isPercentChanged() !== undefined;
          const text = getPercentValue(line.text);

          return (
            <Group key={`label-${idx}`} top={y}>
              <Group left={iconPosition}>{isPercentChanged()}</Group>

              {isDownIconVisible && text ? (
                <text
                  x={textX}
                  y={0}
                  textAnchor={textAnchor}
                  dominantBaseline="central"
                  className={`${line.className}`}
                  fill={line.fill}
                >
                  <tspan className="fill-text-error">{text.percent}</tspan>{' '}
                  <tspan>{text.value}</tspan>
                </text>
              ) : (
                <Text
                  x={textX}
                  y={0}
                  textAnchor={textAnchor}
                  dominantBaseline="central"
                  className={line.className}
                  fill={line.fill}
                >
                  {line.text}
                </Text>
              )}
            </Group>
          );
        }

        return (
          <Text
            key={`label-${idx}`}
            x={textX}
            y={y}
            textAnchor={textAnchor}
            dominantBaseline="central"
            className={line.className}
            fill={line.fill}
          >
            {line.text}
          </Text>
        );
      });
    };

    return (
      <div className={wrapperClassName} data-testid={dataTestId} ref={ref}>
        <svg width={width} height={height}>
          <Group>
            {sortedChartData.map((d, i) => {
              const yTop = yScale(i);
              const yBottom = yTop + segmentHeight;
              const isFirst = i === 0;
              const centerX = width / 2;
              const topHalfWidth = valueToHalfWidth(d.value);
              const bottomHalfWidth = valueToHalfWidth(d.value);
              let prevLeftBottomx = 0;
              let prevRightBottomx = 0;

              if (!isFirst) {
                const prev = sortedChartData[i - 1];
                const prevHalfWidth = valueToHalfWidth(prev!.value);
                prevLeftBottomx = centerX - prevHalfWidth;
                prevRightBottomx = centerX + prevHalfWidth;
              }

              const leftTopX = centerX - topHalfWidth;
              const rightTopX = centerX + topHalfWidth;
              const leftBottomX = centerX - bottomHalfWidth;
              const rightBottomX = centerX + bottomHalfWidth;

              const yMiddle = yTop + (yBottom - yTop) * 0.4;
              const curvePoint = (yTop + yMiddle) / 2;

              const path = isFirst
                ? `
                M ${leftTopX},${yTop}
                L ${rightTopX},${yTop}
                L ${rightBottomX},${yBottom}
                L ${leftBottomX},${yBottom}
                Z
              `
                : `
                M ${leftTopX},${yTop}
                L ${prevRightBottomx},${yTop}
                Q ${rightBottomX},${curvePoint} ${rightBottomX},${yMiddle}
                L ${rightBottomX},${yBottom}
                L ${leftBottomX},${yBottom}
                L ${leftBottomX},${yMiddle}
                Q ${leftBottomX},${curvePoint} ${prevLeftBottomx},${yTop}
                Z
            `;

              return (
                <path
                  key={`segment-${i}`}
                  d={path}
                  fill={colorScale(d.label)?.toString()}
                />
              );
            })}
            {sortedChartData.map((d, i) => renderLegendTextByVariant(d, i))}

            {sortedChartData.map((d, i) => {
              const isFirst = i === 0;
              const isLast = i === segmentCount;

              return (
                <Line
                  key={`line-${i}`}
                  from={{ x: 0, y: yScale(i) }}
                  to={{ x: width, y: yScale(i) }}
                  stroke="#D0D3D8"
                  strokeWidth={
                    !isFirst && !isLast
                      ? 1 / devicePixelRatio
                      : 2 / devicePixelRatio
                  }
                  strokeOpacity={0.5}
                  strokeDasharray={!isFirst && !isLast ? '3' : undefined}
                />
              );
            })}

            <Line
              from={{ x: 0, y: yScale(segmentCount) }}
              to={{ x: width, y: yScale(segmentCount) }}
              stroke="#D0D3D8"
              strokeWidth={1 / devicePixelRatio}
            />
          </Group>
        </svg>
      </div>
    );
  },
);
