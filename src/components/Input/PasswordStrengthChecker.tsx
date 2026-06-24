import { useEffect, useState } from 'react';

interface Props {
  value: string;
}

const regexps = {
  upperCase: /[A-Z]/,
  lowerCase: /[a-z]/,
  digit: /[0-9]/,
  symbol: /[-\\#\\$\\@\\%\\&\\*]/,
};

function PasswordStrengthChecker({ value = '' }: Props) {
  const [errorStrength, setErrorStrength] = useState({
    minCharacter: false,
    lowerCase: false,
    upperCase: false,
    digit: false,
    symbol: false,
  });

  const [strengthNumber, setStrengthNumber] = useState(0);

  useEffect(() => {
    const validateStrength = {
      minCharacter: value.length >= 8,
      upperCase: regexps.upperCase.test(value),
      lowerCase: regexps.lowerCase.test(value),
      digit: regexps.digit.test(value),
      symbol: regexps.symbol.test(value),
    };
    setErrorStrength(validateStrength);

    setStrengthNumber(
      Number(validateStrength.minCharacter) +
        Number(validateStrength.digit) +
        Number(validateStrength.lowerCase) +
        Number(validateStrength.upperCase) +
        Number(validateStrength.symbol),
    );
  }, [value]);

  const getClassName = () => {
    if (!value.length) return '';

    if (strengthNumber <= 2) {
      return '[&>div:first-child]:bg-fill-error';
    }

    if (strengthNumber <= 4) {
      return '[&>div:nth-child(-n+2)]:bg-[--yellow-8]';
    }

    return '[&>div]:bg-fill-success';
  };

  const renderBar = (
    <div className={`flex w-36 justify-between ${getClassName()}`}>
      <div className="bg-surface-base mr-0.5 h-1 flex-1 rounded" />
      <div className="bg-surface-base mr-0.5 h-1 flex-1 rounded" />
      <div className="bg-surface-base h-1 flex-1 rounded" />
    </div>
  );

  const renderText = (
    <div className="mt-1 flex h-[1.125rem] [&>span:last-child]:mr-0 [&>span]:mr-0.5">
      <span
        className={`label-small inline-block ${errorStrength.minCharacter ? ' text-text-success font-medium' : 'text-text-light'}`}
      >
        Min 8 Characters,
      </span>
      <span
        className={`label-small inline-block ${errorStrength.lowerCase ? ' text-text-success font-medium' : 'text-text-light'}`}
      >
        1 Lowercase,
      </span>
      <span
        className={`label-small inline-block ${errorStrength.upperCase ? ' text-text-success font-medium' : 'text-text-light'}`}
      >
        1 Uppercase,
      </span>
      <span
        className={`label-small inline-block ${errorStrength.digit ? ' text-text-success font-medium' : 'text-text-light'}`}
      >
        1 Digit,
      </span>
      <span
        className={`label-small inline-block ${errorStrength.symbol ? ' text-text-success font-medium' : 'text-text-light'}`}
      >
        1 Symbol
      </span>
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between">
        <span className="label-medium text-text-text font-medium">
          Password must contain:
        </span>
        {renderBar}
      </div>
      {renderText}
    </div>
  );
}

export default PasswordStrengthChecker;
