package org.nativescript.mason.masonkit

import org.nativescript.mason.masonkit.enums.Display
import org.nativescript.mason.masonkit.enums.Float as MasonFloat

/**
 * Test helper: create a measured box node with the given size and optional float.
 */
fun makeBox(m: Mason, w: Float, h: Float, fl: MasonFloat?): Node {
  val meas = object : MeasureFunc {
    override fun measure(
      knownWidth: Float, knownHeight: Float,
      availableWidth: Float, availableHeight: Float
    ): Long {
      // Return packed MeasureOutput per native expectations
      return MeasureOutput.make(w, h)
    }
  }
  val n = m.createNode(meas)
  n.style.display = Display.Block
  if (fl != null) {
    n.style.float = fl
  }
  return n
}
