//
//  MasonShadowLayer.swift
//  Mason
//
//  CSS box-shadow rendering using CALayer
//

import UIKit

/// A sublayer that renders CSS box-shadow effects outside the view's bounds
class MasonShadowLayer: CALayer {
  
  unowned var masonStyle: MasonStyle?
  
  // Cache for invalidation
  private var cachedBounds: CGRect = .zero
  private var cachedShadowsHash: Int = 0
  private var cachedOutsetShadows: [BoxShadow] = []
  private var cachedOutsetHash: Int = 0
  
  override init() {
    super.init()
    setup()
  }
  
  init(style: MasonStyle) {
    self.masonStyle = style
    super.init()
    setup()
  }
  
  override init(layer: Any) {
    if let other = layer as? MasonShadowLayer {
      self.masonStyle = other.masonStyle
    }
    super.init(layer: layer)
    setup()
  }
  
  required init?(coder: NSCoder) {
    fatalError("init(coder:) has not been implemented")
  }
  
  private func setup() {
    // Allow drawing outside bounds
    masksToBounds = false
    isOpaque = false
    needsDisplayOnBoundsChange = true
    contentsScale = UIScreen.main.scale
  }
  
  private func resolveOutsetShadows() -> [BoxShadow] {
    guard let style = masonStyle else { return [] }
    let h = style.boxShadows.hashValue
    if h != cachedOutsetHash {
      cachedOutsetHash = h
      cachedOutsetShadows = style.boxShadows.filter { !$0.inset }
    }
    return cachedOutsetShadows
  }

  /// Update the layer to match the view's frame (in superview coordinates) plus shadow expansion
  func updateBounds(viewBounds: CGRect, viewFrame: CGRect) {
    guard let style = masonStyle else { return }

    let outsetShadows = resolveOutsetShadows()
    if outsetShadows.isEmpty {
      isHidden = true
      return
    }
    
    isHidden = false
    
    // Calculate max shadow expansion
    var maxExpand: CGFloat = 0
    for shadow in outsetShadows {
      let expand = shadow.blurRadius * 3 + abs(shadow.offsetX) + abs(shadow.offsetY) + shadow.spreadRadius
      maxExpand = max(maxExpand, expand)
    }
    maxExpand += 20 // Extra padding
    
    // Position layer to cover shadow area (in superview coordinates)
    let expandedFrame = viewFrame.insetBy(dx: -maxExpand, dy: -maxExpand)
    if frame != expandedFrame {
      frame = expandedFrame
    }
    
    // Check if we need to redraw
    let shadowsHash = style.boxShadows.hashValue
    if cachedBounds != viewBounds || cachedShadowsHash != shadowsHash {
      cachedBounds = viewBounds
      cachedShadowsHash = shadowsHash
      setNeedsDisplay()
    }
  }
  
  override func draw(in context: CGContext) {
    guard let style = masonStyle else { return }
    
    let outsetShadows = resolveOutsetShadows()
    if outsetShadows.isEmpty { return }

    // The view's rect within our expanded bounds
    let viewRect = CGRect(
      x: bounds.width / 2 - cachedBounds.width / 2,
      y: bounds.height / 2 - cachedBounds.height / 2,
      width: cachedBounds.width,
      height: cachedBounds.height
    )
    
    style.mBorderRender.resolve(for: cachedBounds)
    let hasRadii = style.mBorderRender.hasRadii()
    
    // Pre-compute the inner clip used to mask every shadow iteration.
    // Expand the inner clip by 1 device pixel so its anti-aliased edge
    // sits underneath the view's opaque background.  Without this, the
    // partially-transparent clip-edge pixels are visible through the
    // view's transparent rounded corners, producing a dark fringe.
    let scale = UIScreen.main.scale
    let expand: CGFloat = 1.0 / scale
    let expandedViewRect = viewRect.insetBy(dx: -expand, dy: -expand)

    let innerClipPath: UIBezierPath
    if hasRadii {
      innerClipPath = style.mBorderRender.getClipPath(rect: expandedViewRect, radius: style.mBorderRender.radius)
    } else {
      innerClipPath = UIBezierPath(rect: expandedViewRect)
    }
    let reversedInner = innerClipPath.reversing()

    // Draw shadows in reverse order (first shadow ends up on top)
    for i in stride(from: outsetShadows.count - 1, through: 0, by: -1) {
      let shadow = outsetShadows[i]
      context.saveGState()

      let spread = shadow.spreadRadius

      // Calculate shadow shape bounds (expanded by spread)
      let shadowRect = CGRect(
        x: viewRect.origin.x - spread,
        y: viewRect.origin.y - spread,
        width: viewRect.width + spread * 2,
        height: viewRect.height + spread * 2
      )

      // Create shadow path
      let shadowPath: UIBezierPath
      if hasRadii {
        let adjustedRadius = adjustRadius(style.mBorderRender.radius, spread: spread, rect: shadowRect)
        shadowPath = style.mBorderRender.getClipPath(rect: shadowRect, radius: adjustedRadius)
      } else {
        shadowPath = UIBezierPath(rect: shadowRect)
      }

      // Set up shadow parameters
      let shadowColor = shadow.color.cgColor
      let shadowOffset = CGSize(width: shadow.offsetX, height: shadow.offsetY)
      let shadowBlur = shadow.blurRadius

      // Clip to area outside the view rect to only show shadow
      let clipPath = UIBezierPath(rect: bounds)
      clipPath.append(reversedInner)
      context.addPath(clipPath.cgPath)
      context.clip()

      // Draw shadow: fill the shape with an OPAQUE color so that the
      // shadow projection carries the intended alpha from `shadowColor`
      // alone.  The fill itself is clipped away (inner rect excluded),
      // so only the blurred shadow projection is visible.  Using a
      // translucent fill would double-attenuate the shadow (fill alpha
      // × shadow-color alpha), producing a nearly invisible result.
      //
      // Use the shadow's own color (at full opacity) instead of black
      // so that anti-alias bleed at the clip edge blends toward the
      // shadow color rather than producing a visible black fringe —
      // especially noticeable with small blur radii.
      context.setShadow(offset: shadowOffset, blur: shadowBlur, color: shadowColor)
      let opaqueColor = shadow.color.withAlphaComponent(1.0).cgColor
      context.setFillColor(opaqueColor)
      context.addPath(shadowPath.cgPath)
      context.fillPath()

      context.restoreGState()
    }
  }
  
  /// Adjust border radius by spread amount
  private func adjustRadius(_ radius: CSSBorderRenderer.BorderRadius, spread: CGFloat, rect: CGRect) -> CSSBorderRenderer.BorderRadius {
    func adjustCorner(_ corner: CSSBorderRenderer.CornerRadius) -> CSSBorderRenderer.CornerRadius {
      let resolved = corner.resolved(rect: rect)
      let newX = max(0, resolved.x + spread)
      let newY = max(0, resolved.y + spread)
      return CSSBorderRenderer.CornerRadius(
        horizontal: .Points(Float(newX)),
        vertical: .Points(Float(newY)),
        exponent: corner.exponent
      )
    }
    
    return CSSBorderRenderer.BorderRadius(
      topLeft: adjustCorner(radius.topLeft),
      topRight: adjustCorner(radius.topRight),
      bottomRight: adjustCorner(radius.bottomRight),
      bottomLeft: adjustCorner(radius.bottomLeft)
    )
  }
}
