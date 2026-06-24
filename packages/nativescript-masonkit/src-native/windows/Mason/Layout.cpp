#include "pch.h"
#include "Layout.h"
#include "Layout.g.cpp"

using namespace winrt;
using namespace winrt::Windows::Foundation::Collections;

namespace winrt::NativeScript::Mason::implementation
{
    void LayoutTree::Parse(const float* data, size_t count)
    {
        order.clear();
        frames.clear();
        borders.clear();
        margins.clear();
        paddings.clear();
        content.clear();
        scrollbar.clear();
        childStart.clear();
        childCount.clear();
        childIndices.clear();

        if (data == nullptr || count == 0)
        {
            return;
        }

        // DFS stack of (nodeIndex, remainingChildren). The engine emits nodes in pre-order; each
        // record is 22 floats (see the iOS MasonLayoutTree.fromFloatPointer).
        std::vector<std::pair<uint32_t, uint32_t>> stack;

        size_t i = 0;
        while (i < count)
        {
            int32_t nodeOrder = static_cast<int32_t>(data[i]); i += 1;
            float x = data[i]; i += 1;
            float y = data[i]; i += 1;
            float w = data[i]; i += 1;
            float h = data[i]; i += 1;
            frames.push_back(DirectX::XMFLOAT4(x, y, w, h));

            borders.push_back(DirectX::XMFLOAT4(data[i], data[i + 1], data[i + 2], data[i + 3])); i += 4;
            margins.push_back(DirectX::XMFLOAT4(data[i], data[i + 1], data[i + 2], data[i + 3])); i += 4;
            paddings.push_back(DirectX::XMFLOAT4(data[i], data[i + 1], data[i + 2], data[i + 3])); i += 4;

            content.push_back(DirectX::XMFLOAT2(data[i], data[i + 1])); i += 2;
            scrollbar.push_back(DirectX::XMFLOAT2(data[i], data[i + 1])); i += 2;

            uint32_t childrenCount = static_cast<uint32_t>(data[i]); i += 1;
            uint32_t nodeIndex = static_cast<uint32_t>(order.size());

            order.push_back(nodeOrder);
            childStart.push_back(static_cast<uint32_t>(childIndices.size()));
            childCount.push_back(childrenCount);

            // Reserve child slots, filled as children are encountered.
            for (uint32_t c = 0; c < childrenCount; ++c)
            {
                childIndices.push_back(0);
            }

            // Register this node as the next child of the parent on the stack.
            if (!stack.empty())
            {
                uint32_t parentIndex = stack.back().first;
                uint32_t parentStart = childStart[parentIndex];
                uint32_t parentTotal = childCount[parentIndex];
                uint32_t parentRemaining = stack.back().second;
                uint32_t slot = parentStart + (parentTotal - parentRemaining);
                childIndices[slot] = nodeIndex;

                stack.back().second -= 1;
                while (!stack.empty() && stack.back().second == 0)
                {
                    stack.pop_back();
                }
            }

            if (childrenCount > 0)
            {
                stack.push_back({ nodeIndex, childrenCount });
            }
        }
    }

    winrt::NativeScript::Mason::Layout Layout::FromFloats(const float* data, size_t count)
    {
        auto tree = std::make_shared<LayoutTree>();
        tree->Parse(data, count);

        if (tree->NodeCount() == 0)
        {
            // Zeroed single-node fallback so a Layout is always usable.
            tree->order.push_back(0);
            tree->frames.push_back({ 0, 0, 0, 0 });
            tree->borders.push_back({ 0, 0, 0, 0 });
            tree->margins.push_back({ 0, 0, 0, 0 });
            tree->paddings.push_back({ 0, 0, 0, 0 });
            tree->content.push_back({ 0, 0 });
            tree->scrollbar.push_back({ 0, 0 });
            tree->childStart.push_back(0);
            tree->childCount.push_back(0);
        }

        return winrt::make<Layout>(tree, 0u);
    }

    IVectorView<winrt::NativeScript::Mason::Layout> Layout::Children()
    {
        auto vec = single_threaded_vector<winrt::NativeScript::Mason::Layout>();
        uint32_t start = m_tree->childStart[m_index];
        uint32_t count = m_tree->childCount[m_index];
        for (uint32_t k = 0; k < count; ++k)
        {
            uint32_t childIdx = m_tree->childIndices[start + k];
            vec.Append(winrt::make<Layout>(m_tree, childIdx));
        }
        return vec.GetView();
    }
}
