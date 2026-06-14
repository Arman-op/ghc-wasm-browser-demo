# GHC/Wasm Browser Evaluation

## Objective

Evaluate whether the current GHC/Wasm toolchain can be used by an end user to build and deploy a browser application.

## Environment

- Ubuntu 24.04 (WSL)
- GHC/Wasm 9.14.1
- Node.js runtime
- GitHub Pages target

## Results

### Successful

- Installed GHC/Wasm toolchain
- Compiled Haskell source to WebAssembly
- Executed generated WebAssembly through wasm-run
- Verified generated wasm contains Haskell runtime

### Browser Investigation

Generated modules import:

- wasi_snapshot_preview1

The supplied wasm-run implementation depends on:

- node:wasi

Therefore generated modules currently require a WASI runtime.

### Conclusion

The toolchain successfully produces runnable WebAssembly modules.

However, direct browser deployment requires an additional WASI compatibility layer.