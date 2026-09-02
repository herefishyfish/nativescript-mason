package org.nativescript.mason.masonkit

import java.util.ArrayDeque
import java.util.concurrent.atomic.AtomicReferenceArray

class ObjectManager private constructor() {

  private val freeIds = ArrayDeque<Int>()
  @Volatile private var objects = AtomicReferenceArray<Any?>(INITIAL_CAPACITY)
  private var nextId = 0

  @Synchronized
  fun add(value: Any): Int {
    val id = if (freeIds.isEmpty()) nextId++ else freeIds.removeFirst()
    ensureCapacity(id + 1)
    objects.set(id, value)
    return id
  }

  @Synchronized
  fun remove(id: Int) {
    if (id >= 0 && id < objects.length() && objects.getAndSet(id, null) != null) {
      freeIds.addLast(id)
    }
  }

  operator fun get(id: Int): Any? {
    val table = objects
    return if (id >= 0 && id < table.length()) table.get(id) else null
  }

  @Synchronized
  fun clear() {
    objects = AtomicReferenceArray(INITIAL_CAPACITY)
    freeIds.clear()
    nextId = 0
  }

  private fun ensureCapacity(needed: Int) {
    val current = objects
    if (needed <= current.length()) return
    var capacity = current.length()
    while (capacity < needed) capacity *= 2
    val grown = AtomicReferenceArray<Any?>(capacity)
    for (i in 0 until current.length()) grown.set(i, current.get(i))
    objects = grown
  }

  companion object {
    private const val INITIAL_CAPACITY = 256
    @JvmStatic
    val shared = ObjectManager()

    @JvmStatic
    fun addItem(value: Any): Int {
      return shared.add(value)
    }
  }
}
