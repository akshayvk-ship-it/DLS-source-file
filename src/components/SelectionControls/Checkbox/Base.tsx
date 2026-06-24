import React, {
  ChangeEvent,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { Size, getSizes } from '../helper';

export interface CheckboxProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'children' | 'size'
  > {
  indeterminate?: boolean;
  size: Size;
  onChange: Exclude<
    React.InputHTMLAttributes<HTMLInputElement>['onChange'],
    undefined
  >;
  checked: boolean;
  checkIconStyle?: React.CSSProperties;
  dataTestId?: string;
  checkIconClassName?: string;
  checkboxWrapperClassName?: string;
}

export const CheckboxBase = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      indeterminate,
      checked,
      size,
      dataTestId,
      checkIconStyle,
      checkIconClassName,
      checkboxWrapperClassName = '',
      ...props
    }: CheckboxProps,
    ref,
  ) => {
    const innerRef = useRef<HTMLInputElement>(null);
    const tickWrapperRef = useRef<HTMLSpanElement>(null);
    const [isChangeEventHappened, setIsChangeEventHappened] =
      useState(!indeterminate);

    useEffect(() => {
      if (indeterminate) {
        setIsChangeEventHappened(false);
        innerRef.current!.indeterminate = true;
      } else {
        setIsChangeEventHappened(true);
      }
    }, [indeterminate]);

    useImperativeHandle(ref, () => innerRef.current!);

    const checkIcon = (
      <svg
        width={size === 'lg' ? '10' : '9'}
        height={size === 'lg' ? '8' : '7'}
        viewBox="0 0 10 8"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M8.84386 0.663771C9.13675 0.956664 9.13675 1.43154 8.84386 1.72443L3.68313 6.88515C3.39103 7.17725 2.91772 7.17816 2.62451 6.88718L0.317154 4.59744C0.0231403 4.30567 0.0213207 3.8308 0.31309 3.53679C0.604858 3.24277 1.07973 3.24095 1.37374 3.53272L3.15077 5.29619L7.7832 0.66377C8.07609 0.370877 8.55096 0.370877 8.84386 0.663771Z"
          fill="#F15701"
          className={`${checkIconClassName} fill-icon-action            
            ${props.disabled ? 'fill-icon-disabled' : ''}              
          `}
        />
      </svg>
    );

    const intermediateIcon = (
      <svg
        width={size === 'lg' ? '12' : '10'}
        height="2"
        viewBox="0 0 12 2"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M0.875 1C0.875 0.585786 1.21079 0.25 1.625 0.25H10.375C10.7892 0.25 11.125 0.585786 11.125 1C11.125 1.41421 10.7892 1.75 10.375 1.75H1.625C1.21079 1.75 0.875 1.41421 0.875 1Z"
          fill="#F15701"
          className={`fill-icon-action            
            ${props.disabled ? 'fill-icon-disabled' : ''}              
          `}
        />
      </svg>
    );

    const iconClickHandler = () => {
      if (props.disabled) return;

      const current = innerRef?.current;
      if (!current) return;

      const isLabelNotPresent = !(current.labels && current.labels.length);
      if (isLabelNotPresent) {
        current.click?.();
        current.focus?.();
      }
    };

    const changeEventHandler = (e: ChangeEvent<HTMLInputElement>) => {
      setIsChangeEventHappened(true);
      props?.onChange(e);
    };

    return (
      <div className={`${checkboxWrapperClassName} relative h-fit w-fit`}>
        <input
          {...props}
          type="Checkbox"
          className={`${props.className ?? ''} block ${getSizes(size).width}  border-border-border
          hover:border-border-action focus:!shadow-border-brand-focus-ring focus:border-border-action-focused disabled:!border-border-disabled disabled:bg-fill-disabled bg-50 appearance-none rounded border bg-origin-border !outline-none focus:shadow-[0px_0px_0px_4px]
        disabled:cursor-not-allowed ${checked ? '!border-border-action bg-fill-action-light' : ''}
            ${!isChangeEventHappened && indeterminate && !props.disabled ? '!bg-fill-action-light !border-border-action' : ''}
          `}
          ref={innerRef}
          onChange={changeEventHandler}
          data-testid={dataTestId}
        />

        <span
          className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 ${checked || !isChangeEventHappened ? 'block' : 'hidden'}`}
          ref={tickWrapperRef}
          style={checkIconStyle}
          onClick={iconClickHandler}
          tabIndex={-1}
          role="none"
        >
          {!isChangeEventHappened && indeterminate ? intermediateIcon : ''}
          {checked && (isChangeEventHappened || !indeterminate)
            ? checkIcon
            : ''}
        </span>
      </div>
    );
  },
);
