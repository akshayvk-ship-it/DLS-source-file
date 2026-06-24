import { forwardRef, useEffect, useState, useRef, useId } from 'react';
import {
  ModalProps,
  InformationPopupProps,
  ModalWithCustomHeader,
  ModalPosition,
} from './types';
import { Button } from '../Button';
import { CloseIcon } from '../Icons';
import { ModalHeader, ModalSubTitle, ModalTitle } from './ModalComponents';
import useIsMobile from '../hooks/useInMobile';
import { InformationPopup } from './InformationPopup';
import { SideImage } from './SideImage';

/**
 * `Modal` is a flexible, accessible dialog component that supports two variants:
 *
 * - **`default`** — full modal with header (title/subtitle or custom), body, and footer actions.
 *   Supports icon/image headers, close button or icon, configurable backdrop, and screen position.
 * - **`information`** — lightweight popup for status messages, confirmations, or timed notifications.
 *
 * On mobile screens the default variant renders as a bottom sheet with an enter/exit animation.
 *
 * @remarks
 * When `closeModalType` is `'button'`, the close button is always placed on the left and
 * `footerButtonsAlignment` is forced to `'right'` — the `'left'` option has no effect in that case.
 * `closeButtonLabel` and `closeBtnProps` are not available on the `information` variant.
 *
 * @component
 * @example
 * // Basic modal with default header (title and subtitle)
 * <Modal
 *   open={isOpen}
 *   onModalClose={() => setIsOpen(false)}
 *   title="Confirm Action"
 *   subTitle="Are you sure you want to proceed?"
 *   primaryButtonLabel="Confirm"
 *   onPrimaryButtonClick={handleConfirm}
 *   secondaryButtonLabel="Cancel"
 *   onSecondaryButtonClick={handleCancel}
 * >
 *   <div className="p-6">
 *     <p>This action cannot be undone.</p>
 *   </div>
 * </Modal>
 *
 * @example
 * // Modal with custom header content
 * // Note: When using a custom header, take care to maintain accessibility. Ensure that interactive
 * // elements like buttons, inputs, or breadcrumbs have proper `aria-label` attributes
 * // and your custom header provides a clear, accessible structure for screen readers.
 * <Modal
 *   open={isOpen}
 *   onModalClose={() => setIsOpen(false)}
 *   header={
 *     <div className="flex items-center gap-3">
 *       <WarningIcon />
 *       <div>
 *         <h3 className="text-lg font-semibold">Custom Header</h3>
 *         <p className="text-sm text-gray-600">With custom content</p>
 *       </div>
 *     </div>
 *   }
 *   primaryButtonLabel="Proceed"
 *   onPrimaryButtonClick={handleProceed}
 * >
 *   <div className="p-6">
 *     <p>This modal uses a custom header instead of title/subtitle.</p>
 *   </div>
 * </Modal>
 *
 * @example
 * // Advanced modal with icon header and custom styling
 * <Modal
 *   open={isOpen}
 *   onModalClose={() => setIsOpen(false)}
 *   closeModalType="icon"
 *   headerAlignment="left"
 *   modalHeaderIconOrImage={{
 *     variant: 'icon',
 *     icon: <WarningIcon />
 *   }}
 *   title="Delete Item"
 *   subTitle="This will permanently remove the item"
 *   primaryButtonLabel="Delete"
 *   onPrimaryButtonClick={handleDelete}
 *   secondaryButtonLabel="Cancel"
 *   onSecondaryButtonClick={handleCancel}
 *   headerSeparationLine={false}
 * >
 *   <div className="p-6">
 *     <p>Are you sure you want to delete this item?</p>
 *   </div>
 * </Modal>
 *
 * @example
 * // Modal with image header
 * <Modal
 *   open={isOpen}
 *   onModalClose={() => setIsOpen(false)}
 *   modalHeaderIconOrImage={{
 *     variant: 'image',
 *     image: '/path/to/header-image.jpg'
 *   }}
 *   title="Welcome"
 *   subTitle="Here's your custom modal with an image"
 *   primaryButtonLabel="Get Started"
 *   onPrimaryButtonClick={handleGetStarted}
 * >
 *   <div className="p-6">
 *     <p>This modal displays an image in the header.</p>
 *   </div>
 * </Modal>
 *
 * @example
 * // Simple modal with minimal configuration
 * <Modal
 *   open={isOpen}
 *   onModalClose={() => setIsOpen(false)}
 *   title="Success"
 *   primaryButtonLabel="OK"
 *   onPrimaryButtonClick={handleOk}
 * >
 *   <div className="p-6">
 *     <p>Operation completed successfully!</p>
 *   </div>
 * </Modal>
 *
 * @example
 * // Information popup variant — lightweight status message with icon
 * <Modal
 *   open={isOpen}
 *   onModalClose={() => setIsOpen(false)}
 *   modalVariant="information"
 *   title="Payment Successful"
 *   subTitle="Your transaction has been processed."
 *   modalHeaderIconOrImage={{ variant: 'icon', icon: <SuccessIcon /> }}
 *   primaryButtonLabel="Done"
 *   onPrimaryButtonClick={handleOk}
 * >
 *   <p className="text-center text-gray-600">You will receive a confirmation shortly.</p>
 * </Modal>
 *
 * @example
 * // Modal with side image on the left (desktop only)
 * <Modal
 *   open={isOpen}
 *   onModalClose={() => setIsOpen(false)}
 *   title="Welcome to Our Platform"
 *   subTitle="Get started with your account"
 *   sideImage={<img src="/path/to/side-image.jpg" alt="Welcome" className="w-full h-full object-cover" />}
 *   imagePosition="left"
 *   primaryButtonLabel="Get Started"
 *   onPrimaryButtonClick={handleGetStarted}
 * >
 *   <div className="p-6">
 *     <p>This modal displays a side image on the left side (desktop only).</p>
 *   </div>
 * </Modal>
 */
// eslint-disable-next-line import/prefer-default-export
export const Modal = forwardRef<HTMLDivElement, ModalProps>((props, ref) => {
  const {
    open = false,
    children,
    wrapperClassName = '',
    title,
    subTitle = '',
    modalWrapperClassName = '',
    headerAlignment = 'center',
    footerWrapperClassName = '',
    primaryButtonLabel,
    secondaryButtonLabel,
    primaryBtnProps,
    secondaryBtnProps,
    dataTestId = 'modal-test-id',
    onPrimaryButtonClick,
    onSecondaryButtonClick,
    onModalClose,
    shouldCloseOnOverlayClick = false,
    modalVariant = 'default',
    lightBoxType = 'default',
    modalPosition = 'center',
    scrollStyle = 'default',
  } = props;

  // Extract sideImage and imagePosition only for default variant
  const { sideImage, imagePosition } =
    modalVariant === 'default'
      ? (props as ModalProps & {
          sideImage?: React.ReactNode;
          imagePosition?: 'left' | 'right';
        })
      : { sideImage: undefined, imagePosition: undefined };

  const { isMobile, isTablet } = useIsMobile();
  const uniqueId = useId();
  const titleId = `${uniqueId}-title`;
  const subtitleId = `${uniqueId}-subtitle`;

  // Mount/visibility state used to animate the modal in/out. Animations are only
  // applied for small screens (isMobile). On non-mobile we render immediately
  // when `open` is true and do not run enter/exit animations.
  const [isMounted, setIsMounted] = useState<boolean>(open);
  const [isVisible, setIsVisible] = useState<boolean>(isMobile ? false : open);

  // When `open` changes, control mounting and visibility to allow transitions.
  // Only run the enter/exit transition flow on mobile screens.
  useEffect(() => {
    if (!isMobile) {
      // Non-mobile: no animation, just reflect `open` state
      setIsMounted(open);
      setIsVisible(open);
      return undefined;
    }

    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    if (open) {
      setIsMounted(true);
      // Allow the element to mount then trigger visibility for the transition.
      timeoutId = setTimeout(() => setIsVisible(true), 10);
    } else {
      // Trigger hide animation, then unmount after animation duration.
      setIsVisible(false);
      timeoutId = setTimeout(() => setIsMounted(false), 300);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [open, isMobile]);

  const outerWrapperRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    // focus restoration on open and close
    if (open) {
      previouslyFocusedElement.current =
        document.activeElement instanceof HTMLElement
          ? document.activeElement
          : null;
      if (outerWrapperRef.current) {
        const dialog =
          outerWrapperRef.current.querySelector<HTMLElement>('[role="dialog"]');
        if (dialog) {
          dialog.focus({ preventScroll: true });
        } else {
          outerWrapperRef.current.focus({ preventScroll: true });
        }
      }
    } else if (previouslyFocusedElement.current) {
      previouslyFocusedElement.current.focus();
    }
  }, [open]);

  useEffect(() => {
    // implement focus trap
    if (!open) return undefined;

    const handleTab = (e: KeyboardEvent) => {
      if (e.key === 'Tab' && outerWrapperRef.current) {
        const focusableElements = outerWrapperRef.current.querySelectorAll(
          'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
        );

        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (!firstElement || !lastElement) return;

        if (e.shiftKey) {
          if (
            document.activeElement === firstElement ||
            document.activeElement === outerWrapperRef.current
          ) {
            e.preventDefault();
            (lastElement as HTMLElement).focus();
          }
        } else if (document.activeElement === lastElement) {
          e.preventDefault();
          (firstElement as HTMLElement).focus();
        }
      }
    };

    document.addEventListener('keydown', handleTab);
    return () => document.removeEventListener('keydown', handleTab);
  }, [open]);

  const onCloseButtonClick = () => {
    onModalClose?.();
  };

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onModalClose?.();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onModalClose, open]);

  const primaryButtonOnClick = () => {
    onPrimaryButtonClick?.();
  };

  const secondaryButtonOnClick = () => {
    onSecondaryButtonClick?.();
  };

  if (!isMounted) return null;

  // These props only exist on the default variant. Safe to access here since
  // the information variant renders <InformationPopup> before reaching this code.
  const {
    modalHeaderIconOrImage,
    headerSeparationLine = true,
    closeModalType = 'button',
    footerButtonsAlignment = 'right',
    closeButtonLabel,
    closeBtnProps,
  } = props as ModalWithCustomHeader;

  const isIconHeader = modalHeaderIconOrImage?.variant === 'icon';
  const isImageHeader = modalHeaderIconOrImage?.variant === 'image';
  const headerIcon =
    isIconHeader && modalHeaderIconOrImage.variant === 'icon'
      ? (modalHeaderIconOrImage as { variant: 'icon'; icon: JSX.Element }).icon
      : undefined;

  const positionClasses: Record<ModalPosition, string> = {
    // center
    center: 'items-center justify-center',

    // top row
    'top-left': 'items-start justify-start',
    'top-center': 'items-start justify-center',
    'top-right': 'items-start justify-end',

    // bottom row
    'bottom-left': 'items-end justify-start',
    'bottom-center': 'items-end justify-center',
    'bottom-right': 'items-end justify-end',

    // middle sides
    'left-center': 'items-center justify-start',
    'right-center': 'items-center justify-end',
  };

  const footerButtonsAlignmentClass =
    closeModalType === 'button' || footerButtonsAlignment === 'right'
      ? 'ml-auto'
      : 'mr-auto';

  // Compute visibility classes separately to avoid nested ternaries inside JSX.
  let wrapperVisibilityClass: string;
  if (isVisible) {
    wrapperVisibilityClass = isMobile
      ? 'translate-y-0 opacity-100 max-sm:translate-y-0'
      : 'opacity-100';
  } else {
    wrapperVisibilityClass = isMobile
      ? 'translate-y-0 opacity-0 max-sm:translate-y-full'
      : 'opacity-0';
  }

  const isSplitLayout = modalVariant === 'default' && !!sideImage && !isMobile;

  const isContentScroll = scrollStyle === 'content-scroll';

  let contentWrapperClass = '';
  if (isContentScroll) {
    contentWrapperClass = 'flex flex-col flex-1 min-h-0';
  } else {
    contentWrapperClass = 'overflow-auto';
  }

  return (
    <div
      ref={outerWrapperRef}
      tabIndex={-1}
      className={`fixed inset-0 z-[9999] flex max-sm:items-end ${wrapperClassName} max-sm:py-0 sm:px-4 sm:py-6 ${positionClasses[modalPosition]} outline-none`}
    >
      {/* Overlay backdrop */}
      {lightBoxType !== 'none' && (
        <div
          className={`absolute inset-0 bg-[#00000033] ${lightBoxType === 'blur' ? 'backdrop-blur-sm' : ''} ${isMobile ? 'transition-opacity duration-300' : ''} ${isVisible ? 'opacity-100' : 'opacity-0'}`}
          role="none"
          onMouseDown={
            shouldCloseOnOverlayClick ? onCloseButtonClick : undefined
          }
        />
      )}
      {modalVariant === 'information' ? (
        <InformationPopup
          {...(props as InformationPopupProps)}
          ref={ref}
          title={title as string}
          subTitle={subTitle}
          icon={headerIcon}
          onPrimaryButtonClick={primaryButtonOnClick}
          onSecondaryButtonClick={secondaryButtonOnClick}
          hasOverlay={lightBoxType !== 'none'}
          headerAlignment={headerAlignment}
          isMobile={!!isMobile}
          wrapperVisibilityClass={wrapperVisibilityClass}
        >
          {children}
        </InformationPopup>
      ) : (
        <div
          ref={ref}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          aria-describedby={subTitle ? subtitleId : undefined}
          tabIndex={-1}
          data-testid={dataTestId}
          className={`
          ${modalWrapperClassName}
          bg-fill-fill
          relative
          flex
          max-h-full
          w-full         
          ${isSplitLayout ? 'flex-row' : 'flex-col'}
            ${isContentScroll || isSplitLayout ? 'overflow-hidden' : 'overflow-auto'}
          rounded-3xl 
          ${isMobile ? 'transition duration-300 ease-in-out' : ''}
          focus:outline-none max-sm:!w-full max-sm:!rounded-b-none
          ${wrapperVisibilityClass}
          `}
        >
          {isSplitLayout && imagePosition === 'left' && (
            <div className="flex w-1/2">
              <SideImage>{sideImage}</SideImage>
            </div>
          )}
          <div
            className={`${isSplitLayout ? 'flex w-1/2 flex-col' : `${contentWrapperClass}`} rounded-3xl focus:outline-none`}
          >
            <div className="relative flex min-h-0 flex-1 flex-col">
              {(closeModalType === 'icon' || isTablet || isMobile) && (
                <button
                  onClick={onCloseButtonClick}
                  aria-label="Close modal"
                  className="
                border-border-border-light bg-fill-fill
                absolute right-6 top-6
                flex h-8 w-8
                items-center justify-center rounded-3xl border"
                  type="button"
                >
                  <CloseIcon height={16} width={16} />
                </button>
              )}
              {isImageHeader && (
                <div className="oveflow-hidden w-full rounded-t-3xl">
                  {modalHeaderIconOrImage.image}
                </div>
              )}
              <div className={isContentScroll ? 'shrink-0' : ''}>
                <ModalHeader
                  separationLine={headerSeparationLine}
                  headerIcon={headerIcon}
                  headerAlignment={headerAlignment}
                >
                  {(props as ModalWithCustomHeader).header ?? (
                    <div>
                      <ModalTitle id={titleId} className="mb-0.5">
                        {title}
                      </ModalTitle>
                      {subTitle ? (
                        <ModalSubTitle id={subtitleId}>
                          {subTitle}
                        </ModalSubTitle>
                      ) : null}
                    </div>
                  )}
                </ModalHeader>
              </div>
              <div
                className={`${isContentScroll ? 'flex-1 overflow-auto' : ''} focus:outline-none`}
              >
                {children}
              </div>
            </div>
            <div
              className={`border-border-border-light flex gap-4 border-t p-6 ${footerWrapperClassName}`}
            >
              {closeModalType === 'button' ? (
                <Button
                  label={closeButtonLabel || 'Close'}
                  onClick={onCloseButtonClick}
                  size="lg"
                  type="button"
                  {...closeBtnProps}
                  className={`${closeBtnProps?.className || ''} max-md:hidden`}
                  hierarchy="Text Button"
                />
              ) : null}

              <div
                className={`flex !min-w-0 shrink gap-4 max-md:w-full max-md:flex-col ${footerButtonsAlignmentClass}`}
              >
                {secondaryButtonLabel && (
                  <Button
                    label={secondaryButtonLabel}
                    onClick={secondaryButtonOnClick}
                    size="lg"
                    type="button"
                    className={`${secondaryBtnProps?.className} !border-border-border min-w-0 shrink max-md:order-2 max-md:w-full`}
                    {...secondaryBtnProps}
                    hierarchy="Secondary"
                  />
                )}
                {primaryButtonLabel && (
                  <Button
                    label={primaryButtonLabel}
                    onClick={primaryButtonOnClick}
                    size="lg"
                    type="button"
                    className={`${primaryBtnProps?.className} min-w-0 shrink max-md:order-1 max-md:w-full`}
                    {...primaryBtnProps}
                    hierarchy="Primary"
                  />
                )}
              </div>
            </div>
          </div>
          {isSplitLayout && imagePosition === 'right' && (
            <div className="flex w-1/2">
              <SideImage>{sideImage}</SideImage>
            </div>
          )}
        </div>
      )}
    </div>
  );
});
