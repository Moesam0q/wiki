# Your First Hook
Now that you have your mod working, you probably want it to do something instead of crashing the game. To do this, you'll need to add some dependency libraries.

First, we will be using `libhat`. This is an essential library for native modding, for reasons we'll get into shortly.

In order to modify the game's behavior, you'll need to use a hooking library. There are several hooking libraries to choose from, but we will be using `MinHook`, as it has a simpler API and is more beginner-friendly.

## CPM
[CPM](https://github.com/cpm-cmake/CPM.cmake) is a CMake library that makes it easier to add other libraries.

To use it, download `CPM.cmake` from the [latest release](https://github.com/cpm-cmake/CPM.cmake/releases) and save it at `cmake/CPM.cmake` in your project's directory.

Now, in your `CMakeLists.txt`, below the `CMAKE_MSVC_RUNTIME_LIBRARY` line, add the following:

```cmake
include(cmake/CPM.cmake)
```

You now have CPM added to your project.

## Adding the Libraries

Below the CPM line, add the following:

```cmake
CPMAddPackage("gh:BasedInc/libhat@0.9.0")
CPMAddPackage("gh:TsudaKageyu/minhook@1.3.4")
```

This will make CPM automatically download the libraries. To use them in your mod, you must link against them. Add the following at the bottom of your `CMakeLists.txt`:

```cmake
target_link_libraries(<project_name_here> PRIVATE 
        libhat::libhat 
        minhook)
```

## Adding your first Hook

We will be using `libhat` to scan for one of Minecraft's functions. Specifically, we will scan for `Dimension::getTimeOfDay`. As of 1.21.120, the signature for `getTimeOfDay` is `44 8B C2 B8 F1 19 76 05 F7 EA`.

```cpp
#include <libhat/scanner.hpp>
#include <libhat/signature.hpp>

static DWORD WINAPI startup(LPVOID dll) {
    constexpr auto signature = hat::compile_signature<"44 8B C2 B8 F1 19 76 05 F7 EA">();

    hat::scan_result scanResult = hat::find_pattern(signature, ".text");
    std::byte* getTimeOfDay = scanResult.get();
}
```

Now, we will use `MinHook` to hook `getTimeOfDay` and return a different value.

```cpp
#include <MinHook.h>

// MinHook will redirect Dimension::getTimeOfDay to this function, replacing its behavior with our own code.
static float hk_getTimeOfDay(void* _this, int32_t time, float alpha) {
    static float value = 0.f;
    value += 0.00001f;
    value = std::fmodf(value, 1.f);

    return value;
}
```

To make `hk_getTimeDay` replace the behavior of `Dimension::getTimeOfDay`, we will pass it to minhook:

```cpp
static DWORD WINAPI startup(LPVOID dll) {
    constexpr auto signature = hat::compile_signature<"44 8B C2 B8 F1 19 76 05 F7 EA">();

    hat::scan_result scanResult = hat::find_pattern(signature, ".text");
    std::byte* getTimeOfDay = scanResult.get();

    // Initialize MinHook.
    MH_Initialize();

    // Hook getTimeOfDay.
    LPVOID original;
    MH_CreateHook(getTimeOfDay, &hk_getTimeOfDay, &original);
    MH_EnableHook(getTimeOfDay);

    // Exiting this thread without calling FreeLibraryAndExitThread on `dll` will cause the DLL to remain injected forever.
    return 0;
}
```

Now build your mod again, and inject the DLL. If you see the sun and moon spinning around you, it worked!

You can try changing the constant in `hk_getTimeOfDay` to make the time go faster or slower.

::: tip
You can't build your mod while the DLL is injected. Since this mod has no ejecting logic, simply close the game before building your mod again.
:::