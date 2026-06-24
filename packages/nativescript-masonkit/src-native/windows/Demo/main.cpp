#include "pch.h"
#include <cmath>
#include <iostream>

// Standalone native test harness for the NativeScript.Mason C++/WinRT component. The component is
// headless, so this console app exercises the layout engine directly through the projected
// runtime classes (paralleling src-native/ios and the Android instrumented demo). It builds the
// component sources in-project and constructs the implementation type directly, so it needs no COM
// activation-factory registration. Visual layout on the NativeScript Windows runtime is validated
// separately through apps/demo.

#include "Mason.h"
#include "Node.h"
#include "Style.h"
#include "Layout.h"
#include "MeasureOutput.h"

using namespace winrt;
namespace nsm = winrt::NativeScript::Mason;
namespace mimpl = winrt::NativeScript::Mason::implementation;

namespace
{
    int g_failures = 0;

    void Check(bool cond, const char* msg)
    {
        std::cout << (cond ? "[PASS] " : "[FAIL] ") << msg << "\n";
        if (!cond) g_failures++;
    }

    bool Near(float a, float b, float eps = 0.5f)
    {
        return std::fabs(a - b) <= eps;
    }

    // A full computed style with CSS/Taffy-correct defaults. The demo tweaks a few fields and
    // forwards everything to Style.SetWithValues in one call. Encodings (per mason-core):
    //   inset/margin: 0 auto, 1 points, 2 percent     padding/border/gap: 0 points, 1 percent
    //   width/height/min/max/flex-basis: 0 auto, 1 points, 2 percent
    struct StyleVals
    {
        int32_t display = 1;          // flex
        int32_t position = 0;         // relative
        int32_t direction = 0;        // inherit
        int32_t flexDirection = 0;    // row
        int32_t flexWrap = 0;         // nowrap
        int32_t overflow = 0;         // visible
        int32_t alignItems = -1;      // normal
        int32_t alignSelf = -1;
        int32_t alignContent = -1;
        int32_t justifyItems = -1;
        int32_t justifySelf = -1;
        int32_t justifyContent = -1;
        int32_t insetLeftT = 0;  float insetLeftV = 0;   // auto
        int32_t insetRightT = 0; float insetRightV = 0;
        int32_t insetTopT = 0;   float insetTopV = 0;
        int32_t insetBottomT = 0;float insetBottomV = 0;
        int32_t marginLeftT = 1;  float marginLeftV = 0;  // 0px
        int32_t marginRightT = 1; float marginRightV = 0;
        int32_t marginTopT = 1;   float marginTopV = 0;
        int32_t marginBottomT = 1;float marginBottomV = 0;
        int32_t paddingLeftT = 0;  float paddingLeftV = 0;  // 0px
        int32_t paddingRightT = 0; float paddingRightV = 0;
        int32_t paddingTopT = 0;   float paddingTopV = 0;
        int32_t paddingBottomT = 0;float paddingBottomV = 0;
        int32_t borderLeftT = 0;  float borderLeftV = 0;   // 0px
        int32_t borderRightT = 0; float borderRightV = 0;
        int32_t borderTopT = 0;   float borderTopV = 0;
        int32_t borderBottomT = 0;float borderBottomV = 0;
        float flexGrow = 0;
        float flexShrink = 1;
        int32_t flexBasisT = 0;  float flexBasisV = 0;     // auto
        int32_t widthT = 0;  float widthV = 0;             // auto
        int32_t heightT = 0; float heightV = 0;            // auto
        int32_t minWidthT = 0;  float minWidthV = 0;       // auto
        int32_t minHeightT = 0; float minHeightV = 0;
        int32_t maxWidthT = 0;  float maxWidthV = 0;
        int32_t maxHeightT = 0; float maxHeightV = 0;
        int32_t gapRowT = 0;    float gapRowV = 0;         // 0px
        int32_t gapColumnT = 0; float gapColumnV = 0;
        float aspectRatio = 0;                              // none
        int32_t gridAutoFlow = 0;
        int32_t overflowX = 0;
        int32_t overflowY = 0;
        float scrollbarWidth = 0;
        int32_t textAlign = 0;
        int32_t boxSizing = 0;                              // border-box
    };

    void Apply(nsm::Style const& s, StyleVals const& v)
    {
        s.SetWithValues(
            v.display, v.position, v.direction, v.flexDirection, v.flexWrap, v.overflow,
            v.alignItems, v.alignSelf, v.alignContent, v.justifyItems, v.justifySelf, v.justifyContent,
            v.insetLeftT, v.insetLeftV, v.insetRightT, v.insetRightV, v.insetTopT, v.insetTopV, v.insetBottomT, v.insetBottomV,
            v.marginLeftT, v.marginLeftV, v.marginRightT, v.marginRightV, v.marginTopT, v.marginTopV, v.marginBottomT, v.marginBottomV,
            v.paddingLeftT, v.paddingLeftV, v.paddingRightT, v.paddingRightV, v.paddingTopT, v.paddingTopV, v.paddingBottomT, v.paddingBottomV,
            v.borderLeftT, v.borderLeftV, v.borderRightT, v.borderRightV, v.borderTopT, v.borderTopV, v.borderBottomT, v.borderBottomV,
            v.flexGrow, v.flexShrink, v.flexBasisT, v.flexBasisV,
            v.widthT, v.widthV, v.heightT, v.heightV,
            v.minWidthT, v.minWidthV, v.minHeightT, v.minHeightV, v.maxWidthT, v.maxWidthV, v.maxHeightT, v.maxHeightV,
            v.gapRowT, v.gapRowV, v.gapColumnT, v.gapColumnV, v.aspectRatio,
            L"", L"", v.gridAutoFlow, L"", L"", L"", L"", L"", L"", L"", L"",
            v.overflowX, v.overflowY, v.scrollbarWidth, v.textAlign, v.boxSizing, L"", L"");
    }
}

int wmain()
{
    winrt::init_apartment();

    // 1. MeasureOutput pack/unpack round-trips (must match mason_core::MeasureOutput bit layout).
    {
        int64_t packed = mimpl::MeasureOutput::Make(200.0f, 20.0f);
        Check(Near(mimpl::MeasureOutput::GetWidth(packed), 200.0f) &&
              Near(mimpl::MeasureOutput::GetHeight(packed), 20.0f),
              "MeasureOutput.Make / GetWidth / GetHeight round-trip");
    }

    auto engine = winrt::make<mimpl::Mason>();
    engine.SetDeviceScale(1.0f);

    // 2. Row flex container 200x100 with two flex-grow:1 children -> each 100x100, side by side.
    {
        auto root = engine.CreateNode(false);
        StyleVals rootStyle;
        rootStyle.display = 1;        // flex
        rootStyle.flexDirection = 0;  // row
        rootStyle.widthT = 1; rootStyle.widthV = 200;
        rootStyle.heightT = 1; rootStyle.heightV = 100;
        Apply(root.Style(), rootStyle);

        auto a = engine.CreateNode(false);
        auto b = engine.CreateNode(false);
        StyleVals childStyle;
        childStyle.flexGrow = 1;
        Apply(a.Style(), childStyle);
        Apply(b.Style(), childStyle);

        root.AddChild(a);
        root.AddChild(b);

        auto layout = root.ComputeWHAndLayout(200.0f, 100.0f);
        Check(Near(layout.Width(), 200) && Near(layout.Height(), 100), "row: root is 200x100");
        Check(layout.Children().Size() == 2, "row: root has 2 children");

        auto c0 = layout.Children().GetAt(0);
        auto c1 = layout.Children().GetAt(1);
        Check(Near(c0.X(), 0) && Near(c0.Width(), 100) && Near(c0.Height(), 100), "row: child 0 = (0, 100x100)");
        Check(Near(c1.X(), 100) && Near(c1.Width(), 100) && Near(c1.Height(), 100), "row: child 1 = (100, 100x100)");

        // Style buffer should be a non-empty snapshot.
        Check(a.Style().GetStyleBuffer().Size() > 0, "row: style buffer is non-empty");

        // SIMD emptiness checks: a plain child has no border/margin/padding but a real size.
        Check(c0.BorderIsEmpty() && c0.MarginIsEmpty() && c0.PaddingIsEmpty() && !c0.SizeIsEmpty(),
              "row: SIMD *IsEmpty checks (border/margin/padding empty, size not)");
    }

    // 3. Column flex container 100x200, two fixed-height children, align-items: stretch -> full width.
    {
        auto root = engine.CreateNode(false);
        StyleVals rootStyle;
        rootStyle.display = 1;
        rootStyle.flexDirection = 1;  // column
        rootStyle.alignItems = 4;     // stretch
        rootStyle.widthT = 1; rootStyle.widthV = 100;
        rootStyle.heightT = 1; rootStyle.heightV = 200;
        Apply(root.Style(), rootStyle);

        auto a = engine.CreateNode(false);
        auto b = engine.CreateNode(false);
        StyleVals childStyle;
        childStyle.heightT = 1; childStyle.heightV = 50;
        Apply(a.Style(), childStyle);
        Apply(b.Style(), childStyle);
        root.SetChildren(std::array<nsm::Node, 2>{ a, b });

        auto layout = root.ComputeWHAndLayout(100.0f, 200.0f);
        auto c0 = layout.Children().GetAt(0);
        auto c1 = layout.Children().GetAt(1);
        Check(Near(c0.Y(), 0) && Near(c0.Height(), 50) && Near(c0.Width(), 100), "column: child 0 = (y0, 100x50)");
        Check(Near(c1.Y(), 50) && Near(c1.Height(), 50) && Near(c1.Width(), 100), "column: child 1 = (y50, 100x50)");
    }

    // 4. Custom measure callback drives a leaf's size.
    {
        auto root = engine.CreateNode(false);
        StyleVals rootStyle;
        rootStyle.display = 1;
        rootStyle.flexDirection = 1; // column
        Apply(root.Style(), rootStyle);

        auto leaf = engine.CreateNode(false);
        Apply(leaf.Style(), StyleVals{});
        leaf.SetMeasure([](float, float, float, float) -> int64_t {
            return mimpl::MeasureOutput::Make(123.0f, 45.0f);
        });
        root.AddChild(leaf);

        auto layout = root.ComputeAndLayout();
        auto c0 = layout.Children().GetAt(0);
        Check(Near(c0.Width(), 123) && Near(c0.Height(), 45), "measure: leaf measured to 123x45");
    }

    std::cout << "\n" << (g_failures ? "RESULT: FAILURES\n" : "RESULT: ALL PASS\n");
    return g_failures;
}
