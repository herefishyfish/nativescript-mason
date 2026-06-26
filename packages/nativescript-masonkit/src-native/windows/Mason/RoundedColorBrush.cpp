#include "pch.h"
#include "RoundedColorBrush.h"
#include "RoundedColorBrush.g.cpp"

namespace winrt::NativeScript::Mason::implementation
{
    void RoundedColorBrush::SetCompositionBrush(winrt::Microsoft::UI::Composition::CompositionBrush const& brush)
    {
        // CompositionBrush is the protected paint slot inherited from XamlCompositionBrushBase; the
        // framework renders it across the element's bounds.
        CompositionBrush(brush);
    }
}
