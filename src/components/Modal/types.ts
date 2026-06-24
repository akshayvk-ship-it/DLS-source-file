import { ButtonProps } from '../Button';

/**
 * Configuration for displaying an icon in the modal header
 */
export type ModalIcon = {
  /** Discriminant to identify this as an icon variant */
  variant: 'icon';
  /** The icon element to display in the modal header */
  icon: JSX.Element;
};

/**
 * Alignment options for modal header content
 */
export type HeaderContentAlignment = 'center' | 'left';

/**
 * Context type for modal internal state management
 */
export type ModalContextType = {
  /** Alignment of the header content (center or left) */
  headerAlignment: HeaderContentAlignment;
  /** Whether the modal has an image in the header */
  hasImage?: boolean;
  /** Whether the modal has an icon in the header */
  hasIcon?: boolean;
};

/**
 * Configuration for displaying an image in the modal header
 */
export type ModalImage = {
  /** Discriminant to identify this as an image variant */
  variant: 'image';
  /** The image source (URL string) or image element to display in the modal header */
  image: string | JSX.Element;
};

/**
 * Props for the modal header component
 */
export type ModalHeaderProps = {
  /** Content to display in the modal header
   * @default null
   */
  children?: React.ReactNode;
  /** Whether to show a separation line below the header
   * - true: Show separation line
   * - false: Hide separation line
   * @default true
   */
  separationLine?: boolean;
  /** Icon element to display in the modal header
   * @default null
   */
  headerIcon?: JSX.Element;
  /** Alignment of the header content (center or left)
   * - 'center': Center align header content
   * - 'left': Left align header content
   * @default 'center'
   */
  headerAlignment?: HeaderContentAlignment;
  /** Additional CSS class name for the modal header
   * @default ''
   */
  className?: string;
};

/**
 * Union type for modal header top component (either icon or image)
 */
export type ModalTopComponentType = ModalIcon | ModalImage;

/**
 * Props for the Modal component
 */
export interface BaseModalProps {
  /** Whether the modal is currently open and visible
   * - true: Modal is visible
   * - false: Modal is hidden
   * @default false
   */
  open: boolean;
  /** Content to display inside the modal body */
  children: React.ReactNode;
  /** Alignment of the header content (center or left)
   * - 'center': Center align header content
   * - 'left': Left align header content
   * @default 'center'
   */
  headerAlignment?: HeaderContentAlignment;
  /** Additional CSS class name for the modal wrapper
   * @default ''
   */
  wrapperClassName?: string;
  /** Callback function when primary button is clicked
   * @default null
   */
  onPrimaryButtonClick?: () => void;
  /** Callback function when secondary button is clicked
   * @default null
   */
  onSecondaryButtonClick?: () => void;
  /** Callback function when modal is closed
   * @default null
   */
  onModalClose?: () => void;
  /** Alignment of footer buttons (left or right)
   * - 'left': Left align footer buttons
   * - 'right': Right align footer buttons
   * @default 'right'
   */
  footerButtonsAlignment?: 'left' | 'right';
  /** Text label for the primary action button
   * @default null
   */
  primaryButtonLabel?: string;
  /** Icon or image to display in the modal header
   * @default null
   */
  modalHeaderIconOrImage?: ModalTopComponentType;
  /** Text label for the secondary action button
   * @default null
   */
  secondaryButtonLabel?: string;
  /** Type of close button to display (button or icon)
   * - 'button': Show close button
   * - 'icon': Show close icon
   * @default 'button'
   */
  closeModalType?: 'button' | 'icon';
  /** Whether to show a separation line below the header when using title/subtitle
   * - true: Show separation line
   * - false: Hide separation line
   * @default true
   */
  headerSeparationLine?: boolean;
  /**
   * Data attribute used for testing. Applied to the modal root element.
   * @default 'modal-test-id'
   */
  dataTestId?: string;
  /**
   * Additional CSS class name applied to the inner modal panel (the white card).
   * Use this to customise width, max-height, padding, etc.
   * @default ''
   */
  modalWrapperClassName?: string;
  /**
   * Text label rendered on the close button when `closeModalType` is `'button'`.
   * @default 'Close'
   */
  closeButtonLabel?: string;
  /**
   * Additional CSS class name applied to the footer wrapper element.
   * @default ''
   */
  footerWrapperClassName?: string;
  /**
   * Defines how scrolling is handled when modal content is taller than viewport.
   * - 'default': The whole modal (header, body, footer) scrolls together.
   * - 'content-scroll': The header and footer are fixed, only the content body scrolls.
   * @default 'default'
   */
  scrollStyle?: 'default' | 'content-scroll';
  /**
   * Additional props forwarded to the primary action `Button` component.
   * Use to override size, hierarchy, disabled state, etc.
   */
  primaryBtnProps?: ButtonProps;
  /**
   * Additional props forwarded to the secondary action `Button` component.
   */
  secondaryBtnProps?: ButtonProps;
  /**
   * Additional props forwarded to the close `Button` component.
   * Only applicable when `closeModalType` is `'button'`.
   */
  closeBtnProps?: ButtonProps;
  /**
   * When `true`, clicking the overlay backdrop or pressing `Escape` closes the modal.
   * @default false
   */
  shouldCloseOnOverlayClick?: boolean;
  /**
   * Controls the appearance of the backdrop overlay behind the modal.
   * - `'default'` — semi-transparent dark overlay
   * - `'blur'` — blurred backdrop
   * - `'none'` — no backdrop
   * @default 'default'
   */
  lightBoxType?: 'none' | 'default' | 'blur';
  /**
   * Selects the modal variant.
   * - `'default'` — standard modal with header, body, and footer
   * - `'information'` — lightweight popup for status messages or confirmations
   * @default 'default'
   */
  modalVariant?: 'default' | 'information';
  /**
   * Controls where the modal panel appears on screen.
   * @default 'center'
   */
  modalPosition?: ModalPosition;
}

/**
 * Modal variant that accepts a fully custom header node.
 * Use this when the built-in title/subtitle header does not meet your needs.
 * `title` and `subTitle` are not available in this variant.
 */
export interface ModalWithCustomHeader extends BaseModalProps {
  /**
   * Custom React node rendered as the modal header.
   * @default null
   */
  header: React.ReactNode;
  title?: never;
  subTitle?: never;
}

/**
 * Modal props for adding the side image horizontally
 */
export type ModalSplitProps = {
  sideImage?: React.ReactNode;
  imagePosition?: 'left' | 'right';
};

/**
 * Props for the side image component
 */
export type SideImageProps = {
  children: React.ReactNode;
};

/**
 * Modal variant that uses the built-in title and optional subtitle header.
 * `header` is not available in this variant.
 */
export interface ModalWithTitle extends BaseModalProps {
  header?: never;

  /** Title text to display in the modal header
   * @default ''
   */
  title: string;
  /** Optional subtitle text to display below the title in the modal header
   * @default null
   */
  subTitle?: string;
}

/**
 * Props for the `information` modal variant — a lightweight popup used for
 * status messages, confirmations, or timed notifications.
 */
export interface InformationPopupProps
  extends Omit<
    BaseModalProps,
    | 'closeButtonLabel'
    | 'closeBtnProps'
    | 'footerButtonsAlignment'
    | 'closeModalType'
    | 'headerSeparationLine'
  > {
  /** Title text displayed at the top of the information popup. */
  title: string;
  /** Optional subtitle displayed below the title. */
  subTitle?: string;
  /**
   * @internal Passed by `Modal` — derived from `modalHeaderIconOrImage`. Do not set manually.
   */
  icon?: JSX.Element;
  /** Whether to show a darkened overlay behind the popup.
   * @default true
   */
  hasOverlay?: boolean;
  /** Auto-close duration in milliseconds. When set the popup closes automatically after this delay. */
  timerDuration?: number;
  ref?: React.RefObject<HTMLDivElement>;
  /**
   * @internal Passed by `Modal` to drive mobile animations. Do not set manually.
   */
  isMobile?: boolean;
  /**
   * @internal Tailwind class string passed by `Modal` to control enter/exit animation.
   * Do not set manually.
   */
  wrapperVisibilityClass?: string;
}

type ModalDefaultVariantProps = (ModalWithCustomHeader | ModalWithTitle) & {
  modalVariant?: 'default';
} & (
    | {
        modalHeaderIconOrImage: ModalImage;
        sideImage?: never;
        imagePosition?: never;
      }
    | ({
        modalHeaderIconOrImage?: ModalIcon;
      } & (
        | {
            sideImage: React.ReactNode;
            imagePosition: 'left' | 'right';
          }
        | {
            sideImage?: never;
            imagePosition?: never;
          }
      ))
  );

type ModalInformationVariantProps = Omit<
  InformationPopupProps,
  'hasOverlay' | 'isMobile' | 'wrapperVisibilityClass' | 'icon'
> & {
  modalVariant: 'information';
  sideImage?: never;
  imagePosition?: never;
};

/**
 * Discriminated union of all valid `Modal` prop shapes.
 * Use `modalVariant: 'default'` for standard modals (with custom header or title/subtitle).
 * Use `modalVariant: 'information'` for lightweight information popups.
 */
export type ModalProps =
  | ModalDefaultVariantProps
  | ModalInformationVariantProps;
/**
 * Positional placement of the modal on screen.
 * - `'center'` — centred both horizontally and vertically (default)
 * - `'top-left' | 'top-center' | 'top-right'` — pinned to the top edge
 * - `'bottom-left' | 'bottom-center' | 'bottom-right'` — pinned to the bottom edge
 * - `'left-center' | 'right-center'` — centred on the left or right edge
 */
export type ModalPosition =
  | 'center'
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right'
  | 'left-center'
  | 'right-center';
