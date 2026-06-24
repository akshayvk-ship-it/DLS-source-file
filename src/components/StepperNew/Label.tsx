import { Step } from './helper';

interface Props {
  step: Step;
  color: {
    title: string;
    subtext: string;
    description: string;
  };
  className?: string;
}

function Label({ step, color, className = '' }: Props) {
  return (
    <div
      className={` ${className} mt-2 flex max-w-64 translate-x-[calc(-1*50%+0.75rem)] flex-col items-center`}
    >
      {step.title && (
        <span
          className={`label-small font-semibold ${color.title} text-center`}
        >
          {step.title}
        </span>
      )}
      {step.subtext && (
        <span
          className={`label-medium font-semibold ${color.subtext} mt-1 text-center`}
        >
          {step.subtext}
        </span>
      )}
      {step.description && (
        <span className={`label-small ${color.description} mt-0.5 text-center`}>
          {step.description}
        </span>
      )}
    </div>
  );
}

export default Label;
