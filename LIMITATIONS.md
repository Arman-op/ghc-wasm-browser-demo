# Current Limitations

## Browser Execution

Generated wasm modules depend on WASI.

Browsers do not currently expose WASI Preview1 directly.

## Runtime Dependency

Official execution relies on:

- node:wasi
- wasm-run.mjs

## GitHub Pages

Static GitHub Pages deployment is not sufficient by itself.

A browser-side WASI runtime would be required.

## Future xeus-haskell Integration

Potential approaches:

- Browser WASI polyfill
- Wasmer JS runtime
- Wasmtime Web integration
- Custom JSFFI browser bridge