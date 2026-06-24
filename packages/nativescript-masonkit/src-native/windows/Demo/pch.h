#pragma once
#include <unknwn.h>
#include <winrt/Windows.Foundation.h>
#include <winrt/Windows.Foundation.Collections.h>
#include <array>
#include <memory>
#include <mutex>
#include <string>
#include <vector>

// mason-c C ABI. Resolved via the ..\Mason include dir (see Demo.vcxproj). The Demo links the same
// masonnative.lib as the component because it compiles the component sources directly.
#include "include/mason_native.h"
