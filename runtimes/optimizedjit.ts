import { execRecord } from "../src";

export const BFOptimizedWASMJIT = async (source: string) => {
    const start = performance.now();
    const exr = await execRecord(source)

    let stdout = "";

    const sn = performance.now();
    const instance = await WebAssembly.instantiate(exr[0], {
        js: {
            stdout(t: number){ stdout += String.fromCharCode(t) },
            stdin(){ return 0 }
        }
    })
    const en = performance.now();

    const rs = performance.now(); //@ts-ignore
    instance.instance.exports.run()
    const re = performance.now()

    const end = performance.now();

    console.log(`parse: ${exr[1]}`)
    console.log(`bundle: ${exr[2]}`)
    console.log(`optimize: ${exr[3]}`)
    console.log(`watgen: ${exr[4]}`)
    console.log(`wasmgen: ${exr[5]}`)
    console.log(`wasmload: ${en-sn}`)
    console.log(`run: ${re-rs}`)
    console.log(`total: ${end-start}`)
    return stdout;
}
