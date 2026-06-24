import { forwardRef } from 'react';
import HorizontalAxisLegend, {
  HorizontalAxisLegendProps,
} from './HorizontalAxisLegend';
import { LinearLegend, LinearLegendProps } from './LinearLegend';
import useLinearLegend from './useLinearLegend';

export interface AxisLegends {
  xAxisLabel?: string;
  xAxisValue: string;
  yAxisLabel?: string;
  yAxisValue: string;
}

export type LegendType = 'linear' | 'tabular';

type CommonProps = {
  wrapperClassName?: string;
  legendTestId?: string;
};

type TabularLegendProps = CommonProps & {
  legendType?: 'tabular';
  axisLegends?: AxisLegends;
  horizontalAxisLegends?: Omit<HorizontalAxisLegendProps, 'totalValue'>;
};

type LinearLegendPropsWithType = CommonProps & {
  legendType: 'linear';
} & Omit<LinearLegendProps, 'wrapperClassName' | 'dataTestId'>;

export type LegendsProps = TabularLegendProps | LinearLegendPropsWithType;

export const Legends = forwardRef<HTMLDivElement, LegendsProps>(
  (props, ref) => {
    const {
      wrapperClassName = '',
      legendTestId = 'legend-testId',
      legendType = 'tabular',
      ...restProps
    } = props;

    const renderAxisLabel = (axisLegends: AxisLegends) => (
      <div className="bg-fill-fill-dark rounded-xl p-2">
        <div className="flex h-6 items-center gap-1">
          <span className="text-text-text label-small font-medium">
            {axisLegends?.xAxisLabel ?? 'X Axis:'}
          </span>
          <span className="label-small text-text-text">
            {axisLegends?.xAxisValue}
          </span>
        </div>
        <div className="flex h-6 items-center gap-1">
          <span className="text-text-text label-small font-medium">
            {axisLegends?.yAxisLabel ?? 'Y Axis:'}
          </span>
          <span className="label-small text-text-text">
            {axisLegends?.yAxisValue}
          </span>
        </div>
      </div>
    );

    if (legendType === 'tabular' || legendType === undefined) {
      const tabularProps = restProps as TabularLegendProps;

      return (
        <div
          className={`${wrapperClassName} flex flex-col gap-2`}
          ref={ref}
          data-testid={legendTestId}
        >
          {tabularProps.axisLegends &&
            renderAxisLabel(tabularProps.axisLegends)}

          {tabularProps.horizontalAxisLegends && (
            <HorizontalAxisLegend
              totalValue={
                tabularProps.horizontalAxisLegends.xAxisLegends.length
              }
              xAxisLegends={tabularProps.horizontalAxisLegends.xAxisLegends}
              axisLegendRowClassName={
                tabularProps.horizontalAxisLegends?.axisLegendRowClassName
              }
              labelClassName={
                tabularProps.horizontalAxisLegends?.labelClassName
              }
              valueClassName={
                tabularProps.horizontalAxisLegends?.valueClassName
              }
              wrapperClassName={
                tabularProps.horizontalAxisLegends?.wrapperClassName
              }
              maxTruncateWidth={
                tabularProps.horizontalAxisLegends.maxTruncateWidth
              }
              shouldTruncate={tabularProps.horizontalAxisLegends.shouldTruncate}
            />
          )}
        </div>
      );
    }

    const linearProps = restProps as LinearLegendPropsWithType;

    return (
      <LinearLegend
        ref={ref}
        wrapperClassName={wrapperClassName}
        dataTestId={legendTestId}
        {...linearProps}
      />
    );
  },
);

export { useLinearLegend };
