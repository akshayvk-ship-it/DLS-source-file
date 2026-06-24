/* eslint-disable import/prefer-default-export */
import { useEffect, RefObject, MutableRefObject } from 'react';

/**
 * Triggers a callback when the user clicks outside the given element.
 *
 * @param ref - Target element reference
 * @param handleOnClick - Callback invoked on outside click/touch
 */
export function useOutsideClick<T extends HTMLElement>(
  ref: RefObject<T>,
  handleOnClick: (event: MouseEvent | TouchEvent) => void,
) {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      const el = ref.current;
      if (!el || el.contains(event.target as Node)) return;
      handleOnClick(event);
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handleOnClick]);
}

/**
 * Closes the currently open UI element (dropdown, panel, popover, etc.) when clicking
 * outside both the content and its corresponding trigger element.
 *
 * Designed for situations where multiple triggers exist (e.g. many columns in a table),
 * and the active trigger is looked up via a Map using the current open identifier.
 *
 * Ignores clicks on the active trigger to allow clean toggle behavior.
 *
 * @param isOpen - Identifier of the currently open element (usually string key) or null
 * @param onClose - Function to call when clicking outside (usually closes the element)
 * @param popupRef - Ref to the visible content / popup element
 * @param triggerMapRef - Mutable ref containing Map<string, HTMLElement> where keys match possible isOpen values
 */
export function useCloseOnOutsideClickWithTriggerMap({
  isOpen,
  onClose,
  popupRef,
  triggerMapRef,
}: {
  isOpen: string | null;
  onClose: () => void;
  popupRef: RefObject<HTMLElement>;
  triggerMapRef: MutableRefObject<Map<string, HTMLElement>>;
}) {
  useEffect(() => {
    if (!isOpen) return undefined;

    const handleOutsideClick = (event: MouseEvent | TouchEvent) => {
      const popup = popupRef.current;
      const trigger = triggerMapRef.current.get(isOpen);

      // Safety: skip if refs are not available
      if (!popup || !trigger) return;

      const target = event.target as Node;

      // Click inside popup or on the active trigger → do not close
      if (popup.contains(target) || trigger.contains(target)) {
        return;
      }

      onClose();
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('touchstart', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
    };
  }, [isOpen, onClose, popupRef, triggerMapRef]);
}
