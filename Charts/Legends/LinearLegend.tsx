import {
  useState,
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
  useCallback,
  useMemo,
} from 'react';
import { Checkbox } from '../../SelectionControls/Checkbox';
import { ToolTip } from '../../ToolTip';
import { InfoWithBorderIcon } from '../../Icons';
import PatternLegendIcon from './PatternLegendIcon';
import './LinearLegend.css';
import hexToRgb from './helper';

export type LinearLegendData = {
  label: string;
  description?: string;
  innerColor?: string;
  outerColor?: string;
  borderColor?: string;
  opacity?: number;
  isStylePrediction?: boolean;
  color?: string;
  checked?: boolean;
  toolTipTitle?: string;
  toolTipContent?: JSX.Element | string;
  customLegendIcon?: JSX.Element;
};

export type LinearLegendProps = {
  isOutlined: boolean;
  isSelectable: boolean;
  allowAllUnselected?: boolean;
  individualItemOutline?: boolean;
  labelTextClassName?: string;
  descriptionClassName?: string;
  globalOuterColor?: string;
  isIconNestedSquare?: boolean;
  globalLegendColor?: string;
  legendData: LinearLegendData[];
  isFilledWhenSelected?: boolean;
  isFilledWhenNotSelected?: boolean;
  wrapperClassName?: string;
  dataTestId?: string;
  onLegendChange?: (selectedLegends: string[]) => void;
  showToolTip?: boolean;
};

export type LegendItemProps = {
  legend: LinearLegendData & { uniqueId: string };
  isSelectable: boolean;
  globalLegendColor: string;
  opacity?: number;
  checked: boolean;
  isStylePrediction?: boolean;
  onCheckboxChange: (uniqueId: string) => void;
  globalOuterColor?: string;
  isIconNestedSquare?: boolean;
  labelTextClassName?: string;
  descriptionClassName?: string;
  innerColor?: string;
  outerColor?: string;
  borderColor?: string;
  showToolTip?: boolean;
  isFilledWhenSelected?: boolean;
  isFilledWhenNotSelected?: boolean;
  customLegendIcon?: JSX.Element;
};

function LegendItem({
  legend,
  labelTextClassName = '',
  innerColor,
  outerColor,
  opacity = 1,
  globalOuterColor,
  borderColor,
  isIconNestedSquare,
  descriptionClassName = '',
  isSelectable,
  isFilledWhenSelected = true,
  isFilledWhenNotSelected = true,
  globalLegendColor,
  isStylePrediction = false,
  checked,
  showToolTip = false,
  onCheckboxChange,
  customLegendIcon,
}: Readonly<LegendItemProps>) {
  const legendColor = legend.color ?? globalLegendColor;
  const effectiveBorderColor: string = String(
    borderColor ?? legendColor ?? globalLegendColor ?? 'transparent',
  );

  const legendColorRgb = hexToRgb(legendColor || '#F15701');

  const getCheckboxWrapperClasses = () => {
    if (checked) {
      return isFilledWhenSelected
        ? 'checked-fill checked-icon-unfill'
        : 'checked-unfill checked-icon-fill';
    }
    return isFilledWhenNotSelected ? 'unchecked-fill' : 'unchecked-unfill';
  };

  if (isSelectable) {
    return (
      <Checkbox
        checkboxWrapperClassName={`legend-checkbox-override ${getCheckboxWrapperClasses()} ml-3 ${legend.description ? 'mt-0' : 'my-2'}`}
        checkIconClassName="!fill-fill-fill"
        checkIconStyle={
          {
            '--legend-color': legendColor,
          } as React.CSSProperties
        }
        style={
          {
            '--legend-color': legendColor,
            '--legend-color-rgb': legendColorRgb,
          } as React.CSSProperties
        }
        id={`legend-${legend.uniqueId}`}
        checked={checked}
        onChange={() => onCheckboxChange(legend.uniqueId)}
        text={legend.label}
        textClassName={labelTextClassName}
        supportText={legend.description}
        supportTextClassName={descriptionClassName}
        labelClassName={`${labelTextClassName} ${legend.description ? 'my-2' : ''} [&>div:last-child>span]:!label-small [&>div:last-child>span]:!text-text-text ${!showToolTip ? 'mr-4' : ''}`}
        size="sm"
      />
    );
  }

  if (customLegendIcon) {
    return (
      <div className="flex">
        <div className="ml-3 mr-2 mt-[0.625rem] self-start">
          {customLegendIcon}
        </div>
        <div className={`my-2 flex flex-col ${!showToolTip ? 'mr-4' : ''}`}>
          <p className={`${labelTextClassName} paragraph-small text-text-text`}>
            {legend.label}
          </p>
          {legend.description && (
            <p
              className={`${descriptionClassName} heading-6-semibold text-text-text`}
            >
              {legend.description}
            </p>
          )}
        </div>
      </div>
    );
  }

  let legendIcon;
  if (isIconNestedSquare) {
    legendIcon = (
      <div className="relative my-2.5 ml-3 mr-4">
        <div
          className="h-12 w-12 rounded"
          style={{
            backgroundColor: outerColor ?? globalOuterColor,
            opacity,
          }}
        >
          <div
            className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded"
            style={{
              backgroundColor: innerColor ?? globalLegendColor,
              opacity,
            }}
          />
        </div>
      </div>
    );
  } else if (isStylePrediction === undefined || !isStylePrediction) {
    legendIcon = (
      <div
        className={`ml-3 mr-2 rounded border border-solid ${
          legend.description ? 'my-3 h-4 w-4 self-start' : 'my-2.5 h-3 w-3'
        }`}
        style={{
          backgroundColor: legendColor ?? globalLegendColor,
          opacity,
          borderColor: effectiveBorderColor,
        }}
      />
    );
  } else {
    legendIcon = (
      <PatternLegendIcon
        className="ml-3 mr-2"
        size={16}
        borderColor={effectiveBorderColor}
        color={legendColor ?? globalLegendColor}
        opacity={opacity}
      />
    );
  }

  return (
    <>
      {legendIcon}
      <div className={`my-2 flex flex-col ${!showToolTip ? 'mr-4' : ''}`}>
        <p className={`${labelTextClassName} paragraph-small text-text-text`}>
          {legend.label}
        </p>
        {legend.description && (
          <p
            className={`${descriptionClassName} heading-6-semibold text-text-text`}
          >
            {legend.description}
          </p>
        )}
      </div>
    </>
  );
}

export const LinearLegend = forwardRef<HTMLDivElement, LinearLegendProps>(
  (
    {
      isOutlined,
      isSelectable,
      allowAllUnselected = true,
      globalOuterColor = '#F15701',
      isIconNestedSquare,
      labelTextClassName = '',
      individualItemOutline = false,
      isFilledWhenSelected = true,
      isFilledWhenNotSelected = true,
      descriptionClassName = '',
      globalLegendColor = '#F15701',
      legendData,
      wrapperClassName = '',
      showToolTip = false,
      dataTestId,
      onLegendChange,
    },
    ref,
  ) => {
    const [legendDataWithId, setLegendDataWithId] = useState<
      (LinearLegendData & { uniqueId: string })[]
    >([]);
    const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>(
      {},
    );

    const [isWrapped, setIsWrapped] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useImperativeHandle(ref, () => containerRef.current!, []);

    useEffect(() => {
      const newDataWithIds = legendData.map((legend, index) => ({
        ...legend,
        uniqueId: `${legend.label}-${index}`,
      }));
      setLegendDataWithId(newDataWithIds);
    }, [legendData]);

    useEffect(() => {
      const initialCheckedItems = () => {
        const items: Record<string, boolean> = {};
        legendDataWithId.forEach((legend) => {
          items[legend.uniqueId] = legend.checked !== false;
        });
        return items;
      };

      setCheckedItems(initialCheckedItems);
    }, [legendDataWithId]);

    const handleCheckboxChange = useCallback(
      (uniqueId: string) => {
        const selectedCount = Object.values(checkedItems).filter(
          (isChecked) => isChecked,
        ).length;
        if (
          allowAllUnselected !== true &&
          selectedCount === 1 &&
          checkedItems[uniqueId]
        ) {
          return;
        }

        setCheckedItems((prev) => {
          const newCheckedItems = {
            ...prev,
            [uniqueId]: !prev[uniqueId],
          };

          const selectedLegends = Object.entries(newCheckedItems)
            .filter(([, isChecked]) => isChecked)
            .map(([id]) => {
              const found = legendDataWithId.find((l) => l.uniqueId === id);
              return found?.label ?? id;
            });
          onLegendChange?.(selectedLegends);

          return newCheckedItems;
        });
      },
      [onLegendChange, legendDataWithId, allowAllUnselected, checkedItems],
    );

    const checkIfWrapped = useCallback(() => {
      if (containerRef.current) {
        const container = containerRef.current;
        const firstChild = container.firstElementChild as HTMLElement;

        if (firstChild) {
          const firstChildTop = firstChild.offsetTop;
          const lastChild = container.lastElementChild as HTMLElement;
          const lastChildTop = lastChild.offsetTop;
          setIsWrapped(firstChildTop !== lastChildTop);
        }
      }
    }, []);

    useEffect(() => {
      checkIfWrapped();
      window.addEventListener('resize', checkIfWrapped);

      return () => window.removeEventListener('resize', checkIfWrapped);
    }, [checkIfWrapped, legendData]);

    const containerClassName = useMemo(() => {
      const baseClasses = `${wrapperClassName} flex flex-wrap justify-center gap-y-2`;
      const outlinedClasses =
        isOutlined && !isWrapped && !individualItemOutline
          ? 'border-border-border-light divide-border-border-light divide-x rounded-lg border'
          : '';
      return `${baseClasses} ${outlinedClasses}`.trim();
    }, [wrapperClassName, isOutlined, isWrapped, individualItemOutline]);

    return (
      <div
        ref={containerRef}
        data-testid={dataTestId}
        className={`${containerClassName} w-fit`}
      >
        {legendDataWithId.map((legend) => (
          <div
            key={legend.uniqueId}
            className={`flex items-center ${individualItemOutline ? 'border-border-border-light rounded-lg border' : ''}`}
          >
            <LegendItem
              legend={legend}
              opacity={legend.opacity ?? 1}
              isStylePrediction={legend.isStylePrediction ?? false}
              labelTextClassName={labelTextClassName}
              descriptionClassName={descriptionClassName}
              innerColor={legend.innerColor}
              outerColor={legend.outerColor}
              borderColor={legend.borderColor}
              isFilledWhenSelected={isFilledWhenSelected}
              isFilledWhenNotSelected={isFilledWhenNotSelected}
              isSelectable={isSelectable}
              globalLegendColor={globalLegendColor}
              globalOuterColor={globalOuterColor}
              showToolTip={showToolTip}
              isIconNestedSquare={isIconNestedSquare}
              checked={checkedItems[legend.uniqueId] || false}
              onCheckboxChange={() => handleCheckboxChange(legend.uniqueId)}
              customLegendIcon={legend.customLegendIcon}
            />
            {showToolTip && (
              <ToolTip
                iconToolTip={
                  <InfoWithBorderIcon className="[&>path]:fill-icon-icon h-3.5 w-3.5" />
                }
                toolTipType="contextual"
                className="ml-1 mr-4"
                classNameToolTip="mb-[5px]"
                placementToolTip="top-center"
                titleToolTip={legend.toolTipTitle ?? ''}
                contentToolTip={legend.toolTipContent ?? ''}
              />
            )}
          </div>
        ))}
      </div>
    );
  },
);
