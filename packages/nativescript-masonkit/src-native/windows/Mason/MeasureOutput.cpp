#include "pch.h"
#include "MeasureOutput.h"
#include "MeasureOutput.g.cpp"
#include <cstring>

namespace winrt::NativeScript::Mason::implementation
{
    int64_t MeasureOutput::Make(float width, float height)
    {
        uint32_t wb, hb;
        std::memcpy(&wb, &width, sizeof(uint32_t));
        std::memcpy(&hb, &height, sizeof(uint32_t));
        uint64_t packed = (static_cast<uint64_t>(wb) << 32) | static_cast<uint64_t>(hb);
        return static_cast<int64_t>(packed);
    }

    float MeasureOutput::GetWidth(int64_t measureOutput)
    {
        uint32_t wb = static_cast<uint32_t>((static_cast<uint64_t>(measureOutput) >> 32) & 0xFFFFFFFFu);
        float w;
        std::memcpy(&w, &wb, sizeof(float));
        return w;
    }

    float MeasureOutput::GetHeight(int64_t measureOutput)
    {
        uint32_t hb = static_cast<uint32_t>(static_cast<uint64_t>(measureOutput) & 0xFFFFFFFFu);
        float h;
        std::memcpy(&h, &hb, sizeof(float));
        return h;
    }
}
