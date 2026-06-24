import Option from '../Option';
import TopBar from '../Topbar';
import { IOption, OptionContainerProps as Props } from '../helper';

function MultiOptionContainer({
  options,
  selected,
  onChange,
  isNewInteractionStyle,
}: Props) {
  const isSelected = (option: IOption) => selected.includes(option.value);

  const handleClick = (option: IOption, remove?: boolean) => {
    if (remove)
      onChange(
        (selected as string[]).filter((value) => value !== option.value),
      );
    else onChange([...selected, option.value]);
  };

  const handleTopBarClick = (clear?: boolean) => {
    if (clear) onChange([]);
    else onChange([], true);
  };

  return (
    <>
      <TopBar
        count={selected.length}
        handleClear={() => handleTopBarClick(true)}
        handleSelectAll={() => handleTopBarClick(false)}
      />
      <div className="last:mb-4">
        {options
          .filter((option) => isSelected(option))
          .map((option) => (
            <Option
              selected
              hasCheckbox
              option={option}
              key={option.value}
              onClick={() => handleClick(option, true)}
              isNewInteractionStyle={isNewInteractionStyle}
            />
          ))}
        {selected.length !== 0 && selected.length !== options.length && (
          <div className="bg-border-border-light my-2 min-h-[0.0625rem] w-full" />
        )}
        {options
          .filter((option) => !isSelected(option))
          .map((option) => (
            <Option
              hasCheckbox
              option={option}
              key={option.value}
              onClick={() => handleClick(option)}
              isNewInteractionStyle={isNewInteractionStyle}
            />
          ))}
      </div>
    </>
  );
}

export default MultiOptionContainer;
