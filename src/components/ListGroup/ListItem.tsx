import React, { forwardRef, useCallback, memo } from 'react';
import { ListItemProps } from './types';
import { CheckboxBase } from '../SelectionControls/Checkbox';
import { RadioButtonBase } from '../SelectionControls/RadioButton';
import { InfoChip } from '../Chips';

const ListItemComponent = memo(
  forwardRef<HTMLDivElement, ListItemProps>(
    (
      {
        item,
        isSelected,
        selectionType,
        showChip = false,
        showSubText = false,
        showIcon = false,
        componentSize,
        onSelectionChange,
        onItemClick,
        dataTestId,
        isFirst,
        isLast,
        itemClassName = '',
        textClassName = '',
        subTextClassName = '',
        groupName,
      },
      ref,
    ) => {
      const isItemActive = item.state === 'active';
      const isDisabled = item.state === 'disabled';
      const hasSelectionCapability = selectionType !== 'default';
      const isSingleSelectMode = selectionType === 'radio';
      const isMultiSelectMode = ['checkbox', 'chip', 'icon'].includes(
        selectionType,
      );
      const isMobile = componentSize === 'sm';

      const handleItemClick = useCallback(() => {
        const isRadioSelected = selectionType === 'radio' && isSelected;

        if (!isDisabled && !isRadioSelected) {
          onItemClick(item);
        }
      }, [selectionType, isSelected, isDisabled, onItemClick, item]);

      const handleSelectionChange = useCallback(() => {
        if (!isDisabled && hasSelectionCapability) {
          onSelectionChange(item);
        }
      }, [isDisabled, hasSelectionCapability, onSelectionChange, item]);

      const handleKeyDown = useCallback(
        (e: React.KeyboardEvent) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleItemClick();
          }
        },
        [handleItemClick],
      );

      const renderSelectionComponent = useCallback(() => {
        const sharedProps = {
          size: componentSize,
          checked: isSelected,
          disabled: isDisabled,
          onChange: handleSelectionChange,
        };

        if (selectionType === 'checkbox') {
          return (
            <CheckboxBase
              {...sharedProps}
              dataTestId={`${dataTestId}-checkbox-${item.id}`}
            />
          );
        }

        if (selectionType === 'radio') {
          return (
            <RadioButtonBase
              {...sharedProps}
              name={groupName || `${dataTestId}-radio-group`}
              value={item.id}
              dataTestId={`${dataTestId}-radio-${item.id}`}
            />
          );
        }

        return null;
      }, [
        selectionType,
        componentSize,
        isSelected,
        isDisabled,
        handleSelectionChange,
        dataTestId,
        item.id,
        groupName,
      ]);

      const isShowIcon = showIcon && !!item.prefixIcon;
      const isMobileSelectionCompatible =
        isMobile &&
        hasSelectionCapability &&
        (selectionType === 'checkbox' || selectionType === 'radio');

      const showPrefix = !!(isShowIcon || isMobileSelectionCompatible);

      const renderPrefixContent = useCallback(
        (isIcon: boolean) => {
          const elements: React.ReactNode[] = [];

          if (showIcon && !!item.prefixIcon && isIcon) {
            const isLogo = !!item.isLogo;

            const iconStyle =
              isLogo && isDisabled
                ? { filter: 'grayscale(50%)', opacity: 0.34 }
                : undefined;

            const isActiveState = isSelected ? 'active' : 'default';

            elements.push(
              <div className="flex-shrink-0" style={iconStyle}>
                {React.cloneElement(item.prefixIcon, {
                  variant: !isLogo ? item.state || isActiveState : undefined,
                  isMobile,
                })}
              </div>,
            );
          }

          if (isMobileSelectionCompatible) {
            elements.push(renderSelectionComponent());
          }

          return elements;
        },
        [
          showIcon,
          item.prefixIcon,
          item.isLogo,
          item.state,
          isMobileSelectionCompatible,
          isDisabled,
          isSelected,
          isMobile,
          renderSelectionComponent,
        ],
      );

      const isShowSubText = showSubText && item.subText;
      const isSuffixIsNotMobile =
        !isMobile &&
        hasSelectionCapability &&
        (selectionType === 'checkbox' || selectionType === 'radio');

      const isShowChip = showChip && item.chipText;

      const isShowSuffix = !!(
        isShowSubText ||
        isShowChip ||
        isSuffixIsNotMobile
      );

      const renderSuffixContent = useCallback(() => {
        const elements: React.ReactNode[] = [];

        if (isShowSubText) {
          elements.push(
            <div
              className={` ${subTextClassName} ${isMobile ? 'label-small font-medium' : 'label-medium'} ${isDisabled ? 'text-text-disabled' : 'text-text-light'}`}
            >
              {item.subText}
            </div>,
          );
        }

        if (showChip && item.chipText) {
          elements.push(
            <button
              className="cursor-pointer"
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleSelectionChange();
              }}
              tabIndex={0}
              onKeyDown={(e) => {
                if (isDisabled) return;
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleSelectionChange();
                }
              }}
            >
              <InfoChip
                text={item.chipText}
                showCloseIcon={false}
                disabled={isDisabled}
                selected={isSelected || isItemActive}
                dataTestId={`${dataTestId}-chip-${item.id}`}
                wrapperClassName="!cursor-default"
                clickHandler={handleItemClick}
              />
            </button>,
          );
        }

        if (isSuffixIsNotMobile) {
          elements.push(renderSelectionComponent());
        }

        return elements;
      }, [
        isShowSubText,
        showChip,
        item.chipText,
        item.subText,
        item.id,
        isSuffixIsNotMobile,
        subTextClassName,
        isMobile,
        isDisabled,
        isSelected,
        isItemActive,
        dataTestId,
        handleItemClick,
        handleSelectionChange,
        renderSelectionComponent,
      ]);

      const getItemClasses = useCallback((): string => {
        const sizeClasses = isMobile
          ? 'px-4 py-[0.938rem]'
          : 'px-6 py-[1.125rem]';

        return [
          'flex items-center',
          sizeClasses,
          isDisabled
            ? '!bg-fill-disabled text-text-disabled cursor-not-allowed'
            : '',
          isSelected || isItemActive ? 'bg-fill-action-light' : 'bg-fill-fill',
          isFirst ? 'rounded-t-lg' : '',
          isLast
            ? 'rounded-b-lg border-b-0'
            : 'border-b border-border-border-light',
          itemClassName,
        ]
          .filter(Boolean)
          .join(' ');
      }, [
        isMobile,
        isDisabled,
        isSelected,
        isItemActive,
        isFirst,
        isLast,
        itemClassName,
      ]);

      const getAriaRole = useCallback((): string => {
        if (isSingleSelectMode) return 'radio';
        if (isMultiSelectMode) return 'checkbox';

        return 'listitem';
      }, [isSingleSelectMode, isMultiSelectMode]);

      const getTextClasses = useCallback((): string => {
        const sizeClasses = isMobile ? 'label-small' : 'label-medium';

        let colorClasses = '';

        if (isDisabled) {
          colorClasses = 'text-text-disabled';
        } else if (isItemActive || isSelected) {
          colorClasses = 'text-text-action';
        } else {
          colorClasses = 'text-text-text';
        }

        return `${sizeClasses} ${colorClasses} ${textClassName}`;
      }, [isMobile, isDisabled, isItemActive, isSelected, textClassName]);

      return (
        <div
          className={`flex w-full gap-4 ${getItemClasses()} ${!(isDisabled || isItemActive || isSelected) ? 'hover:bg-fill-hover-light' : ''}`}
          onClick={handleItemClick}
          role={getAriaRole()}
          aria-selected={hasSelectionCapability ? isSelected : undefined}
          aria-disabled={isDisabled}
          tabIndex={isDisabled ? -1 : 0}
          onKeyDown={handleKeyDown}
          ref={ref}
          data-testid={`${dataTestId}-item-${item.id}`}
        >
          {showPrefix ? (
            <div className="flex items-center justify-between gap-4">
              {renderPrefixContent(!!isShowIcon)}
            </div>
          ) : null}

          <div className="flex flex-1 justify-between">
            <div className={getTextClasses()}>{item.text}</div>
          </div>

          {isShowSuffix ? (
            <div className="ml-auto flex-shrink-0">
              <div className="flex items-center justify-end gap-4">
                {renderSuffixContent()}
              </div>
            </div>
          ) : null}
        </div>
      );
    },
  ),
);

ListItemComponent.displayName = 'ListItemComponent';

export default ListItemComponent;
