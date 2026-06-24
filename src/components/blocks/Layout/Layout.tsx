/* eslint-disable import/prefer-default-export */
import './style.css';
import { forwardRef, useEffect } from 'react';
import initTheme from './utils/initTheme';
import Type1 from './Variants/Type1';
import Type2 from './Variants/Type2';
import Type3 from './Variants/Type3';
import Type4 from './Variants/Type4';
import Type5 from './Variants/Type5';
import Type6 from './Variants/Type6';
import TypeDefault from './Variants/TypeDefault';
import { LayoutProps, LayoutVariants } from './utils/types';

const layoutMap: Record<LayoutVariants, React.ElementType> = {
  default: TypeDefault,
  type1: Type1,
  type2: Type2,
  type3: Type3,
  type4: Type4,
  type5: Type5,
  type6: Type6,
};

export const Layout = forwardRef<HTMLDivElement, LayoutProps>((props, ref) => {
  useEffect(() => {
    initTheme();
  }, []);

  const { variant, ...restProps } = props;
  const Component = layoutMap[variant];

  return <Component {...restProps} ref={ref} />;
});

Layout.displayName = 'Layout';
