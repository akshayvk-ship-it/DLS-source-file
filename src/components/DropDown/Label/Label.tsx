interface Props {
  title: string;
  supportText?: string;
  className?: string;
}

function Label({ title, supportText = '', className = '' }: Props) {
  return (
    <div className={`flex w-full flex-col space-y-1 ${className}`}>
      <span className="label-medium text-text-dark font-medium">{title}</span>
      {supportText && (
        <p className="label-medium text-text-text font-normal">{supportText}</p>
      )}
    </div>
  );
}

export default Label;
