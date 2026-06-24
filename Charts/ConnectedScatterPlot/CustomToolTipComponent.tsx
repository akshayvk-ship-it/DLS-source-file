/* eslint-disable react/no-array-index-key */
import { CustomToolTipComponentProps } from './types';

function CustomToolTipComponent({
  isSeries,
  axisLeftTickFormatter,
  axisBottomTickFormatter,
  toolTipData,
}: CustomToolTipComponentProps) {
  return (
    <div>
      <span className={`text-text-light label-small ${isSeries ? 'pl-1' : ''}`}>
        {axisBottomTickFormatter?.(toolTipData[0]?.xValue ?? 0) ??
          toolTipData[0]?.xValue}
      </span>
      {!isSeries && (
        <div className="heading-6-semibold text-text-text">
          {axisLeftTickFormatter?.(toolTipData[0]?.yValue ?? 0) ??
            toolTipData[0]?.yValue}
        </div>
      )}
      {isSeries && (
        <div className="flex flex-col">
          {toolTipData.map((tooltipItem, index) => (
            <div
              key={`${tooltipItem.yValue}-${tooltipItem.xValue}-${index}`}
              className="flex h-5 items-center"
            >
              <span
                className="relative inline-flex h-5 w-4 items-center before:absolute before:left-1/2 before:top-1/2 before:h-2 before:w-2 before:-translate-x-1/2 before:-translate-y-1/2 before:rounded-full before:bg-[var(--before-background)]"
                style={
                  {
                    '--before-background': toolTipData[index]?.labelColor,
                  } as React.CSSProperties
                }
              />
              <span className="text-text-text paragraph-extra-small font-medium">
                {axisLeftTickFormatter?.(tooltipItem.yValue) ??
                  tooltipItem.yValue}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CustomToolTipComponent;
