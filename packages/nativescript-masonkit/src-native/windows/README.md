# Mason — Windows native (C++/WinRT)

`NativeScript.Mason` is the Windows-native backing for `@triniwiz/nativescript-masonkit`. It is a
C++/WinRT **Windows Runtime Component** that wraps the Rust Taffy core (`mason-c`) and exposes it
to the NativeScript Windows runtime as activatable WinRT classes — the Windows equivalent of the
iOS Swift `Mason` framework and the Android `masonkit` AAR.

The runtime discovers the component by auto-scanning the app output dir for `*.winmd` at startup
and activates the classes via `RoGetActivationFactory` (registered as
`windows.activatableClass.inProcessServer` in the app `Package.appxmanifest` — see
`../../platforms/windows/plugin.targets`). That is what "activating our classes for the runtime"
means here.

The component projects these runtime classes, all under the `NativeScript.Mason` namespace:

- `NativeScript.Mason.Mason` — the layout engine (node factories, compute, device scale).
- `NativeScript.Mason.Node` — a node in the layout tree (children, style, compute, layout).
- `NativeScript.Mason.Style` — the per-node style writer (`SetWithValues`, grid, buffer).
- `NativeScript.Mason.Layout` — the immutable computed layout (geometry + subtree; SIMD-backed).
- `NativeScript.Mason.MeasureOutput` — packs a measure-callback result.
- `NativeScript.Mason.View` — a WinUI `Microsoft.UI.Xaml.Controls.Panel` that owns a `Node` and
  runs Mason layout in its Measure/Arrange overrides (the analogue of the iOS `MasonUIView` /
  Android `View`). Leaf children are measured via a Mason measure callback; nested `View`s nest.

The engine classes are framework-agnostic; `View` pulls in WinUI 3 (Windows App SDK), so the whole
component is built `UseWinUI`. One DLL (`NativeScript.Mason.dll`) + one winmd ship everything.

## Layout

```
windows/
  Mason.sln
  Mason/                         NativeScript.Mason.vcxproj — the WinUI/WinRT component (DynamicLibrary -> dll + winmd)
    MasonEnums.idl Mason.idl Node.idl Style.idl Layout.idl View.idl   runtimeclass contracts
    *.h / *.cpp                  implementations (engine wraps mason_native.h; View wraps a XAML Panel)
    include/mason_native.h       vendored mason-c C ABI header
    exports.cpp                  DllGetActivationFactory / DllCanUnloadNow
  Demo/                          Demo.vcxproj — native console harness (compiles the engine sources, asserts layout)
  nuget/                         NuGet package (npm consumers pull the component from here)
  publish.ps1                    build Rust lib + component -> platforms/windows/{x64,arm64}
  pack.ps1                       pack the NuGet from the published binaries
```

The `Demo` harness builds only the engine sources (it stays headless — no WinUI), so it exercises
`Mason`/`Node`/`Style`/`Layout`/`MeasureOutput` directly. `View` is validated visually through
`apps/demo` on the NativeScript Windows runtime.

## Build

Prerequisites: Visual Studio 2022/2026 with the **Desktop development with C++** workload
(MSVC v143+, Windows SDK 10.0.26100, C++/WinRT) and the Rust **MSVC** toolchain (`rustup`, targets
`x86_64-pc-windows-msvc` and `aarch64-pc-windows-msvc`).

```powershell
# From this directory. Builds masonnative.lib (Rust, +crt-static) then the C++/WinRT component
# for x64 + ARM64 and copies the dll/winmd into ../../platforms/windows/{x64,arm64}.
pwsh ./publish.ps1

# Or via the plugin package script:  npm run build:windows
```

The standalone native test harness:

```powershell
# Open Mason.sln in Visual Studio and run "Demo", or:
pwsh ./publish.ps1            # ensures masonnative.lib exists
msbuild Demo\Demo.vcxproj -p:Configuration=Release -p:Platform=x64
.\Demo\bin\x64\Release\Demo.exe   # prints PASS/FAIL per layout assertion
```

## Distribution

`platforms/windows/{x64,arm64}/*.{dll,winmd}` are **not committed** (gitignored). For local builds
`plugin.targets` copies them and registers the activatable classes. For npm consumers `plugin.props`
adds a `PackageReference` to the `NativeScript.Mason` NuGet package (built with `pack.ps1`), whose
own targets do the copy + registration — mirroring Android (Maven AAR) and iOS (SPM/Pod).
