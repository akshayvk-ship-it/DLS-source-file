import { ChevronDownIcon, ChevronUpIcon } from '../Icons';

interface SwitchButtonProps {
  isActive: boolean;
  rowIndex: number;
  handleColumnExpand: (
    e:
      | React.MouseEvent<HTMLButtonElement>
      | React.KeyboardEvent<HTMLButtonElement>,
  ) => void;
}

function SwitchButton({
  isActive,
  rowIndex,
  handleColumnExpand,
}: SwitchButtonProps) {
  const buttonBaseClasses =
    'border-border-border focus:!shadow-border-brand-focus-ring focus:border-border-action-focused bg-50 group block h-full w-full appearance-none rounded border bg-origin-border !outline-none';
  return (
    <div className="relative flex h-6 w-6 items-center justify-center">
      <button
        type="button"
        className={`${buttonBaseClasses} ${isActive ? '!border-border-action-focused bg-fill-action-light' : ''}
        `}
        onClick={handleColumnExpand}
        data-testid={`expandable-switch-btn-${rowIndex}`}
      >
        <span
          className="group-hover:[&_path]:fill-icon-action absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          tabIndex={-1}
          role="none"
        >
          {isActive ? (
            <ChevronUpIcon
              width={16}
              height={16}
              className="[&>path]:fill-icon-action"
            />
          ) : (
            <ChevronDownIcon width={16} height={16} />
          )}
        </span>
      </button>
    </div>
  );
}

export default SwitchButton;
