import Asterisk from './Label/Asterisk';

interface MandatoryAsteriskProps {
  className?: string;
  size?: number;
}

function MandatoryAsterisk({
  className = '',
  size = 5,
}: Readonly<MandatoryAsteriskProps>) {
  return (
    <sup
      aria-hidden="true"
      className={`
        text-text-error
        relative
        mx-0.5
        leading-none
        ${className}
      `}
    >
      <Asterisk height={size} width={size} />
    </sup>
  );
}

export default MandatoryAsterisk;
