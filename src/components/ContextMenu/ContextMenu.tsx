import React, { useEffect, useState } from 'react';
import {
  ContextMenuConfig,
  ContextMenuItem,
  ContextMenuPosition,
  ContextMenuProps,
  ContextMenuRef,
  ExpandableMenuItem,
  SelectableMenuItem,
} from './types';
import { MenuItem } from './MenuItem';
import { Checkbox } from '../SelectionControls/Checkbox';
import { ChevronRightIcon } from '../Icons';
import { SearchInput } from '../Input';
import { Button } from '../Button';

// eslint-disable-next-line import/prefer-default-export
export const ContextMenu = React.forwardRef<ContextMenuRef, ContextMenuProps>(
  (
    {
      items,
      searchAutoComplete = false,
      position,
      positionStrategy = 'fixed',
      wrapperClassName = '',
      inputClassName = '',
      width,
      primaryButtonLabel,
      secondaryButtonLabel,
      safeMarginInPixels = 16,
      onPrimaryButtonClick,
      onSecondaryButtonClick,
      inputWrapperClassName = '',
      onSelectOptions,
      onMouseEnter,
      onMouseLeave,
      selectedItems: controlledSelectedItems,
      onSelectedItemsChange,
      open: controlledOpen,
      onCloseAll,
    },
    ref,
  ) => {
    const { showHeader = false, showFooter = false, contextMenuItems } = items;

    const isOpenControlled = controlledOpen !== undefined;
    const [internalOpen, setInternalOpen] = useState<boolean>(false);
    const open: boolean = isOpenControlled ? !!controlledOpen : internalOpen;

    const setOpen = (value: boolean) => {
      if (!isOpenControlled) setInternalOpen(value);
    };
    const [internalSelectedItems, setInternalSelectedItems] = useState<
      Set<string>
    >(
      () =>
        new Set(
          contextMenuItems
            .filter(
              (i): i is SelectableMenuItem =>
                i.type === 'selectable' && i.isSelected,
            )
            .map((i) => i.value),
        ),
    );

    const isControlled = controlledSelectedItems !== undefined;
    const selectedItems = isControlled
      ? controlledSelectedItems
      : internalSelectedItems;

    const setSelectedItems = (updated: Set<string>) => {
      if (!isControlled) setInternalSelectedItems(updated);
      onSelectedItemsChange?.(updated);
    };

    const [searchValue, setSearchValue] = useState<string>('');
    const [menuPosition, setMenuPosition] = useState<ContextMenuPosition>({
      x: 0,
      y: 0,
    });

    const [submenuConfig, setSubmenuConfig] =
      useState<ContextMenuConfig | null>(null);
    const [containerRect, setContainerRect] = useState<DOMRect | null>(null);
    const [submenuPosition, setSubmenuPosition] = useState({
      x: -9999,
      y: -9999,
    });
    const [submenuOpen, setSubmenuOpen] = useState(false);
    const [submenuAnchorRect, setSubmenuAnchorRect] = useState<DOMRect | null>(
      null,
    );
    const [submenuPositioned, setSubmenuPositioned] = useState(false);
    const [isPositioned, setIsPositioned] = useState(false);
    const [currentSelectedItem, setCurrentSelectedItem] = useState<
      string | null
    >(null);

    const divRef = React.useRef<HTMLDivElement | null>(null);
    const submenuRef = React.useRef<ContextMenuRef | null>(null);

    const closeSubmenu = () => {
      setSubmenuOpen(false);
      setSubmenuConfig(null);
      setSubmenuAnchorRect(null);
      setSubmenuPositioned(false);
      setCurrentSelectedItem(null);
    };

    const GAP = 8;

    const clampPosition = (
      x: number,
      y: number,
      menuWidth: number,
      menuHeight: number,
      rect: DOMRect | null,
    ) => {
      if (!rect) return { x, y };

      const minX = rect.left + safeMarginInPixels;
      const minY = rect.top + safeMarginInPixels;

      const maxX = rect.right - menuWidth - safeMarginInPixels;
      const maxY = rect.bottom - menuHeight - safeMarginInPixels;

      return {
        x: Math.max(minX, Math.min(x, maxX)),
        y: Math.max(minY, Math.min(y, maxY)),
      };
    };

    const openMenu = (e: React.MouseEvent<Element>) => {
      const container = e.currentTarget as HTMLElement;
      const rect = container.getBoundingClientRect();

      setContainerRect(rect);
      setSubmenuOpen(false);
      setSubmenuConfig(null);
      setSubmenuAnchorRect(null);
      setSubmenuPositioned(false);
      setCurrentSelectedItem(null);

      const menuWidth = width ?? divRef.current?.offsetWidth ?? 220;
      const menuHeight = divRef.current?.offsetHeight ?? 300;

      const safePos = clampPosition(
        e.clientX,
        e.clientY,
        menuWidth,
        menuHeight,
        rect,
      );

      setMenuPosition(safePos);
      setIsPositioned(false);
      setOpen(true);
    };

    const closeMenu = () => {
      setOpen(false);
      setSubmenuConfig(null);
      setSubmenuOpen(false);
      setIsPositioned(false);
    };

    // Closes this menu and all ancestor menus in the tree.
    const handleCloseAll = () => {
      closeMenu();
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      if (onCloseAll) (onCloseAll as () => void)();
    };

    React.useImperativeHandle(ref, () => ({
      get ref() {
        return divRef.current;
      },
      openMenu,
      closeMenu,
    }));

    const toggleItem = (item: ContextMenuItem) => {
      const updated = new Set(selectedItems);

      if (updated.has(item.value)) {
        updated.delete(item.value);
      } else {
        updated.add(item.value);
      }

      setSelectedItems(updated);

      const updatedItems = contextMenuItems.map((i) => {
        if (i.type === 'selectable') {
          return {
            ...i,
            isSelected: updated.has(i.value),
          };
        }
        return i;
      });

      if (onSelectOptions) {
        const selected = updatedItems.filter(
          (i) => i.type === 'selectable' && i.isSelected,
        );
        onSelectOptions(selected);
      }
    };

    const openSubmenu = (
      e: React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>,
      item: ExpandableMenuItem,
    ) => {
      const rect = e.currentTarget.getBoundingClientRect();
      setSubmenuConfig(item.submenu);
      setSubmenuAnchorRect(rect);
      setSubmenuPositioned(false);
      setSubmenuPosition({ x: -9999, y: -9999 });
      setSubmenuOpen(true);
    };

    const handleSearchInputChange = (
      e: React.ChangeEvent<HTMLInputElement>,
    ) => {
      setSearchValue(e.target.value);
    };

    const filteredItems = contextMenuItems.filter((item) => {
      if (item.type === 'separator') return true;
      return item.label
        .toLowerCase()
        .includes(searchValue.trim().toLowerCase());
    });

    // After submenu renders at off-screen position, measure its actual
    // dimensions and calculate the correct position.
    useEffect(() => {
      if (!submenuOpen || !submenuAnchorRect || !submenuRef.current?.ref)
        return;

      const el = submenuRef.current.ref;
      const actualWidth = el.offsetWidth;
      const actualHeight = el.offsetHeight;
      const anchor = submenuAnchorRect;

      let x = anchor.right + GAP;
      let y = anchor.top;

      const viewportHeight = window.innerHeight;

      // flip upward if submenu overflows viewport bottom
      if (y + actualHeight > viewportHeight - 10) {
        y = Math.max(10, anchor.bottom - actualHeight);
      }

      if (containerRect) {
        // flip left if not enough room on the right
        if (x + actualWidth > containerRect.right - safeMarginInPixels) {
          x = anchor.left - actualWidth - GAP;
        }
        x = Math.max(
          containerRect.left + safeMarginInPixels,
          Math.min(x, containerRect.right - actualWidth - safeMarginInPixels),
        );
      } else {
        if (x + actualWidth > window.innerWidth - safeMarginInPixels) {
          x = anchor.left - actualWidth - GAP;
        }
        x = Math.max(safeMarginInPixels, x);
      }

      setSubmenuPosition({ x, y });
      setSubmenuPositioned(true);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [submenuOpen, submenuAnchorRect]);

    useEffect(() => {
      if (open && divRef.current && containerRect) {
        const menuWidth = divRef.current.offsetWidth;
        const menuHeight = divRef.current.offsetHeight;

        const newPos = clampPosition(
          menuPosition.x,
          menuPosition.y,
          menuWidth,
          menuHeight,
          containerRect,
        );

        if (newPos.x !== menuPosition.x || newPos.y !== menuPosition.y) {
          setMenuPosition(newPos);
        }
        setIsPositioned(true);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, containerRect, width]);

    const shouldHide = (() => {
      if (positionStrategy === 'absolute') return !open;
      if (isOpenControlled) return !open;
      return !(open || position);
    })();

    if (shouldHide) {
      return null;
    }

    const positionStyle =
      positionStrategy === 'absolute'
        ? ({ position: 'absolute', top: '100%', left: 0 } as const)
        : ({
            position: 'fixed',
            left: position?.x ?? menuPosition.x,
            top: position?.y ?? menuPosition.y,
          } as const);

    const isVisible =
      positionStrategy === 'absolute' ? true : isPositioned || !!position;

    return (
      <>
        <div
          className={`${wrapperClassName} bg-fill-fill border-border-border-light inline-flex flex-col gap-2 overflow-hidden rounded-lg border shadow-[0_1px_3px_0_rgba(0,0,0,0.1),0_1px_2px_0_rgba(27,32,41,0.06)] ${isVisible ? 'visible' : 'invisible'} w-fit`}
          ref={divRef}
          role="menu"
          tabIndex={-1}
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          style={{
            ...(width ? { width: `${width}px` } : {}),
            ...positionStyle,
          }}
        >
          {showHeader && (
            <div className="border-border-border-light w-full overflow-hidden border-b p-4">
              <SearchInput
                wrapperClassName={`!w-full flex-shrink-0 !shadow-none ${inputWrapperClassName}`}
                label=""
                inputWrapperClassName="!w-full"
                inputClassName={`${inputClassName} !rounded-lg !w-full`}
                value={searchValue}
                placeholder="Search"
                boxSize="sm"
                onSuffixClick={() => setSearchValue('')}
                name="contextMenuSearch"
                autoComplete={searchAutoComplete ? 'on' : 'off'}
                onChange={handleSearchInputChange}
              />
            </div>
          )}
          <div>
            {searchValue && filteredItems.length === 0 && (
              <div className="text-text-light p-4 text-center">
                No Records Found
              </div>
            )}
            {filteredItems.map((item) => {
              switch (item.type) {
                case 'action':
                  return (
                    <MenuItem
                      key={item.value}
                      onClick={() => item.onOptionClick?.(handleCloseAll)}
                      onMouseEnter={closeSubmenu}
                    >
                      <span className="label-small text-text-text flex items-center gap-2 break-words">
                        {item.prefixElement}
                        {item.label}
                      </span>
                      {item.suffixElement && (
                        <span className="ml-auto">{item.suffixElement}</span>
                      )}
                    </MenuItem>
                  );

                case 'selectable':
                  return (
                    <MenuItem
                      key={item.value}
                      onClick={() => toggleItem(item)}
                      onMouseEnter={closeSubmenu}
                    >
                      <span className="label-small text-text-text flex items-center gap-2 break-words">
                        <Checkbox
                          {...item.checkboxProps}
                          checked={selectedItems.has(item.value)}
                          id={item.value}
                          size={item.size || 'sm'}
                          onChange={item.onChange ?? (() => {})}
                        />
                        {item.prefixElement}
                        {item.label}
                      </span>
                      {item.suffixElement && (
                        <span className="ml-auto">{item.suffixElement}</span>
                      )}
                    </MenuItem>
                  );

                case 'expandable':
                  return (
                    <MenuItem
                      key={item.value}
                      onClick={() => {
                        item.onOptionClick?.(handleCloseAll);
                      }}
                      onMouseEnter={(e) => {
                        openSubmenu(e, item);
                        setCurrentSelectedItem(`${item.value}`);
                      }}
                      menuItemClassName={`${currentSelectedItem === item.value ? 'bg-fill-pressed-dark' : ''}`}
                    >
                      <span className="label-small text-text-text flex items-center gap-2 break-words">
                        {item.prefixElement}
                        {item.label}
                      </span>
                      <span className="ml-auto">
                        <ChevronRightIcon />
                      </span>
                    </MenuItem>
                  );

                case 'separator':
                  return (
                    <div key={item.value} role="separator" className="p-2">
                      {item.label && item.labelPosition !== 'inline' && (
                        <span className="heading-6  text-text-light  mb-1 block px-2 font-semibold">
                          {item.label}
                        </span>
                      )}
                      {item.label && item.labelPosition === 'inline' ? (
                        <div className="flex items-center gap-2">
                          <span className="label-small text-text-light font-medium">
                            {item.label}
                          </span>
                          <div className="border-border-border-light flex-1 border-b" />
                        </div>
                      ) : (
                        <div className="border-border-border-light border-b" />
                      )}
                    </div>
                  );

                default:
                  return null;
              }
            })}
          </div>
          {showFooter && (
            <div className="border-border-border-light flex items-center justify-between gap-2 border-t p-2">
              <Button
                hierarchy="Primary"
                size="sm"
                type="button"
                className="flex-1"
                label={primaryButtonLabel ?? 'Apply'}
                onClick={onPrimaryButtonClick}
              />
              <Button
                hierarchy="Secondary"
                size="sm"
                type="button"
                label={secondaryButtonLabel ?? 'Cancel'}
                onClick={onSecondaryButtonClick}
              />
            </div>
          )}
        </div>
        {submenuOpen && submenuConfig && (
          <ContextMenu
            items={submenuConfig}
            width={width}
            wrapperClassName={`${wrapperClassName} ${submenuPositioned ? '' : '!invisible'}`}
            onSelectOptions={onSelectOptions}
            selectedItems={controlledSelectedItems}
            onSelectedItemsChange={onSelectedItemsChange}
            primaryButtonLabel={primaryButtonLabel}
            secondaryButtonLabel={secondaryButtonLabel}
            onPrimaryButtonClick={onPrimaryButtonClick}
            onSecondaryButtonClick={onSecondaryButtonClick}
            onCloseAll={handleCloseAll}
            ref={submenuRef}
            position={submenuPosition}
          />
        )}
      </>
    );
  },
);
