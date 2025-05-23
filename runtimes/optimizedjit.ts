import { execRecord } from "../src";

export const BFOptimizedWASMJIT = async (source: string) => {
    const exr = await execRecord(source)

    console.log(`parse: ${exr[1]}`)
    console.log(`bundle: ${exr[2]}`)
    console.log(`optimize: ${exr[3]}`)
    console.log(`watgen: ${exr[4]}`)
    console.log(`wasmgen: ${exr[5]}`)

    let stdout = "";

    console.time("wasm init");
    const instance = await WebAssembly.instantiate(exr[0], {
        js: {
            stdout(t: number){ console.log(t); stdout += String.fromCharCode(t) },
            stdin(){ return 0 }
        }
    })
    console.timeEnd("wasm init")
    console.time("run")
    //@ts-ignore
    instance.instance.exports.run()

    console.timeEnd("run")
    return stdout;
}
