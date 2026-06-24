/**
 * Props for the FooterWithCopyright component.
 */
export interface FooterWithCopyrightProps {
  /**
   * Optional child elements to render inside the footer instead of the default
   * copyright/rights text content. When provided, `copyrightText` and `rightsText`
   * will not be rendered.
   */
  children?: React.ReactNode;

  /**
   * Additional CSS class names to apply to the outermost wrapper `div`.
   * @default ''
   */
  wrapperClassName?: string;

  /**
   * Toggles between dark and light mode styling.
   * - `true` — applies a dark background (`#171717`) and light text (`text-text-on-fill`)
   * - `false` — applies a light background (`bg-fill-fill`) and dark text (`text-text-text`)
   * @default false
   */
  isDarkMode?: boolean;

  /**
   * Additional CSS class names to apply to both the copyright and rights text `span` elements.
   * @default ''
   */
  textClassName?: string;

  /**
   * The copyright owner/year string displayed after the `©` symbol.
   * When empty or not provided, the copyright `span` is not rendered.
   * @example '2024 MyCompany'
   * @default ''
   */
  copyrightText?: string;

  /**
   * The rights statement string displayed alongside the copyright text.
   * When empty or not provided, the rights `span` is not rendered.
   * @example 'All rights reserved.'
   * @default ''
   */
  rightsText?: string;

  /**
   * Additional CSS class names to apply to the inner `div` that wraps
   * the copyright and rights text `span` elements.
   * @default ''
   */
  textWrapperClassName?: string;
}
