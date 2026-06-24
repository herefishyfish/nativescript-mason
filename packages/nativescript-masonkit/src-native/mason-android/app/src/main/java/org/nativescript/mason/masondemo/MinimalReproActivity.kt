package org.nativescript.mason.masondemo

import android.graphics.Color
import android.os.Bundle
import android.widget.LinearLayout
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import androidx.core.graphics.toColorInt
import org.nativescript.mason.masonkit.Button
import org.nativescript.mason.masonkit.LengthPercentage
import org.nativescript.mason.masonkit.Mason
import org.nativescript.mason.masonkit.Rect

class MinimalReproActivity : AppCompatActivity() {
  private lateinit var mason: Mason

  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)

    mason = Mason()

    val root = mason.createView(this)

    // Create a single disabled outline button that previously showed the clipping artifact
    val repro = mason.createButton(this).apply {
      textContent = "Coming Soon"
      configure { style ->
        style.background = "#00000000"
        style.color = "#4F46E5".toColorInt()
        style.border = "1 solid #4F46E5"
        style.borderRadius = "8"
        style.padding = Rect(
          LengthPercentage.Points(10f),
          LengthPercentage.Points(16f),
          LengthPercentage.Points(10f),
          LengthPercentage.Points(16f),
        )
      }
    }

    root.addView(repro)

    enableEdgeToEdge()

    ViewCompat.setOnApplyWindowInsetsListener(root) { view, insets ->
      val systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
      root.style.setPadding(8, systemBars.top + 24, 8, systemBars.bottom + 24)
      insets
    }

    setContentView(root)
  }
}
