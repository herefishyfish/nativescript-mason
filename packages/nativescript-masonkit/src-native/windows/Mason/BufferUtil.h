#pragma once
#include <winrt/Windows.Storage.Streams.h>
#include <cstdint>

// Wraps engine arena memory as a live, writable IBuffer so the @nativescript/windows runtime can
// project it to a JS ArrayBuffer (the shared style.ts writes StyleKeys offsets straight into it).
// Used by both Style (base style buffer) and Node (pseudo-class style buffers).
namespace mason_buf
{
    struct __declspec(uuid("905a0fef-bc53-11df-8c49-001e4fc686da")) IBufferByteAccess : ::IUnknown
    {
        virtual HRESULT __stdcall Buffer(uint8_t** value) = 0;
    };

    struct ArenaBuffer : winrt::implements<ArenaBuffer, winrt::Windows::Storage::Streams::IBuffer, IBufferByteAccess>
    {
        ArenaBuffer(uint8_t* data, uint32_t size) : m_data(data), m_size(size) {}
        uint32_t Capacity() const noexcept { return m_size; }
        uint32_t Length() const noexcept { return m_size; }
        void Length(uint32_t) noexcept {}
        HRESULT __stdcall Buffer(uint8_t** value) noexcept override { *value = m_data; return S_OK; }

        uint8_t* m_data{ nullptr };
        uint32_t m_size{ 0 };
    };

    inline winrt::Windows::Storage::Streams::IBuffer Wrap(uint8_t* data, uint32_t size)
    {
        if (data == nullptr || size == 0) return nullptr;
        return winrt::make<ArenaBuffer>(data, size);
    }
}
