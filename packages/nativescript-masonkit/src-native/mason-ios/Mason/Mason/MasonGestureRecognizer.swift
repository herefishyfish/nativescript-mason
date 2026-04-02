//
//  MasonGestureRecognizer.swift
//  Mason
//
//  Created by Osei Fortune on 11/01/2026.
//

import UIKit

class MasonGestureRecognizer: UIGestureRecognizer {
  weak var owner: MasonElement?
  weak var targetView: UIView?
  internal var isSubmit: Bool = false
  var eventDispatched: Bool = false
  init(targetView: UIView) {
    self.targetView = targetView
    super.init(target: nil, action: nil)
    // We dispatch the click event ourselves in touchesBegan and don't need UIKit
    // to delay touch-ended delivery or cancel touches in views. On iOS 26 the
    // default delaysTouchesEnded=true causes a nil-event crash in
    // _delayTouchesForEvent:inPhase: when state is set to .recognized before
    // touchesEnded has occurred.
    delaysTouchesEnded = false
    cancelsTouchesInView = false
  }

  override func touchesBegan(_ touches: Set<UITouch>, with event: UIEvent) {
    // Track that a touch sequence started; click fires on touchesEnded.
  }

  override func touchesEnded(_ touches: Set<UITouch>, with event: UIEvent) {
    guard let touch = touches.first, let view = targetView else {
      state = .failed
      return
    }

    // Only fire click if the finger lifted inside the view (not a drag).
    let location = touch.location(in: view)
    guard view.bounds.contains(location) else {
      state = .failed
      return
    }

    let click = MasonMouseEvent(
      type: "click",
      options: MasonMouseEventOptions().apply {
        $0.clientX = Float(location.x)
        $0.clientY = Float(location.y)
        $0.screenX = Float(location.x)
        $0.screenY = Float(location.y)
        $0.pageX = Float(location.x)
        $0.pageY = Float(location.y)
      }
    )
    click.target = view

    if let owner = owner {
      owner.node.mason.dispatch(click, owner.node)
    }

    if click.defaultPrevented {
      state = .failed
    } else {
      state = .recognized
    }

    eventDispatched = true
  }

  override func touchesCancelled(_ touches: Set<UITouch>, with event: UIEvent) {
    state = .cancelled
  }

  override func reset() {
    eventDispatched = false
  }
}
