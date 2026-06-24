/* eslint-disable import/prefer-default-export */
import { FormEventHandler, RefAttributes } from 'react';
import { Button, ButtonProps } from '../../Button/Button';
import { TextInput } from '../../Input/TextInput';

interface EmailOrUsernameProps {
  label: string;
  value: string;
  placeholder: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: { message?: string };
}

interface Props {
  handleSubmit: FormEventHandler<HTMLFormElement>;
  title: string;
  emailProps: EmailOrUsernameProps;
  subTitle?: string;
  submitButtonProps?: ButtonProps & RefAttributes<HTMLButtonElement>;
  secondaryButtonProps?: ButtonProps & RefAttributes<HTMLButtonElement>;
  wrapperClassName?: string;
}

export function ForgotPasswordForm({
  handleSubmit,
  title,
  emailProps,
  subTitle,
  submitButtonProps,
  secondaryButtonProps,
  wrapperClassName = '',
}: Readonly<Props>) {
  return (
    <form
      onSubmit={handleSubmit}
      className={`flex min-w-[400px] flex-col ${wrapperClassName}`}
    >
      <h2 className="text-text-dark heading-4 font-semibold">{title}</h2>
      {subTitle && (
        <p className="text-text-text label-regular mb-6 mt-1 whitespace-pre-wrap">
          {subTitle}
        </p>
      )}

      <TextInput
        label={emailProps.label}
        type="email"
        name="email"
        value={emailProps.value}
        onChange={emailProps.onChange}
        placeholder={emailProps.placeholder}
        error={!!emailProps.error}
        showErrorHelperText={emailProps.error?.message}
      />

      <Button
        type="submit"
        className="mb-4 mt-10 w-full"
        hierarchy="Primary"
        label={submitButtonProps?.label}
        loading={submitButtonProps?.loading}
        size="lg"
        {...submitButtonProps}
      />
      {secondaryButtonProps && (
        <Button
          className="!border-border-border w-full"
          label={secondaryButtonProps?.label}
          {...secondaryButtonProps}
        />
      )}
    </form>
  );
}
