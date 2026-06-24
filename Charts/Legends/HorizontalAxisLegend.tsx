import Truncator from './Truncator';

export interface XAxisLegends {
  label: string;
  value: string;
}

export interface HorizontalAxisLegendProps {
  xAxisLegends: XAxisLegends[];
  totalValue: number;
  wrapperClassName?: string;
  labelClassName?: string;
  valueClassName?: string;
  axisLegendRowClassName?: string;
  shouldTruncate?: boolean;
  maxTruncateWidth?: number;
}

function HorizontalAxisLegend({
  totalValue,
  xAxisLegends,
  wrapperClassName = '',
  labelClassName = '',
  valueClassName = '',
  axisLegendRowClassName = '',
  shouldTruncate = false,
  maxTruncateWidth,
}: HorizontalAxisLegendProps) {
  const firstColumn = Math.ceil(totalValue / 2);
  const renderLegends = (startIndex: number, endIndex: number) =>
    xAxisLegends.slice(startIndex, endIndex).map((legend) => (
      <div
        key={legend.value}
        className={`${axisLegendRowClassName} flex h-6 items-center gap-[0.563rem]`}
      >
        <span
          className={`${labelClassName} text-text-text label-small px-[0.281rem] font-medium`}
        >
          {legend.label}
        </span>

        {shouldTruncate ? (
          <Truncator
            text={legend.value}
            spanClassName={valueClassName}
            maxTruncateWidth={maxTruncateWidth}
          />
        ) : (
          <span className={`${valueClassName} label-small text-text-text`}>
            {legend.value}
          </span>
        )}
      </div>
    ));

  return (
    <div className={`${wrapperClassName} flex gap-6`}>
      <div className="flex flex-col gap-0.5">
        {renderLegends(0, firstColumn)}
      </div>
      <div className="flex flex-col gap-0.5">
        {renderLegends(firstColumn, totalValue)}
      </div>
    </div>
  );
}

export default HorizontalAxisLegend;
