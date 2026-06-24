import { forwardRef, useEffect, useState } from 'react';
import { Button, ButtonProps } from '../Button';
import { CloseIcon } from '../Icons';
import useIsMobile from '../hooks/useInMobile';

export interface CoachMarkProps {
  /**
   * Optional image or React element rendered in a fixed-height (9rem) banner
   * at the top of the card. Rounded top corners are applied automatically.
   */
  headerContent?: JSX.Element;
  /** Primary heading text displayed inside the card. */
  title: string;
  /** Secondary descriptive text rendered below the title. */
  subTitle?: string;
  /** Additional CSS classes applied to the outermost wrapper `div`. */
  wrapperClassName?: string;
  /**
   * Text alignment for the title and subtitle.
   * @default 'left'
   */
  headerAlignment?: 'left' | 'center';
  /**
   * Label for the secondary (outline) button.
   * If omitted, the button is not rendered.
   */
  secondaryButtonLabel?: string;
  /**
   * Label for the primary (filled) button.
   * If omitted, the button is not rendered.
   */
  primaryButtonLabel?: string;
  /** Callback fired when the secondary button is clicked. */
  secondaryButtonOnClick?: () => void;
  /** Callback fired when the primary button is clicked. */
  primaryButtonOnClick?: () => void;
  /**
   * Additional props forwarded to the primary `Button`.
   * `label`, `onClick`, `hierarchy`, `size`, and `type` are controlled by the
   * component and will be ignored if passed here.
   */
  primaryButtonProps?: Omit<
    ButtonProps,
    'label' | 'onClick' | 'hierarchy' | 'size'
  >;
  /**
   * Additional props forwarded to the secondary `Button`.
   * `label`, `onClick`, `hierarchy`, `size`, and `type` are controlled by the
   * component and will be ignored if passed here.
   */
  secondaryButtonProps?: Omit<
    ButtonProps,
    'label' | 'onClick' | 'hierarchy' | 'size'
  >;
  /**
   * When `true`, the close (`✕`) icon button is rendered in the top-right corner.
   * @default true
   */
  showCloseIcon?: boolean;
  /**
   * Callback fired when the close icon is clicked, or when `Enter`/`Space`
   * is pressed while the icon is focused. Use this to set `open` to `false`.
   */
  closeModal?: () => void;
  /**
   * Controls whether the CoachMark is mounted and visible.
   * On mobile, toggling this triggers a slide-up / slide-down animation.
   * @default true
   */
  open?: boolean;
  /**
   * Side from which the directional arrow protrudes, visually anchoring the card
   * to a nearby UI element. The arrow is hidden on mobile viewports.
   */
  arrowDirection?: 'top' | 'bottom' | 'left' | 'right';
  /**
   * Fixed pixel coordinates `{ x, y }` used to position the card on desktop via
   * `position: fixed`. Ignored on mobile — the card renders as a full-width bottom sheet.
   */
  position?: { x: number; y: number };
  /**
   * `data-testid` attribute applied to the card wrapper for automated testing.
   * @default 'coach-mark-test-id'
   */
  dataTestId?: string;

  /**
   * When provided, renders a step indicator (e.g. "STEP 2 Of 5") in the footer.
   * Both `current` and `total` are required together — omit the prop entirely to hide the indicator.
   * @example
   * <CoachMark steps={{ current: 2, total: 5 }} ... />
   */
  steps?: { current: number; total: number };
}

/**
 * `CoachMark` is a floating card used to highlight a single feature or step
 * in an onboarding flow. It is a **single unit** — parent code drives progression
 * between steps; this component renders one step at a time.
 *
 * On **desktop** it floats at fixed `position` coordinates with an optional
 * directional arrow that visually anchors it to a nearby UI element.
 * On **mobile** it ignores coordinates and arrows, sliding up as a full-width
 * bottom sheet overlay instead.
 *
 * Supports optional header image, step indicator (`steps`), dual action buttons,
 * and a close icon. The `ref` is forwarded to the card's root `div`.
 *
 * @example
 * // Basic usage anchored below a button
 * <CoachMark
 *   open={isOpen}
 *   title="New Feature!"
 *   subTitle="Click here to explore the new dashboard."
 *   primaryButtonLabel="Got it"
 *   primaryButtonOnClick={() => setIsOpen(false)}
 *   closeModal={() => setIsOpen(false)}
 *   arrowDirection="top"
 *   position={{ x: 200, y: 150 }}
 * />
 *
 * @example
 * // Multi-step usage with header image
 * <CoachMark
 *   open={isOpen}
 *   headerContent={<img src="/onboarding.png" alt="Onboarding" />}
 *   title="Turn on notifications"
 *   subTitle="Stay updated with important alerts."
 *   steps={{ current: 2, total: 5 }}
 *   primaryButtonLabel="Next"
 *   secondaryButtonLabel="Back"
 *   primaryButtonOnClick={goToNextStep}
 *   secondaryButtonOnClick={goToPrevStep}
 *   closeModal={() => setIsOpen(false)}
 * />
 */
// eslint-disable-next-line import/prefer-default-export
export const CoachMark = forwardRef<HTMLDivElement, CoachMarkProps>(
  (props, ref) => {
    const {
      headerContent,
      title,
      subTitle,
      wrapperClassName = '',
      headerAlignment = 'left',
      secondaryButtonLabel,
      primaryButtonLabel,
      secondaryButtonOnClick,
      primaryButtonOnClick,
      showCloseIcon = true,
      closeModal,
      open = true,
      arrowDirection,
      position,
      dataTestId = 'coach-mark-test-id',
      steps,
      primaryButtonProps,
      secondaryButtonProps,
    } = props;

    const { isMobile } = useIsMobile();

    const [isMounted, setIsMounted] = useState<boolean>(open);
    const [isVisible, setIsVisible] = useState<boolean>(
      isMobile ? false : open,
    );

    useEffect(() => {
      if (!isMobile) {
        setIsMounted(open);
        setIsVisible(open);
        return undefined;
      }

      let timeoutId: ReturnType<typeof setTimeout> | undefined;

      if (open) {
        setIsMounted(true);
        timeoutId = setTimeout(() => setIsVisible(true), 10);
      } else {
        setIsVisible(false);
        timeoutId = setTimeout(() => setIsMounted(false), 300);
      }

      return () => {
        if (timeoutId) clearTimeout(timeoutId);
      };
    }, [open, isMobile]);

    if (!isMounted) return null;

    const arrowStyles = {
      top: 'w-[24px] h-[16px] -top-[16px] left-1/2 -translate-x-1/2',
      bottom: 'w-[24px] h-[16px] -bottom-[16px] left-1/2 -translate-x-1/2',
      left: 'w-[16px] h-[24px] -left-[16px] top-1/2 -translate-y-1/2',
      right: 'w-[16px] h-[24px] -right-[16px] top-1/2 -translate-y-1/2',
    };

    const arrowPaths = {
      top: 'M0 16 L9 4 Q12 0 15 4 L24 16 Z',
      bottom: 'M0 0 L9 12 Q12 16 15 12 L24 0 Z',
      left: 'M16 0 L4 9 Q0 12 4 15 L16 24 Z',
      right: 'M0 0 L12 9 Q16 12 12 15 L0 24 Z',
    };

    const arrowClipPaths = {
      top: 'inset(-100% -100% 0 -100%)',
      bottom: 'inset(0 -100% -100% -100%)',
      left: 'inset(-100% 0 -100% -100%)',
      right: 'inset(-100% -100% -100% 0)',
    };

    const animationVisible = isVisible ? 'translate-y-0' : 'translate-y-full';

    const contentClasses = isMobile
      ? `fixed bottom-0 left-0 z-[9999] w-full rounded-t-2xl rounded-b-none transition-transform duration-300 ease-in-out ${animationVisible} `
      : 'relative min-w-[18.25rem] max-w-[25rem] rounded-2xl shadow';

    const renderActionButton = (secondaryButtonLabel || primaryButtonLabel) && (
      <div className={`flex gap-4 ${steps ? '' : 'p-4 !pt-2'}`}>
        {secondaryButtonLabel && (
          <Button
            label={secondaryButtonLabel}
            onClick={secondaryButtonOnClick}
            size="md"
            type="button"
            hierarchy="Secondary"
            {...secondaryButtonProps}
            className={`!border-border-border flex-1 max-sm:w-full ${secondaryButtonProps?.className ?? ''}`}
          />
        )}
        {primaryButtonLabel && (
          <Button
            label={primaryButtonLabel}
            onClick={primaryButtonOnClick}
            size="md"
            type="button"
            hierarchy="Primary"
            {...primaryButtonProps}
            className={`flex-1 max-sm:w-full ${primaryButtonProps?.className ?? ''}`}
          />
        )}
      </div>
    );

    const renderFooterWithSteps = (
      <div className={`flex p-4 !pt-2 ${steps ? 'justify-between' : ''}`}>
        {steps && (
          <p className="text-text-light label-small self-center font-semibold">
            STEP {steps.current} Of {steps.total}
          </p>
        )}
        {renderActionButton}
      </div>
    );

    const content = (
      <div
        ref={ref}
        data-testid={dataTestId}
        className={`${wrapperClassName} bg-fill-fill isolate z-50 ${contentClasses}`}
        style={
          !isMobile && position
            ? { top: position.y, left: position.x, position: 'fixed' }
            : undefined
        }
      >
        {!isMobile && arrowDirection && (
          <svg
            className={`fill-fill-fill absolute overflow-visible drop-shadow ${arrowStyles[arrowDirection]}`}
            preserveAspectRatio="none"
            style={{ clipPath: arrowClipPaths[arrowDirection] }}
            viewBox={
              arrowDirection === 'top' || arrowDirection === 'bottom'
                ? '0 0 24 16'
                : '0 0 16 24'
            }
          >
            <path d={arrowPaths[arrowDirection]} />
          </svg>
        )}
        {headerContent && (
          <div className="h-[9rem] max-w-full [&>*]:rounded-t-2xl">
            {headerContent}
          </div>
        )}
        {showCloseIcon && (
          <button
            type="button"
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                closeModal?.();
              }
            }}
            className="bg-fill-fill absolute right-2 top-2 flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg"
            onClick={closeModal}
          >
            <CloseIcon width={16} height={16} />
          </button>
        )}
        <div
          className={`${headerAlignment === 'left' ? 'text-start' : 'text-center'} p-4 `}
        >
          <h5 className="text-text-dark font-semibold">{title}</h5>
          {subTitle ? (
            <p className="text-text-text label-medium mt-1">{subTitle}</p>
          ) : null}
        </div>

        {steps ? renderFooterWithSteps : renderActionButton}
      </div>
    );

    return content;
  },
);
