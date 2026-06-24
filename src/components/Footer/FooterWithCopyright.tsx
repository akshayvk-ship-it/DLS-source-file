/* eslint-disable import/prefer-default-export */
import { forwardRef } from 'react';
import { FooterWithCopyrightProps } from './types';

/**
 * `FooterWithCopyright` is a flexible footer component that displays copyright
 * and rights information with built-in support for dark/light mode theming based on isDarkMode.
 *
 * It accepts optional `children` to fully override the default text content,
 * or can be configured via `copyrightText` and `rightsText` props to render
 * a standard copyright notice.
 *
 * @component
 * @example
 * // Basic usage with copyright text
 * <FooterWithCopyright
 *   copyrightText="2026 MyCompany"
 *   rightsText="All rights reserved."
 * />
 *
 * @example
 * // Dark mode enabled
 * <FooterWithCopyright
 *   isDarkMode={true}
 *   copyrightText="2026 MyCompany"
 *   rightsText="All rights reserved."
 * />
 *
 * @example
 * // With custom children overriding default content
 * <FooterWithCopyright>
 *   <span>Custom Footer Content</span>
 * </FooterWithCopyright>
 *
 * @example
 * // With custom class names for fine-grained styling control
 * <FooterWithCopyright
 *   wrapperClassName="wrapper-class"
 *   textWrapperClassName="text-wrapper-class"
 *   textClassName="text-class"
 *   copyrightText="2026 MyCompany"
 *   rightsText="All rights reserved."
 * />
 */
export const FooterWithCopyright = forwardRef<
  HTMLDivElement,
  FooterWithCopyrightProps
>(
  (
    {
      children,
      wrapperClassName = '',
      isDarkMode = false,
      textClassName = '',
      copyrightText = '',
      rightsText = '',
      textWrapperClassName = '',
    }: FooterWithCopyrightProps,
    ref,
  ) => (
    <div
      className={`${isDarkMode ? 'bg-[#171717]' : 'bg-fill-fill'} h-18 flex min-w-full items-center justify-center ${wrapperClassName}`}
      ref={ref}
    >
      {children || (
        <div className={`flex gap-4 ${textWrapperClassName}`}>
          {copyrightText && (
            <span
              className={`${textClassName} paragraph-extra-small ${isDarkMode ? 'text-text-on-fill' : 'text-text-text'}`}
            >
              &copy; {copyrightText}
            </span>
          )}
          {rightsText && (
            <span
              className={`${textClassName} paragraph-extra-small ${isDarkMode ? 'text-text-on-fill' : 'text-text-text'}`}
            >
              {rightsText}
            </span>
          )}
        </div>
      )}
    </div>
  ),
);
