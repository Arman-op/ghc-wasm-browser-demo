import {
  WASI,
  ConsoleStdout
} from "./wasi-shim/index.js";

const runBtn = document.getElementById("runBtn");
const output = document.getElementById("output");

runBtn.addEventListener("click", async () => {
    output.textContent = "Loading browser.wasm...\n";

    try {
        let capturedOutput = "";

        const wasi = new WASI(
            ["browser.wasm"],
            [],
            [
                null,
                ConsoleStdout.lineBuffered(msg => {
                    capturedOutput += msg + "\n";
                    output.textContent = capturedOutput;
                }),
                ConsoleStdout.lineBuffered(msg => {
                    capturedOutput += "[stderr] " + msg + "\n";
                    output.textContent = capturedOutput;
                })
            ]
        );

        const wasm = await WebAssembly.compileStreaming(
            fetch("./browser.wasm")
        );

        const instance = await WebAssembly.instantiate(
            wasm,
            {
                wasi_snapshot_preview1: wasi.wasiImport
            }
        );

        wasi.start(instance);

    } catch (err) {
        output.textContent =
            "Runtime Error:\n" + err;
    }
});