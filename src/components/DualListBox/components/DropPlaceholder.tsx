import { DualListBoxOption } from '../types';

export interface DropPlaceholderProps {
  options: DualListBoxOption[];
  className?: string;
}

export function DropPlaceholder({
  options,
  className = '',
}: Readonly<DropPlaceholderProps>) {
  return options?.length > 0
    ? options?.map((option) => (
        <div
          key={`${option.uniqueId}-placeholder`}
          className={`bg-fill-disabled text-text-disabled flex h-10 w-full items-center rounded-lg opacity-60 transition-all duration-200 ${className}`}
        >
          <div className="w-6" />
          <p className="label-medium">{option.label}</p>
        </div>
      ))
    : null;
}
