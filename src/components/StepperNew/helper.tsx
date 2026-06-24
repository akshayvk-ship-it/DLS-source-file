import TickIcon from './Icons/TickIcon';
import ErrorIcon from './Icons/ErrorIcon';

export type StepType = 'failed' | 'non-visited' | 'visiting' | 'visited';

export interface Step {
  title?: string;
  subtext?: string;
  description?: string | React.JSX.Element;
}

export const colors: Record<
  'progress' | 'active' | 'idle' | 'failed',
  { bg: `bg-${string}`; border?: `border-${string}` }
> = {
  progress: {
    bg: 'bg-fill-fill',
    border: 'border-border-action border',
  },
  active: {
    bg: 'bg-fill-action',
  },
  idle: {
    bg: 'bg-fill-fill',
    border: 'border-border-disabled border',
  },
  failed: {
    bg: 'bg-fill-error',
  },
};

export interface RenderCircleParams {
  color: `bg-${string}`;
  content: 'visiting' | 'tick' | 'idle' | 'error';
  className?: string;
}

export function renderCircle({
  color,
  content,
  className,
}: RenderCircleParams) {
  let children = <> </>;

  switch (content) {
    case 'error':
      children = <ErrorIcon className="h-fit w-fit" />;
      break;
    case 'tick':
      children = <TickIcon className="h-fit w-fit" />;
      break;
    default:
      children = <> </>;
      break;
  }

  return (
    <div
      className={`${className ?? ''} ${color} ${content === 'visiting' ? 'border-border-action border-4' : ''}
      ${content === 'idle' ? 'border-border-disabled border-4' : ''} grid h-6 w-6 min-w-6 place-items-center rounded-full`}
    >
      {children}
    </div>
  );
}

export interface RenderLineParams {
  color: `border-${string}` | undefined;
  length?: number;
  thickness?: number;
}

export function renderLine({ color, thickness = 1 }: RenderLineParams) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="w-auto"
      height={thickness}
      fill="none"
      className={`${color}`}
    >
      <line
        x1={0}
        y1={0}
        x2="100%"
        y2={0}
        stroke="currentColor"
        strokeWidth={thickness}
      />
    </svg>
  );
}

export function getStepType(
  index: number,
  currStep: number,
  failed?: number | number[],
): StepType {
  if (
    (Number.isInteger(failed) && index === failed) ||
    (Array.isArray(failed) && failed.includes(index))
  ) {
    return 'failed';
  }
  if (index < currStep) {
    return 'visited';
  }
  if (index === currStep) {
    return 'visiting';
  }
  return 'non-visited';
}
