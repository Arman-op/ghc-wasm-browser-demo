# Limitations and Observations

## Overview

During evaluation of the GHC/Wasm toolchain, several practical limitations were identified when attempting to deploy and execute generated WebAssembly modules inside a browser environment.

---

## 1. Browser Runtime Dependency

The generated WebAssembly binaries depend on:

```text
wasi_snapshot_preview1
```

This API is available in WASI runtimes but is not provided directly by modern browsers.

Impact:

* Works with wasm-run.
* Does not execute directly in GitHub Pages.
* Requires additional runtime support.

---

## 2. Missing Browser Integration Layer

The generated module does not automatically expose browser-friendly JavaScript interfaces.

Additional work is required to:

* Instantiate modules.
* Handle imports.
* Manage execution lifecycle.
* Capture program output.

---

## 3. Filesystem Assumptions

Generated applications assume availability of WASI filesystem operations.

Examples:

* path_open
* fd_read
* fd_write

Browsers do not provide a traditional filesystem.

A virtual filesystem layer would be required.

---

## 4. Standard Input and Output Handling

Console output works correctly through wasm-run.

Browser execution would require:

* stdout redirection
* stderr redirection
* optional stdin support

before notebook-style execution becomes practical.

---

## 5. Runtime Asset Packaging

The generated WebAssembly module alone is insufficient for browser execution.

Additional assets may be required:

* WASI runtime support
* JavaScript bootstrap code
* runtime configuration

Deployment pipelines must account for these dependencies.

---

## 6. Limited Documentation for Browser Deployment

Although compilation workflows are well documented, browser deployment examples remain limited.

Developers may need to perform additional experimentation to identify appropriate runtime adapters.

---

## 7. Notebook Integration Challenges

For future xeus-haskell integration, the following challenges remain:

* Cell execution management
* Output capture
* Error handling
* Filesystem virtualization
* Runtime persistence
* Resource management

These challenges are solvable but require infrastructure beyond simple compilation.

---

## Summary

The GHC/Wasm toolchain successfully compiles and executes Haskell applications through supported runtimes.

The primary obstacle is browser execution, where generated modules depend on WASI functionality that browsers do not provide natively.

A browser-side WASI runtime or compatibility layer will likely be necessary before seamless web-based execution becomes possible.
