/* eslint-disable import/prefer-default-export */
import type { FormEventHandler, JSX, RefAttributes } from 'react';
import {
  InputProps,
  InputWithBaseProps,
  PasswordInput,
  TextInput,
} from '../../Input';
import { LabelToolTipProps } from '../../Input/Label';
import { Button, ButtonProps } from '../../Button/Button';

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
  emailOrUsernameProps: InputProps;
  passwordProps: PasswordProps & RefAttributes<HTMLInputElement>;
  subTitle?: string;
  loginButtonProps?: ButtonProps & RefAttributes<HTMLButtonElement>;
  forgotPasswordButtonProps?: ButtonProps & RefAttributes<HTMLButtonElement>;
  forgotPasswordText?: string;
  wrapperClassName?: string;
}

export function LoginForm({
  handleSubmit,
  title,
  subTitle,
  emailOrUsernameProps,
  passwordProps,
  forgotPasswordText,
  forgotPasswordButtonProps,
  loginButtonProps,
  wrapperClassName = '',
}: Readonly<Props>) {
  return (
    <form
      onSubmit={handleSubmit}
      className={`flex w-full min-w-[400px] max-w-[632px] flex-col gap-10 rounded-3xl px-6 ${wrapperClassName}`}
    >
      <div className="flex flex-col gap-0.5">
        <h2 className="text-text-dark heading-2 font-semibold">{title}</h2>
        {subTitle && (
          <p className="paragraph-regular text-text-dark-pressed">{subTitle}</p>
        )}
      </div>
      <div className="flex flex-col gap-4">
        <TextInput {...emailOrUsernameProps} />

        <PasswordInput {...passwordProps} />

        <Button
          type="button"
          hierarchy="Tertiary Button"
          label={forgotPasswordText}
          size="lg"
          className="flex w-full justify-center"
          {...forgotPasswordButtonProps}
        />
      </div>

      <Button
        type="submit"
        className="w-full"
        hierarchy="Primary"
        size="lg"
        {...loginButtonProps}
      />
    </form>
  );
}
