#pragma once
#include "MeasureOutput.g.h"

namespace winrt::NativeScript::Mason::implementation
{
    // Packs/unpacks a measure result into the i64 the engine expects from a measure callback:
    // (widthBits << 32) | heightBits, where each half is the IEEE-754 bit pattern of an f32.
    // Mirrors mason_core::MeasureOutput exactly.
    struct MeasureOutput
    {
        MeasureOutput() = default;

        static int64_t Make(float width, float height);
        static float GetWidth(int64_t measureOutput);
        static float GetHeight(int64_t measureOutput);
    };
}

namespace winrt::NativeScript::Mason::factory_implementation
{
    struct MeasureOutput : MeasureOutputT<MeasureOutput, implementation::MeasureOutput>
    {
    };
}
