import Option from '../Option';
import { OptionContainerProps as Props } from '../helper';

function SingleOptionContainer({
  options,
  selected,
  onChange,
  isNewInteractionStyle = false,
}: Props) {
  return (
    <div className="py-4">
      {options.map((option) => (
        <Option
          selected={option.value === selected}
          option={option}
          key={option.label}
          onClick={() => onChange(option.value)}
          isNewInteractionStyle={isNewInteractionStyle}
        />
      ))}
    </div>
  );
}

export default SingleOptionContainer;
