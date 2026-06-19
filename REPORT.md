# Technical Report: GHC/Wasm Browser Prototype

## Objective

The goal of this project was to evaluate the practicality of the current GHC/Wasm toolchain for building and deploying a browser-based Haskell application from scratch.

The project intentionally avoided modifying the GHC/Wasm toolchain itself and instead used the tooling as an end user would.

---

## Environment

* Operating System: Ubuntu 24.04.4 LTS (WSL2)
* GHC/Wasm Toolchain: GHC 9.14.1 (wasm32-wasi target)
* Node.js Runtime
* Browser-side WASI Runtime (`@bjorn3/browser_wasi_shim`)
* GitHub Pages for deployment
* Browser Testing: Google Chrome

---

## Project Overview

A minimal browser-based prototype was created to evaluate the current GHC/Wasm workflow.

The prototype consists of:

* Haskell source code compiled to WebAssembly
* HTML frontend
* JavaScript integration layer
* Browser-side WASI compatibility layer
* GitHub Pages deployment
* Documentation of findings and limitations

Repository Structure:

```text
index.html
main.js
style.css
browser.wasm
wasi-shim/
progress.md
REPORT.md
LIMITATIONS.md
```

---

## Development Process

### 1. Toolchain Installation

The GHC/Wasm toolchain was installed and configured successfully.

Verification:

```bash
source ~/.ghc-wasm/env
wasm32-wasi-ghc --version
```

Result:

```text
The Glorious Glasgow Haskell Compilation System,
version 9.14.1
```

---

### 2. Compiling Haskell to WebAssembly

Test program:

```haskell
main :: IO ()
main = putStrLn "Hello from Browser GHC-Wasm!"
```

Compilation:

```bash
wasm32-wasi-ghc BrowserMain.hs -o browser.wasm
```

Result:

* Compilation completed successfully.
* Generated WebAssembly binary size: ~1.6 MB.

---

### 3. Runtime Validation (Node.js)

The generated WebAssembly module was executed using the official runtime.

Command:

```bash
node ~/.ghc-wasm/wasm-run/bin/wasm-run.mjs browser.wasm
```

Output:

```text
Hello from Browser GHC-Wasm!
```

Result:

The generated module executed correctly and produced the expected output.

---

### 4. Browser Deployment

The application was deployed using GitHub Pages.

Repository:

https://github.com/Arman-op/ghc-wasm-browser-demo

Deployment URL:

https://arman-op.github.io/ghc-wasm-browser-demo/

The frontend successfully loads and serves project assets through GitHub Pages.

---

## Investigation of Browser Execution

The generated WebAssembly module was inspected to determine runtime requirements.

Inspection:

```bash
node -e "
const fs=require('fs');
const wasm=fs.readFileSync('browser.wasm');
WebAssembly.compile(wasm).then(m=>{
console.log(WebAssembly.Module.imports(m));
});
"
```

Observed imports:

```text
wasi_snapshot_preview1
```

Including:

* args_get
* args_sizes_get
* environ_get
* environ_sizes_get
* clock_time_get
* fd_read
* fd_write
* path_open
* proc_exit

and additional WASI Preview1 APIs.

---

## Browser Execution Prototype

The generated WebAssembly module depends on WASI Preview1 imports, which are not provided natively by modern browsers.

To enable browser execution, a browser-side WASI compatibility layer was integrated using:

```text
@bjorn3/browser_wasi_shim
```

### Browser Execution Flow

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
browser_wasi_shim
      │
      ▼
WebAssembly.instantiate()
      │
      ▼
Haskell Program Execution
      │
      ▼
Browser Output
```

### Browser Runtime Process

1. `browser.wasm` is fetched using the browser Fetch API.
2. Required WASI imports are provided through `browser_wasi_shim`.
3. The WebAssembly module is instantiated.
4. The Haskell program executes inside the browser.
5. Standard output is captured and displayed on the webpage.

### Result

The generated GHC/Wasm module executed successfully inside Google Chrome.

Observed output:

```text
Hello from Browser GHC-Wasm!
```

This demonstrates that GHC-generated WebAssembly modules can execute directly in modern browsers when provided with a suitable WASI compatibility layer.

---

## Findings

### What Worked

✓ Installation of GHC/Wasm toolchain

✓ Compilation of Haskell source code to WebAssembly

✓ Execution through the official `wasm-run` runtime

✓ Inspection and analysis of generated WebAssembly binaries

✓ Browser-side WASI integration using `browser_wasi_shim`

✓ Direct execution of GHC-generated WebAssembly inside the browser

✓ Display of Haskell stdout on a webpage

✓ Deployment and execution through GitHub Pages

---

### Challenges Encountered

* Initial toolchain installation was affected by environment configuration issues.
* The generated module depended on WASI Preview1 imports unavailable in browsers.
* GitHub Pages deployment required bundling all browser WASI runtime assets.
* Browser execution required investigation of WebAssembly imports and runtime dependencies.
* Additional debugging was necessary to correctly package and deploy the WASI shim.

---

## Implications for xeus-haskell

The evaluation indicates that the current GHC/Wasm toolchain is capable of generating browser-executable WebAssembly modules.

Potential requirements for future xeus-haskell integration include:

1. Browser-side WASI implementation.
2. Standard input/output redirection.
3. Virtual filesystem support.
4. Runtime lifecycle management.
5. Packaging and delivery of runtime assets.
6. Integration between notebook cells and WebAssembly execution.
7. Support for dynamic code execution and interactive evaluation.

---

## Conclusion

The GHC/Wasm toolchain successfully supports:

* Haskell → WebAssembly compilation
* Execution through the official Node.js runtime
* Execution inside modern browsers using a WASI compatibility layer
* Deployment through GitHub Pages

This prototype demonstrates that browser-based execution of GHC-generated WebAssembly is technically feasible today.

While additional infrastructure will be required for notebook-style environments such as xeus-haskell and JupyterLite, the underlying toolchain is sufficiently mature for experimentation and future integration work.
