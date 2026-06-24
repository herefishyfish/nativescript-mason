#pragma once
// Shared container logic for Mason panels (View, Li). A container mirrors its Mason node's children
// to its visible XAML children — any child implementing IMasonElement contributes its own node;
// any other UIElement is wrapped as a generic Mason leaf measured off its XAML DesiredSize.
//
// Layout is computed ONCE on the topmost Mason view (the "layout root", i.e. a panel with no
// IMasonElement ancestor) — matching the iOS/Android model. Nested panels mirror their node into the
// tree (SyncChildren) and READ their already-computed layout in Arrange; they do NOT run their own
// ComputeSize. Computing each panel independently made every flex container a fresh layout root that
// self-sized to its content (so a block-level flex with fixed-width children shrink-wrapped instead
// of filling the parent's width); the single-root compute gives the parent's block context a chance
// to stretch nested flex containers to full width, exactly as CSS / iOS / Android do.
// Header-only so the thin panel classes can share it without an extra translation unit.
#include <cmath>
#include <unordered_map>
#include <vector>
#include <winrt/NativeScript.Mason.h>
#include <winrt/Microsoft.UI.Xaml.h>
#include <winrt/Microsoft.UI.Xaml.Controls.h>
#include "LeafCommon.h"

namespace mason_panel
{
    namespace nsm = winrt::NativeScript::Mason;
    namespace mux = winrt::Microsoft::UI::Xaml;
    namespace muxc = winrt::Microsoft::UI::Xaml::Controls;

    inline void* IdOf(mux::UIElement const& e)
    {
        auto unk = e.as<winrt::Windows::Foundation::IUnknown>();
        return winrt::get_abi(unk);
    }

    // A panel is the LAYOUT ROOT iff no ancestor in the framework tree is itself a Mason element. The
    // root owns the single holistic Taffy compute; nested panels only mirror + read. (FrameworkElement.
    // Parent is the logical parent, set as soon as an element joins a Panel's Children — reliable
    // before realization.)
    inline bool HasMasonAncestor(mux::UIElement const& element)
    {
        auto fe = element.try_as<mux::FrameworkElement>();
        if (!fe) return false;
        auto parent = fe.Parent();
        while (parent)
        {
            if (parent.try_as<nsm::IMasonElement>()) return true;
            auto pfe = parent.try_as<mux::FrameworkElement>();
            if (!pfe) break;
            parent = pfe.Parent();
        }
        return false;
    }

    // Layout is computed once on the topmost Mason view. A nested element's own InvalidateMeasure
    // therefore does NOT make the root recompute, so a nested change (added child, text data, or a
    // STYLE change like width/height/background on a reactively-added box) silently keeps its old
    // (often 0x0 / unstyled) layout. This walks to the topmost Mason element, marks its node dirty +
    // invalidates it, forcing a from-scratch whole-tree recompute that picks up the nested change.
    inline void InvalidateLayoutRoot(mux::UIElement const& element)
    {
        mux::FrameworkElement root{ nullptr };
        auto cur = element.try_as<mux::FrameworkElement>();
        while (cur)
        {
            if (cur.try_as<nsm::IMasonElement>()) root = cur;
            auto parent = cur.Parent();
            cur = parent ? parent.try_as<mux::FrameworkElement>() : nullptr;
        }
        if (!root) return;
        if (auto el = root.try_as<nsm::IMasonElement>())
        {
            if (auto node = el.Node()) node.MarkDirty();
        }
        root.InvalidateMeasure();
        root.InvalidateArrange();
    }

    inline std::vector<mux::UIElement> SyncChildren(
        nsm::Mason const& engine, nsm::Node const& node,
        muxc::UIElementCollection const& children, std::unordered_map<void*, nsm::Node>& leaves)
    {
        std::vector<mux::UIElement> visible;
        std::vector<nsm::Node> nodes;
        std::unordered_map<void*, nsm::Node> next;

        for (auto const& child : children)
        {
            if (child.Visibility() == mux::Visibility::Collapsed) continue;
            visible.push_back(child);

            if (auto el = child.try_as<nsm::IMasonElement>())
            {
                nodes.push_back(el.Node());
                continue;
            }

            void* id = IdOf(child);
            auto it = leaves.find(id);
            nsm::Node leaf{ nullptr };
            if (it != leaves.end())
            {
                leaf = it->second;
                leaves.erase(it);
            }
            else
            {
                leaf = engine.CreateNode(false);
                auto weak = winrt::make_weak(child);
                nsm::MeasureFunc cb = [weak](float kw, float kh, float aw, float ah) -> int64_t
                {
                    auto c = weak.get();
                    if (!c) return mason_leaf::PackMeasure(0.0f, 0.0f);
                    float w = std::isnan(kw) ? aw : kw;
                    float h = std::isnan(kh) ? ah : kh;
                    c.Measure(winrt::Windows::Foundation::Size{ w, h });
                    auto d = c.DesiredSize();
                    return mason_leaf::PackMeasure(d.Width, d.Height);
                };
                leaf.SetMeasure(cb);
            }
            next.emplace(id, leaf);
            nodes.push_back(leaf);
        }

        for (auto& kv : leaves)
        {
            if (kv.second) kv.second.Destroy();
        }
        leaves = std::move(next);
        node.SetChildren(nodes);
        return visible;
    }

    inline winrt::Windows::Foundation::Size Measure(
        nsm::Mason const& engine, nsm::Node const& node, mux::UIElement const& self,
        muxc::UIElementCollection const& children, std::unordered_map<void*, nsm::Node>& leaves,
        winrt::Windows::Foundation::Size const& available)
    {
        // Always mirror this level's children into the Mason node tree (cheap, idempotent). XAML
        // measures top-down, so by the time the root runs ComputeSize below, every descendant panel's
        // MeasureOverride has already run this same SyncChildren and the whole tree is current.
        auto visible = SyncChildren(engine, node, children, leaves);
        for (auto const& c : visible) c.Measure(available);

        // Only the topmost Mason view computes — one holistic compute for the entire subtree. Nested
        // panels skip ComputeSize and read their layout (set by the root's compute) in Arrange.
        const bool isRoot = !HasMasonAncestor(self);
        if (isRoot)
        {
            const bool wf = std::isfinite(available.Width);
            const bool hf = std::isfinite(available.Height);
            node.ComputeSize(
                wf ? nsm::AvailableSpaceType::Definite : nsm::AvailableSpaceType::MaxContent, available.Width,
                hf ? nsm::AvailableSpaceType::Definite : nsm::AvailableSpaceType::MaxContent, available.Height);
        }

        auto layout = node.GetLayout();
        return { layout.Width(), layout.Height() };
    }

    inline winrt::Windows::Foundation::Size Arrange(
        nsm::Node const& node, muxc::UIElementCollection const& children,
        winrt::Windows::Foundation::Size const& finalSize)
    {
        // Do NOT recompute here. ComputeSize re-invokes the leaf measure callbacks, which call
        // UIElement.Measure() on the children — calling Measure() during the Arrange pass makes XAML
        // flag a layout invalidation, which re-runs Measure -> Arrange -> ComputeSize -> Measure...
        // forever (LayoutCycleException). MeasureOverride already ran ComputeSize this pass (XAML
        // always measures before it arranges), so the node's layout is cached; just read it.
        auto layout = node.GetLayout();
        auto childLayouts = layout.Children();
        uint32_t count = childLayouts.Size();

        uint32_t i = 0;
        for (auto const& child : children)
        {
            if (child.Visibility() == mux::Visibility::Collapsed) continue;
            if (i >= count) break;
            auto cl = childLayouts.GetAt(i);
            child.Arrange(winrt::Windows::Foundation::Rect{ cl.X(), cl.Y(), cl.Width(), cl.Height() });
            ++i;
        }
        return finalSize;
    }
}
