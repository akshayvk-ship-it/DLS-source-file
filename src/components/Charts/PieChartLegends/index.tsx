import { forwardRef } from 'react';
import { scaleOrdinal } from '@visx/scale';
import { PieChartData } from '../PieChart/types';

export interface PieChartLegendProps {
  wrapperClassName?: string;
  color: string[];
  pieChartData: PieChartData[];
  chartData?: PieChartData[];
  legendsInfo?: string;
  legendsInfoClassName?: string;
  labelClassName?: string;
  percentValueClassName?: string;
  showLabelFirst?: boolean;
  disableSort?: boolean;
}

export const PieChartLegends = forwardRef<HTMLDivElement, PieChartLegendProps>(
  (
    {
      wrapperClassName = '',
      color,
      pieChartData,
      legendsInfo = '',
      legendsInfoClassName = '',
      labelClassName = '',
      percentValueClassName = '',
      showLabelFirst = false,
      disableSort = false,
      chartData,
    },
    ref,
  ) => {
    const dataForChart = chartData || pieChartData;
    const sortedPieChartData = disableSort
      ? dataForChart
      : [...dataForChart].sort((a, b) => b.value - a.value);

    const colorScale = scaleOrdinal<string, string>({
      domain: sortedPieChartData.map((d) => d.label),
      range: color.slice(0, sortedPieChartData.length),
    });

    const totalValue = sortedPieChartData.reduce(
      (sum, item) => sum + item.value,
      0,
    );

    const renderLabel = (percentage: string, data: PieChartData) => (
      <>
        {`${percentage}%`}
        {data.subLabel && (
          <p
            className={`font-normal ${!showLabelFirst ? 'label-extra-small' : 'label-small'}`}
          >{`(${data.subLabel})`}</p>
        )}
      </>
    );

    return (
      <div className={`flex flex-col gap-4 ${wrapperClassName} `} ref={ref}>
        <div
          className={`${legendsInfoClassName} bg-fill-fill-dark paragraph-extra-small text-text-text rounded-xl p-3`}
        >
          {legendsInfo}
        </div>
        <div className="flex flex-wrap gap-2">
          {sortedPieChartData.map((data) => {
            const percentage = ((data.value / totalValue) * 100).toFixed(0);
            const sliceColor = colorScale(data.label);

            return (
              <div
                key={data.label}
                className="flex w-1/2 flex-col py-1 pl-1"
                style={{ width: 'calc(50% - 0.25rem)' }}
              >
                <div className="flex items-center gap-1">
                  <div
                    className="h-3 w-5 rounded-full border-[0.5px] border-[rgba(0,0,0,0.04)]"
                    style={{ backgroundColor: sliceColor }}
                  />
                  <div
                    className={`${percentValueClassName} label-medium text-text-text flex items-center gap-1 font-semibold`}
                  >
                    {!showLabelFirst
                      ? renderLabel(percentage, data)
                      : data.label}
                  </div>
                </div>
                <div
                  className={`${labelClassName} ${showLabelFirst ? 'flex gap-1' : ''} label-small text-text-text ml-6`}
                >
                  {showLabelFirst ? renderLabel(percentage, data) : data.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  },
);
