#pragma once
#include "RoundedColorBrush.g.h"
#include <winrt/Microsoft.UI.Composition.h>

namespace winrt::NativeScript::Mason::implementation
{
    struct RoundedColorBrush : RoundedColorBrushT<RoundedColorBrush>
    {
        RoundedColorBrush() = default;

        // Adopt an externally-built Composition brush as this XAML brush's paint. Called after the
        // brush is attached to a live element (so it is connected), then again whenever the element's
        // size/radius/color change so the rounded mask tracks layout.
        void SetCompositionBrush(winrt::Microsoft::UI::Composition::CompositionBrush const& brush);
    };
}

namespace winrt::NativeScript::Mason::factory_implementation
{
    struct RoundedColorBrush : RoundedColorBrushT<RoundedColorBrush, implementation::RoundedColorBrush>
    {
    };
}
