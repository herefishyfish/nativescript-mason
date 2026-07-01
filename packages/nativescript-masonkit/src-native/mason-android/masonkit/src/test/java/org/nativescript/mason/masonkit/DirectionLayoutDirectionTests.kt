package org.nativescript.mason.masonkit

import org.junit.Assert.assertEquals
import org.junit.Test
import org.nativescript.mason.masonkit.enums.Direction

class DirectionLayoutDirectionTests {

  @Test
  fun mapsDirectionToAndroidLayoutDirection() {
    assertEquals(0, toAndroidLayoutDirection(Direction.LTR))
    assertEquals(1, toAndroidLayoutDirection(Direction.RTL))
    assertEquals(2, toAndroidLayoutDirection(Direction.Inherit))
  }
}
