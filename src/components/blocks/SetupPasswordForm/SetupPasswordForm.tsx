/* eslint-disable import/prefer-default-export */
import type { JSX, FormEventHandler, RefAttributes } from 'react';
import { InputWithBaseProps } from '../../Input/InputWithBase';
import { LabelToolTipProps } from '../../Input/Label';
import { Button, ButtonProps } from '../../Button/Button';
import { PasswordInput } from '../../Input/PasswordInput';
import PasswordStrengthChecker from '../../Input/PasswordStrengthChecker';

interface PasswordProps
  extends Omit<InputWithBaseProps, 'type'>,
    LabelToolTipProps {
  label: string | React.ReactNode;
  labelClassName?: string;
  helperText?: string;
  showErrorHelperText?: string;
  isShowTextActive?: boolean;
  customStrengthChecker?: JSX.Element;
  showPasswordStrength?: boolean;
  suffixTabIndex?: number;
  wrapperClassName?: string;
  suffixIconsWrapperClassName?: string;
  suffixIconProps?: React.SVGAttributes<HTMLOrSVGElement>;
}

interface Props {
  handleSubmit: FormEventHandler<HTMLFormElement>;
  title: string;
  passwordProps: PasswordProps;
  confirmPasswordProps: PasswordProps;
  oldPasswordProps?: PasswordProps;
  subTitle?: string;
  loginButtonProps?: ButtonProps & RefAttributes<HTMLButtonElement>;
  wrapperClassName?: string;
  passwordStrengthChecker?: boolean;
}

export function SetupPasswordForm({
  handleSubmit,
  title,
  confirmPasswordProps,
  passwordProps,
  oldPasswordProps,
  subTitle,
  loginButtonProps,
  wrapperClassName,
  passwordStrengthChecker = true,
}: Props) {
  return (
    <form
      onSubmit={handleSubmit}
      className={`flex min-w-[408px] flex-col ${wrapperClassName}`}
    >
      <h2 className="text-text-dark heading-2 mb-1 font-semibold">{title}</h2>
      {subTitle && (
        <p className="text-text-light paragraph-regular mb-10 whitespace-pre-wrap">
          {subTitle}
        </p>
      )}

      <div className="flex max-w-[408px] flex-col gap-4">
        {oldPasswordProps && <PasswordInput {...oldPasswordProps} />}

        <div className="flex max-w-[408px] flex-col gap-4">
          <PasswordInput {...passwordProps} />
          {passwordStrengthChecker && (
            <PasswordStrengthChecker value={passwordProps.value} />
          )}
        </div>

        <PasswordInput {...confirmPasswordProps} />
      </div>

      <Button
        type="submit"
        className="mb-4 mt-10 w-full"
        hierarchy="Primary"
        size="lg"
        {...loginButtonProps}
      />
    </form>
  );
}
