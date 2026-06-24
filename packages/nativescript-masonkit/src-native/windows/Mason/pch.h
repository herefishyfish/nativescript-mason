#pragma once
// Required BEFORE any C++/WinRT header. Also pulls in combaseapi's DllCanUnloadNow declaration
// (HRESULT, no dllexport) that exports.cpp's definition must match.
#include <unknwn.h>
#include <winrt/Windows.Foundation.h>
#include <winrt/Windows.Foundation.Collections.h>
// WinUI 3 (Windows App SDK) — base for the View custom Panel + measure/arrange. The engine classes
// (Mason/Node/Style/Layout) don't use these, but the shared PCH carries them for View.cpp.
#include <winrt/Microsoft.UI.Xaml.h>
#include <winrt/Microsoft.UI.Xaml.Controls.h>
#include <winrt/Microsoft.UI.Xaml.Media.h>
#include <array>
#include <memory>
#include <mutex>
#include <string>
#include <vector>
// SIMD for the computed-layout tree (parity with the iOS `simd` SIMD4/SIMD2 storage). Header-only
// in the Windows SDK; portable across x64 (SSE) and ARM64 (NEON), unlike raw <xmmintrin.h>.
#include <DirectXMath.h>

// mason-c C ABI. The component links masonnative.lib (built from crates/mason-windows) and reaches
// the Rust Taffy engine purely through these `extern "C"` functions. Only cross-platform entry
// points are referenced (no apple-only helpers), so the static archive resolves cleanly.
#include "include/mason_native.h"
