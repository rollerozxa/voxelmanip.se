---
title: See the C/C++ compiler version with preprocessor macros
last_modified: 2025-11-05
---

Sometimes it can be useful to know the version of the compiler a program was built with, for example to put in a debug menu or log output. This can be done using compiler-specific predefined macros in the preprocessor.

<!--more-->

This snippet detects the version of the most common compilers Clang, GCC and MSVC, putting it into a `COMPILER_VERSION` define you can print out or display elsewhere:

```d
// Common macro to stringify a number
#define STR_HELPER(x) #x
#define STR(x) STR_HELPER(x)

#if defined(__clang__)
	#define COMPILER_VERSION "Clang " STR(__clang_major__) "." STR(__clang_minor__), 5
#elif defined(__GNUC__)
	#define COMPILER_VERSION "GCC " STR(__GNUC__) "." STR(__GNUC_MINOR__)
#elif defined(_MSC_VER)
	#define COMPILER_VERSION "MSVC " STR(_MSC_VER / 100) "." STR(_MSC_VER % 100)
#else
	#define COMPILER_VERSION "Unknown compiler"
#endif
```

The order is important as Clang also defines `__GNUC__` for compatibility, and `clang-cl` (Clang running in MSVC compatibility mode) defines both `__clang__` and `_MSC_VER`.
