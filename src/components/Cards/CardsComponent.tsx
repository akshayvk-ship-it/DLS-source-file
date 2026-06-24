import { forwardRef, ReactNode, useEffect, useRef, useState } from 'react';
import { Button, ButtonProps } from '../Button';
import {
  BUTTON_HEIGHT,
  BUTTON_SIZES,
  CARD_MIN_WIDTH_CONFIG,
  CARD_OUTER_PADDING_CONFIG,
  CARD_TYPOGRAPHY,
  DESC_BUTTON_SPACE,
  ICON_SIZE,
  ICON_SIZE_PX,
  SHADOW_CLASS,
  TITLE_DESC_SPACE,
} from './constants';
import { BtnHierarchies } from '../Button/helper';

type CardLayout = 'vertical' | 'horizontal';

interface BtnProps {
  label: string;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

type CardSize = 'sm' | 'md' | 'lg';

type IconCardProps = {
  isIconOrImageVariant: 'icon';
  icon?: JSX.Element;
};

type ImageCardProps = {
  isIconOrImageVariant: 'image';
  image?: string | JSX.Element;
};

type ButtonsLayout = 'hug' | 'fill' | 'fill-primary';

type CardImage = IconCardProps | ImageCardProps;

export type CardsProps = {
  /** Layout orientation of the card
   * - 'vertical': Stacks content vertically (default)
   * - 'horizontal': Arranges content side-by-side with image on left
   * @default 'vertical'
   */
  cardLayout: CardLayout;
  /** Main title text displayed prominently in the card
   * @default ''
   */
  title?: string;
  /** Optional subtitle text displayed below the title
   * @default ''
   */
  subTitle?: string;
  /** Description text or custom React node displayed below subtitle
   * Can be a string for simple text or ReactNode for rich content
   * @default ''
   */
  description?: string | ReactNode;
  /** Whether to show action buttons at the bottom of the card
   * @default false
   */
  showButtons?: boolean;
  /** Configuration for the primary action button
   * Appears on the left in vertical layout
   */
  primaryButton?: BtnProps;
  /** Configuration for the secondary action button
   * Appears on the right in vertical layout
   */
  secondaryButton?: BtnProps;
  /** Additional CSS class names applied to the buttons container
   * @default ''
   */
  btnClassName?: string;
  /** Background color class for the card
   * @default 'bg-fill-fill'
   */
  bgColor?: string;
  /** Background color class for the card image/icon section
   * @default 'bg-fill-fill'
   */
  cardImageBackground?: `bg-${string}`;
  /** Additional CSS class names applied to the card image container
   * @default ''
   */
  cardImageClassName?: string;
  /** Additional CSS class names applied to the title element
   * @default ''
   */
  titleClassName?: string;
  /** Additional CSS class names applied to the subtitle element
   * @default ''
   */
  subTitleClassName?: string;
  /** Additional CSS class names applied to the description element
   * @default ''
   */
  descriptionClassName?: string;
  /** Data attribute used for testing. Applied to the card root element
   * @default 'cards-test-id'
   */
  dataTestId?: string;
  /** Whether to apply a shadow effect to the card
   * @default false
   */
  withShadow?: boolean;
  /** Additional CSS class names applied to the card wrapper element
   * @default ''
   */
  wrapperClassName?: string;
  /** Padding size for the card content area
   * - 'sm': Standard padding (default)
   * - 'lg': Large padding for more spacious layout
   * @default 'sm'
   */
  paddingSize?: 'lg' | 'sm';
  /** Predefined size of the card affecting width and layout
   * - 'sm': Small width variant
   * - 'md': Medium width variant
   * - 'lg': Large width variant
   */
  cardSize?: CardSize;
  /** Configuration for card header image or icon
   * Can be either an icon (small, rounded) or image (full-width header)
   */
  cardImage?: CardImage;
  /** Layout behavior for action buttons
   * - 'hug': Buttons size to their content and align to the left
   * - 'fill': Both buttons stretch to fill available space
   * - 'fill-primary': Secondary hugs, primary fills
   */
  buttonsLayout?: ButtonsLayout;
  /** Optional icon displayed above the title
   * Useful for adding visual context or branding
   */
  icon?: JSX.Element;
  /** Additional CSS class names applied to the icon element
   * @default ''
   */
  iconClassName?: string;
  /** Additional props passed to the image element when using image variant
   * @default {}
   */
  imageProps?: React.ImgHTMLAttributes<HTMLImageElement>;
};

export const getCardStyles = (layout: CardLayout, size: CardSize) => ({
  minWidth: CARD_MIN_WIDTH_CONFIG[layout][size],
  padding: CARD_OUTER_PADDING_CONFIG[size],
});

/**
 * `CardsComponent` is a flexible, customizable card component that supports multiple layouts,
 * sizes, and content configurations.
 *
 * ## Layout Options:
 * - **Vertical**: Stacks content vertically with optional header image/icon
 * - **Horizontal**: Side-by-side layout with image on left, content on right
 *
 * ## Content Sections:
 * - Header: Optional icon or image (full-width or small icon)
 * - Body: Title, subtitle, and description (can be custom)
 * - Footer: Optional action buttons with flexible layouts
 *
 * ## Size Variants:
 * - **Small**: Compact cards for dense layouts
 * - **Medium**: Standard size for general use
 * - **Large**: Spacious cards for large content
 *
 * ## Button Layouts:
 * Button Layouts will not be applicable if the card layout is horizontal
 * - **Hug**: Buttons size to their content
 * - **Fill**: Both buttons stretch equally
 * - **fill-primary**: Secondary hugs, primary fills space
 *
 * @example
 * // Basic vertical card with title and description
 * <CardsComponent
 *   cardLayout="vertical"
 *   title="Welcome to Our Platform"
 *   description="Get started with our amazing features and tools."
 *   showButtons={true}
 *   primaryButton={{ label: "Get Started", onClick: handleStart }}
 *   secondaryButton={{ label: "Learn More", onClick: handleLearn }}
 * />
 *
 * @example
 * // Horizontal card with header image
 * <CardsComponent
 *   cardLayout="horizontal"
 *   title="Product Features"
 *   subTitle="Advanced capabilities"
 *   description="Explore our comprehensive set of features designed for modern workflows."
 *   cardImage={{
 *     isIconOrImageVariant: 'image',
 *     image: '/path/to/product-image.jpg'
 *   }}
 *   cardSize="lg"
 *   withShadow={true}
 * />
 *
 * @example
 * // Card with icon header and custom styling
 * <CardsComponent
 *   cardLayout="vertical"
 *   title="Security First"
 *   subTitle="Enterprise-grade protection"
 *   description="Your data is protected with industry-leading security measures."
 *   icon={<SecurityIcon />}
 *   cardImage={{
 *     isIconOrImageVariant: 'icon',
 *     icon: <ShieldIcon />
 *   }}
 *   bgColor="bg-blue-50"
 *   cardImageBackground="bg-blue-100"
 *   paddingSize="lg"
 *   showButtons={true}
 *   buttonsLayout="fill"
 *   primaryButton={{ label: "View Security", onClick: handleSecurity }}
 *   secondaryButton={{ label: "Documentation", onClick: handleDocs }}
 * />
 *
 * @example
 * // Small card with minimal content
 * <CardsComponent
 *   cardLayout="vertical"
 *   cardSize="sm"
 *   title="Quick Stats"
 *   description="5 active users, 2 pending tasks"
 *   showButtons={true}
 *   primaryButton={{ label: "View Details", onClick: handleDetails }}
 *   wrapperClassName="max-w-xs"
 * />
 *
 * @example
 * // Card with rich content in description
 * <CardsComponent
 *   cardLayout="vertical"
 *   title="Analytics Dashboard"
 *   description={
 *   <div className="space-y-2">
 *     <p>Real-time insights and metrics</p>
 *     <ul className="list-disc list-inside text-sm">
 *       <li>User engagement tracking</li>
 *       <li>Performance analytics</li>
 *       <li>Custom reports</li>
 *     </ul>
 *   </div>
 * }
 *   showButtons={true}
 *   primaryButton={{ label: "Open Dashboard", onClick: handleDashboard }}
 * />
 */
export const CardsComponent = forwardRef<HTMLDivElement, CardsProps>(
  (
    {
      cardLayout = 'vertical',
      title = '',
      subTitle = '',
      description = '',
      showButtons = false,
      primaryButton,
      secondaryButton,
      bgColor = 'bg-fill-fill',
      cardImageBackground = 'bg-fill-fill',
      titleClassName = '',
      subTitleClassName = '',
      cardImageClassName = '',
      descriptionClassName = '',
      btnClassName = '',
      dataTestId = 'cards-test-id',
      withShadow = false,
      wrapperClassName = '',
      iconClassName = '',
      imageProps,
      paddingSize = 'sm',
      cardSize,
      cardImage,
      buttonsLayout,
      icon,
    },
    ref,
  ) => {
    const isHorizontal = cardLayout === 'horizontal';

    const primaryButtonProps: ButtonProps = {
      hierarchy: 'Secondary',
      type: 'button',
      size: 'lg',
      className: '',
      ...primaryButton,
    };
    const secondaryButtonProps: ButtonProps = {
      hierarchy: 'Primary',
      type: 'button',
      size: 'lg',
      ...secondaryButton,
    };
    const getExternalPaddingSize = () => {
      if (paddingSize === 'lg') {
        return 'p-6';
      }
      return 'p-4';
    };

    const iconWrapperRef = useRef<HTMLDivElement>(null);
    const [originalSize, setOriginalSize] = useState<number>(0);

    useEffect(() => {
      if (!iconWrapperRef.current || !cardSize) return () => {};

      const observer = new ResizeObserver((entries) => {
        entries.forEach((entry) => {
          const { width, height } = entry.contentRect;
          setOriginalSize(Math.max(width, height));
        });
      });

      observer.observe(iconWrapperRef.current);
      return () => observer.disconnect();
    }, [cardSize]);

    const { minWidth, padding } = getCardStyles(cardLayout, cardSize ?? 'md');

    const getButtonSize = (size: CardSize | undefined) => {
      if (!size) {
        return undefined;
      }
      if (size === 'lg') {
        return 'md';
      }
      return size;
    };

    const getButtonFillClasses = (
      buttonHierarchy: BtnHierarchies,
      position: 'first' | 'second',
    ) => {
      if (isHorizontal) {
        return '';
      }

      // for backwards compatibility
      if (!buttonsLayout) {
        return position === 'first' ? 'w-1/3' : 'w-2/3';
      }

      switch (buttonsLayout) {
        case 'fill':
          return 'flex-1';
        case 'hug':
          return '';
        case 'fill-primary':
          return buttonHierarchy === 'Primary' ? 'flex-1' : '';
        default:
          return '';
      }
    };

    const buttonSize = getButtonSize(cardSize);
    return (
      <div
        data-testid={dataTestId}
        ref={ref}
        className={`
          border-border-border-light rounded-2xl border
          ${bgColor}
          ${withShadow ? SHADOW_CLASS : ''}
          ${cardSize ? minWidth : ''}
          ${isHorizontal ? 'flex w-full flex-row' : `flex ${cardSize ? '' : 'w-[21.375rem]'} flex-col`}
          ${wrapperClassName}
        `}
      >
        {cardImage?.isIconOrImageVariant === 'image' ? (
          <div
            className={`  ${cardImageClassName}
              ${cardImageBackground} flex items-center justify-center ${cardLayout === 'vertical' ? 'rounded-t-2xl' : 'rounded-l-2xl'}`}
          >
            {typeof cardImage.image === 'string' ? (
              <img
                {...imageProps}
                src={cardImage.image}
                alt="card-image"
                className={`${imageProps?.className || ''} h-full w-full ${cardLayout === 'vertical' ? 'rounded-t-2xl' : 'rounded-l-2xl'}`}
              />
            ) : (
              cardImage.image
            )}
          </div>
        ) : null}
        {cardImage?.isIconOrImageVariant === 'icon' ? (
          <div
            className={`
              ${cardImageBackground}
              mx-4 mt-4 flex h-14 w-14 items-center justify-center rounded-lg
              ${cardImageClassName}
            `}
          >
            {cardImage.icon}
          </div>
        ) : null}

        <div
          className={`${cardSize ? padding : getExternalPaddingSize()} flex flex-col justify-between`}
        >
          <div>
            {icon &&
              (cardSize ? (
                <div
                  className={`${ICON_SIZE[cardSize]} ${iconClassName} flex items-center justify-center overflow-hidden`}
                >
                  <div
                    ref={iconWrapperRef}
                    style={{
                      zoom: originalSize
                        ? ICON_SIZE_PX[cardSize] / originalSize
                        : 1,
                    }}
                  >
                    {icon}
                  </div>
                </div>
              ) : (
                icon
              ))}

            <div
              className={`${cardSize ? TITLE_DESC_SPACE[cardSize] : 'pb-3'} ${icon ? 'mt-2' : ''}`}
            >
              {title && (
                <p
                  className={`${cardSize ? CARD_TYPOGRAPHY[cardSize].title : 'heading-4-semibold text-text-dark'}  ${titleClassName}`}
                >
                  {title}
                </p>
              )}
              {subTitle && (
                <p
                  className={`${cardSize ? CARD_TYPOGRAPHY[cardSize].subTitle : 'label-medium text-text-light'} ${subTitleClassName}`}
                >
                  {subTitle}
                </p>
              )}
            </div>
            {description &&
              (typeof description === 'string' ? (
                <p
                  className={`${cardSize ? CARD_TYPOGRAPHY[cardSize].description : 'label-medium text-text-text'} ${descriptionClassName}`}
                >
                  {description}
                </p>
              ) : (
                description
              ))}
          </div>

          {showButtons && (
            <div
              className={`flex ${cardSize ? DESC_BUTTON_SPACE[cardSize] : 'pt-10'} ${btnClassName} gap-4`}
            >
              {primaryButton && (
                <Button
                  {...primaryButtonProps}
                  onClick={primaryButton.onClick}
                  size={buttonSize || primaryButtonProps.size}
                  className={`${primaryButtonProps.className} !border-border-border ${buttonSize ? BUTTON_SIZES[buttonSize] : ''} ${cardSize ? BUTTON_HEIGHT[cardSize] : ''} ${getButtonFillClasses(primaryButtonProps.hierarchy, 'first')}`}
                >
                  {primaryButton.label}
                </Button>
              )}
              {secondaryButton && (
                <Button
                  {...secondaryButtonProps}
                  onClick={secondaryButton.onClick}
                  size={buttonSize || secondaryButtonProps.size}
                  className={`${secondaryButtonProps.className} ${buttonSize ? BUTTON_SIZES[buttonSize] : ''} ${cardSize ? BUTTON_HEIGHT[cardSize] : ''} ${getButtonFillClasses(secondaryButtonProps.hierarchy, 'second')}`}
                >
                  {secondaryButton.label}
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    );
  },
);
