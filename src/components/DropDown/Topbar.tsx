import { Button } from '../Button';

interface TopBarProps {
  count: number;
  handleClear: () => void;
  handleSelectAll: () => void;
}

export default function TopBar({
  count,
  handleClear,
  handleSelectAll,
}: TopBarProps) {
  const btnProps = {
    size: 'sm',
    hierarchy: 'Tertiary Button',
    type: 'button',
  } as const;

  return (
    <div className="bg-fill-fill sticky top-0 z-10 flex justify-between pb-2 pt-4">
      <span className="label-medium text-text-light pl-2 font-normal">
        Selected ({count})
      </span>
      <div className="flex space-x-4">
        <Button
          {...btnProps}
          label="De-select all"
          onClick={handleClear}
          dataTestId="deSelectAllBtn"
        />
        <Button
          {...btnProps}
          label="Select all"
          onClick={handleSelectAll}
          dataTestId="selectAllBtn"
        />
      </div>
    </div>
  );
}
