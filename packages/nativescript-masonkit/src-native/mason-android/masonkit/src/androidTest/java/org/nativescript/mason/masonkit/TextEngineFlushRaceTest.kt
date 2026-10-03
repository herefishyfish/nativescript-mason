package org.nativescript.mason.masonkit

import androidx.test.ext.junit.runners.AndroidJUnit4
import androidx.test.platform.app.InstrumentationRegistry
import org.junit.Assert.fail
import org.junit.Test
import org.junit.runner.RunWith
import org.nativescript.mason.masonkit.enums.TextType
import java.util.concurrent.CountDownLatch
import java.util.concurrent.atomic.AtomicReference

/**
 * Regression test for a crash seen on instrumented runs: registerPendingTextStyle
 * mutates the shared pendingTextStyleFlush set from whatever thread a style write
 * lands on, while flushPendingTextStyles copies and clears it on the main thread.
 * Concurrent add + toTypedArray on a plain HashSet threw ArrayIndexOutOfBoundsException.
 */
@RunWith(AndroidJUnit4::class)
class TextEngineFlushRaceTest {
  @Test
  fun concurrentRegisterAndFlushDoesNotThrow() {
    val instr = InstrumentationRegistry.getInstrumentation()
    val ctx = instr.targetContext
    val mason = Mason()
    val engines = List(64) { TextView(ctx, mason, TextType.Span).engine }
    val failure = AtomicReference<Throwable>()
    val stop = CountDownLatch(1)
    val registerThread = Thread {
      try {
        var i = 0
        while (stop.count > 0L) {
          TextEngine.registerPendingTextStyle(engines[i++ % engines.size])
        }
      } catch (t: Throwable) {
        failure.compareAndSet(null, t)
      }
    }
    instr.runOnMainSync {
      registerThread.start()
      val deadline = System.nanoTime() + 3_000_000_000L
      while (System.nanoTime() < deadline && failure.get() == null) {
        TextEngine.flushPendingTextStyles()
      }
      stop.countDown()
      registerThread.join(5000)
    }
    failure.get()?.let { fail("concurrent register/flush threw: ${it.stackTraceToString()}") }
    mason.clear()
  }
}
