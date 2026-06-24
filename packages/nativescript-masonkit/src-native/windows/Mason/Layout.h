#pragma once
#include "Layout.g.h"
#include <memory>
#include <vector>

namespace winrt::NativeScript::Mason::implementation
{
    // Flat, immutable layout tree shared by every Layout view produced from one compute pass.
    // Parsed once from the engine's float buffer (see Parse) in the exact DFS pre-order / field
    // order emitted by mason_node_layout. Geometry is stored in DirectXMath SIMD vectors, mirroring
    // the iOS MasonLayoutTree (SIMD4<Float> frames/borders/margins/paddings, SIMD2<Float>
    // content/scrollbar) so emptiness checks vectorize.
    struct LayoutTree
    {
        std::vector<int32_t> order;
        std::vector<DirectX::XMFLOAT4> frames;     // x, y, width, height
        std::vector<DirectX::XMFLOAT4> borders;    // top, right, bottom, left
        std::vector<DirectX::XMFLOAT4> margins;    // top, right, bottom, left
        std::vector<DirectX::XMFLOAT4> paddings;   // top, right, bottom, left
        std::vector<DirectX::XMFLOAT2> content;    // width, height
        std::vector<DirectX::XMFLOAT2> scrollbar;  // width, height
        std::vector<uint32_t> childStart;
        std::vector<uint32_t> childCount;
        std::vector<uint32_t> childIndices;

        void Parse(const float* data, size_t count);
        uint32_t NodeCount() const { return static_cast<uint32_t>(frames.size()); }
    };

    struct Layout : LayoutT<Layout>
    {
        Layout(std::shared_ptr<LayoutTree> const& tree, uint32_t index) : m_tree(tree), m_index(index) {}

        // Parse a layout float buffer and return a Layout view onto its root (index 0). An empty
        // buffer yields a zeroed single-node tree.
        static winrt::NativeScript::Mason::Layout FromFloats(const float* data, size_t count);

        float X() const { return m_tree->frames[m_index].x; }
        float Y() const { return m_tree->frames[m_index].y; }
        float Width() const { return m_tree->frames[m_index].z; }
        float Height() const { return m_tree->frames[m_index].w; }

        float BorderTop() const { return m_tree->borders[m_index].x; }
        float BorderRight() const { return m_tree->borders[m_index].y; }
        float BorderBottom() const { return m_tree->borders[m_index].z; }
        float BorderLeft() const { return m_tree->borders[m_index].w; }

        float MarginTop() const { return m_tree->margins[m_index].x; }
        float MarginRight() const { return m_tree->margins[m_index].y; }
        float MarginBottom() const { return m_tree->margins[m_index].z; }
        float MarginLeft() const { return m_tree->margins[m_index].w; }

        float PaddingTop() const { return m_tree->paddings[m_index].x; }
        float PaddingRight() const { return m_tree->paddings[m_index].y; }
        float PaddingBottom() const { return m_tree->paddings[m_index].z; }
        float PaddingLeft() const { return m_tree->paddings[m_index].w; }

        float ContentWidth() const { return m_tree->content[m_index].x; }
        float ContentHeight() const { return m_tree->content[m_index].y; }

        float ScrollbarWidth() const { return m_tree->scrollbar[m_index].x; }
        float ScrollbarHeight() const { return m_tree->scrollbar[m_index].y; }

        int32_t Order() const { return m_tree->order[m_index]; }

        bool SizeIsEmpty() const
        {
            // width (z) == 0 && height (w) == 0
            auto f = DirectX::XMLoadFloat4(&m_tree->frames[m_index]);
            auto zw = DirectX::XMVectorSwizzle<2, 3, 2, 3>(f);
            return DirectX::XMVector4Equal(zw, DirectX::XMVectorZero());
        }
        bool BorderIsEmpty() const { return AllZero(m_tree->borders[m_index]); }
        bool MarginIsEmpty() const { return AllZero(m_tree->margins[m_index]); }
        bool PaddingIsEmpty() const { return AllZero(m_tree->paddings[m_index]); }

        bool HasChildren() const { return m_tree->childCount[m_index] > 0; }
        winrt::Windows::Foundation::Collections::IVectorView<winrt::NativeScript::Mason::Layout> Children();

    private:
        static bool AllZero(DirectX::XMFLOAT4 const& v)
        {
            return DirectX::XMVector4Equal(DirectX::XMLoadFloat4(&v), DirectX::XMVectorZero());
        }

        std::shared_ptr<LayoutTree> m_tree;
        uint32_t m_index;
    };
}
