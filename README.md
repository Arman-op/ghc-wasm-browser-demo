# GHC/Wasm Browser Prototype Evaluation

## Overview

This repository contains a small proof-of-concept project created to evaluate the practicality of using the current GHC/WebAssembly (GHC/Wasm) toolchain for browser-based Haskell applications.

The project was developed as part of my Google Summer of Code (GSoC) work related to **xeus-haskell**, where I am exploring technologies that could eventually enable Haskell execution inside browser-based notebook environments such as JupyterLite.

The objective was not to modify the GHC/Wasm toolchain, but to use it as an end user and assess how easily a browser application can be built and deployed using the existing tooling.

---

## Objectives

* Install and configure the GHC/Wasm toolchain.
* Compile a simple Haskell program to WebAssembly.
* Verify execution of the generated module.
* Deploy a browser-based prototype using GitHub Pages.
* Document limitations, challenges, and observations.
* Evaluate implications for future xeus-haskell integration.

---

## Environment

| Component        | Version                   |
| ---------------- | ------------------------- |
| Operating System | Ubuntu 24.04.4 LTS (WSL2) |
| GHC/Wasm         | GHC 9.14.1                |
| Runtime          | Node.js                   |
| Deployment       | GitHub Pages              |

---

## Project Structure

```text
.
├── browser.wasm
├── index.html
├── main.js
├── style.css
├── README.md
├── REPORT.md
├── LIMITATIONS.md
└── progress.md
```

---

## Haskell Program

The following test program was used:

```haskell
main :: IO ()
main = putStrLn "Hello from Browser GHC-Wasm!"
```

Compilation:

```bash
wasm32-wasi-ghc BrowserMain.hs -o browser.wasm
```

---

## Results

### Successful

* Installed and configured the GHC/Wasm toolchain.
* Compiled Haskell source code to WebAssembly.
* Generated a valid `.wasm` module.
* Successfully executed the module using the official runtime.
* Deployed a browser-facing prototype using GitHub Pages.
* Investigated runtime dependencies of the generated module.

### Runtime Verification

Execution was verified using:

```bash
node ~/.ghc-wasm/wasm-run/bin/wasm-run.mjs browser.wasm
```

Output:

```text
Hello from Browser GHC-Wasm!
```

---

## Browser Investigation

The generated WebAssembly module imports the WASI Preview1 interface:

```text
wasi_snapshot_preview1
```

Examples include:

* args_get
* environ_get
* fd_read
* fd_write
* path_open
* proc_exit

These imports are provided by the official runtime but are not available directly in modern browsers.

As a result:

* Execution through `wasm-run` works correctly.
* Direct execution inside a standard browser environment is not currently possible without additional runtime support.

---

## Key Finding

The GHC/Wasm toolchain successfully produces runnable WebAssembly modules.

However, the generated modules currently depend on WASI Preview1 APIs. Since browsers do not provide these interfaces natively, a browser-side WASI implementation or compatibility layer would be required for seamless execution.

This is the primary obstacle to running GHC-generated WebAssembly directly inside browser-based notebook environments.

---

## Relevance to xeus-haskell

This evaluation provides useful information for future xeus-haskell development.

Potential requirements for browser-based notebook execution include:

* Browser-side WASI runtime support.
* Standard input/output redirection.
* Virtual filesystem support.
* Runtime lifecycle management.
* Packaging of runtime assets for browser delivery.
* Integration between notebook cells and WebAssembly execution.

---

## Repository

GitHub Repository:

https://github.com/Arman-op/ghc-wasm-browser-demo

GitHub Pages Deployment:

https://arman-op.github.io/ghc-wasm-browser-demo/

---

## Additional Documentation

* **REPORT.md** – Detailed technical evaluation.
* **LIMITATIONS.md** – Identified limitations and challenges.
* **progress.md** – Development progress and observations.

---

## Conclusion

The current GHC/Wasm toolchain is capable of compiling and executing Haskell applications as WebAssembly modules using the provided runtime environment.

The main limitation identified during this evaluation is browser execution, where generated modules depend on the WASI Preview1 interface. While this does not prevent WebAssembly generation or execution, additional runtime infrastructure will be required before browser-native Haskell execution becomes practical for projects such as xeus-haskell.
