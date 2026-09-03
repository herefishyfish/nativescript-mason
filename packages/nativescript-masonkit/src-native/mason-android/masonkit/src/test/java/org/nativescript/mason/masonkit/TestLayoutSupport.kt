package org.nativescript.mason.masonkit

/**
 * Computes [node] at the given size and returns just the layout floats it produced.
 *
 * `nativeNodeComputeWithSizeAndLayout` fills a caller-owned buffer and returns
 * the number of floats the tree *requires*, so callers grow and retry — the same
 * contract `Element.fillLayoutBuffer` implements for production code. Tests only
 * want the floats, so this trims the buffer to the written length.
 *
 * Duplicated from the androidTest source set, which cannot be shared with the
 * local unit tests without a common test module.
 */
internal fun computeLayoutFloats(mason: Mason, node: Node, width: Float, height: Float): FloatArray {
  var buffer = FloatArray(0)
  var required = NativeHelpers.nativeNodeComputeWithSizeAndLayout(
    mason.getNativePtr(), node.nativePtr, width, height, buffer
  )
  if (required > buffer.size) {
    buffer = FloatArray(required)
    required = NativeHelpers.nativeNodeComputeWithSizeAndLayout(
      mason.getNativePtr(), node.nativePtr, width, height, buffer
    )
  }
  return if (required <= 0 || required > buffer.size) FloatArray(0) else buffer.copyOf(required)
}
