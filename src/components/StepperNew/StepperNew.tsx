import React from 'react';
import {
  colors,
  renderCircle,
  RenderCircleParams,
  renderLine,
  RenderLineParams,
  Step,
  getStepType,
} from './helper';
import Label from './Label';

export interface StepperNewProps {
  steps: Step[];
  currentStep: number;
  failed?: number | number[];
  className?: string;
  subClassNames?: {
    label?: string;
    circle?: string;
  };
  dataTestId?: string;
  stepClassName?: string;
}

export const StepperNew = React.forwardRef<HTMLDivElement, StepperNewProps>(
  (
    {
      steps,
      currentStep,
      failed = [],
      className = '',
      subClassNames = {
        circle: '',
        label: '',
      },
      dataTestId = '',
      stepClassName = '',
    }: StepperNewProps,
    ref,
  ) => {
    const renderStep = (index: number, step: Step) => {
      let circleParams: RenderCircleParams = {
        color: colors.progress.bg,
        content: 'visiting',
      };
      let lineParams: RenderLineParams | null = {
        color: colors.progress.border,
        length: 112,
      };
      let textColor = {
        title: 'text-text-dark',
        subtext: 'text-text-dark',
        description: 'text-text-text',
      };

      switch (getStepType(index, currentStep, failed)) {
        case 'failed':
          circleParams = { color: colors.failed.bg, content: 'error' };
          lineParams = {
            ...lineParams,
            color: colors.idle.border,
          };
          break;
        case 'visited':
          circleParams = { color: colors.active.bg, content: 'tick' };
          lineParams.color = colors.progress.border;
          break;
        case 'visiting':
          circleParams = { color: colors.progress.bg, content: 'visiting' };
          lineParams = {
            ...lineParams,
            color: colors.idle.border,
          };
          break;
        case 'non-visited':
          textColor = {
            title: 'text-text-light',
            subtext: 'text-text-light',
            description: 'text-text-disabled',
          };
          circleParams = { color: colors.idle.bg, content: 'idle' };
          lineParams = {
            ...lineParams,
            color: colors.idle.border,
          };
          break;
        default:
          break;
      }

      if (index === steps.length - 1) lineParams = null;

      const result = [
        renderCircle({ ...circleParams, className: subClassNames?.circle }),
        lineParams ? renderLine(lineParams) : <> </>,
      ];

      return (
        <div
          className={`${stepClassName} flex flex-col`}
          key={`step${index}`}
          data-testid={dataTestId}
        >
          <div className="flex flex-row items-center">{result}</div>
          <Label
            color={textColor}
            step={step}
            className={subClassNames?.label}
          />
        </div>
      );
    };

    return (
      <div className={` ${className} flex flex-row pl-16 `} ref={ref}>
        {steps.map((step, index) => renderStep(index, step))}
      </div>
    );
  },
);
