import { LineChartData, LineChartType } from './types';

interface ToolTipLineChartProps {
  lineChartType: LineChartType;
  axisLeftTickFormatter?: (value: number) => string;
  axisBottomTickFormatter?: (value: string) => string;
  tooltipData: LineChartData[];
}

function ToolTipLineChart({
  lineChartType,
  tooltipData,
  axisLeftTickFormatter,
  axisBottomTickFormatter,
}: ToolTipLineChartProps) {
  return (
    <div>
      <span
        className={`text-text-light label-small ${
          lineChartType.series ? 'pl-0.5' : ''
        }`}
      >
        {axisBottomTickFormatter?.(tooltipData[0]?.label ?? '') ??
          tooltipData[0]?.label}
      </span>
      <div className="flex flex-col">
        {tooltipData.map((tooltipItem, index) => (
          <div
            // eslint-disable-next-line react/no-array-index-key
            key={`${tooltipItem.value}-${index}`}
            className="flex h-5 items-start"
          >
            <span
              className="relative inline-flex h-5 w-4 items-center before:absolute before:left-1/2 before:top-1/2 before:h-2 before:w-2 before:-translate-x-1/2 before:-translate-y-1/2 before:rounded-full before:bg-[var(--before-background)]"
              style={
                {
                  '--before-background': `${
                    lineChartType.series
                      ? lineChartType.lineStrokeColor[index]
                      : lineChartType.lineStrokeColor
                  }`,
                } as React.CSSProperties
              }
            />
            <span className="text-text-text paragraph-extra-small font-medium">
              {axisLeftTickFormatter?.(tooltipItem.value) ?? tooltipItem.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ToolTipLineChart;
