import { Direction, Step } from './helper';

interface Props {
  step: Step;
  color: {
    title: string;
    subtext: string;
  };
  direction: Direction;
  className?: string;
}

function Label({ step, color, direction, className = '' }: Props) {
  if (!step.title) return <> </>;
  return (
    <div
      className={` ${className} flex flex-col ${direction === 'horizontal' ? 'max-w-32 translate-x-[calc(-1*50%+0.75rem)] items-center' : ''}`}
    >
      {step.title && (
        <span
          className={`label-medium font-semibold ${color.title} ${direction === 'horizontal' ? 'text-center' : ''}`}
        >
          {step.title}
        </span>
      )}
      {step.subtext && (
        <span
          className={`label-small font-normal ${color.subtext} ${direction === 'horizontal' ? 'text-center' : ''}`}
        >
          {step.subtext}
        </span>
      )}
    </div>
  );
}

export default Label;
