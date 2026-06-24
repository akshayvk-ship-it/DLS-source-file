import { forwardRef } from 'react';
import { scaleOrdinal } from '@visx/scale';
import { Treemap, hierarchy, treemapSquarify } from '@visx/hierarchy';
import { useTooltip, useTooltipInPortal } from '@visx/tooltip';

import { ColorMapping } from './types';
import { colorMappings } from './constants';
import { ToolTipBase } from '../../ToolTip';
import { ChartSkeleton, TreeMapSkeletonProps } from '../ChartsSkeletonLoader';
import { useAllZeroEffect } from '../NoDataSkeleton/hook/useAllZeroEffect';
import { TreeMapNoDataSkeleton } from '../NoDataSkeleton/TreeMapNoDataSkeleton';
import { DataNotAvailableProps } from '../NoDataSkeleton/DataNotAvailable';

export type TreeMapData = {
  label: string;
  value: number;
  tooltipText?: string;
};

type TreeMapNode = {
  name: string;
  value?: number;
  tooltipText?: string;
  children?: TreeMapNode[];
};

export interface TreeMapChartProps {
  mapData: TreeMapData[];
  chartData?: TreeMapData[];
  nodePadding?: number;
  wrapperClassName?: string;
  dataTestId?: string;
  height: number;
  width: number;
  customColors?: {
    color: string;
    font: string;
  };
  colorType?: ColorMapping;
  displayTooltip?: boolean;
  tooltipTopOffset?: number;
  isLoading?: boolean;
  skeletonProps?: Omit<
    TreeMapSkeletonProps,
    'height' | 'width' | 'margins' | 'animate' | 'type'
  >;
  noDataSkeletonProps?: DataNotAvailableProps;
}

export const TreeMapChart = forwardRef<HTMLDivElement, TreeMapChartProps>(
  (
    {
      mapData,
      nodePadding,
      chartData,
      wrapperClassName = '',
      height,
      customColors = undefined,
      width,
      dataTestId = 'tree-map-chart',
      colorType = ColorMapping.ORANGE,
      displayTooltip = false,
      tooltipTopOffset = 10,
      isLoading = false,
      skeletonProps = {},
      noDataSkeletonProps = {},
    },
    ref,
  ) => {
    const dataForChart = chartData || mapData;

    const { containerRef: tooltipContainerRef, TooltipInPortal } =
      useTooltipInPortal({
        scroll: true,
        detectBounds: false,
      });

    const baseFillColor = customColors?.color ?? colorMappings[colorType].color;

    const baseFontColor =
      customColors?.font ?? colorMappings[colorType].fontColor;

    const valueToOpacity: Record<number, number | undefined> = {};
    const valueToFontOpacity: Record<number, number | undefined> = {};
    const valueToFontStyle: Record<number, string | undefined> = {};
    const valueToFontSpacing: Record<number, number | undefined> = {};
    const labelColorMap: Record<string, string> = {};
    const labelFontColorMap: Record<string, string> = {};

    const getRgba = (base: string, alpha: number | undefined) => {
      let hex = base.startsWith('#') ? base.slice(1) : base;

      if (hex.length === 3) {
        hex = hex
          .split('')
          .map((char) => char + char)
          .join('');
      }

      if (hex.length !== 6) {
        return `rgba(0, 0, 0, ${alpha})`;
      }

      const r = parseInt(hex.slice(0, 2), 16);
      const g = parseInt(hex.slice(2, 4), 16);
      const b = parseInt(hex.slice(4, 6), 16);

      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    };

    const opacities = [0.4, 0.26, 0.18, 0.1];
    const fontOpacity = [0.8, 0.72, 0.64];
    const fontStyles = [
      'label-large font-semibold',
      'label-medium font-medium',
      'label-small font-medium',
      'label-extra-small font-medium',
    ];
    const fontSpacing = [12, 10, 10, 6];
    const nodePaddingValue = nodePadding ?? 1;

    // Sort mapData by value in descending order
    const uniqueValues = Array.from(
      new Set(dataForChart.map((d) => d.value)),
    ).sort((a, b) => b - a);

    // Create a mapping of unique values to their corresponding font styles and opacities
    uniqueValues.forEach((val, index) => {
      valueToFontStyle[val] =
        fontStyles[index] ?? fontStyles[fontStyles.length - 1];
      valueToOpacity[val] = opacities[index] ?? opacities[opacities.length - 1];
      valueToFontOpacity[val] =
        fontOpacity[index] ?? fontOpacity[fontOpacity.length - 1];
      valueToFontSpacing[val] =
        fontSpacing[index] ?? fontSpacing[fontSpacing.length - 1];
    });

    // Create a mapping of labels to their corresponding colors
    dataForChart.forEach((item) => {
      const opacity = valueToOpacity[item.value];
      const fontOpacityVal = valueToFontOpacity[item.value];
      labelColorMap[item.label] = getRgba(baseFillColor, opacity);
      labelFontColorMap[item.label] = getRgba(baseFontColor, fontOpacityVal);
    });

    const sortedMapData = [...dataForChart].sort((a, b) => b.value - a.value);

    // Create a mapping of labels to their corresponding colors
    const colorVariants = scaleOrdinal<string, string>({
      domain: sortedMapData.map((d) => d.label),
      range: sortedMapData.map((d) => labelColorMap[d.label] ?? ''),
    });

    // Create a mapping of labels to their corresponding font colors
    const fontColorVariants = scaleOrdinal<string, string>({
      domain: sortedMapData.map((d) => d.label),
      range: sortedMapData.map((d) => labelFontColorMap[d.label] ?? ''),
    });

    const treeMapData: TreeMapNode = {
      name: 'root',
      children: sortedMapData.map((item) => ({
        name: item.label,
        value: item.value,
        tooltipText: item.tooltipText,
      })),
    };

    const total = sortedMapData.reduce((acc, item) => acc + item.value, 0);

    const root = hierarchy<TreeMapNode>(treeMapData).sum((d) => d.value ?? 0);

    const measureText = (text: string, font = '12px sans-serif') => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return { width: 0, height: 0 };

      ctx.font = font;
      const metrics = ctx.measureText(text);
      const heights =
        metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
      return { width: metrics.width, height: heights };
    };

    const { tooltipData, tooltipLeft, tooltipTop, showTooltip, hideTooltip } =
      useTooltip<{
        label: string;
      }>();

    const allZero = useAllZeroEffect<TreeMapData>({
      chartData: dataForChart,
      valueKey: 'value',
    });

    if (isLoading) {
      return (
        <ChartSkeleton
          height={height}
          width={width}
          margins={{
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
          }}
          animate
          type="treeMap"
          {...skeletonProps}
        />
      );
    }

    if (allZero || dataForChart.length === 0) {
      return (
        <TreeMapNoDataSkeleton
          height={height}
          width={width}
          margins={{
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
          }}
          {...noDataSkeletonProps}
        />
      );
    }

    return (
      <div
        className={`${wrapperClassName} relative`}
        data-testid={dataTestId}
        ref={ref}
      >
        <svg width={width} height={height} ref={tooltipContainerRef}>
          <Treemap
            root={root}
            size={[width, height]}
            tile={treemapSquarify}
            round
          >
            {(treemap) =>
              treemap.descendants().map((node) => {
                const { x0, x1, y0, y1, data } = node;
                if (!node.depth) return null;
                if (Number(data.value) === 0) return null;

                const boxWidth = x1 - x0;
                const boxHeight = y1 - y0;
                const adjustedWidth = Math.max(
                  0,
                  boxWidth - 2 * nodePaddingValue,
                );
                const adjustedHeight = Math.max(
                  0,
                  boxHeight - 2 * nodePaddingValue,
                );
                const adjustedX = x0 + nodePaddingValue;
                const adjustedY = y0 + nodePaddingValue;

                const centerX = adjustedX + adjustedWidth / 2;
                const centerY = adjustedY + adjustedHeight / 2;

                const textSize = measureText(data.name);

                const thresholdFit =
                  textSize.width + 8 < adjustedWidth &&
                  textSize.height + 20 < adjustedHeight;

                return (
                  <g key={data.name}>
                    <rect
                      x={adjustedX}
                      y={adjustedY}
                      width={adjustedWidth}
                      height={adjustedHeight}
                      fill={colorVariants(data.name)}
                      stroke="#fff"
                      onMouseMove={() => {
                        if (!displayTooltip) return;

                        showTooltip({
                          tooltipLeft: centerX - 10,
                          tooltipTop: adjustedY - tooltipTopOffset,
                          tooltipData: {
                            label: data.tooltipText || data.name,
                          },
                        });
                      }}
                      onMouseLeave={hideTooltip}
                    />

                    {thresholdFit && (
                      <text
                        x={centerX}
                        y={centerY - (valueToFontSpacing[data.value!] ?? 2)}
                        className={
                          valueToFontStyle[data.value!] ??
                          'label-small font-medium'
                        }
                        fill={fontColorVariants(data.name)}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        pointerEvents="none"
                      >
                        {data.name}
                      </text>
                    )}
                    <text
                      x={centerX}
                      y={
                        centerY +
                        (thresholdFit
                          ? (valueToFontSpacing[data.value!] ?? 0)
                          : 0)
                      }
                      className={
                        valueToFontStyle[data.value!] ??
                        'label-small font-medium'
                      }
                      fill={fontColorVariants(data.name)}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      pointerEvents="none"
                    >
                      {((data.value! / total) * 100).toFixed(2)}%
                    </text>
                  </g>
                );
              })
            }
          </Treemap>
        </svg>
        {tooltipData && (
          <TooltipInPortal
            top={tooltipTop}
            left={tooltipLeft}
            className="absolute"
            style={{
              pointerEvents: 'none',
              zIndex: 10,
            }}
          >
            <ToolTipBase
              placementToolTip="top-center"
              titleToolTip={tooltipData.label}
              toolTipType="contextual"
            />
          </TooltipInPortal>
        )}
      </div>
    );
  },
);
