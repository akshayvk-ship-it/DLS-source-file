import { SearchInput } from '../../Input';

export interface ListColumnHeaderProps {
  headerText: string;
  showSearchInput: boolean;
  searchName: string;
  placeholder: string;
  filterValue: string;
  onClear: () => void;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  selectedCount: number;
  visibleCount: number;
}

export function ListColumnHeader({
  headerText,
  showSearchInput,
  searchName,
  placeholder,
  filterValue,
  onClear,
  onSearchChange,
  selectedCount,
  visibleCount,
}: Readonly<ListColumnHeaderProps>) {
  return (
    <div className={`flex w-full flex-col ${showSearchInput ? 'gap-2' : ''}`}>
      <h5 className="text-text-text heading-5 font-semibold">{headerText}</h5>
      {showSearchInput && (
        <SearchInput
          label=""
          name={searchName}
          placeholder={placeholder}
          value={filterValue}
          onSuffixClick={onClear}
          onChange={onSearchChange}
        />
      )}
      <p className="label-small text-text-light">
        {`${selectedCount} to ${visibleCount} options selected`}
      </p>
    </div>
  );
}
