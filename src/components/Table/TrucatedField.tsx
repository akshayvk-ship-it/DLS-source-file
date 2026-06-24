import { useIsCellOverflowing } from '../hooks/useIsCellOverflowing';

interface TruncatedFieldProps {
  currentCellData: string | number;
  headerRefs: React.RefObject<Map<string, HTMLDivElement>>;
  columnKey: string;
  isTruncated?: boolean;
  setToolTipContent?: React.Dispatch<
    React.SetStateAction<{ content: string; x: number; y: number } | null>
  >;
}

function TruncatedField({
  currentCellData,
  headerRefs,
  columnKey,
  isTruncated = false,
  setToolTipContent,
}: TruncatedFieldProps) {
  const { textRef, isOverflowing } = useIsCellOverflowing(
    headerRefs,
    columnKey,
  );

  const text = (
    <div
      ref={textRef}
      tabIndex={-1}
      className={`label-medium block min-w-0 whitespace-nowrap ${isTruncated ? 'truncate' : ''}`}
      onMouseEnter={
        isOverflowing
          ? (e) => {
              if (!isOverflowing) return;
              const rect = e.currentTarget.getBoundingClientRect();

              setToolTipContent?.({
                content: currentCellData.toString(),
                x: rect.left + rect.width / 2,
                y: rect.top,
              });
            }
          : undefined
      }
      onMouseLeave={
        isOverflowing
          ? () => {
              setToolTipContent?.(null);
            }
          : undefined
      }
    >
      {currentCellData || '-'}
    </div>
  );

  return isTruncated ? text : currentCellData || '-';
}

export default TruncatedField;
