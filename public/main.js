import { withLifecycle } from './app/snapFramework.js';
import { App } from './app/App.js';

document.getElementById('root').append(
  withLifecycle(() => new App()).value,
);
