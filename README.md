# GHC/Wasm Browser Demo

## Goal

Evaluate whether the current GHC/Wasm toolchain
can be used to build browser-based Haskell
applications.

## Result

- Haskell → WASM compilation works
- WASM execution works using wasm-run
- Browser deployment works
- Browser execution requires WASI support

## Repository Structure

index.html
main.js
style.css
browser.wasm
REPORT.md
LIMITATIONS.md
progress.md

## GitHub Pages

https://arman-op.github.io/ghc-wasm-browser-demo/

## Example

Hello from Browser GHC-Wasm!

## Conclusion

The toolchain is functional but browser execution
requires a WASI runtime layer before it can be
integrated into xeus-haskell.
