#include "pch.h"
#include "Br.h"
#include "Br.g.cpp"
#include <winrt/NativeScript.Mason.h>

using namespace winrt;
using namespace winrt::Windows::Foundation;

namespace winrt::NativeScript::Mason::implementation
{
    Br::Br()
    {
        m_node = winrt::NativeScript::Mason::Mason::Instance().CreateLineBreakNode();
    }

    Size Br::MeasureOverride(Size const&)
    {
        return Size{ 0.0f, 0.0f };
    }

    Size Br::ArrangeOverride(Size const& finalSize)
    {
        return finalSize;
    }
}
