import { useEffect, useRef, useState } from 'react';

import { Group } from '@visx/group';
import { Bar } from '@visx/shape';

import DataNotAvailable, { DataNotAvailableProps } from '../DataNotAvailable';

/* eslint-disable import/prefer-default-export */
interface SuccessFailureIndicatorChartNoDataSkeletonProps
  extends DataNotAvailableProps {
  width: number;
  height: number;
  margins: ChartMargins;
}

interface ChartMargins {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

function SuccessFailureIndicatorChartNoDataSkeleton({
  height,
  width,
  margins,
  ...dataNotAvailableProps
}: Readonly<SuccessFailureIndicatorChartNoDataSkeletonProps>) {
  const MIN_BAR_WIDTH = 8;
  const containerRef = useRef<HTMLDivElement>(null);
  const [barCount, setBarCount] = useState(
    (width - margins.left - margins.right + 2) / (MIN_BAR_WIDTH + 2),
  );

  const totalWidth = Math.max(
    width,
    (barCount - 1) * MIN_BAR_WIDTH +
      2 * (barCount - 2) +
      2 * margins.left +
      margins.right,
  );

  useEffect(() => {
    if (!containerRef.current?.parentElement) return;

    function calculateTotalWidth() {
      if (!containerRef.current?.parentElement) return;
      const parentWidth =
        containerRef.current.parentElement.getBoundingClientRect().width;
      const calculatedBarCount = Math.floor(
        (parentWidth - margins.left - margins.right + 2) / (MIN_BAR_WIDTH + 2),
      );

      if (calculatedBarCount !== barCount) {
        setBarCount(calculatedBarCount);
      }
    }

    calculateTotalWidth();

    const resizeObserver = new ResizeObserver(calculateTotalWidth);
    resizeObserver.observe(containerRef.current?.parentElement);

    // eslint-disable-next-line consistent-return
    return () => resizeObserver.disconnect();
  }, [barCount, margins]);

  return (
    <DataNotAvailable width="100%" height={height} {...dataNotAvailableProps}>
      <div
        ref={containerRef}
        className="border-border-border-light w-full rounded-lg border border-solid px-2"
        style={{
          height: `${height}px`,
          paddingTop: `${margins.top - 2}px`,
          paddingBottom: `${margins.bottom - 2}px`,
        }}
      >
        <svg
          width={totalWidth - margins.left - margins.right}
          height={height - margins.top - margins.bottom}
          className="m-auto"
        >
          <Group fill="#F1F1F1">
            {Array.from({ length: barCount }, (_, i) => (
              <Bar
                key={i}
                y={0}
                height={height}
                width={MIN_BAR_WIDTH}
                x={MIN_BAR_WIDTH * i + 2 * i}
                rx={2}
                ry={2}
                fill="#F7F7F8"
              />
            ))}
          </Group>
        </svg>
      </div>
    </DataNotAvailable>
  );
}

export { SuccessFailureIndicatorChartNoDataSkeleton };
