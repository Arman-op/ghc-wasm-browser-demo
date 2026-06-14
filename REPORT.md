# Technical Report: GHC/Wasm Browser Prototype

## Objective

The goal of this project was to evaluate the practicality of the current GHC/Wasm toolchain for building and deploying a browser-based Haskell application from scratch.

The project intentionally avoided modifying the GHC/Wasm toolchain itself and instead used the tooling as an end user would.

---

## Environment

* Operating System: Ubuntu 24.04.4 LTS (WSL2)
* GHC/Wasm Toolchain: GHC 9.14.1 (wasm32-wasi target)
* Node.js Runtime
* GitHub Pages for deployment
* Browser Testing: Google Chrome

---

## Project Overview

A minimal browser-based prototype was created to evaluate the current workflow.

The prototype consists of:

* Haskell source code compiled to WebAssembly
* HTML frontend
* JavaScript integration layer
* GitHub Pages deployment
* Documentation of findings and limitations

Repository Structure:

```text
index.html
main.js
style.css
browser.wasm
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

### 3. Runtime Validation

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

## Findings

### What Worked

✓ Installation of GHC/Wasm toolchain

✓ Compilation of Haskell source code to WebAssembly

✓ Execution through the official wasm-run runtime

✓ Deployment through GitHub Pages

✓ Inspection and analysis of generated WebAssembly binaries

✓ Documentation of browser runtime requirements

---

### What Did Not Work

Direct execution inside a standard browser environment was not achieved.

The generated module depends on the WASI Preview1 API:

```text
wasi_snapshot_preview1
```

Current browsers do not expose these interfaces natively.

As a result:

* The WebAssembly binary can execute using wasm-run.
* The same binary cannot execute directly inside GitHub Pages without additional runtime support.

---

## Implications for xeus-haskell

The evaluation indicates that the toolchain is functional and capable of generating valid WebAssembly output.

However, browser execution currently requires a compatibility layer.

Potential requirements for future xeus-haskell integration:

1. Browser-side WASI implementation.
2. Standard input/output redirection.
3. Virtual filesystem support.
4. Runtime lifecycle management.
5. Packaging and delivery of runtime assets.
6. Integration between notebook cells and WebAssembly execution.

---

## Conclusion

The GHC/Wasm toolchain successfully supports:

* Haskell → WebAssembly compilation
* WebAssembly execution through the official runtime
* Deployment of browser-facing applications

The primary limitation is browser-side execution because generated modules currently depend on the WASI Preview1 interface.

Overall, the toolchain appears mature enough for experimentation and future notebook integration work, but additional runtime infrastructure will be required before seamless browser-based execution can be achieved.
