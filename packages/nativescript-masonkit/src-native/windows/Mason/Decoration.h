#pragma once

// Shared "decoration" composition layer: one ContainerVisual ("mason-deco") in the element's single
// child-visual slot, holding a tagged child layer per feature ("mason-shadow", "mason-border") so
// border and box-shadow can coexist.

#include <vector>
#include <winrt/Microsoft.UI.Xaml.h>
#include <winrt/Microsoft.UI.Xaml.Hosting.h>
#include <winrt/Microsoft.UI.Composition.h>

namespace mason_deco
{
    namespace mux = winrt::Microsoft::UI::Xaml;
    namespace mucomp = winrt::Microsoft::UI::Composition;
    namespace hosting = winrt::Microsoft::UI::Xaml::Hosting;

    inline mucomp::Compositor CompositorFor(mux::UIElement const& element)
    {
        auto visual = hosting::ElementCompositionPreview::GetElementVisual(element);
        return visual ? visual.Compositor() : nullptr;
    }

    // Return the element's decoration root ContainerVisual, creating + installing it if absent.
    inline mucomp::ContainerVisual EnsureRoot(mux::UIElement const& element)
    {
        if (!element) return nullptr;
        auto existing = hosting::ElementCompositionPreview::GetElementChildVisual(element);
        if (existing)
        {
            if (auto cv = existing.try_as<mucomp::ContainerVisual>())
            {
                if (cv.Comment() == L"mason-deco") return cv;
            }
        }
        auto comp = CompositorFor(element);
        if (!comp) return nullptr;
        auto root = comp.CreateContainerVisual();
        root.Comment(L"mason-deco");
        hosting::ElementCompositionPreview::SetElementChildVisual(element, root);
        return root;
    }

    // Get the existing decoration root without creating one.
    inline mucomp::ContainerVisual ExistingRoot(mux::UIElement const& element)
    {
        if (!element) return nullptr;
        auto existing = hosting::ElementCompositionPreview::GetElementChildVisual(element);
        if (existing)
        {
            if (auto cv = existing.try_as<mucomp::ContainerVisual>())
            {
                if (cv.Comment() == L"mason-deco") return cv;
            }
        }
        return nullptr;
    }

    // Replace (or, when layer == nullptr, remove) the tagged layer inside the decoration root.
    inline void SetLayer(mux::UIElement const& element, winrt::hstring const& tag, mucomp::Visual const& layer)
    {
        mucomp::ContainerVisual root{ nullptr };
        if (layer)
        {
            root = EnsureRoot(element);
        }
        else
        {
            root = ExistingRoot(element);
            if (!root) return; // nothing to remove
        }
        if (!root) return;

        auto kids = root.Children();
        std::vector<mucomp::Visual> stale;
        for (auto&& child : kids)
        {
            if (child.Comment() == tag) stale.push_back(child);
        }
        for (auto&& c : stale) kids.Remove(c);

        if (layer)
        {
            layer.Comment(tag);
            kids.InsertAtTop(layer);
        }
    }
}
