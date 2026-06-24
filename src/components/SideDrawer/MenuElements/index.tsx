import { memo, useEffect, useRef, useState } from 'react';
import { MenuDropdown, MenuDropdownProps } from '../MenuDropdown';
import { NestedMenu } from '../types';
import { flattenArray } from '../utils';

export interface NotificationsList {
  [x: string]: number;
}

export interface MenuElementsProps
  extends Omit<MenuDropdownProps, 'isExpanded' | 'active' | 'dropdownKey'> {
  menu: NestedMenu[];
  currentPaddingNested: number;
  isSidebarVisible: boolean;
  menuWrapperClassName?: string;
  activeValueToMatch: string | number;
  activeCurrentValue: string | number;
  notificationList: NotificationsList | undefined;
  keyName: string | number;
  isActiveElement?: boolean;
}

function MenuElement({
  menu,
  activeCurrentValue,
  isExpandable,
  title,
  customIcon,
  showIcon,
  menuDropdownClassName,
  currentPaddingNested,
  customInlineStyle,
  isSidebarVisible,
  menuWrapperClassName = '',
  activeValueToMatch,
  menuClickHandler,
  notificationList,
  keyName,
  isActiveElement,
}: MenuElementsProps) {
  const isInitialRender = useRef(true);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (
      isInitialRender.current &&
      !isExpanded &&
      isSidebarVisible &&
      menu.length !== 0 &&
      isExpandable &&
      activeValueToMatch
    ) {
      const checkData = flattenArray(menu);

      if (checkData.includes(activeValueToMatch as string)) {
        setIsExpanded(true);
      }
    }

    isInitialRender.current = false;
  }, [activeValueToMatch, isExpandable, isExpanded, isSidebarVisible, menu]);

  const renderExpanded =
    isExpanded &&
    menu &&
    menu?.map((currentMenu) => (
      <MenuElement
        key={currentMenu.keyName}
        isExpandable={currentMenu.isExpandable}
        menu={currentMenu.nestedData || []}
        title={currentMenu.title}
        showIcon={currentMenu.showIcon}
        activeValueToMatch={activeValueToMatch}
        activeCurrentValue={currentMenu.activeElementValue}
        customIcon={currentMenu.menuIcon}
        menuDropdownClassName={currentMenu.menuDropdownClassName}
        currentPaddingNested={currentPaddingNested + 0.5}
        customInlineStyle={{
          paddingLeft: `${16 * currentPaddingNested}px`,
          ...currentMenu.customInlineStyle,
        }}
        isSidebarVisible={isSidebarVisible}
        menuClickHandler={menuClickHandler}
        notificationList={notificationList}
        keyName={currentMenu.keyName}
        isActiveElement={currentMenu.isActiveElement}
      />
    ));

  return (
    <div
      className={`${menuWrapperClassName} ${currentPaddingNested === 1.5 ? 'px-4' : ''} ${isExpandable ? 'pt-1' : 'py-1'} ${!isSidebarVisible ? 'flex flex-col items-center justify-center px-0 !pt-0' : ''}`}
    >
      <MenuDropdown
        active={
          isActiveElement ??
          (activeValueToMatch && activeCurrentValue
            ? activeValueToMatch === activeCurrentValue
            : false)
        }
        menuClickHandler={(e, currentKey) => {
          menuClickHandler(e, currentKey);
          if (isSidebarVisible) {
            setIsExpanded((prevExpand) => !prevExpand);
          }
        }}
        title={title}
        customIcon={customIcon}
        showIcon={showIcon}
        isExpanded={isExpanded}
        isExpandable={isExpandable}
        showNotification={notificationList?.[keyName]}
        menuDropdownClassName={menuDropdownClassName}
        customInlineStyle={customInlineStyle}
        isSidebarVisible={isSidebarVisible}
        dropdownKey={activeCurrentValue as string}
      />
      {isExpandable && renderExpanded}
    </div>
  );
}

const MenuElements = memo(MenuElement);

export { MenuElements };
