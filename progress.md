# GHC/Wasm Browser Evaluation

## Completed

* Installed and configured the GHC/Wasm toolchain
* Compiled Haskell source code to WebAssembly
* Executed generated WebAssembly using the official `wasm-run` runtime
* Verified generated modules depend on WASI Preview1 imports
* Investigated runtime requirements of GHC-generated WebAssembly
* Integrated a browser-side WASI compatibility layer (`browser_wasi_shim`)
* Successfully loaded and instantiated `browser.wasm` in the browser
* Executed a GHC-generated WebAssembly module directly in Google Chrome
* Captured and displayed Haskell program output on a webpage
* Deployed the prototype using GitHub Pages
* Documented setup process, findings, limitations, and implications for xeus-haskell

## Findings

* Generated modules import `wasi_snapshot_preview1`
* Browser execution requires a WASI compatibility layer
* `browser_wasi_shim` successfully provides the required WASI imports
* The same WebAssembly module can run in both Node.js and browser environments
* GitHub Pages deployment works without modification to the GHC/Wasm toolchain
* Browser execution of GHC-generated WebAssembly is technically feasible today

## Outcome

The browser prototype successfully:

* Loads `browser.wasm`
* Provides browser-side WASI imports
* Executes the generated GHC/Wasm module
* Displays Haskell stdout on the webpage

Example output:

```text
Hello from Browser GHC-Wasm!
```

## Next Steps

* Investigate notebook-style execution workflows
* Explore browser filesystem support requirements
* Evaluate runtime lifecycle management for interactive sessions
* Assess integration requirements for xeus-haskell and JupyterLite
* Explore support for dynamic code execution beyond precompiled programs
