package org.nativescript.mason.masonkit;

import dalvik.annotation.optimization.CriticalNative;
import dalvik.annotation.optimization.FastNative;

public class NativeHelpers {
  static {
    initLib();
  }

  static boolean didInit;


  static void initLib() {
    if (didInit) {
      return;
    }
    didInit = true;
    System.loadLibrary("masonnative");
  }


  /* Node */

  @CriticalNative
  static native long nativeNodeNew(
    long mason, boolean isAnonymous
  );

  @CriticalNative
  static native long nativeNodeNewText(
    long mason, boolean isAnonymous
  );

  @FastNative
  static native long nativeNodeNewWithChildren(
    long mason,
    long[] children
  );

  @CriticalNative
  static native long nativeNodeNewWithContext(
    long mason,
    int context,
    boolean isAnonymous
  );

  @CriticalNative
  static native long nativeNodeNewTextWithContext(
    long mason,
    int context,
    boolean isAnonymous
  );

  @CriticalNative
  static native long nativeNodeNewLineBreak(long mason);

  @CriticalNative
  static native long nativeNodeNewLineBreakWithContext(long mason,
                                                       int context);

  @CriticalNative
  static native void nativeNodeDestroy(long mason);

  // FastNative, not CriticalNative: these enter Mason's compute pass, which for any
  // measure-function leaf (e.g. text) synchronously calls back into Java via a full
  // JNIEnv (see NodeMeasure::measure in mason-core). CriticalNative methods receive no
  // JNIEnv and must never call back into the JVM, so these need the FastNative contract.
  @FastNative
  static native void nativeNodeCompute(long mason, long node);

  @FastNative
  static native void nativeNodeComputeSize(long mason, long node, long size);

  @FastNative
  static native void nativeNodeComputeWH(long mason, long node, float width, float height);

  @FastNative
  static native void nativeNodeComputeMaxContent(long mason, long node);

  @FastNative
  static native void nativeNodeComputeMinContent(long mason, long node);

  @CriticalNative
  static native void nativeNodeAddChild(long mason, long node, long child);

  @CriticalNative
  static native void nativeNodeAddChildAt(long mason, long node, long child, int index);

  @CriticalNative
  static native long nativeNodeReplaceChildAt(long mason, long node, long child, int index);

  @CriticalNative
  static native void nativeNodeInsertChildBefore(long mason, long node, long child, long reference);

  @CriticalNative
  static native void nativeNodeInsertChildAfter(long mason, long node, long child, long reference);

  @CriticalNative
  static native long nativeNodeGetChildAt(long mason, long node, int index);

  @CriticalNative
  static native int nativeNodeGetChildCount(long mason, long node);

  @CriticalNative
  static native void nativeNodeMarkDirty(long mason, long node);

  @CriticalNative
  static native boolean nativeNodeDirty(long mason, long node);

  @CriticalNative
  static native void nativeNodeRemoveChildren(long mason, long node);

  @CriticalNative
  static native long nativeNodeRemoveChildAt(long mason, long node, int index);

  @CriticalNative
  static native long nativeNodeRemoveChild(long mason, long node, long child);

  @CriticalNative
  static native long nativeNodeSetStyle(long mason, long node, long style);

  @CriticalNative
  static native void nativeNodeRemoveContext(long mason, long node);

  /**
   * Computes at the given size and writes the flat layout tree into {@code output}.
   *
   * <p>Returns the number of floats the tree actually needs. When that exceeds
   * {@code output.length} nothing usable was written — grow the buffer to the
   * returned size and call again. This replaced a variant that allocated and
   * returned a fresh {@code float[]} on every measure pass.
   */
  @FastNative
  static native int nativeNodeComputeWithSizeAndLayout(long mason,
                                                       long node,
                                                       float width,
                                                       float height,
                                                       float[] output);

  @FastNative
  static native long[] nativeNodeGetChildren(long mason, long node);

  /**
   * Writes the current flat layout tree into {@code output} without recomputing.
   *
   * <p>Same grow-and-retry contract as
   * {@link #nativeNodeComputeWithSizeAndLayout}: the return value is the number
   * of floats required, not the number written.
   */
  @FastNative
  static native int nativeNodeLayout(long mason, long node, float[] output);

  @FastNative
  static native long[] nativeNodeGetFloatRectWithIds(long mason, long node);

  @FastNative
  static native int[] nativeNodeGetFloatRectAndroidIds(long mason, long node);

  @FastNative
  static native float[] nativeNodeGetFloatRects(long mason, long node);

  @CriticalNative
  static native void nativeNodeSetContext(long mason, long node, int measureFunc);

  // nativeNodeComputeAndLayout was declared here, but the only Rust export for
  // it is name-mangled for the Node class
  // (Java_org_nativescript_mason_masonkit_Node_nativeComputeAndLayout) and it is
  // absent from the NativeHelpers registration table, so every call threw
  // UnsatisfiedLinkError. Callers now compute and read back via
  // nativeNodeCompute + nativeNodeLayout, which are both registered.

  @FastNative
  static native void nativeNodeSetChildren(
    long mason,
    long node,
    long[] children
  );

  @FastNative
  static native void nativeNodeSetSegments(long masonPtr, long nodePtr, InlineSegment[] segments);

  @FastNative
  /**
   * @param count how many segments are live in the arrays, which may be longer
   *              than that when the caller reuses its packing buffers.
   */
  static native void nativeNodeSetSegmentsPacked(long masonPtr, long nodePtr, float[] floats, long[] longs, int[] kinds, int count);

  @CriticalNative
  static native void nativeSetAndroidNode(long masonPtr, long nodePtr, int node);

  @CriticalNative
  static native long nativeNodeNewImage(
    long mason
  );

  @CriticalNative
  static native long nativeNodeNewImageWithContext(
    long mason,
    int context
  );

  @CriticalNative
  static native long nativeNodeNewListItem(
    long mason
  );

  @CriticalNative
  static native long nativeNodeNewListItemWithContext(
    long mason,
    int context
  );

  @CriticalNative
  static native long nativeNodeNewButton(
    long mason
  );

  @CriticalNative
  static native long nativeNodeNewButtonWithContext(
    long mason,
    int context
  );

  @FastNative
  static native int nativeGetStateBuffer(long mason, long node);

  @FastNative
  static native int nativeGetPseudoStyleBuffer(long mason, long node, int flags);

  @FastNative
  static native int nativePreparePseudoMut(long mason, long node, int flags);


  /* Node */

}
