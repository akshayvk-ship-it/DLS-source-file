import { ModalHeaderProps, HeaderContentAlignment } from './types';

/**
 * `ModalHeader` is a modular header component that can be used inside the main Modal component.
 *
 * It provides a flexible header section with customizable separation line and alignment.
 * The header automatically inherits alignment settings from the Modal context.
 *
 * @component
 * @example
 * // Basic usage with title and subtitle
 * <ModalHeader>
 *   <ModalTitle>Modal Title</ModalTitle>
 *   <ModalSubTitle>Optional subtitle text</ModalSubTitle>
 * </ModalHeader>
 *
 * @example
 * // Without separation line
 * <ModalHeader separationLine={false}>
 *   <ModalTitle>No Line Header</ModalTitle>
 * </ModalHeader>
 */
export function ModalHeader({
  children,
  separationLine = true,
  headerIcon,
  headerAlignment = 'center',
  className = '',
}: Readonly<ModalHeaderProps>) {
  return (
    <div
      className={`flex flex-col gap-4 p-6 ${className} ${
        separationLine ? 'border-border-border-light border-b' : ''
      } ${
        headerAlignment === ('center' as HeaderContentAlignment)
          ? 'items-center text-center'
          : 'items-start text-left'
      }`}
    >
      {headerIcon}
      {children}
    </div>
  );
}

/**
 * `ModalTitle` is a title component for displaying the main heading text in a modal header.
 *
 * Uses the heading-3-semibold typography style with dark text color.
 *
 * @component
 * @example
 * // Basic title usage
 * <ModalTitle>Confirmation Required</ModalTitle>
 */
export function ModalTitle({
  children,
  className = '',
  id,
}: Readonly<{ children: React.ReactNode; className?: string; id?: string }>) {
  return (
    <div id={id} className={`heading-3-semibold text-text-dark ${className}`}>
      {children}
    </div>
  );
}

/**
 * `ModalSubTitle` is a subtitle component for displaying additional descriptive text in a modal header.
 *
 * Uses the paragraph-small typography style with text-text-text class for secondary information.
 *
 * @component
 * @example
 * // Basic subtitle usage
 * <ModalSubTitle>This action cannot be undone</ModalSubTitle>
 */
export function ModalSubTitle({
  children,
  className = '',
  id,
}: Readonly<{ children: React.ReactNode; className?: string; id?: string }>) {
  return (
    <div id={id} className={`paragraph-small text-text-text ${className}`}>
      {children}
    </div>
  );
}
