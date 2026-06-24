import React from 'react';
import {
  colors,
  Direction,
  renderCircle,
  RenderCircleParams,
  renderLine,
  RenderLineParams,
  Step,
  getStepType,
} from './helper';
import Label from './Label';

export interface StepperProps {
  direction: Direction;
  steps: Step[];
  currStep: number;
  failed?: number | number[];
  className?: string;
  subClassNames?: {
    label?: string;
    circle?: string;
  };
  dataTestId?: string;
}

export const Stepper = React.forwardRef<HTMLDivElement, StepperProps>(
  (
    {
      direction,
      steps,
      currStep,
      failed = [],
      className = '',
      subClassNames = {
        circle: '',
        label: '',
      },
      dataTestId = '',
    }: StepperProps,
    ref,
  ) => {
    const renderStep = (index: number, step: Step) => {
      let circleParams: RenderCircleParams = {
        color: colors.progress.bg,
        content: step.index,
      };
      let lineParams: RenderLineParams | null = {
        color: colors.progress.text,
        direction,
        dashed: false,
        length: direction === 'horizontal' ? 112 : 56,
      };
      let textColor = {
        title: 'text-text-dark',
        subtext: 'text-text-text',
      };

      switch (getStepType(index, currStep, failed)) {
        case 'failed':
          circleParams = { color: colors.failed.bg, content: 'cross' };
          lineParams = { ...lineParams, color: colors.idle.text, dashed: true };
          break;
        case 'visited':
          circleParams = { color: colors.progress.bg, content: 'tick' };
          lineParams.color = colors.progress.text;
          break;
        case 'visiting':
          circleParams = { color: colors.progress.bg, content: index + 1 };
          lineParams = {
            ...lineParams,
            color: colors.progress.text,
            dashed: true,
          };
          break;
        case 'non-visited':
          textColor = {
            title: 'text-text-light',
            subtext: 'text-text-light',
          };
          circleParams = { color: colors.idle.bg, content: index + 1 };
          lineParams = { ...lineParams, color: colors.idle.text, dashed: true };
          break;
        default:
          break;
      }

      // Final step
      if (index === steps.length - 1) lineParams = null;

      const result = [
        renderCircle({ ...circleParams, className: subClassNames?.circle }),
        lineParams ? renderLine(lineParams) : <> </>,
      ];
      return (
        <div
          className={`flex ${direction === 'horizontal' ? 'flex-col space-y-4' : 'flex-row space-x-6'} `}
          key={`step${index}`}
          data-testid={dataTestId}
        >
          <div
            className={`flex ${direction === 'horizontal' ? 'flex-row space-x-2' : 'flex-col space-y-2'} items-center `}
          >
            {result}
          </div>
          <Label
            color={textColor}
            direction={direction}
            step={step}
            className={subClassNames?.label}
          />
        </div>
      );
    };

    return (
      <div
        className={` ${className} flex ${direction === 'horizontal' ? 'flex-row space-x-2 pl-16' : 'flex-col space-y-2'}  `}
        ref={ref}
      >
        {steps.map((step, index) => renderStep(index, step))}
      </div>
    );
  },
);
