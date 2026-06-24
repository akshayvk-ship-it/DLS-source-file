import { NestedMenu } from './types';

/* eslint-disable import/prefer-default-export */
export const flattenArray = (arr: NestedMenu[]) => {
  const result: string[] = [];

  const recurse = (obj: NestedMenu) => {
    Object.keys(obj).forEach((key) => {
      if (Array.isArray(obj[key as keyof NestedMenu]) && key === 'nestedData') {
        const objKey = obj[key];
        if (
          objKey &&
          Array.isArray(obj[key as keyof NestedMenu]) &&
          objKey.length > 0
        ) {
          objKey.forEach((element) => {
            if (typeof element === 'object' && !Array.isArray(element)) {
              recurse(element);
            } else {
              result.push(element as unknown as string);
            }
          });
        }
      } else if (
        typeof obj[key as keyof NestedMenu] === 'object' &&
        obj[key as keyof NestedMenu] !== null &&
        key === 'nestedData'
      ) {
        recurse(obj[key] as unknown as NestedMenu);
      } else if (key === 'activeElementValue') {
        result.push(obj[key]);
      }
    });
  };

  arr.forEach((item) => recurse(item));
  return result;
};
