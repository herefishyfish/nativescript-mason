package org.nativescript.mason.masonkit

import android.util.Log

/**
 * TEMPORARY measure-volume instrumentation.
 *
 * Question it answers: one correct layout of the HN thread issues ~47k measure
 * callbacks for ~84 text nodes (~560 each), while an equivalent pure-Rust tree
 * issues ~12 each. Which probe kind is multiplying, and on which nodes?
 *
 * Enable with: adb shell setprop log.tag.MasonPerf DEBUG   (read once at init)
 * Remove once the call-volume question is settled.
 */
internal object MasonPerf {
  private const val TAG = "MasonPerf"

  @JvmField
  val enabled: Boolean = Log.isLoggable(TAG, Log.DEBUG)

  private var passCount = 0

  private var total = 0
  private var minContent = 0
  private var maxContent = 0
  private var definite = 0

  /** calls per node, and the distinct constraint keys each node was asked for */
  private val perNode = HashMap<Long, Int>()
  private val perNodeKeys = HashMap<Long, HashSet<Long>>()
  private val perNodeKind = HashMap<Long, String>()

  fun onMeasure(nodePtr: Long, availableWidth: Float, cacheKey: Long, kind: String) {
    if (!enabled) return
    total++
    when (availableWidth) {
      -1f -> minContent++
      -2f -> maxContent++
      else -> definite++
    }
    perNode[nodePtr] = (perNode[nodePtr] ?: 0) + 1
    perNodeKeys.getOrPut(nodePtr) { HashSet() }.add(cacheKey)
    perNodeKind[nodePtr] = kind
  }

  fun beginPass(): Long {
    if (!enabled) return 0L
    total = 0
    minContent = 0
    maxContent = 0
    definite = 0
    perNode.clear()
    perNodeKeys.clear()
    perNodeKind.clear()
    return System.nanoTime()
  }

  fun endPass(label: String, startNanos: Long) {
    if (!enabled || startNanos == 0L) return
    passCount++
    val ms = (System.nanoTime() - startNanos) / 1e6
    Log.d(
      TAG,
      "pass #%d (%s) took=%.1fms measures=%d [minContent=%d maxContent=%d definite=%d] textNodes=%d"
        .format(passCount, label, ms, total, minContent, maxContent, definite, perNode.size)
    )
    if (total < 100) return
    for ((ptr, count) in perNode.entries.sortedByDescending { it.value }.take(5)) {
      Log.d(
        TAG,
        "   node 0x%x %s measured %d times for %d distinct constraints"
          .format(ptr, perNodeKind[ptr] ?: "?", count, perNodeKeys[ptr]?.size ?: 0)
      )
    }
  }
}
