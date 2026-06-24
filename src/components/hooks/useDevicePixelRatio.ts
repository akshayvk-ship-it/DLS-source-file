/* eslint-disable import/prefer-default-export */
import { useEffect, useState } from 'react';

/**
 * Tracks device pixel ratio for rendering in Firefox and other browsers.
 * This hook monitors the device pixel ratio and updates on window resize events,
 * ensuring that grid lines and other SVG elements render pixel-perfectly.
 *
 * @returns {number} The current device pixel ratio
 */

export function useDevicePixelRatio(): number {
  const [devicePixelRatio, setDevicePixelRatio] = useState(1);

  useEffect(() => {
    const update = () => setDevicePixelRatio(window.devicePixelRatio || 1);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  return devicePixelRatio;
}
