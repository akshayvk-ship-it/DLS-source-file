import { CheckBoxProps } from '../SelectionControls/Checkbox';
import { Size } from '../SelectionControls/helper';

/**
 * Discriminant used to identify which variant of a context menu item is being used.
 * - `'selectable'`  — renders with a checkbox; tracks selected state.
 * - `'action'`      — a plain clickable row that triggers an action.
 * - `'expandable'`  — renders an arrow indicator and opens a nested submenu on click.
 * - `'separator'`   — a non-interactive visual divider, optionally with a group label.
 */
export type MenuItemActionType =
  | 'selectable'
  | 'action'
  | 'expandable'
  | 'separator';

/**
 * Shared base shape that all context menu item variants extend.
 * Never used directly — use `SelectableMenuItem`, `ActionMenuItem`, or `ExpandableMenuItem` instead.
 */
export interface BaseContextMenuItem {
  /**
   * Discriminant tag that determines the item's behaviour and rendered variant.
   * Must be one of `'selectable' | 'action' | 'expandable'`.
   */
  type: MenuItemActionType;

  /**
   * Human-readable text displayed inside the menu item row.
   * Also used for client-side search filtering (case-insensitive).
   */
  label: string;

  /**
   * Stable, unique string key for this item.
   * Used as the React list `key`, and as the identifier stored in the
   * selected-items `Set` for selectable items.
   */
  value: string;

  /**
   * Callback invoked when the user clicks or keyboard-activates the item.
   * For `expandable` items this fires before the submenu opens.
   * Receives `close` — call it to programmatically close the menu after the action.
   */
  onOptionClick?: (close: () => void) => void;

  /**
   * Optional React node rendered to the left of the label — typically an icon.
   * Receives no additional styling from the menu; size and colour are the
   * caller's responsibility.
   */
  prefixElement?: React.ReactNode;
}

/**
 * A menu item that renders a checkbox and tracks checked / unchecked state.
 * Toggling the item updates the shared `selectedItems` set and fires `onSelectOptions`.
 */
export interface SelectableMenuItem extends BaseContextMenuItem {
  /**
   * Narrows the discriminant to `'selectable'` for exhaustive type-checking.
   */
  type: 'selectable';

  /**
   * Controls the initial checked state of the associated `Checkbox`.
   * The component manages subsequent toggles internally via `selectedItems` state.
   */
  isSelected: boolean;

  /**
   * Optional React node rendered to the right of the label — e.g. a count badge
   * or status indicator. Receives no additional styling from the menu.
   */
  suffixElement?: React.ReactNode;

  /**
   * Optional React node rendered to the left of the label — typically an icon.
   * Receives no additional styling from the menu; size and colour are the
   * caller's responsibility.
   */
  prefixElement?: React.ReactNode;

  /**
   * Optional change handler forwarded to the underlying `<Checkbox>` input element.
   * Use this for edge cases requiring the raw `ChangeEvent` (e.g. `e.target.checked`).
   * For most cases prefer `onSelectedItemsChange` on the `ContextMenu` component instead.
   */
  onChange?: React.InputHTMLAttributes<HTMLInputElement>['onChange'];

  /**
   * Visual size of the `Checkbox` rendered inside the item row.
   * Accepts any `Size` value supported by the `Checkbox` component.
   * When omitted the checkbox defaults to `'sm'`.
   */
  size?: Size;

  /**
   * Additional props spread directly onto the underlying `<Checkbox>` component.
   * Use this to pass `aria-label`, `disabled`, or any other `CheckBoxProps`
   * not already covered by the item's own fields.
   */
  checkboxProps?: CheckBoxProps;
}

/**
 * A plain clickable menu item that triggers a one-shot action.
 * No selection state is tracked; clicking calls `onOptionClick` directly.
 */
export interface ActionMenuItem extends BaseContextMenuItem {
  /**
   * Narrows the discriminant to `'action'` for exhaustive type-checking.
   */
  type: 'action';

  /**
   * Optional React node rendered to the right of the label — e.g. a keyboard
   * shortcut hint (`⌘K`) or an external-link icon.
   * Receives no additional styling from the menu.
   */
  suffixElement?: React.ReactNode;
}

/**
 * A menu item that opens a nested `ContextMenu` (submenu) when activated.
 * A `ChevronRightIcon` is automatically appended to the right of the label.
 * Submenu positioning is collision-detected against the same container boundary
 * as the parent menu.
 */
export interface ExpandableMenuItem extends BaseContextMenuItem {
  /**
   * Narrows the discriminant to `'expandable'` for exhaustive type-checking.
   */
  type: 'expandable';

  /**
   * Configuration for the nested submenu panel opened by this item.
   * Uses the same `ContextMenuConfig` shape as the top-level `items` prop,
   * so `showHeader`, `showFooter`, and the item list are all defined together.
   */
  submenu: ContextMenuConfig;
}

/**
 * A non-interactive visual divider placed between groups of menu items.
 * Does not extend `BaseContextMenuItem` — it has no click handler, label text
 * for filtering, or prefix/suffix elements.
 *
 * Three visual variants:
 *
 * 1. **Plain line** — omit `label`
 *    ```
 *    ────────────────────────
 *    ```
 *
 * 2. **Title above line** — `label` + `labelPosition: 'above'` (default when label is set)
 *    ```
 *    View Options
 *    ────────────────────────
 *    ```
 *
 * 3. **Inline title** — `label` + `labelPosition: 'inline'`
 *    ```
 *    View Options ───────────
 *    ```
 *
 * @example
 * // Plain divider
 * { type: 'separator', value: 'sep-1' }
 *
 * // Group title above the line
 * { type: 'separator', value: 'view-group', label: 'View Options' }
 *
 * // Group title inline with the line
 * { type: 'separator', value: 'view-group', label: 'View Options', labelPosition: 'inline' }
 */
export interface SeparatorMenuItem {
  /** Narrows the discriminant to `'separator'`. */
  type: 'separator';

  /**
   * Stable, unique string used as the React list `key`.
   * Has no semantic meaning beyond identity.
   */
  value: string;

  /**
   * Optional group title rendered alongside the divider line.
   * When omitted, only a plain horizontal rule is shown.
   */
  label?: string;

  /**
   * Controls where the label sits relative to the divider line.
   * Only meaningful when `label` is provided.
   * - `'above'`  — label on its own line above the rule (default).
   * - `'inline'` — label on the left, rule extends to the right.
   * @default 'above'
   */
  labelPosition?: 'above' | 'inline';
}

/**
 * Union of all concrete menu item variants accepted by `ContextMenu`.
 * Use this type when you need to accept or return any kind of menu item.
 */
export type ContextMenuItem =
  | SelectableMenuItem
  | ActionMenuItem
  | ExpandableMenuItem
  | SeparatorMenuItem;

/**
 * Configuration object for a menu panel — used for both the top-level menu
 * and any nested submenus.
 *
 * @example
 * // Top-level menu with header and footer
 * items={{ showHeader: true, showFooter: true, contextMenuItems: [...] }}
 *
 * // Expandable item whose submenu has no header or footer
 * { type: 'expandable', submenu: { contextMenuItems: [...] }, ... }
 */
export interface ContextMenuConfig {
  /**
   * Whether this menu panel renders the search input header.
   * @default false
   */
  showHeader?: boolean;

  /**
   * Whether this menu panel renders the footer with primary and secondary action buttons.
   * @default false
   */
  showFooter?: boolean;

  /**
   * The list of items to display in this menu panel.
   * Supports a mix of `'selectable'`, `'action'`, and `'expandable'` items
   * in any order. Items are filtered by `searchValue` when `showHeader` is true.
   */
  contextMenuItems: ContextMenuItem[];
}

/**
 * Props accepted by the `ContextMenu` component.
 */
export interface ContextMenuProps {
  /**
   * Configuration for the menu panel — controls header, footer, and item list.
   * Submenus are configured via `showHeader`/`showFooter` on each `ExpandableMenuItem.submenu`.
   */
  items: ContextMenuConfig;

  /**
   * Controls how the menu panel is positioned.
   * - `'fixed'` (default) — renders with `position: fixed` using viewport coordinates.
   *   Works anywhere in the DOM; used for right-click context menus and submenus.
   * - `'absolute'` — renders with `position: absolute; top: 100%; left: 0`.
   *   The parent element must have `position: relative`. No coordinate calculation
   *   needed; ideal for button-triggered dropdowns.
   * @default 'fixed'
   */
  positionStrategy?: 'fixed' | 'absolute';

  /**
   * Externally controlled position for the menu panel (CSS `fixed` coordinates).
   * Only applies when `positionStrategy` is `'fixed'` (the default).
   * When supplied, the component **skips** its internal collision-clamping logic
   * and renders the panel exactly at `{ x, y }`. Intended for submenus or cases
   * where the caller has already computed the position.
   * When omitted, position is calculated from the mouse event inside `openMenu`.
   */
  position?: {
    /** Distance from the left edge of the viewport in pixels (CSS `left`). */
    x: number;
    /** Distance from the top edge of the viewport in pixels (CSS `top`). */
    y: number;
  };

  /**
   * Additional Tailwind / CSS class names applied to the `<div>` that wraps
   * the `SearchInput` (the element just inside the header area).
   */
  inputWrapperClassName?: string;

  /**
   * Additional Tailwind / CSS class names forwarded directly to the
   * `<input>` element inside `SearchInput`.
   */
  inputClassName?: string;

  /**
   * Minimum pixel clearance maintained between any edge of the menu panel
   * and the matching edge of its bounding container during collision clamping.
   * Increase this value to keep the menu further from container walls.
   * @default 16
   */
  safeMarginInPixels?: number;

  /**
   * Optional fixed pixel width for the menu panel.
   * When omitted the panel sizes to its content and the actual rendered width
   * is read from the DOM for all collision/position calculations.
   */
  width?: number;

  /**
   * Text label for the primary (left-aligned) footer action button.
   * @default "Apply"
   */
  primaryButtonLabel?: string;

  /**
   * Text label for the secondary (right-aligned) footer action button.
   * @default "Cancel"
   */
  secondaryButtonLabel?: string;

  /**
   * Callback fired when the user clicks the primary footer button.
   * Typically used to confirm and apply the current selection.
   */
  onPrimaryButtonClick?: () => void;

  /**
   * Callback fired when the user clicks the secondary footer button.
   * Typically used to dismiss the menu without applying changes.
   */
  onSecondaryButtonClick?: () => void;

  /**
   * Forwards the `autocomplete` attribute to the underlying `<input>` element.
   * Set to `true` to allow the browser to suggest previously entered values.
   * @default false
   */
  searchAutoComplete?: boolean;

  /**
   * Additional Tailwind / CSS class names applied to the outermost menu
   * panel `<div>` (the element with `role="menu"`).
   */
  wrapperClassName?: string;

  /**
   * Callback fired after every selectable toggle.
   * Receives the **complete filtered list** of items whose `isSelected` flag
   * is currently `true` — not just the item that changed.
   * Only `selectable`-type items are included in the array.
   */
  onSelectOptions?: (selectedItems: ContextMenuItem[]) => void;

  /**
   * Controlled selected-items set. When provided the component operates in
   * controlled mode — the caller owns the selection state.
   * Pair with `onSelectedItemsChange` to keep the set in sync.
   * When omitted the component manages selection internally.
   */
  selectedItems?: Set<string>;

  /**
   * Called whenever the user toggles a selectable item.
   * Receives the **new** complete `Set<string>` of selected values.
   * Only relevant when `selectedItems` is controlled by the caller.
   */
  onSelectedItemsChange?: (selected: Set<string>) => void;

  /**
   * Internal prop used to chain close behaviour across nested submenus.
   * When a submenu item calls `close()`, this propagates up to close all
   * ancestor menus in the tree. Do not set this prop manually.
   * @internal
   */
  onCloseAll?: () => void;

  /**
   * Controlled open state. When provided the component operates in controlled
   * mode — the caller owns the visibility. Pair with `position` to place the
   * menu at a specific coordinate (e.g. below a button).
   * When omitted the component manages open state internally via `openMenu` /
   * `closeMenu` on the imperative ref.
   */
  open?: boolean;

  /**
   * Called when the mouse enters the menu panel.
   * Used internally to keep a submenu open while the cursor is inside it.
   * Can also be used by callers for custom hover behaviour.
   */
  onMouseEnter?: (e: React.MouseEvent<HTMLDivElement>) => void;

  /**
   * Called when the mouse leaves the menu panel.
   * Used internally to close a submenu when the cursor moves away.
   * Can also be used by callers for custom hover behaviour.
   */
  onMouseLeave?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

/**
 * Represents an `{ x, y }` coordinate pair used to position the menu panel
 * via CSS `fixed` layout (`left` / `top`).
 */
export interface ContextMenuPosition {
  /** Distance from the left edge of the viewport in pixels (CSS `left`). */
  x: number;

  /** Distance from the top edge of the viewport in pixels (CSS `top`). */
  y: number;
}

/**
 * Shape of the imperative handle exposed via `React.forwardRef` on `ContextMenu`.
 * Obtain it by passing a `ref` to the component and calling methods on `ref.current`.
 *
 * @example
 * const menuRef = useRef<ContextMenuRef>(null);
 * <div onContextMenu={(e) => { e.preventDefault(); menuRef.current?.openMenu(e); }}>
 *   <ContextMenu ref={menuRef} items={{ contextMenuItems: items }} width={220} />
 * </div>
 */
export type ContextMenuRef = {
  /**
   * Opens the menu, computing its position from `e.clientX / e.clientY` and
   * clamping it within the bounding rect of `e.currentTarget`.
   * Call this inside an `onContextMenu` handler after `e.preventDefault()`.
   */
  openMenu: (e: React.MouseEvent<Element>) => void;

  /**
   * Closes the menu and resets all internal state:
   * selected items, search text, submenu visibility, and position.
   */
  closeMenu: () => void;

  /**
   * Direct reference to the menu panel's root `<div>` DOM node.
   * Useful for measuring dimensions or managing focus imperatively.
   */
  ref: HTMLDivElement | null;
};

/**
 * Props accepted by the internal `MenuItem` primitive used to render
 * each row inside a `ContextMenu` panel.
 */
export interface MenuItemProps {
  /**
   * Content rendered inside the menu item row — typically a label span
   * and an optional suffix span laid out with `flex justify-between`.
   */
  children: React.ReactNode;

  /**
   * Handler called when the item is clicked with a mouse or activated
   * with the keyboard (`Enter` / `Space`). Receives the originating
   * event so callers can inspect target geometry (e.g. for submenu positioning).
   */
  onClick?: (
    e: React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>,
  ) => void;

  /**
   * Additional Tailwind / CSS class names applied to the inner interactive
   * element (the element that receives `role`, focus styles, and padding).
   */
  menuItemClassName?: string;

  /**
   * Called when the pointer enters the menu item's root element.
   * Used internally to highlight the hovered row and trigger submenu
   * open behaviour on `expandable` items. Can also be used by callers
   * for custom hover effects.
   */
  onMouseEnter?: (e: React.MouseEvent<HTMLDivElement>) => void;

  /**
   * Called when the pointer leaves the menu item's root element.
   * Used internally to clear the hovered row highlight and begin the
   * close timer for any open submenu. Can also be used by callers for
   * custom hover effects.
   */
  onMouseLeave?: (e: React.MouseEvent<HTMLDivElement>) => void;
}
