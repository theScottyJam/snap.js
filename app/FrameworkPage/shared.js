import { Signal } from '../snapFramework.js';

// This is used to switch how text is wrapped
export const MOBILE_SCREEN_SIZE = '900px';
export const signalIsMobileScreenSize = new Signal(false);
const mobileScreenSizeMedia = matchMedia(`(max-width: ${MOBILE_SCREEN_SIZE})`);
mobileScreenSizeMedia.addEventListener('change', event => {
  signalIsMobileScreenSize.set(event.matches);
});
signalIsMobileScreenSize.set(mobileScreenSizeMedia.matches);

// --- Code Formatting --- //

export function prepareCodeExampleForViewing(code) {
  return code
    .replaceAll('%FRAMEWORK_LOCATION%', './snapFramework.js')
    .replaceAll('%ASSETS%', './assets');
}

export function prepareCodeExampleForRunning(code, { version }) {
  return code
    .replaceAll('%FRAMEWORK_LOCATION%', `./framework/snapFramework-${version}.js`)
    .replaceAll('%ASSETS%', './assets');
}
