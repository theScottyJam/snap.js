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

// --- Code Formatting --- //

export function prepareCodeExampleForViewing(code) {
  return code
    .replaceAll("%FRAMEWORK_LOCATION%", `./snapFramework.js`)
    .replaceAll("%ASSETS%", `./assets`);
}

export function prepareCodeExampleForRunning(code) {
  return code
    .replaceAll("%FRAMEWORK_LOCATION%", `${PUBLIC_URL}/FrameworkPage/snapFramework.js`)
    .replaceAll("%ASSETS%", `${PUBLIC_URL}/assets`);
}

// --- Internal Linking --- //

const uniqueIdsToElements = new Map();

export function registerInternalLinkTarget(uniqueId, element) {
  console.assert(!uniqueIdsToElements.has(element));
  uniqueIdsToElements.set(uniqueId, element);
}

export function jumpToInternalLinkTarget(uniqueId) {
  uniqueIdsToElements.get(uniqueId).scrollIntoView({  behavior: 'smooth' });
}
