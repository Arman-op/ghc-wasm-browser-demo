# GHC/Wasm Browser Prototype Evaluation

## Overview

This repository contains a proof-of-concept project created to evaluate the practicality of using the current GHC/WebAssembly (GHC/Wasm) toolchain for browser-based Haskell applications.

The project was developed as part of Google Summer of Code (GSoC) work related to **xeus-haskell**, exploring technologies that could eventually enable Haskell execution inside browser-based notebook environments such as JupyterLite.

The objective was not to modify the GHC/Wasm toolchain, but to use it as an end user and evaluate the complete workflow from compilation to browser deployment.

---

## Objectives

* Install and configure the GHC/Wasm toolchain.
* Compile a simple Haskell program to WebAssembly.
* Verify execution using the official runtime.
* Execute the generated module directly inside a browser.
* Deploy a browser-based prototype using GitHub Pages.
* Document limitations, challenges, and observations.
* Evaluate implications for future xeus-haskell integration.

---

## Environment

| Component        | Version                   |
| ---------------- | ------------------------- |
| Operating System | Ubuntu 24.04.4 LTS (WSL2) |
| GHC/Wasm         | GHC 9.14.1                |
| Runtime          | Node.js + Browser WASI    |
| Browser          | Google Chrome             |
| Deployment       | GitHub Pages              |

---

## Project Structure

```text
.
├── browser.wasm
├── index.html
├── main.js
├── style.css
├── wasi-shim/
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
* Executed the module using the official `wasm-run` runtime.
* Inspected WASI imports required by the generated module.
* Integrated a browser-side WASI implementation.
* Executed the same GHC-generated WebAssembly module directly in the browser.
* Captured and displayed Haskell stdout on a webpage.
* Successfully deployed the application using GitHub Pages.

---

## Runtime Verification

### Node.js Runtime

Execution was verified using:

```bash
node ~/.ghc-wasm/wasm-run/bin/wasm-run.mjs browser.wasm
```

Output:

```text
Hello from Browser GHC-Wasm!
```

### Browser Runtime

The same module was executed directly in Google Chrome using a browser-side WASI implementation.

Output:

```text
Hello from Browser GHC-Wasm!
```

---

## Browser Execution

Inspection of the generated WebAssembly module showed that it imports the WASI Preview1 interface:

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

Since browsers do not provide WASI natively, a browser-side compatibility layer was integrated using:

```text
@bjorn3/browser_wasi_shim
```

This shim provides the required WASI imports and allows GHC-generated WebAssembly modules to execute directly inside the browser.

---

## Execution Flow

```text
Haskell Source
      │
      ▼
wasm32-wasi-ghc
      │
      ▼
browser.wasm
      │
      ▼
Browser WASI Shim
(@bjorn3/browser_wasi_shim)
      │
      ▼
WebAssembly Runtime
      │
      ▼
Browser Output
```

---

## Key Findings

* The GHC/Wasm toolchain successfully produces runnable WebAssembly modules.
* Generated modules depend on the WASI Preview1 API.
* Browser execution is achievable using a WASI compatibility layer.
* No modifications to the GHC/Wasm toolchain were required.
* GitHub Pages deployment works successfully for browser-hosted GHC/Wasm applications.

---

## Relevance to xeus-haskell

This evaluation provides useful information for future xeus-haskell development.

Potential requirements for browser-based notebook execution include:

* Browser-side WASI runtime support.
* Standard input/output redirection.
* Virtual filesystem support.
* Runtime lifecycle management.
* Packaging and delivery of runtime assets.
* Integration between notebook cells and WebAssembly execution.
* Support for dynamic code execution.

---

## Repository

GitHub Repository:

https://github.com/Arman-op/ghc-wasm-browser-demo

GitHub Pages Deployment:

https://arman-op.github.io/ghc-wasm-browser-demo/

---

## Additional Documentation

* **REPORT.md** — Detailed technical evaluation.
* **LIMITATIONS.md** — Identified limitations and challenges.
* **progress.md** — Development progress and observations.

---

## Conclusion

The current GHC/Wasm toolchain successfully supports:

* Haskell → WebAssembly compilation
* Execution using the official Node.js runtime
* Execution inside modern browsers using a WASI compatibility layer
* Deployment through GitHub Pages

This prototype demonstrates that browser-based execution of GHC-generated WebAssembly is technically feasible today. While additional infrastructure will be required for notebook-style environments such as xeus-haskell and JupyterLite, the underlying toolchain is sufficiently mature for experimentation and future integration work.
