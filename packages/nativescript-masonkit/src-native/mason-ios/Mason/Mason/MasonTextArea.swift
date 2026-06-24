//
//  MasonTextArea.swift
//  Mason
//
//  Created by Osei Fortune on 20/03/2026.
//

import UIKit

@objc(MasonTextArea)
@objcMembers
public class MasonTextArea: MasonTextInput, MasonEventTarget, MasonElement, MasonElementObjc, StyleChangeListener {

	public let node: MasonNode
	public let mason: NSCMason

	public var uiView: UIView { return self }
	public var style: MasonStyle { return node.style }

	private var _rows: Int = 2
	public var rows: Int {
		get { return _rows }
		set {
			let v = max(1, newValue)
			if v == _rows { return }
			_rows = v
			requestLayout()
		}
	}

	private var _cols: Int = 20
	public var cols: Int {
		get { return _cols }
		set {
			let v = max(1, newValue)
			if v == _cols { return }
			_cols = v
			requestLayout()
		}
	}

	public var name: String = ""

	public var maxLength: Int = -1

	public var value: String {
		get { return text ?? "" }
		set {
			if text == newValue { return }
			text = newValue
			requestLayout()
		}
	}

	/// Count the number of hard-newline-delimited content lines.
	/// Kept for CSS height:auto support where the measure function may
	/// want to reflect the actual content height.
	private var contentLineCount: Int {
		let current = text ?? ""
		if current.isEmpty { return 1 }
		return max(1, current.components(separatedBy: "\n").count)
	}

	/// Returns the number of visual (rendered) lines using the layout
	/// manager.  Accounts for both hard newlines AND soft word-wrap.
	/// Use this when the textarea must physically grow for every
	/// visible line, not just hard returns.
	private var visualLineCount: Int {
		let text = self.text ?? ""
		if text.isEmpty { return 1 }
		let glyphRange = layoutManager.glyphRange(for: textContainer)
		var lines = 0
		var index = glyphRange.location
		while index < NSMaxRange(glyphRange) {
			var lineRange = NSRange()
			layoutManager.lineFragmentRect(forGlyphAt: index, effectiveRange: &lineRange)
			lines += 1
			index = NSMaxRange(lineRange)
		}
		return max(1, lines)
	}

	// MARK: - Initializers

	public init(mason doc: NSCMason) {
		mason = doc
		node = doc.createNode()
		super.init(frame: .zero, textContainer: nil)
		commonSetup()
	}

	required public init?(coder: NSCoder) {
		mason = NSCMason.shared
		node = mason.createNode()
		super.init(coder: coder)
		commonSetup()
	}

	private func commonSetup() {
		node.view = self

		node.style.prepareMut()
		node.style.setUInt8(StyleKeys.ITEM_IS_REPLACED, 1)

		// Owner for events
		owner = self

		isOpaque = false
		backgroundColor = .clear

		// Text area behaviour — multi-line.
		// We keep isScrollEnabled = false during initialisation to prevent UIKit
		// from creating a degenerate zero-width text container (UITextView with
		// scroll enabled and a .zero frame collapses all layout).  It is turned
		// back on once the measure function has told the Rust engine the correct
		// intrinsic size, which will be applied as the frame before the first
		// paint.  The end result matches web <textarea> default: fixed height
		// (rows × line-height) with internal scroll when content overflows.
		singleLineBehavior = false
		isScrollEnabled = false   // switched to true after frame is first applied
		textContainer.maximumNumberOfLines = 0
		textContainer.lineBreakMode = .byWordWrapping

		// Small default padding to match other platforms.
		// UIEdgeInsets and lineFragmentPadding are in UIKit POINTS (device-independent),
		// NOT physical pixels. Using NSCMason.scale here was wrong — it produced 6 pt
		// instead of 2 pt on a 3× device, inflating the padding 3× and corrupting the
		// intrinsic size reported to the Rust layout engine.
		let insetPt: CGFloat = 2
		setBaseTextContainerInset(UIEdgeInsets(top: insetPt, left: insetPt, bottom: insetPt, right: insetPt))
		// Set lineFragmentPadding to 0. Any non-zero value here adds to the horizontal
		// space between the text container edges and the text itself. It is not a CSS
		// concept and must not be included in the measure function's padding calculation.
		// Previously this was also set to `2 * NSCMason.scale` (6 pt on 3×), adding
		// another 12 pt (36 px) of unclaimed horizontal padding to the intrinsic width.
		textContainer.lineFragmentPadding = 0

		// Default style
		configure { style in
			style.display = Display.InlineBlock
			style.boxSizing = BoxSizing.BorderBox
			// Mason operates in PHYSICAL pixels. The web default textarea padding is
			// 2 CSS px = 2 × NSCMason.scale physical pixels (e.g. 6 px on a 3× device).
			// Previously this incorrectly used just NSCMason.scale (= 3 px on 3×,
			// half the correct value) and also mismatched the textContainerInset above.
			let s = NSCMason.scale
			style.padding = MasonRect(.Points(2 * s), .Points(2 * s), .Points(2 * s), .Points(2 * s))
			style.fontSize = Constants.DEFAULT_FONT_SIZE
			style.background = "#FFFFFF"
			style.border = "1 solid #767676"
			style.borderRadius = "4"
			style.textAlign = TextAlign.Left
			style.syncFontMetrics()
		}

		// Initial visual state
		textColor = UIColor.colorFromARGB(style.resolvedColor)
		if style.font.uiFont == nil { style.font.loadSync(nil) }
		if let f = style.font.uiFont { font = f }

		style.setStyleChangeListener(listener: self)

		// Set up the measure function that the Rust layout engine calls to
		// determine the intrinsic size of this textarea node.
		//
		// IMPORTANT: Avoid calling getDefaultAttributes() here — the Rust
		// engine holds a read lock during measure, so any style-buffer
		// writes (e.g. font loading inside getDefaultAttributes) would
		// deadlock or silently fail. Use the UITextView's own `font`
		// property which is already loaded at this point.
		//
		// UNIT:
		// • The Rust engine passes known dimensions and available space in
		//   PHYSICAL pixels (device pixels). All values from `known` are px.
		// • The measure function must return a CGSize in PHYSICAL pixels.
		// • UIFont metrics (lineHeight, charWidth, textContainerInset) are
		//   in UIKit POINTS. Multiply by NSCMason.scale to convert to px.
		//
		// PADDING:
		// • textContainerInset is 2 pt per side = 2 × scale px per side.
		//   lineFragmentPadding is 0. Total padding = 4 pt per axis.
		// • style.padding is 2 × scale px per side (= 4 × scale px per axis).
		// • These match: the measure includes content + UIKit padding; Mason
		//   allocates the same amount as CSS padding. No double-counting.
		node.measureFunc = { [weak self] known, available in
			guard let self = self else { return .zero }

			let f = self.font ?? self.placeholderLabel.font ?? UIFont.systemFont(ofSize: UIFont.systemFontSize)
			let scale = CGFloat(NSCMason.scale)
			guard scale > 0 else { return .zero }

			// Character width in points. Use both "0" and "W" so we handle both
			// monospaced and proportional fonts reasonably. NSString.size is safe
			// to call during measure (no style-buffer writes).
			let attrs: [NSAttributedString.Key: Any] = [.font: f]
			let charWidthPt = max(
				("0" as NSString).size(withAttributes: attrs).width,
				("W" as NSString).size(withAttributes: attrs).width
			)
			let lineHeightPt = f.lineHeight

			// Padding contribution in points.
			// textContainerInset = 2 pt each side (corrected from the earlier
			// 2×scale-as-points bug). lineFragmentPadding = 0.
			// Total: left+right = 4 pt; top+bottom = 4 pt.
			let inset = self.textContainerInset
			let horizontalPaddingPt = inset.left + inset.right
				+ self.textContainer.lineFragmentPadding * 2
			let verticalPaddingPt = inset.top + inset.bottom

			// Intrinsic: fixed by cols × rows, matching web <textarea> default.
			// The view scrolls internally when content exceeds these bounds.
			let intrinsicWidthPx  = (charWidthPt * CGFloat(self.cols) + horizontalPaddingPt) * scale
			let intrinsicHeightPx = (lineHeightPt * CGFloat(self._rows) + verticalPaddingPt) * scale

			// Overrides from the layout engine (definite known dimensions).
			// The engine passes NaN for unconstrained axes. We also guard against
			// non-finite values (Inf) and negative sentinels (< 0) which should
			// never appear for known dims but would otherwise produce invalid frames.
			let finalWidth: CGFloat
			if let kw = known?.width, kw.isFinite, kw >= 0 {
				finalWidth = kw
			} else {
				finalWidth = intrinsicWidthPx
			}

			let finalHeight: CGFloat
			if let kh = known?.height, kh.isFinite, kh >= 0 {
				finalHeight = kh
			} else {
				finalHeight = intrinsicHeightPx
			}

			return CGSize(width: finalWidth, height: finalHeight)
		}

		node.setMeasureFunction(node.measureFunc!)
	}

	// MARK: - Drawing

	public override func draw(_ rect: CGRect) {
		guard let context = UIGraphicsGetCurrentContext() else {
			super.draw(rect)
			return
		}

		let hasBackground = style.mBackground.color != nil || !style.mBackground.layers.isEmpty
		let hasBorder = !style.mBorderRender.css.isEmpty

		style.mBorderRender.resolve(for: bounds)
		let borderWidths = style.mBorderRender.cachedWidths

		// Draw mason background behind the text content
		if hasBackground {
			let innerRect = bounds.inset(by: UIEdgeInsets(
				top: borderWidths.top,
				left: borderWidths.left,
				bottom: borderWidths.bottom,
				right: borderWidths.right
			))

			context.saveGState()
			if style.mBorderRender.hasRadii() {
				let innerRadius = style.mBorderRender.radius.insetByBorderWidths(borderWidths)
				let innerPath = style.mBorderRender.getClipPath(rect: innerRect, radius: innerRadius)
				context.addPath(innerPath.cgPath)
				context.clip()
			}
			style.mBackground.draw(on: self, in: context, rect: innerRect)
			context.restoreGState()
		}

		// Draw border on top
		// NOTE: do NOT call super.draw(rect) here. UITextView (UIScrollView) fills
		// the CGContext with backgroundColor (.clear) inside super.draw(), which
		// erases the Mason background already drawn above. Text is rendered by
		// UITextView's private _UITextContainerView subview independently of draw().
		if hasBorder {
			style.mBorderRender.draw(in: context, rect: bounds)
		}
	}

	// MARK: - Layout

	public override func layoutSubviews() {
		super.layoutSubviews()
		style.updateShadowLayer(for: bounds)
		autoComputeIfRoot()

		// Re-enable scroll once the frame has been applied by the layout engine,
		// so the UITextView can scroll internally when content exceeds the fixed
		// rows height (matching web <textarea> default behaviour). We defer this
		// to layoutSubviews so the text container is already properly sized.
		if !isScrollEnabled && bounds.width > 0 && bounds.height > 0 {
			isScrollEnabled = true
		}
	}

	// MARK: - Text changes → re-measure for dynamic height

	public override func textViewDidChange(_ textView: UITextView) {
		super.textViewDidChange(textView)
		// Mark dirty for CSS height:auto support. For the fixed-rows web-default
		// mode the measure function returns a constant value so this is a no-op.
		node.markDirty()
		requestLayout()
		setNeedsDisplay()
	}

	// MARK: - Style changes

	public func onStyleChange(_ low: UInt64, _ high: UInt64) {
		let state = StateKeys(low: low, high: high)
		let fontColor = state.contains(.color)
		let fontSize = state.contains(.fontSize)
		let fontChange = state.contains(.fontWeight) || state.contains(.fontStyle) || state.contains(.fontFamily)
		let textAlign = state.contains(.textAlign)

		if fontColor {
			textColor = UIColor.colorFromARGB(style.resolvedColor)
		}

		if fontSize || fontChange {
			if style.font.uiFont == nil { style.font.loadSync(nil) }
			if let f = style.font.uiFont { font = f }
		}

		if textAlign {
			switch style.resolvedTextAlign {
			case .Auto:
				textAlignment = .natural
			case .Left:
				textAlignment = .left
			case .Right:
				textAlignment = .right
			case .Center:
				textAlignment = .center
			case .Justify:
				textAlignment = .justified
			case .Start:
				let isLTR = UIView.userInterfaceLayoutDirection(for: .unspecified) == .leftToRight
				textAlignment = isLTR ? .left : .right
			case .End:
				let isLTR = UIView.userInterfaceLayoutDirection(for: .unspecified) == .leftToRight
				textAlignment = isLTR ? .right : .left
			}
		}

		if fontColor || fontSize || fontChange || textAlign {
			requestLayout()
			setNeedsDisplay()
		}
	}

	// MARK: - Input validation

	public override func textView(_ textView: UITextView, shouldChangeTextIn range: NSRange, replacementText text: String) -> Bool {
		let allowed = super.textView(textView, shouldChangeTextIn: range, replacementText: text)
		if !allowed { return false }

		if maxLength > -1 {
			let current = textView.text ?? ""
			guard let swRange = Range(range, in: current) else { return allowed }
			let updated = current.replacingCharacters(in: swRange, with: text)
			if updated.count > maxLength { return false }
		}

		return true
	}

}
