#pragma once
#include <cstdint>
#include <cstring>

// Shared helpers for the leaf element controls (Text/Image/Button). A leaf is a
// Microsoft.UI.Xaml.Controls.Panel that hosts a single content control (Children[0]) and owns a
// typed Mason leaf node; the node's measure callback measures the hosted content, and the leaf's
// Measure/ArrangeOverride size/position that content.
namespace mason_leaf
{
    // Pack a measured size as the engine expects from a measure callback (see
    // mason_core::MeasureOutput): (widthBits << 32) | heightBits.
    inline int64_t PackMeasure(float w, float h)
    {
        uint32_t wb, hb;
        std::memcpy(&wb, &w, sizeof(uint32_t));
        std::memcpy(&hb, &h, sizeof(uint32_t));
        return static_cast<int64_t>((static_cast<uint64_t>(wb) << 32) | static_cast<uint64_t>(hb));
    }
}
