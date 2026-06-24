#pragma once

#include <cstring>
#include <winrt/Microsoft.UI.Xaml.h>
#include <winrt/Microsoft.UI.Xaml.Controls.h>
#include <winrt/Microsoft.UI.Xaml.Media.h>
#include <winrt/Microsoft.UI.Xaml.Hosting.h>
#include <winrt/Microsoft.UI.Composition.h>
#include <winrt/Windows.UI.h>
#include <winrt/Windows.Storage.Streams.h>
#include <winrt/NativeScript.Mason.h>
#include "BufferUtil.h"

namespace mason_visual
{
    namespace nsm = winrt::NativeScript::Mason;
    namespace mux = winrt::Microsoft::UI::Xaml;
    namespace muxc = winrt::Microsoft::UI::Xaml::Controls;
    namespace muxm = winrt::Microsoft::UI::Xaml::Media;

   
    enum : uint32_t
    {
        OVERFLOW_X = 5,                         // i8 (0=visible,1=hidden,2=scroll,3=clip,4=auto)
        OVERFLOW_Y = 6,                         // i8
        FONT_COLOR = 324,                       // u32 ARGB
        FONT_SIZE = 329,                        // i32 px
        BACKGROUND_COLOR = 348,                 // u32 ARGB
        BORDER_RADIUS_TOP_LEFT_X_VALUE = 226,   // f32
    };

    inline bool SubtreeOverflows(nsm::Layout const& lay, float offX, float offY, float w, float h, bool vx, bool vy)
    {
        auto kids = lay.Children();
        const uint32_t n = kids.Size();
        for (uint32_t i = 0; i < n; ++i)
        {
            auto cl = kids.GetAt(i);
            const float cx = offX + cl.X();
            const float cy = offY + cl.Y();
            if (vx && (cx < -0.5f || cx + cl.Width() > w + 0.5f)) return true;
            if (vy && (cy < -0.5f || cy + cl.Height() > h + 0.5f)) return true;
            if (cl.HasChildren() && SubtreeOverflows(cl, cx, cy, w, h, vx, vy)) return true;
        }
        return false;
    }

    inline winrt::Windows::UI::Color ColorFromArgb(uint32_t argb)
    {
        return winrt::Windows::UI::Color{
            static_cast<uint8_t>((argb >> 24) & 0xFF),
            static_cast<uint8_t>((argb >> 16) & 0xFF),
            static_cast<uint8_t>((argb >> 8) & 0xFF),
            static_cast<uint8_t>(argb & 0xFF) };
    }

    inline void Apply(mux::UIElement const& element, nsm::Node const& node, float width, float height)
    {
        if (!element || !node) return;
        auto style = node.Style();
        if (!style) return;
        auto buf = style.Values();
        if (!buf) return;
        auto access = buf.try_as<mason_buf::IBufferByteAccess>();
        uint8_t* data = nullptr;
        if (!access || FAILED(access->Buffer(&data)) || data == nullptr) return;
        const uint32_t size = buf.Length();

        auto readU32 = [&](uint32_t off) -> uint32_t {
            uint32_t v = 0;
            if (off + 4 <= size) std::memcpy(&v, data + off, 4);
            return v;
        };
        auto readF32 = [&](uint32_t off) -> float {
            float v = 0.0f;
            if (off + 4 <= size) std::memcpy(&v, data + off, 4);
            return v;
        };

        bool hasBackground = false;
        if (auto panel = element.try_as<muxc::Panel>())
        {
            uint32_t bg = readU32(BACKGROUND_COLOR);
            if (bg != 0)
            {
                panel.Background(muxm::SolidColorBrush(ColorFromArgb(bg)));
            }
            hasBackground = panel.Background() != nullptr;
        }

        auto readI8 = [&](uint32_t off) -> int8_t {
            return (off < size) ? static_cast<int8_t>(data[off]) : 0;
        };

        
        float r = readF32(BORDER_RADIUS_TOP_LEFT_X_VALUE);


        const int8_t ovX = readI8(OVERFLOW_X);
        const int8_t ovY = readI8(OVERFLOW_Y);
        const bool visibleX = (ovX == 0);
        const bool visibleY = (ovY == 0);
        bool childOverflows = false;
        if ((visibleX || visibleY) && r > 0.0f && width > 0.0f && height > 0.0f && hasBackground)
        {
            if (auto layout = node.GetLayout())
            {
                childOverflows = SubtreeOverflows(layout, 0.0f, 0.0f, width, height, visibleX, visibleY);
            }
        }

        auto visual = mux::Hosting::ElementCompositionPreview::GetElementVisual(element);
        if (visual)
        {
            if (r > 0.0f && width > 0.0f && height > 0.0f && hasBackground && !childOverflows)
            {
                const float maxR = (width < height ? width : height) * 0.5f;
                if (r > maxR) r = maxR;
                auto comp = visual.Compositor();
                auto geo = comp.CreateRoundedRectangleGeometry();
                geo.Size({ width, height });
                geo.CornerRadius({ r, r });
                visual.Clip(comp.CreateGeometricClip(geo));
            }
            else
            {
                visual.Clip(nullptr);
            }
        }
    }
}
