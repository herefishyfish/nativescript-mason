# NativeScript.Mason (C++/WinRT)

Native Windows Runtime Component backing [`@triniwiz/nativescript-masonkit`](https://github.com/triniwiz/nativescript-mason)
on the NativeScript Windows runtime.

It exposes the Mason layout engine — a web-inspired (flexbox / CSS grid / block / inline) layout
engine built on the Rust [Taffy](https://github.com/DioxusLabs/taffy) core (`mason-c`) — as
activatable WinRT runtime classes:

- `NativeScript.Mason.Mason` — the layout engine (node factories, compute, device scale).
- `NativeScript.Mason.Node` — a node in the layout tree (children, style, compute, layout).
- `NativeScript.Mason.Style` — the per-node style writer (`SetWithValues`, grid strings, buffer).
- `NativeScript.Mason.Layout` — the immutable computed layout (geometry + subtree).
- `NativeScript.Mason.MeasureOutput` — packs a measure-callback result.

## Usage

Add a `PackageReference` from a C++/WinRT or NativeScript-Windows app. The bundled
`build/native/NativeScript.Mason.targets`:

1. references the `.winmd` so cppwinrt generates `winrt/NativeScript.Mason.h`,
2. copies the active-architecture `NativeScript.Mason.dll` next to your output, and
3. registers the activatable classes in your `Package.appxmanifest`.

Supported architectures: `win10-x64`, `win10-arm64`.
