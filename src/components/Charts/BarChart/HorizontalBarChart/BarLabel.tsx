import { Text } from '@visx/text';

import { calculateLabelWidth } from './helper';

interface BarLabelProps {
  x: number;
  y: number;
  barWidth: number;
  barHeight: number;
  insideLabel?: string;
  value: number;
  axisBottomTickFormatter?: (v: number) => string;
}

function BarLabel({
  x,
  y,
  barWidth,
  barHeight,
  insideLabel,
  value,
  axisBottomTickFormatter,
}: BarLabelProps) {
  const valueText = axisBottomTickFormatter?.(value) ?? value.toString();
  const insideLabelWidth = calculateLabelWidth(insideLabel ?? '');
  const shouldCombineWithLabel = barWidth === 0;
  const shouldCombineWithValue = insideLabelWidth > barWidth - 16;

  const combinedText = insideLabel
    ? `${insideLabel} (value = ${valueText})`
    : valueText;

  const labelGap = 6;
  const rightLabelX = x + barWidth + labelGap;

  const textClassName = 'label-small fill-text-text';

  if (shouldCombineWithLabel) {
    return (
      <Text
        x={x + 8}
        y={y + barHeight / 2}
        verticalAnchor="middle"
        textAnchor="start"
        className={textClassName}
      >
        {combinedText}
      </Text>
    );
  }

  return (
    <>
      {insideLabel && !shouldCombineWithValue && (
        <Text
          x={x + 8}
          y={y + barHeight / 2}
          verticalAnchor="middle"
          textAnchor="start"
          className={textClassName}
        >
          {insideLabel}
        </Text>
      )}
      <Text
        x={rightLabelX}
        y={y + barHeight / 2}
        textAnchor="start"
        verticalAnchor="middle"
        className={textClassName}
      >
        {shouldCombineWithValue && insideLabel !== undefined
          ? combinedText
          : valueText}
      </Text>
    </>
  );
}

export default BarLabel;
