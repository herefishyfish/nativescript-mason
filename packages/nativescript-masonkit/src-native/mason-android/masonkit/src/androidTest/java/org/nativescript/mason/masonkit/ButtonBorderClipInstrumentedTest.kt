package org.nativescript.mason.masonkit

import android.util.Log
import androidx.test.ext.junit.runners.AndroidJUnit4
import androidx.test.platform.app.InstrumentationRegistry
import org.junit.Assert.*
import org.junit.Test
import org.junit.runner.RunWith
import org.nativescript.mason.masonkit.enums.Display
import org.nativescript.mason.masonkit.enums.FlexDirection
import org.nativescript.mason.masonkit.enums.AlignItems
import org.nativescript.mason.masonkit.enums.FlexWrap

/**
 * Instrumented tests verifying that button text is never clipped or
 * shrunk by the border.  CSS positions content at (border + padding)
 * from the view edge; Android's setPadding must match that offset so
 * text renders entirely inside the border boundary.
 */
@RunWith(AndroidJUnit4::class)
class ButtonBorderClipInstrumentedTest {

  private val TAG = "ButtonBorderClip"

  // ── Helpers ────────────────────────────────────────────────────────

  private fun createMason(): Mason {
    val mason = Mason()
    mason.setDeviceScale(
      InstrumentationRegistry.getInstrumentation()
        .targetContext.resources.displayMetrics.density
    )
    return mason
  }

  // ── Test: Button with 1px border ──────────────────────────────────

  @Test
  fun buttonWith1pxBorderPaddingIncludesBorder() {
    val context = InstrumentationRegistry.getInstrumentation().targetContext
    val mason = createMason()

    val root = mason.createView(context)
    root.style.display = Display.Flex
    root.style.flexDirection = FlexDirection.Column

    val btn = Button(context, mason)
    btn.textContent = "Apply"
    btn.configure { style ->
      style.border = "1 solid #000000"
      style.padding = Rect(
        LengthPercentage.Points(10f),
        LengthPercentage.Points(16f),
        LengthPercentage.Points(10f),
        LengthPercentage.Points(16f),
      )
    }

    root.addView(btn)

    InstrumentationRegistry.getInstrumentation().runOnMainSync {
      val tree = root.computeAndLayout(400f, -1f)
      if (tree.nodeCount > 0) {
        root.applyLayoutFlat(root.node, tree)
      }
    }

    val tree = root.node.layoutTree
    assertTrue("Layout tree should have nodes", tree.nodeCount > 1)

    val nv = tree.cursor
    nv.pointTo(1) // button is child 0 → index 1 in flat tree

    val cssPadLeft = nv.paddingLeft
    val cssPadTop = nv.paddingTop
    val borderLeft = nv.borderLeft
    val borderTop = nv.borderTop

    Log.i(TAG, "1px border: cssPad L=$cssPadLeft T=$cssPadTop, border L=$borderLeft T=$borderTop")

    assertTrue("Border left ($borderLeft) should be > 0", borderLeft > 0)

    InstrumentationRegistry.getInstrumentation().runOnMainSync {
      val expectedPadLeft = cssPadLeft.toInt() + borderLeft.toInt()
      val expectedPadTop = cssPadTop.toInt() + borderTop.toInt()

      Log.i(TAG, "  Android padding: L=${btn.paddingLeft} T=${btn.paddingTop}")
      Log.i(TAG, "  Expected:        L=$expectedPadLeft T=$expectedPadTop")

      assertEquals("paddingLeft = CSS padding + border",
        expectedPadLeft, btn.paddingLeft)
      assertEquals("paddingTop = CSS padding + border",
        expectedPadTop, btn.paddingTop)
    }
  }

  // ── Test: Button with 2px border ──────────────────────────────────

  @Test
  fun buttonWith2pxBorderPaddingIncludesBorder() {
    val context = InstrumentationRegistry.getInstrumentation().targetContext
    val mason = createMason()

    val root = mason.createView(context)
    root.style.display = Display.Flex
    root.style.flexDirection = FlexDirection.Column

    val btn = Button(context, mason)
    btn.textContent = "Submit"
    btn.configure { style ->
      style.border = "2 solid #767676"
      style.padding = Rect(
        LengthPercentage.Points(2f),
        LengthPercentage.Points(6f),
        LengthPercentage.Points(3f),
        LengthPercentage.Points(6f),
      )
    }

    root.addView(btn)

    InstrumentationRegistry.getInstrumentation().runOnMainSync {
      val tree = root.computeAndLayout(400f, -1f)
      if (tree.nodeCount > 0) {
        root.applyLayoutFlat(root.node, tree)
      }
    }

    val tree = root.node.layoutTree
    assertTrue("Layout tree should have nodes", tree.nodeCount > 1)

    val nv = tree.cursor
    nv.pointTo(1)

    val cssPadLeft = nv.paddingLeft
    val cssPadTop = nv.paddingTop
    val cssPadRight = nv.paddingRight
    val cssPadBottom = nv.paddingBottom
    val borderLeft = nv.borderLeft
    val borderTop = nv.borderTop
    val borderRight = nv.borderRight
    val borderBottom = nv.borderBottom

    Log.i(TAG, "2px border: pad=$cssPadTop/$cssPadRight/$cssPadBottom/$cssPadLeft border=$borderTop/$borderRight/$borderBottom/$borderLeft")

    InstrumentationRegistry.getInstrumentation().runOnMainSync {
      assertEquals("paddingLeft = 6 + 2 = 8",
        cssPadLeft.toInt() + borderLeft.toInt(), btn.paddingLeft)
      assertEquals("paddingTop = 2 + 2 = 4",
        cssPadTop.toInt() + borderTop.toInt(), btn.paddingTop)
      assertEquals("paddingRight = 6 + 2 = 8",
        cssPadRight.toInt() + borderRight.toInt(), btn.paddingRight)
      assertEquals("paddingBottom = 3 + 2 = 5",
        cssPadBottom.toInt() + borderBottom.toInt(), btn.paddingBottom)

      // Text area must be positive
      val textW = btn.width - btn.paddingLeft - btn.paddingRight
      val textH = btn.height - btn.paddingTop - btn.paddingBottom
      Log.i(TAG, "  Text area: ${textW}x${textH}")
      assertTrue("Text width ($textW) > 0", textW > 0)
      assertTrue("Text height ($textH) > 0", textH > 0)
    }
  }

  // ── Test: Styled button matching pseudo demo pattern ──────────────

  @Test
  fun styledButtonWithDashedBorderNotClipped() {
    val context = InstrumentationRegistry.getInstrumentation().targetContext
    val mason = createMason()
    val scale = mason.scale

    val root = mason.createView(context)
    root.style.display = Display.Flex
    root.style.flexDirection = FlexDirection.Column

    val btn = Button(context, mason)
    btn.textContent = "Coming Soon"
    btn.configure { style ->
      style.background = "#F9FAFB"
      style.setColor("#D1D5DB")
      style.border = "1 dashed #E5E7EB"
      style.borderRadius = "8"
      style.padding = Rect(
        LengthPercentage.Points(10f * scale),
        LengthPercentage.Points(16f * scale),
        LengthPercentage.Points(10f * scale),
        LengthPercentage.Points(16f * scale),
      )
    }

    root.addView(btn)

    InstrumentationRegistry.getInstrumentation().runOnMainSync {
      val tree = root.computeAndLayout(400f, -1f)
      if (tree.nodeCount > 0) {
        root.applyLayoutFlat(root.node, tree)
      }
    }

    val tree = root.node.layoutTree
    assertTrue("Layout tree should have nodes", tree.nodeCount > 1)

    val nv = tree.cursor
    nv.pointTo(1)

    val cssPadTop = nv.paddingTop
    val cssPadLeft = nv.paddingLeft
    val borderTop = nv.borderTop
    val borderLeft = nv.borderLeft

    Log.i(TAG, "Dashed: cssPad T=$cssPadTop L=$cssPadLeft, border T=$borderTop L=$borderLeft")

    InstrumentationRegistry.getInstrumentation().runOnMainSync {
      assertEquals("paddingTop includes border",
        cssPadTop.toInt() + borderTop.toInt(), btn.paddingTop)
      assertEquals("paddingLeft includes border",
        cssPadLeft.toInt() + borderLeft.toInt(), btn.paddingLeft)

      val textW = btn.width - btn.paddingLeft - btn.paddingRight
      val textH = btn.height - btn.paddingTop - btn.paddingBottom
      Log.i(TAG, "  Text area: ${textW}x${textH} (view: ${btn.width}x${btn.height})")
      assertTrue("Text area width ($textW) > 0", textW > 0)
      assertTrue("Text area height ($textH) > 0", textH > 0)
    }
  }

  // ── Test: PseudoDemo-style primary button has visible height ──────

  @Test
  fun pseudoDemoPrimaryButtonHasVisibleHeight() {
    val context = InstrumentationRegistry.getInstrumentation().targetContext
    val mason = createMason()
    val scale = mason.scale

    val root = mason.createView(context)
    root.style.display = Display.Flex
    root.style.flexDirection = FlexDirection.Column

    val btn = Button(context, mason)
    btn.textContent = "Get Started"
    btn.configure { style ->
      style.background = "#4F46E5"
      style.color = android.graphics.Color.WHITE
      style.border = "1 solid #4F46E5"
      style.borderRadius = "8"
      style.padding = Rect(
        LengthPercentage.Points(10f * scale),
        LengthPercentage.Points(16f * scale),
        LengthPercentage.Points(10f * scale),
        LengthPercentage.Points(16f * scale),
      )
    }

    root.addView(btn)

    InstrumentationRegistry.getInstrumentation().runOnMainSync {
      val tree = root.computeAndLayout(400f, -1f)
      if (tree.nodeCount > 0) {
        root.applyLayoutFlat(root.node, tree)
      }
    }

    val tree = root.node.layoutTree
    assertTrue("Layout tree should have nodes", tree.nodeCount > 1)

    val nv = tree.cursor
    nv.pointTo(1)

    val layoutW = nv.width
    val layoutH = nv.height

    Log.i(TAG, "PseudoDemo primary: layoutW=$layoutW layoutH=$layoutH")

    InstrumentationRegistry.getInstrumentation().runOnMainSync {
      Log.i(TAG, "  View: ${btn.width}x${btn.height}, padding: L=${btn.paddingLeft} T=${btn.paddingTop} R=${btn.paddingRight} B=${btn.paddingBottom}")
      assertTrue("Button width (${btn.width}) > 0", btn.width > 0)
      assertTrue("Button height (${btn.height}) > 20", btn.height > 20)
      assertTrue("Layout width ($layoutW) > 0", layoutW > 0)
      assertTrue("Layout height ($layoutH) > 20", layoutH > 20)

      val textW = btn.width - btn.paddingLeft - btn.paddingRight
      val textH = btn.height - btn.paddingTop - btn.paddingBottom
      Log.i(TAG, "  Text area: ${textW}x${textH}")
      assertTrue("Text width ($textW) > 0", textW > 0)
      assertTrue("Text height ($textH) > 0", textH > 0)
    }
  }

  // ── Test: Multiple buttons in column all have height ──────────────

  @Test
  fun multipleButtonsInColumnAllHaveHeight() {
    val context = InstrumentationRegistry.getInstrumentation().targetContext
    val mason = createMason()
    val scale = mason.scale

    val root = mason.createView(context)
    root.style.display = Display.Flex
    root.style.flexDirection = FlexDirection.Column

    val labels = listOf("Get Started", "Learn More", "Delete Account", "Subscribe")
    val buttons = labels.map { label ->
      Button(context, mason).apply {
        textContent = label
        configure { style ->
          style.background = "#4F46E5"
          style.color = android.graphics.Color.WHITE
          style.border = "1 solid #4F46E5"
          style.borderRadius = "8"
          style.padding = Rect(
            LengthPercentage.Points(10f * scale),
            LengthPercentage.Points(16f * scale),
            LengthPercentage.Points(10f * scale),
            LengthPercentage.Points(16f * scale),
          )
        }
      }
    }

    buttons.forEach { root.addView(it) }

    InstrumentationRegistry.getInstrumentation().runOnMainSync {
      val tree = root.computeAndLayout(400f, -1f)
      if (tree.nodeCount > 0) {
        root.applyLayoutFlat(root.node, tree)
      }
    }

    val tree = root.node.layoutTree
    val nv = tree.cursor

    InstrumentationRegistry.getInstrumentation().runOnMainSync {
      for ((i, btn) in buttons.withIndex()) {
        nv.pointTo(i + 1) // skip root at index 0
        val layoutH = nv.height
        Log.i(TAG, "  Button[$i] '${labels[i]}': view=${btn.width}x${btn.height} layout=${nv.width}x$layoutH pad=L${btn.paddingLeft}/T${btn.paddingTop}")
        assertTrue("Button[$i] '${labels[i]}' width > 0", btn.width > 0)
        assertTrue("Button[$i] '${labels[i]}' height > 20", btn.height > 20)
        assertTrue("Button[$i] '${labels[i]}' layout height > 20", layoutH > 20)
      }
    }
  }

  // ── Test: Button inside a Scroll (PseudoDemo pattern) ────────────

  @Test
  fun buttonInScrollViewHasVisibleHeight() {
    val context = InstrumentationRegistry.getInstrumentation().targetContext
    val mason = createMason()
    val scale = mason.scale

    val scroll = Scroll(context, mason)

    val btn = Button(context, mason)
    btn.textContent = "Get Started"
    btn.configure { style ->
      style.background = "#4F46E5"
      style.color = android.graphics.Color.WHITE
      style.border = "1 solid #4F46E5"
      style.borderRadius = "8"
      style.padding = Rect(
        LengthPercentage.Points(10f * scale),
        LengthPercentage.Points(16f * scale),
        LengthPercentage.Points(10f * scale),
        LengthPercentage.Points(16f * scale),
      )
    }

    scroll.addView(btn)

    InstrumentationRegistry.getInstrumentation().runOnMainSync {
      val tree = scroll.computeAndLayout(400f, 800f)
      if (tree.nodeCount > 0) {
        scroll.applyLayoutFlat(scroll.node, tree)
      }
    }

    val tree = scroll.node.layoutTree
    assertTrue("Layout tree should have nodes", tree.nodeCount > 1)

    val nv = tree.cursor
    nv.pointTo(1)
    val layoutW = nv.width
    val layoutH = nv.height

    Log.i(TAG, "Scroll root: layoutW=$layoutW layoutH=$layoutH")

    InstrumentationRegistry.getInstrumentation().runOnMainSync {
      Log.i(TAG, "  View: ${btn.width}x${btn.height}, padding: L=${btn.paddingLeft} T=${btn.paddingTop}")
      assertTrue("Button width (${btn.width}) > 0", btn.width > 0)
      assertTrue("Button height (${btn.height}) > 20", btn.height > 20)
      assertTrue("Layout height ($layoutH) > 20", layoutH > 20)
    }
  }

  // ── Test: Mixed standard TextViews + Buttons in Scroll ───────────

  @Test
  fun mixedTextViewsAndButtonsInScrollAllVisible() {
    val context = InstrumentationRegistry.getInstrumentation().targetContext
    val mason = createMason()
    val scale = mason.scale

    val scroll = Scroll(context, mason)

    // Section header (standard Android TextView) like PseudoDemo
    val header1 = android.widget.TextView(context).apply {
      text = "Primary Button"
      textSize = 12f
    }
    scroll.addView(header1)

    // Mason Button after the header
    val btn1 = Button(context, mason)
    btn1.textContent = "Get Started"
    btn1.configure { style ->
      style.background = "#4F46E5"
      style.color = android.graphics.Color.WHITE
      style.border = "1 solid #4F46E5"
      style.borderRadius = "8"
      style.padding = Rect(
        LengthPercentage.Points(10f * scale),
        LengthPercentage.Points(16f * scale),
        LengthPercentage.Points(10f * scale),
        LengthPercentage.Points(16f * scale),
      )
    }
    scroll.addView(btn1)

    // Second header + button
    val header2 = android.widget.TextView(context).apply {
      text = "Outline Button"
      textSize = 12f
    }
    scroll.addView(header2)

    val btn2 = Button(context, mason)
    btn2.textContent = "Learn More"
    btn2.configure { style ->
      style.background = "#FFFFFF"
      style.color = android.graphics.Color.parseColor("#4F46E5")
      style.border = "1 solid #4F46E5"
      style.borderRadius = "8"
      style.padding = Rect(
        LengthPercentage.Points(10f * scale),
        LengthPercentage.Points(16f * scale),
        LengthPercentage.Points(10f * scale),
        LengthPercentage.Points(16f * scale),
      )
    }
    scroll.addView(btn2)

    InstrumentationRegistry.getInstrumentation().runOnMainSync {
      val tree = scroll.computeAndLayout(400f, 800f)
      if (tree.nodeCount > 0) {
        scroll.applyLayoutFlat(scroll.node, tree)
      }
    }

    val tree = scroll.node.layoutTree
    assertTrue("Layout tree should have nodes", tree.nodeCount > 4)

    val nv = tree.cursor

    // Log all nodes
    for (i in 0 until tree.nodeCount) {
      nv.pointTo(i)
      Log.i(TAG, "  Node[$i]: ${nv.width}x${nv.height} at (${nv.x}, ${nv.y})")
    }

    InstrumentationRegistry.getInstrumentation().runOnMainSync {
      Log.i(TAG, "Mixed: btn1=${btn1.width}x${btn1.height} btn2=${btn2.width}x${btn2.height}")
      Log.i(TAG, "Mixed: header1=${header1.width}x${header1.height} header2=${header2.width}x${header2.height}")

      assertTrue("Button 1 'Get Started' height > 20 (actual: ${btn1.height})", btn1.height > 20)
      assertTrue("Button 2 'Learn More' height > 20 (actual: ${btn2.height})", btn2.height > 20)
      assertTrue("Header 1 height > 0 (actual: ${header1.height})", header1.height > 0)
    }
  }

  // ── Test: Button in flex row with Input (TransformActivity pattern) ─

  @Test
  fun applyButtonNotShrunkInFlexRow() {
    val context = InstrumentationRegistry.getInstrumentation().targetContext
    val mason = createMason()
    val scale = mason.scale

    val root = mason.createView(context)
    root.style.display = Display.Flex
    root.style.flexDirection = FlexDirection.Column
    root.style.size = Size(Dimension.Points(400f), Dimension.Auto)

    // Input row
    val row = mason.createView(context)
    row.style.display = Display.Flex
    row.style.flexDirection = FlexDirection.Row
    row.style.alignItems = AlignItems.Center
    row.style.gap = Size(
      LengthPercentage.Points(8f * scale),
      LengthPercentage.Points(0f)
    )

    // Input (simulated with a mason view)
    val input = mason.createView(context)
    input.style.flexGrow = 1f
    input.style.flexShrink = 1f
    input.style.minSize = Size(Dimension.Points(0f), Dimension.Auto)
    input.style.size = Size(Dimension.Auto, Dimension.Points(40f * scale))

    // Apply button
    val btn = Button(context, mason)
    btn.textContent = "Apply"
    btn.configure { style ->
      style.flexShrink = 0f
    }

    row.addView(input)
    row.addView(btn)
    root.addView(row)

    InstrumentationRegistry.getInstrumentation().runOnMainSync {
      val tree = root.computeAndLayout(400f, -1f)
      if (tree.nodeCount > 0) {
        root.applyLayoutFlat(root.node, tree)
      }
    }

    val tree = root.node.layoutTree
    val nv = tree.cursor

    for (i in 0 until tree.nodeCount) {
      nv.pointTo(i)
      Log.i(TAG, "  FlexRow Node[$i]: ${nv.width}x${nv.height} at (${nv.x}, ${nv.y})")
    }

    InstrumentationRegistry.getInstrumentation().runOnMainSync {
      Log.i(TAG, "  Apply btn: ${btn.width}x${btn.height} pad=L${btn.paddingLeft}/T${btn.paddingTop}")
      // The button should be at least 50px wide (text "Apply" + padding + border)
      assertTrue("Apply button width (${btn.width}) > 50", btn.width > 50)
      assertTrue("Apply button height (${btn.height}) > 20", btn.height > 20)

      val textW = btn.width - btn.paddingLeft - btn.paddingRight
      val textH = btn.height - btn.paddingTop - btn.paddingBottom
      assertTrue("Apply text width ($textW) > 0", textW > 0)
      assertTrue("Apply text height ($textH) > 0", textH > 0)
    }
  }

  // ── Test: Button with NO border has unchanged padding ─────────────

  @Test
  fun buttonWithNoBorderPaddingUnchanged() {
    val context = InstrumentationRegistry.getInstrumentation().targetContext
    val mason = createMason()

    val root = mason.createView(context)
    root.style.display = Display.Flex
    root.style.flexDirection = FlexDirection.Column

    val btn = Button(context, mason)
    btn.textContent = "No Border"
    btn.configure { style ->
      style.border = "0 solid #000000"
      style.padding = Rect(
        LengthPercentage.Points(8f),
        LengthPercentage.Points(12f),
        LengthPercentage.Points(8f),
        LengthPercentage.Points(12f),
      )
    }

    root.addView(btn)

    InstrumentationRegistry.getInstrumentation().runOnMainSync {
      val tree = root.computeAndLayout(400f, -1f)
      if (tree.nodeCount > 0) {
        root.applyLayoutFlat(root.node, tree)
      }
    }

    val tree = root.node.layoutTree
    val nv = tree.cursor
    nv.pointTo(1)

    val cssPadLeft = nv.paddingLeft
    val cssPadTop = nv.paddingTop

    InstrumentationRegistry.getInstrumentation().runOnMainSync {
      // With 0 border, Android padding = CSS padding only
      assertEquals("paddingLeft = CSS padding (no border)",
        cssPadLeft.toInt(), btn.paddingLeft)
      assertEquals("paddingTop = CSS padding (no border)",
        cssPadTop.toInt(), btn.paddingTop)
    }
  }
}
