/* global globalThis */

import { Signal } from './snapFramework.js';

// Extracting variables and dependencies that are provided by index.html
export const PUBLIC_URL = globalThis.PUBLIC_URL;
export const Prism = globalThis.Prism;

// This is used to switch how text is wrapped
export const MOBILE_SCREEN_SIZE = '900px';
export const isMobileScreenSize$ = new Signal(false);
const mobileScreenSizeMedia = matchMedia(`(max-width: ${MOBILE_SCREEN_SIZE})`);
mobileScreenSizeMedia.addEventListener('change', event => {
  isMobileScreenSize$.set(event.matches);
});
isMobileScreenSize$.set(mobileScreenSizeMedia.matches);
