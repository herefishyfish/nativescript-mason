package org.nativescript.mason.masonkit

import android.graphics.Canvas
import android.graphics.Path
import android.graphics.RenderEffect
import android.graphics.RenderNode
import android.os.Build
import android.view.View
import android.view.ViewTreeObserver
import androidx.annotation.RequiresApi

/**
 * Implements CSS `backdrop-filter` on Android.
 *
 * The naive approach — `view.setRenderEffect(effect)` — filters the view's OWN
 * render output (its background AND every child), so the element's own content
 * (e.g. `Text "Hello world"`) gets blurred. That is the opposite of what CSS
 * `backdrop-filter` specifies: the filter must apply only to the content drawn
 * *behind* the element (the "backdrop"), while the element's own content stays
 * crisp on top.
 *
 * Android has no first-class backdrop API, so we capture the backdrop ourselves
 * (the same technique used by the BlurView library):
 *
 *  1. A [ViewTreeObserver.OnPreDrawListener] on the target runs each frame.
 *  2. It records the *root* view into [captureNode], translated so the target's
 *     top-left maps to (0,0). While recording, the target draws nothing (the
 *     [isCapturing] guard short-circuits [ViewUtils] render), so the snapshot
 *     contains only what's behind the target.
 *  3. The parsed filter chain (blur + colour matrices) is applied to that
 *     snapshot via [effectNode].
 *  4. During the target's normal draw, [draw] blits [effectNode] *underneath*
 *     the element's own background/border/children — so the backdrop is filtered
 *     and the content stays sharp.
 *
 * API 31+ only (RenderNode + RenderEffect). On older APIs backdrop-filter is a
 * no-op (it simply renders nothing), which is preferable to corrupting content.
 */
@RequiresApi(Build.VERSION_CODES.S)
internal class BackdropHelper(private val target: View) {

  private var cssFilter: CSSFilters.CSSFilter? = null
  private var renderEffect: RenderEffect? = null

  private val captureNode = RenderNode("mason_backdrop_capture")
  private val effectNode = RenderNode("mason_backdrop_effect")
  private var hasContent = false

  /** True only while [capture] is recording the root into [captureNode]. */
  @Volatile
  var isCapturing = false
    private set

  private var listenerAttached = false
  private var enabled = false

  private val targetLocation = IntArray(2)
  private val rootLocation = IntArray(2)

  private val preDrawListener = ViewTreeObserver.OnPreDrawListener {
    capture()
    true
  }

  private val attachListener = object : View.OnAttachStateChangeListener {
    override fun onViewAttachedToWindow(v: View) {
      registerPreDraw()
    }

    override fun onViewDetachedFromWindow(v: View) {
      unregisterPreDraw()
    }
  }

  /** Update the active filter chain. Pass null/empty to tear the helper down. */
  fun setFilter(filter: CSSFilters.CSSFilter?) {
    cssFilter = filter
    renderEffect = filter?.buildBackdropRenderEffect()
    if (filter != null && filter.filters.isNotEmpty() && renderEffect != null) {
      enable()
    } else {
      disable()
    }
  }

  private fun enable() {
    if (enabled) return
    enabled = true
    target.addOnAttachStateChangeListener(attachListener)
    if (target.isAttachedToWindow) {
      registerPreDraw()
    }
  }

  fun disable() {
    if (!enabled) return
    enabled = false
    target.removeOnAttachStateChangeListener(attachListener)
    unregisterPreDraw()
    hasContent = false
  }

  private fun registerPreDraw() {
    if (listenerAttached) return
    val vto = target.viewTreeObserver
    if (vto.isAlive) {
      vto.addOnPreDrawListener(preDrawListener)
      listenerAttached = true
    }
  }

  private fun unregisterPreDraw() {
    if (!listenerAttached) return
    val vto = target.viewTreeObserver
    if (vto.isAlive) {
      vto.removeOnPreDrawListener(preDrawListener)
    }
    listenerAttached = false
  }

  private fun capture() {
    val effect = renderEffect ?: return
    val w = target.width
    val h = target.height
    if (w <= 0 || h <= 0) return
    if (!target.isShown) return

    val root = target.rootView ?: return
    if (root.width <= 0 || root.height <= 0) return

    // Record the root view, offset so the target's region maps to (0,0).
    captureNode.setPosition(0, 0, w, h)
    val recordCanvas = captureNode.beginRecording()
    var recorded = false
    try {
      target.getLocationInWindow(targetLocation)
      root.getLocationInWindow(rootLocation)
      recordCanvas.translate(
        -(targetLocation[0] - rootLocation[0]).toFloat(),
        -(targetLocation[1] - rootLocation[1]).toFloat()
      )
      isCapturing = true
      // Draws the whole hierarchy; the target itself short-circuits to nothing
      // via the isCapturing guard in ViewUtils, so only the backdrop is captured.
      root.draw(recordCanvas)
      recorded = true
    } catch (_: Throwable) {
      recorded = false
    } finally {
      isCapturing = false
      captureNode.endRecording()
    }

    if (!recorded) {
      hasContent = false
      return
    }

    // Apply the filter chain to the captured backdrop.
    effectNode.setPosition(0, 0, w, h)
    effectNode.setRenderEffect(effect)
    val effectCanvas = effectNode.beginRecording()
    try {
      effectCanvas.drawRenderNode(captureNode)
    } finally {
      effectNode.endRecording()
    }
    hasContent = true

    // Repaint the target so the freshly filtered backdrop shows through.
    target.invalidate()
  }

  /**
   * Draw the filtered backdrop into [canvas], clipped to [clipPath] (the
   * element's rounded outer shape) when provided. Called from [ViewUtils]
   * before the element's own background/content.
   */
  fun draw(canvas: Canvas, clipPath: Path?) {
    if (!hasContent || isCapturing) return
    if (!canvas.isHardwareAccelerated) return
    if (clipPath != null && !clipPath.isEmpty) {
      val save = canvas.save()
      canvas.clipPath(clipPath)
      canvas.drawRenderNode(effectNode)
      canvas.restoreToCount(save)
    } else {
      canvas.drawRenderNode(effectNode)
    }
  }
}
