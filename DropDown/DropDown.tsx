import Label from './Label/Label';
import { DropDownBase, DropDownBaseProps as BaseProps } from './DropDownBase';

export interface DropDownProps extends BaseProps {
  direction: 'horizontal' | 'vertical';
  title?: string;
  supportText?: string;
  labelClassName?: string;
  dataTestId?: string;
}

export function DropDown({
  title,
  supportText,
  direction,
  labelClassName = '',
  dataTestId = 'dropDownTestId',
  ...baseProps
}: DropDownProps) {
  const dropDownBase = <DropDownBase {...baseProps} dataTestId={dataTestId} />;
  if (!title) return dropDownBase;

  return (
    <div
      className={`flex ${direction === 'horizontal' ? 'flex-row space-x-4' : 'flex-col space-y-2'} w-full`}
      data-testid={dataTestId}
    >
      <Label
        title={title}
        supportText={supportText}
        className={labelClassName}
      />
      {dropDownBase}
    </div>
  );
}
