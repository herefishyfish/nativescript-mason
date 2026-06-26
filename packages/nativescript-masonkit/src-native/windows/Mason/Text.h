#pragma once
#include "Text.g.h"
#include <vector>

namespace winrt::NativeScript::Mason::implementation
{
    
    struct Text : TextT<Text>
    {
        Text();

        winrt::NativeScript::Mason::Node Node() const { return m_node; }
        winrt::NativeScript::Mason::Style Style() const { return m_node.Style(); }

        void SyncStyle(winrt::hstring const&, winrt::hstring const&);

        hstring Content() const;
        void Content(hstring const& value);
        double FontSize() const;
        void FontSize(double value);
        void SetFontFamily(hstring const& families);

        void SetRun(winrt::NativeScript::Mason::TextNode const& run, int32_t index);
        void RemoveRun(winrt::NativeScript::Mason::TextNode const& run);
        void ClearRuns();

        void OnRunChanged();

        winrt::Windows::Foundation::Size MeasureOverride(winrt::Windows::Foundation::Size const& available);
        winrt::Windows::Foundation::Size ArrangeOverride(winrt::Windows::Foundation::Size const& finalSize);

    private:
        void ApplyStyleFromBuffer();
        void RebuildInlines();
        void InvalidateLayoutRootFromHere();

        winrt::NativeScript::Mason::Mason m_engine{ nullptr };
        winrt::NativeScript::Mason::Node m_node{ nullptr };
        winrt::Microsoft::UI::Xaml::Controls::TextBlock m_text{ nullptr };
        winrt::NativeScript::Mason::TextNode m_contentNode{ nullptr };
        std::vector<winrt::NativeScript::Mason::TextNode> m_runs;
        
        double m_fontSize{ 0.0 };
        uint32_t m_color{ 0xFF000000 };
        bool m_hasColor{ false };
        int32_t m_fontWeight{ 0 };
        double m_lineHeightMultiplier{ 0.0 };
        double m_letterSpacingPx{ 0.0 };
        winrt::hstring m_fontFamily{};
    };
}

namespace winrt::NativeScript::Mason::factory_implementation
{
    struct Text : TextT<Text, implementation::Text>
    {
    };
}
