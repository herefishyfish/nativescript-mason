package org.nativescript.mason.masonkit

import android.graphics.Bitmap
import android.graphics.Canvas
import android.os.Debug
import android.os.SystemClock
import android.util.Log
import androidx.test.core.app.ApplicationProvider
import androidx.test.ext.junit.runners.AndroidJUnit4
import org.junit.Assert.assertEquals
import org.junit.Before
import org.junit.Test
import org.junit.runner.RunWith

/** Focused first-render and native-memory coverage for the parent-drawn shadow path. */
@RunWith(AndroidJUnit4::class)
class BoxShadowBenchmark {
  private data class Box(val width: Int, val height: Int, val radius: Int, val shadow: String?)

  private val context = ApplicationProvider.getApplicationContext<android.content.Context>()
  private val mason = Mason.shared

  @Before
  fun resetCache() {
    SharedBoxShadowCache.resetForBenchmark()
  }

  @Test
  fun homeFirstRender() {
    val boxes = buildList {
      repeat(18) { add(Box(340, 220, 20, "0px 8px 24px 0px rgba(15, 23, 42, 0.18)")) }
      repeat(4) { add(Box(260, 140, 18, "0px 6px 18px 0px rgba(15, 23, 42, 0.16)")) }
      repeat(3) { add(Box(400, 200, 24, "0px 0px 36px 4px rgba(99, 102, 241, 0.34)")) }
      add(Box(1080, 400, 28, "0px 16px 48px 0px rgba(15, 23, 42, 0.22)"))
      add(Box(340, 340, 20, "0px 8px 24px 0px rgba(15, 23, 42, 0.18)"))
    }
    report("Home", boxes)
    assertEquals(5, SharedBoxShadowCache.snapshot().uniqueResources)
  }

  @Test
  fun gradientBuilderFirstRender() {
    val boxes = buildList {
      repeat(8) { index ->
        add(Box(860 - index * 45, 220 + index * 18, 12 + index * 3,
          "${index - 4}px ${8 + index}px ${12 + index * 6}px ${index % 3}px rgba(79, 70, 229, 0.${20 + index * 5})"))
      }
      repeat(6) { add(Box(320, 160, 16, "0px 10px 28px 2px rgba(15, 23, 42, 0.20)")) }
    }
    report("Gradient Builder", boxes)
    val stats = SharedBoxShadowCache.snapshot()
    assertEquals(9, stats.rasterizations)
    assertEquals(5, stats.hits)
  }

  @Test
  fun layoutStressFirstRender() {
    report("Layout Stress", List(108) { Box(180, 80, 0, null) })
    assertEquals(0, SharedBoxShadowCache.snapshot().rasterizations)
  }

  @Test
  fun repeatedViewsShareOneResource() {
    val views = List(18) {
      shadowView(Box(340, 220, 20, "0px 8px 24px rgba(15, 23, 42, 0.18)"))
    }
    val target = Bitmap.createBitmap(1200, 600, Bitmap.Config.ARGB_8888)
    val canvas = Canvas(target)
    views.forEach { draw(it, canvas, 340, 220) }
    val snapshot = SharedBoxShadowCache.snapshot()
    assertEquals(1, snapshot.rasterizations)
    assertEquals(17, snapshot.hits)
    assertEquals(1, snapshot.uniqueResources)
    target.recycle()
  }

  private fun report(name: String, boxes: List<Box>) {
    val views = boxes.map(::shadowView)
    val target = Bitmap.createBitmap(1600, 3200, Bitmap.Config.ARGB_8888)
    val canvas = Canvas(target)
    val before = memory()
    val started = SystemClock.elapsedRealtimeNanos()
    boxes.indices.forEach { index ->
      val box = boxes[index]
      if (box.shadow != null) draw(views[index], canvas, box.width, box.height)
      else views[index].draw(canvas)
    }
    val elapsed = SystemClock.elapsedRealtimeNanos() - started
    val after = memory()
    val stats = SharedBoxShadowCache.snapshot()
    Log.i(
      TAG,
      "$name firstFrameMs=${elapsed / 1_000_000.0} " +
        "uniqueResources=${stats.uniqueResources} cachedBytes=${stats.cachedBytes} " +
        "cacheHits=${stats.hits} cacheMisses=${stats.misses} evictions=${stats.evictions} " +
        "rasterizations=${stats.rasterizations} " +
        "nativeHeapDelta=${after.nativeHeap - before.nativeHeap} " +
        "graphicsPssDeltaKb=${after.graphicsPssKb - before.graphicsPssKb}"
    )
    target.recycle()
  }

  private fun shadowView(box: Box): View = View(context, mason).also {
    it.style.borderRadius = "${box.radius}px"
    if (box.shadow != null) it.style.boxShadow = box.shadow
  }

  private fun draw(view: View, canvas: Canvas, width: Int, height: Int) {
    view.style.mBorderRenderer.updateCache(width.toFloat(), height.toFloat())
    view.style.mBoxShadowRenderer.drawOutsetShadows(
      view,
      canvas,
      width.toFloat(),
      height.toFloat(),
      view.style.mBorderRenderer,
      forceLegacy = true,
    )
  }

  private data class Memory(val nativeHeap: Long, val graphicsPssKb: Int)

  private fun memory(): Memory {
    val info = Debug.MemoryInfo()
    Debug.getMemoryInfo(info)
    return Memory(
      Debug.getNativeHeapAllocatedSize(),
      info.memoryStats["summary.graphics"]?.toIntOrNull() ?: 0,
    )
  }

  companion object {
    private const val TAG = "BoxShadowBenchmark"
  }
}
