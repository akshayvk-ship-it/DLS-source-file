export const determineDirection = (
  first: string,
  last: string,
): 'inc' | 'dec' | 'none' => {
  const firstNum = parseInt(first, 10);
  const lastNum = parseInt(last, 10);

  if (Number.isNaN(firstNum) || Number.isNaN(lastNum)) {
    return 'none';
  }

  if (firstNum < lastNum) {
    return 'inc';
  }
  if (firstNum > lastNum) {
    return 'dec';
  }
  return 'none';
};

export const countUp = (val: number, max: number): string[] => {
  const numberArray: string[] = [];
  for (let i = val; i <= max; i += 1) {
    numberArray.push(i.toString());
  }
  return numberArray;
};

export const countDown = (val: number, max: number): string[] => {
  const numberArray: string[] = [];
  for (let i = val; i >= max; i -= 1) {
    numberArray.push(i.toString());
  }
  return numberArray;
};

export const formatNumberWithCommas = (value: number | string): string => {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (Number.isNaN(num)) return String(value);

  return num.toLocaleString('en-in');
};

export const parseStringValue = (
  value: number | string,
): { numericValue: number; staticSuffix: string } => {
  if (typeof value === 'number') {
    return { numericValue: value, staticSuffix: '' };
  }

  const stringValue = String(value);

  const match = stringValue.match(/^([\d.,]+)([A-Za-z]+)$/);

  if (match && match[1] && match[2]) {
    const numericPart = parseFloat(match[1].replace(/,/g, ''));
    const suffixPart = match[2];

    if (!Number.isNaN(numericPart)) {
      return { numericValue: numericPart, staticSuffix: suffixPart };
    }
  }

  const numericValue = parseFloat(stringValue.replace(/,/g, ''));
  return {
    numericValue: Number.isNaN(numericValue) ? 0 : numericValue,
    staticSuffix: '',
  };
};

export const difference = (
  start: string[],
  end: string[],
  options: { prefix?: string; suffix?: string } = {},
): string[][] => {
  const { prefix, suffix } = options;

  const endReversed = [...end].reverse();
  const startReversed = [...start].reverse();

  const numberColumns: string[][] = [];

  for (let i = 0; i < endReversed.length; i += 1) {
    const endChar = endReversed[i] ?? '';
    const startChar = startReversed[i] ?? '0';

    let columnArray: string[] = [];

    if (endChar === ',' || endChar === '.') {
      columnArray = [endChar];
    } else {
      const endDigit = parseInt(endChar, 10);
      const startDigit = parseInt(startChar, 10);

      if (Number.isNaN(endDigit)) {
        columnArray = [endChar];
      } else if (Number.isNaN(startDigit)) {
        if (endDigit === 0) {
          columnArray = ['1', '0'];
        } else {
          columnArray = countUp(0, endDigit);
        }
      } else {
        // eslint-disable-next-line no-lonely-if
        if (startDigit === endDigit) {
          if (startDigit === 0) {
            columnArray = ['1', '0'];
          } else if (startDigit <= 5) {
            columnArray = [
              startDigit.toString(),
              (startDigit + 1).toString(),
              endDigit.toString(),
            ];
          } else {
            columnArray = [
              startDigit.toString(),
              (startDigit - 1).toString(),
              endDigit.toString(),
            ];
          }
        } else if (startDigit < endDigit) {
          columnArray = countUp(startDigit, endDigit);
        } else {
          columnArray = countDown(startDigit, endDigit);
        }
      }
    }

    numberColumns.push(columnArray);
  }

  const numberDiff = numberColumns.reverse();

  const prefixDiff = prefix ? [['', prefix]] : [];
  const suffixDiff = suffix ? [['', suffix]] : [];

  return [...prefixDiff, ...numberDiff, ...suffixDiff];
};
