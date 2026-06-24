import Cross from './Icons/CrossStepper';
import Tick from './Icons/TickStepper';

export type Direction = 'horizontal' | 'vertical';
export type StepType = 'failed' | 'non-visited' | 'visiting' | 'visited';

export interface Step {
  title?: string;
  subtext?: string;
  index: number;
}

export const colors: Record<
  'progress' | 'idle' | 'failed',
  { bg: `bg-${string}`; text: `text-${string}` }
> = {
  progress: {
    bg: 'bg-text-dark',
    text: 'text-text-dark',
  },
  idle: {
    bg: 'bg-text-disabled',
    text: 'text-text-disabled',
  },
  failed: {
    bg: 'bg-fill-error',
    text: 'text-fill-error',
  },
};

export interface RenderCircleParams {
  color: `bg-${string}`;
  content: number | 'tick' | 'cross';
  className?: string;
}

export function renderCircle({
  color,
  content,
  className,
}: RenderCircleParams) {
  let children = <> </>;
  switch (content) {
    case 'cross':
      children = <Cross className="h-2 w-2" />;
      break;
    case 'tick':
      children = <Tick className="h-2 w-2" />;
      break;
    default:
      children = <> {content}</>;
      break;
  }
  return (
    <div
      className={`${className ?? ''} ${color} text-text-on-fill label-small grid h-6 w-6 place-items-center rounded-full font-medium`}
    >
      {children}
    </div>
  );
}

export interface RenderLineParams {
  color: `text-${string}`;
  direction: Direction;
  dashed?: boolean;
  length?: number;
  thickness?: number;
}

export function renderLine({
  color,
  direction,
  dashed,
  length = 56,
  thickness = 2,
}: RenderLineParams) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={direction === 'horizontal' ? length : thickness}
      height={direction === 'horizontal' ? thickness : length}
      fill="none"
      className={`${color}`}
    >
      <line
        x1={0}
        y1={0}
        x2={direction === 'horizontal' ? '100%' : 0}
        y2={direction === 'horizontal' ? 0 : '100%'}
        stroke="currentColor"
        strokeWidth={thickness * 2}
        {...(dashed && { strokeDasharray: 4 })}
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
