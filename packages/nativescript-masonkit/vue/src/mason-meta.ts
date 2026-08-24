import type { NSVElement, NSVViewMeta } from 'nativescript-vue';

interface MasonChildOps {
  _children?: unknown[];
  insertChild(child: unknown, atIndex: number): void;
  addChild(child: unknown): void;
  removeChild(child: unknown): void;
}

/** Nodes that occupy a slot in MasonKit's raw child list. */
function isVisualOrTextNode(node: { nodeType?: unknown }): boolean {
  return node.nodeType === 'element' || node.nodeType === 'text' || node.nodeType === 1 || node.nodeType === 3;
}

/**
 * Convert NativeScript-Vue's element-only insertion index to the raw child
 * index MasonKit expects. MasonKit tracks native text nodes alongside views,
 * while Vue's renderer omits text and comment nodes from its `atIndex`.
 */
function rawChildIndex(parent: NSVElement, child: NSVElement): number {
  const childNodes = parent.childNodes ?? [];
  const childIndex = childNodes.indexOf(child);
  if (childIndex < 0) {
    return -1;
  }

  let rawIndex = 0;
  for (let i = 0; i < childIndex; i++) {
    if (isVisualOrTextNode(childNodes[i])) {
      rawIndex++;
    }
  }
  return rawIndex;
}

/**
 * NativeScript-Vue metadata for a MasonKit container.
 *
 * NativeScript-Vue's generic fallback calls `_addChildFromBuilder()` and
 * `_removeView()`. Those bypass MasonKit's raw child bookkeeping, and generic
 * middle inserts also lose their intended position. Routing mutations through
 * this metadata keeps Vue's VNode tree, MasonKit's `_children` list and the
 * native Taffy tree in the same order.
 */
export const masonMeta: Partial<NSVViewMeta> = {
  nodeOps: {
    insert(child: NSVElement, parent: NSVElement, atIndex?: number): void {
      const parentView = parent.nativeView as MasonChildOps;
      if (typeof atIndex !== 'number') {
        // `appendChild` deliberately arrives without an index. Keep it on
        // MasonKit's append path: indexed insertion also passes the raw index
        // into NativeScript's lazily populated visual-child list, where text
        // nodes can make an otherwise ordinary append land out of range.
        parentView.addChild(child.nativeView);
        return;
      }

      // Vue's index counts elements only. MasonKit's list also contains its
      // native text runs, so translate only genuine `insertBefore` operations.
      const index = rawChildIndex(parent, child);
      const rawIndex = index > -1 ? index : atIndex;

      // Keyed fragments (`v-for`) are mounted before a trailing comment
      // anchor. Vue consequently supplies an index, even though the element is
      // being appended to the native tree because comments occupy no MasonKit
      // slot. Keep that case on the safe append path as well.
      if (Array.isArray(parentView._children) && rawIndex >= parentView._children.length) {
        parentView.addChild(child.nativeView);
      } else {
        parentView.insertChild(child.nativeView, rawIndex);
      }
    },
    remove(child: NSVElement, parent: NSVElement): void {
      (parent.nativeView as MasonChildOps).removeChild(child.nativeView);
    },
  },
};
