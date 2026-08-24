import { isKnownView, normalizeElementName, registerElement } from 'nativescript-vue';
import { Br, Button, Img, Input, Li, Ol, Scroll, Text, TextArea, Ul, View } from '@triniwiz/nativescript-masonkit';
import * as MasonKitWeb from '@triniwiz/nativescript-masonkit/web';

import { masonMeta } from './mason-meta';

type ElementClass = { new (...args: any[]): any; prototype: any };

export interface RegisterElementsOptions {
  /**
   * Register MasonKit's own elements: `View`, `Text`, `Scroll`, `Img`,
   * `Button`, `Input`, `TextArea`, `Br`, `Ul`, `Ol`, `Li`.
   *
   * @default true
   */
  mason?: boolean;
  /**
   * Register the HTML-shaped elements from
   * `@triniwiz/nativescript-masonkit/web`.
   *
   * @default true
   */
  web?: boolean;
}

/** Names this integration owns, normalized exactly as NativeScript-Vue does. */
const registered = new Set<string>();

function isMasonContainer(cls: ElementClass): boolean {
  const proto = cls?.prototype;
  return !!proto && typeof proto.insertChild === 'function' && typeof proto.addChild === 'function' && typeof proto.removeChild === 'function';
}

function register(name: string, cls: ElementClass): void {
  const key = name ? normalizeElementName(name) : '';
  if (!key || registered.has(key)) {
    return;
  }

  // Core registers names such as Button and Span during the nativescript-vue
  // module's initialization. Replacing those names is intentional: templates
  // should resolve to MasonKit's Taffy-backed equivalents after installation.
  registerElement(name, () => cls, {
    ...(isMasonContainer(cls) ? masonMeta : undefined),
    overwriteExisting: isKnownView(name),
  });
  registered.add(key);
}

const MASON_ELEMENTS: Array<[string, ElementClass]> = [
  ['View', View],
  ['Text', Text],
  ['Scroll', Scroll],
  ['Img', Img],
  ['Button', Button],
  ['Input', Input],
  ['TextArea', TextArea],
  ['Br', Br],
  ['Ul', Ul],
  ['Ol', Ol],
  ['Li', Li],
];

/**
 * Register all requested MasonKit elements with NativeScript-Vue 3.
 *
 * Registration is idempotent and attaches {@link masonMeta} to every MasonKit
 * container so keyed lists, conditionals and component updates preserve child
 * order and remove stale native children correctly.
 */
export function registerMasonKitElements(options: RegisterElementsOptions = {}): void {
  const { mason = true, web = true } = options;

  if (web) {
    for (const exported of Object.values(MasonKitWeb) as ElementClass[]) {
      if (typeof exported !== 'function' || !exported.prototype) {
        continue;
      }
      register(exported.prototype.cssType, exported);
    }
  }

  if (mason) {
    for (const [name, cls] of MASON_ELEMENTS) {
      register(name, cls);
    }
  }
}
