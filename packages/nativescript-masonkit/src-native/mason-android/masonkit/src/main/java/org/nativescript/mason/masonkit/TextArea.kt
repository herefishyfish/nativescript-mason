package org.nativescript.mason.masonkit

import android.annotation.SuppressLint
import android.content.Context
import android.graphics.Canvas
import android.graphics.Rect
import android.text.Editable
import android.text.InputFilter
import android.text.InputType
import android.text.TextWatcher
import android.util.AttributeSet
import android.util.TypedValue
import android.view.Gravity
import android.view.View
import org.nativescript.mason.masonkit.enums.BoxSizing
import org.nativescript.mason.masonkit.enums.Display
import org.nativescript.mason.masonkit.enums.TextAlign
import org.nativescript.mason.masonkit.events.EventOptions
import org.nativescript.mason.masonkit.input.TextInput
import org.nativescript.mason.masonkit.input.TextInputOwner
import kotlin.math.max

@SuppressLint("AppCompatCustomView")
class TextArea @JvmOverloads constructor(
  context: Context, attrs: AttributeSet? = null, override: Boolean = false
) : TextInput(context, attrs), Element, MeasureFunc, StyleChangeListener, TextInputOwner {

  override val view: View
    get() = this

  override val style: Style
    get() = node.style

  override lateinit var node: Node
    private set

  /**
   * Guards requestLayout() propagation. EditText calls requestLayout() internally
   * for cursor moves, text selection, IME events, and text reflow — none of which
   * change our fixed (rows × lineHeight) intrinsic size.
   *
   * When false, those framework-initiated calls are silently dropped so Mason's
   * full tree re-layout is not triggered on every keystroke or keyboard show/hide.
   * This makes the textarea stable under any windowSoftInputMode.
   *
   * Set to true only within layoutIfSizeChanged() when rows/cols/font actually
   * changed, and reset to false immediately after.
   */
  private var mAllowRequestLayout = true  // true during init so setup() passes through

  override fun requestLayout() {
    if (mAllowRequestLayout) {
      super.requestLayout()
    }
    // Always redraw (cursor blink, selection handles, etc.) even when suppressed.
    // invalidate() is a no-op if already dirty, so this is cheap.
  }

  /**
   * Call when the textarea's intrinsic size has actually changed (rows, cols,
   * or font metrics). Marks the Rust node dirty, permits one requestLayout()
   * propagation, then re-locks suppression.
   */
  private fun layoutIfSizeChanged() {
    node.dirty()
    mAllowRequestLayout = true
    requestLayout()
    mAllowRequestLayout = false
  }

  var rows: Int = 2
    set(value) {
      field = max(1, value)
      // Do NOT set minLines/maxLines here. Mason controls the frame size via
      // measure(); minLines/maxLines are only meaningful for Android's own
      // WRAP_CONTENT measurement, which Mason overrides. More critically,
      // maxLines constrains the DynamicLayout's line-coordinate table, which
      // corrupts bringPointIntoView() scroll calculations for content past
      // that line count — causing fewer visible lines than expected.
      layoutIfSizeChanged()
    }

  var cols: Int = 20
    set(value) {
      field = max(1, value)
      layoutIfSizeChanged()
    }

  var placeholder: String = ""
    set(value) {
      field = value
      hint = value
    }

  var name: String = ""

  var maxLength: Int = -1
    set(value) {
      field = value
      filters = if (value > -1) {
        arrayOf(InputFilter.LengthFilter(value), beforeFilter)
      } else {
        arrayOf(beforeFilter)
      }
    }

  var value: String
    get() = text?.toString().orEmpty()
    set(value) {
      if (text?.toString() == value) {
        return
      }
      setText(value, BufferType.EDITABLE)
      setSelection(text?.length ?: 0)
      // The TextWatcher.afterTextChanged will handle node.dirty() + requestLayout()
    }

  constructor(context: Context, mason: Mason) : this(context, null, true) {
    setup(mason)
  }

  init {
    if (!::node.isInitialized && !override) {
      setup(Mason.shared)
    }
  }

  override fun isOpaque(): Boolean {
    return false
  }

  /**
   * Report the entire view bounds as the "focused rect" instead of the cursor
   * line position (which is what TextView reports by default).
   *
   * There are TWO independent paths that can pan the window when a focused
   * EditText has a cursor below the visible area:
   *
   *   PATH A — bringPointIntoView() → requestRectangleOnScreen() → parent chain
   *             → ViewRootImpl.requestChildRectangleOnScreen()
   *             Blocked by our requestRectangleOnScreen() override below.
   *
   *   PATH B — ViewRootImpl.performTraversals() detects a focus change and
   *             calls scrollToRectOrFocus() DIRECTLY, bypassing PATH A entirely.
   *             scrollToRectOrFocus() calls focused.getFocusedRect() to learn
   *             which rect must stay visible, then adjusts mScrollY of the root
   *             view (the DecorView) — panning the whole window.
   *             This is what causes the toolbar to scroll off-screen.
   *
   * By returning our full view bounds here, we tell ViewRootImpl "the rect that
   * must be visible is the entire textarea box". Since the box was already fully
   * on-screen before the IME appeared, the system determines no window pan is
   * needed, and scrollToRectOrFocus() leaves mScrollY at 0.
   */
  override fun getFocusedRect(r: Rect) {
    r.set(0, 0, width, height)
  }

  /**
   * Report the entire view bounds as the "drawing rect".
   *
   * There is a THIRD path that moves the parent scroll container (e.g.
   * TwoDScrollView / Scroll) when the TextArea is focused or re-focused:
   *
   *   PATH C — TwoDScrollView.requestChildFocus() calls scrollToChild(focused),
   *             which calls focused.getDrawingRect(). Android's default
   *             View.getDrawingRect() returns (scrollX, scrollY, scrollX+w,
   *             scrollY+h). When the TextArea's internal content has scrolled
   *             down N pixels, scrollY=N, so the rect appears N pixels ABOVE
   *             the child's actual frame in the parent's coordinate space.
   *             TwoDScrollView then scrolls itself upward by N pixels to "bring
   *             the child into view" — visually moving the entire textarea box.
   *
   * By returning (0, 0, width, height) we tell every parent scroll container
   * "my visible frame is exactly my layout bounds; no parent scroll needed".
   * The internal content scroll (handled by EditText's own DynamicLayout) is
   * self-contained and should not influence any ancestor's scroll position.
   */
  override fun getDrawingRect(outRect: Rect) {
    outRect.set(0, 0, width, height)
  }

  /**
   * Prevent the cursor-follow scroll from propagating to the parent hierarchy
   * (PATH A — see getFocusedRect above).
   *
   * bringPointIntoView() first scrolls content within our own bounds (desired),
   * then calls requestRectangleOnScreen() to ask ancestors to also scroll/pan.
   * By returning false without calling super we stop that second propagation,
   * keeping the textarea box fixed while its content scrolls internally.
   */
  override fun requestRectangleOnScreen(rectangle: Rect?, immediate: Boolean): Boolean {
    return false
  }

  /**
   * Returns the number of visual content lines (based on newline characters).
   * Always at least 1.
   */
  private val contentLineCount: Int
    get() {
      val current = text?.toString().orEmpty()
      if (current.isEmpty()) return 1
      return max(1, current.count { it == '\n' } + 1)
    }

  private fun setup(mason: Mason) {
    node = mason.createNode(this).apply {
      view = this@TextArea
    }
    node.style.values.put(StyleKeys.ITEM_IS_REPLACED, 1.toByte())
    owner = this
    background = null
    isSingleLine = false
    // Do NOT set minLines/maxLines — see rows setter comment above.
    // Mason's measure() already returns rows×lineHeight as the intrinsic
    // height, so the frame is fixed to the correct size externally.
    // Leaving the EditText's own layout unconstrained lets DynamicLayout
    // track all line coordinates so internal scroll always stays correct.
    inputType =
      InputType.TYPE_CLASS_TEXT or InputType.TYPE_TEXT_FLAG_MULTI_LINE or
        InputType.TYPE_TEXT_FLAG_NO_SUGGESTIONS or InputType.TYPE_TEXT_VARIATION_VISIBLE_PASSWORD
    setHorizontallyScrolling(false)
    // Allow the text to scroll vertically inside the fixed-height box when
    // the field is focused and content overflows — web <textarea> behaviour.
    // isScrollContainer=false tells the Window system this view does not
    // register itself as a scrollable region, regardless of windowSoftInputMode.
    isScrollContainer = false
    setVerticalScrollBarEnabled(true)
    gravity = Gravity.TOP or Gravity.START
    // Do NOT call setTextIsSelectable(true) — on EditText it can silently reset
    // the InputType and focusability set above, breaking keyboard input.

    val density = resources.displayMetrics.density
    val pad = max(1, (2f * density).toInt())
    setPadding(pad, pad, pad, pad)

    configure { style ->
      style.display = Display.InlineBlock
      style.boxSizing = BoxSizing.BorderBox
      style.padding = Rect(
        LengthPercentage.Points(pad.toFloat()),
        LengthPercentage.Points(pad.toFloat()),
        LengthPercentage.Points(pad.toFloat()),
        LengthPercentage.Points(pad.toFloat())
      )
      style.fontSize = Constants.DEFAULT_FONT_SIZE
      style.background = "#FFFFFF"
      style.border = "1 solid #767676"
      style.borderRadius = "4"
      style.textAlign = TextAlign.Left
      style.syncFontMetrics()
    }

    cursorPaint.color = style.resolvedColor
    setTextColor(style.resolvedColor)
    setTextSize(TypedValue.COMPLEX_UNIT_SP, style.resolvedFontSize.toFloat())
    style.resolvedFontFace.font?.let {
      typeface = it
    }
    style.setStyleChangeListener(this)

    // All init-time requestLayout() calls have passed. Lock suppression so that
    // EditText's internal calls (cursor, IME, selection, text reflow) no longer
    // propagate to Mason's root and trigger full-tree re-layout.
    mAllowRequestLayout = false

    // Invalidate and, for CSS height:auto support, mark the node dirty
    // so the Rust engine can re-invoke measure() if needed.
    addTextChangedListener(object : TextWatcher {
      override fun beforeTextChanged(s: CharSequence?, start: Int, count: Int, after: Int) {}
      override fun onTextChanged(s: CharSequence?, start: Int, before: Int, count: Int) {}
      override fun afterTextChanged(s: Editable?) {
        // Height is fixed by `rows` — no need to call requestLayout() on every
        // keystroke. The EditText scrolls the new content internally.
        // dirty() lets the Rust engine know intrinsic size may change if the
        // style height is ever set to Auto.
        node.dirty()
        invalidate()
      }
    })
  }

  override fun onSizeChanged(w: Int, h: Int, oldw: Int, oldh: Int) {
    style.mBackground?.layers?.forEach {
      it.shader = null
      it.shaderWidth = -1
      it.shaderHeight = -1
    }
    style.mBorderRenderer.invalidate()
    super.onSizeChanged(w, h, oldw, oldh)
  }

  override fun onDraw(canvas: Canvas) {
    // Android's View.draw() pre-translates the canvas by (-scrollX, -scrollY)
    // before calling onDraw, so the text layout's internal scroll offset works correctly.
    // However, ViewUtils.onDraw draws background/border at (0, 0, width, height) in the
    // CURRENT canvas space — which is (scrollX, -scrollY) pixels off-screen when there is
    // internal scroll. Result: the textarea's box becomes invisible while text still
    // appears correctly (because TextView.onDraw applies its own +scrollY translation).
    //
    // Fix: save the canvas, counter-translate by (+scrollX, +scrollY) so that (0,0)
    // refers to the view's actual visual top-left for background/border painting, then
    // restore the scroll-offset canvas for the text-content super.onDraw call.
    val sx = scrollX.toFloat()
    val sy = scrollY.toFloat()
    canvas.save()
    canvas.translate(sx, sy)
    ViewUtils.onDraw(this, canvas, style) { c ->
      // Inside the ViewUtils clip/filter block the canvas is at [+scrollX, +scrollY].
      // Restore the original [-scrollX, -scrollY] offset so TextView.onDraw's internal
      // translate(-scrollX, -scrollY + paddingTop) produces the correct net offset,
      // making visible lines fall within the view's physical bounds.
      c.save()
      c.translate(-sx, -sy)
      super.onDraw(c)
      c.restore()
    }
    canvas.restore()
  }

  override fun measure(
    knownWidth: Float,
    knownHeight: Float,
    availableWidth: Float,
    availableHeight: Float
  ): Long {
    // UNIT: all values are in PHYSICAL pixels (device pixels).
    // paint.measureText and fontMetrics are already in physical pixels on Android.
    //
    // PADDING:
    // The measure function returns the CONTENT size (character area only),
    // matching the pattern used by Input.kt. Mason adds the CSS padding
    // (style.padding = Points(pad) per side) externally in the box model.
    // INCLUDING totalPaddingLeft/Right/Top/Bottom here would double-count
    // the CSS padding because style.padding already allocates that space.
    //
    // lineHeight must include fontMetrics.leading so it matches Android's
    // own StaticLayout line height, which uses -ascent + descent + leading.
    // Omitting leading underestimates row height for fonts with leading > 0.
    val charWidth = max(paint.measureText("0"), paint.measureText("W"))
    val fm = paint.fontMetricsInt
    // Use integer font metrics (same source Android's layout engine uses).
    val lineHeight = (-fm.ascent + fm.descent + fm.leading).toFloat()

    // CONTENT size: fixed cols × rows matching web <textarea> default.
    // The view scrolls internally when text overflows (isScrollEnabled-aware).
    var width = charWidth * cols
    var height = lineHeight * rows

    // Definite constraints from the Rust layout engine.
    // Sentinel -3f means "unconstrained" (auto). Guard against non-positive
    // finites and the -1/-2 available-space sentinels which must never appear
    // as known dimensions but would otherwise corrupt the computed size.
    if (knownWidth != -3f && knownWidth.isFinite() && knownWidth >= 0f) {
      width = knownWidth
    }
    if (knownHeight != -3f && knownHeight.isFinite() && knownHeight >= 0f) {
      height = knownHeight
    }

    return MeasureOutput.make(width, height)
  }

  override fun onChange(low: Long, high: Long) {
    val fontColor = StateKeys.hasFlag(low, high, StateKeys.FONT_COLOR)
    val fontSize = StateKeys.hasFlag(low, high, StateKeys.FONT_SIZE)
    val font =
      StateKeys.hasFlag(low, high, StateKeys.FONT_WEIGHT) ||
        StateKeys.hasFlag(low, high, StateKeys.FONT_STYLE) ||
        StateKeys.hasFlag(low, high, StateKeys.FONT_FAMILY)
    val textAlign = StateKeys.hasFlag(low, high, StateKeys.TEXT_ALIGN)

    if (fontColor) {
      cursorPaint.color = style.resolvedColor
      setTextColor(style.resolvedColor)
    }

    if (fontSize) {
      setTextSize(TypedValue.COMPLEX_UNIT_SP, style.resolvedFontSize.toFloat())
    }

    if (font) {
      style.resolvedFontFace.font?.let {
        typeface = it
      }
    }

    if (textAlign) {
      gravity = resolveGravity(style.resolvedTextAlign)
    }

    if (fontSize || font || textAlign) {
      // Font metrics affect intrinsic measure — propagate through Mason.
      layoutIfSizeChanged()
      invalidate()
    }
  }

  override fun onBeforeInput(
    type: String,
    data: String?,
    options: EventOptions?
  ): Boolean {
    val event = org.nativescript.mason.masonkit.events.InputEvent(
      type = "beforeinput",
      data = data,
      inputType = type,
      options
    ).apply {
      target = this@TextArea
    }

    node.mason.dispatch(event)

    return !event.defaultPrevented
  }

  private fun resolveGravity(value: TextAlign): Int {
    val horizontal = when (value) {
      TextAlign.Right, TextAlign.End -> Gravity.END
      TextAlign.Center -> Gravity.CENTER_HORIZONTAL
      else -> Gravity.START
    }
    return Gravity.TOP or horizontal
  }
}
