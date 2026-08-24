import { RegisterElementsOptions, registerMasonKitElements } from './element-registry';

export type InstallMasonKitOptions = RegisterElementsOptions;

/**
 * Install MasonKit's Vue 3 integration.
 *
 * Call this before `createApp(...).start()` so NativeScript-Vue knows how to
 * create every MasonKit element before the first template is rendered.
 *
 * @example
 * ```ts
 * import { createApp } from 'nativescript-vue';
 * import { installMasonKit } from '@triniwiz/nativescript-masonkit/vue';
 *
 * installMasonKit();
 * createApp(App).start();
 * ```
 *
 * Safe to call more than once, including during HMR.
 */
export function installMasonKit(options: InstallMasonKitOptions = {}): void {
  registerMasonKitElements(options);
}
