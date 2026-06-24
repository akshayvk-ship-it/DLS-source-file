import React from 'react';

export interface InfoChipProps {
  text: string;
  prefixElement?: JSX.Element;
  suffixElement?: JSX.Element;
  textClassName?: string;
  wrapperClassName?: string;
  closeClassName?: string;
  closeClickHandler?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  clickHandler?: (
    event:
      | React.MouseEvent<HTMLDivElement>
      | React.KeyboardEvent<HTMLDivElement>,
  ) => void;
  isClickable?: boolean;
  showCloseIcon?: boolean;
  selected?: boolean;
  disabled?: boolean;
  dataTestId?: string;
}

type CloseButtonPreview = Pick<
  InfoChipProps,
  | 'isClickable'
  | 'selected'
  | 'closeClassName'
  | 'closeClickHandler'
  | 'disabled'
>;

const styles = {
  base: {
    wrapper:
      'select-none rounded-2xl flex h-6 items-center justify-center border px-2',
    text: 'label-small font-medium',
  },
  states: {
    default: {
      wrapper: 'bg-fill-fill-dark border-fill-dark select-none',
      text: 'text-text-text group-active:text-text-dark-pressed',
      icon: 'fill-icon-icon',
    },
    clickable: {
      wrapper:
        'bg-fill-fill-dark cursor-pointer group border-fill-dark hover:bg-fill-hover hover:border-fill-dark-hover active:bg-fill-pressed active:border-fill-dark',
      selected: 'bg-fill-info-dark border-fill-info-dark',
      text: 'text-text-text group-active:text-text-dark-pressed',
      selectedText: 'text-text-on-fill',
      icon: 'fill-icon-icon group-active:fill-icon-pressed',
      selectedIcon: 'fill-icon-on-fill',
    },
    disabled: {
      wrapper:
        'pointer-events-auto select-none border-border-disabled bg-fill-disabled cursor-not-allowed',
      text: 'text-text-disabled',
      icon: 'fill-icon-disabled pointer-events-auto cursor-not-allowed',
    },
  },
};

const getStyles = {
  wrapper: (
    disabled?: boolean,
    isClickable?: boolean,
    selected?: boolean,
  ): string => {
    if (disabled) return styles.states.disabled.wrapper;
    if (isClickable) {
      return selected
        ? styles.states.clickable.selected
        : styles.states.clickable.wrapper;
    }
    return styles.states.default.wrapper;
  },
  text: (
    disabled?: boolean,
    isClickable?: boolean,
    selected?: boolean,
  ): string => {
    if (disabled) return styles.states.disabled.text;
    if (isClickable) {
      return selected
        ? styles.states.clickable.selectedText
        : styles.states.clickable.text;
    }
    return styles.states.default.text;
  },
  icon: (
    disabled?: boolean,
    isClickable?: boolean,
    selected?: boolean,
  ): string => {
    if (disabled) return styles.states.disabled.icon;
    if (isClickable) {
      return selected
        ? styles.states.clickable.selectedIcon
        : styles.states.clickable.icon;
    }
    return styles.states.default.icon;
  },
};

function CloseButton({
  closeClickHandler,
  closeClassName,
  selected,
  isClickable,
  disabled = false,
}: CloseButtonPreview): JSX.Element {
  return (
    <button
      type="button"
      className={`cursor-default ${closeClassName}`}
      onClick={closeClickHandler}
      disabled={disabled}
      aria-label="Close"
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`${getStyles.icon(disabled, isClickable, selected)}`}
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M14.4691 5.45585C14.7307 5.19679 14.7328 4.77468 14.4737 4.51305C14.2147 4.25142 13.7926 4.24934 13.5309 4.5084L10.9696 7.04458L8.44844 4.51833C8.18835 4.25772 7.76624 4.2573 7.50563 4.51738C7.24502 4.77747 7.2446 5.19958 7.50469 5.46019L10.0222 7.98274L7.47664 10.5033C7.21501 10.7624 7.21293 11.1845 7.472 11.4461C7.73106 11.7077 8.15317 11.7098 8.4148 11.4507L10.964 8.9265L13.5212 11.4888C13.7813 11.7494 14.2034 11.7498 14.464 11.4897C14.7246 11.2296 14.725 10.8075 14.4649 10.5469L11.9115 7.98834L14.4691 5.45585Z"
        />
      </svg>
    </button>
  );
}

export const InfoChip = React.forwardRef<HTMLDivElement, InfoChipProps>(
  (
    {
      text,
      prefixElement,
      suffixElement,
      textClassName = '',
      wrapperClassName = '',
      closeClassName = '',
      closeClickHandler,
      clickHandler,
      isClickable = true,
      disabled = false,
      showCloseIcon = true,
      selected = false,
      dataTestId = 'defaultInfoChipTestId',
    },
    ref,
  ) => {
    const handleClick = (
      event:
        | React.MouseEvent<HTMLDivElement>
        | React.KeyboardEvent<HTMLDivElement>,
    ) => {
      clickHandler!(event);
    };

    const handleCloseClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();
      closeClickHandler!(event);
    };

    const keyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'Enter') {
        handleClick(e);
      }
    };

    function renderSuffixElement() {
      if (suffixElement) {
        return suffixElement;
      }
      if (showCloseIcon && !suffixElement) {
        return (
          <CloseButton
            closeClickHandler={handleCloseClick}
            closeClassName={closeClassName}
            selected={selected}
            isClickable={isClickable}
            disabled={disabled}
          />
        );
      }
      return null;
    }

    return (
      <div
        ref={ref}
        onClick={isClickable ? handleClick : undefined}
        className={`${styles.base.wrapper} ${getStyles.wrapper(disabled, isClickable, selected)} ${wrapperClassName}`}
        data-testid={dataTestId}
        role={isClickable ? 'button' : undefined}
        onKeyDown={isClickable ? keyDown : undefined}
        tabIndex={isClickable ? 0 : -1}
      >
        {prefixElement}
        <div
          className={`
            ${styles.base.text}
            ${getStyles.text(disabled, isClickable, selected)}
            ${showCloseIcon ? 'mr-1' : ''}
            ${prefixElement ? 'ml-1' : ''}
            ${textClassName}
          `}
        >
          {text}
        </div>
        {renderSuffixElement()}
      </div>
    );
  },
);
