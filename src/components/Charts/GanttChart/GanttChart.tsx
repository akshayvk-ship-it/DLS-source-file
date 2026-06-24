import React, { useEffect, useMemo, useRef, useState } from 'react';
import { scaleUtc, scaleBand } from '@visx/scale';
import { AxisLeft, TickRendererProps } from '@visx/axis';
import { Group } from '@visx/group';
import { Text } from '@visx/text';
import { GridRows } from '@visx/grid';
import { colorMappings } from './constants';
import { GanttChartProps } from './types';

// eslint-disable-next-line import/prefer-default-export
export const GanttChart = React.forwardRef<HTMLDivElement, GanttChartProps>(
  (
    {
      width,
      height,
      chartColor,
      margins,
      minProgress = 0,
      maxProgress = 100,
      ganttChartData = [],
      wrapperClassName = '',
      dataTestId = 'GanttChart-testId',
    },
    ref,
  ) => {
    const largestYLabelRef = useRef(null);
    const [largestYValueWidth, setLargestYValueWidth] = useState(0);

    const innerHeight = height - margins.top - margins.bottom;

    const dates = ganttChartData.flatMap((d) => [d.startDate, d.endDate]);

    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const partition = useMemo(
      () => (maxProgress - minProgress) / 4,
      [minProgress, maxProgress],
    );

    const minDate = useMemo(
      () => new Date(Math.min(...dates.map((d) => d.getTime()))),
      [dates],
    );

    const maxDate = useMemo(
      () => new Date(Math.max(...dates.map((d) => d.getTime()))),
      [dates],
    );

    const dayCount = Math.ceil(
      (maxDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24),
    );

    const pixelsPerDay = 40;
    const timelineWidth = dayCount * pixelsPerDay;

    const xScale = useMemo(
      () =>
        scaleUtc({
          domain: [minDate, maxDate],
          range: [0, timelineWidth],
        }),
      [minDate, maxDate, timelineWidth],
    );

    const labelsList = ganttChartData.map((d) => d.label);

    const yScale = useMemo(
      () =>
        scaleBand({
          domain: labelsList,
          range: [0, innerHeight],
          padding: 0.3,
        }),
      [innerHeight, labelsList],
    );

    const largestYLabel = useMemo(() => {
      const labels = labelsList;
      const longestLabel = labels.reduce((a, b) =>
        a.length > b.length ? a : b,
      );
      return longestLabel;
    }, [labelsList]);

    const tickDates = useMemo(() => {
      const dateValues: Date[] = [];
      const current = new Date(minDate);
      current.setUTCHours(0, 0, 0, 0);

      current.setUTCDate(current.getUTCDate() + 1);

      const end = new Date(maxDate);
      end.setUTCHours(0, 0, 0, 0);

      while (current <= end) {
        dateValues.push(new Date(current));
        current.setUTCDate(current.getUTCDate() + 1);
      }

      return dateValues;
    }, [minDate, maxDate]);

    const renderTextComponent = ({
      x,
      y,
      formattedValue,
    }: TickRendererProps) => (
      <Text
        x={x}
        y={y - 4}
        textAnchor="start"
        verticalAnchor="middle"
        className="label-small fill-text-text text-left font-medium"
        innerTextRef={
          largestYLabel === formattedValue ? largestYLabelRef : null
        }
        dx={5}
      >
        {formattedValue}
      </Text>
    );

    const formatDayOfWeek = (date: Date): string =>
      days[date.getUTCDay()] || '';

    const formatDayNumber = (date: Date): string =>
      date.getUTCDate().toString();

    const isWeekend = (date: Date): boolean => {
      const day = date.getUTCDay();
      return day === 0 || day === 6;
    };

    function getOpacityValue(progress: number) {
      if (progress <= partition) {
        return 0.12;
      }

      if (progress <= partition * 2) {
        return 0.24;
      }

      if (progress < partition * 3) {
        return 0.48;
      }

      return 0.8;
    }

    function getTextClassNameAccoringToProgress(progress: number) {
      let baseClass = 'label-small';

      if (progress >= partition * 3) {
        baseClass += ' text-text-dark';
      } else {
        baseClass += ' text-text-text';
      }

      return baseClass;
    }

    function generateTaskText(textValue: string, barwidth: number): string {
      const maxWidth = barwidth - 100;
      if (textValue.length * 7 > maxWidth) {
        return `${textValue.slice(0, Math.floor(maxWidth / 7))}...`;
      }

      return textValue;
    }

    useEffect(() => {
      if (largestYLabelRef.current) {
        const widthLabel = (
          largestYLabelRef.current as SVGTextElement
        ).getBoundingClientRect().width;
        setLargestYValueWidth(widthLabel + 25);
      }
    }, []);

    return (
      <div
        ref={ref}
        className={wrapperClassName}
        data-testid={dataTestId}
        style={{
          width,
          height,
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
        }}
      >
        {/* Fixed Y Axis */}
        <svg
          width={margins.left + largestYValueWidth}
          height={height}
          style={{
            position: 'sticky',
            left: 0,
            top: 0,
            flexShrink: 0,
          }}
        >
          <Group top={margins.top} left={margins.left}>
            <AxisLeft
              scale={yScale}
              hideTicks
              hideAxisLine
              tickComponent={renderTextComponent}
              left={10}
            />
            <GridRows
              top={yScale.bandwidth() / 2}
              scale={yScale}
              width={largestYValueWidth + margins.left}
              height={innerHeight}
              strokeDasharray="4 4"
              strokeWidth={1}
              stroke="rgba(235, 237, 239, 0.48)"
              className="[&>*:last-child]:hidden"
            />
          </Group>
        </svg>

        {/* Scrollable Content */}
        <div
          className="scroll-hidden"
          style={{
            overflowX: 'auto',
            overflowY: 'hidden',
            width: `calc(100% - ${margins.left + largestYValueWidth}px)`,
            flexGrow: 1,
          }}
        >
          <svg
            width={timelineWidth + margins.right}
            height={height - yScale.bandwidth() + yScale.bandwidth() / 4}
            style={{ display: 'block' }}
          >
            {/* Diagonal Stripe Definition */}
            <defs>
              <pattern
                id="diagonalStripesGantt"
                patternUnits="userSpaceOnUse"
                width="10"
                height="10"
                patternTransform="rotate(45)"
              >
                <rect width="10" height="10" fill="rgba(242, 242, 242, 1)" />
                <line
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="10"
                  stroke="white"
                  strokeWidth="2"
                />
              </pattern>
            </defs>

            <Group top={margins.top}>
              {/* Custom Date Header Texts */}
              {tickDates.map((date, index) => {
                const x = xScale(date);
                const dayOfWeek = formatDayOfWeek(date);
                const dayNumber = formatDayNumber(date);
                const weekend = isWeekend(date);

                /* Weekend Header Container */
                const headerX = x - pixelsPerDay / 2 + 0.5;
                const headerWidth = pixelsPerDay - 1;

                return (
                  // eslint-disable-next-line react/no-array-index-key
                  <Group key={`date-header-${index}`}>
                    {weekend ? (
                      <path
                        // eslint-disable-next-line react/no-array-index-key
                        key={`weekend-header-${index}`}
                        d={`
                        M ${headerX},${-60 + 8}
                        A 8,8 0 0 1 ${headerX + 8},${-60}
                        H ${headerX + headerWidth - 8}
                        A 8,8 0 0 1 ${headerX + headerWidth},${-60 + 8}
                        V ${-60 + 55}
                        H ${headerX}
                        Z
                      `}
                        fill="#F3F4F6"
                      />
                    ) : null}
                    {/* Day of week */}
                    <Text
                      x={x}
                      y={-45}
                      textAnchor="middle"
                      verticalAnchor="middle"
                      className="label-small fill-text-light"
                    >
                      {dayOfWeek}
                    </Text>
                    {/* Day number */}
                    <Text
                      x={x}
                      y={-25}
                      textAnchor="middle"
                      verticalAnchor="middle"
                      className={`${weekend ? 'opacity-[0.72]' : ''} fill-text-text label-small  font-medium`}
                    >
                      {dayNumber}
                    </Text>
                  </Group>
                );
              })}

              {/* Grid Column Rectangles */}
              {tickDates.map((date, index) => {
                const x = xScale(date);
                const weekend = isWeekend(date);

                const fillValue = weekend
                  ? 'url(#diagonalStripesGantt)'
                  : 'rgba(235, 237, 239, 0.3)';

                return (
                  <rect
                    // eslint-disable-next-line react/no-array-index-key
                    key={`grid-column-${index}`}
                    x={x - pixelsPerDay / 2 + 0.5}
                    y={0}
                    width={pixelsPerDay - 1}
                    height={innerHeight + 60}
                    fill={fillValue}
                  />
                );
              })}

              {/* Task Bars */}
              {ganttChartData.map((task, index) => {
                const x = xScale(task.startDate) + 0.5;
                const barWidth =
                  xScale(task.endDate) - xScale(task.startDate) - 1;
                const y = yScale(task.label);
                const barHeight = yScale.bandwidth();
                const barPosition = (y || 0) - barHeight / 5;

                const r = barHeight / 2;

                return (
                  // eslint-disable-next-line react/no-array-index-key
                  <Group key={`task-${index}`}>
                    {/* Left stripe */}
                    <rect
                      x={x + 10}
                      y={barPosition}
                      width={2}
                      height={barHeight}
                      fill={colorMappings[chartColor] || ''}
                      fillOpacity={0.5}
                    />
                    {/* Main bar shape with right rounded end */}
                    <path
                      d={`
                        M ${x + 10},${barPosition}
                        H ${x + barWidth - r}
                        A ${r},${r} 0 0 1 ${x + barWidth - r},${barPosition + barHeight}
                        H ${x + 10}
                        V ${barPosition}
                        Z
                      `}
                      fill={colorMappings[chartColor] || ''}
                      fillOpacity={getOpacityValue(task.progress)}
                      stroke="none"
                    />

                    <Text
                      x={x + 30}
                      y={barPosition + barHeight / 2 + 4}
                      className={getTextClassNameAccoringToProgress(
                        task.progress,
                      )}
                    >
                      {generateTaskText(task.textValue, barWidth)}
                    </Text>

                    <Text
                      x={x + barWidth - 40}
                      y={barPosition + barHeight / 2 + 4}
                      className={getTextClassNameAccoringToProgress(
                        task.progress,
                      )}
                    >
                      {`${task.progress}%`}
                    </Text>
                  </Group>
                );
              })}

              <GridRows
                top={yScale.bandwidth() / 2}
                scale={yScale}
                width={timelineWidth + margins.right}
                height={innerHeight}
                strokeDasharray="4 4"
                strokeWidth={1}
                stroke="rgba(235, 237, 239, 0.48)"
                className="[&>*:last-child]:hidden"
              />
            </Group>
          </svg>
        </div>
      </div>
    );
  },
);
